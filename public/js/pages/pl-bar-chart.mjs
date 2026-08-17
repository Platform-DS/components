// ------------------------------
// Documentation: pl-bar-chart
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-bar-chart',
        title: 'Bar Chart',
        lede: 'Columns against a baseline. The same trick as the pie, on one axis.',
    }),

    meta({
        'DOM mode': '<strong>Shadow</strong>',
        'Extends': '<code>ChartElement</code>',
        'Import': '<code>@platformdesign/components/pl-bar-chart</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-bar-chart';`, 'js'),

    demo(`
        <pl-bar-chart>
            <ul>
                <li data-value="42">Search</li>
                <li data-value="31">Direct</li>
                <li data-value="27">Referral</li>
                <li data-value="8">Social</li>
            </ul>
        </pl-bar-chart>
    `, { layout: 'stack' }),

    p(`Values are <code>data-value</code> on your own list items, exactly as they are for
       <a href="/documentation/pl-pie-chart">pl-pie-chart</a>. Where a pie cuts a conic gradient by
       angle, a bar cuts a linear one along its length; the arithmetic and the accessibility story
       are the same, and so is the palette.`),

    section('Bars are compared, slices are shared'),

    callout('note', 'The denominator is the difference',
        `A slice is part of a whole, so its denominator is the <strong>sum</strong>. A bar is a
         magnitude standing next to other bars, so its denominator is the <strong>largest
         value</strong> — which is what makes the longest bar reach the end of its track and every
         other bar read as a proportion of it. That is the only thing separating this component
         from the round ones.`),

    p(`Which is why a bar chart can show things a pie cannot. Response times, prices, votes across
       options that are not alternatives to each other: none of those sum to a meaningful whole, so
       they are nonsense as slices and perfectly clear as bars.`),

    section('A fixed axis'),

    p(`Set <code>total</code> when the maximum is known in advance — a score out of ten, a quota, a
       target — and the bars measure against that instead of against each other:`),

    demo(`
        <pl-bar-chart total="10">
            <ul>
                <li data-value="9">Speed</li>
                <li data-value="7">Support</li>
                <li data-value="5">Price</li>
            </ul>
        </pl-bar-chart>
    `, { layout: 'stack' }),

    p(`Without it, the longest bar always fills its track, which is right for a comparison and wrong
       for a rating: three scores of 9, 7 and 5 out of ten should not look like one perfect score
       and two shortfalls.`),

    section('Orientation'),

    p(`Vertical is the default, because a column read against a baseline is what most people
       picture when they say bar chart. Set <code>data-orientation="horizontal"</code> to turn the
       rows:`),

    demo(`
        <pl-bar-chart data-orientation="horizontal">
            <ul>
                <li data-value="42">Search</li>
                <li data-value="31">Direct</li>
                <li data-value="27">Referral</li>
                <li data-value="8">Social</li>
            </ul>
        </pl-bar-chart>
    `, { layout: 'stack' }),

    callout('note', 'Horizontal is the right answer more often than it looks',
        `A column has only its own width to put a label in, so anything longer than a word wraps,
         truncates, or ends up tilted, and all three are harder to read than a label sitting beside
         its bar. Turn the chart when the categories have names rather than dates, and when there
         are more of them than fit across the page.`),

    p(`It is an attribute rather than a prop because nothing in JavaScript reads it: the whole
       difference is which way the grid flows and which way the gradient runs. Same markup, same
       numbers, same component.`),

    section('The value needs no markup'),

    p(`The number above each bar is <code>content: attr(data-value)</code>, CSS reading the same
       attribute that drew the bar. So the figure shown and the figure measured cannot drift apart,
       and your markup stays a list of labels. Drop the numbers with
       <code>data-values="hidden"</code> when the bar is the whole point:`),

    demo(`
        <pl-bar-chart data-values="hidden" style="--bar-height:5rem">
            <ul>
                <li data-value="72">Passed</li>
                <li data-value="19">Skipped</li>
                <li data-value="4">Failed</li>
            </ul>
        </pl-bar-chart>
    `, { layout: 'stack' }),

    section('Color'),

    p(`Bars take the intent ramp in order, the same eight colors the round charts use, so a bar
       chart and a pie chart on one page color the same categories alike. Past the eighth bar the
       ramp returns to the first color rather than painting nothing: a bar chart legitimately has
       more bars than a pie has readable slices, and at that length they are being compared by
       length anyway.`),

    demo(`
        <pl-bar-chart style="--chart-color-1:#7C3AED">
            <ul>
                <li data-value="98">Mon</li>
                <li data-value="74">Tue</li>
                <li data-value="55">Wed</li>
            </ul>
        </pl-bar-chart>
    `, { layout: 'stack' }),

    section('Props'),

    table(
        ['Prop', 'Type', 'Default', 'Description'],
        [
            { cells: ['<code>total</code>', '<code>Number</code>', '<em>largest value</em>', 'The axis maximum. Set it for a fixed scale.'] },
        ],
    ),

    section('Attributes'),

    table(
        ['Attribute', 'Description'],
        [
            { cells: ['<code>data-orientation="horizontal"</code>', 'Turn the columns into rows. Vertical is the default.'] },
            { cells: ['<code>data-values="hidden"</code>', 'Drop the numbers.'] },
        ],
    ),

    p(`Both are <code>data-</code> attributes because CSS is the only thing that reads them, and
       neither needs a type, reflection, or a repaint. See
       <a href="/documentation/authoring">Authoring components</a> for the rule.`),

    section('Custom properties'),

    table(
        ['Property', 'Default', 'Description'],
        [
            { cells: ['<code>--bar-height</code>', '<code>8rem</code>', 'Height of the plot. Vertical only.'] },
            { cells: ['<code>--bar-thickness</code>', '<code>min(68%, 3rem)</code>', 'The bar across its short axis: width when vertical, height when horizontal. Capped so a four-column chart in a wide container does not draw four squares.'] },
            { cells: ['<code>--bar-radius</code>', '<code>--pl-border-radius-medium</code>', 'Corner rounding on the track.'] },
            { cells: ['<code>--bar-gap</code>', '<code>--pl-size-12</code>', 'Space between bars.'] },
            { cells: ['<code>--bar-label</code>', '<code>minmax(4rem, max-content)</code>', 'The label column. Horizontal only; a fixed width aligns bars across separate charts.'] },
            { cells: ['<code>--bar-value</code>', '<code>max-content</code>', 'The number column. Horizontal only.'] },
            { cells: ['<code>--chart-color-1…8</code>', 'the intent ramp', 'Bar colors, by position.'] },
            { cells: ['<code>--chart-track</code>', '<code>--pl-color-surface-sunken</code>', 'The unfilled remainder.'] },
        ],
    ),

    section('Live data'),

    p(`The component watches its own markup, so a value rewritten in place redraws — and because
       the scale comes from the largest value, changing one row rescales the rest:`),

    code(`
        const chart = document.querySelector('pl-bar-chart');
        chart.querySelectorAll('li')[3].dataset.value = 84;   // every bar rescales
    `, 'js'),

    section('Next'),

    ul([
        '<a href="/documentation/pl-pie-chart">pl-pie-chart</a>: shares of a whole, and the fuller explanation of how the data works.',
        '<a href="/documentation/pl-doughnut-chart">pl-doughnut-chart</a>: the same, with a figure in the middle.',
        '<a href="/documentation/pl-meter">pl-meter</a>: a single measurement in a range, with real semantics.',
    ]),
);
