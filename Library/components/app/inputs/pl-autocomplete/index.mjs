// ------------------------------
// Autocomplete Component — LIGHT DOM
// ------------------------------
// A real <input> paired with a real <datalist>, wired together by `list`/`id`
// — the same pairing you'd hand-write, just assembled for you. Light DOM,
// because that pairing is a document-level relationship exactly like
// <label for>: the `list` attribute resolves its id in the input's own tree,
// so an input in one shadow root can never see a datalist in another. That
// also rules out building this on <pl-input> (its real <input> lives inside
// its own shadow root) — the visible field here is a plain <input>, styled
// to match it instead.
//
//   <pl-autocomplete name="fruit" placeholder="Choose a fruit…">
//     <option value="Apple"></option>
//     <option value="Banana"></option>
//     <option value="Cherry"></option>
//   </pl-autocomplete>
//
// The suggestion popup itself is entirely the browser's: no listbox, no
// filtering, no keyboard handling to reimplement. Options can also be set
// from JS with the `options` property, for a list that comes from data
// rather than markup:
//
//   el.options = ['Apple', 'Banana', 'Cherry'];

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-autocomplete';

// Attributes that belong on the internal <input>.
const INPUT_ATTRS = ['value', 'name', 'placeholder', 'disabled', 'required', 'form', 'autocomplete', 'type'];

let uid = 0;

// Light DOM
export class Autocomplete extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return INPUT_ATTRS;
    }

    #input = null;
    #datalist = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#input) {
            this.#input = document.createElement('input');
            this.#input.className = 'pl-autocomplete__input';
            this.#input.type = 'text';
            this.#input.id ||= `pl-autocomplete-input-${++uid}`;
            this.#input.setAttribute('list', `pl-autocomplete-list-${uid}`);

            this.#datalist = document.createElement('datalist');
            this.#datalist.id = `pl-autocomplete-list-${uid}`;

            // Any <option>s the author wrote are the datalist's — move them
            // in before appending, same as pl-form moves its fields: this
            // keeps an already-upgraded option's state rather than
            // disconnecting and re-connecting it (moot for plain <option>s
            // today, but the right default for anything moved in this library).
            const children = [...this.childNodes];
            this.append(this.#input, this.#datalist);
            for (const child of children) {
                if (this.#datalist.moveBefore) this.#datalist.moveBefore(child, null);
                else this.#datalist.append(child);
            }

            // The value attribute only seeds the initial value (matching a
            // real <input>, where `value` is the default and the live value
            // is a property) — keep the attribute in step so it stays
            // readable from the outside, e.g. `el.hasAttribute('value')`.
            this.#input.addEventListener('input', () => {
                this.setAttribute('value', this.#input.value);
            });
            this.#input.addEventListener('change', () => {
                this.emit('pl-change', { value: this.#input.value });
            });
        }

        super.connectedCallback();
    }

    render() {
        if (!this.#input) return;

        for (const name of INPUT_ATTRS) {
            if (this.hasAttribute(name)) this.#input.setAttribute(name, this.getAttribute(name));
            else this.#input.removeAttribute(name);
        }
    }

    /** Replace the suggestion list. Accepts plain strings or {value, label}. */
    set options(list) {
        this.#datalist?.replaceChildren(
            ...list.map(item => {
                const option = document.createElement('option');
                if (typeof item === 'string') {
                    option.value = item;
                } else {
                    option.value = item.value;
                    if (item.label) option.label = item.label;
                }
                return option;
            }),
        );
    }

    get options() {
        return [...(this.#datalist?.children ?? [])].map(o => o.value);
    }

    get value() { return this.#input?.value ?? this.getAttribute('value') ?? ''; }
    set value(v) { this.setAttribute('value', v); }

    /** The real controls, if you need them. */
    get input() { return this.#input; }
    get datalist() { return this.#datalist; }

    focus(options) { this.#input?.focus(options); }
}

define(tagName, Autocomplete);
