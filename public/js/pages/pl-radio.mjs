// ------------------------------
// Documentation — pl-radio
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-radio',
        title: 'Radio',
        lede: 'A styled radio that regroups what the shadow boundary splits apart.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>InputElement</code> (type radio)',
        'Form-associated': 'Yes',
        'Import': '<code>@platformdesign/components/pl-radio</code>',
    }),

    p(`<code>&lt;pl-radio&gt;</code> draws a ring and dot over a real
       <code>&lt;input type="radio"&gt;</code>, mirroring its state through CSS. Like the checkbox,
       the native control stays for focus, keyboard, and form value.`),

    callout('note', 'Grouping is restored, not inherited',
        `Native radios group by <code>name</code> because they share a document. These each wrap
         their own input in a separate shadow root, so the browser can't group them — the component
         restores it: selecting one unchecks its same-named peers within the nearest
         <code>&lt;form&gt;</code> (or the document), exactly the scope native radios use.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-radio';`, 'js'),

    p('Give every option in a group the same <code>name</code>.'),

    demo(`
        <pl-radio name="plan" value="free" checked>Free</pl-radio>
        <pl-radio name="plan" value="pro">Pro</pl-radio>
        <pl-radio name="plan" value="team">Team</pl-radio>
    `, { layout: 'stack' }),

    section('States'),

    demo(`
        <pl-radio name="s" value="a">Default</pl-radio>
        <pl-radio name="s" value="b" checked>Selected</pl-radio>
        <pl-radio name="t" value="c" disabled>Disabled</pl-radio>
    `, { layout: 'stack' }),

    section('In a form'),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').value = 'plan = ' + (new FormData(event.target).get('plan') ?? '(none)')">
            <pl-radio name="plan" value="free" checked>Free</pl-radio>
            <pl-radio name="plan" value="pro">Pro</pl-radio>
            <div data-actions><pl-button type="submit" size="sm">Submit</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Props'),

    table(
        ['Prop', 'Type', 'Description'],
        [
            { native: true, cells: ['<code>checked</code>', '<code>Boolean</code>', 'Selected state.'] },
            { native: true, cells: ['<code>value</code>', '<code>String</code>', 'Submitted when selected.'] },
            { native: true, cells: ['<code>name</code>', '<code>String</code>', 'Group name — options sharing it are mutually exclusive.'] },
            { native: true, cells: ['<code>disabled</code>', '<code>Boolean</code>', 'Native disabled.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--radio-checked</code>', 'Ring and dot colour when selected.'] },
            { cells: ['<code>--radio-border</code>', 'Ring colour when unselected.'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [
            { cells: ['<code>wrapper</code>', 'The <code>&lt;label&gt;</code> wrapping ring and text.'] },
            { cells: ['<code>input</code>', 'The internal radio.'] },
            { cells: ['<code>box</code>', 'The drawn ring.'] },
            { cells: ['<code>label</code>', 'The slotted label text.'] },
        ],
    ),

    callout('note', 'A group of many is coming',
        `For roving-tabindex keyboard navigation, a single group label, and layout, a dedicated
         <code>&lt;pl-radio-group&gt;</code> is planned. Until then, same-named radios group and
         submit correctly on their own.`),

    section('Accessibility'),

    ul([
        'A real <code>&lt;input type="radio"&gt;</code>, so role and Space/arrow behaviour within a native group are the platform\'s.',
        'The drawn ring is <code>aria-hidden</code>; assistive tech reads the real control.',
        'The slotted label toggles selection via the internal <code>&lt;label&gt;</code>.',
    ]),
);
