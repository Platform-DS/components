// ------------------------------
// Radio Component
// ------------------------------
// EXTENDS the InputElement base primitive with its type fixed to "radio". Being
// form-associated, it submits its value with the surrounding <form>.
//
// Native radios group by `name` because they share a document; these each wrap
// their own <input> in a separate shadow root, so the browser can't group them.
// This component restores that: when one is checked it unchecks its same-named
// peers within the nearest <form> (or the document), the same scope native
// radios use — so a real <pl-radio-group> isn't required for basic grouping.

// Imports
import { InputElement } from '../../../../_core/elements/InputElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-radio';

// Shadow DOM
export class Radio extends InputElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <label part="wrapper" class="wrapper">
                <input part="input" class="native" type="radio">
                <span part="box" class="box" aria-hidden="true">
                    <span class="indicator"></span>
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
        // The base re-emits the native change event on the host; grouping runs
        // when the user selects this radio.
        this.addEventListener('change', () => this.#syncGroup());
    }

    connectedCallback() {
        if (!this.hasAttribute('type')) this.setAttribute('type', 'radio');
        super.connectedCallback();
    }

    /** Uncheck same-named peers in the same form (or document) when selected. */
    #syncGroup() {
        if (!this.checked) return;
        const name = this.getAttribute('name');
        if (!name) return;

        const root = this.closest('form') ?? this.getRootNode();
        const peers = root.querySelectorAll?.(`${tagName}[name="${CSS.escape(name)}"]`) ?? [];

        for (const peer of peers) {
            if (peer === this || !peer.checked) continue;
            peer.checked = false;   // delegated to its internal <input>
            peer.syncForm?.();      // refresh its now-empty form value
        }
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Radio);
}
