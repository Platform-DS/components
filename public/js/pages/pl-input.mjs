// ------------------------------
// Documentation: pl-input
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-input',
        title: 'Input',
        lede: 'One themed field for every text-like input type, and it submits in a form.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>InputElement</code>',
        'Wraps': '<code>&lt;input&gt;</code>',
        'Form-associated': 'Yes',
        'Import': '<code>@platformdesign/components/pl-input</code>',
    }),

    p(`<code>&lt;pl-input&gt;</code> puts a real <code>&lt;input&gt;</code> in its shadow root
       and inherits the entire native surface: <code>value</code>, <code>placeholder</code>,
       <code>required</code>, <code>pattern</code>, <code>min</code>/<code>max</code>/<code>step</code>,
       the validity and selection properties, <code>checkValidity()</code>,
       <code>showPicker()</code>, and the <code>input</code>/<code>change</code>/<code>invalid</code>
       events. Set <code>type</code> exactly as you would on a plain input; one component covers
       them all.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-input';`, 'js'),

    demo(`<pl-input type="email" placeholder="you@example.com"></pl-input>`, { layout: 'stack' }),

    section('Types'),

    p('Any type a native input supports works: the styling is shared across all of them.'),

    demo(`
        <pl-input type="text" placeholder="Text"></pl-input>
        <pl-input type="password" placeholder="Password"></pl-input>
        <pl-input type="number" placeholder="Number"></pl-input>
        <pl-input type="date"></pl-input>
        <pl-input type="search" placeholder="Search"></pl-input>
    `, { layout: 'stack' }),

    section('States'),

    demo(`
        <pl-input value="Read-only value" readonly></pl-input>
        <pl-input value="Disabled" disabled></pl-input>
        <pl-input type="email" value="not-an-email" required></pl-input>
    `, { layout: 'stack' }),

    callout('note', 'Invalid styling waits for interaction',
        `The red invalid state uses <code>:user-invalid</code>, so a field never turns red on
         first paint, only after the user has typed in it and moved on, or after a submit
         attempt. That's the native behaviour, preserved.`),

    section('In a form'),

    p(`Because the component is form-associated, its value is submitted with the surrounding
       <code>&lt;form&gt;</code> even though the real input lives in a shadow root, no JavaScript
       bridge, no hidden mirror field.`),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').value = new URLSearchParams(new FormData(event.target)).toString()">
            <pl-input name="email" type="email" value="a@b.com" required></pl-input>
            <div data-actions><pl-button type="submit">Submit</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Labelling'),

    p(`An input needs an accessible name. Wrap it in a <a href="/documentation/pl-label">pl-label</a>
       (which also wires up hint and error text), or set <code>aria-label</code> for a standalone
       field.`),

    code(`
        <pl-label text="Email" hint="We'll never share it.">
            <pl-input type="email" name="email" required></pl-input>
        </pl-label>
    `, 'html'),

    section('Props'),

    p('Every attribute is the native one, inherited from <code>&lt;input&gt;</code>: a representative set:'),

    table(
        ['Prop', 'Type', 'Description'],
        [
            { native: true, cells: ['<code>type</code>', '<code>String</code>', 'Any input type: text, email, password, number, search, url, tel, date, …'] },
            { native: true, cells: ['<code>value</code>', '<code>String</code>', 'Current value.'] },
            { native: true, cells: ['<code>placeholder</code>', '<code>String</code>', 'Placeholder text.'] },
            { native: true, cells: ['<code>name</code>', '<code>String</code>', 'Field name for form submission.'] },
            { native: true, cells: ['<code>required</code>', '<code>Boolean</code>', 'Must be filled to pass validation.'] },
            { native: true, cells: ['<code>disabled</code>, <code>readonly</code>', '<code>Boolean</code>', 'Native disabled / read-only.'] },
            { native: true, cells: ['<code>min</code>, <code>max</code>, <code>step</code>', '<code>String</code>', 'Numeric / date constraints.'] },
            { native: true, cells: ['<code>pattern</code>, <code>minlength</code>, <code>maxlength</code>', '<code>String</code>', 'Validation constraints.'] },
            { native: true, cells: ['<code>autocomplete</code>', '<code>String</code>', 'Autofill hint.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--field-background</code>', 'Field background.'] },
            { cells: ['<code>--field-border</code>', 'Border color, all sides.'] },
            { cells: ['<code>--field-border-width</code>', 'Border width, all sides. Defaults to <code>--pl-border-width-small</code>.'] },
            { cells: ['<code>--field-border-inline-start-width</code>, <code>-inline-end-width</code>, <code>-block-start-width</code>, <code>-block-end-width</code>', 'One side\'s width, overriding <code>--field-border-width</code> for that side only — drop three of the four to zero for an underline field. See <a href="/documentation/theming">Theming</a>.'] },
            { cells: ['<code>--field-border-hover</code>', 'Border color on hover.'] },
            { cells: ['<code>--field-accent</code>', 'Focus border color.'] },
            { cells: ['<code>--field-ring</code>', 'Focus ring color.'] },
            { cells: ['<code>--field-shadow</code>', 'Resting elevation, layered under the focus/error/success ring rather than replaced by it. Defaults to <code>--pl-box-shadow-input</code> (invisible).'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [{ cells: ['<code>input</code>', 'The internal <code>&lt;input&gt;</code>.'] }],
    ),

    section('Accessibility'),

    ul([
        'The internal element is a real <code>&lt;input&gt;</code>, so type-specific keyboard behaviour, validation, and autofill are the platform\'s.',
        'Always give it a name: via <a href="/documentation/pl-label">pl-label</a> or <code>aria-label</code>.',
        'Focus is delegated, so <code>.focus()</code> and a wrapping label reach the real input.',
        'Invalid styling is <code>:user-invalid</code>, so errors show after interaction, not before.',
    ]),
);
