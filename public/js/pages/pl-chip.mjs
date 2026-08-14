// ------------------------------
// Documentation — pl-chip
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table, el } from '../components/doc.mjs';

/** A small live multi-select: click a chip's × and it actually leaves the list. */
function removableDemo() {
    const stage = el('div', { class: 'demo__stage', style: 'display:flex;flex-wrap:wrap;gap:.5rem;align-items:center' });

    const names = ['United States', 'Canada', 'Mexico'];
    for (const name of names) {
        const chip = document.createElement('pl-chip');
        chip.setAttribute('removable', '');
        chip.textContent = name;
        chip.addEventListener('pl-remove', () => chip.remove());
        stage.append(chip);
    }

    return el('div', { class: 'demo' }, stage);
}

export default () => page(
    header({
        tag: 'pl-chip',
        title: 'Chip',
        lede: 'A rounded pill around a piece of text — a sort selection, a multi-select\'s chosen option.',
    }),

    meta({
        'DOM mode': '<strong>Shadow</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': 'A bordered pill around a <code>&lt;slot&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-chip</code>',
    }),

    p(`Nothing more than a rounded, bordered pill around slotted text — bordered by default,
       because a row of same-background chips needs an edge to read as separate pieces. Add
       <code>removable</code> for the × that a sort or multi-select chip needs to be dismissed.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-chip';`, 'js'),

    demo(`
        <pl-chip>Draft</pl-chip>
        <pl-chip removable>Marketing</pl-chip>
    `),

    section('The × is a real button'),

    p(`Focusable, activated with Space or Enter, announced as a button — everything a
       <code>&lt;div onclick&gt;</code> would silently drop. <code>all: unset</code> strips its
       native chrome first, so none of that shows: it just reads as a small glyph that happens to
       be interactive.`),

    section('Removing is the consumer\'s job'),

    p(`Clicking × does not remove the chip — it only emits <code>pl-remove</code> and leaves the
       chip exactly where it was. This library's rule is events up, state down: the same reason
       <a href="/documentation/pl-switch">pl-switch</a> doesn't grey itself out and
       <a href="/documentation/pl-radio-group">pl-radio-group</a> doesn't delete options on its
       own. A working multi-select removes the chip from whatever list is rendering it:`),

    removableDemo(),

    code(`
        for (const chip of document.querySelectorAll('pl-chip')) {
            chip.addEventListener('pl-remove', () => {
                chip.remove();                 // or: selected.delete(chip.value)
            });
        }
    `, 'js'),

    section('Identity, when the label alone isn\'t enough'),

    p(`<code>value</code> is what shows up in <code>pl-remove</code>'s detail — set it when the
       visible text isn't a stable identifier on its own, like a country name standing in for its
       code:`),

    demo(`
        <pl-chip removable value="us">United States</pl-chip>
    `),

    code(`
        document.querySelector('pl-chip')
            .addEventListener('pl-remove', event => {
                console.log(event.detail.value);   // "us" — falls back to the chip's text if unset
            });
    `, 'js'),

    section('Long text'),

    p('Constrained to a width from outside, a chip\'s label truncates with an ellipsis rather than wrapping or overflowing its pill:'),

    demo(`
        <pl-chip removable style="max-inline-size: 10rem">A genuinely very long option name</pl-chip>
    `),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>removable</code>', '<code>Boolean</code>', 'Shows the × button. Off by default — a plain status tag needs no way to dismiss itself.'] },
            { cells: ['<code>value</code>', '<code>String</code>', 'Identity carried in <code>pl-remove</code>. Defaults to the chip\'s own text.'] },
        ],
    ),

    section('Properties and events'),

    table(
        ['Member', 'Description'],
        [
            { cells: ['<code>value</code>', 'Get or set the identity — the explicit <code>value</code>, or the visible text.'] },
            { cells: ['<code>pl-remove</code>', 'Fired by the × button. <code>detail.value</code> is the chip\'s identity. Does not remove the chip.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--chip-background</code>, <code>--chip-color</code>, <code>--chip-border</code>', 'The pill\'s fill, text, and edge.'] },
            { cells: ['<code>--chip-radius</code>', 'Corner radius. Defaults to fully rounded.'] },
            { cells: ['<code>--chip-padding-inline</code> / <code>--chip-padding-block</code>', 'Pill padding.'] },
            { cells: ['<code>--chip-gap</code>', 'Space between the label and the × button.'] },
            { cells: ['<code>--chip-remove-size</code>', 'The × button\'s width and height.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'The × is a real <code>&lt;button type="button"&gt;</code> — reachable by Tab, activated with Space/Enter, and announced as a button despite carrying none of a button\'s default appearance.',
        'Its <code>aria-label</code> is "Remove {chip\'s text}", not a bare "Remove" — several chips in a row would otherwise announce identically to someone browsing by button.',
        'The chip itself carries no interactive role; only the × does. A non-removable chip is a plain, non-interactive pill.',
    ]),
);
