// ------------------------------
// Button Link Component
// ------------------------------
// A link that looks like a button. It EXTENDS the AnchorElement base primitive,
// so it inherits the whole native <a> surface (href, target, rel, download,
// URL-decomposition properties, native navigation on click) and only adds the
// button styling and a disabled state.
//
// It stays an <a>, not a role="button": it navigates, so a screen reader should
// announce it as a link. Reach for pl-button when the action isn't navigation.

// Imports
import { AnchorElement } from '../../../../_core/elements/AnchorElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-button-link';

// Shadow DOM
export class ButtonLink extends AnchorElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <a part="anchor">
                <slot></slot>
            </a>
        `;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    // Native anchor attributes (href, target, rel, download, …) plus this
    // component's own presentation props.
    static props = {
        ...AnchorElement.props,
        variant:  { type: String, default: 'primary' },
        size:     { type: String, default: 'md' },
        full:     { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
    };

    constructor() {
        super();
        this.refs = { anchor: this.shadowRoot.querySelector('a') };
    }

    render() {
        const { anchor } = this.refs ?? {};
        if (!anchor) return;

        // An <a> can't be :disabled. A disabled link is inert: no href to
        // follow, out of the tab order, and marked for assistive tech.
        if (this.props.disabled) {
            anchor.removeAttribute('href');
            anchor.setAttribute('aria-disabled', 'true');
            anchor.setAttribute('tabindex', '-1');
        } else {
            anchor.removeAttribute('aria-disabled');
            anchor.removeAttribute('tabindex');
            // href itself is mirrored from the host by the base — nothing to do.
        }
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, ButtonLink);
}
