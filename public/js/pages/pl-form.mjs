// ------------------------------
// Documentation — pl-form
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-form',
        title: 'Form',
        lede: 'Literally a <form>, with the layout already done.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': '<code>&lt;form&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-form</code>',
    }),

    p(`<code>&lt;pl-form&gt;</code> builds a real <code>&lt;form&gt;</code> and moves your fields
       into it, then stacks them in a column with consistent spacing.`),

    callout('note', 'Why this one cannot be Shadow DOM',
        `A form in a shadow root cannot see controls in the page, and controls in the page cannot
         see it — form ownership is scoped to a single tree. Keeping both on the same side of the
         boundary is what makes submission, validation, reset, and Enter-to-submit the platform's
         behaviour rather than a re-implementation of it.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-form';`, 'js'),

    demo(`
        <pl-form variant="card">
            <pl-label text="Email"><pl-input type="email" name="email" required></pl-input></pl-label>
            <pl-label text="Message"><pl-textarea name="message"></pl-textarea></pl-label>
            <div data-actions align="end">
                <pl-button variant="ghost" type="reset">Reset</pl-button>
                <pl-button type="submit">Send</pl-button>
            </div>
        </pl-form>
    `, { layout: 'stack' }),

    section('Events are the form\'s own'),

    p(`<code>submit</code>, <code>reset</code>, and <code>invalid</code> come from the real form and
       bubble normally — listen on <code>&lt;pl-form&gt;</code> exactly as you would on a
       <code>&lt;form&gt;</code>:`),

    code(`
        document.querySelector('pl-form')
            .addEventListener('submit', event => {
                event.preventDefault();
                const data = new FormData(event.target);
            });
    `, 'js'),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').textContent = new URLSearchParams(new FormData(event.target)).toString()">
            <pl-label text="Name"><pl-input name="name" value="Ada" required></pl-input></pl-label>
            <pl-switch name="subscribe" checked>Subscribe</pl-switch>
            <div data-actions><pl-button type="submit" size="sm">Submit</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Layout hooks'),

    p('Two data attributes cover the layouts a form actually needs:'),

    table(
        ['Hook', 'Description'],
        [
            { cells: ['<code>data-actions</code>', 'A horizontal row of buttons, spaced away from the fields. Add <code>align="end"</code> to push them right.'] },
            { cells: ['<code>data-row</code>', 'Puts its children side by side, wrapping to a column when there is no room.'] },
        ],
    ),

    demo(`
        <pl-form variant="card">
            <div data-row>
                <pl-label text="First name"><pl-input name="first"></pl-input></pl-label>
                <pl-label text="Last name"><pl-input name="last"></pl-input></pl-label>
            </div>
            <pl-label text="Email"><pl-input type="email" name="email"></pl-input></pl-label>
        </pl-form>
    `, { layout: 'stack' }),

    section('Grouping fields'),

    p('A <code>&lt;fieldset&gt;</code> is reset to the same column rhythm, so related fields group without fighting the browser\'s default border.'),

    demo(`
        <pl-form variant="card">
            <fieldset>
                <legend>Shipping</legend>
                <pl-label text="Address"><pl-input name="address"></pl-input></pl-label>
                <pl-radio-group label="Speed" name="speed" value="std" orientation="horizontal">
                    <pl-radio value="std">Standard</pl-radio>
                    <pl-radio value="express">Express</pl-radio>
                </pl-radio-group>
            </fieldset>
        </pl-form>
    `, { layout: 'stack' }),

    section('Attributes'),

    p('Form-level attributes are forwarded to the real <code>&lt;form&gt;</code>, so they behave exactly as they always have.'),

    table(
        ['Attribute', 'Description'],
        [
            { cells: ['<code>action</code>, <code>method</code>, <code>enctype</code>, <code>target</code>', 'Native. Where and how the form submits.'] },
            { cells: ['<code>novalidate</code>', 'Native. Skip constraint validation on submit.'] },
            { cells: ['<code>autocomplete</code>, <code>name</code>, <code>accept-charset</code>', 'Native.'] },
            { cells: ['<code>variant="card"</code>', 'Wrap the fields in a padded, bordered panel.'] },
        ],
    ),

    section('Properties and methods'),

    table(
        ['Member', 'Description'],
        [
            { cells: ['<code>form</code>', 'The real <code>&lt;form&gt;</code> element.'] },
            { cells: ['<code>requestSubmit(submitter?)</code>', 'Submit as if the button had been pressed — runs validation, unlike <code>submit()</code>.'] },
            { cells: ['<code>reset()</code>', 'Reset every field to its default.'] },
            { cells: ['<code>checkValidity()</code> / <code>reportValidity()</code>', 'Native validation, the second also showing the browser\'s messages.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--form-gap</code>', 'Space between fields (and inside <code>data-row</code>).'] },
            { cells: ['<code>--form-padding</code>', 'Inner padding. Only visible on <code>variant="card"</code> by default.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'A real <code>&lt;form&gt;</code>, so Enter submits from a text field and the browser\'s own validation messages appear where it expects.',
        'Every field still needs a name — wrap controls in <a href="/documentation/pl-label">pl-label</a>.',
        'Use <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code> for groups of related fields; both are styled for you.',
        'Children are relocated with <code>moveBefore()</code> where supported, so an already-upgraded field keeps its state instead of being disconnected and re-connected.',
    ]),
);
