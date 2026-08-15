// ------------------------------
// Documentation: Loading states
// ------------------------------

import { page, header, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'Loading states',
        lede: 'Holding a page still while custom elements upgrade.',
    }),

    p(`A custom element is <code>display: inline</code> with unstyled children until its module
       has been fetched and <code>customElements.define()</code> has run. Its real box does not
       exist yet, so the page paints at one size and then jumps to another. On a page served as
       HTML that window is short, but it lands exactly when someone starts reading.`),

    callout('note', 'This pattern is for STATIC pages',
        `It works by reserving the space a component is about to take. That is only possible when
         the markup is already in the HTML the server sent. On a page whose content is
         <em>generated</em> by JavaScript there is nothing to reserve: the elements do not exist
         until the script runs, so there is no box to hold. This documentation site is the second
         kind, and measurably so, which is why the pattern is applied to the marketing page and
         not here. For JS-rendered regions, render a <code>.pl-skeleton</code> placeholder into the
         container instead, and swap it for the real content when it arrives.`),

    section('The mechanism'),

    p(`<code>:defined</code> matches an element that has been upgraded, so
       <code>:not(:defined)</code> matches one that has not. That is the whole window, and the page
       is the only place it can be styled: a component cannot style its own host beforehand,
       because the stylesheet lives in a shadow root that has not been attached yet.`),

    code(`
        /* the pre-upgrade box */
        my-widget:not(:defined) {
            display: block;
            block-size: 4rem;
        }
    `, 'css'),

    p(`The <a href="/documentation">starter stylesheet</a> already carries these rules for the
       library's own components, so linking <code>global.css</code> is the whole of the setup. What
       follows is the reasoning, for extending it to your own elements.`),

    section('Three treatments'),

    p('Which one a component wants comes down to a single question: is the markup you wrote the thing the component ends up showing?'),

    table(
        ['Treatment', 'For', 'Why'],
        [
            { cells: ['<strong>Match the box</strong>', '<code>pl-button</code>, <code>pl-code-block</code>, <code>pl-chip</code>', 'The text is already there and survives the upgrade. Give the host the padding, type and colours the component will use, and the content is in its final position from the first paint. It then simply gains a shadow root.'] },
            { cells: ['<strong>Reserve a skeleton</strong>', '<code>pl-avatar</code>, <code>pl-progress</code>, <code>pl-meter</code>', 'These render from attributes rather than children, so there is nothing to show yet. A shimmer at the right size reads as loading instead of as broken.'] },
            { cells: ['<strong>Reserve silently</strong>', '<code>pl-icon</code>', 'Small and usually inline in a sentence. A grey box flashing mid-line is more distracting than the gap it fills.'] },
        ],
    ),

    section('Matching the box'),

    p(`The important detail is reading the component's OWN theming hook first, before the token it
       falls back to. A page that themes its buttons keeps that theme during the pre-upgrade window
       instead of painting the default and flipping colour the instant the module lands:`),

    code(`
        pl-button:not(:defined) {
            /* --button-background first, so a themed button stays themed */
            background: var(--button-background, var(--pl-color-primary, #2563EB));
            color: var(--button-color, var(--pl-color-on-primary, #fff));

            padding-block: var(--pl-size-8);
            padding-inline: var(--pl-size-16);
            border-radius: var(--pl-border-radius-small);
        }
    `, 'css'),

    p(`For a component whose content sets its own height, replicate the type metrics rather than
       hard-coding a height. <code>pl-code-block</code> reserves its box by giving the host the
       same monospace size, line height and padding the component will use, so the reservation is
       correct for any number of lines with no count to maintain.`),

    section('Reserving a skeleton'),

    p(`For components that build themselves from attributes, use the CSS-only
       <code>.pl-skeleton</code> visuals at the size the real element will occupy.`),

    demo(`
        <div style="display:grid;gap:.75rem;inline-size:100%">
            <div class="pl-skeleton" data-lines="3"></div>
            <div style="display:flex;gap:1rem;align-items:center">
                <div class="pl-skeleton" data-variant="circle"></div>
                <div class="pl-skeleton" style="flex:1"></div>
            </div>
        </div>
    `, { layout: 'stack' }),

    callout('note', 'Nothing is hidden to achieve any of this',
        `No rule here sets <code>visibility: hidden</code> or <code>display: none</code> on your
         content. With JavaScript switched off entirely the page still reads, links still work, and
         a button with an <code>onclick</code> still fires. The rules only add the space the
         generated parts are about to occupy. A pattern that hid content until upgrade would trade
         a layout shift for a blank page whenever a script fails to load.`),

    section('Attributes CSS can read'),

    p(`<code>content: attr()</code> is the one place CSS can reach into an attribute, which makes
       it useful when a component generates visible text from one. <code>pl-label</code> takes its
       text from a <code>text</code> attribute, so pre-upgrade the field starts a line too high.
       This does not merely reserve the line, it shows the real label immediately:`),

    code(`
        pl-label[text]:not(:defined)::before {
            content: attr(text);
            display: block;
            margin-block-end: var(--pl-size-4);
        }
    `, 'css'),

    section('What it is worth'),

    p(`Measured on this project's own marketing page by sampling element boxes during parse and
       again after load:`),

    table(
        ['Region', 'Before', 'After'],
        [
            { cells: ['Hero (above the fold)', '84px', '<strong>0.1px</strong>'] },
            { cells: ['Rest of the page', '145px', '22px'] },
        ],
    ),

    p(`The remaining 22px is Light DOM components whose final height depends on content that does
       not exist yet, such as whether an accordion panel is open. That is the honest ceiling of the
       technique: it reserves space for things whose size can be known in advance, and an
       accordion's cannot.`),

    section('Next'),

    ul([
        '<a href="/documentation">Overview</a>: the starter stylesheet that ships these rules.',
        '<a href="/documentation/pl-skeleton">pl-skeleton</a>: the component, and the class that mirrors it.',
        '<a href="/documentation/theming">Theming</a>: the hooks the pre-upgrade styles read.',
    ]),
);
