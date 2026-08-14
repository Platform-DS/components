// ------------------------------
// Input Component
// ------------------------------
// A themed text input that EXTENDS the InputElement base primitive — it
// inherits the entire native <input> surface (type, value, placeholder, min,
// max, step, pattern, required, disabled, readonly, autocomplete, the
// validity/selection properties, checkValidity()/select()/showPicker(), and the
// input/change/invalid events). Because the base is form-associated, its value
// is submitted with the surrounding <form> even though the real <input> lives
// in the shadow root.
//
// One component covers every text-like type; set `type` as you would on a
// plain input: <pl-input type="email" required>.

// Imports
import { InputElement } from '../../../../_core/elements/InputElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-input';

// Shadow DOM
export class Input extends InputElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`<input part="input">`;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    // Nothing but the native input surface — no extra presentation props.
    static props = { ...InputElement.props };

    constructor() {
        super();
        this.refs = { input: this.shadowRoot.querySelector('input') };
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Input);
}
