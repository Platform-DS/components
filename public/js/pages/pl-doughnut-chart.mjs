// ------------------------------
// Documentation: pl-doughnut-chart
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-doughnut-chart',
        title: 'Doughnut Chart',
        lede: 'A pie with a hole, and a figure in the hole.',
    }),

    meta({
        'DOM mode': '<strong>Shadow</strong>',
        'Extends': '<code>ChartElement</code>',
        'Import': '<code>@platformdesign/components/pl-doughnut-chart</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-doughnut-chart';`, 'js'),

    demo(`
        <pl-doughnut-chart>
            <span slot="center">1,284</span>
            <span slot="center-label">visits</span>
            <ul>
                <li data-value="42">Search</li>
                <li data-value="31">Direct</li>
                <li data-value="27">Referral</li>
            </ul>
        </pl-doughnut-chart>
    `, { layout: 'stack' }),

    p(`Everything about the data works exactly as it does for
       <a href="/documentation/pl-pie-chart">pl-pie-chart</a>: values are <code>data-value</code> on
       your own list, the list is the accessible representation, and slices take the intent tokens
       in order. This page covers only what is different.`),

    section('It is the same component'),

    callout('note', 'One custom property, not a second implementation',
        `<code>--chart-hole</code> is the entire difference. The two tags share a stylesheet and a
         base class, and the doughnut sets the hole to 62%. That is deliberate: it means you can
         make a doughnut thinner, or give a pie a small hole, without either component needing to
         know about the other, and it means a fix to the geometry lands in both at once.`),

    demo(`
        <pl-doughnut-chart style="--chart-hole:35%">
            <ul><li data-value="5">A</li><li data-value="3">B</li><li data-value="2">C</li></ul>
        </pl-doughnut-chart>
    `, { layout: 'stack' }),

    p(`The hole is a <code>mask</code> rather than a circle painted on top, so whatever is behind
       the chart shows through it. Put one on a colored card or a photograph and the middle is that
       card or that photograph, not a guess at what color the page is.`),

    section('The middle'),

    p(`Two slots, both optional. <code>center</code> is the figure and <code>center-label</code> is
       the word under it:`),

    demo(`
        <pl-doughnut-chart total="10" style="--chart-size:9rem">
            <span slot="center">3</span>
            <span slot="center-label">of 10 seats</span>
            <ul><li data-value="3">Used</li></ul>
        </pl-doughnut-chart>
    `, { layout: 'stack' }),

    p(`They are slots rather than attributes because the middle is almost always a
       <em>formatted</em> number: thousands separators, a currency, a unit, a percent sign. That
       formatting depends on a locale, and the locale belongs to the page rather than to a chart.`),

    callout('note', 'The middle is not a substitute for the label',
        `The figure in the hole is inside the decorative half of the component, so it is not
         announced. Anything it says should also be in the list, or in a heading next to the chart.
         In the example above "3 of 10 seats" is carried by the <code>total</code> and the list item
         together, so nothing is only visible.`),

    p(`The centre scales with <code>--chart-size</code> rather than the page, so it stays in
       proportion when the chart is resized.`),

    section('Props'),

    table(
        ['Prop', 'Type', 'Default', 'Description'],
        [
            { cells: ['<code>total</code>', '<code>Number</code>', '<em>sum of slices</em>', 'The denominator. Larger than the sum draws a partial chart.'] },
        ],
    ),

    section('Slots'),

    table(
        ['Slot', 'Description'],
        [
            { cells: ['<em>(default)</em>', 'Your list. Anything with <code>data-value</code> becomes a slice.'] },
            { cells: ['<code>center</code>', 'The figure in the middle.'] },
            { cells: ['<code>center-label</code>', 'The smaller line beneath it.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Default', 'Description'],
        [
            { cells: ['<code>--chart-hole</code>', '<code>62%</code>', 'Radius of the middle. <code>0%</code> makes this a pie.'] },
            { cells: ['<code>--chart-size</code>', '<code>12rem</code>', 'Outer diameter.'] },
            { cells: ['<code>--chart-color-1…8</code>', 'the intent ramp', 'Slice colors, by position.'] },
            { cells: ['<code>--chart-track</code>', '<code>--pl-color-surface-sunken</code>', 'The unfilled remainder, and the empty state.'] },
            { cells: ['<code>--chart-start</code>', '<code>0deg</code>', 'Where the first slice begins.'] },
            { cells: ['<code>--chart-gap</code>', '<code>--pl-size-24</code>', 'Space between the circle and the legend.'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [
            { cells: ['<code>figure</code>', 'The circle and its middle together.'] },
            { cells: ['<code>chart</code>', 'The gradient ring.'] },
            { cells: ['<code>center</code>', 'The middle.'] },
            { cells: ['<code>legend</code>', 'The slot your list lands in.'] },
        ],
    ),

    section('Next'),

    ul([
        '<a href="/documentation/pl-pie-chart">pl-pie-chart</a>: the same drawing, no hole, and the fuller explanation.',
        '<a href="/documentation/pl-meter">pl-meter</a>: one measurement in a range, with real semantics.',
    ]),
);
