// ------------------------------
// Hero Styles — LIGHT DOM
// ------------------------------
// The value-proposition band. Two layouts off one markup shape: stacked
// (default) and `layout="split"`, which pairs the copy with a figure.

export const STYLES = /*css*/`
:where(pl-hero) {
  --section-space: clamp(4rem, 9vw, 8rem);
}

/* The headline outranks a section title, so it gets its own scale. */
:where(pl-hero) > h1 {
  font-size: clamp(2.25rem, 1.2rem + 4vw, 4rem);
  max-inline-size: 18ch;
}

/* Rhythm, not type: left at full weight so a page's bare h1 margin cannot
   reach it. See the same split in _core/styles/section.mjs. */
pl-hero > h1 { margin-block: 0; }

/* The paragraph after the headline is the lede — same rule as h2 + p in the
   shared styles, restated because h1 is the hero's title element. */
:where(pl-hero) > h1 + p {
  font-size: clamp(1.05rem, 1rem + 0.4vw, 1.3rem);
  color: var(--section-ink-muted);
  max-inline-size: 54ch;
}

pl-hero > h1 + p { margin-block-start: var(--pl-size-16, 1rem); }

pl-hero[data-align="center"] > :is(h1, h1 + p) { margin-inline: auto; }

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
  /* Two tracks inside the content column — and they have to add up to the
     SAME measure the other sections use, or the hero silently reads narrower
     than every band below it. That means sizing the halves against the
     measure rather than leaving all four tracks at 1fr, which would split the
     full width four ways and leave the gutters as wide as the copy.

     The gap is a track of its own rather than column-gap, because column-gap
     would also open a gap either side, between the content and the gutters. */
  pl-hero[data-layout="split"] {
    --_split-gap: clamp(2rem, 5vw, 4rem);
    --_split-measure: min(var(--section-width), 100% - var(--section-gutter) * 2);
    --_split-half: calc((var(--_split-measure) - var(--_split-gap)) / 2);

    grid-template-columns:
      [full-start] minmax(var(--section-gutter), 1fr)
      [content-start] minmax(0, var(--_split-half))
      [gap-start] var(--_split-gap)
      [media-start] minmax(0, var(--_split-half))
      [content-end] minmax(var(--section-gutter), 1fr)
      [full-end];

    align-items: center;
  }

  /* Copy in the first half; the figure below claims the second. */
  pl-hero[data-layout="split"] > * {
    grid-column: content-start / span 1;
  }

  pl-hero[data-layout="split"] > :is(figure, picture, img, video) {
    grid-column: media-start / content-end;

    /* Span the copy's rows so the figure centres against the whole block
       rather than sitting in the first row and stretching it.

       NOT 1 / -1: a negative row line counts back from the end of the
       EXPLICIT grid, and there are no explicit rows here — the copy creates
       implicit ones. So -1 resolves to line 1 and the figure lands in row one
       alone, which is the exact bug this replaces. A span is the only form
       that works against an implicit grid, and the count is simply larger
       than any hero: the rows past the copy are empty, auto-sized to zero,
       and this grid has no row-gap for them to open. */
    grid-row: 1 / span 20;
    align-self: center;
    margin-block: 0;
  }
}

pl-hero > figure { margin: 0; }
`;
