// ------------------------------
// Carousel Styles — LIGHT DOM
// ------------------------------
// The track is the whole mechanism: a flex row that scrolls on the inline axis
// with snap points. Everything else here is chrome around it.
//
// `scroll-snap-type: inline proximity` rather than `mandatory` — mandatory
// fights a user who is deliberately scrolling to a position between slides,
// and on a track whose slides are wider than the viewport it can trap the
// scroll entirely.
//
// The controls only appear once the script has built them (see index.mjs for
// why), which is what [data-controls] gates.

export const STYLES = /*css*/`
@layer pl-components {
  pl-carousel {
    position: relative;
    display: block;

    /* A flex or grid item defaults to min-width:auto, which resolves to
       min-content — and this component's min-content is the full width of
       every slide laid end to end. Dropped into any flex container it would
       size itself to the whole track instead of the space available, pushing
       the far edge (and the "next" button pinned to it) off past the
       container. Zeroing it lets the box shrink; the track then scrolls,
       which is the entire point of the component. */
    min-inline-size: 0;
    max-inline-size: 100%;
  }

  pl-carousel[hidden] { display: none; }

  pl-carousel .pl-carousel__track {
    display: flex;
    gap: var(--carousel-gap, var(--pl-size-16, 1rem));

    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: inline proximity;
    scroll-behavior: smooth;
    overscroll-behavior-inline: contain;

    /* Room for the focus ring and any card shadow, without clipping either. */
    padding: var(--pl-size-4, 0.25rem);
    margin: calc(var(--pl-size-4, 0.25rem) * -1);

    scrollbar-width: none;
  }

  pl-carousel .pl-carousel__track::-webkit-scrollbar { display: none; }

  pl-carousel .pl-carousel__track:focus-visible {
    outline: 2px solid var(--pl-color-focus, #2563EB);
    outline-offset: 2px;
    border-radius: var(--pl-border-radius-medium, 10px);
  }

  /* Every direct child is a slide. flex-basis is the knob a page turns to say
     how many fit at once; the zero min-inline-size keeps a wide card from
     refusing to shrink and blowing the track out. */
  pl-carousel .pl-carousel__track > * {
    flex: 0 0 var(--carousel-slide, 16rem);
    min-inline-size: 0;
    scroll-snap-align: start;
  }

  /*------------------------------------------------
    Controls — overlaid on the track's edges.
  -------------------------------------------------*/

  pl-carousel .pl-carousel__control {
    position: absolute;
    inset-block-start: var(--carousel-control-top, 50%);
    translate: 0 -50%;
    z-index: 1;

    display: grid;
    place-items: center;
    inline-size: 2.25rem;
    block-size: 2.25rem;
    padding: 0;

    background: var(--carousel-control-background, var(--pl-color-surface, #fff));
    color: var(--pl-color-ink, #111827);
    border: var(--pl-border-width-small, 1px) solid var(--pl-color-border, #E5E7EB);
    border-radius: var(--pl-border-radius-full, 9999px);
    box-shadow: var(--pl-box-shadow-medium, 0 4px 12px rgb(0 0 0 / 0.12));
    cursor: pointer;

    transition: opacity 120ms ease;
  }

  /* Hidden until the script builds them — see index.mjs. */
  pl-carousel:not([data-controls]) .pl-carousel__control { display: none; }

  pl-carousel .pl-carousel__control svg { inline-size: 1.1rem; block-size: 1.1rem; }

  /* Overlaid on the track's edges, entirely INSIDE the component's own box.
     Straddling the edge (a 50% translate outward) looks tidier in isolation
     but is clipped by any ancestor that hides its overflow — a card, a
     section, the demo frames in these docs — which is a failure the author of
     that ancestor has no reason to expect. */
  pl-carousel .pl-carousel__control--prev {
    inset-inline-start: var(--carousel-control-inset, var(--pl-size-8, 0.5rem));
    translate: 0 -50%;
  }

  pl-carousel .pl-carousel__control--next {
    inset-inline-end: var(--carousel-control-inset, var(--pl-size-8, 0.5rem));
    translate: 0 -50%;
  }

  /* The arrow is drawn pointing to the inline start; the other one is the same
     glyph turned around, which also makes it correct in a RTL document. */
  pl-carousel .pl-carousel__control--next svg { rotate: 180deg; }

  pl-carousel .pl-carousel__control:hover { background: var(--pl-color-surface-raised, #F9FAFB); }

  pl-carousel .pl-carousel__control:focus-visible {
    outline: 2px solid var(--pl-color-focus, #2563EB);
    outline-offset: 2px;
  }

  /* Kept in the layout when spent, so the track never shifts sideways as the
     buttons come and go — and still removed from the tab order by [disabled]. */
  pl-carousel .pl-carousel__control:disabled {
    opacity: 0;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    pl-carousel .pl-carousel__track { scroll-behavior: auto; }
    pl-carousel .pl-carousel__control { transition: none; }
  }
}
`;
