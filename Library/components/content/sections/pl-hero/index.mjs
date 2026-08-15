// ------------------------------
// Hero Component — LIGHT DOM
// ------------------------------
// Step 2 of the landing-page formula: the value proposition and main offer.
// The first thing a visitor reads, so it stays in the page's own DOM — visible
// to crawlers, translatable, and rendered with or without JavaScript.
//
//   <pl-hero data-align="center">
//     <p data-eyebrow>Zero dependencies</p>
//     <h1>Components that outlive your framework.</h1>
//     <p>Native custom elements and CSS custom properties. No build step.</p>
//     <div data-actions>
//       <pl-button>Read the docs</pl-button>
//     </div>
//   </pl-hero>

// Imports
import { SectionElement } from '../../../../_core/elements/SectionElement.mjs';
import { define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-hero';

// Light DOM
export class Hero extends SectionElement {
    static css = STYLES;
}

define(tagName, Hero);
