// ------------------------------
// home: the static marketing page
// ------------------------------
// The home page is plain HTML on purpose: it's the page most likely to be
// crawled, shared, and read on a slow connection, and it has no navigation
// state worth an SPA. This module only registers the components it uses and
// wires the theme toggle.
//
// The imports are listed one by one rather than pulling in the barrel, because
// that is the thing the page is claiming: you import what you use. Reaching for
// `Library/index.mjs` here would ship all 52 components to prove a point about
// shipping only what you need.

import '../../Library/components/app/inputs/pl-button/index.mjs';
import '../../Library/components/app/inputs/pl-input/index.mjs';
import '../../Library/components/app/inputs/pl-label/index.mjs';
import '../../Library/components/app/inputs/pl-switch/index.mjs';
import '../../Library/components/app/inputs/pl-checkbox/index.mjs';
import '../../Library/components/app/inputs/pl-ratings/index.mjs';

import '../../Library/components/app/ui/pl-icon/index.mjs';
import '../../Library/components/app/ui/pl-avatar/index.mjs';
import '../../Library/components/app/ui/pl-badge/index.mjs';
import '../../Library/components/app/ui/pl-chip/index.mjs';

import '../../Library/components/app/state/pl-progress/index.mjs';
import '../../Library/components/app/state/pl-meter/index.mjs';
import '../../Library/components/app/state/pl-loading/index.mjs';
import '../../Library/components/app/state/pl-skeleton/index.mjs';

import '../../Library/components/app/surfaces/pl-code-block/index.mjs';
import '../../Library/components/app/surfaces/pl-feedback/index.mjs';
import '../../Library/components/app/surfaces/pl-accordion/index.mjs';
import '../../Library/components/app/surfaces/pl-accordion-group/index.mjs';

import { initThemeToggle } from './theme.mjs';

initThemeToggle();
