// ------------------------------
// Documentation: escapeHTML
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'escapeHTML',
        lede: 'Make a value safe to interpolate into markup.',
    }),

    meta({
        'Import': '<code>utilities/helpers/escapeHTML.mjs</code>',
        'Exports': '<code>escapeHTML</code>',
        'Depends on': '<em>nothing</em>',
    }),

    p(`Replaces the five characters that can end an attribute or open a tag, so a value stays a
       value instead of becoming markup.`),

    section('Usage'),

    code(`
        import { escapeHTML } from '@platformdesign/components/utilities/helpers/escapeHTML.mjs';

        list.innerHTML = products
            .map(product => \`<li title="\${escapeHTML(product.note)}">\${escapeHTML(product.name)}</li>\`)
            .join('');
    `, 'js'),

    table(
        ['Character', 'Becomes', 'Because'],
        [
            { cells: ['<code>&amp;</code>', '<code>&amp;amp;</code>', 'First, or it would double-escape the entities below.'] },
            { cells: ['<code>&lt;</code>', '<code>&amp;lt;</code>', 'Opens a tag.'] },
            { cells: ['<code>&gt;</code>', '<code>&amp;gt;</code>', 'Closes one.'] },
            { cells: ['<code>"</code>', '<code>&amp;quot;</code>', 'Ends a double-quoted attribute.'] },
            { cells: ['<code>\'</code>', '<code>&amp;#39;</code>', 'Ends a single-quoted one.'] },
        ],
    ),

    p(`Non-strings are coerced, so <code>null</code> and numbers are safe to pass without a guard.`),

    section('Quote your attributes'),

    p(`This escapes both quote characters, but it cannot save an <em>unquoted</em> attribute: there
       a space is enough to start a new one, and no amount of escaping the value helps.`),

    code(`
        …
        <div class=\${escapeHTML(cls)}>      … unsafe, whatever the value
        <div class="\${escapeHTML(cls)}">    … safe
    `, 'html'),

    callout('warn', 'It is for text, not for every position',
        `HTML has contexts where escaping these five characters is not sufficient: a value inside a
         <code>&lt;script&gt;</code> block, a <code>style</code> attribute, or an
         <code>href</code>, where <code>javascript:</code> is a working URL that contains none of
         them. Escaping is for text and quoted attribute values. For a URL, check the scheme;
         for anything else, build the node instead.`),

    section('Better still, do not interpolate'),

    p(`Escaping is the fallback for when you already have a markup string.
       <a href="/documentation/utilities/create-el">createEl</a> and <code>textContent</code> avoid
       the question: a text node cannot be markup, so there is nothing to escape and nothing to
       forget to escape.`),

    code(`
        // no escaping needed: this cannot be parsed as markup
        createEl('li', { text: product.name, title: product.note });
    `, 'js'),

    section('Next'),

    ul([
        '<a href="/documentation/utilities/create-el">createEl</a>: the version of this problem that does not have the problem.',
        '<a href="/documentation/utilities">Utilities</a>: the rest of them.',
    ]),
);
