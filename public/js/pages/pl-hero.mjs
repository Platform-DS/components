// ------------------------------
// Documentation — pl-hero
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-hero',
        title: 'Hero',
        lede: 'The value proposition and main offer — the first thing anyone reads.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>SectionElement</code>',
        'Guide': '<a href="/documentation/sections">Content sections</a>',
        'Import': '<code>@platformdesign/components/pl-hero</code>',
    }),

    p(`Step 2 of the landing-page formula. Speak to the visitor: why would they choose you? One
       call to action, one supporting image at most. Everything here is your own markup, so the
       headline is in the page source where a crawler and a translator can reach it.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-hero';`, 'js'),

    demo(`
        <pl-hero align="center" surface="ink">
            <p data-eyebrow>Zero dependencies</p>
            <h1>Components that outlive your framework.</h1>
            <p>Native custom elements and CSS custom properties. No build step.</p>
            <div data-actions>
                <pl-button size="lg">Read the docs</pl-button>
                <pl-button-link href="#" variant="secondary" size="lg">GitHub</pl-button-link>
            </div>
        </pl-hero>
    `, { layout: 'bleed' }),

    callout('note', 'Buttons invert with the band',
        `On an <code>ink</code> or <code>brand</code> surface, a secondary button's near-black text
         would land on a near-black background. The section re-points the button's own
         <code>--button-*</code> hooks, so outline and ghost buttons stay legible without you
         restyling them.`),

    section('Markup'),

    p('Structural, so almost nothing needs a class:'),

    table(
        ['Element', 'Becomes'],
        [
            { cells: ['<code>[data-eyebrow]</code>', 'The small label above the headline.'] },
            { cells: ['<code>&lt;h1&gt;</code>', 'The headline, on its own fluid scale.'] },
            { cells: ['<code>&lt;h1&gt; + &lt;p&gt;</code>', 'The lede — the paragraph directly after the headline.'] },
            { cells: ['<code>[data-actions]</code>', 'The button row.'] },
            { cells: ['<code>&lt;figure&gt;</code>, <code>&lt;img&gt;</code>', 'The media, when <code>layout="split"</code>.'] },
        ],
    ),

    section('Split layout'),

    p(`<code>layout="split"</code> puts the copy beside a figure above 60rem, and stacks them below
       it. The figure can be a <code>&lt;figure&gt;</code>, <code>&lt;picture&gt;</code>,
       <code>&lt;img&gt;</code>, or <code>&lt;video&gt;</code>.`),

    demo(`
        <pl-hero layout="split" surface="muted">
            <h1>Ship the source.</h1>
            <p>Standard ES modules and standard CSS — nothing to compile.</p>
            <div data-actions><pl-button>Get started</pl-button></div>
            <figure><img src="/img/logo/platform-thumbnail.png" alt="Platform"></figure>
        </pl-hero>
    `, { layout: 'bleed' }),

    section('Plain band'),

    p('Without a surface it inherits the page background, which suits a hero above a light page.'),

    demo(`
        <pl-hero>
            <h1>A hero on the page background.</h1>
            <p>No surface attribute, left-aligned by default.</p>
            <div data-actions><pl-button variant="secondary">Learn more</pl-button></div>
        </pl-hero>
    `, { layout: 'bleed' }),

    section('Attributes'),

    p('Plus the shared <code>surface</code>, <code>align</code>, and <code>width</code> — see the <a href="/documentation/sections">Content sections</a> guide.'),

    table(
        ['Attribute', 'Values', 'Description'],
        [
            { cells: ['<code>layout</code>', '<code>split</code>', 'Copy beside the figure above 60rem.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--section-space</code>', 'Vertical padding of the band.'] },
            { cells: ['<code>--section-width</code>', 'Measure of the content column.'] },
            { cells: ['<code>--section-gutter</code>', 'Minimum space either side of the column.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'The headline is a real <code>&lt;h1&gt;</code> in the page source — one per page.',
        'Content is Light DOM, so it is indexed, translatable, and readable with scripts blocked.',
        'Decorative hero imagery should carry <code>alt=""</code>; meaningful imagery needs real alt text.',
        'Keep to one primary action — the formula\'s point is that a second competing CTA costs conversions.',
    ]),
);
