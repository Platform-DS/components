// ------------------------------
// Documentation: pl-pie-chart
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-pie-chart',
        title: 'Pie Chart',
        lede: 'A conic gradient over a list you already wrote.',
    }),

    meta({
        'DOM mode': '<strong>Shadow</strong>',
        'Extends': '<code>ChartElement</code>',
        'Import': '<code>@platformdesign/components/pl-pie-chart</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-pie-chart';`, 'js'),

    demo(`
        <pl-pie-chart>
            <ul>
                <li data-value="42">Search</li>
                <li data-value="31">Direct</li>
                <li data-value="27">Referral</li>
            </ul>
        </pl-pie-chart>
    `, { layout: 'stack' }),

    p(`The values are <code>data-value</code> on your own list items. Nothing else is required: the
       slices, their order, the legend and its swatch colors all come from that list.`),

    section('The list is the chart'),

    callout('note', 'The gradient is aria-hidden, and that is the point',
        `A pie chart is a colored circle, and announcing a colored circle tells a screen-reader
         user nothing that a pie chart is <em>for</em>. What they should get is the numbers, and the
         numbers are already on the page as a real list in your own words. So the drawing is marked
         decorative and the list is left exactly where it is.`),

    p(`This is also why the data is markup rather than a <code>values="42,31,27"</code> attribute or
       a JavaScript property. A list survives styles being off, a script failing to load, a
       translation pass, and a search crawler. A string of numbers survives none of those, and would
       still leave you writing the legend by hand.`),

    p(`Anything carrying <code>data-value</code> counts, so the wrapper is yours: a
       <code>&lt;ul&gt;</code>, an <code>&lt;ol&gt;</code> when the order is a ranking, or a
       <code>&lt;table&gt;</code> when you want the figures visible as text.`),

    section('Color'),

    p(`Slices take the intent tokens in order, so a chart matches the buttons and badges beside it
       and re-themes when they do. Override any one of them by index:`),

    demo(`
        <pl-pie-chart style="--chart-color-1:#7C3AED;--chart-color-2:#DB2777;--chart-color-3:#0891B2">
            <ul>
                <li data-value="62">Done</li>
                <li data-value="24">Open</li>
                <li data-value="14">Blocked</li>
            </ul>
        </pl-pie-chart>
    `, { layout: 'stack' }),

    p(`Past the four intents the ramp reuses their tinted border steps rather than inventing new
       hues, so an eight-slice chart still reads as one palette instead of a rainbow. Beyond eight
       slices a pie has stopped being readable anyway; that is a signal to group the tail into an
       "Other" slice, not to add more colors.`),

    section('Partial charts'),

    p(`Set <code>total</code> to make the denominator something other than the sum, and the
       remainder is left as bare track. This is the "3 of 10" shape:`),

    demo(`
        <pl-pie-chart total="10">
            <ul><li data-value="3">Seats used</li></ul>
        </pl-pie-chart>
    `, { layout: 'stack' }),

    callout('note', 'One value is a gauge, not a chart',
        `A single-slice pie is a circle, and a circle is not a comparison. When you are showing one
         measurement against a range, <a href="/documentation/pl-meter">pl-meter</a> is the right
         component: it carries the semantics, the low/high/optimum zones, and an accessible value
         that this does not.`),

    section('Props'),

    table(
        ['Prop', 'Type', 'Default', 'Description'],
        [
            { cells: ['<code>total</code>', '<code>Number</code>', '<em>sum of slices</em>', 'The denominator. Larger than the sum draws a partial chart.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Default', 'Description'],
        [
            { cells: ['<code>--chart-size</code>', '<code>12rem</code>', 'Diameter of the circle.'] },
            { cells: ['<code>--chart-color-1…8</code>', 'the intent ramp', 'Slice colors, by position.'] },
            { cells: ['<code>--chart-hole</code>', '<code>0%</code>', 'Radius of the middle. Above zero makes this a <a href="/documentation/pl-doughnut-chart">doughnut</a>.'] },
            { cells: ['<code>--chart-track</code>', '<code>--pl-color-surface-sunken</code>', 'The unfilled remainder, and the empty state.'] },
            { cells: ['<code>--chart-start</code>', '<code>0deg</code>', 'Where the first slice begins. Rotates the whole chart.'] },
            { cells: ['<code>--chart-gap</code>', '<code>--pl-size-24</code>', 'Space between the circle and the legend.'] },
            { cells: ['<code>--chart-swatch</code>', '<code>0.75em</code>', 'Size of the legend swatches.'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [
            { cells: ['<code>chart</code>', 'The gradient circle.'] },
            { cells: ['<code>legend</code>', 'The slot your list lands in.'] },
        ],
    ),

    section('Live data'),

    p(`The component watches its own markup, so appending list items after a fetch, or rewriting a
       <code>data-value</code> in place, redraws the chart. There is nothing to call:`),

    code(`
        const chart = document.querySelector('pl-pie-chart');
        chart.querySelector('li').dataset.value = 90;   // redraws
    `, 'js'),

    section('Next'),

    ul([
        '<a href="/documentation/pl-doughnut-chart">pl-doughnut-chart</a>: the same drawing with a hole, and a figure in it.',
        '<a href="/documentation/pl-meter">pl-meter</a>: one measurement in a range, with real semantics.',
        '<a href="/documentation/pl-progress">pl-progress</a>: a task moving toward completion.',
    ]),
);
