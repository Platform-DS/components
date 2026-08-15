// ------------------------------
// Marketing Page — LIGHT DOM
// ------------------------------
// Full-bleed sections stacked edge to edge — the shell the content sections
// were built for. It sets NO max width: each section caps its own measure from
// the inside (see the content sections guide), so the bands themselves run the
// full width of the viewport.
//
// The full landing-page formula, in order. Every step is a component, and each
// section file names the step it is:
//
//   <pl-marketing-page>
//     <pl-header>…</pl-header>              1. simple, sticky header
//     <pl-hero>…</pl-hero>                  2. value proposition and main offer
//     <pl-social-proof>…</pl-social-proof>  3. proof you can deliver
//     <pl-benefits>…</pl-benefits>          4. what the visitor gets
//     <pl-features>…</pl-features>          5. the product itself
//     <pl-testimonials>…</pl-testimonials>  6. trust, in someone else's words
//     <pl-faqs>…</pl-faqs>                  7. objection handling
//     <pl-cta>…</pl-cta>                    8. the last chance to convert
//     <pl-footer>…</pl-footer>              9. simple footer
//   </pl-marketing-page>
//
// None of the nine is required and the order is a default, not a rule: drop the
// steps that do not apply and the rest still stack correctly, because each band
// owns its own spacing.
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
