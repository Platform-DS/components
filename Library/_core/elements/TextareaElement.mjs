// ------------------------------
// TextareaElement — native <textarea> base primitive
// ------------------------------
// Bridges a custom element to a real <textarea> (rows/cols/placeholder/…
// reflection, value/selection property delegation, select/checkValidity/… method
// forwarding, and re-emitted change/invalid/select events). Spec-driven via
// createNativeElement + htmlElementSpec. <textarea>'s value is its `value`
// PROPERTY (no value attribute), delegated here. Implementation components
// extend this: override `static template` (must contain a <textarea>) and
// `static styles`, add their own `static props` + `render()`.

import { createNativeElement } from '../utilities/createNativeElement.mjs';

export const TextareaElement = createNativeElement('textarea');
