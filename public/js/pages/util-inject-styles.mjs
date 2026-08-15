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
            @layer pl-components {
                my-banner { display: block; padding: 1rem; }
            }
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

    callout('note', 'Wrap your rules in a layer',
        `Every caller is expected to wrap its CSS in <code>@layer pl-components</code>. Adopted
         stylesheets come <em>after</em> the document's own in the cascade, so without a layer a
         component's rules would beat the consumer's stylesheet and only lose to
         <code>!important</code>. Inside a layer, unlayered author CSS wins automatically, whatever
         the selectors say. This is the difference between a component you can restyle and one you
         have to fight.`),

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
        '<a href="/documentation/theming">Theming</a>: the layer this cooperates with.',
    ]),
);
