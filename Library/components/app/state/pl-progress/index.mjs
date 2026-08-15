// ------------------------------
// Progress Component
// ------------------------------
// EXTENDS the ProgressElement base primitive, inheriting the native
// <progress> surface — value, max, and the read-only `position`.
//
//   <pl-progress value="30" max="100" label="Uploading"></pl-progress>
//   <pl-progress label="Uploading"></pl-progress>          <!-- indeterminate -->
//
// ------------------------------
// No value means indeterminate
// ------------------------------
// That is native <progress> behaviour and it is worth keeping rather than
// papering over with a separate attribute: a bar with no `value` is one whose
// completion is genuinely unknown, and the browser animates it accordingly.
// Removing the attribute — not setting it to 0 — is what returns a bar to that
// state, which is why `value` is deleted rather than zeroed below.
//
// See pl-meter for when to use that instead: a meter measures something that
// already IS at its value and can go down; progress only moves one way.

// Imports
import { ProgressElement } from '../../../../_core/elements/ProgressElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-progress';

// Shadow DOM
export class Progress extends ProgressElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`<progress part="progress"><slot></slot></progress>`;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    static props = {
        ...ProgressElement.props,
        label: { type: String },
    };

    constructor() {
        super();
        this.refs = { progress: this.shadowRoot.querySelector('progress') };
    }

    render() {
        const { progress } = this.refs ?? {};
        if (!progress) return;

        if (this.props.label) progress.setAttribute('aria-label', this.props.label);
        else progress.removeAttribute('aria-label');

        // The host attribute is the source of truth for indeterminacy, and the
        // base's reflection already mirrors its presence — this only makes the
        // intent explicit and keeps CSS able to target the state.
        this.toggleAttribute('indeterminate', !this.hasAttribute('value'));
    }

    /** Progress as a fraction, or null while indeterminate. */
    get fraction() {
        const position = this.refs?.progress?.position ?? -1;
        return position < 0 ? null : position;
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Progress);
}
