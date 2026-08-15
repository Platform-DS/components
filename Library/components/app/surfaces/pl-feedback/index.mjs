// ------------------------------
// Feedback Component — LIGHT DOM
// ------------------------------
// An inline message about something that just happened, or is about to.
//
//   <pl-feedback data-intent="success" data-dismissable>
//     <p data-title>Saved</p>
//     <p>Your changes are live.</p>
//   </pl-feedback>
//
// ------------------------------
// role="status" by default, role="alert" only when asked
// ------------------------------
// Both announce, but they interrupt differently. `status` is a POLITE live
// region: it waits for a natural pause in whatever the screen reader is
// already saying. `alert` is ASSERTIVE — it cuts in immediately, throwing away
// what was mid-sentence.
//
// Interrupting is the right call for something genuinely urgent and the wrong
// call for "Saved", so it is opt-in via `intent="error"` or an explicit
// `role="alert"`, rather than the default that every message would inherit.
//
// One consequence worth knowing: a live region is only announced when its
// content CHANGES while it is in the document. A pl-feedback that is present
// in the HTML at page load is read as ordinary content — which is fine, since
// it was there before anyone started listening. To have a message announced,
// insert it (or change its text) in response to whatever it is reporting.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-feedback';

// Light DOM
export class Feedback extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return ['data-intent', 'data-dismissable'];
    }

    #dismiss = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }

    render() {
        // An author-set role always wins — this only supplies a default.
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', this.dataset.intent === 'error' ? 'alert' : 'status');
        }

        if ('dismissable' in this.dataset) this.#ensureDismiss();
        else { this.#dismiss?.remove(); this.#dismiss = null; }
    }

    #ensureDismiss() {
        if (this.#dismiss?.isConnected) return;

        this.#dismiss = document.createElement('button');
        this.#dismiss.type = 'button';
        this.#dismiss.className = 'pl-feedback__dismiss';
        this.#dismiss.setAttribute('aria-label', 'Dismiss message');
        this.#dismiss.innerHTML = /*html*/`
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                <path stroke-linecap="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        `;

        // Unlike pl-chip's ×, this one DOES remove its own element. A chip is
        // one of a set the page is rendering and has to stay in step with, so
        // the page owns that list; a feedback message is a self-contained
        // announcement with nothing behind it to keep in sync. The event still
        // fires first, and is cancellable for the cases where something does.
        this.#dismiss.addEventListener('click', () => {
            if (this.emit('pl-dismiss', {}, { cancelable: true }).defaultPrevented) return;
            this.remove();
        });

        this.append(this.#dismiss);
    }
}

define(tagName, Feedback);
