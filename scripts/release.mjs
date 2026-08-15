// ------------------------------
// release — semver bump + npm publish
// ------------------------------
// The package is still pre-1.0. Until the public API is considered stable,
// stay on 0.y.z:
//
//   patch  0.1.1 → 0.1.2   bug fixes, internal changes
//   minor  0.1.1 → 0.2.0   new components / features (breaking OK in 0.x)
//   major  0.y.z → 1.0.0   blocked unless you pass --confirm-v1
//
// Usage:
//   npm run release -- patch
//   npm run release -- minor
//   npm run release -- major --confirm-v1
//   npm run release -- patch --otp=123456   # required when account 2FA is on
//   npm run release -- patch --dry-run
//   npm run release -- patch --no-publish   # bump only
//
// Does not commit or tag — leave that to the normal git workflow after a
// successful publish. With account 2FA enabled, npm often returns a 404 on
// publish without --otp; pass a fresh authenticator code.

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG_PATH = join(ROOT, 'package.json');

const BUMPS = new Set(['patch', 'minor', 'major']);

function usage(message) {
    if (message) console.error(`Error: ${message}\n`);
    console.error(
        `Usage: npm run release -- <patch|minor|major> [--otp=xxxxxx] [--dry-run] [--no-publish] [--confirm-v1]`,
    );
    process.exit(1);
}

function parseArgs(argv) {
    const flags = new Set();
    let bump = null;
    let otp = null;

    for (const arg of argv) {
        if (arg.startsWith('--otp=')) {
            otp = arg.slice('--otp='.length);
            if (!otp) usage('--otp= requires a code');
            continue;
        }
        if (arg.startsWith('--')) {
            flags.add(arg);
            continue;
        }
        if (bump) usage(`unexpected argument "${arg}"`);
        bump = arg;
    }

    if (!bump || !BUMPS.has(bump)) usage('bump must be patch, minor, or major');

    const unknown = [...flags].filter(
        (f) => !['--dry-run', '--no-publish', '--confirm-v1'].includes(f),
    );
    if (unknown.length) usage(`unknown flag ${unknown[0]}`);

    return {
        bump,
        otp,
        dryRun: flags.has('--dry-run'),
        noPublish: flags.has('--no-publish'),
        confirmV1: flags.has('--confirm-v1'),
    };
}

function bumpVersion(version, bump) {
    const match = /^(\d+)\.(\d+)\.(\d+)(?:-.*)?$/.exec(version);
    if (!match) {
        throw new Error(`package.json version "${version}" is not semver x.y.z`);
    }

    let [major, minor, patch] = match.slice(1).map(Number);

    if (bump === 'major') {
        major += 1;
        minor = 0;
        patch = 0;
    } else if (bump === 'minor') {
        minor += 1;
        patch = 0;
    } else {
        patch += 1;
    }

    return `${major}.${minor}.${patch}`;
}

function writePackage(pkg) {
    // Preserve package.json formatting: two-space indent + trailing newline.
    return writeFile(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`);
}

function run(command, args) {
    console.log(`$ ${command} ${args.join(' ')}`);

    const result = spawnSync(command, args, {
        cwd: ROOT,
        stdio: 'inherit',
        shell: false,
    });

    return result.status ?? 1;
}

const { bump, otp, dryRun, noPublish, confirmV1 } = parseArgs(process.argv.slice(2));

const raw = await readFile(PKG_PATH, 'utf8');
const pkg = JSON.parse(raw);
const previous = pkg.version;
const next = bumpVersion(previous, bump);

if (bump === 'major' && !confirmV1) {
    console.error(
        `Refusing to bump ${previous} → ${next}.\n` +
            `This package is not ready for a public v1 yet.\n` +
            `Use patch or minor while on 0.x, or pass --confirm-v1 when you mean it.`,
    );
    process.exit(1);
}

console.log(`${pkg.name} ${previous} → ${next}${dryRun ? ' (dry run)' : ''}`);

if (!dryRun) {
    pkg.version = next;
    await writePackage(pkg);
}

if (!noPublish) {
    const publishArgs = ['publish'];
    if (dryRun) publishArgs.push('--dry-run');
    if (otp) publishArgs.push(`--otp=${otp}`);

    const status = run('npm', publishArgs);
    if (status !== 0) {
        if (!dryRun) {
            pkg.version = previous;
            await writePackage(pkg);
            console.error(`Publish failed — restored package.json to ${previous}.`);
            console.error(
                `If npm reported 404, retry with a fresh 2FA code: npm run release -- ${bump} --otp=xxxxxx`,
            );
        }
        process.exit(status);
    }
}

if (dryRun) {
    console.log(`Dry run complete. Would have released ${next}.`);
} else if (noPublish) {
    console.log(`Version set to ${next}. Publish when ready with: npm publish`);
} else {
    console.log(`Published ${pkg.name}@${next}`);
}
