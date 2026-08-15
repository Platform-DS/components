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

/*------------------------------------------------
  Page-template preview

  A page template is the one thing a normal demo panel cannot show honestly.
  Its layout is driven by MEDIA queries, and a media query asks the viewport,
  not the box the example happens to sit in — so a template rendered inline
  answers to the width of the browser rather than the width of the panel, and
  a "phone" preview would quietly show the desktop layout.

  So the preview is an iframe, which has a viewport of its own. Widths past the
  panel are scaled down rather than clipped, and Expand hands the preview the
  whole content area, leaving the header and rail where they are.
-------------------------------------------------*/

/** Live previews on the page, so one observer can keep them all in theme. */
const previews = new Set();

if (typeof MutationObserver === 'function') {
    // One observer for every preview, rather than one each: a MutationObserver
    // on <html> is reachable from <html>, so a per-preview observer would
    // outlive the page it belongs to. Frames are pruned as they go.
    new MutationObserver(() => {
        for (const frame of previews) {
            if (!frame.isConnected) { previews.delete(frame); continue; }
            applyTheme(frame);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

/** Push the site's theme into a preview, without reloading it. */
function applyTheme(frame) {
    const root = frame.contentDocument?.documentElement;
    if (!root) return;

    const theme = document.documentElement.dataset.theme;
    if (theme) root.dataset.theme = theme;
    else delete root.dataset.theme;
}

/**
 * The document a preview renders.
 *
 * It loads what a CONSUMER loads — the library's starter stylesheet and the
 * components — plus the site's token file, purely because that is where this
 * site keeps its dark palette. A theme is a separate export in this system, so
 * there is nowhere else for the preview to get one.
 */
function previewDocument(markup) {
    const theme = document.documentElement.dataset.theme;

    return `<!doctype html>
<html lang="en"${theme ? ` data-theme="${theme}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/styles/base/_fonts.css">
<link rel="stylesheet" href="/Library/_core/styles/global.css">
<link rel="stylesheet" href="/styles/tokens/index.css">
<style>body { margin: 0; background: var(--color-surface); }</style>
<script type="module" src="/Library/index.mjs"></script>
</head>
<body>${markup}</body>
</html>`;
}

const WIDTHS = [
    { label: 'Phone', width: 390 },
    { label: 'Tablet', width: 834 },
    { label: 'Laptop', width: 1280 },
    { label: 'Fit', width: 'fit' },
];

/**
 * A page template, rendered in a viewport you can resize.
 *
 * @param {string} source  the template markup, shown and rendered
 * @param {object} [options]
 * @param {string} [options.title]   accessible name for the preview frame
 * @param {number|'fit'} [options.initial]  width selected on load
 */
export function pageDemo(source, { title = 'Template preview', initial = 'fit' } = {}) {
    const markup = dedent(source);

    const frame = el('iframe', {
        class: 'page-demo__frame',
        title,
        // Same-origin: the preview is our own document, and applyTheme reaches
        // into it. No allow-same-origin means no reaching in.
        sandbox: 'allow-scripts allow-same-origin',
    });

    const viewport = el('div', { class: 'page-demo__viewport' }, frame);
    const stage = el('div', { class: 'page-demo__stage' }, viewport);
    const readout = el('span', { class: 'page-demo__size' });

    let current = initial;

    const buttons = WIDTHS.map(({ label, width }) =>
        el('button', {
            type: 'button',
            class: 'page-demo__width',
            'aria-pressed': String(width === current),
            onClick: () => select(width),
        }, label)
    );

    const expand = el('button', {
        type: 'button',
        class: 'page-demo__expand',
        'aria-pressed': 'false',
        onClick: () => setExpanded(!root.classList.contains('is-expanded')),
    }, 'Expand');

    const root = el('div', { class: 'page-demo' },
        el('div', { class: 'page-demo__bar' },
            el('div', { class: 'page-demo__widths', role: 'group', 'aria-label': 'Preview width' }, buttons),
            readout,
            expand,
        ),
        stage,
    );

    function select(width) {
        current = width;
        buttons.forEach((button, index) =>
            button.setAttribute('aria-pressed', String(WIDTHS[index].width === width)));
        layout();
    }

    function setExpanded(on) {
        root.classList.toggle('is-expanded', on);
        expand.setAttribute('aria-pressed', String(on));
        expand.textContent = on ? 'Close' : 'Expand';
        // The page behind must not scroll while the preview is over it.
        document.body.classList.toggle('has-expanded-preview', on);
        layout();
    }

    /**
     * Size the frame to the chosen viewport, then scale it to fit.
     *
     * The frame is given the FULL logical size and shrunk with a transform, so
     * the template lays itself out at the width it was asked for and the panel
     * only changes how large that looks. Sizing the frame to the panel instead
     * would move the media queries, which is the one thing this must not do.
     */
    function layout() {
        const available = stage.clientWidth;
        const tall = stage.clientHeight;
        if (!available || !tall) return;

        const width = current === 'fit' ? Math.round(available) : current;
        const scale = Math.min(1, available / width);

        frame.style.inlineSize = `${width}px`;
        frame.style.blockSize = `${Math.round(tall / scale)}px`;
        frame.style.transform = `scale(${scale})`;

        viewport.style.inlineSize = `${Math.round(width * scale)}px`;
        viewport.style.blockSize = `${tall}px`;

        readout.textContent = scale < 1
            ? `${width}px at ${Math.round(scale * 100)}%`
            : `${width}px`;
    }

    frame.addEventListener('load', () => { applyTheme(frame); previews.add(frame); });
    frame.srcdoc = previewDocument(markup);

    if (typeof ResizeObserver === 'function') new ResizeObserver(layout).observe(stage);
    // Escape closes an expanded preview, the same as any other overlay.
    root.addEventListener('keydown', event => {
        if (event.key === 'Escape' && root.classList.contains('is-expanded')) {
            setExpanded(false);
            expand.focus();
        }
    });

    queueMicrotask(layout);

    return el('div', { class: 'page-demo-wrap' }, root, code(markup, 'html'));
}
