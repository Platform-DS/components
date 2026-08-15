// ------------------------------
// Documentation: pl-blank-page
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-blank-page',
        title: 'Blank Page',
        lede: 'The plainest shell: a header, a measured content column, a footer.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Import': '<code>@platformdesign/components/pl-blank-page</code>',
    }),

    callout('note', 'A page shell is deliberately thin',
        `It owns the vertical rhythm between sections and the measure of the content column, and
         nothing else. The sections inside it are where the page actually lives, so if one of
         these ever grows logic, that is a sign the logic belonged in a section.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-blank-page';`, 'js'),

    code(`
        <pl-blank-page>
            <pl-header>…</pl-header>
            <main>
                <h1>Settings</h1>
                <pl-form>…</pl-form>
            </main>
            <pl-footer>…</pl-footer>
        </pl-blank-page>
    `, 'html'),

    p(`The column fills the viewport height, so a short page still pins its footer to the bottom
       rather than leaving it floating mid-screen. Everything between the header and the footer
       takes the slack.`),


    section('Preview'),

    demo(`
        <pl-blank-page style="min-block-size:19rem;--page-padding:1.25rem;border:1px solid var(--color-border);border-radius:12px;overflow:hidden">
            <div style="padding:.75rem 1.25rem;background:var(--color-surface-sunken);font-weight:600">Header</div>
            <main>
                <h2 style="margin:0 0 .5rem">Settings</h2>
                <p style="margin:0;color:var(--color-ink-secondary)">The measured content column takes the slack between the header and the footer.</p>
            </main>
            <div style="padding:.75rem 1.25rem;background:var(--color-surface-sunken);color:var(--color-ink-secondary);font-size:.875rem">Footer</div>
        </pl-blank-page>
    `, { layout: 'stack' }),

    p(`Shown at a reduced height: the real shell is <code>min-block-size: 100dvh</code>, which is
       what pins the footer to the bottom of the viewport on a short page rather than leaving it
       floating mid-screen.`),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--page-measure</code>', 'Width of the content column. Defaults to <code>68rem</code>.'] },
            { cells: ['<code>--page-padding</code>', 'Padding around it.'] },
        ],
    ),
);
