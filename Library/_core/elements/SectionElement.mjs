// ------------------------------
// SectionElement — base for content sections (LIGHT DOM)
// ------------------------------
// Content sections are styled semantic wrappers: the author writes real HTML
// inside them, and the component supplies layout and styling. It does NOT
// generate markup from attributes — if it did, the content wouldn't exist until
// JavaScript ran, which would forfeit exactly what Light DOM is for (search
// crawlers, browser translation, the page's own cascade, and reading with JS
// off).
//
// So a section subclass is usually just a stylesheet and a tag name. That's not
// an incomplete component — it's the whole job: a named, documented layout that
// the page's own CSS can still reach.
//
// Presentation attributes (`surface`, `align`, `width`) are deliberately NOT
// declared as `static props`: nothing in JavaScript reads them, CSS does. Per
// the authoring guide, a plain attribute is the right tool when it needs no
// type and no reflection — declaring them would only buy pointless repaints.

import { BaseElement } from './BaseElement.mjs';
import { injectStyles } from '../utilities/injectStyles.mjs';
import { SECTION_STYLES } from '../styles/section.mjs';

export class SectionElement extends BaseElement {
    static mode = 'light';

    /** Component CSS, injected into the document once. */
    static css = '';

    connectedCallback() {
        // Shared section layout first, then this component's own rules — so a
        // subclass rule always follows the base rule it refines.
        injectStyles('pl-section', SECTION_STYLES);
        if (this.constructor.css) injectStyles(this.localName, this.constructor.css);

        super.connectedCallback();
    }
}
