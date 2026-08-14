// ------------------------------
// Documentation — pl-social-proof
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-social-proof',
        title: 'Social Proof',
        lede: 'Evidence you can do what you just claimed — logos, ratings, or numbers.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>SectionElement</code>',
        'Guide': '<a href="/documentation/sections">Content sections</a>',
        'Import': '<code>@platformdesign/components/pl-social-proof</code>',
    }),

    p(`Step 3 of the landing-page formula. It sits directly under the hero and is deliberately
       quiet — a thin band of texture that backs up the claim above it without competing with it.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-social-proof';`, 'js'),

    section('Stats'),

    p(`Wrap the number in <code>&lt;strong&gt;</code> and the component lays each item out as a
       figure with its label beneath. No classes — the emphasis you would write anyway is the hook.`),

    demo(`
        <pl-social-proof surface="muted">
            <p>Trusted by teams shipping every day</p>
            <ul>
                <li><strong>12,000+</strong> projects shipped</li>
                <li><strong>0</strong> dependencies</li>
                <li><strong>4.9/5</strong> average rating</li>
            </ul>
        </pl-social-proof>
    `, { layout: 'bleed' }),

    section('Logos'),

    p(`Images are normalised to one optical height and muted to greyscale so the row reads as
       texture rather than a clash of brand colours; hovering restores an individual logo.`),

    demo(`
        <pl-social-proof>
            <p>As used at</p>
            <ul>
                <li><img src="/img/logo/logo.svg" alt="Acme"></li>
                <li><img src="/img/logo/logo.svg" alt="Northwind"></li>
                <li><img src="/img/logo/logo.svg" alt="Initech"></li>
            </ul>
        </pl-social-proof>
    `, { layout: 'bleed' }),

    callout('a11y', 'Logos need real alt text',
        `A customer logo is <em>the</em> proof — so it carries meaning and needs a name. Use the
         company name as the alt text (<code>alt="Acme"</code>), not <code>alt="logo"</code> and not
         an empty string. Stats are already plain text, so they need nothing extra.`),

    section('Markup'),

    table(
        ['Element', 'Becomes'],
        [
            { cells: ['<code>&lt;p&gt;</code> (first child)', 'The centred lead-in line.'] },
            { cells: ['<code>&lt;ul&gt;</code>', 'The wrapping, centred row.'] },
            { cells: ['<code>&lt;li&gt;</code> with <code>&lt;strong&gt;</code>', 'A stat: big number over a small label.'] },
            { cells: ['<code>&lt;li&gt;</code> with <code>&lt;img&gt;</code>', 'A logo, height-normalised and muted.'] },
        ],
    ),

    section('Attributes'),

    p('The shared <code>surface</code>, <code>align</code>, and <code>width</code> — see the <a href="/documentation/sections">Content sections</a> guide.'),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--social-proof-logo-height</code>', 'Optical height every logo is normalised to.'] },
            { cells: ['<code>--section-space</code>', 'Vertical padding — smaller here than other bands by default.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'Stats are real text, so they are read, searched, and translated like any other content.',
        'Give every logo the company name as its alt text.',
        'The greyscale treatment is decoration only — it never affects what is announced.',
    ]),
);
