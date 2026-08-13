// ------------------------------
// home — the static marketing page
// ------------------------------
// The home page is plain HTML on purpose: it's the page most likely to be
// crawled, shared, and read on a slow connection, and it has no navigation
// state worth an SPA. This module only registers the components it uses and
// wires the theme toggle.

import '../../Library/components/app/inputs/pl-button/index.mjs';
import '../../Library/components/app/ui/pl-icon/index.mjs';

import { initThemeToggle } from './theme.mjs';

initThemeToggle();
