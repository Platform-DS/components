// ------------------------------
// Switch Styles — LIGHT DOM
// ------------------------------
// A track with a sliding knob, drawn over a real checkbox. The input stays in
// the tree (focusable, form-bearing, toggled by the wrapping <label>) but is
// visually replaced; the track mirrors its :checked and :focus-visible state
// through sibling selectors, so the behaviour is never re-implemented.

export const STYLES = /*css*/`
@layer pl-components {
  pl-switch {
    display: inline-block;
    --switch-width: 2.5rem;
    --switch-height: 1.4rem;
    --switch-gap: 2px;
  }

  pl-switch[hidden] { display: none; }

  pl-switch .pl-switch__wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--pl-size-8, 0.5rem);
    cursor: pointer;

    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-base, 1rem);
    line-height: var(--pl-line-height-tight, 1.15);
    color: var(--pl-color-ink, #111827);
    -webkit-user-select: none;
    user-select: none;
  }

  /* The real control — present for focus, keyboard, and form value. */
  pl-switch .pl-switch__input {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: 0;
    opacity: 0;
    pointer-events: none;
  }

  pl-switch .pl-switch__track {
    flex: none;
    position: relative;
    inline-size: var(--switch-width);
    block-size: var(--switch-height);
    background: var(--switch-off, var(--pl-color-border-strong, #9CA3AF));
    border-radius: var(--pl-border-radius-full, 9999px);
    transition: background 160ms ease;
  }

  /* The knob. A pseudo-element so the markup stays a track and nothing else. */
  pl-switch .pl-switch__track::after {
    content: "";
    position: absolute;
    inset-block-start: var(--switch-gap);
    inset-inline-start: var(--switch-gap);
    inline-size: calc(var(--switch-height) - var(--switch-gap) * 2);
    block-size: calc(var(--switch-height) - var(--switch-gap) * 2);
    background: var(--switch-knob, #FFFFFF);
    border-radius: var(--pl-border-radius-full, 9999px);
    box-shadow: var(--pl-box-shadow-small, 0 1px 2px rgb(0 0 0 / 0.2));
    transition: translate 160ms ease;
  }

  pl-switch .pl-switch__input:checked ~ .pl-switch__track {
    background: var(--switch-on, var(--pl-color-primary, #2563EB));
  }

  /* Logical translate, so it slides the correct way in a RTL document. */
  pl-switch .pl-switch__input:checked ~ .pl-switch__track::after {
    translate: calc(var(--switch-width) - var(--switch-height)) 0;
  }

  pl-switch .pl-switch__input:focus-visible ~ .pl-switch__track {
    outline: 2px solid var(--pl-color-focus, #2563EB);
    outline-offset: 2px;
  }

  pl-switch[disabled] .pl-switch__wrap {
    cursor: not-allowed;
    opacity: var(--pl-opacity-60, 0.6);
  }

  pl-switch .pl-switch__label:empty { display: none; }

  /* Label first, control last. */
  pl-switch[label-position="start"] .pl-switch__wrap { flex-direction: row-reverse; }

  @media (prefers-reduced-motion: reduce) {
    pl-switch .pl-switch__track,
    pl-switch .pl-switch__track::after { transition: none; }
  }
}
`;
