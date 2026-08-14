// ------------------------------
// createNativeElement — base-element factory
// ------------------------------
// Builds a base class that bridges a custom element to a real native element
// (given by `tag`) living in its shadow root — mimicking a "customized built-in"
// (`<button is="…">`) without relying on it (Safari doesn't support those). All
// native attribute reflection, property delegation, and method forwarding come
// from htmlElementSpec, so extending native support = updating the SPEC, and
// adding a new base element = one call here. Behavior only, no styling.
//
// Implementation components EXTEND the produced class, overriding `static
// template` (their own markup, which must contain a <tag>) and `static styles`
// (a CSSStyleSheet), adding their own `static props` + a `render()` for
// custom, non-native hooks — inheriting the full native surface for free.
//
// Two declaration surfaces, both typed (see component-authoring-guide.md §3):
//   static props  — attribute-backed. The ATTRIBUTE is canonical; the value
//                   reflects both ways and lives at `this.props.<name>`.
//   static state  — JS-only. No attribute, no reflection; `this.state.<name>`.
// Native attributes inherited from the spec are tagged `native: true` and are
// reached through direct delegation (`this.disabled`), not `this.props`.

import { elementSpecFor, mergedSpecFor } from './htmlElementSpec.mjs';
import { buildProps, buildState, syncAttribute, typeTagOf } from './props.mjs';

// Void elements have no children/slot (input, img, …).
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

// Standard events that DON'T cross a shadow boundary (composed: false). When the
// internal element fires one, the base re-dispatches a composed clone on the
// host so outside listeners see it — matching how the native element behaves in
// the light DOM. (input/beforeinput/composition* already compose, so aren't here.)
// Resource events (load/error) are in this list too — they're composed: false
// like the rest, so `<img>`'s load would otherwise never reach a host listener.
// Only elements whose spec `events` name them get a shim, so listing them here
// costs the other primitives nothing.
const NON_COMPOSED_EVENTS = new Set([
    'change', 'invalid', 'select', 'reset', 'submit', 'toggle', 'load', 'error',
]);

// The JS property for a spec entry (spec `prop` when the name differs).
const propOf = entry => entry.prop ?? entry.name;

// Elements that carry a submittable value — the ones worth making
// form-associated so their value survives the shadow boundary.
const FORM_CONTROLS = new Set(['input', 'textarea', 'select']);

// ValidityState → the plain flags dict setValidity() wants. Copying the flags
// (rather than passing the live ValidityState) keeps it a serialisable snapshot.
const VALIDITY_FLAGS = [
    'valueMissing', 'typeMismatch', 'patternMismatch', 'tooLong', 'tooShort',
    'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput', 'customError',
];
const flagsFrom = validity => Object.fromEntries(VALIDITY_FLAGS.map(flag => [flag, validity[flag]]));

// Walk a native element's prototype chain for a property's descriptor, so we can
// mirror its writability (many native props — relList, validity, list, form,
// options — are read-only; a delegated setter for those would throw on use).
function nativeDescriptor(tag, key) {
    let proto = Object.getPrototypeOf(document.createElement(tag));
    while (proto) {
        const descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor) return descriptor;
        proto = Object.getPrototypeOf(proto);
    }
    return null;
}

export function createNativeElement(tag) {
    const local = elementSpecFor(tag);
    const merged = mergedSpecFor(tag);

    // Attributes to mirror onto the internal element: the element's own
    // (reflected + attribute-only). Global attrs (class/id/tabindex…) belong on
    // the host, not the internal element, so they're excluded.
    const reflectAttrs = [...local.reflected, ...local.attributes];
    // Properties to delegate: the element's own reflected + prop-only.
    const delegateProps = [...local.reflected, ...local.properties];
    // Methods to forward: interaction methods (global) + element methods, minus
    // `animate` (the host animates itself).
    const forwardMethods = merged.methods.filter(name => name !== 'animate');

    // The element's events that won't cross the shadow boundary on their own.
    const reEmitEvents = local.events.filter(type => NON_COMPOSED_EVENTS.has(type));

    // The native attribute surface as our declaration shape, so an
    // implementation's `static props` inherits it via spread. `native: true`
    // marks these as delegation-backed: they reflect to the internal element but
    // get no `this.props.*` slot, because `this.disabled` already reaches the
    // real element. Author-declared props carry no such flag — which is exactly
    // why authors write `{ type: Boolean }` and nothing more.
    const nativeProps = Object.freeze(Object.fromEntries(
        local.reflected.map(({ name, type, options }) => [name, Object.freeze({ type, native: true, ...(options ? { options } : {}) })])
    ));

    const defaultTemplate = document.createElement('template');
    defaultTemplate.innerHTML = VOID.has(tag)
        ? `<${tag} part="${tag}">`
        : `<${tag} part="${tag}"><slot></slot></${tag}>`;

    class NativeElement extends HTMLElement {
        static template = defaultTemplate;
        static styles = null;
        // On by default here: this element's whole purpose is to stand in for a
        // real <button>/<input>, so an outside .focus() — or a wrapping
        // <pl-label> — must land on the native element inside the shadow root.
        static delegatesFocus = true;
        // Form controls submit through the shadow boundary via ElementInternals.
        // Buttons and anchors carry no submittable value, so they stay out.
        static formAssociated = FORM_CONTROLS.has(tag);
        static props = nativeProps;     // attribute-backed, typed, reflected
        static state = {};              // JS-only typed values (no attribute)

        #store = {};                    // backing store for props + state
        #internals = null;              // ElementInternals, when form-associated

        static get observedAttributes() {
            return Object.keys(this.props);
        }

        constructor() {
            super();
            this.attachShadow({ mode: 'open', delegatesFocus: this.constructor.delegatesFocus });
            this.shadowRoot.append(this.constructor.template.content.cloneNode(true));
            if (this.constructor.styles) {
                this.shadowRoot.adoptedStyleSheets = [this.constructor.styles];
            }

            // Re-emit non-composed native events on the host (see above).
            const native = this.native;
            for (const type of reEmitEvents) {
                native?.addEventListener(type, event => {
                    this.dispatchEvent(new Event(type, {
                        bubbles: event.bubbles,
                        cancelable: event.cancelable,
                        composed: true,
                    }));
                });
            }

            // Typed values, collision-safe under this.props.* / this.state.*.
            // Native attributes are skipped: `this.disabled` already reaches
            // the internal element by delegation, so they need no props slot.
            this.props = buildProps(this, this.#store, this.constructor.props, config => config.native);
            this.state = buildState(this, this.#store, this.constructor.state);

            // Form-associated controls forward the real control's value and
            // validity to the page's <form>, which can't see into the shadow.
            if (this.constructor.formAssociated && this.attachInternals) {
                this.#internals = this.attachInternals();
                for (const type of ['input', 'change']) {
                    native?.addEventListener(type, () => this.#syncForm());
                }
            }
        }

        // Mirror the internal control's value + validity onto the form.
        #syncForm() {
            const el = this.native;
            if (!el || !this.#internals) return;

            // A checkbox/radio submits its value only when checked (absent = no
            // entry), matching native form serialisation. Everything else
            // submits its value string.
            if (el.type === 'checkbox' || el.type === 'radio') {
                this.#internals.setFormValue(el.checked ? (el.value || 'on') : null);
            } else {
                this.#internals.setFormValue(el.value);
            }

            if (el.validity.valid) {
                this.#internals.setValidity({});
            } else {
                this.#internals.setValidity(flagsFrom(el.validity), el.validationMessage, el);
            }
        }

        // The internal native element everything bridges to.
        get native() {
            return this.shadowRoot.querySelector(tag);
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) return;
            this.#reflectNative();
            // Author-declared attributes flow into their typed prop (the
            // attribute stays canonical). Native ones need no store slot.
            const config = this.constructor.props?.[name];
            if (config && !config.native) {
                syncAttribute(this, this.#store, config, name, newValue);
            }
            this.render();
        }

        connectedCallback() {
            this.#reflectNative();
            this.render();
            if (this.constructor.formAssociated) this.#syncForm();
        }

        // Form lifecycle — the browser calls these on form-associated elements.
        formResetCallback() {
            const el = this.native;
            if (!el) return;
            if (el.type === 'checkbox' || el.type === 'radio') el.checked = el.defaultChecked;
            else el.value = el.defaultValue;
            this.#syncForm();
            this.render();
        }

        formDisabledCallback(disabled) {
            const el = this.native;
            if (el) el.disabled = disabled;
        }

        formStateRestoreCallback(state) {
            const el = this.native;
            if (!el) return;
            if (el.type === 'checkbox' || el.type === 'radio') el.checked = state != null;
            else el.value = state ?? '';
            this.#syncForm();
            this.render();
        }

        // Public re-sync — a group controller (a radio unchecking its peers)
        // changes a control programmatically and must refresh its form value.
        // No-op on non-form elements.
        syncForm() { this.#syncForm(); }

        // Implementation hook — override for custom (non-native) props.
        render() {}

        // Mirror the host's native attributes onto the internal element.
        #reflectNative() {
            const el = this.native;
            if (!el) return;
            for (const { name, type } of reflectAttrs) {
                if (typeTagOf(type) === 'boolean') {
                    el.toggleAttribute(name, this.hasAttribute(name));
                } else if (this.hasAttribute(name)) {
                    el.setAttribute(name, this.getAttribute(name));
                } else {
                    el.removeAttribute(name);
                }
            }
            // Bridged author attributes: forward the host's attribute onto the
            // internal element so its presentation can respond directly
            // (`button[size="sm"]`) — declared per-prop via `bridge: true`.
            for (const [name, config] of Object.entries(this.constructor.props ?? {})) {
                if (!config?.bridge) continue;
                if (typeTagOf(config.type) === 'boolean') el.toggleAttribute(name, this.hasAttribute(name));
                else if (this.hasAttribute(name)) el.setAttribute(name, this.getAttribute(name));
                else el.removeAttribute(name);
            }
        }
    }

    // Tag-named alias (this.button / this.input) reading the internal element.
    if (!(tag in NativeElement.prototype)) {
        Object.defineProperty(NativeElement.prototype, tag, {
            configurable: true,
            get() { return this.native; },
        });
    }

    // Native property accessors delegated to the internal element — a setter
    // only when the native prop is actually writable (keeps read-only props like
    // validity/relList/list read-only, matching native semantics).
    for (const entry of delegateProps) {
        const key = propOf(entry);
        if (key in NativeElement.prototype) continue; // never clobber a real member
        const descriptor = nativeDescriptor(tag, key);
        const writable = !descriptor || Boolean(descriptor.set) || descriptor.writable === true;
        Object.defineProperty(NativeElement.prototype, key, {
            configurable: true,
            get() { return this.native?.[key]; },
            ...(writable ? { set(value) { if (this.native) this.native[key] = value; } } : {}),
        });
    }

    // Native methods forwarded to the internal element.
    for (const method of forwardMethods) {
        NativeElement.prototype[method] = function (...args) {
            return this.native?.[method]?.(...args);
        };
    }

    return NativeElement;
}
