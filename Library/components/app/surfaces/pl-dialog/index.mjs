// ------------------------------
// Dialog Component — LIGHT DOM
// ------------------------------
// A styled wrapper around a REAL <dialog>. Everything that makes a dialog a
// dialog — the top layer, the backdrop, the focus trap, Escape to close,
// inertness of the page behind it — is the browser's, not ours.
//
//   <button command="show-modal" commandfor="confirm">Delete…</button>
//
//   <pl-dialog id="confirm" data-dismissable closedby="any">
//     <h2 data-title>Delete this project?</h2>
//     <p>This cannot be undone.</p>
//     <div data-actions>
//       <form method="dialog"><pl-button variant="secondary">Cancel</pl-button></form>
//       <pl-button variant="danger">Delete</pl-button>
//     </div>
//   </pl-dialog>
//
// Note there is no JavaScript in that example. Opening is `command`/
// `commandfor`, closing is `<form method="dialog">` — both native, both
// declarative, both working with the script for this component never having
// run beyond building the markup.
//
// ------------------------------
// The id moves to the <dialog>
// ------------------------------
// `commandfor` resolves an id and then checks the element it found is really a
// <dialog>; pointed at a custom element it does nothing at all, and no event
// is fired for a built-in command. So for the declarative syntax above to work,
// the id has to be ON the dialog.
//
// Rather than invent a second id attribute, the `id` you write on <pl-dialog>
// is MOVED to the <dialog> it builds. The practical consequence is that
// `document.getElementById('confirm')` returns the <dialog> — which is the
// thing you'd want anyway, since `.showModal()` and `.close()` live there.
// Select the wrapper by tag or class if you need it; it also forwards those
// methods, so either handle works.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-dialog';

// Attributes that belong on the <dialog> rather than the wrapper. `closedby`
// is the native light-dismiss control: "any" closes on an outside click,
// "closerequest" on Escape only, "none" neither.
const DIALOG_ATTRS = ['closedby'];

let uid = 0;

// Light DOM
export class Dialog extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return [...DIALOG_ATTRS, 'data-dismissable'];
    }

    #dialog = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#dialog) this.#build();

        super.connectedCallback();
    }

    #build() {
        const id = ++uid;

        this.#dialog = document.createElement('dialog');
        this.#dialog.className = 'pl-dialog__dialog';

        // See the header — the wrapper hands its id over so `commandfor` has a
        // real <dialog> to resolve.
        if (this.id) {
            this.#dialog.id = this.id;
            this.removeAttribute('id');
        }

        // Connect first: moveBefore is an atomic move and rejects a transfer
        // into a detached parent.
        const children = [...this.childNodes];
        this.append(this.#dialog);
        for (const node of children) {
            if (this.#dialog.moveBefore) this.#dialog.moveBefore(node, null);
            else this.#dialog.append(node);
        }

        // Name the dialog from its own heading rather than duplicating the
        // text into an aria-label that could drift out of step with it.
        const title = this.#dialog.querySelector(':scope > [data-title]');
        if (title) {
            title.id ||= `pl-dialog-title-${id}`;
            this.#dialog.setAttribute('aria-labelledby', title.id);
        }

        // Re-emit as composed events so a listener on <pl-dialog> — or
        // anywhere above it — sees them. `close` and `cancel` do not cross a
        // boundary on their own, and `cancel` is cancellable, so it is
        // forwarded rather than cloned: preventing the copy would otherwise
        // silently fail to stop the close.
        this.#dialog.addEventListener('close', () => this.emit('pl-close', { returnValue: this.#dialog.returnValue }));
        this.#dialog.addEventListener('cancel', event => {
            if (!this.emit('pl-cancel', {}, { cancelable: true }).defaultPrevented) return;
            event.preventDefault();
        });
    }

    /**
     * The dismiss button is a submit button in a `<form method="dialog">`,
     * which closes the dialog with no script and — unlike `command="close"` —
     * without needing an id to point at.
     */
    #ensureDismiss() {
        let form = this.#dialog.querySelector(':scope > .pl-dialog__dismiss');

        if (!('dismissable' in this.dataset)) {
            form?.remove();
            return;
        }
        if (form) return;

        form = document.createElement('form');
        form.method = 'dialog';
        form.className = 'pl-dialog__dismiss';

        const button = document.createElement('button');
        button.type = 'submit';
        button.setAttribute('aria-label', 'Close dialog');
        button.innerHTML = /*html*/`
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                <path stroke-linecap="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        `;

        form.append(button);
        this.#dialog.prepend(form);
    }

    render() {
        if (!this.#dialog) return;

        for (const name of DIALOG_ATTRS) {
            if (this.hasAttribute(name)) this.#dialog.setAttribute(name, this.getAttribute(name));
            else this.#dialog.removeAttribute(name);
        }

        this.#ensureDismiss();
    }

    /** The real <dialog>, which is where the native API lives. */
    get dialog() { return this.#dialog; }

    get open() { return this.#dialog?.open ?? false; }

    get returnValue() { return this.#dialog?.returnValue; }

    // Forwarded so the wrapper is a usable handle too, for the times you have
    // the element rather than its id.
    showModal() { this.#dialog?.showModal(); }
    show() { this.#dialog?.show(); }
    close(returnValue) { this.#dialog?.close(returnValue); }
}

define(tagName, Dialog);
