// ------------------------------
// Documentation — pl-color-picker
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-color-picker',
        title: 'Color Picker',
        lede: 'A swatch and a hex field behind one border, each kept in step with the other.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': '<code>&lt;input type="color"&gt;</code> + <code>&lt;input type="text"&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-color-picker</code>',
    }),

    p(`Two real inputs made to look like one field. The swatch opens the operating system's own
       colour picker — the reason to use <code>&lt;input type="color"&gt;</code> rather than draw a
       swatch and build a picker — and the text field lets someone paste a hex value they already
       have.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-color-picker';`, 'js'),

    demo(`
        <pl-color-picker name="brand" value="#2563EB"></pl-color-picker>
    `, { layout: 'stack' }),

    section('Two-way binding, with events'),

    p(`The inputs stay in step by listening to each other — no store, no observer. A shared state
       container would be real machinery for what is genuinely two DOM nodes agreeing on one
       string.`),

    ul([
        'Dragging in the OS picker fires <code>input</code> continuously, so the hex updates live rather than waiting for the dialog to close.',
        'Typing only propagates once the text is <em>actually a colour</em> — otherwise a half-typed <code>#2</code> would keep resetting the swatch to black.',
        'On blur the text is tidied: <code>#abc</code> expands to <code>#AABBCC</code>, a missing hash is added, and unusable input snaps back to the current colour.',
    ]),

    demo(`
        <pl-color-picker value="#047857"
            oninput="this.nextElementSibling.textContent = this.value"></pl-color-picker>
        <output>#047857</output>
    `, { layout: 'stack' }),

    p(`That demo listens for the native <code>input</code> event, which bubbles out of the inner
       controls because they are in the page's DOM. For the normalised value specifically, listen
       for <code>pl-change</code>:`),

    code(`
        document.querySelector('pl-color-picker')
            .addEventListener('pl-change', event => {
                console.log(event.detail.value);   // always #rrggbb
            });
    `, 'js'),

    callout('note', 'One value, one form entry',
        `Only the colour input carries the <code>name</code>. The text field is a typed alias of the
         same value, so a form receives a single <code>brand=%23ff8800</code> entry rather than two
         competing ones.`),

    section('Accepted input'),

    p('The text field takes any spelling of a hex colour and normalises it:'),

    table(
        ['You type', 'You get'],
        [
            { cells: ['<code>#abc</code>', '<code>#AABBCC</code>'] },
            { cells: ['<code>2563eb</code>', '<code>#2563EB</code>'] },
            { cells: ['<code>#FF8800</code>', '<code>#FF8800</code>'] },
            { cells: ['anything else', 'reverts to the current colour on blur'] },
        ],
    ),

    section('States'),

    demo(`
        <pl-color-picker value="#B91C1C"></pl-color-picker>
        <pl-color-picker value="#6B7280" disabled></pl-color-picker>
    `, { layout: 'stack' }),

    section('In a form'),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').textContent = new FormData(event.target).get('accent')">
            <pl-color-picker name="accent" value="#7C3AED"></pl-color-picker>
            <div data-actions><pl-button type="submit" size="sm">Submit</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>value</code>', '<code>String</code>', 'The colour, normalised to <code>#rrggbb</code>.'] },
            { cells: ['<code>name</code>', '<code>String</code>', 'Field name for form submission.'] },
            { cells: ['<code>disabled</code>', '<code>Boolean</code>', 'Disables both inputs.'] },
            { cells: ['<code>required</code>', '<code>Boolean</code>', 'Applied to the colour input.'] },
        ],
    ),

    section('Properties and events'),

    table(
        ['Member', 'Description'],
        [
            { cells: ['<code>value</code>', 'Get or set the colour. Setting accepts any spelling and normalises it.'] },
            { cells: ['<code>swatch</code> / <code>textInput</code>', 'The two real inputs, if you need them.'] },
            { cells: ['<code>pl-change</code>', 'Fired on every change; <code>detail.value</code> is the normalised hex.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--picker-width</code>', 'Maximum width of the field.'] },
            { cells: ['<code>--field-border</code>, <code>--field-accent</code>, <code>--field-ring</code>', 'Shared with the other fields — see <a href="/documentation/pl-input">pl-input</a>.'] },
        ],
    ),

    callout('note', 'Why the hooks are --picker-* and not --color-picker-*',
        `The token contract reserves the <code>--color-*</code> prefix for colours, so a width
         living under it would be ambiguous — is <code>--color-picker-width</code> a colour named
         "picker-width"? The component's hooks use <code>--picker-*</code> to stay out of that
         namespace.`),

    section('Accessibility'),

    ul([
        'Both inputs are real controls, so the OS picker, keyboard entry, and paste all work natively.',
        'The two share a single focus ring via <code>:focus-within</code>, so they read as one field while remaining two tab stops.',
        'The text field carries its own <code>aria-label</code> — it mirrors the swatch, so it would otherwise be an unlabelled input.',
        'Wrap the component in <a href="/documentation/pl-label">pl-label</a> to name the field itself.',
        'Invalid hex text is styled only after interaction, using <code>:user-invalid</code>.',
    ]),
);
