// ------------------------------
// Meter Component
// ------------------------------
// EXTENDS the MeterElement base primitive, so it inherits the whole native
// <meter> surface — value, min, max, low, high, optimum — for free.
//
//   <pl-meter value="0.7" label="Disk used"></pl-meter>
//   <pl-meter value="82" max="100" low="50" high="80" optimum="0"></pl-meter>
//
// ------------------------------
// A meter is not a progress bar
// ------------------------------
// <meter> is a GAUGE: a measurement inside a known range that is already at
// its value — disk usage, a score, how full something is. <progress> is a TASK
// moving toward completion. The giveaway is whether the number can go down:
// disk usage can, a download's progress cannot.
//
// That distinction is why low/high/optimum exist here and not on pl-progress.
// They tell the browser which end of the range is GOOD, and it tints the bar
// itself — so a meter that crosses into its bad zone changes color without
// anything in JavaScript watching it.

// Imports
import { MeterElement } from '../../../../_core/elements/MeterElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-meter';

// Shadow DOM
export class Meter extends MeterElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        // The fallback text inside a <meter> is what non-supporting browsers
        // show; the slot lets an author supply it.
        this.#template.innerHTML = /*html*/`<meter part="meter"><slot></slot></meter>`;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    static props = {
        ...MeterElement.props,
        label: { type: String },
    };

    constructor() {
        super();
        this.refs = { meter: this.shadowRoot.querySelector('meter') };
    }

    render() {
        const { meter } = this.refs ?? {};
        if (!meter) return;

        // A <meter> in a shadow root cannot be reached by a <label> in the
        // page, so the name is set directly on the element that carries the
        // role. See the docs for why pl-label is not the answer here.
        if (this.props.label) meter.setAttribute('aria-label', this.props.label);
        else meter.removeAttribute('aria-label');
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Meter);
}
