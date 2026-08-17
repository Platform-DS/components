// ------------------------------
// Documentation: pl-header
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-header',
        title: 'Header',
        lede: 'Sticky, minimal, one call to action, and a nav that works with JavaScript off.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Import': '<code>@platformdesign/components/pl-header</code>',
    }),

    p(`Step 1 of the landing-page formula. Keep the header visible at all times, and on a landing
       page carry the brand plus <strong>one</strong> call to action: every extra link is another
       way to leave before converting. On a marketing site with more to navigate, a short nav is
       fine; the component supports both.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-header';`, 'js'),

    demo(`
        <pl-header>
            <a href="#"><pl-icon icon="cube" size="1.25rem"></pl-icon> Platform</a>
            <nav aria-label="Main">
                <ul>
                    <li><a href="#">Docs</a></li>
                    <li><a href="#">Pricing</a></li>
                </ul>
            </nav>
            <div data-actions>
                <pl-button-link href="#" data-size="sm">Get started</pl-button-link>
            </div>
        </pl-header>
    `, { layout: 'bleed' }),

    callout('note', 'Sticky is relative to the scroll container',
        `The header uses <code>position: sticky</code>, so in these demo panels it pins inside the
         panel rather than the page. On a real page it sticks to the viewport as you scroll.`),

    section('Landing-page mode'),

    p('Drop the nav entirely and the call to action moves to the far edge on its own.'),

    demo(`
        <pl-header data-surface="ink">
            <a href="#"><pl-icon icon="cube" size="1.25rem"></pl-icon> Platform</a>
            <div data-actions>
                <pl-button-link href="#" data-size="sm">Start free</pl-button-link>
            </div>
        </pl-header>
    `, { layout: 'bleed' }),

    section('The mobile toggle is progressive enhancement'),

    p(`Below 48rem the nav collapses behind a disclosure button wired with
       <code>aria-expanded</code> and <code>aria-controls</code>. The important part is the order it
       happens in:`),

    ul([
        'The nav is authored as ordinary markup, so it is in the page source and crawlable.',
        'On connect, the component builds the toggle button and <em>only then</em> sets <code>data-collapsible</code> on itself.',
        'The collapse CSS is gated on that attribute.',
    ]),

    callout('a11y', 'With JavaScript off, the nav stays open',
        `Because the collapse rules only apply once the toggle exists, a scripting failure leaves the
         navigation visible and usable, rather than hidden behind a button that can never work. That
         ordering is the whole reason the attribute exists.`),

    code(`
        <!-- what you write -->
        <pl-header>
            <a href="/">Brand</a>
            <nav aria-label="Main"><ul>…</ul></nav>
        </pl-header>

        <!-- what the component adds, on small screens -->
        <button data-nav-toggle aria-expanded="false" aria-controls="pl-header-nav-1">…</button>
    `, 'html'),

    section('Markup'),

    table(
        ['Element', 'Becomes'],
        [
            { cells: ['First <code>&lt;a&gt;</code> or <code>[data-brand]</code>', 'The brand lockup: logo and wordmark.'] },
            { cells: ['<code>&lt;nav&gt;</code>', 'The link row; the collapsible panel on small screens.'] },
            { cells: ['<code>[data-actions]</code>', 'The call to action, pushed to the far edge.'] },
            { cells: ['<code>a[aria-current]</code>', 'The current page, underlined in the brand color.'] },
        ],
    ),

    section('Attributes and events'),

    table(
        ['Name', 'Type', 'Description'],
        [
            { cells: ['<code>data-surface</code>', 'Attribute', '<code>ink</code> for a dark bar.'] },
            { cells: ['<code>pl-nav-toggle</code>', 'Event', 'Fired when the panel opens or closes; <code>detail.open</code> is a boolean.'] },
            { cells: ['<code>toggle(force?)</code>', 'Method', 'Open or close the panel programmatically.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--header-bg</code>', 'Bar background.'] },
            { cells: ['<code>--header-ink</code>', 'Text color.'] },
            { cells: ['<code>--header-line</code>', 'Bottom border and toggle outline.'] },
            { cells: ['<code>--header-gutter</code>', 'Inline padding.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'Give the <code>&lt;nav&gt;</code> an <code>aria-label</code>: "Main", so it is distinguishable from the footer nav.',
        'Mark the current page with <code>aria-current="page"</code>; it is styled for you.',
        'The toggle carries <code>aria-expanded</code>, <code>aria-controls</code>, and a label that changes between "Open menu" and "Close menu".',
        'Tab order is brand → toggle → nav, matching the visual order.',
        'A sticky header should stay short; it covers content when a visitor jumps to an anchor.',
    ]),
);
