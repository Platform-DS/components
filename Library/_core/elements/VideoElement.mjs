// ------------------------------
// VideoElement — native <video> base primitive
// ------------------------------
// Bridges a custom element to a real <video>, spec-driven via
// createNativeElement + htmlElementSpec. Implementation components override
// `static template` (which must contain a <video>) and `static styles`, add
// their own `static props` + `render()`, and inherit the native surface —
// attribute reflection, property delegation, method forwarding — for free.

import { createNativeElement } from '../utilities/createNativeElement.mjs';

export const VideoElement = createNativeElement('video');
