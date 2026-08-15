// ------------------------------
// Documentation: injectStyles
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'injectStyles',
        lede: 'Adopt a stylesheet into the document once, however many instances exist.',
    }),

    meta({
        'Import': '<code>_core/utilities/injectStyles.mjs</code>',
        'Exports': '<code>injectStyles</code>',
        'Depends on': '<em>nothing</em>',
    }),

    p(`A Shadow DOM component adopts its stylesheet onto its own root, so its CSS arrives with it.
       A Light DOM component has no root to adopt onto: its styles have to go into the document,
       once, no matter how many instances there are. This is how every Light DOM component in the
       library gets its CSS.`),

    section('Usage'),

    code(`
        import { injectStyles } from '@platformdesign/components/_core/utilities/injectStyles.mjs';

        const STYLES = \`
            my-banner { display: block; padding: 1rem; }
        \`;

        class MyBanner extends HTMLElement {
            connectedCallback() {
                injectStyles('my-banner', STYLES);
            }
        }
    `, 'js'),

    table(
        ['Parameter', 'Description'],
        [
            { cells: ['<code>key</code>', 'The dedupe key: the tag name, or a shared name like <code>pl-section</code> for rules several components have in common.'] },
            { cells: ['<code>css</code>', 'The stylesheet text.'] },
            { cells: ['<em>returns</em>', 'The <code>CSSStyleSheet</code>, so you can edit rules later. The same sheet comes back on every call with that key.'] },
        ],
    ),

    section('Three decisions in fifteen lines'),

    ul([
        '<strong>Keyed and deduped.</strong> Calling it in <code>connectedCallback</code> is correct even with a thousand instances: the second call is a Map lookup that returns.',
        '<strong>Constructable, not a <code>&lt;style&gt;</code> tag.</strong> <code>adoptedStyleSheets</code> parses once and shares one sheet object. Appending a tag per component would re-parse the same CSS on every insertion and leave the document littered.',
        '<strong>Appended, not assigned.</strong> The sheet goes on the end of <code>document.adoptedStyleSheets</code>, so components that arrive later never clobber the ones already there.',
    ]),

    callout('note', 'Do NOT wrap these in a layer',
        `These sheets used to wrap everything in <code>@layer pl-components</code>, so that a
         consumer's CSS would win without a specificity fight. It won too much. An unlayered rule
         beats a layered one at <em>any</em> specificity, so a page with nothing more exotic than
         <code>p { margin: 3rem 0 }</code> beat <code>pl-hero &gt; p</code> and took the section's
         vertical rhythm with it. Measured against five such rules, every one of them won: a hero
         lede at 48px instead of 16, a figure at 80px instead of 0, a section title at 64px instead
         of 40. A component that loses to a bare element selector does not have a layout, it has a
         suggestion.`),

    p(`Unlayered restores ordinary specificity, which turns out to be the behaviour everyone
       actually wanted. Measured against the same page:`),

    table(
        ['The page writes', 'Weight', 'Who wins'],
        [
            { cells: ['<code>p { margin: 3rem }</code>', '(0,0,1)', 'The <strong>component</strong>, whose <code>pl-hero &gt; p</code> is (0,0,2). This is the bleed the change exists to stop.'] },
            { cells: ['<code>pl-hero { --section-space: 10rem }</code>', '(0,0,1)', 'The <strong>page</strong>. Token defaults sit in <code>:where()</code>, so they weigh nothing and anything at all outranks them.'] },
            { cells: ['<code>pl-hero h1 { font-size: 5rem }</code>', '(0,0,2)', 'The <strong>page</strong>. Type rules are <code>:where(pl-hero) &gt; h1</code>, so they weigh only what they target.'] },
            { cells: ['<code>.brand pl-hero h1 { … }</code>', '(0,1,2)', 'The <strong>page</strong>. A class always wins; this is the escape hatch that works everywhere, on every component.'] },
            { cells: ['<code>p { margin: 0 !important }</code>', '—', 'The <strong>page</strong>. Nothing here is <code>!important</code>, so the hammer still works when you need it.'] },
        ],
    ),

    callout('warn', 'The one tie you can lose',
        `Adopted sheets sort after the document's own, so an override written at
         <em>exactly</em> a component's specificity loses the tie.
         <code>pl-footer address { font-style: italic }</code> ties
         <code>pl-footer address</code> and the component wins. Add a class, an id, or a child
         combinator: any of the three is one notch of intent more than a tie, and the rule of thumb
         that never fails is that a class beats anything this library writes.`),

    callout('note', 'Why not just use !important everywhere',
        `It was the obvious fix and it is wrong twice over. Inside a layer, important declarations
         <em>reverse</em> the layer order, so <code>!important</code> here would also beat a
         consumer's own <code>!important</code> and nothing in a page could reach these rules at
         all. And it would undo the reason content components are Light DOM in the first place:
         the page's cascade is supposed to reach them. Custom properties are the theming path, but
         they should not be the <em>only</em> one.`),

    section('When you need it'),

    p(`Only for Light DOM. If your component attaches a shadow root, adopt onto that instead: the
       styles are scoped for free and nothing reaches the document at all.`),

    code(`
        // Shadow DOM: no injectStyles involved
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(STYLES);
        this.shadowRoot.adoptedStyleSheets = [sheet];
    `, 'js'),

    p(`Which of the two you are writing is the decision that most changes how a component behaves.
       <a href="/documentation">The overview</a> covers where the line falls in this library, and
       why content components sit on the Light DOM side of it.`),

    section('Next'),

    ul([
        '<a href="/documentation/authoring">Authoring components</a>: the base classes that call this for you.',
        '<a href="/documentation/theming">Theming</a>: the custom properties these rules read.',
    ]),
);
