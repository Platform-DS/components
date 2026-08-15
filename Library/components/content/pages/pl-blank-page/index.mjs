// ------------------------------
// Blank Page — LIGHT DOM
// ------------------------------
// The plainest shell: a header, a measured content column, a footer.
//
//   <pl-blank-page>
//     <pl-header slot-ignored>…</pl-header>
//     <main>…</main>
//     <pl-footer>…</pl-footer>
//   </pl-blank-page>
//
// A page shell is deliberately thin. It owns the vertical rhythm between
// sections and the measure of the content column, and nothing else — the
// sections inside it are where the actual page lives. If one of these ever
// grows logic, that is a sign the logic belonged in a section.

import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

const tagName = 'pl-blank-page';

export class BlankPage extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, BlankPage);
