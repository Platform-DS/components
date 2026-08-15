// ------------------------------
// Documentation: pl-skeleton
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-skeleton',
        title: 'Skeleton',
        lede: 'A grey placeholder in the shape of content that has not arrived.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>BaseElement</code>',
        'Import': '<code>@platformdesign/components/pl-skeleton</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-skeleton';`, 'js'),

    demo(`
        <div style="display:flex;gap:1rem;align-items:flex-start;inline-size:100%">
            <pl-skeleton variant="circle" size="3rem"></pl-skeleton>
            <div style="flex:1"><pl-skeleton lines="3"></pl-skeleton></div>
        </div>
    `, { layout: 'stack' }),

    section('Variants'),

    demo(`
        <div style="display:grid;gap:1rem;inline-size:100%">
            <pl-skeleton></pl-skeleton>
            <pl-skeleton lines="4"></pl-skeleton>
            <pl-skeleton variant="circle" size="2.5rem"></pl-skeleton>
            <pl-skeleton variant="rect" size="7rem"></pl-skeleton>
        </div>
    `, { layout: 'stack' }),

    p(`The last line of a multi-line skeleton is short. That small thing is what makes a stack of
       bars read as a paragraph rather than as a table.`),

    section('Announcing the wait'),

    p(`The skeleton itself is <code>aria-hidden</code>. It is a picture of absent content, and
       announcing it would announce shapes: "image, image, image", with no information in any of
       them. What should be announced is that the <em>region</em> is loading, and that belongs on
       the container being filled:`),

    code(`
        <div id="results" aria-busy="true">
            <pl-skeleton lines="3"></pl-skeleton>
        </div>

        <script>
            const region = document.getElementById('results');
            region.replaceChildren(...realResults);
            region.setAttribute('aria-busy', 'false');
        </script>
    `, 'html'),

    callout('note', 'Match the shape of what is coming',
        `A skeleton earns its place by reserving the same space the real content will take. That
         is what stops the page jumping when it arrives. If the placeholder is a different size,
         it is doing the harm a spinner would have avoided. Set <code>size</code> on a circle to
         the avatar's size, and give a rect the same CSS box as the image it stands in for.`),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>variant</code>', '<code>String</code>', '<code>text</code> (default), <code>circle</code>, <code>rect</code>.'] },
            { cells: ['<code>lines</code>', '<code>Number</code>', 'How many bars, for the text variant. Defaults to <code>1</code>.'] },
            { cells: ['<code>size</code>', '<code>String</code>', 'Diameter for a circle, height for a rect.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--skeleton-color</code> / <code>--skeleton-sheen</code>', 'Base and highlight.'] },
            { cells: ['<code>--skeleton-line</code>', 'Height of one text bar. Defaults to <code>0.8em</code>, so it tracks the font size around it.'] },
            { cells: ['<code>--skeleton-gap</code>', 'Space between bars.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        '<code>aria-hidden</code> on the host: the shapes carry no information worth announcing.',
        'Put <code>aria-busy="true"</code> on the region being filled, and clear it when the content lands.',
        'The sheen stops under <code>prefers-reduced-motion</code>. The bars stay, because a skeleton still does its job standing still, which is not true of a spinner.',
    ]),
);
