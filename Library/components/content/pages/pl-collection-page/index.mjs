// ------------------------------
// Collection Page — LIGHT DOM
// ------------------------------
// A list of things: a header, optional filters beside the grid, and paging
// underneath.
//
//   <pl-collection-page>
//     <header data-header><h1>Products</h1></header>
//     <pl-sidebar>
//       <div data-items>…cards…</div>
//       <div data-aside>…filters…</div>
//     </pl-sidebar>
//     <pl-pagination page="1" total="9"></pl-pagination>
//   </pl-collection-page>
//
// A page shell is deliberately thin. It owns the vertical rhythm between
// sections and the measure of the content column, and nothing else — the
// sections inside it are where the actual page lives. If one of these ever
// grows logic, that is a sign the logic belonged in a section.

import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

const tagName = 'pl-collection-page';

export class CollectionPage extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, CollectionPage);
