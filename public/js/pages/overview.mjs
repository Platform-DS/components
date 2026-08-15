// ------------------------------
// Documentation: Overview
// ------------------------------

import { page, header, section, p, ul, code, callout, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'Platform Components',
        lede: 'Native custom elements, standard CSS, and nothing else.',
    }),

    p(`Platform is a component library with no build step and no dependencies. Components are
       plain ES modules that register custom elements; styling comes from CSS custom properties.
       If a browser can load a module and parse CSS, it can run this library.`),

    section('How it is organised'),

    p(`The library splits along one axis that matters more than any other: whether a component
       is <strong>application UI</strong> or <strong>page content</strong>, because that
       decision determines its DOM mode.`),

    table(
        ['Directory', 'Contains', 'DOM mode'],
        [
            { cells: ['<code>components/app/</code>', 'Buttons, inputs, dialogs, popovers: interactive UI', '<strong>Shadow</strong>, mostly'] },
            { cells: ['<code>components/content/</code>', 'Heroes, sections, headers, footers, page shells', '<strong>Light</strong>'] },
            { cells: ['<code>_core/</code>', 'Base classes, the HTML element spec, shared styles and tokens', ': '] },
            { cells: ['<code>utilities/</code>', 'Framework-free helpers: storage, state, factories, decorators', ': '] },
        ],
    ),

    callout('note', 'Why content components are Light DOM',
        `A shadow root hides its contents from the page's cascade, from search crawlers, from
         the browser's translation feature, and from <code>aria-*</code> attributes that
         reference IDs. Marketing content needs all four, so content components render into the
         page's own DOM. App components want encapsulation more than they want any of that, so
         they use Shadow DOM, with specific exceptions like <code>&lt;pl-label&gt;</code>.`),

    section('Using a component'),

    p('Import the module. That registers the element, and then write HTML.'),

    code(`
        <script type="module">
            import '@platformdesign/components/pl-button';
        </script>

        <pl-button variant="primary">Save</pl-button>
    `, 'html'),

    p(`Each module registers only itself, so you ship exactly what you use. Importing the
       package root registers everything instead, which is convenient in an app and wasteful
       on a landing page.`),

    section('What you get from the platform'),

    p(`Most of what these components do is not implemented by this library. It is inherited:`),

    ul([
        '<strong>Form participation</strong>: <code>&lt;pl-button&gt;</code> wraps a real <code>&lt;button&gt;</code>, so <code>type="submit"</code>, <code>form</code>, and validation work because they are the native behaviours.',
        '<strong>Dialogs and popovers</strong>: built on <code>&lt;dialog&gt;</code> and the Popover API, so focus trapping, the top layer, and light-dismiss come from the browser.',
        '<strong>Disclosure</strong>: accordions use <code>&lt;details&gt;</code> and <code>aria-expanded</code>/<code>aria-controls</code> rather than re-implementing keyboard handling.',
        '<strong>Theming</strong>: custom properties cross shadow boundaries, so overriding a token in your stylesheet restyles every instance.',
    ]),

    section('Next'),

    ul([
        '<a href="/documentation/installation">Installation</a>: every integration path, from npm to a CDN script tag.',
        '<a href="/documentation/theming">Theming</a>: the token system and how to override it.',
        '<a href="/documentation/authoring">Authoring components</a>: the conventions every component in this library follows.',
        '<a href="/documentation/pl-button">pl-button</a>: the reference implementation.',
    ]),
);
