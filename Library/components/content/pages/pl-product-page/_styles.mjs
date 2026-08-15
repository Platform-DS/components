// ------------------------------
// Product Page Styles — LIGHT DOM
// ------------------------------
// Media and detail side by side, wrapping to one column when the detail column
// would be squeezed — the same intrinsic wrap pl-sidebar uses, and for the same
// reason: it answers to the actual space rather than to the viewport.

export const STYLES = /*css*/`
@layer pl-components {
  pl-product-page {
    display: block;
    inline-size: 100%;
    max-inline-size: var(--page-measure, 72rem);
    margin-inline: auto;
    padding: var(--page-padding, var(--pl-size-48, 3rem) var(--pl-size-24, 1.5rem));
  }

  pl-product-page[hidden] { display: none; }

  /* The two top columns. Anything else that follows is a full-width section. */
  pl-product-page [data-media],
  pl-product-page [data-detail] {
    flex: 1 1 var(--product-column, 22rem);
    min-inline-size: 0;
  }

  pl-product-page:has([data-media]) {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--product-gap, var(--pl-size-48, 3rem));
  }

  /* Sections after the detail run the full width of the shell. */
  pl-product-page > :not([data-media], [data-detail]) {
    flex: 1 1 100%;
    margin-block-start: var(--pl-size-48, 3rem);
  }

  pl-product-page [data-detail] > * + * { margin-block-start: var(--pl-size-16, 1rem); }
  pl-product-page [data-detail] > :first-child { margin-block-start: 0; }
}
`;
