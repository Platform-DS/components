// ------------------------------
// Documentation: pl-popover
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-popover',
        title: 'Popover',
        lede: 'A panel that opens from the control that invoked it, and flips out of its own way when there is no room.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Uses': 'Popover API + CSS anchor positioning',
        'Import': '<code>@platformdesign/components/pl-popover</code>',
    }),

    p(`The <code>popover</code> attribute goes on the host itself, so
       <code>popovertarget</code> resolves straight to it and the browser handles the rest: the top
       layer, light dismiss, Escape, and returning focus to the invoker.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-popover';`, 'js'),

    demo(`
        <pl-button popovertarget="demo-filters" data-variant="secondary">Filters</pl-button>

        <pl-popover id="demo-filters">
            <p><strong>Refine</strong></p>
            <pl-switch checked>In stock</pl-switch><br>
            <pl-switch>On sale</pl-switch>
        </pl-popover>
    `, { layout: 'stack' }),

    p(`No script again, and unlike <a href="/documentation/pl-dialog">pl-dialog</a>, no id
       juggling either. A custom element carries the <code>popover</code> attribute perfectly well,
       so the element you write is the element the invoker points at.`),

    section('Positioning is CSS, not measurement'),

    p(`A popover opened by <code>popovertarget</code> gets its invoker as an <strong>implicit
       anchor</strong>. That means <code>position-area</code> can place the panel against the
       control without either side naming the other, and
       <code>position-try-fallbacks</code> flips it to the opposite edge when the preferred side is
       short on room.`),

    p(`That is the whole "opens in the direction that fits" behaviour, decided by the style engine
       at paint time, no scroll listeners, no <code>getBoundingClientRect</code>, and nothing to
       re-measure when the page moves.`),

    demo(`
        <pl-button popovertarget="demo-above" data-variant="secondary" data-size="sm">block-start</pl-button>
        <pl-popover id="demo-above" data-placement="block-start"><p>Above the button.</p></pl-popover>

        <pl-button popovertarget="demo-end" data-variant="secondary" data-size="sm">inline-end</pl-button>
        <pl-popover id="demo-end" data-placement="inline-end"><p>Beside the button.</p></pl-popover>

        <pl-button popovertarget="demo-center" data-variant="secondary" data-size="sm">centered</pl-button>
        <pl-popover id="demo-center" data-align="center"><p>Centred under the button.</p></pl-popover>
    `, { layout: 'stack' }),

    callout('note', 'Where anchor positioning is missing',
        `The placement rules live inside <code>@supports (position-area: block-end)</code>. Without
         that support the popover keeps the browser's own default placement: a centred sheet.
         Not what was asked for, but never broken and never off-screen, and the Popover API itself
         (top layer, light dismiss, focus return) still works in full.`),

    section('Manual popovers'),

    p(`<code>auto</code>: the default: light-dismisses: clicking away or pressing Escape closes
       it, and only one auto popover stays open in a tree at a time. <code>data-manual</code> opts out
       of all of that, for a panel that must stay put until the page decides otherwise.`),

    demo(`
        <pl-button popovertarget="demo-manual" data-variant="secondary" data-size="sm">Toggle</pl-button>
        <pl-popover id="demo-manual" data-manual>
            <p>Clicking outside will not close this.</p>
            <pl-button popovertarget="demo-manual" popovertargetaction="hide" data-size="sm">Close</pl-button>
        </pl-popover>
    `, { layout: 'stack' }),

    section('From script'),

    code(`
        const popover = document.querySelector('pl-popover');

        popover.show();                    // showPopover()
        popover.hide();                    // hidePopover()
        popover.toggle();                  // togglePopover()
        console.log(popover.open);         // matches(':popover-open')

        popover.addEventListener('pl-toggle', event => {
            console.log(event.detail.open);
        });
    `, 'js'),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>data-placement</code>', '<code>String</code>', '<code>block-end</code> (default), <code>block-start</code>, <code>inline-start</code>, <code>inline-end</code>.'] },
            { cells: ['<code>data-align</code>', '<code>String</code>', '<code>start</code> (default), <code>center</code>, <code>end</code>: along the placement edge.'] },
            { cells: ['<code>data-manual</code>', '<code>Boolean</code>', 'Use <code>popover="manual"</code>: no light dismiss, no auto-closing.'] },
        ],
    ),

    p(`Placement is written with <em>logical</em> edges, so <code>inline-end</code> is the right
       side in a left-to-right document and the left side in a right-to-left one: the same
       vocabulary the rest of the library uses.`),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--popover-width</code>', 'Maximum width.'] },
            { cells: ['<code>--popover-padding</code>', 'Inner padding.'] },
            { cells: ['<code>--popover-offset</code>', 'Gap between the panel and its anchor.'] },
            { cells: ['<code>--popover-background</code> / <code>--popover-border</code>', 'Surface and edge.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'The Popover API handles focus: opening moves into the panel where appropriate, and closing returns focus to the invoker.',
        'Escape closes an <code>auto</code> popover, and the browser manages the top-layer stack when several are open.',
        'Use a real button as the invoker: <code>popovertarget</code> only works on a button, which rules out the <code>&lt;div onclick&gt;</code> version of this by construction.',
        'A popover is not a dialog: it does not trap focus and does not make the page inert. If a choice must be made before continuing, use <a href="/documentation/pl-dialog">pl-dialog</a>.',
        'Transitions are dropped under <code>prefers-reduced-motion</code>.',
    ]),
);
