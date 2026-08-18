// ------------------------------
// Documentation: pl-brand-kit-page
// ------------------------------
// The demo is a complete board rather than a fragment: a brand kit only makes
// its argument when the logo band, the palette, and the faces are seen at
// once, in one scroll.

import { page, header, meta, section, p, ul, code, callout, pageDemo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-brand-kit-page',
        title: 'Brand Kit Page',
        lede: 'A brand board: the logo on its grounds, the palette as circles, the faces as specimens.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Generates': 'Nothing; it is a stack of bands',
        'Import': '<code>@platformdesign/components/pl-brand-kit-page</code>',
    }),

    section('What it is for'),

    p(`The single-sheet brand board a studio hands over with an identity: the primary logo on its
       ground, the lockup on its other grounds, the palette, the two type faces, an imagery
       mosaic, and a color strip to close. Where the UI kit page proves a theme on components,
       this one presents the theme <em>as the brand itself</em>.`),

    callout('note', 'Tones, not colors',
        `Every colored region takes <code>data-tone</code> — <code>primary</code>,
         <code>accent</code>, <code>dark</code>, <code>light</code> — and each tone is a
         background/ink pair read from the theme's tokens. Swap the theme and the logo band, the
         variant grounds, the tiles, and the strip all recolor together; the swatch circles
         repaint because each one paints a token directly.`),

    callout('note', 'Three narrow exceptions to "the page owns nothing"',
        `Every region here is still the author's own markup — except three, and each one only
         fills what was left EMPTY. A blank <code>data-mark</code> gets a placeholder icon rather
         than a dashed hole; blank <code>data-wordmark</code> / <code>data-tagline</code> elements
         pick up <code>name</code> and <code>tagline</code>; and <code>images</code> drops photos
         into whichever untoned tiles in the EXISTING imagery grid are still empty — no separate
         band, no new markup. Put real content in any of these yourself and the fill never runs.`),

    section('The template'),

    pageDemo(`
        <pl-brand-kit-page name="Northwind" tagline="Tagline"
            images='["https://picsum.photos/seed/nw-ref1/480/480",
                     "https://picsum.photos/seed/nw-ref2/480/480",
                     "https://picsum.photos/seed/nw-ref3/480/480"]'>

            <!-- Primary logo on its ground — data-mark, data-wordmark, and
                 data-tagline are all left empty, so all three fill: the mark
                 from the library's default icon, the text from name/tagline -->
            <section data-logo data-tone="primary">
                <p data-label>Primary logo</p>
                <div data-mark></div>
                <div>
                    <p data-wordmark></p>
                    <p data-tagline></p>
                </div>
            </section>

            <!-- The lockup on its other grounds — same empty mark, same fill.
                 Its name span is hand-authored on purpose: the two-line break
                 is a layout choice, not a value name/tagline can express. -->
            <div data-variants>
                <section data-variant data-tone="accent">
                    <p data-label>Logo on accent</p>
                    <div data-lockup>
                        <div data-mark></div>
                        <span>Northwind<br>Brand</span>
                    </div>
                </section>
                <section data-variant data-tone="light">
                    <p data-label>Brandmark</p>
                    <div data-mark="circle"></div>
                </section>
            </div>

            <!-- Palette: each circle paints a token, so this IS the theme -->
            <section data-band>
                <h2 data-band-title>Color palette</h2>
                <div data-swatches>
                    <div data-swatch="primary">Primary <small>--color-primary</small></div>
                    <div data-swatch="accent">Accent <small>--color-warning</small></div>
                    <div data-swatch="sunken">Light <small>--color-surface-sunken</small></div>
                    <div data-swatch="ink">Dark <small>--color-ink</small></div>
                </div>
            </section>

            <!-- Typography: the two faces, side by side -->
            <section data-band data-tone="dark">
                <h2 data-band-title>Typography</h2>
                <div data-faces>
                    <div data-face="display">
                        <span data-glyph>Aa</span>
                        <div>
                            <p data-face-name>Display</p>
                            <p data-alphabet>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                               a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 0</p>
                        </div>
                    </div>
                    <div data-face="body">
                        <span data-glyph>Aa</span>
                        <div>
                            <p data-face-name>Body</p>
                            <p data-alphabet>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                               a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 0</p>
                        </div>
                    </div>
                </div>
                <div data-sample>
                    <p>Headlines set in the display face.</p>
                    <p>Body copy is set in the secondary face at comfortable sizes. Use it for
                       paragraphs, captions, and interface text. Keep headlines short and let the
                       type do the talking.</p>
                </div>
            </section>

            <!-- Imagery and applications — three untoned tiles are left empty
                 here, so images fills them in document order: the tall one
                 first, then the two plain ones. The two toned "application"
                 tiles keep their own hand-authored text either way. -->
            <section data-band>
                <h2 data-band-title>Imagery &amp; applications</h2>
                <div data-tiles>
                    <div data-tile data-span="tall"></div>
                    <div data-tile></div>
                    <div data-tile data-tone="primary">Northwind</div>
                    <div data-tile data-tone="accent">Tagline</div>
                    <div data-tile></div>
                </div>
            </section>

            <!-- The palette once more, as a closing rule -->
            <div data-strip>
                <span data-tone="primary"></span>
                <span data-tone="accent"></span>
                <span data-tone="light"></span>
                <span data-tone="dark"></span>
            </div>

        </pl-brand-kit-page>
    `, { title: 'Brand kit template preview', initial: 834 }),

    p(`The three empty tiles above are ordinary <code>data-tile</code> elements — nothing new was
       added to the imagery grid to make this work. <code>images</code> just walks the tiles that
       are already there and drops one URL into each empty, untoned one it finds, in document
       order. The default template has three such slots, which is why three is the practical
       ceiling: give it more and the extras are dropped with a console warning; give it fewer and
       the remaining slots stay empty dashed placeholders, same as if <code>images</code> were
       never set. A tile the author already filled — toned or not — is never a candidate.`),

    p(`<code>data-mark</code>, <code>data-wordmark</code>, and <code>data-tagline</code> follow the
       identical rule: leave one empty and it fills — from <code>brand-icon</code> or the built-in
       default for the mark, from <code>name</code> and <code>tagline</code> for the text. Put real
       content in any of them yourself and the fill never runs; the component only ever touches
       what the author left empty.`),

    section('Props &amp; attributes'),

    p(`<code>images</code>, <code>name</code>, and <code>tagline</code> are typed props — each
       round-trips through <code>this.props</code> the same way any <code>Array</code>- or
       <code>String</code>-typed prop does (see <a href="/documentation/authoring">Reflecting
       properties &amp; attributes</a>). <code>brand-icon</code> is not: it's markup, not a value
       with a type to enforce, so it's a plain observed attribute read straight off the element.
       There is no <code>el.props.brandIcon</code> — read or write it with
       <code>getAttribute</code>/<code>setAttribute</code> like any other attribute.`),

    table(
        ['Attribute', 'Kind', 'Default', 'Description'],
        [
            { cells: ['<code>name</code>', 'prop, <code>String</code>', '<code>\'\'</code>', 'Fills an empty <code>data-wordmark</code>.'] },
            { cells: ['<code>tagline</code>', 'prop, <code>String</code>', '<code>\'\'</code>', 'Fills an empty <code>data-tagline</code>.'] },
            { cells: ['<code>images</code>', 'prop, <code>Array</code>', '<code>[]</code>', 'Fills empty, untoned <code>data-tile</code> elements in document order, one URL each. Extra URLs beyond the available empty tiles are dropped with a console warning.'] },
            { cells: ['<code>brand-icon</code>', 'plain attribute', '—', 'Raw <code>&lt;svg&gt;</code> markup, used to fill every empty <code>data-mark</code>. Falls back to the library\'s default icon when unset or not well-formed SVG.'] },
        ],
    ),

    code(`
        el.props.name = 'Northwind';
        el.props.tagline = 'Where the wind takes you';
        el.props.images = [
            'https://cdn.example.com/moodboard-1.jpg',
            'https://cdn.example.com/moodboard-2.jpg',
        ];

        el.setAttribute('brand-icon', '<svg viewBox="0 0 24 24">…</svg>');
    `, 'js'),

    section('Theming it'),

    p(`The board is the theme. Change the contract tokens and every band follows:`),

    code(`
        :root {
            --color-primary: #2B6E4F;
            --color-warning: #C98A2B;
            --font-family-display: 'Space Grotesk', sans-serif;
        }
    `, 'css'),

    p(`To show one brand inside a page themed as another — a portfolio of boards, a client
       preview — set the <code>--pl-*</code> aliases on the element instead:`),

    code(`
        <pl-brand-kit-page style="
            --pl-color-primary: #7048E8;
            --brand-accent: #E64980;
            --pl-font-family-display: 'DM Serif Display', serif;
        ">
    `, 'html'),

    callout('warn', 'The accent tone is the warning token by default',
        `Brand boards usually carry a second, warmer color the semantic palette doesn't name, so
         <code>data-tone="accent"</code> and <code>data-swatch="accent"</code> read from
         <code>--brand-accent</code>, which defaults to the warning token. Repoint
         <code>--brand-accent</code> when the brand's second color isn't amber.`),

    section('Regions'),

    table(
        ['Marker', 'Description'],
        [
            { cells: ['<code>data-tone</code>', 'A background/ink pair on any region: <code>primary</code>, <code>accent</code>, <code>dark</code>, <code>light</code>.'] },
            { cells: ['<code>data-logo</code>', 'The hero band: a corner <code>data-label</code>, a <code>data-mark</code>, a <code>data-wordmark</code> and <code>data-tagline</code>.'] },
            { cells: ['<code>data-mark</code>', 'A sized frame for the logo. Left empty, it fills itself with <code>brand-icon</code> or the default. <code>data-mark="circle"</code> rounds it.'] },
            { cells: ['<code>data-wordmark</code>', 'The brand name. Left empty, it fills itself with <code>name</code>.'] },
            { cells: ['<code>data-tagline</code>', 'The tagline. Left empty, it fills itself with <code>tagline</code>.'] },
            { cells: ['<code>data-variants</code>', 'A two-up grid of <code>data-variant</code> panels, each with its own tone.'] },
            { cells: ['<code>data-lockup</code>', 'A small mark beside a stacked name — hand-authored text, not <code>name</code>; see below.'] },
            { cells: ['<code>data-band</code>', 'A padded, centered band. Its <code>data-band-title</code> sits between two short rules.'] },
            { cells: ['<code>data-swatches</code> / <code>data-swatch</code>', 'The palette circles. <code>primary</code>, <code>accent</code>, <code>sunken</code>, <code>ink</code>, <code>surface</code>, <code>success</code>, <code>warning</code>, <code>danger</code>; a <code>&lt;small&gt;</code> inside is the value line.'] },
            { cells: ['<code>data-faces</code> / <code>data-face</code>', 'The type specimens: a <code>data-glyph</code>, a <code>data-face-name</code>, a <code>data-alphabet</code>. Face is <code>display</code>, <code>body</code>, or <code>mono</code>.'] },
            { cells: ['<code>data-sample</code>', 'The headline-plus-body sentence under the specimens.'] },
            { cells: ['<code>data-tiles</code> / <code>data-tile</code>', 'The imagery mosaic. <code>data-span="tall"</code> or <code>"wide"</code>; a tone makes a tile a colored plate; an empty untoned tile is a dashed slot — or fills itself with the next URL from <code>images</code>.'] },
            { cells: ['<code>data-strip</code>', 'The closing rule: each child span takes a tone and shares the width.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Default', 'Description'],
        [
            { cells: ['<code>--brand-measure</code>', '<code>60rem</code>', 'Width of the board.'] },
            { cells: ['<code>--brand-band-padding</code>', '<code>--pl-size-64 --pl-size-48</code>', 'Padding inside a band.'] },
            { cells: ['<code>--brand-mark-size</code>', '<code>--pl-size-96</code>', 'The logo frame. Variants shrink it to <code>--pl-size-64</code>.'] },
            { cells: ['<code>--brand-swatch-size</code>', '<code>5.75rem</code>', 'Diameter of a palette circle.'] },
            { cells: ['<code>--brand-tile-size</code>', '<code>13.75rem</code>', 'Row height of the imagery mosaic.'] },
            { cells: ['<code>--brand-strip-size</code>', '<code>--pl-size-16</code>', 'Height of the closing strip.'] },
            { cells: ['<code>--brand-radius</code>', '<code>--pl-border-radius-medium</code>', 'Corners of marks and tiles.'] },
            { cells: ['<code>--brand-accent</code>', '<code>--pl-color-warning</code>', 'The brand\'s second color: the accent tone, swatch, and face names.'] },
        ],
    ),

    section('Next'),

    ul([
        '<a href="/documentation/theming">Theming</a>: the token contract the tones read from.',
        '<a href="/documentation/pl-content-page">pl-content-page</a>: the theme\'s typography at work on an article.',
        '<a href="/documentation/pl-ui-kit-page">pl-ui-kit-page</a>: the theme on every component at once.',
    ]),
);
