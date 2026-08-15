// ------------------------------
// Radio Group Component — LIGHT DOM
// ------------------------------
// Labels a set of pl-radio options and gives them the keyboard behaviour a
// native radio group has.
//
//   <pl-radio-group label="Plan" name="plan" value="pro">
//     <pl-radio value="free">Free</pl-radio>
//     <pl-radio value="pro">Pro</pl-radio>
//     <pl-radio value="team">Team</pl-radio>
//   </pl-radio-group>
//
// ------------------------------
// Why this component has to exist
// ------------------------------
// A browser groups radios that share a `name` because they share a document.
// Each pl-radio keeps its <input> in its own shadow root, so the browser sees
// several unrelated radios: arrow keys do nothing, and every option is its own
// tab stop instead of the group being one.
//
// So the group restores both halves of the native contract:
//   - ROVING TABINDEX — the group is a single tab stop. Only the selected
//     option (or the first, when none is) is reachable with Tab.
//   - ARROW KEYS — Up/Left and Down/Right move between options and select as
//     they go, wrapping at the ends; Home/End jump to first and last.
//
// `name` set here is applied to every option, so the author writes it once.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-radio-group';

let uid = 0;

// Light DOM
export class RadioGroup extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return ['label', 'data-hint', 'name', 'value', 'disabled'];
    }

    #label = null;
    #hint = null;
    #options = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#options) {
            this.#options = document.createElement('div');
            this.#options.className = 'pl-radio-group__options';

            // The radios move into their own wrapper so the label and hint can
            // sit outside the row when the options are horizontal.
            const children = [...this.childNodes];
            this.append(this.#options);
            for (const child of children) {
                if (this.#options.moveBefore) this.#options.moveBefore(child, null);
                else this.#options.append(child);
            }

            this.setAttribute('role', 'radiogroup');

            // Selecting an option updates the group's value and the roving stop.
            this.addEventListener('change', () => {
                const checked = this.#radios().find(r => r.checked);
                if (!checked) return;
                this.setAttribute('value', checked.value);
                this.#syncTabStops();
                this.emit('pl-change', { value: checked.value });
            });

            this.addEventListener('keydown', event => this.#onKeydown(event));
        }

        super.connectedCallback();
    }

    /** The options, in DOM order. */
    #radios() {
        return [...this.querySelectorAll(':scope pl-radio')];
    }

    #onKeydown(event) {
        const KEYS = {
            ArrowUp: -1, ArrowLeft: -1,
            ArrowDown: 1, ArrowRight: 1,
        };

        const radios = this.#radios().filter(r => !r.disabled);
        if (!radios.length) return;

        let next = null;

        if (event.key in KEYS) {
            const current = radios.findIndex(r => r.checked);
            const from = current === -1 ? 0 : current;
            // Wrap, as a native radio group does.
            next = radios[(from + KEYS[event.key] + radios.length) % radios.length];
        } else if (event.key === 'Home') {
            next = radios[0];
        } else if (event.key === 'End') {
            next = radios.at(-1);
        } else {
            return;
        }

        event.preventDefault();

        for (const radio of radios) {
            radio.checked = radio === next;
            // A programmatic `checked` never fires the internal input's own
            // change event, so the form value has to be refreshed by hand —
            // otherwise the radio looks selected but submits nothing.
            radio.syncForm?.();
        }

        // Selection follows focus, which is the native behaviour for radios.
        next.dispatchEvent(new Event('change', { bubbles: true }));
        next.focus();
    }

    /**
     * One tab stop for the whole group: the selected option, or the first when
     * nothing is selected yet. The real <input> lives in each radio's shadow
     * root, so tabindex has to be set on that, not on the host.
     */
    #syncTabStops() {
        const radios = this.#radios();
        const selected = radios.find(r => r.checked) ?? radios.find(r => !r.disabled);

        for (const radio of radios) {
            const input = radio.native;
            if (input) input.tabIndex = radio === selected ? 0 : -1;
        }
    }

    render() {
        if (!this.#options) return;

        // --- label and hint, created only when asked for ---
        const labelText = this.getAttribute('label');
        if (labelText && !this.#label) {
            this.#label = document.createElement('span');
            this.#label.className = 'pl-radio-group__label';
            this.#label.id = `pl-radio-group-${++uid}`;
            this.prepend(this.#label);
            // A radiogroup needs its own accessible name; point at the visible
            // label rather than duplicating the text into aria-label.
            this.setAttribute('aria-labelledby', this.#label.id);
        }
        if (this.#label) {
            this.#label.textContent = labelText ?? '';
            this.#label.hidden = !labelText;
        }

        const hintText = this.dataset.hint;
        if (hintText && !this.#hint) {
            this.#hint = document.createElement('span');
            this.#hint.className = 'pl-radio-group__hint';
            this.#hint.id = `pl-radio-group-hint-${uid}`;
            this.#options.before(this.#hint);
            this.setAttribute('aria-describedby', this.#hint.id);
        }
        if (this.#hint) {
            this.#hint.textContent = hintText ?? '';
            this.#hint.hidden = !hintText;
        }

        // --- push group-level state down to the options ---
        const name = this.getAttribute('name');
        const value = this.getAttribute('value');
        const disabled = this.hasAttribute('disabled');

        for (const radio of this.#radios()) {
            if (name) radio.setAttribute('name', name);
            if (disabled) radio.setAttribute('disabled', '');
            else if (this.hasAttribute('disabled') === false && radio.hasAttribute('disabled')) {
                // Leave an individually-disabled option alone.
            }
            if (value != null) {
                radio.checked = radio.value === value;
                // Setting `checked` in JS bypasses the internal input's change
                // event, which is what normally publishes the value to the
                // form — so push it through explicitly.
                radio.syncForm?.();
            }
            // Mirror to the host attribute so CSS (the card variant) can react.
            radio.toggleAttribute('checked', radio.checked);
        }

        this.#syncTabStops();
    }

    /** The selected option's value. */
    get value() { return this.getAttribute('value') ?? this.#radios().find(r => r.checked)?.value ?? ''; }
    set value(v) { this.setAttribute('value', v); }

    focus(options) {
        const radios = this.#radios();
        (radios.find(r => r.checked) ?? radios[0])?.focus(options);
    }
}

define(tagName, RadioGroup);
