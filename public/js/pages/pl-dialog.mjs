// ------------------------------
// Documentation: pl-dialog
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-dialog',
        title: 'Dialog',
        lede: 'A styled wrapper around a real <dialog>: opened and closed without a line of JavaScript.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': '<code>&lt;dialog&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-dialog</code>',
    }),

    p(`Everything that makes a dialog a dialog: the top layer, the backdrop, the focus trap,
       Escape to close, the page behind going inert: belongs to the browser. This component adds
       a surface and a layout and gets out of the way.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-dialog';`, 'js'),

    demo(`
        <pl-button command="show-modal" commandfor="demo-confirm">Delete project…</pl-button>

        <pl-dialog id="demo-confirm" data-dismissable closedby="any">
            <h2 data-title>Delete this project?</h2>
            <p>Every deployment and build log goes with it. This cannot be undone.</p>
            <div data-actions>
                <form method="dialog"><pl-button data-variant="secondary">Cancel</pl-button></form>
                <pl-button data-variant="danger" command="close" commandfor="demo-confirm">Delete</pl-button>
            </div>
        </pl-dialog>
    `, { layout: 'stack' }),

    p(`There is no script in that example. Opening is <code>command</code>/<code>commandfor</code>,
       closing is <code>&lt;form method="dialog"&gt;</code>. Both native, both declarative, and
       both still working if this component's own script never gets further than building the
       markup.`),

    callout('note', 'Your id moves to the <dialog>',
        `<code>commandfor</code> resolves an id and then checks that what it found is really a
         <code>&lt;dialog&gt;</code>. Pointed at a custom element it does nothing at all, and fires
         no event you could hook. So for the syntax above to work, the id has to be
         <em>on</em> the dialog, and rather than invent a second id attribute, the
         <code>id</code> you write on <code>&lt;pl-dialog&gt;</code> is moved onto the
         <code>&lt;dialog&gt;</code> it builds.
         <br><br>
         In practice that means <code>document.getElementById('demo-confirm')</code> returns the
         <code>&lt;dialog&gt;</code>, which is the thing you'd want anyway, since
         <code>showModal()</code> and <code>close()</code> live there. Select the wrapper by tag or
         class if you need it; it forwards those methods too, so either handle works.`),

    section('Closing it'),

    p('Four ways in, all of them the platform\'s:'),

    table(
        ['Mechanism', 'How'],
        [
            { cells: ['<code>&lt;form method="dialog"&gt;</code>', 'A submit button inside the form closes the dialog. Needs no id. A plain <code>&lt;button value="…"&gt;</code> also reports that value as <code>returnValue</code>. See the note below.'] },
            { cells: ['<code>command="close"</code>', 'A button anywhere on the page, pointed at the dialog with <code>commandfor</code>.'] },
            { cells: ['Escape', 'Free with <code>&lt;dialog&gt;</code>, unless <code>closedby="none"</code>.'] },
            { cells: ['<code>closedby="any"</code>', 'Adds light dismiss: a click outside the dialog closes it.'] },
        ],
    ),

    callout('note', 'pl-button submits, but is not the submitter',
        `<code>&lt;pl-button&gt;</code> works inside a <code>&lt;form method="dialog"&gt;</code>. Its
         real <code>&lt;button&gt;</code> lives in a shadow root and so cannot be the form's submit
         button, and the component bridges that by asking the form to submit itself. The form
         therefore has no <em>submitter</em> element, which means a <code>value</code> on the
         button is not reported as <code>returnValue</code>. When you need to know which button was
         pressed, either use a plain <code>&lt;button value="…"&gt;</code>, or close with
         <code>command="close"</code> and track the choice yourself.`),

    section('Light dismiss'),

    p(`<code>closedby</code> is passed straight through to the <code>&lt;dialog&gt;</code>.
       <code>any</code> closes on an outside click or Escape, <code>closerequest</code> on Escape
       only, and <code>none</code> on neither, which is the one to reach for when a choice really
       must be made before continuing.`),

    demo(`
        <pl-button command="show-modal" commandfor="demo-sticky" data-variant="secondary">Must choose</pl-button>
        <pl-dialog id="demo-sticky" closedby="none">
            <h2 data-title>Pick one</h2>
            <p>Escape and clicking outside are both off. The buttons are the only way out.</p>
            <div data-actions>
                <form method="dialog"><pl-button data-variant="secondary">Not now</pl-button></form>
                <form method="dialog"><pl-button>Continue</pl-button></form>
            </div>
        </pl-dialog>
    `, { layout: 'stack' }),

    section('Modal and non-modal'),

    p(`<code>command="show-modal"</code> opens it modally: top layer, backdrop, page inert.
       <code>command="show"</code> opens the same dialog non-modally: no backdrop, and the rest of
       the page stays usable behind it.`),

    section('From script'),

    code(`
        // The id is on the <dialog>, so this is the native element:
        document.getElementById('demo-confirm').showModal();

        // Or go through the wrapper, which forwards:
        document.querySelector('pl-dialog').showModal();

        document.querySelector('pl-dialog')
            .addEventListener('pl-close', event => {
                console.log(event.detail.returnValue);   // set by a real <button value>
            });
    `, 'js'),

    p(`<code>close</code> and <code>cancel</code> don't cross a shadow boundary on their own, so
       they are re-emitted as <code>pl-close</code> and <code>pl-cancel</code>. Preventing
       <code>pl-cancel</code> prevents the real one, so an "are you sure" guard on Escape works as
       you'd expect.`),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>id</code>', '<code>String</code>', 'Moved to the <code>&lt;dialog&gt;</code>, so <code>commandfor</code> can find it.'] },
            { cells: ['<code>closedby</code>', '<code>String</code>', '<code>any</code>, <code>closerequest</code>, or <code>none</code>. Passed through natively.'] },
            { cells: ['<code>data-dismissable</code>', '<code>Boolean</code>', 'Adds the × in the corner: a submit button in a <code>method="dialog"</code> form.'] },
            { cells: ['<code>data-title</code>', '<em>on a child</em>', 'Names the dialog through <code>aria-labelledby</code>.'] },
            { cells: ['<code>data-actions</code>', '<em>on a child</em>', 'The row of buttons at the end.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--dialog-width</code>', 'Maximum width. Defaults to <code>32rem</code>.'] },
            { cells: ['<code>--dialog-padding</code>', 'Inner padding.'] },
            { cells: ['<code>--dialog-background</code>', 'Surface color.'] },
            { cells: ['<code>--dialog-backdrop</code>', 'The tint behind it.'] },
        ],
    ),

    callout('note', 'The open and close animation is a progressive extra',
        `Transitioning a dialog needs <code>transition-behavior: allow-discrete</code> and
         <code>@starting-style</code>, because <code>display</code> and <code>overlay</code> flip
         discretely rather than interpolating. Where those are missing the dialog simply appears:
         correct everywhere, prettier where supported. <code>overlay</code> is in the transition
         list on purpose: without it the element leaves the top layer the instant
         <code>close()</code> is called and the exit animation plays <em>behind</em> the page.`),

    section('Accessibility'),

    ul([
        'A real <code>&lt;dialog&gt;</code> opened with <code>showModal()</code>: focus is trapped, the rest of the page is inert, and Escape closes. None of it re-implemented.',
        'The dialog is named by your <code>data-title</code> through <code>aria-labelledby</code>, rather than duplicating the text into an <code>aria-label</code> that could drift out of step with it.',
        'Focus returns to whatever opened the dialog when it closes. That is the browser\'s doing, and one of the strongest reasons not to build this from a <code>&lt;div&gt;</code>.',
        'The × is a real submit button with an <code>aria-label</code>, inside a form that closes the dialog declaratively.',
        'Transitions are dropped under <code>prefers-reduced-motion</code>.',
    ]),
);
