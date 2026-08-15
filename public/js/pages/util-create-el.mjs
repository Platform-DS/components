// ------------------------------
// Documentation: createEl
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'createEl',
        lede: 'Build DOM in JavaScript without concatenating strings.',
    }),

    meta({
        'Import': '<code>utilities/factories/createEl.mjs</code>',
        'Exports': '<code>createEl</code>',
        'Depends on': '<em>nothing</em>',
    }),

    p(`<code>document.createElement</code> plus four lines of assignment, every time you need a
       node. This collapses that into one call and takes children, so a tree reads like a tree.`),

    section('Usage'),

    code(`
        import { createEl } from '@platformdesign/components/utilities/factories/createEl.mjs';

        const card = createEl('article', { class: ['card', 'card--wide'] }, [
            createEl('h3', { text: product.name }),
            createEl('p',  { text: product.blurb }),
            createEl('pl-button', {
                variant: 'primary',
                onClick: () => addToCart(product),
            }, ['Add to cart']),
        ]);
    `, 'js'),

    p(`Pass a falsy tag to get a <code>DocumentFragment</code> instead, for returning several
       siblings without a wrapper element.`),

    section('Props'),

    table(
        ['Key', 'Behaviour'],
        [
            { cells: ['<code>class</code>', 'A string or an array of them. Falsy entries are dropped, so <code>[base, isActive && \'is-active\']</code> works.'] },
            { cells: ['<code>style</code>', 'An object, assigned onto <code>el.style</code>.'] },
            { cells: ['<code>dataset</code>', 'An object, assigned onto <code>el.dataset</code>.'] },
            { cells: ['<code>text</code>', 'Sets <code>textContent</code>.'] },
            { cells: ['<code>on*</code>', 'A function becomes a listener: <code>onClick</code>, <code>onInput</code>, <code>onPointerDown</code>.'] },
            { cells: ['<code>ref</code>', 'A function called with the element, to keep a handle on it mid-tree.'] },
            { cells: ['<em>anything else</em>', 'Assigned as a DOM property when one exists, and as an attribute when it does not.'] },
            { cells: ['<code>null</code> / <code>undefined</code>', 'Skipped, so a conditional prop needs no surrounding <code>if</code>.'] },
        ],
    ),

    callout('note', 'Property first, attribute second, and why booleans are special',
        `<code>value</code>, <code>checked</code> and <code>textContent</code> are properties that
         no attribute reflects reliably, so a property assignment is right whenever one exists.
         Booleans then need their own branch: HTML boolean attributes like <code>disabled</code>
         treat absence as false, but enumerated ones like <code>spellcheck</code> default to
         <em>on</em> when the attribute is missing. Removing the attribute for
         <code>spellcheck: false</code> would leave spellcheck enabled; assigning the property sets
         <code>spellcheck="false"</code> and means it.`),

    section('Children'),

    p(`The third argument takes a node, a string, or an array, nested to any depth. Strings become
       text nodes and <code>null</code> is skipped, so a conditional child is an inline expression
       rather than a branch:`),

    code(`
        createEl('div', {}, [
            createEl('h2', { text: title }),
            subtitle && createEl('p', { text: subtitle }),
            items.map(item => createEl('li', { text: item })),
        ]);
    `, 'js'),

    section('Why not innerHTML'),

    p(`Because a value in a template string is markup until proven otherwise. <code>text</code> and
       text-node children set text, so a product name containing
       <code>&lt;script&gt;</code> stays a product name. Listeners attach to the node directly,
       with no re-query afterwards and nothing to re-bind when the markup is rebuilt.`),

    p(`Where you genuinely have markup and no elements to build, <a
       href="/documentation/utilities/escape-html">escapeHTML</a> is the smaller tool.`),

    section('Next'),

    ul([
        '<a href="/documentation/utilities/escape-html">escapeHTML</a>: for the string case.',
        '<a href="/documentation/utilities">Utilities</a>: the rest of them.',
    ]),
);
