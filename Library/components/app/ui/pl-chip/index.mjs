// ------------------------------
// Chip Component
// ------------------------------
// A rounded, bordered pill around slotted text — the unit a sort selection or
// a multi-select's chosen options render as. No native element to bridge (a
// chip isn't a variant of anything the platform already has), so this EXTENDS
// BaseElement rather than a *Element primitive, the same way pl-icon does.
//
//   <pl-chip removable value="us">United States</pl-chip>
//
// ------------------------------
// Removing is the consumer's job, not this component's
// ------------------------------
// The × is a real <button> — focusable, Space/Enter-activatable, announced as
// a button — but carries none of pl-button's chrome; see _styles.mjs. Clicking
// it does not remove the chip: it only emits `pl-remove` and leaves the chip
// exactly where it was. Removing it from the DOM (or the array behind it) is
// state, and this library's rule is events up, state down — the same reason
// pl-switch doesn't grey itself out and pl-radio-group doesn't delete
// options. The consumer's `pl-remove` handler is where the chip actually
// disappears, by no longer being rendered.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-chip';

// Shadow DOM
export class Chip extends BaseElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <span part="label" class="label"><slot></slot></span>
            <button part="remove" type="button" class="remove" hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                    <path stroke-linecap="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        `;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    static props = {
        // The chip's identity for the remove event, when its visible text
        // isn't a good enough one on its own (e.g. a code behind a display
        // name) — falls back to the text itself; see the value getter below.
        value:     { type: String },
        removable: { type: Boolean, default: false },
    };

    constructor() {
        super();

        this.refs = {
            remove: this.shadowRoot.querySelector('.remove'),
        };

        this.refs.remove.addEventListener('click', () => {
            this.emit('pl-remove', { value: this.value });
        });
    }

    render() {
        const { remove } = this.refs ?? {};
        if (!remove) return;

        remove.hidden = !this.props.removable;
        // Distinguishes "Remove" buttons from one another when a screen
        // reader user is browsing several chips in a row — see the header
        // comment on why aria-label rather than visible button text.
        remove.setAttribute('aria-label', `Remove ${this.#label()}`);
    }

    /** The chip's own slotted text, trimmed — used as a fallback identity and name. */
    #label() {
        return this.textContent.trim() || 'item';
    }

    /** The identity carried in `pl-remove` — the explicit value, or the visible text. */
    get value() { return this.props.value || this.#label(); }
    set value(v) { this.props.value = v; }
}

define(tagName, Chip);
