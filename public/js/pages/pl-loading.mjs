// ------------------------------
// Documentation: pl-loading
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-loading',
        title: 'Loading',
        lede: 'A spinner that takes the color of whatever it is placed inside.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>BaseElement</code>',
        'Renders': '<code>&lt;pl-icon icon="loading-spinner"&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-loading</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-loading';`, 'js'),

    demo(`
        <pl-loading></pl-loading>
        <pl-loading size="1rem"></pl-loading>
        <pl-loading size="2.5rem"></pl-loading>
    `),

    section('It inherits color'),

    p(`The artwork is drawn in <code>currentColor</code>, so the spinner is whatever color the
       text around it is. Nothing has to be passed down. Put one on a primary button and it is the
       button's label color, put one in a dialog and it is the body text color.`),

    demo(`
        <pl-button data-loading>Saving</pl-button>
        <pl-button data-variant="secondary"><pl-loading size="1rem"></pl-loading> Uploading…</pl-button>
        <span style="color: var(--color-error)"><pl-loading></pl-loading></span>
    `),

    callout('note', 'Inside a button, use the button\'s own loading state',
        `<a href="/documentation/pl-button">pl-button</a> already has <code>loading</code>, which
         sets <code>aria-busy</code> on the real button and blocks clicks while it is up. Reach for
         a bare <code>&lt;pl-loading&gt;</code> when the wait belongs to a region rather than to a
         control: a panel fetching its contents, a dialog saving.`),

    section('Silent by default'),

    p(`A bare spinner is decorative and stays out of the accessibility tree, because it nearly
       always sits next to something that already reports the wait. Give it a <code>label</code>
       when the spinner <em>is</em> the only thing saying so, and it becomes a
       <code>role="status"</code> live region that announces once.`),

    demo(`
        <pl-loading label="Loading your dashboard"></pl-loading>
    `),

    code(`
        <pl-loading></pl-loading>                        <!-- decorative -->
        <pl-loading label="Loading results"></pl-loading> <!-- announced -->
    `, 'html'),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>size</code>', '<code>String</code>', 'Any CSS length. Passed through to the icon, so a spinner and an icon of the same size really match.'] },
            { cells: ['<code>label</code>', '<code>String</code>', 'Makes it a live region with this accessible name. Omit for a decorative spinner.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--loading-duration</code>', 'One full turn. Defaults to <code>750ms</code>.'] },
        ],
    ),

    callout('note', 'Reduced motion slows it down rather than stopping it',
        `Under <code>prefers-reduced-motion</code> the spin drops to a 2.4s turn instead of
         freezing. A completely still spinner reads as a hung interface, which is a worse outcome
         than the motion it was meant to spare someone.`),

    section('Accessibility'),

    ul([
        'Decorative unless you give it a <code>label</code>, no announcement competing with whatever else is reporting the wait.',
        'With a label it is <code>role="status"</code>: polite, announced once, never interrupting.',
        'A spinner alone is a poor progress indicator for anything long. If you know how far along you are, use <a href="/documentation/pl-progress">pl-progress</a>; if you are filling a known layout, <a href="/documentation/pl-skeleton">pl-skeleton</a> tells the reader more.',
    ]),
);
