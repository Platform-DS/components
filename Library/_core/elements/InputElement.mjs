// ------------------------------
// InputElement — native <input> base primitive
// ------------------------------
// Bridges a custom element to a real <input> (attribute reflection, property
// delegation including value/checked/validity, select/checkValidity/… method
// forwarding) — all spec-driven via createNativeElement + htmlElementSpec.
// <input> is a void element, so the default markup has no slot; implementation
// components override `static template` (must contain an <input>) and `static
// styles`, add their own `static props` + `render()`, and inherit the
// native input surface for free.

import { createNativeElement } from '../utilities/createNativeElement.mjs';

export const InputElement = createNativeElement('input');
