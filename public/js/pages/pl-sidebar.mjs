// ------------------------------
// Documentation: pl-sidebar
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-sidebar',
        title: 'Sidebar',
        lede: 'A content column beside the main one, which stacks when it genuinely stops fitting.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Import': '<code>@platformdesign/components/pl-sidebar</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-sidebar';`, 'js'),

    demo(`
        <pl-sidebar style="inline-size:100%">
            <div style="padding:1rem;border:1px solid var(--color-border);border-radius:10px">
                The main column. It takes whatever space is left over.
            </div>
            <div data-aside style="padding:1rem;border:1px solid var(--color-border);border-radius:10px">
                The aside.
            </div>
        </pl-sidebar>
    `, { layout: 'stack' }),

    p(`Mark the narrow column with <code>data-aside</code>. Whatever else is inside is the main
       one.`),

    callout('note', 'No breakpoint, and no `side` attribute',
        `The switch to one column happens when the CONTENT runs out of room, not at a viewport
         width: the aside asks for a fixed basis, the main column refuses to go below
         <code>--sidebar-content-min</code>, and flex-wrap does the rest. A viewport query would
         keep two columns inside a narrow parent on a wide screen, and a container query cannot
         restyle its own container, which is what this element would need.
         <br><br>
         There is also no <code>side</code> attribute: DOM order decides which column comes first,
         visually <em>and</em> in reading and tab order. An attribute that moved it visually would
         let those disagree: the bug that leaves a page unusable by keyboard while looking fine.`),

    section('Where it switches'),

    p(`The two columns share a line only while
       <code>content-min + sidebar-width + gap</code> fits. With the defaults: 50% and 16rem.
       That lands at roughly 580px of available width. Raising <code>--sidebar-content-min</code>
       moves the switch later; widening the aside moves it earlier.`),

    code(`
        <pl-sidebar style="--sidebar-width: 20rem; --sidebar-content-min: 60%">
    `, 'html'),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--sidebar-width</code>', 'Preferred width of the aside. Defaults to <code>16rem</code>.'] },
            { cells: ['<code>--sidebar-content-min</code>', 'How narrow the main column may get before the aside wraps. Defaults to <code>50%</code>.'] },
            { cells: ['<code>--sidebar-gap</code>', 'Space between the columns.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'Nothing is reordered, so reading order, tab order and visual order are the same thing at every width.',
        'The element adds no roles, if the aside is a genuine complementary region, make it an <code>&lt;aside&gt;</code> yourself.',
    ]),
);
