// ------------------------------
// Documentation: pl-picture
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-picture',
        title: 'Picture',
        lede: 'A real <picture>: your sources and your img, given a shape and a fit.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': '<code>&lt;picture&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-picture</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-picture';`, 'js'),

    demo(`
        <pl-picture data-ratio="16/9" style="max-inline-size:24rem;--picture-radius:12px">
            <img src="https://picsum.photos/seed/pict/900/600" alt="">
        </pl-picture>
    `, { layout: 'stack' }),

    code(`
        <pl-picture data-ratio="16/9">
            <source srcset="wide.avif" type="image/avif" media="(min-width: 40rem)">
            <source srcset="wide.webp" type="image/webp">
            <img src="wide.jpg" alt="A field at dawn">
        </pl-picture>
    `, 'html'),

    callout('note', 'Light DOM, because <picture> only reads its own children',
        `A <code>&lt;picture&gt;</code> chooses a source by walking its child
         <code>&lt;source&gt;</code> elements. Slot them into a shadow root and they are no longer
         its children: the picture quietly falls back to the <code>&lt;img&gt;</code>'s own
         <code>src</code> and throws away every format and art-direction rule you offered, with no
         error to tell you. Staying in the page's DOM avoids that entirely, and keeps the
         <code>&lt;img&gt;</code> where the preload scanner, <code>loading="lazy"</code> and a
         crawler all expect it.`),

    section('Shape and fit'),

    p(`Without <code>data-ratio</code> the element takes the image's own intrinsic size: an aspect
       ratio nobody asked for is a crop nobody asked for. With one, the box holds that shape and
       the image fills it.`),

    demo(`
        <div style="display:flex;gap:1rem;flex-wrap:wrap">
            <pl-picture data-ratio="1" style="inline-size:9rem"><img src="https://picsum.photos/seed/a/600/400" alt=""></pl-picture>
            <pl-picture data-ratio="1" data-fit="contain" style="inline-size:9rem;background:var(--color-surface-sunken)"><img src="https://picsum.photos/seed/a/600/400" alt=""></pl-picture>
            <pl-picture data-ratio="3/4" style="inline-size:9rem"><img src="https://picsum.photos/seed/b/600/900" alt=""></pl-picture>
        </div>
    `, { layout: 'stack' }),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>data-ratio</code>', '<code>String</code>', 'Any CSS aspect ratio: <code>16/9</code>, <code>1</code>, <code>3 / 4</code>. Omit to keep the image\'s own.'] },
            { cells: ['<code>data-fit</code>', '<code>String</code>', '<code>cover</code> (default), <code>contain</code>, <code>fill</code>, <code>none</code>. Only applies with a ratio.'] },
        ],
    ),

    section('Properties'),

    table(
        ['Member', 'Description'],
        [
            { cells: ['<code>picture</code>', 'The real <code>&lt;picture&gt;</code>.'] },
            { cells: ['<code>image</code>', 'The <code>&lt;img&gt;</code> inside it.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--picture-radius</code>', 'Corner radius. The box clips, so the image is rounded with it.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'The <code>&lt;img&gt;</code> is yours, so <code>alt</code> behaves exactly as it always does: describe the image, or use <code>alt=""</code> when it is decoration.',
        'Set <code>data-ratio</code> whenever you can: reserving the shape before the image loads is what stops the page reflowing under someone mid-read.',
        'Art direction with <code>media</code> on a <code>&lt;source&gt;</code> works normally. That is the whole reason this is a real <code>&lt;picture&gt;</code>.',
    ]),
);
