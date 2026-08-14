// ------------------------------
// SelectElement — native <select> base primitive
// ------------------------------
// Bridges a custom element to a real <select> (name/disabled/required/multiple/
// size reflection, value/selectedIndex/options property delegation,
// checkValidity()/showPicker() forwarding, and re-emitted change/input/invalid
// events) — all spec-driven via createNativeElement + htmlElementSpec. Because
// <select> is form-associated, its value submits through the shadow boundary.
//
// A <select>'s options are its <option> children, and a native <select> does
// not build its list from a <slot>. Implementation components therefore adopt
// the author's light-DOM options INTO the internal <select> rather than slotting
// them — see pl-select. They override `static template` (must contain a
// <select>) and `static styles`, and inherit the native select surface for free.

import { createNativeElement } from '../utilities/createNativeElement.mjs';

export const SelectElement = createNativeElement('select');
