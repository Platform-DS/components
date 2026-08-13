// ------------------------------
// Documentation — pl-button
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-button',
        title: 'Button',
        lede: 'A real <button>, styled and extended — not a <div> pretending.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>ButtonElement</code>',
        'Wraps': '<code>&lt;button&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-button</code>',
    }),

    p(`<code>&lt;pl-button&gt;</code> puts a genuine <code>&lt;button&gt;</code> in its shadow
       root and bridges the whole native surface to it. Everything a button does — submitting
       forms, participating in validation, responding to Enter and Space, announcing itself as a
       button — is inherited, not reimplemented.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-button';`, 'js'),

    demo(`<pl-button>Save changes</pl-button>`),

    section('Variants'),

    demo(`
        <pl-button variant="primary">Primary</pl-button>
        <pl-button variant="secondary">Secondary</pl-button>
        <pl-button variant="ghost">Ghost</pl-button>
        <pl-button variant="danger">Danger</pl-button>
    `),

    section('Sizes'),

    demo(`
        <pl-button size="sm">Small</pl-button>
        <pl-button size="md">Medium</pl-button>
        <pl-button size="lg">Large</pl-button>
    `),

    section('Loading'),

    p(`<code>loading</code> disables the button and sets <code>aria-busy</code> on the real
       element inside. The label stays in place but turns transparent, so the button keeps its
       width and the layout does not jump when the request finishes.`),

    demo(`
        <pl-button loading>Saving</pl-button>
        <pl-button variant="secondary" loading>Saving</pl-button>
    `),

    section('Disabled'),

    p(`<code>disabled</code> is the native attribute, delegated straight to the internal
       <code>&lt;button&gt;</code> — so it behaves exactly as it would on a plain button,
       including being skipped in the tab order.`),

    demo(`
        <pl-button disabled>Disabled</pl-button>
        <pl-button variant="secondary" disabled>Disabled</pl-button>
    `),

    section('Full width'),

    demo(`<pl-button full>Continue</pl-button>`, { layout: 'stack' }),

    section('In a form'),

    p(`This is the part that a <code>&lt;div role="button"&gt;</code> can never do. The submit
       button submits, the reset button resets, and neither needed a line of JavaScript here:`),

    demo(`
        <form onsubmit="event.preventDefault(); this.querySelector('output').value = 'Submitted!'">
            <label>
                Email
                <input type="email" name="email" required placeholder="you@example.com">
            </label>
            <br><br>
            <pl-button type="submit">Submit</pl-button>
            <pl-button type="reset" variant="ghost">Reset</pl-button>
            <output></output>
        </form>
    `, { layout: 'stack' }),

    section('Props'),

    p('Rows marked with a dashed border are native <code>&lt;button&gt;</code> attributes, inherited automatically.'),

    table(
        ['Prop', 'Type', 'Default', 'Description'],
        [
            { cells: ['<code>variant</code>', '<code>String</code>', '<code>"primary"</code>', '<code>primary</code>, <code>secondary</code>, <code>ghost</code>, or <code>danger</code>.'] },
            { cells: ['<code>size</code>', '<code>String</code>', '<code>"md"</code>', '<code>sm</code>, <code>md</code>, or <code>lg</code>.'] },
            { cells: ['<code>loading</code>', '<code>Boolean</code>', '<code>false</code>', 'Shows a spinner, disables the button, sets <code>aria-busy</code>.'] },
            { cells: ['<code>full</code>', '<code>Boolean</code>', '<code>false</code>', 'Stretches the button to fill its container.'] },
            { native: true, cells: ['<code>disabled</code>', '<code>Boolean</code>', '<code>false</code>', 'Native. Disables the button.'] },
            { native: true, cells: ['<code>type</code>', '<code>String</code>', '<code>"submit"</code>', 'Native. <code>submit</code>, <code>reset</code>, or <code>button</code>.'] },
            { native: true, cells: ['<code>name</code>', '<code>String</code>', '—', 'Native. Submitted with the form.'] },
            { native: true, cells: ['<code>value</code>', '<code>String</code>', '—', 'Native. Submitted with the form.'] },
            { native: true, cells: ['<code>form</code>', '<code>String</code>', '—', 'Native. Associates with a form by id.'] },
        ],
    ),

    section('Events'),

    p(`No custom events. <code>click</code>, <code>focus</code>, and <code>blur</code> come from
       the native button and cross the shadow boundary on their own:`),

    code(`
        document.querySelector('pl-button')
            .addEventListener('click', () => save());
    `, 'js'),

    section('Methods'),

    table(
        ['Method', 'Description'],
        [
            { cells: ['<code>focus()</code>', 'Forwarded to the internal button.'] },
            { cells: ['<code>blur()</code>', 'Forwarded to the internal button.'] },
            { cells: ['<code>click()</code>', 'Forwarded to the internal button.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--pl-button-bg</code>', 'Background colour.'] },
            { cells: ['<code>--pl-button-fg</code>', 'Text colour.'] },
            { cells: ['<code>--pl-button-border</code>', 'Border colour.'] },
            { cells: ['<code>--pl-button-bg-hover</code>', 'Hover background.'] },
            { cells: ['<code>--pl-button-bg-active</code>', 'Active background.'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [{ cells: ['<code>button</code>', 'The internal <code>&lt;button&gt;</code> element.'] }],
    ),

    section('Accessibility'),

    ul([
        'The internal element is a real <code>&lt;button&gt;</code>, so its role, keyboard behaviour, and focus handling are the platform\'s.',
        '<code>loading</code> sets <code>aria-busy</code> and disables interaction, so a click cannot land twice.',
        'Focus is delegated: <code>.focus()</code> from outside — or a wrapping <a href="/documentation/pl-label">pl-label</a> — reaches the real button inside.',
        'Focus rings use <code>:focus-visible</code>, so they appear for keyboard users without flashing on a mouse click.',
        'Icon-only buttons need an accessible name — add <code>aria-label</code>.',
    ]),

    callout('a11y', 'Icon-only buttons',
        `<code>&lt;pl-button aria-label="Delete"&gt;&lt;pl-icon icon="trash"&gt;&lt;/pl-icon&gt;&lt;/pl-button&gt;</code>
         — without the label, a screen reader announces "button" and nothing else.`),
);
