// ------------------------------
// Input Styles
// ------------------------------
// The shared text-field chrome, targeting the internal <input>. Every input
// type a plain <input> supports (text, email, password, number, search, url,
// tel, date, …) is inherited from the native element, so one style set covers
// them all.

import { fieldStyles } from '../../../../_core/styles/field.mjs';

export const STYLES = /*css*/`
  ${fieldStyles('input')}

  /* Number/date spinners inherit the text color rather than the UA default. */
  input { color-scheme: light dark; }
`;
