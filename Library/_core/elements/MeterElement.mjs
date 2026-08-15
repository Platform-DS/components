// ------------------------------
// MeterElement — native <meter> base primitive
// ------------------------------
// Bridges a custom element to a real <meter>, spec-driven via
// createNativeElement + htmlElementSpec. Implementation components override
// `static template` (which must contain a <meter>) and `static styles`, add
// their own `static props` + `render()`, and inherit the native surface —
// attribute reflection, property delegation, method forwarding — for free.

import { createNativeElement } from '../utilities/createNativeElement.mjs';

export const MeterElement = createNativeElement('meter');
