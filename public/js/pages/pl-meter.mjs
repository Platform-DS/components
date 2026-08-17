// ------------------------------
// Documentation: pl-meter
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-meter',
        title: 'Meter',
        lede: 'A gauge: a measurement inside a known range, tinted by the browser itself.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>MeterElement</code>',
        'Wraps': '<code>&lt;meter&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-meter</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-meter';`, 'js'),

    demo(`
        <div style="display:grid;gap:.75rem;inline-size:100%">
            <pl-meter value="0.25" label="Disk used, 25%"></pl-meter>
            <pl-meter value="0.6" label="Disk used, 60%"></pl-meter>
            <pl-meter value="0.92" label="Disk used, 92%"></pl-meter>
        </div>
    `, { layout: 'stack' }),

    callout('note', 'A meter is not a progress bar',
        `<code>&lt;meter&gt;</code> is a <strong>gauge</strong>: something already at its value:
         disk usage, a score, how full a tank is. <code>&lt;progress&gt;</code> is a
         <strong>task</strong> moving toward completion. The giveaway is whether the number can go
         <em>down</em>: disk usage can, a download's progress cannot. If yours can, this is the
         right element; if not, use <a href="/documentation/pl-progress">pl-progress</a>.`),

    section('The browser does the tinting'),

    p(`<code>low</code>, <code>high</code> and <code>optimum</code> describe which part of the
       range is good, and the browser picks the color from them. Nothing in JavaScript watches the
       value: cross into the bad zone and the bar changes on its own.`),

    p(`<code>optimum</code> is the interesting one: it says where "good" <em>is</em>. Put it below
       <code>low</code> and small numbers are healthy (disk usage); put it above <code>high</code>
       and large ones are (battery, score).`),

    demo(`
        <div style="display:grid;gap:.75rem;inline-size:100%">
            <pl-meter value="82" max="100" low="50" high="80" optimum="0" label="Disk used, 82%: low is good"></pl-meter>
            <pl-meter value="82" max="100" low="50" high="80" optimum="100" label="Battery, 82%: high is good"></pl-meter>
        </div>
    `, { layout: 'stack' }),

    p(`Same value, same thresholds, opposite meaning, and the only difference is where
       <code>optimum</code> sits.`),

    section('A gradient, for low to high'),

    p(`Zones answer "is this good or bad". Sometimes the reading is just a quantity, and what you
       want the bar to say is "how much" — light at the low end, dark at the high end. That is
       <code>data-fill="gradient"</code>:`),

    demo(`
        <div style="display:grid;gap:1rem;inline-size:100%;max-inline-size:28rem">
            <pl-meter value="7.2" max="10" label="Storage" data-fill="gradient">
                <span slot="value">7.2 / 10 GB</span>
            </pl-meter>

            <pl-meter value="128" max="512" label="Memory" data-fill="gradient"
                      style="--meter-color: var(--color-success)">
                <span slot="value">128 / 512 MB</span>
            </pl-meter>

            <pl-meter value="18" max="24" label="Hours logged" data-fill="gradient"
                      style="--meter-color: var(--color-warning); --meter-height: 0.75rem">
                <span slot="value">18 / 24 h</span>
            </pl-meter>
        </div>
    `, { layout: 'stack' }),

    p(`One color in, two out: the light end is mixed from
       <code>--meter-color</code>, so a themed meter needs a single value rather than two that
       have to be kept in a sensible relationship with each other. Replace the whole ramp with
       <code>--meter-gradient</code> when you want something else entirely.`),

    callout('note', 'The ramp is positional, and that is the point of doing it this way',
        `Two thirds along the track is the same shade whether the meter reads 70% or 95%. A
         gradient painted on the fill alone does the opposite — it stretches, so the far end is the
         dark end at every value and the color carries no information at all. Getting the other
         behavior means the ramp has to span the whole TRACK while only the filled part shows it,
         which is one line of CSS (<code>background-size: calc(100% / fraction)</code>) and one
         number from JavaScript.`),

    callout('warn', 'Do not combine a ramp with low/high/optimum',
        `They answer different questions and the answers contradict. Zones say good or bad; a ramp
         says low or high. A meter doing both is claiming that more is worse and darker at the same
         time, and the reader has no way to know which meaning the color carries. Pick one.`),

    section('The readout'),

    p(`The <code>value</code> slot is a formatted string you supply, shown at the end of the header
       row opposite the label:`),

    code(`
        <pl-meter value="7.2" max="10" label="Storage" data-fill="gradient">
            <span slot="value">7.2 / 10 GB</span>
        </pl-meter>
    `, 'html'),

    p(`It is a slot rather than something the component assembles because "7.2 / 10 GB" is a unit,
       a separator, a precision and a locale, and all four belong to the page. What the component
       does take responsibility for is keeping the two in step: whatever you put in the slot is
       mirrored to <code>aria-valuetext</code>, so a screen reader hears "7.2 / 10 GB" rather than
       the bare number. The header hides itself when there is neither a label nor a readout.`),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>data-fill</code>', '<code>gradient</code>', 'Paint a light-to-dark ramp instead of the zone colors.'] },
            { cells: ['<code>value</code>', '<code>Number</code>', 'The measurement. Native.'] },
            { cells: ['<code>min</code> / <code>max</code>', '<code>Number</code>', 'The range. Default <code>0</code> and <code>1</code>, which is why a bare <code>value="0.6"</code> works.'] },
            { cells: ['<code>low</code> / <code>high</code>', '<code>Number</code>', 'Boundaries of the middle zone.'] },
            { cells: ['<code>optimum</code>', '<code>Number</code>', 'Where "good" is. Decides which zone gets which color.'] },
            { cells: ['<code>label</code>', '<code>String</code>', 'The accessible name, and the visible label in the header row.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--meter-height</code>', 'Bar thickness.'] },
            { cells: ['<code>--meter-track</code>', 'The unfilled track.'] },
            { cells: ['<code>--meter-optimum</code> / <code>--meter-suboptimum</code> / <code>--meter-poor</code>', 'The three zone colors.'] },
            { cells: ['<code>--meter-color</code>', 'Base of the gradient ramp. The light end is mixed from it. Defaults to <code>--pl-color-primary</code>.'] },
            { cells: ['<code>--meter-gradient</code>', 'Replace the derived ramp with any gradient of your own.'] },
            { cells: ['<code>--meter-radius</code>', 'Corner rounding on the bar.'] },
            { cells: ['<code>--meter-gap</code>', 'Space between the header row and the bar.'] },
            { cells: ['<code>--meter-label-size</code>', 'Type size of the header row.'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [
            { cells: ['<code>header</code>', 'The label and readout row. Hidden when both are absent.'] },
            { cells: ['<code>label</code>', 'The label text.'] },
            { cells: ['<code>value</code>', 'The readout.'] },
            { cells: ['<code>meter</code>', 'The bar itself.'] },
        ],
    ),

    callout('note', 'Why the label is an attribute and not a pl-label',
        `The real <code>&lt;meter&gt;</code> lives in this component's shadow root, and a
         <code>&lt;label for&gt;</code> cannot reach across that boundary:
         <a href="/documentation/pl-label">pl-label</a> works for controls that are
         form-associated, and a meter is not one. So <code>label</code> sets
         <code>aria-label</code> directly on the element that carries the role. Give it the
         reading, not just the noun: "Disk used, 82%" rather than "Disk".`),

    section('Accessibility'),

    ul([
        'A real <code>&lt;meter&gt;</code>, so the role and the value are the platform\'s.',
        'Always set <code>label</code>: an unnamed gauge announces a number with nothing to attach it to.',
        'color is never the only signal: the label should carry the reading, so a bar tinted red still says <em>92%</em> to someone who cannot see that it is red.',
        'Slotted text inside the element is the fallback shown by browsers without <code>&lt;meter&gt;</code> support.',
    ]),
);
