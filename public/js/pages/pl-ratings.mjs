// ------------------------------
// Documentation — pl-ratings
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-ratings',
        title: 'Ratings',
        lede: 'A row of stars over a real range input — click, drag with the keyboard, or just display an average.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': '<code>&lt;input type="range"&gt;</code> + a decorative star row',
        'Import': '<code>@platformdesign/components/pl-ratings</code>',
    }),

    p(`The stars are a visual skin drawn over a real <code>&lt;input type="range"&gt;</code>: the
       range carries focus, keyboard behaviour, and the form value, and is invisible and
       <code>pointer-events: none</code> so a click lands on a star instead of dragging an unseen
       thumb.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-ratings';`, 'js'),

    demo(`
        <pl-ratings name="stars" value="3" max="5"></pl-ratings>
    `, { layout: 'stack' }),

    p(`Click a star to set the rating, or tab to the control and use the arrow keys, Home, and
       End — all native <code>&lt;input type="range"&gt;</code> behaviour, not reimplemented. Hover
       previews the value without committing it.`),

    section('Naming it'),

    p(`The range carries <code>aria-valuetext</code> ("3 of 5 stars") rather than its own
       <code>aria-label</code>, specifically so it doesn't shadow a wrapping label's name —
       <code>aria-label</code> on a control always wins over a <code>&lt;label&gt;</code>
       association and would silently defeat it. Name the control the same way you'd name a real
       input:`),

    demo(`
        <pl-label text="Rate this product">
            <pl-ratings name="rating"></pl-ratings>
        </pl-label>
    `, { layout: 'stack' }),

    section('Readonly: a display, not a control'),

    p(`Set <code>readonly</code> for a non-interactive average — a product card's "4.3 of 5". It
       accepts a <strong>fractional</strong> value and fills the affected star proportionally,
       something a whole-star range can't hold, which is exactly why readonly mode disables the
       range rather than trying to keep a slider in sync with a value it isn't shaped for. The
       stars alone carry the number, through <code>role="img"</code> and an <code>aria-label</code>
       on the host.`),

    demo(`
        <pl-ratings value="4.3" max="5" readonly></pl-ratings>
        <pl-ratings value="2" max="5" readonly></pl-ratings>
    `, { layout: 'stack' }),

    section('Scale and states'),

    demo(`
        <pl-ratings value="7" max="10"></pl-ratings>
        <pl-ratings value="2" disabled></pl-ratings>
    `, { layout: 'stack' }),

    section('Listening for changes'),

    demo(`
        <pl-ratings value="0"
            oninput="this.nextElementSibling.textContent = this.value"></pl-ratings>
        <output>0</output>
    `, { layout: 'stack' }),

    p(`That demo listens for the native <code>input</code> event, which bubbles out normally
       because the range is a real control in the page. For the coerced number specifically, listen
       for <code>pl-change</code>:`),

    code(`
        document.querySelector('pl-ratings')
            .addEventListener('pl-change', event => {
                console.log(event.detail.value);   // a number
            });
    `, 'js'),

    section('In a form'),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').textContent = new FormData(event.target).get('experience')">
            <pl-label text="Rate your experience">
                <pl-ratings name="experience" value="4"></pl-ratings>
            </pl-label>
            <div data-actions><pl-button type="submit" size="sm">Submit</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>value</code>', '<code>Number</code>', 'The rating. Whole numbers when interactive; readonly accepts a fraction.'] },
            { cells: ['<code>max</code>', '<code>Number</code>', 'Star count. Defaults to <code>5</code>.'] },
            { cells: ['<code>name</code>', '<code>String</code>', 'Field name for form submission.'] },
            { cells: ['<code>disabled</code>', '<code>Boolean</code>', 'Disables the control.'] },
            { cells: ['<code>readonly</code>', '<code>Boolean</code>', 'Display-only: no range, a fractional value, <code>role="img"</code>.'] },
        ],
    ),

    section('Properties and events'),

    table(
        ['Member', 'Description'],
        [
            { cells: ['<code>value</code> / <code>max</code>', 'Get or set either, clamped to <code>[0, max]</code>.'] },
            { cells: ['<code>input</code>', 'The real range, if you need it.'] },
            { cells: ['<code>pl-change</code>', 'Fired on every change; <code>detail.value</code> is a number.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--star-size</code>', 'Each star\'s width and height. Defaults to <code>1.5rem</code>.'] },
            { cells: ['<code>--ratings-gap</code>', 'Space between stars.'] },
            { cells: ['<code>--ratings-color</code>', 'Filled-star colour. Defaults to <code>--pl-color-warning</code>.'] },
            { cells: ['<code>--ratings-empty</code>', 'Unfilled-star colour.'] },
        ],
    ),

    callout('note', 'Why warning, not a bespoke gold',
        `The token contract has no dedicated "gold" — reusing <code>--pl-color-warning</code> keeps
         the star amber without adding a one-component colour to the palette. Override
         <code>--ratings-color</code> on any instance that wants something else.`),

    section('Accessibility'),

    ul([
        'The rating is a real <code>&lt;input type="range"&gt;</code>, so focus, Tab order, and arrow/Home/End all come from the platform.',
        'The value announces through <code>aria-valuetext</code> ("3 of 5 stars"), not <code>aria-label</code> — the latter would override a wrapping <code>pl-label</code>\'s name instead of just describing the value.',
        'The star row is <code>aria-hidden</code>; it is a visual skin, not a second copy of the information.',
        'Readonly mode drops the control entirely in favour of <code>role="img"</code> with a complete <code>aria-label</code> — there is nothing to focus and nothing to operate.',
        'The fill transition is dropped under <code>prefers-reduced-motion</code>.',
    ]),
);
