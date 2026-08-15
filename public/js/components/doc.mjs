// ------------------------------
// doc: the page-authoring vocabulary
// ------------------------------
// Every documentation page is a plain function returning a DOM node, built
// from these helpers. They exist so a component page reads as a description of
// the component rather than as a pile of innerHTML.
//
// The important one is demo(): it takes ONE markup string, renders it live AND
// prints it as the code sample. A page physically cannot show an example that
// differs from what it runs.
//
// Code samples render through <pl-code-block> (the library's own component):
// it owns the head, copy button, and syntax highlighting, so the docs don't
// re-implement any of it.

/** Build an element from a tag, optional attributes, and children. */
export function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);

    for (const [key, value] of Object.entries(attrs)) {
        if (value == null || value === false) continue;
        if (key === 'class') node.className = value;
        else if (key === 'html') node.innerHTML = value;
        else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
        else node.setAttribute(key, value === true ? '' : value);
    }

    // flat(Infinity): helpers nest maps inside maps (surfaces -> groups ->
    // links), and a single level of flattening would stringify the leftovers
    // into "[object HTMLDetailsElement]".
    for (const child of children.flat(Infinity)) {
        if (child == null || child === false) continue;
        node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }

    return node;
}

/** Escape text for safe interpolation into markup. */
export const escapeHTML = text => String(text).replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
));

/** Strip the shared leading indentation from a template literal block. */
export function dedent(text) {
    const lines = text.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
    const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
    return lines.map(l => l.slice(indent)).join('\n');
}

/** The page header: tag chip, title, one-line description. */
export function header({ tag, title, lede }) {
    return el('header', { class: 'docs-header' },
        tag && el('p', {}, el('code', { class: 'docs-header__tag' }, `<${tag}>`)),
        el('h1', {}, title ?? tag),
        lede && el('p', { class: 'docs-header__lede' }, lede),
    );
}

/**
 * The anatomy strip. Stating DOM mode and base class on every page keeps the
 * Shadow/Light decision visible, since it's the thing that most changes how a
 * component behaves.
 */
export function meta(items) {
    return el('div', { class: 'docs-meta' },
        Object.entries(items).map(([label, value]) =>
            el('div', { class: 'docs-meta__item' },
                el('span', { class: 'docs-meta__label' }, label),
                el('span', { class: 'docs-meta__value', html: value }),
            )
        )
    );
}

/** A syntax-highlighted code block with a copy button. */
export function code(source, lang = 'html') {
    // The source is slotted as plain TEXT: <pl-code-block> reads it, tokenises
    // it, and renders a highlighted copy in its shadow root. Passing text (not
    // markup) is what keeps a sample like `<pl-button>` from being parsed as a
    // real element on the page.
    return el('pl-code-block', { language: lang }, dedent(source));
}

/**
 * A live example and its source, from one string.
 *
 * @param {string} markup   the example, rendered AND displayed
 * @param {object} options  layout: 'row' | 'stack' | 'center'
 */
export function demo(markup, { layout = 'row' } = {}) {
    const source = dedent(markup);

    const stage = el('div', { class: 'demo__stage', 'data-layout': layout });
    stage.innerHTML = source;

    return el('div', { class: 'demo' }, stage, code(source, 'html'));
}

/** A table of props, events, slots, or parts. */
export function table(columns, rows) {
    return el('div', { class: 'api-table-wrap' },
        el('table', { class: 'api-table' },
            el('thead', {}, el('tr', {}, columns.map(c => el('th', {}, c)))),
            el('tbody', {},
                rows.map(row => el('tr', { 'data-native': row.native || null },
                    row.cells.map((cell, index) => el('td', {
                        class: index === 0 ? 'api-table__name' : 'api-table__desc',
                        html: cell,
                    }))
                ))
            ),
        )
    );
}

/** A callout: 'note' | 'warn' | 'a11y'. */
export function callout(kind, title, ...body) {
    return el('aside', { class: `callout callout--${kind}` },
        el('div', {},
            title && el('p', { class: 'callout__title' }, title),
            ...body.map(text => (text instanceof Node ? text : el('p', { html: text }))),
        )
    );
}

/** A section heading that can be linked to. */
export function section(title) {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return el('h2', { id }, title);
}

/** Assemble a page. */
export function page(...children) {
    return el('article', { class: 'docs-article' }, ...children);
}

/** A paragraph accepting inline HTML. */
export const p = html => el('p', { html });

/** An unordered list accepting inline HTML per item. */
export const ul = items => el('ul', {}, items.map(item => el('li', { html: item })));
