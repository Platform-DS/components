// ------------------------------
// Search Styles
// ------------------------------
// The shared field chrome plus a leading magnifier and room for it. The icon is
// inlined in the shadow root (not a pl-icon) so pl-search carries no dependency
// on another component.

import { fieldStyles } from '../../../../_core/styles/field.mjs';

export const STYLES = /*css*/`
  ${fieldStyles('input')}

  .wrapper {
    position: relative;
    display: block;
  }

  .icon {
    position: absolute;
    inset-block: 0;
    inset-inline-start: var(--pl-size-12, 0.75rem);
    margin-block: auto;
    inline-size: 1rem;
    block-size: 1rem;
    pointer-events: none;
    color: var(--pl-color-ink-secondary, #626262);
  }

  input {
    /* Leave room for the leading icon. */
    padding-inline-start: var(--pl-size-32, 2rem);
  }

  /* The native clear button, tinted to match. */
  input::-webkit-search-cancel-button {
    -webkit-appearance: none;
    inline-size: 0.85em;
    block-size: 0.85em;
    cursor: pointer;
    background: var(--pl-color-ink-secondary, #626262);
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 4l8 8M12 4l-8 8' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat;
  }
`;
