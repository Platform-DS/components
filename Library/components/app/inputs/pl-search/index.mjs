// ------------------------------
// Search Component
// ------------------------------
// EXTENDS the InputElement base primitive with its type fixed to "search", so
// it inherits the native search field — including the clear button and the
// history dropdown — and, being form-associated, submits with the surrounding
// <form>. The only additions are a leading magnifier and its spacing.
//
// It fires the same input/change events as any input, so wire live filtering to
// `input` (debounce it yourself if the work is expensive).

// Imports
import { InputElement } from '../../../../_core/elements/InputElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-search';

// Shadow DOM
export class Search extends InputElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <div part="wrapper" class="wrapper">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="1.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                </svg>
                <input part="input" type="search">
            </div>
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
        // Lock the type — the base's attribute mirroring would strip the
        // template's type="search" (the host carries no type attribute). A
        // constructor can't touch attributes, so it's set here, on connect.
        if (!this.hasAttribute('type')) this.setAttribute('type', 'search');
        super.connectedCallback();
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Search);
}
