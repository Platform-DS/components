// ------------------------------
// CTA Component — LIGHT DOM
// ------------------------------
// Step 8 of the landing-page formula: the last chance to convert. Usually the
// header's call to action repeated, or a short contact form.
//
//   <pl-cta>
//     <h2>Use the browser.</h2>
//     <p>It already ships components, encapsulation, and a module loader.</p>
//     <div data-actions>
//       <pl-button data-size="lg">Get started</pl-button>
//     </div>
//     <p>No build step. No dependencies.</p>
//   </pl-cta>
//
// Brand-filled and centred by default so it reads as a close rather than
// another content band; set `surface` to override.

// Imports
import { SectionElement } from '../../../../_core/elements/SectionElement.mjs';
import { define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-cta';

// Light DOM
export class Cta extends SectionElement {
    static css = STYLES;
}

define(tagName, Cta);
