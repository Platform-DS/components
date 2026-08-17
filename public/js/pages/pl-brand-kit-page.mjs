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

    section('The template'),

    pageDemo(`
        <pl-brand-kit-page>

            <!-- Primary logo on its ground -->
            <section data-logo data-tone="primary">
                <p data-label>Primary logo</p>
                <div data-mark></div>
                <div>
                    <p data-wordmark>Northwind</p>
                    <p data-tagline>Tagline</p>
                </div>
            </section>

            <!-- The lockup on its other grounds -->
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

            <!-- Imagery and applications -->
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

    p(`The empty marks and tiles render as dashed slots on purpose, so the board reads correctly
       before the assets exist. Drop an <code>&lt;img&gt;</code>, an inline SVG, or a
       <code>pl-picture</code> into a <code>data-mark</code> or <code>data-tile</code> and it
       fills the frame, cover-fit.`),

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
            { cells: ['<code>data-mark</code>', 'A sized frame for the logo; dashed slot while empty. <code>data-mark="circle"</code> rounds it.'] },
            { cells: ['<code>data-variants</code>', 'A two-up grid of <code>data-variant</code> panels, each with its own tone.'] },
            { cells: ['<code>data-lockup</code>', 'A small mark beside a stacked name.'] },
            { cells: ['<code>data-band</code>', 'A padded, centered band. Its <code>data-band-title</code> sits between two short rules.'] },
            { cells: ['<code>data-swatches</code> / <code>data-swatch</code>', 'The palette circles. <code>primary</code>, <code>accent</code>, <code>sunken</code>, <code>ink</code>, <code>surface</code>, <code>success</code>, <code>warning</code>, <code>danger</code>; a <code>&lt;small&gt;</code> inside is the value line.'] },
            { cells: ['<code>data-faces</code> / <code>data-face</code>', 'The type specimens: a <code>data-glyph</code>, a <code>data-face-name</code>, a <code>data-alphabet</code>. Face is <code>display</code>, <code>body</code>, or <code>mono</code>.'] },
            { cells: ['<code>data-sample</code>', 'The headline-plus-body sentence under the specimens.'] },
            { cells: ['<code>data-tiles</code> / <code>data-tile</code>', 'The imagery mosaic. <code>data-span="tall"</code> or <code>"wide"</code>; a tone makes a tile a colored plate; empty untoned tiles are dashed slots.'] },
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
