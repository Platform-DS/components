// ------------------------------
// Textarea Component
// ------------------------------
// A themed multi-line input that EXTENDS the TextareaElement base primitive,
// inheriting the whole native <textarea> surface (rows, cols, wrap, maxlength,
// placeholder, required, readonly, the value/selection properties, and the
// input/change/invalid events). Form-associated, so its value submits with the
// surrounding <form>.
//
// A <textarea>'s value is its `value` PROPERTY, not an attribute — set it with
// `el.value = …` or as text content, exactly as with a plain textarea.

// Imports
import { TextareaElement } from '../../../../_core/elements/TextareaElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-textarea';

// Shadow DOM
export class Textarea extends TextareaElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`<textarea part="textarea"></textarea>`;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    static props = { ...TextareaElement.props };

    constructor() {
        super();
        this.refs = { textarea: this.shadowRoot.querySelector('textarea') };
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Textarea);
}
