// ------------------------------
// Range Component
// ------------------------------
// EXTENDS the InputElement base primitive with its type fixed to "range",
// inheriting the native slider surface (min, max, step, value, list, the input
// event) and — being form-associated — submitting its value with the form.
//
// The only thing the component adds over the native element is a filled track
// on WebKit, which has no native fill: it publishes the value as a percentage
// custom property that the track gradient reads.

// Imports
import { InputElement } from '../../../../_core/elements/InputElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-range';

// Shadow DOM
export class Range extends InputElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`<input part="input" type="range">`;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    static props = { ...InputElement.props };

    constructor() {
        super();
        this.refs = { input: this.shadowRoot.querySelector('input') };
        // Value changes as the user drags fire `input`, which composes out to
        // the host — repaint the fill on each.
        this.addEventListener('input', () => this.#updateFill());
    }

    connectedCallback() {
        if (!this.hasAttribute('type')) this.setAttribute('type', 'range');
        super.connectedCallback();
        this.#updateFill();
    }

    render() {
        this.#updateFill();
    }

    /** Publish the value as a 0–100% track position for the WebKit gradient. */
    #updateFill() {
        const el = this.native;
        if (!el) return;
        const min = Number(el.min || 0);
        const max = Number(el.max || 100);
        const value = Number(el.value);
        const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
        this.style.setProperty('--range-percent', `${percent}%`);
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Range);
}
