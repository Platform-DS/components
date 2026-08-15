// ------------------------------
// Documentation: pl-benefits
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-benefits',
        title: 'Benefits',
        lede: 'What the visitor gets: the outcome, not the feature list.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>SectionElement</code>',
        'Guide': '<a href="/documentation/sections">Content sections</a>',
        'Import': '<code>@platformdesign/components/pl-benefits</code>',
    }),

    p(`Step 4 of the landing-page formula, and the one most often written wrong: it is for the
       visitor's <em>end result</em>, not your specifications. "No build step to maintain" is a
       benefit; "ships as ES modules" is a feature. Put the features in
       <a href="/documentation/pl-features">pl-features</a> and keep this section about what
       changes for them.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-benefits';`, 'js'),

    demo(`
        <pl-benefits variant="card">
            <p data-eyebrow>Why Platform</p>
            <h2>Four fewer things to worry about</h2>
            <p>Every one of these is a problem the platform already solved.</p>
            <ul>
                <li>
                    <pl-icon icon="cube"></pl-icon>
                    <h3>No toolchain</h3>
                    <p>Ship the source. It's ES modules and CSS.</p>
                </li>
                <li>
                    <pl-icon icon="grid"></pl-icon>
                    <h3>No framework</h3>
                    <p>A custom element is just an HTML element.</p>
                </li>
                <li>
                    <pl-icon icon="swatch"></pl-icon>
                    <h3>No theming API</h3>
                    <p>Custom properties are the theming API.</p>
                </li>
                <li>
                    <pl-icon icon="thumbtack"></pl-icon>
                    <h3>No supply chain</h3>
                    <p>Zero dependencies, zero transitive risk.</p>
                </li>
            </ul>
        </pl-benefits>
    `, { layout: 'bleed' }),

    callout('note', 'Why a list, not a stack of divs',
        `A set of benefits <em>is</em> a list, so it is marked up as one. With styles off it still
         reads as an itemised set, and a screen reader announces how many there are before the
         visitor commits to listening to all of them.`),

    section('Without cards'),

    p('Drop <code>variant="card"</code> for a plainer grid: better on a busy page or a tinted band.'),

    demo(`
        <pl-benefits surface="muted" columns="2">
            <h2>Two things that matter</h2>
            <ul>
                <li><h3>It keeps working</h3><p>The browser does not break its own APIs.</p></li>
                <li><h3>It stays yours</h3><p>No framework owns your component code.</p></li>
            </ul>
        </pl-benefits>
    `, { layout: 'bleed' }),

    section('Markup'),

    table(
        ['Element', 'Becomes'],
        [
            { cells: ['<code>&lt;h2&gt;</code>', 'The section title.'] },
            { cells: ['<code>&lt;h2&gt; + &lt;p&gt;</code>', 'The lede.'] },
            { cells: ['<code>&lt;ul&gt; &gt; &lt;li&gt;</code>', 'The auto-fitting grid of benefits.'] },
            { cells: ['First <code>&lt;pl-icon&gt;</code>/<code>&lt;svg&gt;</code> in an item', 'The tinted icon chip.'] },
            { cells: ['<code>&lt;h3&gt;</code> and <code>&lt;p&gt;</code>', 'The benefit title and its explanation.'] },
        ],
    ),

    section('Attributes'),

    p('Plus the shared <code>surface</code>, <code>align</code>, and <code>width</code>.'),

    table(
        ['Attribute', 'Values', 'Description'],
        [
            { cells: ['<code>variant</code>', '<code>card</code>', 'Give each item a padded, bordered card.'] },
            { cells: ['<code>columns</code>', '<code>2</code>, <code>4</code>', 'Bias the auto-fit grid toward a column count. Default suits three or four.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'Icons are decorative here: the <code>&lt;h3&gt;</code> beside them carries the meaning, so leave <code>pl-icon</code> unlabelled.',
        'Headings step from the section\'s <code>&lt;h2&gt;</code> to each item\'s <code>&lt;h3&gt;</code>, keeping the outline intact.',
        'The grid reflows to a single column on small screens with no change in reading order.',
    ]),
);
