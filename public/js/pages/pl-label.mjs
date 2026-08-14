// ------------------------------
// Documentation — pl-label
// ------------------------------
// The page that explains the Shadow/Light decision by example.

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-label',
        title: 'Label',
        lede: 'A Light DOM component — because a label that cannot reach its control is not a label.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': '<code>&lt;label&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-label</code>',
    }),

    callout('note', 'Why this one is not Shadow DOM',
        `A <code>&lt;label&gt;</code> associates with a control either by wrapping it or by
         pointing <code>for</code> at its id — and <strong>both mechanisms are scoped to a
         single DOM tree</strong>. Put the label in a shadow root and it can no longer see the
         control in the page. Put the control in the label's shadow root and the page's
         <code>&lt;form&gt;</code> can no longer see the control. Either way, something that
         should simply work stops working.`),

    p(`So the split is: the <strong>label is Light</strong>, because its whole job is to reach
       across the document, and the <strong>control stays Shadow</strong>, because it wants its
       styling encapsulated. This is the general rule for the library — app components are
       Shadow unless their purpose is a document-level relationship.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-label';`, 'js'),

    demo(`
        <pl-label text="Email address">
            <pl-input type="email" placeholder="you@example.com"></pl-input>
        </pl-label>
    `, { layout: 'stack' }),

    section('Hint and error text'),

    p(`Hints and errors are wired to the control with <code>aria-describedby</code>, which is
       ID-based — the same cross-root problem, handled in the same place. An error also sets
       <code>aria-invalid</code> on the control and announces itself via
       <code>aria-live</code>.`),

    demo(`
        <pl-label text="Password" hint="At least 12 characters." required>
            <pl-input type="password"></pl-input>
        </pl-label>
    `, { layout: 'stack' }),

    demo(`
        <pl-label text="Username" error="That username is already taken.">
            <pl-input type="text" value="platform"></pl-input>
        </pl-label>
    `, { layout: 'stack' }),

    section('With a Shadow DOM control'),

    p(`This is the arrangement the component exists for. The label is Light, the control keeps
       its <code>&lt;input&gt;</code> in a shadow root, and clicking the label text still focuses
       the real input inside it — because the control's shadow root is attached with
       <code>delegatesFocus</code>.`),

    code(`
        // in the control component
        static delegatesFocus = true;
    `, 'js'),

    callout('warn', 'Custom elements are not labelable by default',
        `Wrapping a plain custom element in a <code>&lt;label&gt;</code> does <em>not</em>
         forward clicks to it — only form-associated or natively labelable elements get that
         for free. <code>&lt;pl-label&gt;</code> forwards the click by hand, and
         <code>delegatesFocus</code> makes it land on the real input rather than the host.`),

    section('Required and disabled'),

    p(`Both are forwarded to the control, so the state is set in one place. The required marker
       is <code>aria-hidden</code> — <code>required</code> on the control is what actually
       conveys it, and announcing "star" on top of that is noise.`),

    demo(`
        <pl-label text="Full name" required>
            <pl-input type="text"></pl-input>
        </pl-label>
    `, { layout: 'stack' }),

    demo(`
        <pl-label text="Account ID" hint="Assigned automatically." disabled>
            <pl-input type="text" value="PL-4417"></pl-input>
        </pl-label>
    `, { layout: 'stack' }),

    section('Props'),

    table(
        ['Prop', 'Type', 'Default', 'Description'],
        [
            { cells: ['<code>text</code>', '<code>String</code>', '—', 'The label text.'] },
            { cells: ['<code>hint</code>', '<code>String</code>', '—', 'Supporting text, linked via <code>aria-describedby</code>.'] },
            { cells: ['<code>error</code>', '<code>String</code>', '—', 'Error text. Sets <code>aria-invalid</code> and announces politely.'] },
            { cells: ['<code>required</code>', '<code>Boolean</code>', '<code>false</code>', 'Shows the marker and forwards <code>required</code> to the control.'] },
            { cells: ['<code>disabled</code>', '<code>Boolean</code>', '<code>false</code>', 'Dims the label and forwards <code>disabled</code> to the control.'] },
        ],
    ),

    section('Styling'),

    p(`Being Light DOM, this component has no shadow root to adopt a stylesheet onto. Its CSS is
       injected into the document once, inside <code>@layer pl-components</code> — so your own
       unlayered CSS always wins and you never have to fight specificity to restyle it.`),

    code(`
        /* No layer needed on your side — unlayered CSS beats any layer. */
        pl-label {
            font-size: 1rem;
            letter-spacing: 0.01em;
        }
    `, 'css'),

    section('Accessibility'),

    ul([
        'Uses implicit association (the label wraps the control), which needs no IDs and cannot go stale.',
        '<code>aria-describedby</code> links hint and error text to the control.',
        'Errors set <code>aria-invalid</code> and use <code>aria-live="assertive"</code> so a validation failure is announced.',
        'The required asterisk is <code>aria-hidden</code>; the control\'s <code>required</code> attribute conveys it properly.',
        'Children are relocated with <code>moveBefore()</code> where supported, so a wrapped custom element keeps its state instead of being disconnected and re-connected.',
    ]),
);
