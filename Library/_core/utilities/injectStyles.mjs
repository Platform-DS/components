// ------------------------------
// injectStyles — document-level stylesheets for Light DOM components
// ------------------------------
// A Shadow DOM component adopts its stylesheet onto its own root. A Light DOM
// component has no root to adopt onto, so its CSS has to go into the DOCUMENT —
// once, no matter how many instances exist.
//
// Sheets are keyed and deduped, adopted (not <style> tags) so nothing is
// re-parsed per instance, and every caller is expected to wrap its rules in
// `@layer pl-components` so a consumer's own unlayered CSS always wins without
// a specificity fight.

const injected = new Map();

/**
 * Adopt a stylesheet into the document once.
 *
 * @param {string} key  dedupe key — the component's tag name, or a shared name
 *                      like "pl-section" for rules several components share
 * @param {string} css  the stylesheet text
 */
export function injectStyles(key, css) {
    if (injected.has(key)) return injected.get(key);

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    injected.set(key, sheet);

    return sheet;
}
