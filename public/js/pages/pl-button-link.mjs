// ------------------------------
// Documentation — pl-button-link
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-button-link',
        title: 'Button Link',
        lede: 'A link that looks like a button — and stays a link where it counts.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>AnchorElement</code>',
        'Wraps': '<code>&lt;a&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-button-link</code>',
    }),

    p(`<code>&lt;pl-button-link&gt;</code> wears the exact <a href="/documentation/pl-button">pl-button</a>
       look on a real <code>&lt;a&gt;</code>, so it inherits native navigation — <code>href</code>,
       <code>target</code>, <code>rel</code>, <code>download</code>, middle-click, "open in new
       tab", the lot. It shares the same <code>--button-*</code> hooks, so
       <code>pl-button, pl-button-link { … }</code> themes both at once.`),

    callout('note', 'Link or button — pick by what it does',
        `This stays an <code>&lt;a&gt;</code>, announced as a link, because it <em>navigates</em>.
         Reach for <a href="/documentation/pl-button">pl-button</a> when the action isn't going
         somewhere — submitting, toggling, opening a dialog. Looking alike shouldn't make them
         behave alike to assistive tech.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-button-link';`, 'js'),

    demo(`<pl-button-link href="/documentation">Read the docs</pl-button-link>`),

    section('Variants'),

    demo(`
        <pl-button-link href="#" variant="primary">Primary</pl-button-link>
        <pl-button-link href="#" variant="secondary">Secondary</pl-button-link>
        <pl-button-link href="#" variant="ghost">Ghost</pl-button-link>
        <pl-button-link href="#" variant="danger">Danger</pl-button-link>
    `),

    section('Sizes'),

    demo(`
        <pl-button-link href="#" size="sm">Small</pl-button-link>
        <pl-button-link href="#" size="md">Medium</pl-button-link>
        <pl-button-link href="#" size="lg">Large</pl-button-link>
    `),

    section('Opening in a new tab'),

    p('Native anchor attributes work as they always do:'),

    demo(`
        <pl-button-link href="https://example.com" target="_blank" rel="noopener" variant="secondary">
            Open example.com
        </pl-button-link>
    `),

    section('Disabled'),

    p(`An <code>&lt;a&gt;</code> can't be <code>:disabled</code>, so a disabled link is made inert:
       its <code>href</code> is dropped, it's taken out of the tab order, and it's marked
       <code>aria-disabled</code>.`),

    demo(`<pl-button-link href="#" disabled>Disabled</pl-button-link>`),

    section('Props'),

    table(
        ['Prop', 'Type', 'Default', 'Description'],
        [
            { cells: ['<code>variant</code>', '<code>String</code>', '<code>"primary"</code>', '<code>primary</code>, <code>secondary</code>, <code>ghost</code>, <code>danger</code>.'] },
            { cells: ['<code>size</code>', '<code>String</code>', '<code>"md"</code>', '<code>sm</code>, <code>md</code>, <code>lg</code>.'] },
            { cells: ['<code>full</code>', '<code>Boolean</code>', '<code>false</code>', 'Stretch to fill the container.'] },
            { cells: ['<code>disabled</code>', '<code>Boolean</code>', '<code>false</code>', 'Make the link inert.'] },
            { native: true, cells: ['<code>href</code>', '<code>String</code>', '—', 'Native. Destination URL.'] },
            { native: true, cells: ['<code>target</code>', '<code>String</code>', '—', 'Native. e.g. <code>_blank</code>.'] },
            { native: true, cells: ['<code>rel</code>', '<code>String</code>', '—', 'Native. e.g. <code>noopener</code>.'] },
            { native: true, cells: ['<code>download</code>', '<code>String</code>', '—', 'Native. Download the target.'] },
        ],
    ),

    section('Custom properties'),

    p('The same hooks as <a href="/documentation/pl-button">pl-button</a>:'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--button-background</code>', 'Fill colour.'] },
            { cells: ['<code>--button-color</code>', 'Text colour.'] },
            { cells: ['<code>--button-border</code>', 'Border colour.'] },
            { cells: ['<code>--button-background-hover</code>', 'Hover fill.'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [{ cells: ['<code>anchor</code>', 'The internal <code>&lt;a&gt;</code>.'] }],
    ),

    section('Accessibility'),

    ul([
        'Stays a real <code>&lt;a&gt;</code>, so it\'s announced as a link and supports every native open-in gesture.',
        'Use it for navigation; use <a href="/documentation/pl-button">pl-button</a> for actions.',
        'Disabled links are removed from the tab order and marked <code>aria-disabled</code>.',
        'Focus rings use <code>:focus-visible</code>.',
    ]),
);
