// ------------------------------
// Color Picker Component — LIGHT DOM
// ------------------------------
// A real <input type="color"> beside a real <input type="text">, wrapped in one
// border so they read as a single field. Light DOM, so both are genuine page
// controls: the swatch opens the OS colour picker, and the value submits with
// the surrounding <form> without any bridging.
//
//   <pl-color-picker name="brand" value="#2563EB"></pl-color-picker>
//
// ------------------------------
// Two-way binding, with events
// ------------------------------
// The two inputs are kept in step by listening to each other — no store, no
// observer, no framework. A shared state container would be real machinery for
// what is genuinely a pair of DOM nodes agreeing on one string.
//
// Only the COLOR input carries `name`, so the form receives one entry rather
// than two competing ones. The text field is a typed alias of the same value.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-color-picker';

const DEFAULT = '#000000';

/** #abc and #aabbcc, with or without the hash. */
const HEX = /^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Normalise any accepted spelling to the #RRGGBB an <input type="color"> needs. */
function normalize(raw) {
    if (!raw) return null;
    const value = raw.trim();
    if (!HEX.test(value)) return null;

    let hex = value.startsWith('#') ? value.slice(1) : value;
    // Expand the shorthand — #abc is #aabbcc.
    if (hex.length === 3) hex = [...hex].map(ch => ch + ch).join('');
    return `#${hex.toLowerCase()}`;
}

// Light DOM
export class ColorPicker extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return ['value', 'name', 'disabled', 'required', 'form'];
    }

    #swatch = null;
    #text = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#swatch) {
            const field = document.createElement('div');
            field.className = 'pl-color__field';

            this.#swatch = document.createElement('input');
            this.#swatch.type = 'color';
            this.#swatch.className = 'pl-color__swatch';

            this.#text = document.createElement('input');
            this.#text.type = 'text';
            this.#text.className = 'pl-color__text';
            this.#text.spellcheck = false;
            this.#text.autocapitalize = 'off';
            this.#text.setAttribute('autocomplete', 'off');
            this.#text.placeholder = '#000000';
            // The text field mirrors the swatch, so it needs its own name in
            // the accessibility tree — otherwise it is an unlabelled input.
            this.#text.setAttribute('aria-label', 'Hex colour value');
            // Reject nonsense before submit, using the same shape as normalize().
            this.#text.pattern = '#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})';

            field.append(this.#swatch, this.#text);
            this.append(field);

            // --- the binding, both directions ---

            // Dragging in the OS picker fires `input` continuously; keep the
            // text in step live rather than waiting for the dialog to close.
            this.#swatch.addEventListener('input', () => {
                this.#text.value = this.#swatch.value.toUpperCase();
                this.#commit(this.#swatch.value);
            });

            // Typing only propagates once it is a colour — otherwise a
            // half-typed "#2" would repeatedly reset the swatch to black.
            this.#text.addEventListener('input', () => {
                const hex = normalize(this.#text.value);
                if (!hex) return;
                this.#swatch.value = hex;
                this.#commit(hex);
            });

            // On blur, tidy what the user left behind: expand shorthand, add a
            // missing hash, or restore the last good value if it is unusable.
            this.#text.addEventListener('change', () => {
                const hex = normalize(this.#text.value);
                this.#text.value = (hex ?? this.#swatch.value).toUpperCase();
            });
        }

        super.connectedCallback();
    }

    /** Reflect to the host attribute and announce the change once. */
    #commit(hex) {
        this.setAttribute('value', hex);
        this.emit('pl-change', { value: hex });
    }

    render() {
        if (!this.#swatch) return;

        const hex = normalize(this.getAttribute('value')) ?? DEFAULT;
        this.#swatch.value = hex;
        // Don't fight the user mid-keystroke: only rewrite the text field when
        // it does not already mean this colour.
        if (normalize(this.#text.value) !== hex) this.#text.value = hex.toUpperCase();

        // The colour input is the one that submits.
        for (const name of ['name', 'form', 'required']) {
            if (this.hasAttribute(name)) this.#swatch.setAttribute(name, this.getAttribute(name));
            else this.#swatch.removeAttribute(name);
        }

        const disabled = this.hasAttribute('disabled');
        this.#swatch.disabled = disabled;
        this.#text.disabled = disabled;
    }

    /** The current colour, always #rrggbb. */
    get value() { return this.#swatch?.value ?? normalize(this.getAttribute('value')) ?? DEFAULT; }
    set value(v) {
        const hex = normalize(v);
        if (hex) this.setAttribute('value', hex);
    }

    get swatch() { return this.#swatch; }
    get textInput() { return this.#text; }

    focus(options) { this.#swatch?.focus(options); }
}

define(tagName, ColorPicker);
