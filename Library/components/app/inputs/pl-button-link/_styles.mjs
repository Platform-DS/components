// ------------------------------
// Button Link Styles
// ------------------------------
// A real <a> wearing the button look — the exact shared styles pl-button uses,
// targeting the internal <a>. No loading state (a link navigates; it doesn't
// submit), and disabled is handled in the component since an <a> has no
// :disabled.

import { buttonStyles } from '../../../../_core/styles/button.mjs';

export const STYLES = /*css*/`
  ${buttonStyles('a')}
`;
