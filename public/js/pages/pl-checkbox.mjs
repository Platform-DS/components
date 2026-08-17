// ------------------------------
// Documentation: pl-checkbox
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-checkbox',
        title: 'Checkbox',
        lede: 'A drawn box over a real checkbox: styled, but still the platform underneath.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>InputElement</code> (type checkbox)',
        'Form-associated': 'Yes',
        'Import': '<code>@platformdesign/components/pl-checkbox</code>',
    }),

    p(`<code>&lt;pl-checkbox&gt;</code> draws its box in the shadow root but keeps a real
       <code>&lt;input type="checkbox"&gt;</code> for focus, keyboard, and form value. The visual
       mirrors the input's <code>:checked</code> and <code>:focus-visible</code> state through
       CSS, so behaviour is never reimplemented, only repainted.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-checkbox';`, 'js'),

    p('The label is slotted inline; clicking it toggles the box.'),

    demo(`
        <pl-checkbox name="terms" value="yes">I agree to the terms</pl-checkbox>
    `, { layout: 'stack' }),

    section('States'),

    demo(`
        <pl-checkbox>Unchecked</pl-checkbox>
        <pl-checkbox checked>Checked</pl-checkbox>
        <pl-checkbox checked disabled>Disabled</pl-checkbox>
    `, { layout: 'stack' }),

    section('In a form'),

    p(`A checkbox submits its <code>value</code> (or <code>"on"</code>) only when checked, and
       nothing when unchecked: the native serialisation, preserved through the shadow boundary.`),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').value = [...new FormData(event.target).keys()].join(', ') || '(none checked)'">
            <pl-checkbox name="newsletter" value="yes" checked>Newsletter</pl-checkbox>
            <pl-checkbox name="offers" value="yes">Partner offers</pl-checkbox>
            <div data-actions><pl-button type="submit" data-size="sm">Submit</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Props'),

    table(
        ['Prop', 'Type', 'Description'],
        [
            { native: true, cells: ['<code>checked</code>', '<code>Boolean</code>', 'Checked state.'] },
            { native: true, cells: ['<code>value</code>', '<code>String</code>', 'Submitted when checked (defaults to <code>"on"</code>).'] },
            { native: true, cells: ['<code>name</code>', '<code>String</code>', 'Field name for form submission.'] },
            { native: true, cells: ['<code>required</code>', '<code>Boolean</code>', 'Must be checked to pass validation.'] },
            { native: true, cells: ['<code>disabled</code>', '<code>Boolean</code>', 'Native disabled.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--checkbox-checked</code>', 'Fill and border color when checked.'] },
            { cells: ['<code>--checkbox-border</code>', 'Border color when unchecked.'] },
            { cells: ['<code>--checkbox-check</code>', 'Checkmark color.'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [
            { cells: ['<code>wrapper</code>', 'The <code>&lt;label&gt;</code> wrapping box and text.'] },
            { cells: ['<code>input</code>', 'The internal checkbox.'] },
            { cells: ['<code>box</code>', 'The drawn box.'] },
            { cells: ['<code>label</code>', 'The slotted label text.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'A real <code>&lt;input type="checkbox"&gt;</code> under the visual, so role, keyboard (Space), and focus are the platform\'s.',
        'The slotted label is inside the internal <code>&lt;label&gt;</code>, so clicking the text toggles the box.',
        'The drawn box is <code>aria-hidden</code>; assistive tech reads the real control.',
        'Focus ring appears on keyboard focus via <code>:focus-visible</code>.',
    ]),
);
