// ------------------------------
// Documentation: pl-carousel
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

const IMG = seed => `https://picsum.photos/seed/${seed}/600/600`;

export default () => page(
    header({
        tag: 'pl-carousel',
        title: 'Carousel',
        lede: 'A horizontal run of cards that snaps as it scrolls, because the browser already knows how to scroll.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Uses': 'CSS scroll-snap',
        'Import': '<code>@platformdesign/components/pl-carousel</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-carousel';`, 'js'),

    demo(`
        <pl-carousel label="Featured products" style="--carousel-slide:13rem">
            <pl-product-card>
                <div data-media><img src="${IMG('c1')}" alt=""></div>
                <h3 data-title><a href="#">Field Jacket</a></h3>
                <p data-price>$148</p>
            </pl-product-card>
            <pl-product-card>
                <div data-media><img src="${IMG('c2')}" alt=""></div>
                <h3 data-title><a href="#">Merino Crew</a></h3>
                <p data-price>$96</p>
            </pl-product-card>
            <pl-product-card>
                <div data-media><img src="${IMG('c3')}" alt=""></div>
                <h3 data-title><a href="#">Leather Belt</a></h3>
                <p data-price>$64</p>
            </pl-product-card>
            <pl-product-card>
                <div data-media><img src="${IMG('c4')}" alt=""></div>
                <h3 data-title><a href="#">Suede Boots</a></h3>
                <p data-price>$180</p>
            </pl-product-card>
            <pl-product-card>
                <div data-media><img src="${IMG('c5')}" alt=""></div>
                <h3 data-title><a href="#">Canvas Tote</a></h3>
                <p data-price>$42</p>
            </pl-product-card>
        </pl-carousel>
    `, { layout: 'stack' }),

    section('The scrolling is CSS. The buttons only nudge it.'),

    p(`<code>overflow-inline: auto</code> plus <code>scroll-snap-type</code> already gives a
       carousel that works with a trackpad, a touch swipe, the scrollbar, and the arrow keys,
       with momentum, rubber-banding, and snap points the platform spent years tuning. None of that
       is re-implemented here.`),

    ul([
        'There is no transform track, no current index, no transition to drive, and nothing to resync on resize.',
        'The two buttons call <code>scrollBy</code> and grey themselves out at the ends. That is the entire script.',
        'Any direct child is a slide: product cards, images, whole sections. The carousel does not care.',
    ]),

    callout('note', 'The buttons are built in JavaScript on purpose',
        `The CSS that makes room for them is gated on a <code>data-controls</code> flag that is set
         only once the buttons exist. So if this component's script never runs, the carousel
         degrades to a plain scrollable strip: still swipeable, still keyboard-scrollable, still
         showing every slide, instead of a dead pair of arrows over content that cannot move. Same
         reasoning as the off-canvas navigation in these docs.`),

    section('Slide width'),

    p(`<code>--carousel-slide</code> is the flex-basis of every slide, and the only knob for "how
       many fit at once". Combine it with a media query, or a <code>clamp()</code>, to change the
       count across breakpoints.`),

    demo(`
        <pl-carousel label="Wide slides" style="--carousel-slide:min(22rem, 80%)">
            <div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden"><img src="${IMG('w1')}" alt="" style="inline-size:100%;block-size:100%;object-fit:cover"></div>
            <div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden"><img src="${IMG('w2')}" alt="" style="inline-size:100%;block-size:100%;object-fit:cover"></div>
            <div style="aspect-ratio:16/9;border-radius:12px;overflow:hidden"><img src="${IMG('w3')}" alt="" style="inline-size:100%;block-size:100%;object-fit:cover"></div>
        </pl-carousel>
    `, { layout: 'stack' }),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>label</code>', '<code>String</code>', 'Names the scrollable region for assistive tech. Always set it.'] },
        ],
    ),

    section('Properties'),

    table(
        ['Member', 'Description'],
        [
            { cells: ['<code>track</code>', 'The scroll container, if you want to drive it directly.'] },
            { cells: ['<code>scrollBySlide(direction)</code>', 'Move one slide forward (<code>1</code>) or back (<code>-1</code>).'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--carousel-slide</code>', 'Slide width. Defaults to <code>16rem</code>.'] },
            { cells: ['<code>--carousel-gap</code>', 'Space between slides.'] },
            { cells: ['<code>--carousel-control-top</code>', 'Vertical position of the arrows. Defaults to <code>50%</code>.'] },
            { cells: ['<code>--carousel-control-inset</code>', 'How far the arrows sit in from the edges.'] },
            { cells: ['<code>--carousel-control-background</code>', 'Arrow button fill.'] },
        ],
    ),

    callout('note', 'Why proximity snapping, not mandatory',
        `<code>scroll-snap-type: inline proximity</code> lets someone deliberately stop between
         slides. <code>mandatory</code> fights that, and on a track whose slides are wider than the
         viewport it can trap the scroll entirely: the browser keeps yanking back to a snap point
         that never quite fits.`),

    section('Accessibility'),

    ul([
        'The track is a focusable <code>role="group"</code> with an accessible name from <code>label</code>: a scrollable region has to be reachable by keyboard, or someone who cannot swipe can reach the controls inside the slides but never the scroll itself.',
        'Once focused, the arrow keys, Home, End, Page Up and Page Down all scroll it. That is the browser\'s, not ours.',
        'The arrow buttons have real <code>aria-label</code>s, and are genuinely <code>disabled</code> at the ends rather than just faded, so they leave the tab order when they cannot do anything.',
        'They are kept in the layout when disabled, so the track never shifts sideways as they come and go.',
        'Nothing auto-advances. A carousel that moves on its own steals reading time and needs a pause control to be usable; if you add one, add that too.',
        'Smooth scrolling is dropped under <code>prefers-reduced-motion</code>.',
    ]),
);
