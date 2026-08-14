// ------------------------------
// Popover Styles — LIGHT DOM
// ------------------------------
// Two layers, deliberately:
//
//   1. The base rules — surface, padding, open/close transition. These work
//      everywhere the Popover API does.
//   2. The anchored placement, inside @supports. Where CSS anchor positioning
//      is missing the panel keeps the UA's own centred placement, which is a
//      plain centred sheet: not what was asked for, but never broken or
//      off-screen.
//
// `position-area` places the panel against the implicit anchor (the invoker),
// and `position-try-fallbacks` is what flips it to the opposite edge when the
// preferred side has no room — the auto-direction behaviour, handled by the
// style engine rather than by measuring anything.

export const STYLES = /*css*/`
@layer pl-components {
  pl-popover[popover] {
    /* The UA gives a popover a border, padding, and auto margins; all three
       are replaced here, and margin becomes the gap from the anchor. */
    margin: 0;
    padding: var(--popover-padding, var(--pl-size-16, 1rem));
    inline-size: max-content;
    max-inline-size: var(--popover-width, min(20rem, 100vw - 2rem));
    box-sizing: border-box;

    background: var(--popover-background, var(--pl-color-surface, #fff));
    color: var(--pl-color-ink, #111827);
    border: var(--pl-border-width-small, 1px) solid var(--popover-border, var(--pl-color-border, #E5E7EB));
    border-radius: var(--pl-border-radius-medium, 10px);
    box-shadow: var(--pl-box-shadow-large, 0 12px 32px rgb(0 0 0 / 0.14));

    opacity: 0;
    translate: 0 -0.25rem;
    transition:
      opacity 130ms ease,
      translate 130ms ease,
      display 130ms allow-discrete,
      overlay 130ms allow-discrete;
  }

  pl-popover[popover]:popover-open {
    opacity: 1;
    translate: 0 0;
  }

  @starting-style {
    pl-popover[popover]:popover-open {
      opacity: 0;
      translate: 0 -0.25rem;
    }
  }

  pl-popover > :first-child { margin-block-start: 0; }
  pl-popover > :last-child { margin-block-end: 0; }

  /*------------------------------------------------
    Anchored placement
  -------------------------------------------------*/

  @supports (position-area: block-end) {
    pl-popover[popover] {
      /* Clears the UA's centring so position-area is what places it. */
      inset: auto;
      margin: var(--popover-offset, 0.5rem);
      position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
    }

    /* Below the anchor, aligned to its inline start — the menu default. */
    pl-popover[popover],
    pl-popover[popover][placement="block-end"] { position-area: block-end span-inline-end; }
    pl-popover[popover][placement="block-start"] { position-area: block-start span-inline-end; }
    pl-popover[popover][placement="inline-end"] { position-area: inline-end span-block-end; }
    pl-popover[popover][placement="inline-start"] { position-area: inline-start span-block-end; }

    pl-popover[popover][align="center"][placement="block-end"] { position-area: block-end span-all; }
    pl-popover[popover][align="center"][placement="block-start"] { position-area: block-start span-all; }
    pl-popover[popover][align="center"]:not([placement]) { position-area: block-end span-all; }
    pl-popover[popover][align="center"][placement="inline-end"] { position-area: inline-end span-all; }
    pl-popover[popover][align="center"][placement="inline-start"] { position-area: inline-start span-all; }

    pl-popover[popover][align="end"][placement="block-end"] { position-area: block-end span-inline-start; }
    pl-popover[popover][align="end"][placement="block-start"] { position-area: block-start span-inline-start; }
    pl-popover[popover][align="end"]:not([placement]) { position-area: block-end span-inline-start; }
    pl-popover[popover][align="end"][placement="inline-end"] { position-area: inline-end span-block-start; }
    pl-popover[popover][align="end"][placement="inline-start"] { position-area: inline-start span-block-start; }
  }

  @media (prefers-reduced-motion: reduce) {
    pl-popover[popover] { transition: none; }
  }
}
`;
