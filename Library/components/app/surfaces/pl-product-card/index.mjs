// ------------------------------
// Product Card Component — LIGHT DOM
// ------------------------------
// A frame for a product: image, name, price, and whatever controls belong
// with it. It generates NO markup — the author writes real HTML inside it and
// marks the regions, exactly as the content sections do:
//
//   <pl-product-card>
//     <div data-media>
//       <img src="…" alt="">
//       <pl-badge content="New" data-badge></pl-badge>
//     </div>
//     <p data-eyebrow>Outerwear</p>
//     <h3 data-title><a href="/p/1">Field Jacket</a></h3>
//     <pl-ratings value="4" readonly></pl-ratings>
//     <p data-price>$148 <s>$195</s></p>
//     <div data-actions>
//       <pl-button data-full><pl-icon icon="shopping-bag"></pl-icon> Add to bag</pl-button>
//     </div>
//   </pl-product-card>
//
// That is the whole component: a named layout the page's own CSS can still
// reach, holding components that already exist. Nothing here re-implements a
// button, a rating, or a badge — and because it stays in the page's DOM, the
// product name and price are readable by a crawler with JavaScript off.
//
// The card deliberately does not become a link itself. Wrapping everything in
// one <a> would swallow the buttons inside it; the title carries the link, so
// "open the product" and "add to bag" stay two separate, real controls.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-product-card';

// Light DOM
export class ProductCard extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, ProductCard);
