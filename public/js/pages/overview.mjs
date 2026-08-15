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
            { cells: ['<code>_core/</code>', 'Base classes, the HTML element spec, shared styles and tokens', 'n/a'] },
            { cells: ['<code>utilities/</code>', 'Framework-free helpers: storage, state, factories, decorators', 'n/a'] },
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

    section('The starter stylesheet'),

    p(`Components work with no CSS from you at all: every custom property they read carries a
       fallback, so <code>var(--pl-color-ink, #111827)</code> resolves whether or not a token
       sheet exists. The starter is a <strong>convenience, not a requirement</strong>.`),

    code(`<link rel="stylesheet" href="@platformdesign/components/global.css">`, 'html'),

    p('One file, three things, each of which you can take or leave:'),

    table(
        ['Part', 'What it does'],
        [
            { cells: ['<strong>Tokens</strong>', 'The whole palette, type scale, spacing and radii, plus the dark theme. Same file as <code>global.css</code> imports it for you.'] },
            { cells: ['<strong>Light reset</strong>', 'Border-box sizing, block-level media, form controls that inherit type. The handful of browser defaults that fight a component library.'] },
            { cells: ['<strong>Content typography</strong>', 'Headings, paragraphs, links, code and rules, from the same tokens the components read.'] },
        ],
    ),

    callout('note', 'The part that is genuinely hard to do without it',
        `A component styles its own text inside its shadow root, but <strong>slotted content is
         yours</strong>: the paragraph inside a <code>&lt;pl-accordion&gt;</code>, the heading
         inside a <code>&lt;pl-hero&gt;</code>. With no page-level type style those inherit the
         browser's defaults and sit next to component text that does not match. The typography
         here settles that, which is why it is the section worth taking even if you skip the
         rest.`),

    p(`Every rule in the reset and typography is wrapped in <code>:where()</code>, which has zero
       specificity. A plain <code>h1 { font-size: 3rem }</code> of your own therefore wins with no
       <code>!important</code> and no layer juggling. Using cascade layers instead? Import it into
       one and your own layers outrank it whatever the order:`),

    code(`@import "@platformdesign/components/global.css" layer(vendor);`, 'css'),

    p(`If you want the tokens and nothing else, they ship on their own as
       <code>@platformdesign/components/tokens.css</code>.`),

    section('A skeleton that paints before JavaScript'),

    p(`The starter also carries <code>.pl-skeleton</code>, a CSS-only counterpart to
       <a href="/documentation/pl-skeleton">pl-skeleton</a> with the same shapes, the same custom
       properties, and the same shimmer.`),

    code(`
        <div class="pl-skeleton"></div>
        <div class="pl-skeleton" data-lines="3"></div>
        <div class="pl-skeleton" data-variant="circle"></div>
        <div class="pl-skeleton" data-variant="rect"></div>
    `, 'html'),

    callout('note', 'Why a class and not just the component',
        `<code>&lt;pl-skeleton&gt;</code> is a Shadow DOM component, so its box does not exist
         until its module has been fetched and the element upgraded. Using it to hold a layout
         still <em>above the fold</em> reserves nothing during exactly the window that matters,
         and the page jumps when the real components arrive. This class is a plain element the
         browser styles on the first frame, so it holds the space from the very first paint.
         Reach for the class to reserve space before load, and the component once the page is
         already running.`),

    p(`Two honest differences, both consequences of a single element having no children to
       style: the multi-line bars are square-cut, because a gradient mask cannot round a corner,
       and every line is full width where the component shortens its last one. If either matters,
       use the component, or write one <code>.pl-skeleton</code> per line and set
       <code>inline-size</code> on the last.`),

    section('No layout shift while components load'),

    p(`A custom element is <code>display: inline</code> with unstyled children until its module has
       been fetched and registered. Its real box does not exist yet, so the page paints one size
       and then jumps to another. The starter closes that window with
       <code>:not(:defined)</code>, which matches an element in exactly that state.`),

    p(`This can only be done from the page. A component cannot style its own host beforehand,
       because the stylesheet lives in a shadow root that has not been attached yet.`),

    table(
        ['Treatment', 'Used for', 'Why'],
        [
            { cells: ['<strong>Match the box</strong>', '<code>pl-button</code>, <code>pl-code-block</code>, <code>pl-chip</code>', 'The markup you wrote is what the component ends up showing, so the host is given the padding, type and colours it will have. The text is already in the right place, then simply gains a shadow root.'] },
            { cells: ['<strong>Reserve a skeleton</strong>', '<code>pl-avatar</code>, <code>pl-progress</code>, <code>pl-meter</code>, <code>pl-loading</code>', 'These render from attributes, not children, so there is nothing to show yet. They get the shimmer at the size the real thing will be.'] },
            { cells: ['<strong>Reserve silently</strong>', '<code>pl-icon</code>', 'Small and usually inline in a sentence. A grey box flashing mid-line is more distracting than the gap it fills.'] },
        ],
    ),

    callout('note', 'Nothing is hidden to achieve this',
        `Colours are read from the component's own hook first
         (<code>--button-background</code> before <code>--pl-color-primary</code>), so a page that
         themes a button keeps that theme before upgrade instead of painting the default and
         flipping. And no rule hides content: with JavaScript switched off entirely the page still
         reads, and buttons with an <code>onclick</code> still work. The rules only add the space
         the generated parts are about to occupy.`),

    p(`On this site's own home page that took the hero from an <strong>84px jump to
       0.1px</strong>, measured by sampling element boxes during parse and again after load. The
       remainder of the page went from 145px to 22px; what is left is Light DOM components whose
       final height depends on content that does not exist yet, such as whether an accordion panel
       is open.`),

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
