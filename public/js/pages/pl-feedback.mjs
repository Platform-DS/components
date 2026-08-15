// ------------------------------
// Documentation: pl-feedback
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-feedback',
        title: 'Feedback',
        lede: 'An inline message about something that just happened, or is about to.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Announces': '<code>role="status"</code>, or <code>alert</code> for errors',
        'Import': '<code>@platformdesign/components/pl-feedback</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-feedback';`, 'js'),

    demo(`
        <pl-feedback><p>Your export will finish in the background.</p></pl-feedback>
        <pl-feedback data-intent="success"><p data-title>Saved</p><p>Your changes are live.</p></pl-feedback>
        <pl-feedback data-intent="warning"><p>Your trial ends in three days.</p></pl-feedback>
        <pl-feedback data-intent="error"><p data-title>Upload failed</p><p>The file was larger than 10 MB.</p></pl-feedback>
    `, { layout: 'stack' }),

    p(`Each intent gets its own icon as well as its own colour. Colour alone is not a distinction
       for anyone who can't see it, and the glyph plus the accent rule keep the four states apart
       in greyscale too.`),

    section('status or alert'),

    p(`Both announce, but they interrupt differently, and the difference matters:`),

    table(
        ['Role', 'Behaviour', 'Use for'],
        [
            { cells: ['<code>status</code> <em>(default)</em>', 'Polite: waits for a pause in whatever the screen reader is already saying.', 'Saved, copied, queued.'] },
            { cells: ['<code>alert</code>', 'Assertive: cuts in immediately, discarding what was mid-sentence.', 'Something failed and needs attention now.'] },
        ],
    ),

    p(`Interrupting is right for a genuine failure and wrong for "Saved", so it is opt-in:
       <code>data-intent="error"</code> takes <code>role="alert"</code>, everything else takes
       <code>status</code>. Setting <code>role</code> yourself always wins.`),

    callout('note', 'A live region only announces when it CHANGES',
        `A <code>pl-feedback</code> that is already in the HTML at page load is read as ordinary
         content, which is fine, since it was there before anyone started listening. To have a
         message actually announced, insert it (or change its text) in response to whatever it is
         reporting. Rendering all four states up front and toggling <code>hidden</code> between
         them is the common way to get silence.`),

    code(`
        const feedback = document.createElement('pl-feedback');
        feedback.setAttribute('intent', 'error');
        feedback.innerHTML = '<p>Could not reach the server.</p>';

        // Inserting it is what triggers the announcement.
        form.append(feedback);
    `, 'js'),

    section('Dismissable'),

    p(`Unlike <a href="/documentation/pl-chip">pl-chip</a>'s ×, this one does remove its own
       element. A chip is one of a set the page is rendering and has to stay in step with, so the
       page owns that list; a feedback message is a self-contained announcement with nothing behind
       it to keep in sync. The event still fires first, and is cancellable for the cases where
       something does.`),

    demo(`
        <pl-feedback data-intent="success" data-dismissable>
            <p data-title>Copied</p>
            <p>The install command is on your clipboard.</p>
        </pl-feedback>
    `, { layout: 'stack' }),

    code(`
        document.querySelector('pl-feedback')
            .addEventListener('pl-dismiss', event => {
                event.preventDefault();     // keep it, and handle removal yourself
            });
    `, 'js'),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>data-intent</code>', '<code>String</code>', 'Default (informational), <code>success</code>, <code>warning</code>, <code>error</code>.'] },
            { cells: ['<code>data-dismissable</code>', '<code>Boolean</code>', 'Adds the × that removes the message.'] },
            { cells: ['<code>role</code>', '<code>String</code>', 'Set it yourself to override the default of <code>status</code> / <code>alert</code>.'] },
            { cells: ['<code>data-title</code>', '<em>on a child</em>', 'The emphasised first line.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--feedback-background</code>', 'The tint. Derived from the intent colour with <code>color-mix</code> by default.'] },
            { cells: ['<code>--feedback-padding</code>', 'Inner padding.'] },
        ],
    ),

    callout('note', 'The tint is derived, not a second palette',
        `Each intent's background is <code>color-mix(in oklab, …)</code> of its own accent colour
         against the surface. One source of truth per intent, so re-pointing
         <code>--pl-color-success</code> at your own green moves the rule, the icon, and the tint
         together instead of leaving three hand-picked values to go out of step.`),

    section('Accessibility'),

    ul([
        'Announced politely by default; assertively only for <code>error</code>, or when you set <code>role="alert"</code> yourself.',
        'The icon is decorative and drawn with a CSS mask: the message text is what gets read.',
        'Every intent is distinguishable without colour, via its icon and the accent rule.',
        'The × is a real <code>&lt;button&gt;</code> with an <code>aria-label</code>.',
        'For a message that must be acted on before anything else can happen, this is the wrong component. Use <a href="/documentation/pl-dialog">pl-dialog</a>.',
    ]),
);
