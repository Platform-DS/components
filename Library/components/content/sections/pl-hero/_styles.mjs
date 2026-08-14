// ------------------------------
// Hero Styles — LIGHT DOM
// ------------------------------
// The value-proposition band. Two layouts off one markup shape: stacked
// (default) and `layout="split"`, which pairs the copy with a figure.

export const STYLES = /*css*/`
@layer pl-components {
  pl-hero {
    --section-space: clamp(4rem, 9vw, 8rem);
  }

  /* The headline outranks a section title, so it gets its own scale. */
  pl-hero > h1 {
    font-size: clamp(2.25rem, 1.2rem + 4vw, 4rem);
    max-inline-size: 18ch;
    margin-block: 0;
  }

  /* The paragraph after the headline is the lede — same rule as h2 + p in the
     shared styles, restated because h1 is the hero's title element. */
  pl-hero > h1 + p {
    font-size: clamp(1.05rem, 1rem + 0.4vw, 1.3rem);
    color: var(--section-ink-muted);
    max-inline-size: 54ch;
    margin-block-start: var(--pl-size-16, 1rem);
  }

  pl-hero[align="center"] > :is(h1, h1 + p) { margin-inline: auto; }

  pl-hero img,
  pl-hero picture,
  pl-hero video,
  pl-hero svg {
    display: block;
    max-inline-size: 100%;
    block-size: auto;
  }

  /*------------------------------------------------
    Split — copy beside a figure. The figure is whatever the author put in a
    <figure>, <picture>, or <img>; it drops below the copy on narrow screens.
  -------------------------------------------------*/
  @media (min-width: 60rem) {
    pl-hero[layout="split"] {
      column-gap: clamp(2rem, 5vw, 4rem);
      align-items: center;
    }

    pl-hero[layout="split"] > * {
      grid-column: content-start / span 1;
    }

    /* Two tracks inside the content column. */
    pl-hero[layout="split"] {
      grid-template-columns:
        [full-start] minmax(var(--section-gutter), 1fr)
        [content-start] minmax(0, 1fr)
        [media-start] minmax(0, 1fr)
        [content-end] minmax(var(--section-gutter), 1fr)
        [full-end];
    }

    pl-hero[layout="split"] > :is(figure, picture, img, video) {
      grid-column: media-start / content-end;
      /* Span the copy's rows so it sits alongside, not beneath. */
      grid-row: 1 / -1;
      align-self: center;
      margin-block: 0;
    }
  }

  pl-hero > figure { margin: 0; }
}
`;
