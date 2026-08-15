// ------------------------------
// Footer Styles — LIGHT DOM
// ------------------------------
// Deliberately plain: link columns, then a meta row for the legal line and
// contact details. On a landing page the footer should close the page, not
// reopen the whole site.

export const STYLES = /*css*/`
@layer pl-components {
  pl-footer {
    --footer-bg: var(--pl-color-surface-raised, #F9FAFB);
    --footer-ink: var(--pl-color-ink, #111);
    --footer-ink-muted: var(--pl-color-ink-secondary, #626262);
    --footer-line: var(--pl-color-border, #cfcfcf);
    --footer-width: 68rem;
    --footer-gutter: var(--pl-size-24, 1.5rem);

    display: grid;
    grid-template-columns:
      [full-start] minmax(var(--footer-gutter), 1fr)
      [content-start] min(var(--footer-width), 100% - var(--footer-gutter) * 2)
      [content-end] minmax(var(--footer-gutter), 1fr)
      [full-end];

    padding-block: clamp(2.5rem, 5vw, 4rem);

    background: var(--footer-bg);
    color: var(--footer-ink);
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-sm, 0.875rem);
    line-height: var(--pl-line-height-medium, 1.5);
  }

  pl-footer > * { grid-column: content; }

  pl-footer[data-surface="ink"] {
    --footer-bg: var(--pl-color-ink, #111);
    --footer-ink: var(--pl-color-surface, #fff);
    --footer-ink-muted: var(--pl-color-gray-400, #9CA3AF);
    --footer-line: var(--pl-color-gray-700, #374151);
  }

  /*------------------------------------------------
    Link columns — each <nav> is a column with an optional heading.
  -------------------------------------------------*/
  pl-footer > div:has(nav),
  pl-footer > [data-columns] {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
    gap: var(--pl-size-32, 2rem);
  }

  pl-footer nav ul {
    display: grid;
    gap: var(--pl-size-8, 0.5rem);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  pl-footer :is(h2, h3, h4) {
    margin-block: 0 var(--pl-size-12, 0.75rem);
    font-family: var(--pl-font-family-sans-serif, inherit);
    font-size: var(--pl-font-size-xs, 0.75rem);
    font-weight: var(--pl-font-weight-semibold, 600);
    letter-spacing: var(--pl-letter-spacing-loose, 0.05em);
    text-transform: uppercase;
    color: var(--footer-ink-muted);
  }

  pl-footer a {
    color: var(--footer-ink-muted);
    text-decoration: none;
  }

  pl-footer a:hover {
    color: var(--footer-ink);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  /*------------------------------------------------
    Brand block — logo plus a line about the company.
  -------------------------------------------------*/
  pl-footer [data-brand] {
    display: flex;
    align-items: center;
    gap: var(--pl-size-8, 0.5rem);
    font-family: var(--pl-font-family-display, inherit);
    font-size: var(--pl-font-size-lg, 1.125rem);
    font-weight: var(--pl-font-weight-bold, 700);
    color: var(--footer-ink);
    text-decoration: none;
  }

  pl-footer :is(img, svg) { display: block; }

  /*------------------------------------------------
    Meta row — the last child: copyright, contact, legal links.
  -------------------------------------------------*/
  pl-footer > :last-child:is(p, div, small) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--pl-size-16, 1rem);

    margin-block-start: var(--pl-size-32, 2rem);
    padding-block-start: var(--pl-size-24, 1.5rem);
    border-block-start: 1px solid var(--footer-line);
    color: var(--footer-ink-muted);
  }

  /* A footer with only a meta row shouldn't draw a rule above it. */
  pl-footer > :first-child:last-child {
    margin-block-start: 0;
    padding-block-start: 0;
    border-block-start: 0;
  }

  pl-footer address {
    font-style: normal;
    color: var(--footer-ink-muted);
  }
}
`;
