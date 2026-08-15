// ------------------------------
// Form Component — LIGHT DOM
// ------------------------------
// Literally a <form>, with layout. It builds a real form element and moves the
// author's fields into it, which is the whole reason this is Light DOM: a form
// in a shadow root cannot see controls in the page, and controls in the page
// cannot see it. Keeping both in the same tree means submission, validation,
// reset, and Enter-to-submit are the platform's, not a re-implementation.
//
//   <pl-form action="/subscribe" method="post" data-variant="card">
//     <pl-label text="Email"><pl-input type="email" name="email" required></pl-input></pl-label>
//     <div data-actions data-align="end">
//       <pl-button type="submit">Subscribe</pl-button>
//     </div>
//   </pl-form>
//
// The submit/reset/invalid events come from the real form and bubble normally,
// so listen on <pl-form> exactly as you would on a <form>.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-form';

// Attributes that belong on the <form> itself rather than the wrapper.
const FORM_ATTRS = ['action', 'method', 'enctype', 'target', 'novalidate', 'autocomplete', 'name', 'accept-charset'];

// Light DOM
export class Form extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return FORM_ATTRS;
    }

    #form = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#form) {
            this.#form = document.createElement('form');

            // Connect the form BEFORE moving anything into it: moveBefore() is
            // an atomic move and rejects a transfer into a detached parent.
            const children = [...this.childNodes];
            this.append(this.#form);

            for (const child of children) {
                // moveBefore keeps a already-upgraded field's state intact
                // instead of disconnecting and re-connecting it.
                if (this.#form.moveBefore) this.#form.moveBefore(child, null);
                else this.#form.append(child);
            }
        }

        super.connectedCallback();
    }

    /** The real <form>, for imperative use: el.form.requestSubmit(). */
    get form() {
        return this.#form;
    }

    /** Mirror the form-level attributes onto the element that acts on them. */
    render() {
        if (!this.#form) return;

        for (const name of FORM_ATTRS) {
            if (this.hasAttribute(name)) this.#form.setAttribute(name, this.getAttribute(name));
            else this.#form.removeAttribute(name);
        }
    }

    // Convenience passthroughs — the form is the thing that actually submits.
    requestSubmit(submitter) { this.#form?.requestSubmit(submitter); }
    reset() { this.#form?.reset(); }
    checkValidity() { return this.#form?.checkValidity() ?? true; }
    reportValidity() { return this.#form?.reportValidity() ?? true; }
}

define(tagName, Form);
