// ------------------------------
// Loading Styles
// ------------------------------
// One animation on the icon. The artwork already carries its own opacities —
// a faint ring under a solid quarter-arc — so spinning it is the whole effect;
// there is nothing to fade or redraw.
//
// `color: inherit` is what lets the same spinner sit on a primary button and
// in a dialog body without being told about either.

export const STYLES = /*css*/`
  :host {
    display: inline-flex;
    color: inherit;
    /* Keeps a spinner sitting beside text on the text's own centre line. */
    vertical-align: middle;
  }

  :host([hidden]) { display: none; }

  pl-icon {
    color: inherit;
    animation: pl-loading-spin var(--loading-duration, 750ms) linear infinite;
  }

  @keyframes pl-loading-spin {
    to { rotate: 360deg; }
  }

  /* Still turning, but slowly enough not to trigger anyone — a spinner frozen
     completely would read as a hung interface, which is worse than the motion
     it was meant to avoid. */
  @media (prefers-reduced-motion: reduce) {
    pl-icon { animation-duration: 2.4s; }
  }
`;
