// ------------------------------
// Select Styles
// ------------------------------
// The shared field chrome, targeting the internal <select>, with the native
// arrow stripped (appearance: none) and a themeable chevron drawn in its place.
// The dropdown popup itself is OS-rendered and can't be styled here — only the
// closed control.

import { fieldStyles } from '../../../../_core/styles/field.mjs';

export const STYLES = /*css*/`
  ${fieldStyles('select')}

  .wrapper {
    position: relative;
    display: block;
  }

  select {
    appearance: none;
    -webkit-appearance: none;
    /* Room for the chevron. */
    padding-inline-end: var(--pl-size-32, 2rem);
    cursor: pointer;
  }

  .arrow {
    position: absolute;
    inset-block: 0;
    inset-inline-end: var(--pl-size-12, 0.75rem);
    display: grid;
    place-items: center;
    inline-size: 1rem;
    pointer-events: none;
    color: var(--select-arrow, var(--pl-color-ink-secondary, #626262));
  }

  .arrow svg {
    inline-size: 1rem;
    block-size: 1rem;
  }

  select:disabled ~ .arrow { opacity: var(--pl-opacity-50, 0.5); }
`;
