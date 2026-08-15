// ------------------------------
// Documentation: pl-product-card
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

const IMG = seed => `https://picsum.photos/seed/${seed}/600/600`;

export default () => page(
    header({
        tag: 'pl-product-card',
        title: 'Product Card',
        lede: 'A frame for a product, and a demonstration that most components are just other components.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Generates': 'Nothing; it is a layout',
        'Import': '<code>@platformdesign/components/pl-product-card</code>',
    }),

    p(`This component writes no markup at all. You write real HTML inside it and mark the regions
       with <code>data-*</code> attributes, exactly as the
       <a href="/documentation/sections">content sections</a> do. What it contributes is a named,
       documented layout that the page's own CSS can still reach, and because the content stays in
       the page's DOM, the product name and price are readable by a crawler with JavaScript off.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-product-card';`, 'js'),

    demo(`
        <pl-product-card style="max-inline-size: 18rem">
            <div data-media>
                <img src="${IMG('jacket')}" alt="">
                <pl-badge content="New" data-standalone data-badge></pl-badge>
            </div>
            <p data-eyebrow>Outerwear</p>
            <h3 data-title><a href="#">Field Jacket</a></h3>
            <pl-ratings value="4" readonly></pl-ratings>
            <p data-price>$148 <s>$195</s></p>
            <div data-actions>
                <pl-button full><pl-icon icon="shopping-bag" size="1rem"></pl-icon> Add to bag</pl-button>
            </div>
        </pl-product-card>
    `, { layout: 'stack' }),

    p(`Every piece inside that card already existed:
       <a href="/documentation/pl-badge">pl-badge</a>,
       <a href="/documentation/pl-ratings">pl-ratings</a>,
       <a href="/documentation/pl-icon">pl-icon</a>, and
       <a href="/documentation/pl-button">pl-button</a>. Nothing here re-implements a rating or a
       button, which is the point of the surface being a layout rather than a widget.`),

    section('In a grid'),

    p(`The card never sets its own width. It fills whatever track it is placed in, so the grid
       decides the columns and the card just fills one.`),

    demo(`
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(11rem,1fr));gap:1rem;inline-size:100%">
            <pl-product-card>
                <div data-media><img src="${IMG('knit')}" alt=""></div>
                <h3 data-title><a href="#">Merino Crew</a></h3>
                <p data-price>$96</p>
            </pl-product-card>
            <pl-product-card>
                <div data-media><img src="${IMG('belt')}" alt=""></div>
                <h3 data-title><a href="#">Leather Belt</a></h3>
                <p data-price>$64</p>
            </pl-product-card>
            <pl-product-card>
                <div data-media>
                    <img src="${IMG('boots')}" alt="">
                    <pl-badge content="Sale" data-intent="error" data-standalone data-badge></pl-badge>
                </div>
                <h3 data-title><a href="#">Suede Boots</a></h3>
                <p data-price>$180 <s>$240</s></p>
            </pl-product-card>
        </div>
    `, { layout: 'stack' }),

    p(`<code>[data-actions]</code> is pushed to the bottom with <code>margin-block-start: auto</code>,
       which is what keeps a row of cards with different title lengths lined up along their buttons
       instead of each one ending wherever its text happened to stop.`),

    callout('note', 'The title carries the link, not the card',
        `Wrapping the whole card in one <code>&lt;a&gt;</code> would swallow every control inside
         it. You cannot nest a button in a link. Instead the title's link stretches over the card
         with an absolutely positioned <code>::after</code>, so the whole surface is clickable,
         while <code>[data-actions]</code> sits above it on the z-axis and stays individually
         clickable. Two real controls, one convenient click target.`),

    section('Regions'),

    table(
        ['Marker', 'Description'],
        [
            { cells: ['<code>data-media</code>', 'The image box. Fixed aspect ratio, so a grid of cards stays on one baseline whatever each image\'s intrinsic ratio is.'] },
            { cells: ['<code>data-badge</code>', 'Inside <code>[data-media]</code>: floats over the image\'s corner. Give a <a href="/documentation/pl-badge">pl-badge</a> here the <code>data-standalone</code> attribute, or half of it lands outside the cropped image and is clipped.'] },
            { cells: ['<code>data-eyebrow</code>', 'Small uppercase category line.'] },
            { cells: ['<code>data-title</code>', 'The product name. Put the link here.'] },
            { cells: ['<code>data-price</code>', 'Price. A nested <code>&lt;s&gt;</code> is styled as the struck-through original.'] },
            { cells: ['<code>data-actions</code>', 'Buttons, pinned to the bottom of the card.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--card-media-ratio</code>', 'Aspect ratio of the image box. Defaults to <code>1</code>.'] },
            { cells: ['<code>--card-padding</code>', 'Body padding.'] },
            { cells: ['<code>--card-background</code> / <code>--card-border</code> / <code>--card-radius</code>', 'Shared with <a href="/documentation/pl-profile-card">pl-profile-card</a>, so a page can theme both at once.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'Everything is your own HTML: headings stay at whatever level suits the page, and the link is a real link.',
        'Give product images an empty <code>alt=""</code> when the title next to them already says what they show; a filled one would make a screen reader read the name twice.',
        'The stretched link keeps one accessible name for the card while leaving the action buttons separately reachable: a single wrapping <code>&lt;a&gt;</code> could not.',
        'The link\'s focus ring is drawn on the title, so keyboard focus is visible where the text is rather than around the whole card.',
    ]),
);
