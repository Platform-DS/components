// ------------------------------
// Documentation: pl-range
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-range',
        title: 'Range',
        lede: 'A styled slider over a real range input, with a filled track on every engine.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>InputElement</code> (type range)',
        'Form-associated': 'Yes',
        'Import': '<code>@platformdesign/components/pl-range</code>',
    }),

    p(`<code>&lt;pl-range&gt;</code> wraps a real <code>&lt;input type="range"&gt;</code> and styles
       its track and thumb. The only thing it adds over the native element is a filled track on
       WebKit, which has none: the component publishes the value as a percentage the track gradient
       reads, so the fill matches Gecko's native progress.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-range';`, 'js'),

    demo(`<pl-range min="0" max="100" value="40"></pl-range>`, { layout: 'stack' }),

    section('Steps and range'),

    demo(`
        <pl-range min="0" max="10" step="1" value="7"></pl-range>
        <pl-range min="0" max="100" step="25" value="50"></pl-range>
        <pl-range min="0" max="100" value="30" disabled></pl-range>
    `, { layout: 'stack' }),

    section('In a form'),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').value = 'volume = ' + new FormData(event.target).get('volume')">
            <pl-range name="volume" min="0" max="100" value="60"></pl-range>
            <div data-actions><pl-button type="submit" size="sm">Submit</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Props'),

    table(
        ['Prop', 'Type', 'Description'],
        [
            { native: true, cells: ['<code>value</code>', '<code>String</code>', 'Current value.'] },
            { native: true, cells: ['<code>min</code>, <code>max</code>', '<code>String</code>', 'Bounds (default 0 and 100).'] },
            { native: true, cells: ['<code>step</code>', '<code>String</code>', 'Increment; <code>any</code> for continuous.'] },
            { native: true, cells: ['<code>name</code>', '<code>String</code>', 'Field name for form submission.'] },
            { native: true, cells: ['<code>disabled</code>', '<code>Boolean</code>', 'Native disabled.'] },
            { native: true, cells: ['<code>list</code>', '<code>String</code>', 'Id of a <code>&lt;datalist&gt;</code> of tick marks.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--range-fill</code>', 'Filled (left) portion of the track.'] },
            { cells: ['<code>--range-track</code>', 'Unfilled (right) portion of the track.'] },
            { cells: ['<code>--range-thumb</code>', 'Thumb colour.'] },
            { cells: ['<code>--range-track-size</code>', 'Track thickness.'] },
            { cells: ['<code>--range-thumb-size</code>', 'Thumb diameter.'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [{ cells: ['<code>input</code>', 'The internal <code>&lt;input type="range"&gt;</code>.'] }],
    ),

    section('Accessibility'),

    ul([
        'A real range input, so arrow-key stepping, Home/End, and the value announcement are native.',
        'Give it a name with <a href="/documentation/pl-label">pl-label</a> or <code>aria-label</code>.',
        'The thumb shows a focus ring on keyboard focus.',
    ]),
);
