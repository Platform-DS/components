// ------------------------------
// Documentation: pl-cta
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-cta',
        title: 'Call to Action',
        lede: 'The closing ask: brand-filled and centred so it reads as an ending.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>SectionElement</code>',
        'Guide': '<a href="/documentation/sections">Content sections</a>',
        'Import': '<code>@platformdesign/components/pl-cta</code>',
    }),

    p(`Step 8 of the landing-page formula: the last chance to convert. In most cases you can repeat
       the header's call to action verbatim: the visitor has now read the argument for it. Keep it
       to one clear ask.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-cta';`, 'js'),

    demo(`
        <pl-cta>
            <h2>Use the browser.</h2>
            <p>It already ships components, encapsulation, theming, and a module loader.</p>
            <div data-actions>
                <pl-button data-size="lg">Get started</pl-button>
            </div>
            <p>No build step. No dependencies.</p>
        </pl-cta>
    `, { layout: 'bleed' }),

    callout('note', 'Filled by default, and the button inverts with it',
        `Unlike the other sections, this one fills with the brand color when no
         <code>data-surface</code> is set: a closing band should not look like another content band. A
         primary button on that fill would be brand-on-brand, so the section flips the button to a
         pale fill with dark text automatically.`),

    section('With a form'),

    p('A short form is the other common close. Give it a real <code>&lt;form&gt;</code>; the layout is handled.'),

    demo(`
        <pl-cta data-surface="ink">
            <h2>Get the changelog</h2>
            <p>One email when something ships. Nothing else.</p>
            <form onsubmit="event.preventDefault(); this.querySelector('output').value = 'Subscribed'">
                <pl-input type="email" name="email" placeholder="you@example.com" required></pl-input>
                <pl-button type="submit">Subscribe</pl-button>
                <output></output>
            </form>
        </pl-cta>
    `, { layout: 'bleed' }),

    section('Markup'),

    table(
        ['Element', 'Becomes'],
        [
            { cells: ['<code>&lt;h2&gt;</code>', 'The ask, on a large centred scale.'] },
            { cells: ['<code>&lt;h2&gt; + &lt;p&gt;</code>', 'The supporting line.'] },
            { cells: ['<code>[data-actions]</code>', 'The centred button row.'] },
            { cells: ['<code>[data-actions] + &lt;p&gt;</code>', 'A small reassurance line under the buttons.'] },
            { cells: ['<code>&lt;form&gt;</code>', 'A centred inline field-and-button row.'] },
        ],
    ),

    section('Attributes'),

    p('The shared <code>data-surface</code>, <code>data-align</code>, and <code>data-width</code>. Setting <code>data-surface</code> overrides the default brand fill; the measure defaults to <code>46rem</code>.'),

    section('Accessibility'),

    ul([
        'One primary action: a second competing button is the most common way this section underperforms.',
        'Inputs in the form still need a name: use <a href="/documentation/pl-label">pl-label</a> or <code>aria-label</code>, even when a placeholder is present.',
        'Placeholders are not labels; they vanish as soon as the visitor types.',
        'Button colors invert with the band, so contrast holds on the brand fill and on <code>ink</code>.',
    ]),
);
