// ------------------------------
// Social Proof Component — LIGHT DOM
// ------------------------------
// Step 3 of the landing-page formula: proof you can deliver — customer logos,
// an overall rating, or a few headline numbers.
//
//   <pl-social-proof>
//     <p>Trusted by teams at</p>
//     <ul>
//       <li><img src="/logos/acme.svg" alt="Acme"></li>
//       <li><strong>12,000+</strong> projects shipped</li>
//     </ul>
//   </pl-social-proof>
//
// Logos are images with real alt text and stats are real text, so the proof is
// readable by a crawler and a screen reader, not baked into a picture.

// Imports
import { SectionElement } from '../../../../_core/elements/SectionElement.mjs';
import { define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-social-proof';

// Light DOM
export class SocialProof extends SectionElement {
    static css = STYLES;
}

define(tagName, SocialProof);
