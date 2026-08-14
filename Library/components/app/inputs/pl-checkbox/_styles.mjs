// ------------------------------
// Checkbox Styles
// ------------------------------
// A custom box drawn over a real <input type="checkbox">. The native control
// stays in the tree (focusable, form-bearing, toggled by the wrapping <label>)
// but is visually hidden; the box mirrors its :checked/:focus-visible state
// through sibling selectors, so behaviour stays the platform's.

export const STYLES = /*css*/`
  :host { display: inline-block; }
  :host([hidden]) { display: none; }

  .wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--pl-size-8, 0.5rem);
    cursor: pointer;
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-base, 1rem);
    line-height: var(--pl-line-height-tight, 1.15);
    color: var(--pl-color-ink, #111);
    -webkit-user-select: none;
    user-select: none;
  }

  /* Real control — present for focus and form value, visually replaced. Clicks
     land on the <label> wrapper, which toggles it natively. */
  .native {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: 0;
    opacity: 0;
    pointer-events: none;
  }

  .box {
    flex: none;
    display: grid;
    place-items: center;
    inline-size: 1.15em;
    block-size: 1.15em;
    color: var(--checkbox-check, var(--pl-color-on-primary, #FFFFFF));
    background: var(--field-background, var(--pl-color-surface, #fff));
    border: var(--pl-border-width-medium, 2px) solid var(--checkbox-border, var(--pl-color-border-strong, #9CA3AF));
    border-radius: var(--pl-border-radius-small, 4px);
    transition: background 120ms ease, border-color 120ms ease;
  }

  .indicator {
    inline-size: 0.9em;
    block-size: 0.9em;
    opacity: 0;
    transform: scale(0.6);
    transition: opacity 120ms ease, transform 120ms ease;
  }

  .native:checked ~ .box {
    background: var(--checkbox-checked, var(--pl-color-primary, #2563EB));
    border-color: var(--checkbox-checked, var(--pl-color-primary, #2563EB));
  }

  .native:checked ~ .box .indicator {
    opacity: 1;
    transform: scale(1);
  }

  .native:focus-visible ~ .box {
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--pl-color-primary, #2563EB) 25%, transparent);
  }

  :host([disabled]) .wrapper { cursor: not-allowed; opacity: var(--pl-opacity-60, 0.6); }

  .label:empty { display: none; }

  @media (prefers-reduced-motion: reduce) {
    .box, .indicator { transition: none; }
  }
`;
