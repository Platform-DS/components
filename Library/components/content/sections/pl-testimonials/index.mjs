// ------------------------------
// Testimonials Component — LIGHT DOM
// ------------------------------
// Step 6 of the landing-page formula: trust, in someone else's words.
//
//   <pl-testimonials>
//     <h2>What teams say</h2>
//     <ul>
//       <li>
//         <blockquote>
//           <p data-rating aria-label="5 out of 5">★★★★★</p>
//           <p>We deleted our build config and nothing broke.</p>
//           <footer>
//             <img src="/people/ana.jpg" alt="">
//             <span><cite>Ana Ruiz</cite><br>Staff Engineer, Acme</span>
//           </footer>
//         </blockquote>
//       </li>
//     </ul>
//   </pl-testimonials>
//
// Real <blockquote>/<cite>/<footer> markup: correct semantics, and all the
// styling hook the component needs — no classes to memorise.

// Imports
import { SectionElement } from '../../../../_core/elements/SectionElement.mjs';
import { define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-testimonials';

// Light DOM
export class Testimonials extends SectionElement {
    static css = STYLES;
}

define(tagName, Testimonials);
