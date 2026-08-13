// ------------------------------
// ImageElement — native <img> base primitive
// ------------------------------
// Bridges a custom element to a real <img> (src/srcset/sizes/alt/loading/
// decoding reflection, intrinsic-state property delegation — naturalWidth/
// naturalHeight/complete/currentSrc — and decode() forwarding). Spec-driven
// via createNativeElement + htmlElementSpec. <img> is a void element, so the
// default markup has no slot; implementation components override `static
// template` (must contain an <img>) and `static styles`, add their own
// `static props` + `render()`, and inherit the native image surface for
// free.

import { createNativeElement } from '../utilities/createNativeElement.mjs';

export const ImageElement = createNativeElement('img');
