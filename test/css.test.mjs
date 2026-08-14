// ------------------------------
// Tests — CSS integrity
// ------------------------------
// CSS comments do NOT nest. An inner "/*" inside a block comment closes it
// early, and everything after is parsed as garbage — silently. That has now
// bitten this project twice: once in section.mjs (which stopped the whole token
// file applying) and once in the tokens bridge (which made every --pl-* alias
// undefined while the page still looked fine).
//
// Both times the symptom was invisible in review and only showed up by
// measuring computed styles in a browser. These tests catch it at the source.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'Library');

/** Every .css file plus every .mjs that carries a CSS template literal. */
async function styleFiles() {
    const found = [];
    async function walk(dir) {
        for (const entry of await readdir(dir, { withFileTypes: true })) {
            const path = join(dir, entry.name);
            if (entry.isDirectory()) await walk(path);
            else if (/\.(css|mjs)$/.test(entry.name)) found.push(path);
        }
    }
    await walk(LIB);
    return found;
}

/**
 * Scan the CSS regions of a file for a "/*" opened while already inside a
 * comment. For .css the whole file is CSS; for .mjs only the /*css*​/ template
 * literals are, so JS line comments are skipped.
 */
function findNestedComment(source, isCss) {
    let i = 0, depth = 0;
    while (i < source.length - 1) {
        const two = source.slice(i, i + 2);

        // Skip JS line comments in .mjs — they legitimately contain "/*".
        if (!isCss && depth === 0 && two === '//') {
            const nl = source.indexOf('\n', i);
            i = nl === -1 ? source.length : nl;
            continue;
        }
        if (two === '/*') {
            if (depth > 0) {
                return source.slice(0, i).split('\n').length; // 1-based line
            }
            depth++; i += 2; continue;
        }
        if (two === '*/') { if (depth > 0) depth--; i += 2; continue; }
        i++;
    }
    return null;
}

const files = await styleFiles();

describe('CSS integrity', () => {
    test('no nested block comments in any stylesheet', async () => {
        const offenders = [];
        for (const file of files) {
            const source = await readFile(file, 'utf8');
            const line = findNestedComment(source, file.endsWith('.css'));
            if (line) offenders.push(`${file.replace(ROOT + '/', '')}:${line}`);
        }
        assert.deepEqual(offenders, [], `nested /* */ closes the comment early:\n  ${offenders.join('\n  ')}`);
    });

    test('every --pl-* alias a component reads is declared in tokens.css', async () => {
        const tokens = await readFile(join(LIB, '_core/styles/tokens.css'), 'utf8');

        // Declarations survive only if the bridge block actually parses, so an
        // early-closed comment shows up here as a pile of missing aliases.
        const declared = new Set([...tokens.matchAll(/^\s*(--pl-[\w-]+)\s*:/gm)].map(m => m[1]));

        const used = new Set();
        for (const file of files) {
            if (file.endsWith('tokens.css')) continue;
            const source = await readFile(file, 'utf8');
            for (const m of source.matchAll(/var\(\s*(--pl-[\w-]+)/g)) used.add(m[1]);
        }

        const missing = [...used].filter(name => !declared.has(name)).sort();
        assert.deepEqual(missing, [], `components read --pl-* aliases tokens.css never declares:\n  ${missing.join('\n  ')}`);
    });

    test('components never read a bare contract token directly', async () => {
        // Components must go through the --pl-* bridge, so an app can pin the
        // alias and keep its own --color-*/--size-* to itself.
        const CONTRACT = /var\(\s*--(?!pl-)(color|size|font-family|font-size|font-weight|line-height|letter-spacing|border-radius|border-width|box-shadow|opacity)-/;
        const offenders = [];

        for (const file of files) {
            if (file.endsWith('tokens.css')) continue;
            const source = await readFile(file, 'utf8');
            source.split('\n').forEach((line, i) => {
                if (CONTRACT.test(line)) offenders.push(`${file.replace(ROOT + '/', '')}:${i + 1}`);
            });
        }

        assert.deepEqual(offenders, [], `read the --pl-* alias instead:\n  ${offenders.join('\n  ')}`);
    });

    // A stylesheet lives inside a JS template literal, so a stray backtick in a
    // CSS comment — writing `display` rather than "display" — ends the literal
    // early and turns the whole module into a syntax error. The component then
    // fails to import at all, which looks nothing like a CSS problem from the
    // outside: the element simply never upgrades.
    //
    // The nested-comment test above cannot see this, because the file stops
    // being parseable JavaScript rather than producing bad CSS. `node --check`
    // catches it instantly; this runs it over every module so that catching it
    // no longer depends on remembering to.
    test('every Library module parses', async () => {
        const { execFile } = await import('node:child_process');
        const { promisify } = await import('node:util');
        const check = promisify(execFile);

        const modules = files.filter(file => file.endsWith('.mjs'));
        const offenders = [];

        // Batched rather than all at once — one process per file, and there is
        // no reason to ask the OS for sixty of them simultaneously.
        for (let i = 0; i < modules.length; i += 16) {
            await Promise.all(modules.slice(i, i + 16).map(async file => {
                try {
                    await check(process.execPath, ['--check', file]);
                } catch (error) {
                    const message = String(error.stderr).split('\n').find(line => line.includes('Error')) ?? 'failed to parse';
                    offenders.push(`${file.replace(ROOT + '/', '')} — ${message.trim()}`);
                }
            }));
        }

        assert.deepEqual(offenders.sort(), [], `modules that do not parse:\n  ${offenders.join('\n  ')}`);
    });
});
