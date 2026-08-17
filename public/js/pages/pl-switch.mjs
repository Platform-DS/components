// ------------------------------
// Documentation: pl-switch
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-switch',
        title: 'Switch',
        lede: 'A sliding on/off toggle, built on a real checkbox.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': '<code>&lt;input type="checkbox" role="switch"&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-switch</code>',
    }),

    p(`The track and knob are drawn over a genuine checkbox that stays in the page's DOM. Being
       Light DOM, it submits with the surrounding <code>&lt;form&gt;</code>, a <code>&lt;label&gt;</code>
       can reach it, and Space toggles it because that is what the platform already does.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-switch';`, 'js'),

    demo(`
        <pl-switch name="notifications" checked>Email notifications</pl-switch>
    `, { layout: 'stack' }),

    section('States'),

    demo(`
        <pl-switch>Off</pl-switch>
        <pl-switch checked>On</pl-switch>
        <pl-switch disabled>Disabled</pl-switch>
        <pl-switch checked disabled>Disabled, on</pl-switch>
    `, { layout: 'stack' }),

    section('Label position'),

    demo(`
        <pl-switch checked>Label after</pl-switch>
        <pl-switch checked data-label-position="start">Label before</pl-switch>
    `, { layout: 'stack' }),

    section('In a form'),

    p(`A switch submits its value only when on, and nothing when off: the native "flag" shape a
       boolean setting wants.`),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').textContent = JSON.stringify(Object.fromEntries(new FormData(event.target)))">
            <pl-switch name="marketing" checked>Marketing email</pl-switch>
            <pl-switch name="digest">Weekly digest</pl-switch>
            <div data-actions><pl-button type="submit" data-size="sm">Submit</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Why a checkbox and not two radios'),

    p(`<code>role="switch"</code> is defined in ARIA as a checkbox that is on or off, reporting
       itself through <code>aria-checked</code>. Building the control from two radios instead would
       change two things, both for the worse:`),

    ul([
        '<strong>What it announces.</strong> A radio pair is read as "group of two options, one selected": a screen reader user would hear a radio group where a sighted user sees a single toggle.',
        '<strong>What it submits.</strong> A checkbox submits its value when on and nothing when off. A radio pair always submits one of two values, so "off" becomes a value your server has to interpret rather than an absent key.',
    ]),

    callout('note', 'When you do want two options',
        `If the choice is between two <em>labelled states</em>: "Light / Dark" rather than an
         on-off flag. That is a different control. Use
         <a href="/documentation/pl-radio-group">pl-radio-group</a>, or
         <a href="/documentation/pl-button-group">pl-button-group</a> for a segmented look.`),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>checked</code>', '<code>Boolean</code>', 'On state. Reflected as the user toggles, so CSS can target it.'] },
            { cells: ['<code>name</code>', '<code>String</code>', 'Field name for form submission.'] },
            { cells: ['<code>value</code>', '<code>String</code>', 'Submitted when on. Defaults to <code>"on"</code>.'] },
            { cells: ['<code>disabled</code>', '<code>Boolean</code>', 'Native disabled.'] },
            { cells: ['<code>required</code>', '<code>Boolean</code>', 'Must be on to pass validation.'] },
            { cells: ['<code>data-label-position</code>', '<code>start</code>', 'Put the label before the track.'] },
        ],
    ),

    section('Events'),

    table(
        ['Event', 'Description'],
        [
            { cells: ['<code>change</code>', 'Native, from the internal checkbox.'] },
            { cells: ['<code>pl-change</code>', 'Convenience event; <code>detail.checked</code> is a boolean.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--switch-on</code>', 'Track color when on.'] },
            { cells: ['<code>--switch-off</code>', 'Track color when off.'] },
            { cells: ['<code>--switch-knob</code>', 'The sliding knob.'] },
            { cells: ['<code>--switch-width</code> / <code>--switch-height</code>', 'Track dimensions; the knob sizes itself from the height.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'A real checkbox with <code>role="switch"</code>, so it announces as a switch and toggles with Space.',
        '<code>aria-checked</code> is maintained by the browser for a native checkbox. There is no state to keep in sync by hand.',
        'The label text sits inside the internal <code>&lt;label&gt;</code>, so clicking it toggles the switch. No ids are involved.',
        'The track is <code>aria-hidden</code>; assistive tech reads the real control.',
        'The knob transition is dropped under <code>prefers-reduced-motion</code>.',
    ]),
);
