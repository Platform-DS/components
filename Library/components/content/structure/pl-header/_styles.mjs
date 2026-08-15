// ------------------------------
// Header Styles — LIGHT DOM
// ------------------------------
// Sticky, one row: brand, optional nav, one call to action.
//
// The collapse behaviour is gated on [data-collapsible], which the component
// only sets once it has actually built the toggle button. With JavaScript off
// that attribute never appears, so the nav simply stays visible instead of
// being hidden behind a control that can't work.

export const STYLES = /*css*/`
:where(pl-header) {
  --header-bg: var(--pl-color-surface, #fff);
  --header-ink: var(--pl-color-ink, #111);
  --header-line: var(--pl-color-border, #cfcfcf);
  --header-gutter: var(--pl-size-24, 1.5rem);
}

pl-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  gap: var(--pl-size-24, 1.5rem);
  flex-wrap: wrap;

  padding-inline: var(--header-gutter);
  padding-block: var(--pl-size-12, 0.75rem);

  background: var(--header-bg);
  color: var(--header-ink);
  border-block-end: 1px solid var(--header-line);
  font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
}

pl-header[data-surface="ink"] {
  --header-bg: var(--pl-color-ink, #111);
  --header-ink: var(--pl-color-surface, #fff);
  --header-line: var(--pl-color-gray-700, #374151);
}

/* Brand — first link or the [data-brand] element. */
pl-header > :is(a, [data-brand]):first-child {
  display: flex;
  align-items: center;
  gap: var(--pl-size-8, 0.5rem);
  font-family: var(--pl-font-family-display, inherit);
  font-size: var(--pl-font-size-lg, 1.125rem);
  font-weight: var(--pl-font-weight-bold, 700);
  letter-spacing: -0.02em;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
}

pl-header :is(img, svg) { display: block; }

/* Nav pushes the actions to the far edge. */
pl-header > nav {
  display: flex;
  align-items: center;
  gap: var(--pl-size-24, 1.5rem);
  margin-inline-start: auto;
  font-size: var(--pl-font-size-sm, 0.875rem);
}

pl-header > nav ul {
  display: flex;
  align-items: center;
  gap: var(--pl-size-24, 1.5rem);
  list-style: none;
  margin: 0;
  padding: 0;
}

pl-header nav a {
  color: color-mix(in oklab, var(--header-ink) 72%, transparent);
  text-decoration: none;
  padding-block: var(--pl-size-4, 0.25rem);
}

pl-header nav a:hover,
pl-header nav a[aria-current] { color: var(--header-ink); }

pl-header nav a[aria-current] {
  box-shadow: inset 0 -2px 0 var(--pl-color-primary, #2563EB);
}

/* Actions — the single CTA. Sits last; if there's no nav it still goes right. */
pl-header > [data-actions] {
  display: flex;
  align-items: center;
  gap: var(--pl-size-8, 0.5rem);
  margin-inline-start: auto;
}

pl-header > nav ~ [data-actions] { margin-inline-start: 0; }

/*------------------------------------------------
  Toggle — built by the component, hidden until the nav actually collapses.
-------------------------------------------------*/
pl-header [data-nav-toggle] {
  display: none;
  place-items: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  margin-inline-start: auto;
  padding: 0;
  color: inherit;
  background: transparent;
  border: 1px solid var(--header-line);
  border-radius: var(--pl-border-radius-medium, 10px);
  cursor: pointer;
}

pl-header [data-nav-toggle]:focus-visible {
  outline: 2px solid var(--pl-color-primary, #2563EB);
  outline-offset: 2px;
}

pl-header [data-nav-toggle] svg { inline-size: 1.15rem; block-size: 1.15rem; }

@media (max-width: 48rem) {
  pl-header[data-collapsible] [data-nav-toggle] { display: grid; }

  /* The nav becomes a full-width panel under the bar. */
  pl-header[data-collapsible] > nav {
    flex-basis: 100%;
    margin-inline-start: 0;
    order: 10;
  }

  pl-header[data-collapsible] > nav[hidden] { display: none; }

  pl-header[data-collapsible] > nav ul {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    inline-size: 100%;
    padding-block: var(--pl-size-8, 0.5rem);
  }

  pl-header[data-collapsible] > nav li { border-block-start: 1px solid var(--header-line); }

  pl-header[data-collapsible] > nav a {
    display: block;
    padding-block: var(--pl-size-12, 0.75rem);
  }
}
`;
