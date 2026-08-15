// ------------------------------
// Documentation: pl-textarea
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-textarea',
        title: 'Textarea',
        lede: 'A multi-line field that grows with its content and submits in a form.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>TextareaElement</code>',
        'Wraps': '<code>&lt;textarea&gt;</code>',
        'Form-associated': 'Yes',
        'Import': '<code>@platformdesign/components/pl-textarea</code>',
    }),

    p(`<code>&lt;pl-textarea&gt;</code> wraps a real <code>&lt;textarea&gt;</code> and inherits its
       whole surface: <code>rows</code>, <code>maxlength</code>, <code>wrap</code>,
       <code>readonly</code>, the value and selection properties, and the
       <code>input</code>/<code>change</code> events. It grows with its content where the browser
       supports <code>field-sizing</code>, and resizes vertically otherwise.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-textarea';`, 'js'),

    demo(`<pl-textarea placeholder="Tell us what you think…"></pl-textarea>`, { layout: 'stack' }),

    callout('note', 'The value is a property, not an attribute',
        `A <code>&lt;textarea&gt;</code> has no <code>value</code> attribute. Its value is its text
         content or its <code>value</code> property. Set it with <code>el.value = …</code>, exactly
         as with a plain textarea.`),

    section('States'),

    demo(`
        <pl-textarea readonly>This content is read-only.</pl-textarea>
        <pl-textarea placeholder="Disabled" disabled></pl-textarea>
        <pl-textarea placeholder="Required" required></pl-textarea>
    `, { layout: 'stack' }),

    section('In a form'),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').value = new FormData(event.target).get('bio') || '(empty)'">
            <pl-textarea name="bio" placeholder="Short bio"></pl-textarea>
            <div data-actions><pl-button type="submit">Save</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Props'),

    table(
        ['Prop', 'Type', 'Description'],
        [
            { native: true, cells: ['<code>value</code>', '<code>String</code>', 'Current value (property; also settable as text content).'] },
            { native: true, cells: ['<code>placeholder</code>', '<code>String</code>', 'Placeholder text.'] },
            { native: true, cells: ['<code>rows</code>', '<code>Number</code>', 'Initial visible line count.'] },
            { native: true, cells: ['<code>name</code>', '<code>String</code>', 'Field name for form submission.'] },
            { native: true, cells: ['<code>required</code>', '<code>Boolean</code>', 'Must be filled to pass validation.'] },
            { native: true, cells: ['<code>disabled</code>, <code>readonly</code>', '<code>Boolean</code>', 'Native disabled / read-only.'] },
            { native: true, cells: ['<code>maxlength</code>, <code>minlength</code>', '<code>Number</code>', 'Length constraints.'] },
            { native: true, cells: ['<code>wrap</code>', '<code>String</code>', '<code>soft</code> or <code>hard</code> wrapping.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--textarea-min-height</code>', 'Minimum height (default <code>6rem</code>).'] },
            { cells: ['<code>--textarea-resize</code>', 'Resize handle: <code>vertical</code> (default), <code>none</code>, <code>both</code>.'] },
            { cells: ['<code>--field-border</code>, <code>--field-accent</code>, <code>--field-ring</code>', 'Shared with pl-input.'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [{ cells: ['<code>textarea</code>', 'The internal <code>&lt;textarea&gt;</code>.'] }],
    ),

    section('Accessibility'),

    ul([
        'A real <code>&lt;textarea&gt;</code>, so scrolling, selection, and validation are native.',
        'Give it a name with <a href="/documentation/pl-label">pl-label</a> or <code>aria-label</code>.',
        'Vertical-only resize by default, so it can\'t break out of its column.',
    ]),
);
