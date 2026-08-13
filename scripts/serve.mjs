// ------------------------------
// serve — development server
// ------------------------------
// Node's own http module, no dependencies — the project's whole argument is
// that you don't need a toolchain, so the dev server shouldn't need one either.
//
// Two things a plain static server wouldn't do:
//   1. /documentation/* rewrites to documentation.html, so the SPA's deep
//      links survive a hard refresh.
//   2. /Library/* is served from the repo root, so the docs site imports the
//      same source files a consumer would get from npm — no copy, no symlink,
//      no chance of documenting a stale build.
//
// Run: npm run dev

import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const PORT = Number(process.env.PORT ?? 3000);

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.xml': 'application/xml',
};

/** Map a URL path to a file on disk, or null if it escapes the served roots. */
async function resolve(pathname) {
    // Library/ and Developer_Docs/ live outside public/ but are served so the
    // docs can import the real source.
    const fromRoot = pathname.startsWith('/Library/') || pathname.startsWith('/Developer_Docs/');
    const base = fromRoot ? ROOT : PUBLIC;

    // normalize() collapses any ../ before we join, so a crafted path can't
    // climb out of the directory we intend to serve.
    const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    let file = join(base, safe);

    if (!file.startsWith(base)) return null;

    const found = await stat(file).catch(() => null);

    if (found?.isDirectory()) {
        file = join(file, 'index.html');
        return await stat(file).then(() => file).catch(() => null);
    }

    if (found) return file;

    // Extensionless SPA routes.
    if (pathname === '/documentation' || pathname.startsWith('/documentation/')) {
        return join(PUBLIC, 'documentation.html');
    }

    // A bare path with no extension: try .html (so /about serves about.html).
    if (!extname(pathname)) {
        const html = join(base, `${safe}.html`);
        return await stat(html).then(() => html).catch(() => null);
    }

    return null;
}

const server = createServer(async (request, response) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);
    const file = await resolve(decodeURIComponent(pathname));

    if (!file) {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        response.end(`404 — no route or file for ${pathname}`);
        return;
    }

    response.writeHead(200, {
        'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
        // Never cache in development — a stale module is a confusing bug.
        'cache-control': 'no-store',
    });

    createReadStream(file).pipe(response);
});

server.listen(PORT, () => {
    console.log(`\n  Platform Components\n`);
    console.log(`  Home    http://localhost:${PORT}/`);
    console.log(`  Docs    http://localhost:${PORT}/documentation\n`);
});
