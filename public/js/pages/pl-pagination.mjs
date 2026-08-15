// ------------------------------
// Documentation: pl-pagination
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-pagination',
        title: 'Pagination',
        lede: 'Numbered navigation through a paged list: real links, in the page\'s own DOM.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': 'A <code>&lt;nav&gt;</code> of links or buttons',
        'Import': '<code>@platformdesign/components/pl-pagination</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-pagination';`, 'js'),

    demo(`
        <pl-pagination page="6" total="20" href="/products?page={page}"></pl-pagination>
    `, { layout: 'stack' }),

    p(`<code>href</code> is a template: <code>{page}</code> is replaced with each number. Every
       page in the set becomes a URL someone can open in a new tab, a crawler can follow, and the
       browser can prefetch.`),

    callout('note', 'Links when there is a URL, buttons when there is not',
        `Leave <code>href</code> off and the component emits <code>&lt;button&gt;</code>s and fires
         <code>pl-page</code> instead, for a list that pages in place without changing the URL.
         Prefer the link form whenever a URL exists: a paged list whose pages have no addresses
         cannot be shared, bookmarked, or indexed.`),

    demo(`
        <pl-pagination id="demo-pager" page="1" total="5"
            onpl-page="this.nextElementSibling.textContent = 'Page ' + event.detail.page"></pl-pagination>
        <output>Page 1</output>
    `, { layout: 'stack' }),

    section('The window of numbers'),

    p(`Long sets are truncated to first / … / a window around the current page / … / last. The
       window keeps a <strong>constant width</strong>: near the ends it slides rather than
       shrinking, so the control does not change size as you move through the set, which would
       make the numbers move under the pointer.`),

    demo(`
        <div style="display:grid;gap:.5rem">
            <pl-pagination page="1" total="20" href="#p{page}"></pl-pagination>
            <pl-pagination page="10" total="20" href="#p{page}"></pl-pagination>
            <pl-pagination page="20" total="20" href="#p{page}"></pl-pagination>
        </div>
    `, { layout: 'stack' }),

    p(`<code>data-siblings</code> controls how many numbers sit either side of the current one.`),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>page</code>', '<code>Number</code>', 'The current page. Reflected, so it can be read back and watched.'] },
            { cells: ['<code>total</code>', '<code>Number</code>', 'How many pages there are.'] },
            { cells: ['<code>href</code>', '<code>String</code>', 'URL template containing <code>{page}</code>. Omit for buttons.'] },
            { cells: ['<code>data-siblings</code>', '<code>Number</code>', 'Numbers either side of the current page. Defaults to <code>1</code>.'] },
            { cells: ['<code>label</code>', '<code>String</code>', 'Names the <code>&lt;nav&gt;</code> landmark. Defaults to "Pagination".'] },
        ],
    ),

    section('Events'),

    table(
        ['Event', 'Description'],
        [
            { cells: ['<code>pl-page</code>', 'Fired by the button form only; <code>detail.page</code> is the requested page. Links navigate instead.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--pagination-size</code>', 'The square each item occupies.'] },
            { cells: ['<code>--pagination-gap</code>', 'Space between items.'] },
            { cells: ['<code>--pagination-current</code>', 'Fill behind the current page.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'A named <code>&lt;nav&gt;</code> landmark: several unnamed ones on a page all announce as "navigation".',
        'The current page carries <code>aria-current="page"</code>, which is both the announcement and the CSS hook, so the two cannot disagree.',
        'Each number is labelled "Page 7", not a bare "7": a lone number says nothing about what it counts.',
        'At the ends, previous/next become <code>&lt;span aria-disabled&gt;</code> rather than dead links: a disabled link is not a real thing, and a link to nowhere is worse than none.',
        'The ellipsis is <code>aria-hidden</code>; the numbers on either side of it carry the sense.',
    ]),
);
