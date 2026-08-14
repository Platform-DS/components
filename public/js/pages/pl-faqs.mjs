// ------------------------------
// Documentation — pl-faqs
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-faqs',
        title: 'FAQs',
        lede: 'Objection handling, on native <details> — no accordion to reimplement.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>SectionElement</code>',
        'Built on': '<code>&lt;details&gt;</code> / <code>&lt;summary&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-faqs</code>',
    }),

    p(`Step 7 of the landing-page formula: answer the objections that would otherwise send a visitor
       off to ask someone else. Phrase each as the question they would actually type — about time,
       money, or trust — and write your best rebuttal.`),

    callout('note', 'Why not an ARIA accordion?',
        `Because <code>&lt;details&gt;</code> already is one. The browser owns the open state, the
         keyboard behaviour, the accessible name, and — in current engines — lets find-in-page open a
         closed answer to reveal a match. A hand-rolled <code>aria-expanded</code> widget has to
         re-earn all of that, and usually misses the last one.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-faqs';`, 'js'),

    demo(`
        <pl-faqs surface="muted">
            <h2>Questions</h2>
            <details>
                <summary>Do I need a build step?</summary>
                <p>No. The library ships standard ES modules — a script tag is a complete install.</p>
            </details>
            <details>
                <summary>Does it work with React?</summary>
                <p>Yes. A custom element is an HTML element, so it works anywhere HTML does.</p>
            </details>
            <details>
                <summary>How do I theme it?</summary>
                <p>Override the design tokens in your own CSS. No rebuild, no configuration.</p>
            </details>
        </pl-faqs>
    `, { layout: 'bleed' }),

    section('One answer at a time'),

    p(`Add <code>exclusive</code> and opening one answer closes the others. It works by setting the
       <strong>native</strong> <code>name</code> attribute on each <code>&lt;details&gt;</code> — the
       browser does the closing, so there is no JavaScript state to keep in sync, and where
       <code>name</code> is unsupported it degrades to independent disclosures.`),

    demo(`
        <pl-faqs exclusive>
            <h2>One at a time</h2>
            <details><summary>Is there a runtime?</summary><p>No — the browser is the runtime.</p></details>
            <details><summary>Is there a CLI?</summary><p>No. There is nothing to generate.</p></details>
            <details><summary>Can I use a bundler?</summary><p>Yes, but you never have to.</p></details>
        </pl-faqs>
    `, { layout: 'bleed' }),

    section('Structured data'),

    p(`Add <code>schema</code> and the component emits <code>FAQPage</code> JSON-LD, which is what
       lets these questions appear as rich results in search. It is built by reading the questions
       already on the page, so the markup stays the single source of truth and the two cannot drift
       apart.`),

    code(`<pl-faqs exclusive schema> … </pl-faqs>`, 'html'),

    code(`
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question",
              "name": "Do I need a build step?",
              "acceptedAnswer": { "@type": "Answer", "text": "No. The library ships…" } }
          ]
        }
    `, 'json'),

    callout('warn', 'Only mark up FAQs that are visible',
        `Search engines expect structured data to match what the visitor actually sees. Because the
         JSON-LD is generated from the questions on the page, that holds by construction — but do not
         add <code>schema</code> to a section whose answers are hidden by your own CSS.`),

    section('Markup'),

    table(
        ['Element', 'Becomes'],
        [
            { cells: ['<code>&lt;h2&gt;</code>', 'The section title.'] },
            { cells: ['<code>&lt;details&gt;</code>', 'One question, ruled off from the next.'] },
            { cells: ['<code>&lt;summary&gt;</code>', 'The question, with a plus that rotates to a cross.'] },
            { cells: ['Anything else inside', 'The answer — paragraphs, lists, links.'] },
        ],
    ),

    section('Attributes'),

    p('Plus the shared <code>surface</code>, <code>align</code>, and <code>width</code>. The measure defaults to <code>52rem</code> here, since answers read better narrow.'),

    table(
        ['Attribute', 'Description'],
        [
            { cells: ['<code>exclusive</code>', 'Only one answer open at a time, via the native <code>name</code> attribute.'] },
            { cells: ['<code>schema</code>', 'Emit <code>FAQPage</code> JSON-LD built from the questions on the page.'] },
            { cells: ['<code>name</code>', 'The group name used by <code>exclusive</code>. Generated when omitted.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'Disclosure is native, so the keyboard behaviour, the expanded state, and the accessible name are the browser\'s.',
        'Questions are real text — indexed, translatable, and reachable by find-in-page.',
        'The plus/cross marker is generated content and never announced.',
        'Focus rings use the section accent and remain visible on every surface.',
    ]),
);
