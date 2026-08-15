// ------------------------------
// Sidebar Component — LIGHT DOM
// ------------------------------
// A content column beside the main one — a table of contents, related links,
// an author card.
//
//   <pl-sidebar>
//     <article>…the main content…</article>
//     <div data-aside><h2>On this page</h2>…</div>
//   </pl-sidebar>
//
// Mark the narrow column with `data-aside`; whatever else is inside is the
// main one. There is no `side` attribute on purpose: DOM order decides which
// comes first, so writing the aside second puts it second — visually AND in
// reading and tab order. An attribute that moved it visually would let those
// two disagree, which is the bug that makes a page unusable by keyboard while
// looking perfectly fine.

import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

const tagName = 'pl-sidebar';

export class Sidebar extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, Sidebar);
