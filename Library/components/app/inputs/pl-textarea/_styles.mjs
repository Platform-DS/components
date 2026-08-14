// ------------------------------
// Textarea Styles
// ------------------------------
// The shared field chrome, targeting the internal <textarea>, plus the
// multi-line specifics: a minimum height and a vertical-only resize handle
// (horizontal resize would break the layout it sits in).

import { fieldStyles } from '../../../../_core/styles/field.mjs';

export const STYLES = /*css*/`
  ${fieldStyles('textarea')}

  textarea {
    display: block;
    min-block-size: var(--textarea-min-height, 6rem);
    resize: var(--textarea-resize, vertical);
    field-sizing: content;   /* grows with content where supported */
  }
`;
