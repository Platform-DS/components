// ------------------------------
// Documentation: pl-content-page
// ------------------------------
// The demo is a complete article rather than a fragment, because the template
// is about the whole editorial hierarchy — masthead to colophon — and a piece
// of it proves nothing.

import { page, header, meta, section, p, ul, code, callout, pageDemo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-content-page',
        title: 'Content Page',
        lede: 'An editorial column: the type hierarchy of a magazine article, driven entirely by tokens.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Generates': 'Nothing; it is a measured column',
        'Import': '<code>@platformdesign/components/pl-content-page</code>',
    }),

    section('What it is for'),

    p(`Long-form reading with editorial furniture: a masthead, a kicker–headline–lede block,
       ornament rules between movements, body copy with a drop cap and a pull quote, a full-color
       quote band, a centered closing, and a colophon. It is the template that shows what a
       theme's <em>typography</em> is worth — the UI kit page stresses the palette on components;
       this one stresses the display face, the body face, and the hierarchy between them, on
       nothing but words.`),

    callout('note', 'Two accents, indirected on purpose',
        `The decorative color — the kicker, the drop cap, the ornament diamonds, the quote mark —
         flows through <code>--content-accent</code> and <code>--content-accent-2</code>, which
         default to the primary and warning tokens. Repoint the two accents and the article
         re-seasons without touching the semantic palette underneath.`),

    section('The template'),

    pageDemo(`
        <pl-content-page>

            <!-- Masthead: nameplate left, issue right, heavy rule below -->
            <header data-masthead>
                <p data-brand>Northwind Journal</p>
                <p data-issue>Vol. 01 — Typography</p>
            </header>

            <!-- Headline block: kicker, headline, lede -->
            <section data-headline>
                <p data-kicker>This gives context</p>
                <h1>You will read this first.</h1>
                <p data-lede>And this line will carry you into the story.</p>
            </section>

            <div data-ornament><span></span><span></span><span></span></div>

            <!-- Body beside a pull quote -->
            <section data-body>
                <div>
                    <p data-dropcap>You will read this body copy if you want to find out more.
                       That depends on whether the headline and the subhead earned your attention.
                       Body text works hardest of all: small size, long lines, and the burden of
                       the full argument.</p>
                    <p>It reads best with generous leading and a measure of 60 to 70 characters.
                       Use <strong>bold within a sentence</strong> to mark the phrases a skimmer
                       must not miss, and use it rarely, or it stops working.</p>
                    <p>Most readers skim. Hierarchy is how you choose what they take away: one
                       idea per level, each level set in a distinct size, weight, or face from
                       the theme.</p>
                </div>
            </section>

            <!-- A movement with a sub header and two-column prose -->
            <section data-section>
                <h2>A sub header sets the pace</h2>
                <p data-subtitle>Second level of the hierarchy</p>
                <div data-columns>
                    <p>Below the headline, sections carry the reader through the piece. A sub
                       header announces the turn; the paragraphs that follow do the quiet work.
                       Keep them short — three to five sentences — and let the space between
                       them breathe.</p>
                    <p>Color belongs here too, in small doses: a primary-colored drop cap, an
                       ornament between movements, a warm accent under a link. The theme's
                       palette should season the page, never flood it.</p>
                </div>
            </section>

            <!-- The one full-color moment -->
            <blockquote data-quote>
                <p>Don't sell products. Sell perspectives.</p>
                <cite>Kenny Song — Brand Designer</cite>
            </blockquote>

            <div data-ornament><span></span></div>

            <!-- Closing: resolution, CTA, footnote -->
            <section data-closing>
                <p>Close with a short paragraph that resolves the argument, then point the reader
                   somewhere: a concise call to action with an action verb, set apart so it reads
                   before they leave the page.</p>
                <p><pl-button-link href="#">Read the series</pl-button-link></p>
                <p data-footnote>* Footnotes sit last, smaller and italic, as a visual cue for asides.</p>
            </section>

            <!-- Colophon -->
            <footer data-colophon>
                <span>Northwind</span>
                <span>© Northwind Communications</span>
                <span>Page 01</span>
            </footer>

        </pl-content-page>
    `, { title: 'Content template preview', initial: 834 }),

    p(`Resize it. The body grid and the two-column prose fold to a single column before the type
       scales down, so the reading experience degrades in the right order: measure first, then
       size.`),

    section('Theming it'),

    p(`Swap the display and body faces and the whole hierarchy follows — headline, drop cap, pull
       quote, and quote band are all set in <code>--font-family-display</code>, and everything
       else in the body face:`),

    code(`
        :root {
            --font-family-display: 'Space Grotesk', sans-serif;
            --font-family-sans-serif: 'IBM Plex Sans', sans-serif;
            --color-primary: #3B5BDB;
        }
    `, 'css'),

    p(`To restyle one article without touching the page around it, set the <code>--pl-*</code>
       aliases (or the accents) on the element:`),

    code(`
        <pl-content-page style="
            --content-accent: #7048E8;
            --content-accent-2: #E64980;
            --pl-font-family-display: Georgia, serif;
        ">
    `, 'html'),

    section('Regions'),

    table(
        ['Marker', 'Description'],
        [
            { cells: ['<code>data-masthead</code>', 'Nameplate row above a heavy rule. <code>data-brand</code> and <code>data-issue</code> inside it.'] },
            { cells: ['<code>data-headline</code>', 'The opening block: <code>data-kicker</code>, an <code>&lt;h1&gt;</code>, <code>data-lede</code>.'] },
            { cells: ['<code>data-ornament</code>', 'A rule broken by diamonds. Each child <code>&lt;span&gt;</code> is one diamond; they alternate the two accents.'] },
            { cells: ['<code>data-body</code>', 'Prose beside a <code>data-pull-quote</code>. Folds to one column when narrow.'] },
            { cells: ['<code>data-dropcap</code>', 'A paragraph whose first letter sets as a drop cap in the accent color.'] },
            { cells: ['<code>data-section</code>', 'A movement: an <code>&lt;h2&gt;</code>, a <code>data-subtitle</code>, optionally <code>data-columns</code> prose.'] },
            { cells: ['<code>data-quote</code>', 'The full-color quote band: a paragraph and a <code>&lt;cite&gt;</code>.'] },
            { cells: ['<code>data-closing</code>', 'Centered resolution and call to action. <code>data-footnote</code> for the aside.'] },
            { cells: ['<code>data-colophon</code>', 'The article\'s own footer row, inside the measure.'] },
            { cells: ['<code>data-full</code>', 'On any top-level region: opt out of the measure and run the width of the page.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Default', 'Description'],
        [
            { cells: ['<code>--content-measure</code>', '<code>52rem</code>', 'Width of the inner column. The page itself is always full width.'] },
            { cells: ['<code>--content-padding</code>', '<code>--pl-size-48 --pl-size-32</code>', 'Space around the article. The inline half is the gutter the measure is centered in.'] },
            { cells: ['<code>--content-flow</code>', '<code>--pl-size-48</code>', 'Vertical rhythm between top-level regions.'] },
            { cells: ['<code>--content-accent</code>', '<code>--pl-color-primary</code>', 'First decorative accent: kicker, drop cap, odd diamonds.'] },
            { cells: ['<code>--content-accent-2</code>', '<code>--pl-color-warning</code>', 'Second accent: quote mark, even diamonds.'] },
            { cells: ['<code>--content-rule</code>', '<code>--pl-color-border</code>', 'The hairline rules: ornament lines and the colophon border.'] },
        ],
    ),

    section('Next'),

    ul([
        '<a href="/documentation/theming">Theming</a>: the token contract the hierarchy reads from.',
        '<a href="/documentation/pl-brand-kit-page">pl-brand-kit-page</a>: the same idea for a brand — palette and faces as a board.',
        '<a href="/documentation/pl-ui-kit-page">pl-ui-kit-page</a>: the theme on components instead of prose.',
    ]),
);
