// ------------------------------
// Documentation — pl-select
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-select',
        title: 'Select',
        lede: 'A styled dropdown over a real select — write it with plain options.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>SelectElement</code>',
        'Wraps': '<code>&lt;select&gt;</code>',
        'Form-associated': 'Yes',
        'Import': '<code>@platformdesign/components/pl-select</code>',
    }),

    p(`<code>&lt;pl-select&gt;</code> wraps a real <code>&lt;select&gt;</code> and inherits its whole
       surface — <code>value</code>, <code>selectedIndex</code>, <code>options</code>,
       <code>multiple</code>, <code>required</code>, the <code>change</code> event — and submits
       with the surrounding <code>&lt;form&gt;</code>. Only the closed control is restyled; the
       dropdown popup stays the OS's, which is what keeps it native on touch and with a keyboard.`),

    callout('note', 'Options are adopted, not slotted',
        `A native <code>&lt;select&gt;</code> builds its list from real <code>&lt;option&gt;</code>
         children — it won't read them through a <code>&lt;slot&gt;</code>. So the component moves
         the options you write into the internal select on connect (and watches for later
         additions). You still write plain <code>&lt;option&gt;</code>s; they just end up where the
         browser needs them.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-select';`, 'js'),

    demo(`
        <pl-select name="plan">
            <option value="free">Free</option>
            <option value="pro" selected>Pro</option>
            <option value="team">Team</option>
        </pl-select>
    `, { layout: 'stack' }),

    section('Groups'),

    p('<code>&lt;optgroup&gt;</code> works exactly as it does in a plain select.'),

    demo(`
        <pl-select name="city">
            <optgroup label="Europe">
                <option>London</option>
                <option>Berlin</option>
            </optgroup>
            <optgroup label="Americas">
                <option>New York</option>
                <option>São Paulo</option>
            </optgroup>
        </pl-select>
    `, { layout: 'stack' }),

    section('States'),

    demo(`
        <pl-select name="a">
            <option>First</option>
            <option>Second</option>
        </pl-select>
        <pl-select name="b" disabled>
            <option>Disabled</option>
        </pl-select>
        <pl-select name="c" required>
            <option value="">Choose…</option>
            <option value="x">An option</option>
        </pl-select>
    `, { layout: 'stack' }),

    section('In a form'),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').value = 'plan = ' + new FormData(event.target).get('plan')">
            <pl-select name="plan">
                <option value="free">Free</option>
                <option value="pro">Pro</option>
            </pl-select>
            <div data-actions><pl-button type="submit" size="sm">Submit</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Props'),

    table(
        ['Prop', 'Type', 'Description'],
        [
            { native: true, cells: ['<code>value</code>', '<code>String</code>', 'Selected option\'s value (property).'] },
            { native: true, cells: ['<code>name</code>', '<code>String</code>', 'Field name for form submission.'] },
            { native: true, cells: ['<code>required</code>', '<code>Boolean</code>', 'A value must be chosen to pass validation.'] },
            { native: true, cells: ['<code>disabled</code>', '<code>Boolean</code>', 'Native disabled.'] },
            { native: true, cells: ['<code>multiple</code>', '<code>Boolean</code>', 'Allow multiple selections (renders as a list box).'] },
            { native: true, cells: ['<code>size</code>', '<code>Number</code>', 'Number of rows shown when expanded / for multiple.'] },
            { native: true, cells: ['<code>selectedIndex</code>', '<code>Number</code>', 'Index of the selected option (property).'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--select-arrow</code>', 'Chevron colour.'] },
            { cells: ['<code>--field-border</code>, <code>--field-accent</code>, <code>--field-ring</code>', 'Shared field chrome (see pl-input).'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [
            { cells: ['<code>wrapper</code>', 'The positioning wrapper (control + chevron).'] },
            { cells: ['<code>select</code>', 'The internal <code>&lt;select&gt;</code>.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'A real <code>&lt;select&gt;</code>, so the popup, keyboard, type-ahead, and touch behaviour are entirely the platform\'s.',
        'Give it a name with <a href="/documentation/pl-label">pl-label</a> or <code>aria-label</code>.',
        'The chevron is <code>aria-hidden</code>; the native control carries the semantics.',
        'For a required select, include an empty first option (<code>value=""</code>) so "nothing chosen" can fail validation.',
    ]),
);
