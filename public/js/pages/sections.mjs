// ------------------------------
// Documentation: Content sections
// ------------------------------
// The shared guide the nine content component pages lean on, so the Light DOM
// rationale and the surface/align/width table are stated once.

import { page, header, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'Content sections',
        lede: 'Full-width bands you fill with your own HTML, and that a crawler can read without running JavaScript.',
    }),

    p(`The content components compose a landing page: a header, a hero, proof, benefits, features,
       testimonials, objection handling, a closing call to action, and a footer. Each is a
       <strong>Light DOM</strong> band you write real markup into.`),

    section('They style your markup. They do not generate it'),

    p(`This is the decision that shapes every content component. They are styled semantic wrappers:
       you write the HTML inside, and the component supplies the layout.`),

    callout('note', 'Why not generate the markup from attributes?',
        `Because then the content would not exist until JavaScript ran, and that forfeits exactly
         what Light DOM is for. Content in the page's own DOM is visible to search crawlers,
         translatable by the browser, styleable by your own CSS, selectable, and readable with
         scripts blocked. A hero whose headline only appears after hydration has given all of that
         up to save a few lines of markup.`),

    p(`So a section component is usually a stylesheet and a tag name. That is not an unfinished
       component. It is the whole job: a named, documented layout that your own CSS can still
       reach into.`),

    section('The band and the column'),

    p(`Every section is a full-width band with a measure-capped column inside it. That is done with
       a grid rather than a wrapper <code>&lt;div&gt;</code>, so your markup stays exactly what you
       wrote:`),

    code(`
        [full-start]  gutter  [content-start]  content  [content-end]  gutter  [full-end]
    `, 'text'),

    p(`Children land in the content column automatically. Anything that should run edge to edge:
       a background image, a full-bleed strip: opts in with <code>data-bleed</code>.`),

    section('Shared attributes'),

    p('Every section in this family accepts these. They are plain attributes, read by CSS:'),

    table(
        ['Attribute', 'Values', 'Description'],
        [
            { cells: ['<code>data-surface</code>', '<code>muted</code>, <code>ink</code>, <code>brand</code>', 'The band\'s color scheme. <code>ink</code> and <code>brand</code> invert: muted text, rules, and buttons re-point with them.'] },
            { cells: ['<code>data-align</code>', '<code>center</code>', 'Centres the content column\'s text and actions.'] },
            { cells: ['<code>data-width</code>', '<code>narrow</code>, <code>wide</code>, <code>full</code>', 'The content column\'s measure. Default is <code>68rem</code>.'] },
        ],
    ),

    demo(`
        <pl-benefits data-surface="muted" data-align="center" data-width="narrow">
            <h2>A muted, centred, narrow band</h2>
            <p>Three attributes, no custom CSS.</p>
        </pl-benefits>
    `, { layout: 'bleed' }),

    callout('note', 'Why these are attributes, not props',
        `Nothing in JavaScript reads them: CSS does. Per the
         <a href="/documentation/authoring">authoring guide</a>, a plain attribute is the right tool
         when a value needs no type and no reflection. Declaring them as <code>static props</code>
         would only buy pointless repaints.`),

    section('Shared markup hooks'),

    p(`Sections style your content structurally, so most of it needs no classes at all: an
       <code>&lt;h2&gt;</code> is the section title, and the paragraph directly after it is the
       lede. Three data attributes cover what structure alone cannot express:`),

    table(
        ['Hook', 'Description'],
        [
            { cells: ['<code>data-eyebrow</code>', 'A small label above the title.'] },
            { cells: ['<code>data-actions</code>', 'A row of buttons or links, spaced and aligned with the section.'] },
            { cells: ['<code>data-bleed</code>', 'Opt a child out of the content column so it spans the full band.'] },
        ],
    ),

    p('They are data attributes rather than classes so they cannot collide with your own naming.'),

    section('Background images and masks'),

    p(`Every section's fill is <code>--section-bg</code> — a solid color, set directly on the band
       and re-pointed by <code>data-surface</code>. Two more properties layer an image on top of
       it, and a third shapes that image with a mask:`),

    table(
        ['Property', 'Default', 'Description'],
        [
            { cells: ['<code>--section-bg-image</code>', '<code>none</code>', 'Any CSS <code>&lt;image&gt;</code>: a <code>url(…)</code> photo, a gradient, or several layered with commas. Cover-fit, centered.'] },
            { cells: ['<code>--section-mask-image</code>', '<code>none</code>', 'A mask shape: a gradient for a fade, a <code>url(…)</code> SVG for a silhouette. Shapes the image only.'] },
            { cells: ['<code>--section-mask-size</code>, <code>-position</code>, <code>-repeat</code>', '<code>100% 100%</code>, <code>center</code>, <code>no-repeat</code>', 'The usual <code>mask-*</code> geometry, for a mask that should tile or sit off-center.'] },
        ],
    ),

    demo(`
        <pl-hero data-align="center" style="
            --section-bg: #0F1115;
            --section-ink: #fff;
            --section-bg-image: linear-gradient(135deg, #7C3AED, #2563EB);
            --section-mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
        ">
            <p data-eyebrow>Masked background</p>
            <h1>Fades to the section's own color</h1>
            <p>Not to whatever happens to render behind it.</p>
        </pl-hero>
    `, { layout: 'bleed' }),

    callout('note', 'The mask only ever touches the image, never the text',
        `<code>mask-image</code> shapes everything an element paints, so applying it to the section
         itself would cut the headline along with the background the moment a mask was set. The
         image lives on its own layer, behind the real content but above the section's own
         <code>--section-bg</code> — which is also why a masked photo fades TO that color instead of
         to transparent-then-page. Nothing under it can ever be lost, because there's nothing
         painted under it except color that was already meant to be there.`),

    p(`No image, no mask, nothing changes: both default to <code>none</code>, and every section that
       never sets them renders exactly as it did before these properties existed.`),

    section('Styling from your own page'),

    p(`Because these are Light DOM, your stylesheet reaches them directly, no
       <code>::part()</code>, no custom property indirection. The components' rules are unlayered
       and tag-level, so ordinary specificity settles it: one class of your own outranks them, and
       a stray <code>p { margin: 3rem }</code> elsewhere in your stylesheet does not:`),

    code(`
        /* Tag-level is enough here: nothing in the library outranks it. */
        pl-hero {
            --section-space: 10rem;
        }

        pl-hero h1 {
            font-size: 5rem;
        }
    `, 'css'),

    section('The components'),

    table(
        ['Step', 'Component', 'Purpose'],
        [
            { cells: ['1', '<a href="/documentation/pl-header">pl-header</a>', 'Simple, sticky, one call to action.'] },
            { cells: ['2', '<a href="/documentation/pl-hero">pl-hero</a>', 'The value proposition and main offer.'] },
            { cells: ['3', '<a href="/documentation/pl-social-proof">pl-social-proof</a>', 'Logos, ratings, or headline numbers.'] },
            { cells: ['4', '<a href="/documentation/pl-benefits">pl-benefits</a>', 'What the visitor gets. Their end result.'] },
            { cells: ['5', '<a href="/documentation/pl-features">pl-features</a>', 'The product itself.'] },
            { cells: ['6', '<a href="/documentation/pl-testimonials">pl-testimonials</a>', 'Trust, in someone else\'s words.'] },
            { cells: ['7', '<a href="/documentation/pl-faqs">pl-faqs</a>', 'Objection handling.'] },
            { cells: ['8', '<a href="/documentation/pl-cta">pl-cta</a>', 'The closing ask.'] },
            { cells: ['9', '<a href="/documentation/pl-footer">pl-footer</a>', 'Contact details, minimal links.'] },
        ],
    ),
);
