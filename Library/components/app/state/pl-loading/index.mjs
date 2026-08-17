// ------------------------------
// Loading Component
// ------------------------------
// A spinner. It draws nothing of its own — it renders the `loading-spinner`
// symbol from the shared spritesheet and turns it.
//
//   <pl-loading></pl-loading>
//   <pl-loading label="Saving your changes"></pl-loading>
//
// The spinner inherits `color`, so it takes on whatever it is placed inside:
// on a primary button it is the button's text color, in a dialog it is the
// body text color. Nothing needs to be passed down for that to happen.
//
// ------------------------------
// Silent by default
// ------------------------------
// Like pl-icon, a bare spinner is DECORATIVE and stays out of the
// accessibility tree. That is the safe default here, because a spinner almost
// always sits next to something that already says what is happening — a button
// whose own `aria-busy` is set, or a region with its own status text — and a
// second announcement would just be noise.
//
// Give it a `label` when the spinner IS the only thing reporting the wait, and
// it becomes a live region (`role="status"`) that announces once.
//
// ------------------------------
// The one place a component imports another
// ------------------------------
// This is the library's only cross-component import, and it is deliberate: the
// spinner artwork belongs in the spritesheet so any page can use it through
// pl-icon, and duplicating the same paths here would mean two copies to keep in
// step. pl-icon is a leaf primitive with no dependencies of its own, so the
// import stays a single edge rather than a graph.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';
import '../../ui/pl-icon/index.mjs';

// Component Settings
const tagName = 'pl-loading';

// Shadow DOM
export class Loading extends BaseElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <pl-icon part="spinner" icon="loading-spinner"></pl-icon>
        `;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    static props = {
        label: { type: String },
        size:  { type: String },
    };

    constructor() {
        super();
        this.refs = { icon: this.shadowRoot.querySelector('pl-icon') };
    }

    render() {
        const { icon } = this.refs ?? {};
        if (!icon) return;

        // `size` is passed through to the icon rather than styled here, so a
        // spinner and an icon of the same size really are the same size.
        if (this.props.size) icon.setAttribute('size', this.props.size);
        else icon.removeAttribute('size');

        // Meaningful or decorative — never both, and never a bare spinner
        // announcing itself for no reason.
        const label = this.props.label;
        if (label) {
            this.setAttribute('role', 'status');
            this.setAttribute('aria-label', label);
        } else {
            this.setAttribute('role', 'presentation');
            this.removeAttribute('aria-label');
        }
    }
}

define(tagName, Loading);
