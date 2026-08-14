// ------------------------------
// Features Component — LIGHT DOM
// ------------------------------
// Step 5 of the landing-page formula: the product itself. Where <pl-benefits>
// sells the outcome, this is where you show the thing — screenshots, specifics,
// what makes it different.
//
//   <pl-features>
//     <h2>What you actually get</h2>
//     <article>
//       <div>
//         <p data-eyebrow>Authoring</p>
//         <h3>Declare props once</h3>
//         <p>observedAttributes derives from the declaration.</p>
//       </div>
//       <figure><img src="/shots/authoring.png" alt="…"></figure>
//     </article>
//   </pl-features>
//
// One <article> per feature, each with a copy <div> and a figure; rows alternate
// their media side automatically.

// Imports
import { SectionElement } from '../../../../_core/elements/SectionElement.mjs';
import { define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-features';

// Light DOM
export class Features extends SectionElement {
    static css = STYLES;
}

define(tagName, Features);
