// ------------------------------
// Documentation: pl-search
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-search',
        title: 'Search',
        lede: 'A search field with the magnifier built in: a real input underneath.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>InputElement</code> (type search)',
        'Form-associated': 'Yes',
        'Import': '<code>@platformdesign/components/pl-search</code>',
    }),

    p(`<code>&lt;pl-search&gt;</code> is <a href="/documentation/pl-input">pl-input</a> with its type
       fixed to <code>search</code> and a leading magnifier. It inherits the native search field:
       the clear button, the history dropdown, the <code>input</code>/<code>change</code> events,
       and submits with the surrounding <code>&lt;form&gt;</code>.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-search';`, 'js'),

    demo(`<pl-search placeholder="Search components…"></pl-search>`, { layout: 'stack' }),

    section('Live filtering'),

    p(`It fires <code>input</code> on every keystroke, like any input. Wire your filter to that,
       and debounce it yourself if the work is expensive.`),

    code(`
        const search = document.querySelector('pl-search');
        search.addEventListener('input', () => {
            filter(search.value);
        });
    `, 'js'),

    callout('note', 'This is the pattern the docs sidebar uses',
        `The component filter in the sidebar of these docs is exactly this: a search field whose
         <code>input</code> hides the non-matching rows. No library, no virtual list.`),

    section('States'),

    demo(`
        <pl-search value="query text"></pl-search>
        <pl-search placeholder="Disabled" disabled></pl-search>
    `, { layout: 'stack' }),

    section('In a form'),

    demo(`
        <pl-form onsubmit="event.preventDefault();
            this.querySelector('output').value = 'q = ' + (new FormData(event.target).get('q') || '(empty)')">
            <pl-search name="q" placeholder="Search…"></pl-search>
            <div data-actions><pl-button type="submit" size="sm">Search</pl-button></div>
            <output></output>
        </pl-form>
    `, { layout: 'stack' }),

    section('Props'),

    table(
        ['Prop', 'Type', 'Description'],
        [
            { native: true, cells: ['<code>value</code>', '<code>String</code>', 'Current query.'] },
            { native: true, cells: ['<code>placeholder</code>', '<code>String</code>', 'Placeholder text.'] },
            { native: true, cells: ['<code>name</code>', '<code>String</code>', 'Field name for form submission.'] },
            { native: true, cells: ['<code>disabled</code>, <code>readonly</code>', '<code>Boolean</code>', 'Native disabled / read-only.'] },
            { native: true, cells: ['<code>autocomplete</code>', '<code>String</code>', 'Autofill hint (<code>off</code> to suppress history).'] },
            { native: true, cells: ['<code>maxlength</code>', '<code>Number</code>', 'Maximum length.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--field-border</code>, <code>--field-accent</code>, <code>--field-ring</code>', 'Shared field chrome (see pl-input).'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [
            { cells: ['<code>wrapper</code>', 'The positioning wrapper (icon + input).'] },
            { cells: ['<code>input</code>', 'The internal <code>&lt;input type="search"&gt;</code>.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'A real search input, so the clear button, Escape-to-clear, and history dropdown are native.',
        'The magnifier is <code>aria-hidden</code> decoration. Give the field a name with <a href="/documentation/pl-label">pl-label</a> or <code>aria-label</code>.',
        'Reach for it over <a href="/documentation/pl-input">pl-input</a> whenever the field is a search, so the platform treats it as one.',
    ]),
);
