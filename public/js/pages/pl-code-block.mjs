// ------------------------------
// Documentation: pl-code-block
// ------------------------------
// Live examples are built with el('pl-code-block', …): passing the source as a
// text node keeps angle brackets literal, so an HTML sample isn't parsed into
// real elements the way demo()'s innerHTML would.

import { page, header, meta, section, p, ul, code, callout, table, el } from '../components/doc.mjs';

/** A live, rendered code block for the given language. */
const sample = (language, source) => el('pl-code-block', { language }, source);

export default () => page(
    header({
        tag: 'pl-code-block',
        title: 'Code Block',
        lede: 'A self-highlighting code surface with a copy button, and no dependency to do it.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>HTMLElement</code>',
        'Import': '<code>@platformdesign/components/pl-code-block</code>',
    }),

    p(`<code>&lt;pl-code-block&gt;</code> takes source as slotted text, tokenises it, and renders a
       highlighted copy in its shadow root with a head bar carrying the language label and a copy
       button. The highlighter is a small, dependency-free tokeniser: a handful of grammars, not a
       parser, in keeping with the library's no-build, no-dependency stance.`),

    callout('note', 'These docs run on it',
        `Every code sample on this site, including the ones on this page: is a
         <code>&lt;pl-code-block&gt;</code>. The documentation renders through the same component
         it documents.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-code-block';`, 'js'),

    p(`Write the code as the element's text content and name its language. The slotted text is the
       source of truth: it's read, highlighted, and never shown directly, so the block always
       matches what you wrote.`),

    code(`
        <pl-code-block language="js">
          const sum = (a, b) => a + b;
        </pl-code-block>
    `, 'html'),

    p('Which renders:'),

    sample('js', `const sum = (a, b) => a + b;`),

    section('Languages'),

    p(`Highlighting covers the languages a component library's docs actually need. An unknown or
       omitted <code>language</code> renders the source verbatim, so a block is never worse off
       than the plain <code>&lt;pre&gt;</code> it replaces.`),

    sample('html', `
        <pl-button data-variant="primary" data-size="lg">
          Save changes
        </pl-button>
    `),

    sample('css', `
        :root {
          --color-primary: #2563EB;
          --size-16: 1rem;
        }
    `),

    sample('json', `
        {
          "name": "@platformdesign/components",
          "type": "module",
          "dependencies": {}
        }
    `),

    sample('bash', `
        npm install @platformdesign/components
        npm run dev
    `),

    p('Supported grammars, with their aliases:'),

    table(
        ['Language', 'Values'],
        [
            { cells: ['JavaScript', '<code>js</code>, <code>javascript</code>, <code>mjs</code>'] },
            { cells: ['HTML', '<code>html</code>, <code>xml</code>'] },
            { cells: ['CSS', '<code>css</code>'] },
            { cells: ['JSON', '<code>json</code>'] },
            { cells: ['Shell', '<code>bash</code>, <code>sh</code>, <code>shell</code>'] },
            { cells: ['Markdown', '<code>markdown</code>, <code>md</code>'] },
        ],
    ),

    section('Copy'),

    p(`The copy button writes the <strong>raw</strong> source to the clipboard, never the
       highlighted markup, and confirms with a brief "Copied". Try it on any block on this page.`),

    section('Overflow'),

    p(`A block only scrolls sideways when its content is too wide, and only then does it become a
       keyboard-focusable, labelled scroll region (per WCAG 2.1.1), so a long line is reachable
       without a mouse, and a short one adds no stray tab stop.`),

    sample('js', `const message = "a deliberately long line that will not wrap, so the block has to scroll sideways to reveal the rest of it";`),

    section('Props'),

    table(
        ['Prop', 'Type', 'Default', 'Description'],
        [
            { cells: ['<code>language</code>', '<code>String</code>', '<code>""</code>', 'Grammar to highlight with. Unknown or omitted renders plain text.'] },
        ],
    ),

    section('Slots'),

    table(
        ['Slot', 'Description'],
        [{ cells: ['<em>(default)</em>', 'The source code, as text. Read for its content; never displayed directly.'] }],
    ),

    section('Custom properties'),

    p('The block ships dark defaults and re-themes entirely through these hooks:'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--code-block-background</code>', 'Surface color.'] },
            { cells: ['<code>--code-block-color</code>', 'Default text color.'] },
            { cells: ['<code>--code-block-border</code>', 'Border and head divider.'] },
            { cells: ['<code>--code-block-head</code>', 'Head label and copy-button color.'] },
            { cells: ['<code>--code-block-accent</code>', 'Copy-button hover / copied color.'] },
            { cells: ['<code>--code-block-syntax-*</code>', 'Per-token colors: <code>comment</code>, <code>string</code>, <code>number</code>, <code>keyword</code>, <code>property</code>, <code>tag</code>, <code>attr</code>, <code>punctuation</code>.'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [
            { cells: ['<code>head</code>', 'The bar holding the language label and copy button.'] },
            { cells: ['<code>language</code>', 'The language label.'] },
            { cells: ['<code>copy</code>', 'The copy button.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'Source is rendered from <code>textContent</code>, never <code>innerHTML</code>: author code is never parsed as markup.',
        'A block that overflows becomes a focusable, labelled scroll region; one that fits adds no tab stop.',
        'The copy button is a real <code>&lt;button&gt;</code> with a visible label and copied-state feedback.',
        'Highlighting is presentational: a screen reader hears the code, not the colors.',
    ]),
);
