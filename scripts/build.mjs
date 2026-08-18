// ------------------------------
// build — the optional optimised distribution
// ------------------------------
// The library has no build step and that is not changing: `Library/` is the
// source, it is what ships, and it is what runs. This script does not replace
// it. It adds a second, OPTIONAL way to consume the same code, for the one
// audience the plain source is not ideal for.
//
// Who needs it, and who does not:
//
//   App with a bundler (Vite, webpack, Rollup, Parcel)
//       Import the SOURCE. Their bundler already minifies, and it can tree-shake
//       across the whole app in ways a pre-bundled file cannot. Handing it
//       dist/ would be strictly worse: minified input, coarser granularity, and
//       a second pass over code that was already optimised.
//
//   Page with no build step at all — the library's own headline case
//       Wants bytes and round trips down. Measured on a thirteen-tag landing
//       page, the source is 37 modules and 39kB brotli; this build makes it one
//       file and 23kB. That is the whole reason this script exists.
//
// Outputs, all ES modules:
//
//   dist/platform.js        every component, one file, one request
//   dist/pl-<tag>.js        one component, sharing chunks with its siblings
//   dist/chunk-*.js         the shared core those per-component files import
//   dist/tokens.css         minified
//   dist/global.css         minified
//
// Usage:
//   npm run build
//   npm run build -- --report     size table only, nothing written
//
// esbuild is a devDependency of THIS repo only — the zero-dependency promise
// covers what CONSUMERS install (`Library/` has none), not what maintainers
// need to produce dist/. ESBUILD, if set, still overrides it, and the bare
// specifier is tried as a last resort — useful for a global install or a
// CI image that provides its own — but the ordinary path is just
// `npm install` once and `npm run build` from then on.

import { mkdir, rm, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIB = join(ROOT, 'Library');
const DIST = join(ROOT, 'dist');

const reportOnly = process.argv.includes('--report');

/** First importable candidate wins — same shape as the test suite's loadJSDOM. */
async function loadEsbuild() {
    const candidates = [
        process.env.ESBUILD,
        join(ROOT, 'node_modules/esbuild/lib/main.js'),
        'esbuild',
    ].filter(Boolean);

    const failures = [];
    for (const specifier of candidates) {
        try {
            return await import(specifier);
        } catch (error) {
            failures.push(`${specifier}: ${error.message.split('\n')[0]}`);
        }
    }

    console.error(
        '\nesbuild not found. It is a devDependency — run `npm install` once, or\n' +
        'point at a copy you already have:\n\n' +
        '  npm install\n' +
        '  ESBUILD=/path/to/node_modules/esbuild/lib/main.js npm run build\n\n' +
        failures.map(f => `  tried ${f}`).join('\n') + '\n',
    );
    process.exit(1);
}

/**
 * Every component's index.mjs, keyed by tag name.
 *
 * A record rather than an array: every entry file is called index.mjs, so
 * esbuild would derive the same output name for all of them and refuse. The key
 * IS the output name, which also makes the file a consumer downloads match the
 * specifier they wrote.
 */
async function componentEntries() {
    const found = {};
    await (async function walk(dir) {
        for (const name of await readdir(dir)) {
            const path = join(dir, name);
            if ((await stat(path)).isDirectory()) await walk(path);
            else if (name === 'index.mjs') found[dir.split('/').at(-1)] = path;
        }
    })(join(LIB, 'components'));
    return Object.fromEntries(Object.entries(found).sort());
}

const gz = buf => gzipSync(buf, { level: 9 }).length;
const br = buf => brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
const kb = n => (n / 1024).toFixed(1).padStart(7) + ' kB';

const esbuild = await loadEsbuild();
const entries = await componentEntries();

// Start from empty. esbuild only ever WRITES, so a component that has been
// deleted keeps its old output file, and `files: ["dist"]` would publish it —
// a tag that no longer exists in the library, still importable from /min, still
// registering itself. Content-hashed chunks have the same problem in slower
// motion: every build leaves the previous one's chunks behind.
if (!reportOnly) await rm(DIST, { recursive: true, force: true });

// ------------------------------
// Bundle
// ------------------------------
// Two shapes, because they answer different questions.
//
// platform.js is "I want the library": one request, no chunk graph, simplest
// possible <script type="module">.
//
// The per-component build is "I want four of these": splitting: true makes the
// shared core a chunk they all import, so four components cost the core ONCE
// rather than four times. Without splitting each file would inline its own copy
// of BaseElement and the element spec, and four components would cost more than
// the whole library.

const shared = {
    bundle: true,
    format: 'esm',
    target: 'es2022',
    minify: true,
    legalComments: 'none',
    write: !reportOnly,
    logLevel: 'error',
};

const whole = await esbuild.build({
    ...shared,
    entryPoints: [join(LIB, 'index.mjs')],
    outfile: join(DIST, 'platform.js'),
    metafile: true,
});

const split = await esbuild.build({
    ...shared,
    entryPoints: entries,
    outdir: DIST,
    splitting: true,
    chunkNames: 'chunk-[hash]',
    metafile: true,
});

// ------------------------------
// CSS
// ------------------------------
for (const name of ['tokens.css', 'global.css']) {
    const source = join(LIB, '_core/styles', name);
    if (!existsSync(source)) continue;
    await esbuild.build({
        entryPoints: [source],
        outfile: join(DIST, name),
        minify: true,
        // global.css @imports tokens.css; bundling makes the starter one request
        // instead of two chained ones (an @import cannot start until its parent
        // has been parsed, so the second file is a full round trip late).
        bundle: name === 'global.css',
        write: !reportOnly,
        logLevel: 'error',
    });
}

// ------------------------------
// Report
// ------------------------------
// Printed every run, because a build whose value nobody measures is a build
// nobody can justify keeping.

async function sourceCost(entry, seen = new Set()) {
    await (async function walk(file) {
        if (seen.has(file)) return;
        seen.add(file);
        const src = await readFile(file, 'utf8');
        for (const m of src.matchAll(/from\s+['"](\.[^'"]+)['"]|import\s+['"](\.[^'"]+)['"]/g)) {
            const next = join(dirname(file), m[1] ?? m[2]);
            if (existsSync(next)) await walk(next);
        }
    })(entry);
    const buf = Buffer.concat(await Promise.all([...seen].map(f => readFile(f))));
    return { files: seen.size, brotli: br(buf) };
}

/**
 * What a consumer actually downloads for a set of entry points: the entry files
 * PLUS every chunk they import, transitively.
 *
 * Counting the entry alone would be a lie. Splitting makes pl-button.js under a
 * kilobyte by moving the shared core into a chunk — a chunk the browser still
 * has to fetch. The honest figure is the closure, which is also the figure that
 * shows why the second component is nearly free.
 */
function bundledCost(meta, outputs) {
    const seen = new Set();
    const walk = path => {
        if (seen.has(path)) return;
        seen.add(path);
        for (const imported of meta.outputs[path]?.imports ?? []) {
            if (imported.kind === 'import-statement') walk(imported.path);
        }
    };
    for (const out of outputs) walk(out);
    return seen;
}

const outPath = tag => `dist/${tag}.js`;

async function brotliOf(paths) {
    const bufs = await Promise.all([...paths].map(p => readFile(join(ROOT, p))));
    return { files: paths.size ?? paths.length, brotli: br(Buffer.concat(bufs)) };
}

console.log(`\n${reportOnly ? 'Report only — nothing written.' : `Wrote ${relative(ROOT, DIST)}/`}\n`);
console.log('                                     source              bundled');
console.log('                               files   brotli    files   brotli   saving');
console.log('-'.repeat(68));

const PAGE = ['pl-marketing-page', 'pl-header', 'pl-footer', 'pl-hero', 'pl-social-proof',
              'pl-benefits', 'pl-features', 'pl-testimonials', 'pl-faqs', 'pl-cta',
              'pl-button-link', 'pl-icon', 'pl-avatar'];

const rows = [
    ['one component (pl-button)', ['pl-button']],
    ['two components', ['pl-button', 'pl-input']],
    ['a landing page (13 tags)', PAGE],
];

// The whole library is the single-file build, not the split one.
{
    const src = await sourceCost(join(LIB, 'index.mjs'));
    const buf = await readFile(join(DIST, 'platform.js'));
    const after = br(buf);
    console.log('whole library'.padEnd(25) + String(src.files).padStart(7) + kb(src.brotli) +
        String(1).padStart(9) + kb(after) + `   ${Math.round((1 - after / src.brotli) * 100)}%`.padStart(8));
}

for (const [label, tags] of rows) {
    const srcSeen = new Set();
    let srcFiles = 0;
    const bufs = [];
    for (const tag of tags) {
        const entry = entries[tag];
        if (!entry) continue;
        const cost = await sourceCost(entry, srcSeen);
        srcFiles = srcSeen.size;
    }
    const srcBuf = Buffer.concat(await Promise.all([...srcSeen].map(f => readFile(f))));

    const closure = bundledCost(split.metafile, tags.map(outPath).filter(p => split.metafile.outputs[p]));
    const built = await brotliOf(closure);

    console.log(label.padEnd(25) + String(srcFiles).padStart(7) + kb(br(srcBuf)) +
        String(closure.size).padStart(9) + kb(built.brotli) +
        `   ${Math.round((1 - built.brotli / br(srcBuf)) * 100)}%`.padStart(8));
}

console.log('\nbrotli, because that is what a CDN actually sends. "files" for the bundled');
console.log('column counts the entry AND every chunk it pulls in, which is why the second');
console.log('component costs so little: it shares the first one\'s core.\n');
