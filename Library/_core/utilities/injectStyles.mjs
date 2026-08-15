// ------------------------------
// injectStyles — document-level stylesheets for Light DOM components
// ------------------------------
// A Shadow DOM component adopts its stylesheet onto its own root. A Light DOM
// component has no root to adopt onto, so its CSS has to go into the DOCUMENT —
// once, no matter how many instances exist.
//
// Sheets are keyed and deduped, and adopted (not <style> tags) so nothing is
// re-parsed per instance.
//
// ------------------------------
// Rules here are UNLAYERED, and that is load-bearing
// ------------------------------
// These sheets used to wrap everything in `@layer pl-components`, on the theory
// that a consumer's own CSS should win without a specificity fight. It won too
// much: an unlayered rule beats a layered one at ANY specificity, so a page with
// nothing more exotic than
//
//     p { margin: 3rem 0; }
//
// beat `pl-hero > p` and took the section's vertical rhythm with it. Measured on
// a page with five such rules, every one of them won: the hero lede came out at
// 48px instead of 16, a figure at 80px instead of 0, a section title at 64px
// instead of 40. A component that loses to a bare element selector has no layout
// of its own — it has a suggestion.
//
// Unlayered restores ordinary specificity, which is the behaviour that actually
// matches the intent: `pl-hero > p` (0,0,2) beats `p` (0,0,1), and a consumer
// who MEANS to override still does it the normal way, with a class or an id.
// Measured against the same page: bleed-in loses, `#main p` wins, `.tight p`
// wins, and `p { … !important }` wins.
//
// The tempting fix was `!important` on everything instead. It is the wrong tool
// twice over. It would also beat a consumer's own `!important` — inside a layer,
// important declarations REVERSE the layer order — so nothing in a page could
// reach these rules at all. And it would undo the reason content components are
// Light DOM in the first place: the page's cascade is supposed to reach them.
// Custom properties are the theming path, but they are not the only one that
// should exist.
//
// One consequence worth knowing: adopted sheets sort after the document's own,
// so an override written at EXACTLY the component's specificity loses the tie.
// Add a class, or an id, or `:where()` around the component's part of the
// selector — any of the three is one character of intent more than a tie.

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
