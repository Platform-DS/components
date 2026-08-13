// ------------------------------
// BaseElement — base for components that ARE their own markup
// ------------------------------
// The counterpart to createNativeElement. Use that one when a component wraps
// a real native element and wants its whole surface (<pl-button> -> <button>).
// Use this one when there's no single native element to bridge — an accordion,
// a hero section, a card.
//
// Supplies the same authoring model either way (see
// component-authoring-guide.md §3): `static props` (typed + reflected),
// `static state` (typed, JS-only), a derived `observedAttributes`, and one
// render() that is the only place that writes to the DOM.
//
// ------------------------------
// Shadow vs Light
// ------------------------------
// `static mode` picks the anatomy, and the choice is not cosmetic:
//
//   'open'  (default) — Shadow DOM. Style encapsulation and real <slot>s.
//                       Correct for APP components.
//   'light'           — no shadow root. The component's markup joins the
//                       page's DOM and cascade.
//
// Light DOM is the right answer more often than it looks. A shadow boundary
// breaks anything that needs to see across it:
//   - Form controls. A <label> in one root can't point at an <input> in
//     another, so wrapping an input in a label stops working. Form-associated
//     custom elements can paper over this, but a label that is simply light
//     DOM never has the problem.
//   - Document-wide relationships: aria-controls / aria-labelledby /
//     aria-describedby reference IDs, and an ID inside a shadow root is not
//     visible from outside it.
//   - Content that should be styled by the page, indexed by a crawler, or
//     translated by the browser.
//
// So: app components are Shadow by default; CONTENT components (sections,
// structure, pages) are Light, as are the app components whose whole job is to
// participate in a document-level relationship (pl-label).

import { buildProps, buildState, syncAttribute } from '../utilities/props.mjs';

export class BaseElement extends HTMLElement {
    static template = null;        // a <template> element
    static styles = null;          // a CSSStyleSheet (Shadow DOM only)
    static mode = 'open';          // 'open' | 'light'
    static delegatesFocus = false; // focus the first focusable node inside the shadow root
    static props = {};             // attribute-backed, typed, reflected
    static state = {};             // JS-only typed values

    #store = {};
    #rendered = false;

    static get observedAttributes() {
        return Object.keys(this.props);
    }

    constructor() {
        super();

        const { template, styles, mode, delegatesFocus } = this.constructor;

        if (mode !== 'light') {
            // delegatesFocus is what lets a light-DOM <label> (or a .focus()
            // from anywhere outside) reach the real control inside this shadow
            // root — see pl-label.
            this.attachShadow({ mode, delegatesFocus });
            if (styles) this.shadowRoot.adoptedStyleSheets = [styles];
            if (template) this.shadowRoot.append(template.content.cloneNode(true));
        }

        this.props = buildProps(this, this.#store, this.constructor.props);
        this.state = buildState(this, this.#store, this.constructor.state);
    }

    /**
     * Where this component's markup lives — the shadow root, or the element
     * itself in Light DOM. Query through this instead of `this.shadowRoot` so
     * a component reads the same in either mode.
     */
    get root() {
        return this.shadowRoot ?? this;
    }

    connectedCallback() {
        // Light DOM markup is stamped on CONNECT, not in the constructor: the
        // spec forbids a custom element constructor from adding children, and
        // doing it here also means any author-supplied light DOM content is
        // already parsed and available to read first.
        if (!this.#rendered && this.constructor.mode === 'light' && this.constructor.template) {
            this.append(this.constructor.template.content.cloneNode(true));
        }
        this.#rendered = true;
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        syncAttribute(this, this.#store, this.constructor.props[name], name, newValue);
        // Skip the paint until the element is connected — the constructor has
        // no children yet in Light DOM, and upgrading an element with
        // attributes already on it would otherwise render once per attribute.
        if (this.#rendered) this.render();
    }

    /** Load once, update forever. Override this. */
    render() {}

    /**
     * Emit a custom event that escapes the shadow boundary — the "events up"
     * half of the architecture's events-up / state-down rule.
     */
    emit(type, detail, options = {}) {
        const event = new CustomEvent(type, {
            detail,
            bubbles: true,
            composed: true,
            cancelable: false,
            ...options,
        });
        this.dispatchEvent(event);
        return event;
    }
}

/**
 * Register a component, guarded — importing the same module twice (directly
 * and through the barrel) must not throw on a duplicate definition.
 */
export function define(tagName, ElementClass) {
    if (!customElements.get(tagName)) {
        customElements.define(tagName, ElementClass);
    }
    return ElementClass;
}
