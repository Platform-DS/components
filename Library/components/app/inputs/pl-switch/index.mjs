// ------------------------------
// Switch Component — LIGHT DOM
// ------------------------------
// A track with a sliding knob, built on a real <input type="checkbox"> carrying
// role="switch". Light DOM, so the input is a genuine control in the page: it
// submits with the surrounding <form>, a <label> can reach it, and the keyboard
// behaviour is the platform's.
//
//   <pl-switch name="notifications" checked>Email notifications</pl-switch>
//
// ------------------------------
// Why a checkbox and not two radios
// ------------------------------
// A switch is ONE control with two states, which is exactly what
// role="switch" describes — the role is defined as a checkbox that is on or
// off, and it reports itself through aria-checked. Two radios would announce as
// "a group of two options, one selected", so a screen reader user would hear a
// radio group where a sighted user sees a single toggle. It would also change
// the submitted data: a checkbox submits its value only when on and nothing
// when off (the native "flag" shape a boolean setting wants), whereas a radio
// pair always submits one of two values.
//
// If what you actually want IS two labelled choices — "Light / Dark" rather
// than an on-off flag — that's a different control: use pl-radio-group, or
// pl-button-group for a segmented look.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-switch';

// Attributes that belong on the internal <input>.
const INPUT_ATTRS = ['name', 'value', 'checked', 'disabled', 'required', 'form', 'autocomplete'];

// Light DOM
export class Switch extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return INPUT_ATTRS;
    }

    #input = null;
    #track = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#input) {
            const wrap = document.createElement('label');
            wrap.className = 'pl-switch__wrap';

            this.#input = document.createElement('input');
            this.#input.type = 'checkbox';
            this.#input.className = 'pl-switch__input';
            // The role is what makes assistive tech announce "switch, on/off"
            // rather than "checkbox, checked". aria-checked is maintained by
            // the browser for a real checkbox, so there is nothing to sync.
            this.#input.setAttribute('role', 'switch');

            this.#track = document.createElement('span');
            this.#track.className = 'pl-switch__track';
            this.#track.setAttribute('aria-hidden', 'true');

            const label = document.createElement('span');
            label.className = 'pl-switch__label';

            // The author's label text moves inside the <label>, so clicking it
            // toggles the switch — implicit association, no ids involved.
            const children = [...this.childNodes];
            wrap.append(this.#input, this.#track, label);
            this.append(wrap);
            for (const child of children) {
                if (label.moveBefore) label.moveBefore(child, null);
                else label.append(child);
            }

            // Keep the host attribute in step with user interaction, so
            // `el.hasAttribute('checked')` reflects reality and CSS can target it.
            this.#input.addEventListener('change', () => {
                this.toggleAttribute('checked', this.#input.checked);
                this.emit('pl-change', { checked: this.#input.checked });
            });
        }

        super.connectedCallback();
    }

    render() {
        if (!this.#input) return;

        for (const name of INPUT_ATTRS) {
            if (name === 'checked') {
                // A property, not an attribute — setting the attribute alone
                // only changes the DEFAULT state, not the current one.
                this.#input.checked = this.hasAttribute('checked');
            } else if (this.hasAttribute(name)) {
                this.#input.setAttribute(name, this.getAttribute(name));
            } else {
                this.#input.removeAttribute(name);
            }
        }
    }

    /** Current state. Setting it reflects to the attribute and repaints. */
    get checked() { return this.#input?.checked ?? this.hasAttribute('checked'); }
    set checked(value) { this.toggleAttribute('checked', Boolean(value)); }

    get value() { return this.#input?.value ?? 'on'; }
    set value(v) { this.setAttribute('value', v); }

    /** The real control, for focus() and validation. */
    get input() { return this.#input; }

    focus(options) { this.#input?.focus(options); }
}

define(tagName, Switch);
