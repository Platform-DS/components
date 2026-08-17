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
    // Media events are the same story: none of them bubble or compose, so a
    // listener on <pl-video> would never hear the <video> inside it.
    'play', 'pause', 'ended', 'timeupdate', 'loadedmetadata', 'volumechange',
]);

// The JS property for a spec entry (spec `prop` when the name differs).
const propOf = entry => entry.prop ?? entry.name;

// ------------------------------
// Form participation
// ------------------------------
// A form only ever collects controls from its OWN tree, so a native element in
// a shadow root is invisible to the page's <form> no matter how faithfully its
// attributes are reflected. ElementInternals is the one sanctioned way back in,
// and it covers TWO separate things that are easy to conflate:
//
//   value      — what gets submitted. Only some elements have one.
//   activation — submitting or resetting the form. A button has no value worth
//                submitting, but pressing it is the whole point of it.
//
// Bridging only the first is why <pl-button type="submit"> sat in a form and
// did nothing: it was correctly reflected, correctly rendered, and not part of
// the form at all.
const FORM_VALUE = new Set(['input', 'textarea', 'select']);
const FORM_ASSOCIATED = new Set([...FORM_VALUE, 'button']);

// Types whose activation behavior acts on the owning form. <button> defaults
// to submit; an <input> has to say so.
const ACTIVATION = new Set(['submit', 'reset']);

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
    // Properties to delegate: the element's own reflected + prop-only. IDREF
    // entries are excluded — they name a RELATIONSHIP rather than carry a
    // value, and are resolved against the host's tree instead (see
    // #bridgeInvokers). Delegating them would hand the internal element an id
    // that means nothing where it lands.
    const delegateProps = [...local.reflected.filter(entry => !entry.idref), ...local.properties];

    // Invoker relationships this element supports, per the spec table.
    const attrNames = new Set(reflectAttrs.map(entry => entry.name));
    const hasPopoverTarget = attrNames.has('popovertarget');
    const hasCommand = attrNames.has('command');
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
        // Form participation through the shadow boundary, via ElementInternals:
        // a value for the controls that have one, and form activation for the
        // button. Anchors have neither, so they stay out.
        static formAssociated = FORM_ASSOCIATED.has(tag);
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

            // The internal element's click reaches the host composed, so one
            // listener covers both activation and command invocation.
            if (FORM_ASSOCIATED.has(tag) || hasCommand) {
                this.addEventListener('click', event => {
                    if (this.native?.disabled) return;
                    this.#forwardActivation(event);
                    this.#activate();
                    this.#invoke();
                });
            }
        }

        /**
         * The labels pointing at this control, as a native input exposes them.
         *
         * ElementInternals knows the answer — the association already works,
         * which is why `label.control` resolves here — but it lives on a private
         * field. Surfacing it keeps `el.labels` meaning the same thing on
         * <pl-radio> as on <input>, which is the whole contract of these
         * primitives.
         */
        get labels() {
            return this.#internals?.labels ?? null;
        }

        /**
         * Run the native control's activation when the click came from OUTSIDE
         * the shadow root.
         *
         * A form-associated custom element is labelable — a wrapping <pl-label>
         * resolves to this host, and `label.control` proves it. What the host
         * does NOT have is activation behavior: the browser dispatches the
         * label's synthetic click at the host and then has nothing to run, so
         * clicking "Remember me" moved focus and left the checkbox unchecked.
         * That is the one part of a native control that ElementInternals does
         * not hand you, and it has to be forwarded by hand.
         *
         * `composedPath()[0] !== this` is the whole discriminator. A click that
         * originated anywhere real — the internal input, the styled box, slotted
         * label text — has that node at the head of the path, and the platform
         * has already done the work. Only a click dispatched AT the host itself
         * (an outer <label>, or `el.click()`) arrives with the host in front,
         * and only that one needs forwarding. Without the check the internal
         * <label> and this method would both fire, and a checkbox would toggle
         * twice to nowhere.
         */
        #forwardActivation(event) {
            if (event.composedPath()[0] !== this) return;

            const native = this.native;
            if (!native || native === this) return;

            // Guarded above, so this cannot recurse: the click it dispatches
            // arrives with `native` at the head of the path, not the host.
            native.click();
        }

        /**
         * Submit or reset the owning form.
         *
         * The internal element cannot do this itself: it is not in the form's
         * tree, so it is not the form's submit button and its activation
         * behaviour has nothing to act on. The HOST is in that tree, and
         * ElementInternals hands us the form it belongs to — including when the
         * host uses a `form="…"` attribute to point somewhere else.
         *
         * requestSubmit() rather than submit(): it runs validation and fires a
         * cancellable `submit` event, which is what listeners — and a
         * `method="dialog"` form closing its dialog — are waiting for.
         * submit() would skip both.
         *
         * One limitation worth stating: the form has no SUBMITTER element, so a
         * name/value pair on the button is not part of the submission.
         */
        #activate() {
            if (!FORM_ASSOCIATED.has(tag)) return;

            // <button> is a submit button unless told otherwise; <input> is not.
            const type = (this.getAttribute('type') ?? (tag === 'button' ? 'submit' : '')).toLowerCase();
            if (!ACTIVATION.has(type)) return;

            const form = this.#internals?.form;
            if (!form) return;

            // Called off the prototype, NOT as form.reset() / form.submit().
            // A form exposes its own controls as named properties, so a field
            // called "reset" or "submit" shadows the method of that name and
            // `form.reset()` throws with "not a function" — on a form that is
            // otherwise perfectly ordinary. A native button never trips over
            // this because it activates the form internally rather than
            // through the IDL, and going via the prototype is how this reaches
            // the same method the browser would have.
            if (type === 'reset') HTMLFormElement.prototype.reset.call(form);
            else HTMLFormElement.prototype.requestSubmit.call(form);
        }

        /** The element an IDREF attribute on the HOST names, in the host's tree. */
        #lookup(name) {
            const id = this.getAttribute(name);
            return id ? (this.getRootNode().getElementById?.(id) ?? null) : null;
        }

        /**
         * Popover and command targets are IDREFs, and an id is resolved against
         * the tree the element is IN — for the internal element that is this
         * shadow root, where the author's dialog or popover does not exist. So
         * the attribute alone silently does nothing.
         *
         * The popover half has a native way through: popoverTargetElement is the
         * same relationship expressed as an element reference, and a reference
         * crosses a shadow boundary perfectly well. Everything after that — top
         * layer, light dismiss, focus return — is still the browser's.
         */
        #bridgeInvokers() {
            const el = this.native;
            if (!el || !hasPopoverTarget) return;

            const target = this.#lookup('popovertarget');
            // Only touched when there is something to say, so an element that
            // is not an invoker is left exactly as the platform made it.
            if (target || el.popoverTargetElement) el.popoverTargetElement = target;
            if (this.hasAttribute('popovertargetaction')) {
                el.popoverTargetAction = this.getAttribute('popovertargetaction');
            }
        }

        /**
         * Commands have no equivalent escape hatch: commandForElement exists,
         * but invoking still requires invoker and target to share a tree, so
         * assigning it changes nothing. This is the one relationship the
         * platform genuinely cannot express across the boundary, so it is the
         * one bridged by hand — and the bridge stays thin, calling the SAME
         * native method the browser would have called.
         */
        #invoke() {
            if (!hasCommand) return;

            const command = this.getAttribute('command');
            const target = this.#lookup('commandfor');
            if (!command || !target) return;

            switch (command) {
                case 'show-modal': target.showModal?.(); break;
                case 'close': target.close?.(); break;
                case 'request-close': (target.requestClose ?? target.close)?.call(target); break;
                case 'show-popover': target.showPopover?.(); break;
                case 'hide-popover': target.hidePopover?.(); break;
                case 'toggle-popover': target.togglePopover?.(); break;
                default:
                    // Author-defined commands start with "--" and the platform
                    // delivers them as a CommandEvent, so this does too rather
                    // than inventing a different channel.
                    if (command.startsWith('--') && globalThis.CommandEvent) {
                        target.dispatchEvent(new CommandEvent('command', { command, source: this, bubbles: false }));
                    }
            }
        }

        // Mirror the internal control's value + validity onto the form.
        #syncForm() {
            const el = this.native;
            if (!el || !this.#internals) return;
            // Form-associated for activation only — a button has no value the
            // form should be collecting, and setting one would submit it on
            // every request rather than only when the button was pressed.
            if (!FORM_VALUE.has(tag)) return;

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
            // A button is form-associated for activation only. It has no
            // defaultValue, so restoring one would assign undefined and leave
            // the literal string "undefined" behind.
            if (!el || !FORM_VALUE.has(tag)) return;
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
            if (!el || !FORM_VALUE.has(tag)) return;
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

            this.#bridgeInvokers();
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
            ...(writable ? {
                set(value) {
                    if (!this.native) return;
                    this.native[key] = value;
                    // Repaint. A delegated property is a real state change that
                    // never touches an attribute, so attributeChangedCallback
                    // never fires and render() would otherwise never run: a
                    // component drawing anything DERIVED from a native value —
                    // pl-meter's gradient is computed from value/min/max — went
                    // stale the moment an app wrote `el.value = x` instead of
                    // setting the attribute. The browser redraws its own
                    // internals either way; this is for everything around them.
                    this.render?.();
                },
            } : {}),
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
