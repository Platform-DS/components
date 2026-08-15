// ------------------------------
// Documentation: pl-app-navigation
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-app-navigation',
        title: 'App Navigation',
        lede: 'The persistent navigation rail of an application: your links, grouped, current one marked.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': 'A named <code>&lt;nav&gt;</code> landmark',
        'Import': '<code>@platformdesign/components/pl-app-navigation</code>',
    }),

    p(`It generates no links. They are yours, in the page's DOM: real URLs a crawler can follow
       and the browser can prefetch.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-app-navigation';`, 'js'),

    demo(`
        <div style="max-inline-size:15rem;border:1px solid var(--color-border);border-radius:12px">
            <pl-app-navigation label="Main">
                <p data-section>Workspace</p>
                <a href="#" aria-current="page"><pl-icon icon="mail" size="1.05rem"></pl-icon> Inbox</a>
                <a href="#"><pl-icon icon="calendar" size="1.05rem"></pl-icon> Calendar</a>
                <a href="#"><pl-icon icon="storefront" size="1.05rem"></pl-icon> Orders</a>
                <p data-section>Account</p>
                <a href="#"><pl-icon icon="swatch" size="1.05rem"></pl-icon> Appearance</a>
            </pl-app-navigation>
        </div>
    `, { layout: 'stack' }),

    callout('note', 'aria-current is the active state. There is no class',
        `The current link is marked with <code>aria-current="page"</code>, and the active style
         keys off that same attribute. One source of truth: what a screen reader announces and what
         a sighted user sees cannot drift apart, which is exactly what happens when a
         <code>.is-active</code> class and an ARIA attribute are maintained separately.`),

    section('Grouping'),

    p(`Mark a heading with <code>data-section</code>. It is a label, not a link, and it stays a
       plain element. Nothing here turns it into a control.`),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>label</code>', '<code>String</code>', 'Names the landmark. Defaults to "Main".'] },
            { cells: ['<code>data-section</code>', '<em>on a child</em>', 'A group heading.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--nav-padding</code>', 'Padding around the rail.'] },
            { cells: ['<code>--nav-background</code>', 'Rail background. Transparent by default, so it takes the surface it sits on.'] },
            { cells: ['<code>--nav-current</code>', 'Fill behind the current link.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'A <code>&lt;nav&gt;</code> landmark with an accessible name from <code>label</code>. Set it, especially if the page has more than one nav.',
        'Mark the current page with <code>aria-current="page"</code> on its link. That is what the active style keys off.',
        'The links are real links: middle-click, open-in-new-tab, and browser history all work without anything being wired up.',
        'Icons inside links are decorative: the link text is the accessible name, so leave the icon unlabelled rather than duplicating it.',
    ]),
);
