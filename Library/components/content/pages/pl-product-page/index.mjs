// ------------------------------
// Product Page — LIGHT DOM
// ------------------------------
// One thing in detail: media on one side, the buy column on the other, and
// whatever supporting sections follow underneath.
//
//   <pl-product-page>
//     <div data-media><pl-picture ratio="1">…</pl-picture></div>
//     <div data-detail><h1>…</h1><pl-ratings readonly value="4"></pl-ratings></div>
//     <pl-faqs>…</pl-faqs>
//   </pl-product-page>
//
// A page shell is deliberately thin. It owns the vertical rhythm between
// sections and the measure of the content column, and nothing else — the
// sections inside it are where the actual page lives. If one of these ever
// grows logic, that is a sign the logic belonged in a section.

import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

const tagName = 'pl-product-page';

export class ProductPage extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, ProductPage);
