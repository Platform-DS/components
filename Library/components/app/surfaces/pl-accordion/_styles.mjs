// ------------------------------
// Accordion Styles — LIGHT DOM
// ------------------------------
// The trigger is a real <button> sitting inside the author's heading, so it
// gets `all: unset` first — a heading that looks like a button would be wrong,
// and the browser's own button chrome has nothing to do with a disclosure row.
// What's added back is only what the row needs: full width, a pointer, and a
// focus ring.
//
// The panel is toggled with `hidden`, so there is no height animation here.
// Animating to auto needs `interpolate-size`/`calc-size`, which is not yet
// something every target browser has; a panel that appears instantly is
// correct everywhere, and the marker's rotation carries the motion.

export const STYLES = /*css*/`
@layer pl-components {
  pl-accordion {
    display: block;
    border-block-end: var(--pl-border-width-small, 1px) solid var(--accordion-border, var(--pl-color-border, #E5E7EB));
  }

  pl-accordion[hidden] { display: none; }

  /* The author's heading keeps its semantics; it just stops carrying the
     display type it would have as prose. */
  pl-accordion .pl-accordion__heading {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  pl-accordion .pl-accordion__trigger {
    all: unset;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--pl-size-12, 0.75rem);
    inline-size: 100%;

    padding-block: var(--accordion-padding-block, var(--pl-size-16, 1rem));
    padding-inline: var(--accordion-padding-inline, 0);

    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-base, 1rem);
    font-weight: var(--pl-font-weight-medium, 500);
    line-height: var(--pl-line-height-tight, 1.15);
    color: var(--pl-color-ink, #111827);
    text-align: start;
    cursor: pointer;
  }

  pl-accordion .pl-accordion__trigger:hover { color: var(--pl-color-primary, #2563EB); }

  pl-accordion .pl-accordion__trigger:focus-visible {
    outline: 2px solid var(--pl-color-focus, #2563EB);
    outline-offset: -2px;
    border-radius: var(--pl-border-radius-small, 4px);
  }

  pl-accordion .pl-accordion__trigger:disabled {
    cursor: not-allowed;
    opacity: var(--pl-opacity-50, 0.5);
  }

  /* A chevron drawn from two borders — no icon dependency, and it rotates
     cleanly because it is a real box rather than glyph. */
  pl-accordion .pl-accordion__marker {
    flex: none;
    inline-size: 0.5rem;
    block-size: 0.5rem;
    margin-inline-start: auto;
    /* Nudged up so the rotated square reads as centred on the text baseline. */
    translate: 0 -0.15em;
    border-inline-end: 2px solid currentColor;
    border-block-end: 2px solid currentColor;
    rotate: 45deg;
    opacity: 0.6;
    /* A literal duration: the token contract exports no motion scale, so
       there is no --pl-* alias to reach for here. */
    transition: rotate 150ms ease;
  }

  pl-accordion[open] .pl-accordion__marker { rotate: -135deg; }

  pl-accordion .pl-accordion__body {
    padding-block-end: var(--accordion-padding-block, var(--pl-size-16, 1rem));
    padding-inline: var(--accordion-padding-inline, 0);
    color: var(--pl-color-ink-secondary, #4B5563);
  }

  /* Prose inside the panel shouldn't inherit the page's first-child reset. */
  pl-accordion .pl-accordion__body > :first-child { margin-block-start: 0; }
  pl-accordion .pl-accordion__body > :last-child { margin-block-end: 0; }

  @media (prefers-reduced-motion: reduce) {
    pl-accordion .pl-accordion__marker { transition: none; }
  }
}
`;
