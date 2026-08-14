// ------------------------------
// Radio Styles
// ------------------------------
// A custom ring + dot drawn over a real <input type="radio">, mirroring its
// :checked/:focus-visible state through sibling selectors. Unlike the checkbox,
// the ring stays open and the dot fills — the conventional radio look.

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
    background: var(--field-background, var(--pl-color-surface, #fff));
    border: var(--pl-border-width-medium, 2px) solid var(--radio-border, var(--pl-color-border-strong, #9CA3AF));
    border-radius: var(--pl-border-radius-full, 9999px);
    transition: border-color 120ms ease;
  }

  .indicator {
    inline-size: 0.6em;
    block-size: 0.6em;
    border-radius: var(--pl-border-radius-full, 9999px);
    background: var(--radio-checked, var(--pl-color-primary, #2563EB));
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 120ms ease, transform 120ms ease;
  }

  .native:checked ~ .box {
    border-color: var(--radio-checked, var(--pl-color-primary, #2563EB));
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
