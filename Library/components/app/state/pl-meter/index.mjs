// ------------------------------
// Meter Component
// ------------------------------
// EXTENDS the MeterElement base primitive, so it inherits the whole native
// <meter> surface — value, min, max, low, high, optimum — for free.
//
//   <pl-meter value="0.7" label="Disk used"></pl-meter>
//   <pl-meter value="82" max="100" low="50" high="80" optimum="0"></pl-meter>
//
//   <pl-meter value="7.2" max="10" label="Storage" data-fill="gradient">
//     <span slot="value">7.2 / 10 GB</span>
//   </pl-meter>
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
//
// ------------------------------
// Two ways to color a bar, and they answer different questions
// ------------------------------
// low/high/optimum say GOOD or BAD. data-fill="gradient" says LOW or HIGH: a
// ramp from light to dark, where a position along the track always means the
// same shade regardless of the current value. Use zones when crossing a
// threshold matters, and a ramp when the reading is just a quantity. Using both
// would be claiming that more is worse and darker at the same time.
//
// ------------------------------
// The readout is a slot
// ------------------------------
// "7.2 / 10 GB" is a formatted number: a unit, a separator, a precision, and a
// locale. All four belong to the page rather than to a gauge, which is why the
// component takes the finished string instead of trying to assemble it. It does
// take responsibility for one thing: mirroring that string into aria-valuetext,
// so what is announced and what is displayed cannot disagree.

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
        this.#template.innerHTML = /*html*/`
            <div part="header" class="header">
                <span part="label" class="label"></span>
                <span part="value" class="value"><slot name="value"></slot></span>
            </div>
            <meter part="meter"><slot></slot></meter>
        `;
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
        this.refs = {
            meter: this.shadowRoot.querySelector('meter'),
            header: this.shadowRoot.querySelector('.header'),
            label: this.shadowRoot.querySelector('.label'),
            value: this.shadowRoot.querySelector('slot[name="value"]'),
        };

        // The readout is the author's markup, so it can change without any
        // attribute on the host changing. Re-render when it does.
        this.refs.value?.addEventListener('slotchange', () => this.render());
    }

    /** Where the value sits in its range, 0–1. */
    get fraction() {
        const meter = this.refs?.meter;
        if (!meter) return 0;

        const min = Number(meter.min);
        const max = Number(meter.max);
        const span = max - min;
        if (!Number.isFinite(span) || span <= 0) return 0;

        return Math.min(1, Math.max(0, (Number(meter.value) - min) / span));
    }

    render() {
        const { meter, header, label, value } = this.refs ?? {};
        if (!meter) return;

        // A <meter> in a shadow root cannot be reached by a <label> in the
        // page, so the name is set directly on the element that carries the
        // role. See the docs for why pl-label is not the answer here.
        if (this.props.label) meter.setAttribute('aria-label', this.props.label);
        else meter.removeAttribute('aria-label');

        if (label) label.textContent = this.props.label ?? '';

        // The readout, if the author supplied one. Its text becomes the
        // announced value too: a screen reader that hears "7.2" when the page
        // says "7.2 / 10 GB" has been told the less useful half.
        const readout = (value?.assignedNodes() ?? [])
            .map(node => node.textContent.trim())
            .join(' ')
            .trim();

        if (readout) meter.setAttribute('aria-valuetext', readout);
        else meter.removeAttribute('aria-valuetext');

        // The header is chrome for things that may not exist; without both it
        // would be an empty row holding open a gap above the bar.
        if (header) header.hidden = !this.props.label && !readout;

        // The one number CSS cannot work out for itself — see the gradient note
        // in _styles.mjs. Rounded, because a 15-digit float in a custom property
        // is noise in the inspector for sub-pixel precision nobody can see.
        meter.style.setProperty('--_fraction', String(Math.max(this.fraction, 0.0001).toFixed(4)));
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Meter);
}
