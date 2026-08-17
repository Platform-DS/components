// ------------------------------
// Documentation: pl-autocomplete
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-autocomplete',
        title: 'Autocomplete',
        lede: 'A real input and a real datalist, wired together: the browser draws the suggestions.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': '<code>&lt;input&gt;</code> + <code>&lt;datalist&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-autocomplete</code>',
    }),

    p(`Write <code>&lt;option&gt;</code>s as children, exactly as you would inside a hand-written
       <code>&lt;datalist&gt;</code>. This component just handles the <code>id</code>/<code>list</code>
       wiring and the visible field's styling.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-autocomplete';`, 'js'),

    demo(`
        <pl-autocomplete name="fruit" placeholder="Choose a fruit…">
            <option value="Apple"></option>
            <option value="Banana"></option>
            <option value="Cherry"></option>
            <option value="Dragonfruit"></option>
        </pl-autocomplete>
    `, { layout: 'stack' }),

    callout('note', 'Why not build this on pl-input',
        `The <code>list</code> attribute resolves its <code>id</code> in the input's own tree:
         exactly the same rule that makes <code>&lt;label for&gt;</code> stop working across a
         shadow boundary. <code>pl-input</code>'s real <code>&lt;input&gt;</code> lives inside its
         own shadow root, so a <code>&lt;datalist&gt;</code> outside it could never be found. The
         field here is a plain <code>&lt;input&gt;</code>, styled by hand to match.`),

    section('Options from data'),

    p(`For a list that comes from an API rather than markup, set <code>options</code> from JS:
       plain strings, or <code>{ value, label }</code> for a suggestion whose typed text differs
       from what's shown:`),

    code(`
        document.querySelector('pl-autocomplete').options =
            ['Apple', 'Banana', 'Cherry'];

        // or, with a separate display label:
        el.options = [{ value: 'US', label: 'United States' }];
    `, 'js'),

    section('Listening for changes'),

    demo(`
        <pl-autocomplete placeholder="Type or pick one…"
            onchange="this.nextElementSibling.textContent = this.value">
            <option value="Red"></option>
            <option value="Green"></option>
            <option value="Blue"></option>
        </pl-autocomplete>
        <output></output>
    `, { layout: 'stack' }),

    p(`That demo listens for the native <code>change</code> event, which bubbles out normally
       because the input is a real control in the page. It fires once a suggestion is picked or the
       field is committed, not on every keystroke. The same value is also available on
       <code>pl-change</code>:`),

    code(`
        document.querySelector('pl-autocomplete')
            .addEventListener('pl-change', event => {
                console.log(event.detail.value);
            });
    `, 'js'),

    section('States'),

    demo(`
        <pl-autocomplete placeholder="Disabled" disabled>
            <option value="Apple"></option>
        </pl-autocomplete>
        <pl-autocomplete placeholder="Required" required>
            <option value="Apple"></option>
        </pl-autocomplete>
    `, { layout: 'stack' }),

    section('In a form'),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').textContent = new FormData(event.target).get('city')">
            <pl-label text="City">
                <pl-autocomplete name="city" placeholder="Start typing…">
                    <option value="Austin"></option>
                    <option value="Boston"></option>
                    <option value="Chicago"></option>
                    <option value="Denver"></option>
                </pl-autocomplete>
            </pl-label>
            <div data-actions><pl-button type="submit" data-size="sm">Submit</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>value</code>', '<code>String</code>', 'Seeds the initial value: like a real <code>&lt;input&gt;</code>, only the default; the live value is a property.'] },
            { cells: ['<code>name</code>', '<code>String</code>', 'Field name for form submission.'] },
            { cells: ['<code>placeholder</code>', '<code>String</code>', 'Placeholder text.'] },
            { cells: ['<code>type</code>', '<code>String</code>', 'Any text-like input type. Defaults to <code>text</code>.'] },
            { cells: ['<code>autocomplete</code>', '<code>String</code>', 'The unrelated native browser-autofill attribute: passed through as-is.'] },
            { cells: ['<code>disabled</code>', '<code>Boolean</code>', 'Native disabled.'] },
            { cells: ['<code>required</code>', '<code>Boolean</code>', 'Native required.'] },
        ],
    ),

    section('Properties and events'),

    table(
        ['Member', 'Description'],
        [
            { cells: ['<code>value</code>', 'Get or set the live value.'] },
            { cells: ['<code>options</code>', 'Get or set the suggestion list: strings or <code>{ value, label }</code>.'] },
            { cells: ['<code>input</code> / <code>datalist</code>', 'The two real elements, if you need them.'] },
            { cells: ['<code>pl-change</code>', 'Mirrors the native <code>change</code>; <code>detail.value</code> is the current value.'] },
        ],
    ),

    callout('note', 'Two names for "autocomplete"',
        `Don't confuse the suggestion list with the native <code>autocomplete</code> attribute: the
         browser's own remembered-values feature, unrelated to <code>&lt;datalist&gt;</code> and
         passed straight through if you set it.`),

    section('Accessibility'),

    ul([
        'A real <code>&lt;input&gt;</code>, so typing, pasting, and the platform\'s own autofill all work unmodified.',
        'The suggestion popup, its filtering, and its keyboard handling are entirely the browser\'s. Nothing here reimplements a listbox.',
        'Wrap it in <a href="/documentation/pl-label">pl-label</a> to name the field; the association works the same as with a plain <code>&lt;input&gt;</code>, since both live in the page\'s own DOM.',
    ]),
);
