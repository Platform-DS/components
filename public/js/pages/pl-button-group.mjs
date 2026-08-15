// ------------------------------
// Documentation: pl-button-group
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-button-group',
        title: 'Button Group',
        lede: 'Buttons joined into one segmented control, separated by a hairline.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Contains': '<code>&lt;pl-button&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-button-group</code>',
    }),

    p(`A wrapper, so it stays in the page's own DOM: the buttons inside are your real elements.
       Nothing has to cross a shadow boundary for the group to lay them out, and a surrounding
       <code>&lt;form&gt;</code> still sees every one of them.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-button-group';`, 'js'),

    demo(`
        <pl-button-group>
            <pl-button variant="secondary">Day</pl-button>
            <pl-button variant="secondary">Week</pl-button>
            <pl-button variant="secondary">Month</pl-button>
        </pl-button-group>
    `),

    section('Filled segments'),

    p('Any variant works, and the divider reads correctly on all of them.'),

    demo(`
        <pl-button-group>
            <pl-button>Save</pl-button>
            <pl-button>Publish</pl-button>
        </pl-button-group>
    `),

    callout('note', 'Why the divider is translucent ink',
        `A fixed grey hairline disappears against a saturated fill and looks heavy against white.
         The divider is instead <code>--pl-color-ink</code> at 18%. One value that darkens
         whatever is beneath it, so an outline row and a filled row need no separate treatment.`),

    section('Pressed state'),

    p(`The group is presentation only. It does not track which segment is active. For a toolbar of
       toggles, set <code>aria-pressed</code> yourself and the styling follows:`),

    demo(`
        <pl-button-group>
            <pl-button variant="secondary" aria-pressed="true">Bold</pl-button>
            <pl-button variant="secondary" aria-pressed="false">Italic</pl-button>
            <pl-button variant="secondary" aria-pressed="false">Underline</pl-button>
        </pl-button-group>
    `),

    callout('warn', 'If the choice is data, this is the wrong component',
        `A button group submits nothing. When the selection <em>is</em> a value: a plan, a
         shipping speed, a theme. Use <a href="/documentation/pl-radio-group">pl-radio-group</a>:
         it carries a name, submits with the form, and announces itself as a set of options rather
         than a row of unrelated buttons.`),

    section('Vertical'),

    demo(`
        <pl-button-group data-orientation="vertical">
            <pl-button variant="secondary">Profile</pl-button>
            <pl-button variant="secondary">Billing</pl-button>
            <pl-button variant="secondary">Team</pl-button>
        </pl-button-group>
    `),

    section('Full width'),

    demo(`
        <pl-button-group data-full>
            <pl-button variant="secondary">Cancel</pl-button>
            <pl-button>Continue</pl-button>
        </pl-button-group>
    `, { layout: 'stack' }),

    section('Attributes'),

    table(
        ['Attribute', 'Values', 'Description'],
        [
            { cells: ['<code>data-orientation</code>', '<code>vertical</code>', 'Stack the segments instead of placing them in a row.'] },
            { cells: ['<code>data-full</code>', '<code>Boolean</code>', 'Fill the container, splitting the width evenly between segments.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--button-group-divider</code>', 'The hairline between segments, and the outer border.'] },
            { cells: ['<code>--button-group-radius</code>', 'Corner radius of the group.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'The wrapper carries <code>role="group"</code>, so assistive tech announces the buttons as one set. Add <code>aria-label</code> to name it.',
        'For toggles, <code>aria-pressed</code> on each button is what conveys the state: the styling only reflects it.',
        'Segments keep their own focus rings; the group has no <code>overflow: hidden</code> that would clip them.',
        'The buttons are real <code>&lt;pl-button&gt;</code> elements, so keyboard behaviour is unchanged by grouping.',
    ]),
);
