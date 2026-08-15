// ------------------------------
// Skeleton Styles
// ------------------------------
// The shimmer is a moving highlight in the BACKGROUND rather than an overlaid
// element, so nothing is stacked on top of the bar and nothing has to be
// clipped to its rounded corners.
//
// Under prefers-reduced-motion the sweep stops but the bars stay — a skeleton
// is still doing its job standing still, which is not true of a spinner.

export const STYLES = /*css*/`
  :host {
    display: block;
    --_base: var(--skeleton-color, var(--pl-color-surface-sunken, #F3F4F6));
    --_sheen: var(--skeleton-sheen, color-mix(in oklab, var(--pl-color-ink, #111827) 6%, var(--_base)));
  }

  :host([hidden]) { display: none; }

  .bars {
    display: flex;
    flex-direction: column;
    gap: var(--skeleton-gap, 0.5rem);
  }

  .bar {
    display: block;
    block-size: var(--skeleton-line, 0.8em);
    border-radius: var(--pl-border-radius-small, 4px);

    background-color: var(--_base);
    background-image: linear-gradient(90deg, transparent, var(--_sheen), transparent);
    background-size: 50% 100%;
    background-repeat: no-repeat;
    animation: pl-skeleton-sheen 1.6s ease-in-out infinite;
  }

  .bar--last { inline-size: 62%; }

  /* Circle — sized by --skeleton-size, so it can be matched to the avatar it
     is standing in for. */
  :host([variant="circle"]) .bar {
    inline-size: var(--skeleton-size, 2.5rem);
    block-size: var(--skeleton-size, 2.5rem);
    border-radius: var(--pl-border-radius-full, 9999px);
  }

  /* Rect — fills whatever box the author gives the host, so an image
     placeholder is sized with the same CSS as the image. */
  :host([variant="rect"]) {
    block-size: var(--skeleton-size, 8rem);
  }

  :host([variant="rect"]) .bars,
  :host([variant="rect"]) .bar {
    block-size: 100%;
    border-radius: var(--pl-border-radius-medium, 10px);
  }

  @keyframes pl-skeleton-sheen {
    from { background-position: -60% 0; }
    to { background-position: 160% 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bar { animation: none; background-image: none; }
  }
`;
