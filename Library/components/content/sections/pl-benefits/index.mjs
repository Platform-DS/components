// ------------------------------
// Benefits Component — LIGHT DOM
// ------------------------------
// Step 4 of the landing-page formula: what the visitor gets — their end result,
// not your feature list. Features go in <pl-features>; this section is for the
// outcome those features produce.
//
//   <pl-benefits variant="card">
//     <h2>Four fewer things to worry about</h2>
//     <p>Problems the platform solved years ago.</p>
//     <ul>
//       <li>
//         <pl-icon icon="cube"></pl-icon>
//         <h3>No toolchain</h3>
//         <p>Ship the source. It's ES modules and CSS.</p>
//       </li>
//     </ul>
//   </pl-benefits>
//
// A <ul> because a list of benefits is a list: it survives styles being off and
// announces its length to a screen reader.

// Imports
import { SectionElement } from '../../../../_core/elements/SectionElement.mjs';
import { define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-benefits';

// Light DOM
export class Benefits extends SectionElement {
    static css = STYLES;
}

define(tagName, Benefits);
