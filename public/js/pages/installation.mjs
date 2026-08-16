// ------------------------------
// Documentation: Installation
// ------------------------------

import { page, header, section, p, ul, code, callout, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'Installation',
        lede: 'Three ways in. None of them involve a build step.',
    }),

    section('npm'),

    code('npm install @platformdesign/components', 'bash'),

    p('Import a single component. This registers <code>&lt;pl-button&gt;</code> and nothing else:'),

    code(`import '@platformdesign/components/pl-button';`, 'js'),

    p('Or register the whole library at once:'),

    code(`import '@platformdesign/components';`, 'js'),

    p(`Components are also exported as classes, for subclassing or
       <code>instanceof</code> checks:`),

    code(`import { Button } from '@platformdesign/components';

class SubmitButton extends Button {
    // inherits the full native <button> surface
}`, 'js'),

    callout('note', 'Paths mirror the source tree',
        `<code>@platformdesign/components/app/inputs/pl-button</code> resolves too. The short
         name is the convenient one; the long name is the one that tells you where the file
         lives.`),

    section('Without a package manager'),

    p(`Since the library ships standard ES modules, a script tag is a complete integration.
       Copy the <code>Library/</code> directory into your project, or point at a CDN that
       serves npm packages:`),

    code(`
        <script type="module"
                src="https://esm.sh/@platformdesign/components/pl-button"></script>

        <pl-button>Save</pl-button>
    `, 'html'),

    p(`An import map keeps the bare specifiers working in a plain HTML page, which means your
       markup reads identically whether or not you ever adopt a bundler:`),

    code(`
        <script type="importmap">
        {
            "imports": {
                "@platformdesign/components/": "/node_modules/@platformdesign/components/Library/components/"
            }
        }
        </script>
    `, 'html'),

    section('Styles'),

    p(`Components carry their own styles. The one stylesheet you load yourself is the token
       file: the design tokens every component reads, and the entire theming surface. It's a
       default export in the <a href="https://platformdesign.app" rel="noopener">platformdesign.app</a>
       format; swap in your own export to re-theme.`),

    code(`@import "@platformdesign/components/tokens.css";`, 'css'),

    p('Or as a link tag:'),

    code(`<link rel="stylesheet" href="/node_modules/@platformdesign/components/Library/_core/styles/tokens.css">`, 'html'),

    callout('note', 'Tokens are optional, not required',
        `Every component references tokens with fallbacks, so it still renders correctly
         without this file. Loading it, or your own platformdesign.app export: is what makes
         the set share one system. See <a href="/documentation/theming">Theming</a>.`),

    section('Serving it well'),

    p(`The source is the package: 125 ES modules, no build step, and importing a component imports
       exactly the files it needs. For an app with a bundler that is already the right answer, and
       nothing below applies. Your bundler minifies and tree-shakes across your whole app, which a
       pre-bundled file cannot; handing it a built artefact would be strictly worse.`),

    p(`For a page with <strong>no build step</strong>, the case this library exists for, the
       source costs requests. Measured with brotli, which is what a CDN actually sends:`),

    table(
        ['What you load', 'As source', 'Built', 'Saving'],
        [
            { cells: ['One component', '7 files, 13.9 kB', '4 files, 6.2 kB', '55%'] },
            { cells: ['Two components', '11 files, 14.8 kB', '7 files, 6.8 kB', '54%'] },
            { cells: ['A 13-tag landing page', '37 files, 38.0 kB', '20 files, 23.1 kB', '39%'] },
            { cells: ['The whole library', '125 files, 85.8 kB', '<strong>1 file, 43.9 kB</strong>', '49%'] },
        ],
    ),

    p(`So the package also ships a built distribution under the <code>/min</code> subpath. It is
       opt-in by import path rather than a <code>browser</code> condition, because a condition
       would hand a bundler minified input behind its back, and the point of the source being the
       default is that what you import is what runs.`),

    code(`
        <!-- the whole library, one request -->
        <script type="module" src="/node_modules/@platformdesign/components/dist/platform.js"></script>

        <!-- or just what you use; they share chunks, so the second costs almost nothing -->
        <script type="module">
            import '@platformdesign/components/min/pl-button';
            import '@platformdesign/components/min/pl-hero';
        </script>
    `, 'html'),

    callout('note', 'Which of the two, and why the answer is usually the split one',
        `<code>platform.js</code> is one request and 43.9 kB. The per-component files total less
         than that for any realistic page (a thirteen-tag landing page is 23.1 kB) but arrive as
         twenty small files. On HTTP/2 that trade favours the split build, and it keeps the shared
         core in a chunk the browser caches once across every page of your site. Reach for the
         single file when you want one script tag and no thought, or when you genuinely use most of
         the library.`),

    p(`Compression is the server's job, not the package's: none of these numbers happen without
       brotli or gzip enabled. Serve the files from your own origin where you can: a second origin
       costs a DNS lookup, a TCP handshake and a TLS negotiation before the first byte, which on a
       landing page is worth more than the bytes you saved.`),

    callout('note', 'Building it yourself',
        `<code>npm run build</code> regenerates <code>dist/</code> and prints the table above, so
         the trade is measured rather than assumed. esbuild is resolved from wherever you already
         have it and is never a dependency of this package. The zero-dependency promise covers
         what consumers install, and it would be hollow if the repo quietly grew a toolchain.`),

    section('Framework integration'),

    p(`Custom elements are DOM elements, so there is nothing to integrate. Two details are
       worth knowing:`),

    ul([
        '<strong>React 19+</strong> passes unknown props to custom elements as attributes and supports custom events directly. Earlier versions need <code>ref</code> for object props and <code>addEventListener</code> for events.',
        '<strong>Vue</strong>: tell the compiler these are custom elements via <code>compilerOptions.isCustomElement</code>, otherwise it warns about unknown components.',
    ]),

    code(`// vue.config.js / vite.config.js
{
    compilerOptions: {
        isCustomElement: tag => tag.startsWith('pl-')
    }
}`, 'js'),

    p(`Angular needs <code>CUSTOM_ELEMENTS_SCHEMA</code> in the module that uses them. Svelte,
       Astro, Rails, Django, and plain HTML need nothing at all.`),
);
