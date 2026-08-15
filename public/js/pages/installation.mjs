// ------------------------------
// Documentation: Installation
// ------------------------------

import { page, header, section, p, ul, code, callout } from '../components/doc.mjs';

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
