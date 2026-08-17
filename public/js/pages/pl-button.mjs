// ------------------------------
// Documentation: pl-button
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-button',
        title: 'Button',
        lede: 'A real <button>, styled and extended, not a <div> pretending.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>ButtonElement</code>',
        'Wraps': '<code>&lt;button&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-button</code>',
    }),

    p(`<code>&lt;pl-button&gt;</code> puts a genuine <code>&lt;button&gt;</code> in its shadow
       root and bridges the whole native surface to it. Everything a button does: submitting
       forms, participating in validation, responding to Enter and Space, announcing itself as a
       button: is inherited, not reimplemented.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-button';`, 'js'),

    demo(`<pl-button>Save changes</pl-button>`),

    section('Variants'),

    demo(`
        <pl-button data-variant="primary">Primary</pl-button>
        <pl-button data-variant="secondary">Secondary</pl-button>
        <pl-button data-variant="ghost">Ghost</pl-button>
        <pl-button data-variant="danger">Danger</pl-button>
    `),

    section('Sizes'),

    demo(`
        <pl-button data-size="sm">Small</pl-button>
        <pl-button data-size="md">Medium</pl-button>
        <pl-button data-size="lg">Large</pl-button>
    `),

    section('Loading'),

    p(`<code>data-loading</code> disables the button and sets <code>aria-busy</code> on the real
       element inside. The label stays in place but turns transparent, so the button keeps its
       width and the layout does not jump when the request finishes.`),

    demo(`
        <pl-button data-loading>Saving</pl-button>
        <pl-button data-variant="secondary" data-loading>Saving</pl-button>
    `),

    section('Disabled'),

    p(`<code>disabled</code> is the native attribute, delegated straight to the internal
       <code>&lt;button&gt;</code>, so it behaves exactly as it would on a plain button,
       including being skipped in the tab order.`),

    demo(`
        <pl-button data-disabled>Disabled</pl-button>
        <pl-button data-variant="secondary" data-disabled>Disabled</pl-button>
    `),

    section('Full width'),

    demo(`<pl-button data-full>Continue</pl-button>`, { layout: 'stack' }),

    section('In a form'),

    p(`This is the part that a <code>&lt;div role="button"&gt;</code> can never do. The submit
       button submits, the reset button resets, and neither needed a line of JavaScript here:`),

    demo(`
        <pl-form onsubmit="event.preventDefault(); this.querySelector('output').value = 'Submitted!'">
            <pl-label text="Email">
                <pl-input type="email" name="email" required placeholder="you@example.com"></pl-input>
            </pl-label>
            <div data-actions>
                <pl-button type="submit">Submit</pl-button>
                <pl-button type="reset" data-variant="ghost">Reset</pl-button>
            </div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Circle'),

    p(`<code>data-shape="circle"</code> makes the button a circle sized by its own size step: the
       control height becomes the diameter, the padding goes away, and the one thing inside is
       centred. It composes with <code>data-size</code> rather than replacing it, so a circle sits
       at exactly the same height as the ordinary buttons beside it.`),

    demo(`
        <pl-button data-shape="circle" data-size="sm" title="Add">
            <pl-icon icon="plus"></pl-icon>
        </pl-button>
        <pl-button data-shape="circle" title="Add">
            <pl-icon icon="plus"></pl-icon>
        </pl-button>
        <pl-button data-shape="circle" data-size="lg" data-variant="secondary" title="Edit">
            <pl-icon icon="pencil"></pl-icon>
        </pl-button>
        <pl-button data-shape="circle" data-variant="danger">
            <pl-icon icon="trash"></pl-icon>
            <span class="pl-sr-only">Delete this item</span>
        </pl-button>
        <pl-button data-shape="square" data-variant="ghost" title="More">
            <pl-icon icon="ellipsis"></pl-icon>
        </pl-button>
    `),

    callout('a11y', 'A circle button needs a name it does not show',
        `Its visible content is one icon, and an icon carries no accessible name — so without help
         a screen reader announces "button" and nothing else. Two ways to fix it, both shown above:
         a <code>title</code>, which also gives sighted users a tooltip, or a
         <code>&lt;span class="pl-sr-only"&gt;</code> holding real text, which is better when the
         label is longer than a tooltip should be. <code>.pl-sr-only</code> ships in the
         <a href="/documentation">starter stylesheet</a>; it clips the text rather than hiding it,
         because <code>display: none</code> would take it out of the accessibility tree too.`),

    p(`<code>data-shape="square"</code> is the same box with the ordinary corner radius, for a
       toolbar where round buttons would read as floating actions.`),

    section('Props'),

    p('Rows marked with a dashed border are native <code>&lt;button&gt;</code> attributes, inherited automatically.'),

    table(
        ['Prop', 'Type', 'Default', 'Description'],
        [
            { cells: ['<code>data-variant</code>', '<code>String</code>', '<code>"primary"</code>', '<code>primary</code>, <code>secondary</code>, <code>ghost</code>, or <code>danger</code>.'] },
            { cells: ['<code>data-size</code>', '<code>String</code>', '<code>"md"</code>', '<code>sm</code>, <code>md</code>, or <code>lg</code>.'] },
            { cells: ['<code>data-loading</code>', '<code>Boolean</code>', '<code>false</code>', 'Shows a spinner, disables the button, sets <code>aria-busy</code>.'] },
            { cells: ['<code>data-full</code>', '<code>Boolean</code>', '<code>false</code>', 'Stretches the button to fill its container.'] },
            { cells: ['<code>data-shape</code>', '<code>String</code>', '<em>none</em>', '<code>circle</code> or <code>square</code>. Sizes itself from <code>data-size</code>; for one icon.'] },
            { native: true, cells: ['<code>disabled</code>', '<code>Boolean</code>', '<code>false</code>', 'Native. Disables the button.'] },
            { native: true, cells: ['<code>type</code>', '<code>String</code>', '<code>"submit"</code>', 'Native. <code>submit</code>, <code>reset</code>, or <code>button</code>.'] },
            { native: true, cells: ['<code>name</code>', '<code>String</code>', ': ', 'Native. Submitted with the form.'] },
            { native: true, cells: ['<code>value</code>', '<code>String</code>', ': ', 'Native. Submitted with the form.'] },
            { native: true, cells: ['<code>form</code>', '<code>String</code>', ': ', 'Native. Associates with a form by id.'] },
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
        ['Property', 'Falls back to', 'Description'],
        [
            { cells: ['<code>--button-background</code>', '<code>--pl-color-primary</code>', 'Fill color.'] },
            { cells: ['<code>--button-color</code>', '<code>--pl-color-on-primary</code>', 'Text color: white on every filled variant.'] },
            { cells: ['<code>--button-border</code>', '<code>transparent</code>', 'Border color.'] },
            { cells: ['<code>--button-background-hover</code>', '<code>--pl-color-primary-hover</code>', 'Hover fill.'] },
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
        '<code>data-loading</code> sets <code>aria-busy</code> and disables interaction, so a click cannot land twice.',
        'Focus is delegated: <code>.focus()</code> from outside, or a wrapping <a href="/documentation/pl-label">pl-label</a>: reaches the real button inside.',
        'Focus rings use <code>:focus-visible</code>, so they appear for keyboard users without flashing on a mouse click.',
        'Icon-only buttons need an accessible name. Add <code>aria-label</code>.',
    ]),

    callout('a11y', 'Icon-only buttons',
        `<code>&lt;pl-button aria-label="Delete"&gt;&lt;pl-icon icon="trash"&gt;&lt;/pl-icon&gt;&lt;/pl-button&gt;</code>,
         without the label, a screen reader announces "button" and nothing else.`),
);
