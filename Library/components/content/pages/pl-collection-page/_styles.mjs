// ------------------------------
// Collection Page Styles — LIGHT DOM
// ------------------------------
// A measured column with a grid of items in the middle. The grid is
// auto-filling rather than a fixed column count, so it answers to the space it
// is in — including the narrower space left when a filter aside is beside it.

export const STYLES = /*css*/`
:where(pl-collection-page) {
  display: block;
  inline-size: 100%;
  max-inline-size: var(--page-measure, 76rem);
  margin-inline: auto;
  padding: var(--page-padding, var(--pl-size-48, 3rem) var(--pl-size-24, 1.5rem));
}

pl-collection-page[hidden] { display: none; }

pl-collection-page > * + * { margin-block-start: var(--pl-size-32, 2rem); }

pl-collection-page [data-header] > :first-child { margin-block-start: 0; }

pl-collection-page [data-items] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--collection-item, 14rem), 1fr));
  gap: var(--collection-gap, var(--pl-size-24, 1.5rem));
}
`;
