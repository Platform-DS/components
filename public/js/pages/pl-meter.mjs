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
       range is good, and the browser picks the colour from them. Nothing in JavaScript watches the
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

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>value</code>', '<code>Number</code>', 'The measurement. Native.'] },
            { cells: ['<code>min</code> / <code>max</code>', '<code>Number</code>', 'The range. Default <code>0</code> and <code>1</code>, which is why a bare <code>value="0.6"</code> works.'] },
            { cells: ['<code>low</code> / <code>high</code>', '<code>Number</code>', 'Boundaries of the middle zone.'] },
            { cells: ['<code>optimum</code>', '<code>Number</code>', 'Where "good" is. Decides which zone gets which colour.'] },
            { cells: ['<code>label</code>', '<code>String</code>', 'Accessible name. See below.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--meter-height</code>', 'Bar thickness.'] },
            { cells: ['<code>--meter-track</code>', 'The unfilled track.'] },
            { cells: ['<code>--meter-optimum</code> / <code>--meter-suboptimum</code> / <code>--meter-poor</code>', 'The three zone colours.'] },
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
        'Colour is never the only signal: the label should carry the reading, so a bar tinted red still says <em>92%</em> to someone who cannot see that it is red.',
        'Slotted text inside the element is the fallback shown by browsers without <code>&lt;meter&gt;</code> support.',
    ]),
);
