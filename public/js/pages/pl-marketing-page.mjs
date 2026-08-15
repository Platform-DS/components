// ------------------------------
// Documentation: pl-marketing-page
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-marketing-page',
        title: 'Marketing Page',
        lede: 'Full-bleed sections stacked edge to edge: the shell the content sections were built for.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Import': '<code>@platformdesign/components/pl-marketing-page</code>',
    }),

    callout('note', 'A page shell is deliberately thin',
        `It owns the vertical rhythm between sections and the measure of the content column, and
         nothing else. The sections inside it are where the page actually lives, so if one of
         these ever grows logic, that is a sign the logic belonged in a section.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-marketing-page';`, 'js'),

    code(`
        <pl-marketing-page>
            <pl-hero>…</pl-hero>
            <pl-social-proof>…</pl-social-proof>
            <pl-benefits>…</pl-benefits>
            <pl-testimonials>…</pl-testimonials>
            <pl-faqs>…</pl-faqs>
            <pl-cta>…</pl-cta>
        </pl-marketing-page>
    `, 'html'),

    p(`This shell sets no maximum width and adds no gaps, and both are deliberate. Each
       <a href="/documentation/sections">content section</a> is a full-bleed band that caps its own
       inner measure and owns its own vertical space, so constraining them from outside would
       leave a coloured band floating in the middle of the page with white either side, and adding
       a gap here would double the spacing they already set.`),


    section('Preview'),

    demo(`
        <pl-marketing-page style="--section-space:2rem;border:1px solid var(--color-border);border-radius:12px;overflow:hidden">
            <pl-hero align="center">
                <h2>Components that outlive your framework</h2>
                <p>Native custom elements and CSS custom properties. No build step.</p>
                <div data-actions><pl-button>Read the docs</pl-button></div>
            </pl-hero>
            <pl-benefits surface="muted">
                <h3>Why it lasts</h3>
                <ul>
                    <li><h4>No dependencies</h4><p>Nothing to audit, nothing to update.</p></li>
                    <li><h4>No build step</h4><p>The files you import are the files that run.</p></li>
                </ul>
            </pl-benefits>
            <pl-cta surface="ink">
                <h3>Start with one component</h3>
                <div data-actions><pl-button>Install</pl-button></div>
            </pl-cta>
        </pl-marketing-page>
    `, { layout: 'stack' }),

    p(`The bands run edge to edge and each one caps its own inner measure, which is exactly why the
       shell sets no width of its own. <code>--section-space</code> is turned down here so the
       preview fits; at its real value each band is far taller.`),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<em>none</em>', 'By design: the sections inside carry the layout.'] },
        ],
    ),
);
