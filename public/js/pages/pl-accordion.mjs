// ------------------------------
// Documentation — pl-accordion
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-accordion',
        title: 'Accordion',
        lede: 'A heading that shows and hides the content beneath it.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': 'A <code>&lt;button&gt;</code> inside your heading, over a labelled region',
        'Import': '<code>@platformdesign/components/pl-accordion</code>',
    }),

    p(`Write a heading and some content. The heading is marked with
       <code>data-summary</code>; everything else becomes the panel.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-accordion';`, 'js'),

    demo(`
        <pl-accordion open>
            <h3 data-summary>What does zero dependencies actually mean?</h3>
            <p>No runtime, no peer packages, and no build step. The files you import are the files that run.</p>
        </pl-accordion>
        <pl-accordion>
            <h3 data-summary>Does it work without a framework?</h3>
            <p>Yes — these are custom elements, so the browser is the framework.</p>
        </pl-accordion>
    `, { layout: 'stack' }),

    p(`Your heading is kept exactly as written and a real <code>&lt;button&gt;</code> is moved
       <em>inside</em> it. That is the arrangement assistive tech expects: the
       <code>&lt;h3&gt;</code> stays an <code>&lt;h3&gt;</code>, so it still appears in the
       document outline and in a screen reader's list of headings, while the button is the thing
       that takes focus and gets pressed.`),

    callout('note', 'Why not <details>',
        `<code>&lt;details name="…"&gt;</code> gives single-open behaviour natively, and for one
         disclosure on its own it would be the obvious answer. It isn't used here because of what
         <a href="/documentation/pl-accordion-group">pl-accordion-group</a> has to do around it:
         exclusivity in this library is opt-<em>out</em>, the group has to be able to close a panel
         the user didn't just click, and the panel needs to be styleable as a region. A
         <code>name</code>-grouped <code>&lt;details&gt;</code> owns all of that itself and offers
         no way in — so the disclosure is rebuilt on the standard
         <code>aria-expanded</code>/<code>aria-controls</code> button pattern instead.`),

    section('Marking the summary'),

    p(`<code>data-summary</code> is explicit and always wins. Without it, the first heading is
       used; without any heading, the first element. Falling all the way back means a forgotten
       marker produces a slightly odd accordion rather than one with no trigger at all — but be
       explicit, because "the first element" is a fragile thing to depend on.`),

    section('States'),

    p(`<code>open</code> reflects the current state, so it can be set in the HTML to have a panel
       start expanded, read back at any time, or targeted from CSS.`),

    demo(`
        <pl-accordion open>
            <h3 data-summary>Open on load</h3>
            <p>Set the <code>open</code> attribute.</p>
        </pl-accordion>
        <pl-accordion disabled>
            <h3 data-summary>Disabled</h3>
            <p>You will not see this.</p>
        </pl-accordion>
    `, { layout: 'stack' }),

    section('Reacting to it'),

    p(`<code>pl-toggle</code> fires on real interaction only — never when a group closes a panel
       programmatically — which is what keeps a group from bouncing events back and forth between
       its children.`),

    code(`
        document.querySelector('pl-accordion')
            .addEventListener('pl-toggle', event => {
                console.log(event.detail.open);   // true | false
            });
    `, 'js'),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>open</code>', '<code>Boolean</code>', 'Expanded state. Reflected, so CSS and script both see it.'] },
            { cells: ['<code>disabled</code>', '<code>Boolean</code>', 'Disables the trigger.'] },
            { cells: ['<code>data-summary</code>', '<em>on a child</em>', 'Marks the heading that becomes the trigger.'] },
        ],
    ),

    section('Properties and events'),

    table(
        ['Member', 'Description'],
        [
            { cells: ['<code>open</code>', 'Get or set the expanded state.'] },
            { cells: ['<code>trigger</code> / <code>panel</code>', 'The real button and the region it controls.'] },
            { cells: ['<code>pl-toggle</code>', 'Fired on interaction; <code>detail.open</code> is a boolean.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--accordion-border</code>', 'The rule under each row.'] },
            { cells: ['<code>--accordion-padding-block</code> / <code>--accordion-padding-inline</code>', 'Row padding.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'The trigger is a real <code>&lt;button&gt;</code> — Tab, Enter and Space all come from the platform.',
        'It carries <code>aria-expanded</code>, and <code>aria-controls</code> pointing at the panel.',
        'The panel is a <code>role="region"</code> named by its own trigger through <code>aria-labelledby</code>, so someone who lands inside it knows which disclosure they are in.',
        'Closing uses <code>hidden</code>, so a collapsed panel leaves the accessibility tree and the tab order together — there is no second state to keep in sync.',
        'Your heading level is never changed. Choose one that fits the surrounding document outline.',
        'The marker\'s rotation is dropped under <code>prefers-reduced-motion</code>.',
    ]),
);
