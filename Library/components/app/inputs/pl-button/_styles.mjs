// ------------------------------
// Button Styles
// ------------------------------
// The shared button look (from _core/styles/button.mjs, shared with
// pl-button-link) plus the two things only a real <button> needs: a native
// disabled cursor and a loading spinner.

import { buttonStyles } from '../../../../_core/styles/button.mjs';

export const STYLES = /*css*/`
  ${buttonStyles('button')}

  button:disabled { cursor: not-allowed; }

  /*------------------------------------------------
    Loading — CSS-only spinner; aria-busy on the real <button> announces it.
  -------------------------------------------------*/
  :host([data-loading]) button {
    cursor: progress;
    /* Keep the label's width so the button doesn't jump when it returns. */
    color: transparent;
    position: relative;
  }

  :host([data-loading]) button::after {
    content: "";
    position: absolute;
    inset: 50% auto auto 50%;
    width: 1em;
    height: 1em;
    margin: -0.5em 0 0 -0.5em;
    border: var(--pl-border-width-medium, 2px) solid var(--_fg);
    border-block-start-color: transparent;
    border-radius: var(--pl-border-radius-full, 9999px);
    animation: pl-spin 0.6s linear infinite;
  }

  @keyframes pl-spin { to { transform: rotate(1turn); } }

  @media (prefers-reduced-motion: reduce) {
    button { transition: none; }
    :host([data-loading]) button::after { animation-duration: 2s; }
  }
`;
