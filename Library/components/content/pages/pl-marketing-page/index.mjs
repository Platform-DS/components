// ------------------------------
// Marketing Page — LIGHT DOM
// ------------------------------
// Full-bleed sections stacked edge to edge — the shell the content sections
// were built for. It sets NO max width: each section caps its own measure from
// the inside (see the content sections guide), so the bands themselves run the
// full width of the viewport.
//
//   <pl-marketing-page>
//     <pl-hero>…</pl-hero>
//     <pl-benefits>…</pl-benefits>
//     <pl-cta>…</pl-cta>
//   </pl-marketing-page>
//
// A page shell is deliberately thin. It owns the vertical rhythm between
// sections and the measure of the content column, and nothing else — the
// sections inside it are where the actual page lives. If one of these ever
// grows logic, that is a sign the logic belonged in a section.

import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

const tagName = 'pl-marketing-page';

export class MarketingPage extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, MarketingPage);
