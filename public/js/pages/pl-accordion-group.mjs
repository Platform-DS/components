// ------------------------------
// Documentation — pl-accordion-group
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-accordion-group',
        title: 'Accordion Group',
        lede: 'A stack of accordions that know about each other — one open at a time, or as many as you like.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Contains': '<code>&lt;pl-accordion&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-accordion-group</code>',
    }),

    p(`The group exists for the one thing a lone
       <a href="/documentation/pl-accordion">pl-accordion</a> cannot decide: whether opening this
       panel should close that one.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-accordion-group';`, 'js'),

    demo(`
        <pl-accordion-group variant="card">
            <pl-accordion open>
                <h3 data-summary>Do I need a build step?</h3>
                <p>No. Import the module and the element registers itself.</p>
            </pl-accordion>
            <pl-accordion>
                <h3 data-summary>Can I use it with React or Vue?</h3>
                <p>Yes — a custom element is just an element to any framework.</p>
            </pl-accordion>
            <pl-accordion>
                <h3 data-summary>What about server rendering?</h3>
                <p>Light DOM components render their content with no JavaScript at all.</p>
            </pl-accordion>
        </pl-accordion-group>
    `, { layout: 'stack' }),

    p(`Open any panel above and the others close. That is the default, because an FAQ is the
       usual reason to stack disclosures.`),

    section('Opening more than one'),

    p(`Add <code>data-multiple</code> to turn exclusivity off:`),

    demo(`
        <pl-accordion-group variant="card" data-multiple>
            <pl-accordion open>
                <h3 data-summary>Shipping</h3>
                <p>Dispatched within two working days.</p>
            </pl-accordion>
            <pl-accordion open>
                <h3 data-summary>Returns</h3>
                <p>Thirty days, no questions.</p>
            </pl-accordion>
        </pl-accordion-group>
    `, { layout: 'stack' }),

    callout('note', 'Why exclusivity is the default',
        `The attribute's presence adds a capability rather than removing one, which is the way an
         attribute normally reads — <code>multiple</code> on a <code>&lt;select&gt;</code> works
         exactly this way. Naming it the other way round would have meant an
         <code>exclusive</code> attribute that most groups had to remember to set.`),

    section('How the coordination works'),

    p(`<code>pl-accordion</code> emits <code>pl-toggle</code> as a bubbling event, so the group
       listens <strong>once, on itself</strong> and lets the events come to it. Nothing reaches
       into a child to wire anything up, which means accordions added or removed later need no
       registration and no teardown — the group works on whatever is inside it at the moment an
       event arrives.`),

    ul([
        'It only ever reacts to a panel <em>opening</em>. Closing one is nobody else\'s business.',
        '<code>pl-toggle</code> fires on real interaction only, so the panels the group closes cannot echo back at it.',
        'Only direct children are considered — a group nested inside another group\'s panel keeps its own.',
    ]),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>data-multiple</code>', '<code>Boolean</code>', 'Allow any number of panels open at once. Without it, opening one closes the rest.'] },
            { cells: ['<code>variant</code>', '<code>String</code>', '<code>card</code> draws a box around the stack.'] },
        ],
    ),

    section('Properties'),

    table(
        ['Member', 'Description'],
        [
            { cells: ['<code>open</code>', 'The currently open accordions, in DOM order.'] },
            { cells: ['<code>openAll()</code>', 'Opens every panel. A no-op without <code>data-multiple</code>, where it could not be true.'] },
            { cells: ['<code>closeAll()</code>', 'Closes every panel.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'The group adds no roles of its own. Each accordion is already a complete, labelled disclosure, and wrapping them in a <code>tablist</code> or similar would describe them as something they are not.',
        'Closing a sibling never moves focus. The button the user pressed stays focused, which is what lets them keep tabbing from where they were.',
        'Everything else — headings, <code>aria-expanded</code>, the labelled regions — comes from <a href="/documentation/pl-accordion">pl-accordion</a>.',
    ]),
);
