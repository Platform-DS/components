// ------------------------------
// AnchorElement — native <a> base primitive
// ------------------------------
// Bridges a custom element to a real <a> (href/target/rel/download reflection,
// URL-decomposition property delegation — origin/protocol/host/pathname/… — and
// focus/blur/click forwarding, so a click navigates natively). Spec-driven via
// createNativeElement + htmlElementSpec. Implementation components extend this:
// override `static template` (must contain an <a>, with a <slot> for the link
// text) and `static styles`, add their own `static props` + `render()`.

import { createNativeElement } from '../utilities/createNativeElement.mjs';

export const AnchorElement = createNativeElement('a');
