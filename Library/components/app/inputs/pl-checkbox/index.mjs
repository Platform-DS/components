// ------------------------------
// Checkbox Component
// ------------------------------
// EXTENDS the InputElement base primitive with its type fixed to "checkbox", so
// it inherits the native checkbox surface (checked, value, name, required,
// disabled, indeterminate, the change event) and — being form-associated —
// submits its value with the surrounding <form>.
//
// The visible box is drawn in the shadow root; the real <input> stays for
// focus, keyboard, and form value. An optional inline label is slotted:
//   <pl-checkbox name="terms" value="yes">I agree</pl-checkbox>

// Imports
import { InputElement } from '../../../../_core/elements/InputElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-checkbox';

// Shadow DOM
export class Checkbox extends InputElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <label part="wrapper" class="wrapper">
                <input part="input" class="native" type="checkbox">
                <span part="box" class="box" aria-hidden="true">
                    <svg class="indicator" viewBox="0 0 16 16" fill="none">
                        <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor"
                              stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                <span part="label" class="label"><slot></slot></span>
            </label>
        `;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    static props = { ...InputElement.props };

    constructor() {
        super();
        this.refs = { input: this.shadowRoot.querySelector('input') };
    }

    connectedCallback() {
        // Lock the type. The base's attribute mirroring would otherwise strip
        // the template's type="checkbox" (the host carries no type attribute),
        // so it's set on the host here, before the base reflects attributes.
        // A constructor can't touch attributes, so it happens on connect.
        if (!this.hasAttribute('type')) this.setAttribute('type', 'checkbox');
        super.connectedCallback();
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Checkbox);
}
