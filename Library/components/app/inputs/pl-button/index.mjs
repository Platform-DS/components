// ------------------------------
// Button Component
// ------------------------------
// EXTENDS the ButtonElement base primitive, so it inherits every native
// <button> attribute, property, method and event for free (disabled, type,
// value, name, form, focus/blur/click, …). Nothing here re-implements the
// platform — this file adds only what a plain <button> lacks: variant, size
// and a loading state.
//
// That inheritance now includes the two things a <button> does that are about
// its position in the document rather than its attributes: submitting or
// resetting the surrounding form, and invoking a popover or dialog. Both are
// bridged across the shadow boundary by createNativeElement, so a pl-button
// behaves like a button in a form and as an invoker without this file — or any
// consumer — having to know that the real one lives in a shadow root.
//
// Reference implementation for the patterns in
// Developer_Docs/component-authoring-guide.md.

// Imports
import { ButtonElement } from '../../../../_core/elements/ButtonElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-button';

// Shadow DOM
export class Button extends ButtonElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <button part="button">
                <slot></slot>
            </button>
        `;
        this.#sheet.replaceSync(STYLES);
        // ButtonElement's constructor reads the public `template` / `styles`.
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    // Native button attributes (spread, tagged `native` — delegated straight to
    // the internal <button>) plus this component's own typed, reflected props.
    // observedAttributes derives from these keys — never hand-maintained.
    static props = {
        ...ButtonElement.props,
        variant: { type: String, default: 'primary' },
        size:    { type: String, default: 'md' },
        loading: { type: Boolean, default: false },
        full:    { type: Boolean, default: false },
    };

    // onCreated — ButtonElement attaches the shadow root from `template` /
    // `styles` and builds this.props before returning.
    constructor() {
        super();

        // DOM references used by render().
        this.refs = {
            button: this.shadowRoot.querySelector('button'),
        };
    }

    // Load once, update forever. Called by the base class on connect and on
    // every observed attribute change — so this is the ONLY place that writes
    // to the internal element.
    render() {
        const { button } = this.refs ?? {};
        if (!button) return;

        // Announce the pending state, and stop clicks landing while it's up.
        // aria-busy goes on the real <button> the AT actually sees.
        button.toggleAttribute('aria-busy', this.props.loading);
        button.disabled = this.disabled || this.props.loading;
    }
}

// Guarded so importing the same component twice (directly and via the barrel)
// can't throw on a duplicate definition.
if (!customElements.get(tagName)) {
    customElements.define(tagName, Button);
}
