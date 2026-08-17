// ------------------------------
// Label Component — LIGHT DOM, deliberately
// ------------------------------
// The clearest case in the library for opting out of Shadow DOM.
//
// A <label> associates with a control either by wrapping it or by pointing
// `for` at its id — and BOTH mechanisms are scoped to a single DOM tree. Put
// this label in a shadow root and it can no longer see the control in the
// page; put the control in the label's shadow root and the page's <form> can
// no longer see the control. Either way something that should just work stops
// working.
//
// So the split is: the LABEL is light (it needs to reach across the document),
// and the CONTROL it labels stays shadow (it wants its styling encapsulated).
// The control should attach its shadow root with `delegatesFocus: true` — set
// `static delegatesFocus = true` on the component — so a click on the label
// lands on the real <input> inside it.
//
// This component also owns the aria-describedby wiring for hint and error
// text, which is id-based and therefore has the same cross-root problem.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-label';

// Light DOM components can't adopt a stylesheet onto a shadow root, so their
// CSS goes into the document once, on first use.
let stylesInjected = false;

function ensureStyles() {
    if (stylesInjected) return;
    stylesInjected = true;

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(STYLES);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}

let uid = 0;

// Light DOM
export class Label extends BaseElement {
    static mode = 'light';

    static props = {
        text:     { type: String },
        hint:     { type: String },
        error:    { type: String },
        success:  { type: String },
        required: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
    };

    #label;
    #text;
    #hint;
    #error;
    #success;

    connectedCallback() {
        ensureStyles();

        // Wrap whatever the author put inside us in a real <label>, once.
        // Implicit association (label wrapping control) needs no ids at all,
        // which is why it's preferred here over `for`.
        if (!this.#label) {
            this.#label = document.createElement('label');
            this.#label.className = 'pl-label__wrap';

            this.#text = document.createElement('span');
            this.#text.className = 'pl-label__text';

            const children = [...this.childNodes];
            this.#label.append(this.#text);

            // Connect the wrapper BEFORE moving anything into it. moveBefore()
            // is an atomic move, and it rejects a transfer between a connected
            // node and a detached parent ("invalid hierarchy") — so the label
            // has to be in the document first for the move to be legal.
            this.append(this.#label);

            // moveBefore() where available: it relocates nodes WITHOUT
            // disconnecting them, so a wrapped custom element keeps its state
            // and doesn't run disconnectedCallback/connectedCallback.
            for (const child of children) {
                if (this.#label.moveBefore) this.#label.moveBefore(child, null);
                else this.#label.append(child);
            }

            // Clicking the label text should focus the control even when that
            // control keeps its <input> in a shadow root. delegatesFocus on
            // the control makes .focus() land on the real input inside it.
            this.#label.addEventListener('click', event => {
                if (event.target !== this.#label && event.target !== this.#text) return;
                this.#control()?.focus?.();
            });
        }

        super.connectedCallback();
    }

    /** The first focusable thing we wrap — custom element or native control. */
    #control() {
        return this.#label?.querySelector(
            'input, select, textarea, button, [tabindex], [contenteditable="true"], *[is], :is(pl-input, pl-select, pl-textarea, pl-checkbox, pl-switch, pl-radio, pl-search)'
        );
    }

    render() {
        if (!this.#label) return;

        const { text, hint, error, required } = this.props;

        // Label text, plus the required marker. aria-hidden on the asterisk —
        // `required` on the control is what actually conveys this to AT, so
        // announcing "star" on top of it is noise.
        this.#text.textContent = text ?? '';
        if (required) {
            const marker = document.createElement('span');
            marker.className = 'pl-label__required';
            marker.setAttribute('aria-hidden', 'true');
            marker.textContent = '*';
            this.#text.append(marker);
        }
        this.#text.hidden = !text;

        // A field cannot be wrong and verified at once, and error is the claim
        // with safety consequences, so it wins when an author sets both.
        const success = error ? null : this.props.success;

        this.#hint = this.#swap(this.#hint, hint, 'pl-label__hint');
        this.#error = this.#swap(this.#error, error, 'pl-label__error', 'assertive');
        // Polite, not assertive: "Verified" is good news, and good news can
        // wait for the screen reader to finish its sentence.
        this.#success = this.#swap(this.#success, success, 'pl-label__success', 'polite');

        // Point the control at whichever messages exist. This is the id-based
        // relationship that a shadow boundary would silently break.
        const control = this.#control();
        if (control) {
            const describedBy = [this.#hint?.id, this.#error?.id, this.#success?.id].filter(Boolean).join(' ');
            if (describedBy) control.setAttribute('aria-describedby', describedBy);
            else control.removeAttribute('aria-describedby');

            control.toggleAttribute('required', required);
            control.toggleAttribute('disabled', this.props.disabled);
            if (error) control.setAttribute('aria-invalid', 'true');
            else control.removeAttribute('aria-invalid');
            // ARIA has no "valid" state — aria-invalid="false" just means "not
            // wrong", which every untouched field already is. So the success
            // CHROME rides a data attribute the field styles can see, while the
            // MESSAGE above carries the news to assistive tech.
            control.toggleAttribute('data-success', Boolean(success));
        }
    }

    /** Create, update, or remove one message element. */
    #swap(node, value, className, live) {
        if (!value) {
            node?.remove();
            return null;
        }
        if (!node) {
            node = document.createElement('span');
            node.className = className;
            node.id = `${className}-${++uid}`;
            if (live) node.setAttribute('aria-live', live);
            this.append(node);
        }
        node.textContent = value;
        return node;
    }
}

define(tagName, Label);
