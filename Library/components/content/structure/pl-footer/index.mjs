// ------------------------------
// Footer Component — LIGHT DOM
// ------------------------------
// Step 9 of the landing-page formula: a simple footer. Drop the links that have
// nothing to do with the offer, and include a real way to reach you.
//
//   <pl-footer>
//     <div data-columns>
//       <div>
//         <a data-brand href="/"><img src="/logo.svg" alt="">Platform</a>
//         <address>hello@example.com</address>
//       </div>
//       <nav aria-label="Product">
//         <h3>Product</h3>
//         <ul><li><a href="/docs">Documentation</a></li></ul>
//       </nav>
//     </div>
//     <p><small>© 2026 Platform</small> <a href="/privacy">Privacy</a></p>
//   </pl-footer>
//
// The last child becomes the meta row automatically, so the copyright and legal
// links need no special markup. Contact details go in a real <address>.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-footer';

// Light DOM
export class Footer extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, Footer);
