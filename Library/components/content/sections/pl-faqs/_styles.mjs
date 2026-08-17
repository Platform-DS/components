// ------------------------------
// FAQs Styles — LIGHT DOM
// ------------------------------
// Built on <details>/<summary>: the browser already owns the open/closed state,
// the keyboard behaviour, the accessible name, and — in current engines — the
// ability for in-page search to open a closed answer. None of that is worth
// re-implementing with aria-expanded and a click handler.

export const STYLES = /*css*/`
:where(pl-faqs) { --section-width: 52rem; }

pl-faqs > details {
  border-block-end: 1px solid var(--section-line);
  margin-block-start: 0;
}

pl-faqs > details:first-of-type {
  border-block-start: 1px solid var(--section-line);
  margin-block-start: var(--pl-size-48, 3rem);
}

pl-faqs summary {
  display: flex;
  align-items: center;
  gap: var(--pl-size-16, 1rem);
  padding-block: var(--pl-size-16, 1rem);

  font-family: var(--pl-font-family-display, inherit);
  font-size: var(--pl-font-size-lg, 1.125rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  line-height: var(--pl-line-height-tight, 1.15);
  color: var(--section-ink);

  cursor: pointer;
  list-style: none;
}

pl-faqs summary::-webkit-details-marker { display: none; }

pl-faqs summary:hover { color: var(--section-accent); }

pl-faqs summary:focus-visible {
  outline: 2px solid var(--section-accent);
  outline-offset: 2px;
  border-radius: var(--pl-border-radius-small, 4px);
}

/* Marker — a plus that becomes a minus. Pushed to the end so the question
   text starts at a consistent left edge. */
pl-faqs summary::after {
  content: "";
  flex: none;
  inline-size: 0.75rem;
  block-size: 0.75rem;
  margin-inline-start: auto;
  background: currentColor;
  transition: rotate 180ms ease;
  /* Plus sign drawn with a mask so it inherits the text color. */
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M6 1v10M1 6h10' stroke='black' stroke-width='1.75' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat;
}

pl-faqs details[open] summary::after { rotate: 135deg; }

/* The answer. */
pl-faqs details > :not(summary) {
  margin-block: 0 var(--pl-size-16, 1rem);
  color: var(--section-ink-muted);
  max-inline-size: 68ch;
}

pl-faqs details > * + :not(summary) { margin-block-start: var(--pl-size-12, 0.75rem); }

pl-faqs details a { color: var(--section-ink); }

@media (prefers-reduced-motion: reduce) {
  pl-faqs summary::after { transition: none; }
}
`;
