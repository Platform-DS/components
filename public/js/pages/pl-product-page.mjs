// ------------------------------
// Documentation: pl-product-page
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-product-page',
        title: 'Product Page',
        lede: 'One thing in detail: media on one side, the buy column on the other.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Import': '<code>@platformdesign/components/pl-product-page</code>',
    }),

    callout('note', 'A page shell is deliberately thin',
        `It owns the vertical rhythm between sections and the measure of the content column, and
         nothing else. The sections inside it are where the page actually lives, so if one of
         these ever grows logic, that is a sign the logic belonged in a section.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-product-page';`, 'js'),

    code(`
        <pl-product-page>
            <div data-media>
                <pl-picture ratio="1"><img src="…" alt=""></pl-picture>
            </div>
            <div data-detail>
                <h1>Field Jacket</h1>
                <pl-ratings value="4" readonly></pl-ratings>
                <p>\$148</p>
                <pl-button full>Add to bag</pl-button>
            </div>

            <pl-faqs>…</pl-faqs>
        </pl-product-page>
    `, 'html'),

    p(`The two columns wrap to one when the detail column would be squeezed: the same intrinsic
       wrap <a href="/documentation/pl-sidebar">pl-sidebar</a> uses, and for the same reason: it
       answers to the actual space rather than to the viewport. Anything after the two columns runs
       the full width of the shell, so supporting sections stack underneath.`),


    section('Preview'),

    demo(`
        <pl-product-page style="--page-padding:1.25rem;--product-column:14rem;--product-gap:1.5rem;border:1px solid var(--color-border);border-radius:12px">
            <div data-media>
                <pl-picture ratio="1" style="--picture-radius:10px">
                    <img src="https://picsum.photos/seed/prod/700/700" alt="">
                </pl-picture>
            </div>
            <div data-detail>
                <p data-eyebrow style="font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--color-ink-secondary)">Outerwear</p>
                <h2 style="margin:0">Field Jacket</h2>
                <pl-ratings value="4" readonly></pl-ratings>
                <p style="font-size:1.25rem;font-weight:600">$148</p>
                <p style="color:var(--color-ink-secondary)">Waxed cotton, cut long. Made to be worn in.</p>
                <pl-button full><pl-icon icon="shopping-bag" size="1rem"></pl-icon> Add to bag</pl-button>
            </div>
            <pl-faqs surface="muted">
                <h3>Before you buy</h3>
                <pl-accordion-group>
                    <pl-accordion open><h4 data-summary>How does it fit?</h4><p>True to size, with room for a knit underneath.</p></pl-accordion>
                    <pl-accordion><h4 data-summary>Can I return it?</h4><p>Thirty days, unworn.</p></pl-accordion>
                </pl-accordion-group>
            </pl-faqs>
        </pl-product-page>
    `, { layout: 'stack' }),

    p(`The two top columns wrap to one when the detail column would be squeezed, and the section
       underneath runs the full width of the shell, which is what lets supporting content stack
       below the fold without any extra wrapper.`),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--page-measure</code> / <code>--page-padding</code>', 'The outer column.'] },
            { cells: ['<code>--product-column</code>', 'Preferred width of each top column. Defaults to <code>22rem</code>.'] },
            { cells: ['<code>--product-gap</code>', 'Space between them.'] },
        ],
    ),
);
