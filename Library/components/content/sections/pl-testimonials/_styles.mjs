// ------------------------------
// Testimonials Styles — LIGHT DOM
// ------------------------------
// Quote cards in a masonry-ish grid. Built on real <blockquote>/<cite> markup,
// which is both the correct semantics and all the styling hook needed.

export const STYLES = /*css*/`
@layer pl-components {
  pl-testimonials > ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr));
    gap: var(--pl-size-24, 1.5rem);
    list-style: none;
    margin-block-start: var(--pl-size-48, 3rem);
    padding: 0;
  }

  pl-testimonials blockquote {
    display: grid;
    gap: var(--pl-size-16, 1rem);
    align-content: space-between;
    block-size: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: var(--pl-size-24, 1.5rem);
    background: var(--pl-color-surface, #fff);
    border: 1px solid var(--section-line);
    border-radius: var(--pl-border-radius-large, 20px);
  }

  /* On a light default band, tint the card so it separates from the page. */
  pl-testimonials:not([surface]) blockquote,
  pl-testimonials[surface="default"] blockquote {
    background: var(--pl-color-surface-raised, #F9FAFB);
  }

  pl-testimonials[surface="ink"] blockquote,
  pl-testimonials[surface="brand"] blockquote {
    background: color-mix(in oklab, var(--section-ink) 8%, transparent);
  }

  pl-testimonials blockquote p {
    margin: 0;
    font-size: var(--pl-font-size-lg, 1.125rem);
    line-height: var(--pl-line-height-medium, 1.5);
    color: var(--section-ink);
  }

  /* Attribution — <footer> inside the quote, per the HTML spec's guidance. */
  pl-testimonials blockquote footer {
    display: flex;
    align-items: center;
    gap: var(--pl-size-12, 0.75rem);
    font-size: var(--pl-font-size-sm, 0.875rem);
    color: var(--section-ink-muted);
    font-style: normal;
  }

  pl-testimonials cite {
    display: block;
    font-style: normal;
    font-weight: var(--pl-font-weight-semibold, 600);
    color: var(--section-ink);
  }

  pl-testimonials footer img,
  pl-testimonials footer pl-avatar {
    flex: none;
    inline-size: 2.5rem;
    block-size: 2.5rem;
    border-radius: var(--pl-border-radius-full, 9999px);
    object-fit: cover;
  }

  /*------------------------------------------------
    Rating — a row of stars above the quote. Authors mark it up as text
    ("★★★★★" with an accessible label) so it survives styles being off.
  -------------------------------------------------*/
  pl-testimonials [data-rating] {
    color: var(--section-accent);
    letter-spacing: 0.1em;
    font-size: var(--pl-font-size-sm, 0.875rem);
  }
}
`;
