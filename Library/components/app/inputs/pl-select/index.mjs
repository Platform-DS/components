// ------------------------------
// Select Component
// ------------------------------
// EXTENDS the SelectElement base primitive, inheriting the native <select>
// surface (value, selectedIndex, options, name, disabled, required, multiple,
// the change event) and — being form-associated — submitting its value with the
// surrounding <form>.
//
// A native <select> builds its list from real <option> children, not from a
// <slot>, so this component ADOPTS the author's light-DOM options into the
// internal <select> on connect (and watches for later additions). Write it
// exactly like a plain select:
//   <pl-select name="plan">
//     <option value="free">Free</option>
//     <option value="pro" selected>Pro</option>
//   </pl-select>

// Imports
import { SelectElement } from '../../../../_core/elements/SelectElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-select';

// Shadow DOM
export class Select extends SelectElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <div part="wrapper" class="wrapper">
                <select part="select"></select>
                <span class="arrow" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5"
                              stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
            </div>
        `;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    static props = { ...SelectElement.props };

    #observer = null;

    constructor() {
        super();
        this.refs = { select: this.shadowRoot.querySelector('select') };
    }

    connectedCallback() {
        // Base reflects attributes and syncs the (empty) form value first…
        super.connectedCallback();
        // …then the real options move in, and the value is re-synced.
        this.#adopt([...this.childNodes]);

        this.#observer ??= new MutationObserver(mutations => {
            let changed = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    this.#adopt([...mutation.addedNodes]);
                    changed = true;
                }
            }
            if (changed) this.syncForm();
        });
        this.#observer.observe(this, { childList: true });

        this.syncForm();
    }

    disconnectedCallback() {
        this.#observer?.disconnect();
    }

    /** Move author <option>/<optgroup> elements into the internal <select>. */
    #adopt(nodes) {
        for (const node of nodes) {
            // Elements only — whitespace text nodes between options are dropped
            // rather than moved into the select.
            if (node.nodeType === Node.ELEMENT_NODE) {
                this.refs.select.appendChild(node);
            }
        }
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Select);
}
