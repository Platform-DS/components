// ------------------------------
// ButtonElement — native <button> base primitive
// ------------------------------
// Bridges a custom element to a real <button> (attribute reflection, property
// delegation, focus/blur/click forwarding) — all spec-driven via
// createNativeElement + htmlElementSpec. Implementation components extend this:
// override `static template` (must contain a <button>) and `static styles`,
// add their own `static props` + `render()`, and inherit the native
// button surface for free.

import { createNativeElement } from '../utilities/createNativeElement.mjs';

export const ButtonElement = createNativeElement('button');
