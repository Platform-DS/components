// ------------------------------
// Button Group Styles — LIGHT DOM
// ------------------------------
// A segmented row: buttons flush against each other, separated by a hairline,
// with the group's corners rounded and the inner ones squared off.
//
// The divider is the WRAPPER's own background showing through a 1px gap, not a
// border on each button. That matters: a border would have to be colour-matched
// per variant (invisible on a filled button, doubled between two outlined ones)
// and offset by -1px to avoid a 2px seam. A gap is one declaration and looks
// identical whatever the buttons are.
//
// Deliberately no `overflow: hidden` on the wrapper — it would clip the focus
// ring, which is drawn as a box-shadow outside the button's box.

export const STYLES = /*css*/`
@layer pl-components {
  pl-button-group {
    /* The divider is TRANSLUCENT INK rather than a fixed grey, so one value
       reads correctly on a white outline segment and on a saturated filled one
       — no per-variant colour matching. */
    --_divider: var(--button-group-divider, color-mix(in oklab, var(--pl-color-ink, #111827) 18%, transparent));
    --_radius: var(--button-group-radius, var(--pl-border-radius-medium, 8px));

    display: inline-flex;
    align-items: stretch;

    border: var(--pl-border-width-small, 1px) solid var(--_divider);
    border-radius: var(--_radius);
  }

  pl-button-group[hidden] { display: none; }

  /* Fill the container, splitting the width evenly. */
  pl-button-group[data-full] { display: flex; }
  pl-button-group[data-full] > * { flex: 1 1 0; }

  /* Square every segment; the wrapper's own radius shapes the outside. The
     segments' own borders are dropped — the group draws the only lines. */
  pl-button-group > * {
    --button-radius: 0;
    --button-border: transparent;
  }

  /* One hairline between neighbours, drawn on the segment's host box so it sits
     outside the button's own background whatever variant it is. */
  pl-button-group > * + * {
    border-inline-start: var(--pl-border-width-small, 1px) solid var(--_divider);
  }

  /* Round the outer segments a hair less than the wrapper, so the fill sits
     inside the border instead of poking through its corner. */
  pl-button-group > :first-child { --button-radius: calc(var(--_radius) - 1px) 0 0 calc(var(--_radius) - 1px); }
  pl-button-group > :last-child  { --button-radius: 0 calc(var(--_radius) - 1px) calc(var(--_radius) - 1px) 0; }
  pl-button-group > :only-child  { --button-radius: calc(var(--_radius) - 1px); }

  /* The pressed segment of a toolbar-style group. */
  pl-button-group > [aria-pressed="true"] {
    --button-background: var(--pl-color-primary, #2563EB);
    --button-color: var(--pl-color-on-primary, #FFFFFF);
    --button-border: transparent;
  }

  /*------------------------------------------------
    Vertical
  -------------------------------------------------*/
  pl-button-group[data-orientation="vertical"] {
    flex-direction: column;
    align-items: stretch;
  }

  /* The divider turns with the axis. */
  pl-button-group[data-orientation="vertical"] > * + * {
    border-inline-start: 0;
    border-block-start: var(--pl-border-width-small, 1px) solid var(--_divider);
  }

  pl-button-group[data-orientation="vertical"] > :first-child {
    --button-radius: calc(var(--_radius) - 1px) calc(var(--_radius) - 1px) 0 0;
  }

  pl-button-group[data-orientation="vertical"] > :last-child {
    --button-radius: 0 0 calc(var(--_radius) - 1px) calc(var(--_radius) - 1px);
  }
}
`;
