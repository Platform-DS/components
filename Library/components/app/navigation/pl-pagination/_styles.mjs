// ------------------------------
// Pagination Styles — LIGHT DOM
// ------------------------------
// Every item is the same square, so the row does not reflow as the numbers
// change width between 9 and 10. The links and buttons are reset with
// `all: unset` first — they are navigation, not buttons in the visual sense.

export const STYLES = /*css*/`
pl-pagination { display: block; }
pl-pagination[hidden] { display: none; }

pl-pagination .pl-pagination__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--pagination-gap, 0.25rem);
  list-style: none;
  margin: 0;
  padding: 0;
}

pl-pagination :is(.pl-pagination__page, .pl-pagination__step, .pl-pagination__gap) {
  all: unset;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  min-inline-size: var(--pagination-size, 2rem);
  block-size: var(--pagination-size, 2rem);
  padding-inline: var(--pl-size-4, 0.25rem);
  border-radius: var(--pl-border-radius-medium, 8px);

  font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
  font-size: var(--pl-font-size-sm, 0.875rem);
  color: var(--pl-color-ink-secondary, #4B5563);
}

pl-pagination :is(a, button) { cursor: pointer; }

pl-pagination :is(a, button):hover {
  background: var(--pl-color-surface-sunken, #F3F4F6);
  color: var(--pl-color-ink, #111827);
}

pl-pagination :is(a, button):focus-visible {
  outline: 2px solid var(--pl-color-focus, #2563EB);
  outline-offset: 2px;
}

pl-pagination [aria-current="page"] {
  background: var(--pagination-current, var(--pl-color-primary, #2563EB));
  color: var(--pl-color-on-primary, #fff);
  font-weight: var(--pl-font-weight-medium, 500);
}

pl-pagination [aria-current="page"]:hover {
  background: var(--pagination-current, var(--pl-color-primary, #2563EB));
  color: var(--pl-color-on-primary, #fff);
}

pl-pagination .pl-pagination__gap { color: var(--pl-color-ink-secondary, #6B7280); }

pl-pagination .pl-pagination__step svg {
  inline-size: 1.05rem;
  block-size: 1.05rem;
}

/* The one glyph is drawn pointing to the inline start; the other is it
   turned round, which also makes it correct in a RTL document. */
pl-pagination .pl-pagination__step--next svg { rotate: 180deg; }

pl-pagination [aria-disabled="true"] {
  opacity: var(--pl-opacity-50, 0.5);
  cursor: default;
}
`;
