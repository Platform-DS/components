// ------------------------------
// Features Styles — LIGHT DOM
// ------------------------------
// The bragging section: alternating copy/media rows, one per feature. Each row
// is an <article> holding a heading, prose, and a figure — so with styles off
// it still reads as a sequence of titled explanations.

export const STYLES = /*css*/`
@layer pl-components {
  pl-features > article {
    display: grid;
    gap: clamp(1.5rem, 4vw, 3.5rem);
    align-items: center;
    margin-block-start: clamp(3rem, 6vw, 5rem);
  }

  @media (min-width: 55rem) {
    pl-features > article {
      grid-template-columns: 1fr 1fr;
    }

    /* Alternate the media side down the page so the eye zig-zags rather than
       marching down one edge. */
    pl-features > article:nth-of-type(even) > :is(figure, picture, img, video) {
      order: -1;
    }
  }

  pl-features article > :is(figure, picture, img, video) {
    margin: 0;
    inline-size: 100%;
  }

  pl-features :is(img, video) {
    display: block;
    inline-size: 100%;
    block-size: auto;
    border-radius: var(--pl-border-radius-large, 20px);
  }

  /* The copy column — everything that isn't the figure. */
  pl-features article > div {
    display: grid;
    gap: var(--pl-size-12, 0.75rem);
    align-content: start;
  }

  pl-features article h3 {
    font-size: clamp(1.35rem, 1.1rem + 1vw, 1.9rem);
    margin-block: 0;
  }

  pl-features article p {
    margin-block: 0;
    color: var(--section-ink-muted);
    max-inline-size: 52ch;
  }

  pl-features article [data-eyebrow] {
    font-size: var(--pl-font-size-sm, 0.875rem);
    font-weight: var(--pl-font-weight-semibold, 600);
    letter-spacing: var(--pl-letter-spacing-loose, 0.05em);
    text-transform: uppercase;
    color: var(--section-accent);
  }

  /* Feature bullet list inside a row. */
  pl-features article ul {
    display: grid;
    gap: var(--pl-size-8, 0.5rem);
    margin-block: var(--pl-size-8, 0.5rem) 0;
    padding-inline-start: 1.15em;
    color: var(--section-ink-muted);
  }

  pl-features article li::marker { color: var(--section-accent); }

  pl-features figure figcaption {
    margin-block-start: var(--pl-size-8, 0.5rem);
    font-size: var(--pl-font-size-sm, 0.875rem);
    color: var(--section-ink-muted);
  }
}
`;
