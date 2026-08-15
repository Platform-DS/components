// ------------------------------
// Documentation: pl-collection-page
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-collection-page',
        title: 'Collection Page',
        lede: 'A list of things: a header, optional filters beside the grid, and paging underneath.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Import': '<code>@platformdesign/components/pl-collection-page</code>',
    }),

    callout('note', 'A page shell is deliberately thin',
        `It owns the vertical rhythm between sections and the measure of the content column, and
         nothing else. The sections inside it are where the page actually lives, so if one of
         these ever grows logic, that is a sign the logic belonged in a section.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-collection-page';`, 'js'),

    code(`
        <pl-collection-page>
            <header data-header><h1>Products</h1></header>

            <pl-sidebar>
                <div data-items>
                    <pl-product-card>…</pl-product-card>
                    <pl-product-card>…</pl-product-card>
                </div>
                <div data-aside>…filters…</div>
            </pl-sidebar>

            <pl-pagination page="1" total="9" href="?page={page}"></pl-pagination>
        </pl-collection-page>
    `, 'html'),

    p(`<code>[data-items]</code> is an auto-filling grid rather than a fixed column count, so it
       answers to the space it is actually in, including the narrower space left when a filter
       aside sits beside it.`),


    section('Preview'),

    demo(`
        <pl-collection-page style="--page-padding:1.25rem;--collection-item:8rem;border:1px solid var(--color-border);border-radius:12px">
            <header data-header><h2 style="margin:0">Products</h2></header>
            <pl-sidebar style="--sidebar-width:9rem;--sidebar-gap:1.25rem">
                <div data-items>
                    <pl-product-card>
                        <div data-media><img src="https://picsum.photos/seed/col1/400/400" alt=""></div>
                        <h3 data-title><a href="#">Field Jacket</a></h3><p data-price>$148</p>
                    </pl-product-card>
                    <pl-product-card>
                        <div data-media><img src="https://picsum.photos/seed/col2/400/400" alt=""></div>
                        <h3 data-title><a href="#">Merino Crew</a></h3><p data-price>$96</p>
                    </pl-product-card>
                    <pl-product-card>
                        <div data-media><img src="https://picsum.photos/seed/col3/400/400" alt=""></div>
                        <h3 data-title><a href="#">Leather Belt</a></h3><p data-price>$64</p>
                    </pl-product-card>
                </div>
                <div data-aside>
                    <p style="font-weight:600;margin:0 0 .5rem">Filters</p>
                    <pl-switch checked>In stock</pl-switch><br>
                    <pl-switch>On sale</pl-switch>
                </div>
            </pl-sidebar>
            <pl-pagination page="1" total="6" href="#p{page}"></pl-pagination>
        </pl-collection-page>
    `, { layout: 'stack' }),

    p(`The filters sit in a <a href="/documentation/pl-sidebar">pl-sidebar</a>, so they drop below
       the grid on their own once the main column would be squeezed. The grid keeps filling the
       space it is left with, because it counts columns rather than being told a number.`),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--page-measure</code> / <code>--page-padding</code>', 'The outer column.'] },
            { cells: ['<code>--collection-item</code>', 'Minimum width of one grid item. Defaults to <code>14rem</code>.'] },
            { cells: ['<code>--collection-gap</code>', 'Grid gap.'] },
        ],
    ),
);
