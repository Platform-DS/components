// ------------------------------
// Documentation: pl-radio-group
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-radio-group',
        title: 'Radio Group',
        lede: 'Labels a set of options and gives them the keyboard a native radio group has.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Contains': '<code>&lt;pl-radio&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-radio-group</code>',
    }),

    callout('note', 'Why this component has to exist',
        `A browser groups radios that share a <code>name</code> because they share a document. Each
         <a href="/documentation/pl-radio">pl-radio</a> keeps its <code>&lt;input&gt;</code> in its
         own shadow root, so the browser sees several unrelated radios: arrow keys do nothing, and
         every option becomes its own tab stop instead of the group being one. This component
         restores both halves of that native contract.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-radio-group';`, 'js'),

    p('Set <code>name</code> once on the group and it is applied to every option.'),

    demo(`
        <pl-radio-group label="Plan" name="plan" value="pro">
            <pl-radio value="free">Free</pl-radio>
            <pl-radio value="pro">Pro</pl-radio>
            <pl-radio value="team">Team</pl-radio>
        </pl-radio-group>
    `, { layout: 'stack' }),

    section('Keyboard'),

    p('Focus the group and try it: the behaviour matches a native radio group exactly:'),

    table(
        ['Key', 'Does'],
        [
            { cells: ['<kbd>Tab</kbd>', 'Enters the group at the selected option, and leaves it: the whole group is one tab stop.'] },
            { cells: ['<kbd>↓</kbd> / <kbd>→</kbd>', 'Select the next option, wrapping at the end.'] },
            { cells: ['<kbd>↑</kbd> / <kbd>←</kbd>', 'Select the previous option, wrapping at the start.'] },
            { cells: ['<kbd>Home</kbd> / <kbd>End</kbd>', 'Select the first / last option.'] },
        ],
    ),

    p(`Selection follows focus, as it does natively: moving to an option selects it, so a keyboard
       user never has to press a second key to commit.`),

    section('Cards'),

    p('A larger hit area, and a set that reads as choices rather than a list of dots.'),

    demo(`
        <pl-radio-group label="Shipping" hint="Estimated at checkout." name="ship" value="std" variant="card">
            <pl-radio value="std">Standard: 5 days</pl-radio>
            <pl-radio value="express">Express: 2 days</pl-radio>
            <pl-radio value="overnight">Overnight</pl-radio>
        </pl-radio-group>
    `, { layout: 'stack' }),

    section('Horizontal'),

    demo(`
        <pl-radio-group label="Size" name="size" value="m" orientation="horizontal">
            <pl-radio value="s">Small</pl-radio>
            <pl-radio value="m">Medium</pl-radio>
            <pl-radio value="l">Large</pl-radio>
        </pl-radio-group>
    `, { layout: 'stack' }),

    section('In a form'),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').textContent = 'plan = ' + new FormData(event.target).get('plan')">
            <pl-radio-group label="Plan" name="plan" value="free" variant="card" orientation="horizontal">
                <pl-radio value="free">Free</pl-radio>
                <pl-radio value="pro">Pro</pl-radio>
            </pl-radio-group>
            <div data-actions><pl-button type="submit" size="sm">Submit</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    callout('warn', 'Setting checked in JavaScript needs a nudge',
        `A programmatic <code>radio.checked = true</code> never fires the internal input's change
         event, which is what normally publishes the value to the form, so the option would look
         selected and submit nothing. The group calls <code>syncForm()</code> after every
         programmatic change; do the same if you set <code>checked</code> on a bare
         <code>&lt;pl-radio&gt;</code> yourself.`),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>label</code>', '<code>String</code>', 'Visible group label, wired as the group\'s accessible name.'] },
            { cells: ['<code>hint</code>', '<code>String</code>', 'Supporting text, linked via <code>aria-describedby</code>.'] },
            { cells: ['<code>name</code>', '<code>String</code>', 'Applied to every option, so it is written once.'] },
            { cells: ['<code>value</code>', '<code>String</code>', 'The selected option\'s value. Reflects as the user chooses.'] },
            { cells: ['<code>orientation</code>', '<code>horizontal</code>', 'Lay the options out in a row.'] },
            { cells: ['<code>variant</code>', '<code>card</code>', 'Give each option a bordered hit area.'] },
            { cells: ['<code>disabled</code>', '<code>Boolean</code>', 'Disables every option.'] },
        ],
    ),

    section('Events'),

    table(
        ['Event', 'Description'],
        [
            { cells: ['<code>change</code>', 'Bubbles from the selected option.'] },
            { cells: ['<code>pl-change</code>', 'Convenience event; <code>detail.value</code> is the new value.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [{ cells: ['<code>--radio-group-gap</code>', 'Space between options.'] }],
    ),

    section('Accessibility'),

    ul([
        'The wrapper carries <code>role="radiogroup"</code> and is named by its visible label through <code>aria-labelledby</code>, not a duplicated <code>aria-label</code>.',
        'Roving tabindex makes the group one tab stop, which is what a native radio group does and what keyboard users expect.',
        'Arrow keys wrap, and selection follows focus.',
        'The hint is linked with <code>aria-describedby</code>, so it is announced with the group rather than orphaned.',
        'An individually disabled option is skipped by the arrow keys.',
    ]),
);
