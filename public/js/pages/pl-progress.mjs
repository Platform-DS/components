// ------------------------------
// Documentation: pl-progress
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-progress',
        title: 'Progress',
        lede: 'A task moving toward completion, or one whose end is not yet knowable.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>ProgressElement</code>',
        'Wraps': '<code>&lt;progress&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-progress</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-progress';`, 'js'),

    demo(`
        <div style="display:grid;gap:.75rem;inline-size:100%">
            <pl-progress value="15" max="100" label="Uploading, 15%"></pl-progress>
            <pl-progress value="60" max="100" label="Uploading, 60%"></pl-progress>
            <pl-progress value="100" max="100" label="Upload complete"></pl-progress>
        </div>
    `, { layout: 'stack' }),

    section('Indeterminate'),

    p(`Leave <code>value</code> off and the bar is indeterminate: native behaviour, and worth
       keeping rather than hiding behind a separate attribute. It means the completion is genuinely
       unknown, which is different from being at zero.`),

    demo(`
        <pl-progress label="Preparing your export"></pl-progress>
    `, { layout: 'stack' }),

    callout('note', 'Remove the attribute. Do not set it to 0',
        `<code>value="0"</code> is a determinate bar that happens to be empty; no <code>value</code>
         at all is a bar that does not know. Going back to indeterminate means
         <code>removeAttribute('value')</code>, and the <code>data-indeterminate</code> attribute the
         component reflects onto itself is a read-only mirror of that, there for CSS to target.`),

    code(`
        const bar = document.querySelector('pl-progress');

        bar.value = 42;                    // determinate
        bar.removeAttribute('value');      // indeterminate again

        bar.fraction;                      // 0.42, or null while indeterminate
    `, 'js'),

    section('Attributes and properties'),

    table(
        ['Member', 'Type', 'Description'],
        [
            { cells: ['<code>value</code>', '<code>Number</code>', 'Amount done. Absent means indeterminate.'] },
            { cells: ['<code>max</code>', '<code>Number</code>', 'The total. Defaults to <code>1</code>.'] },
            { cells: ['<code>label</code>', '<code>String</code>', 'Accessible name: the same reasoning as <a href="/documentation/pl-meter">pl-meter</a>.'] },
            { cells: ['<code>data-indeterminate</code>', '<em>reflected</em>', 'Set by the component when there is no value. A CSS hook, not an input.'] },
            { cells: ['<code>fraction</code>', '<code>Number|null</code>', 'Progress as 0 to 1, or <code>null</code> while indeterminate.'] },
            { cells: ['<code>position</code>', '<code>Number</code>', 'Native: the same figure, but <code>-1</code> when indeterminate.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--progress-height</code>', 'Bar thickness.'] },
            { cells: ['<code>--progress-track</code> / <code>--progress-fill</code>', 'Track and fill colors.'] },
        ],
    ),

    callout('note', 'The indeterminate animation is ours, deliberately',
        `Native indeterminate rendering differs so much between browsers that a bar in a designed
         interface would not match itself across two of them. This one is a band travelling along
         the track, which needs no value to be meaningful, and under
         <code>prefers-reduced-motion</code> it holds still in the middle rather than emptying the
         track, which would read as "nothing is happening".`),

    section('Accessibility'),

    ul([
        'A real <code>&lt;progress&gt;</code>: role, value, and indeterminate state all come from the platform.',
        'Always set <code>label</code>, and put the figure in it: "Uploading, 60%" rather than "Uploading".',
        'Update the label as the value changes, or a screen reader user hears the starting figure forever.',
        'For a wait with no measurable progress and no layout to fill, <a href="/documentation/pl-loading">pl-loading</a> is lighter than an indeterminate bar.',
    ]),
);
