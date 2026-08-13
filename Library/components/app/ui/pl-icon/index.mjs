// ------------------------------
// Icon Component
// ------------------------------
// Renders one <symbol> from the shared spritesheet (_spritesheet.mjs),
// injected into the document once on first use, then reused by every
// instance. Clones the symbol's own children into this component's local
// <svg> rather than referencing it via <use href="#...">, since a <use>
// inside a shadow root can't reliably resolve an id defined outside that
// shadow root across browsers — cloning sidesteps that entirely.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';
import { SPRITESHEET } from './_spritesheet.mjs';

// Component Settings
const tagName = 'pl-icon';

// Presentation attributes symbols declare on the wrapping <symbol> itself
// (fill="none" stroke="currentColor" ... for outline icons) — cloning only
// symbol.children (the <path>s) drops these, since they'd otherwise be
// inherited from the <symbol> as their DOM parent, which the clone no
// longer has. Copied onto this component's own <svg> instead so the cloned
// paths inherit them from their new parent.
const PRESENTATION_ATTRS = ['fill', 'stroke', 'stroke-width'];

let spritesheetInjected = false;

function ensureSpritesheet() {
    if (spritesheetInjected) return;
    spritesheetInjected = true;

    const template = document.createElement('template');
    template.innerHTML = SPRITESHEET;
    document.body.append(template.content.firstElementChild);
}

// Shadow DOM
export class Icon extends BaseElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <svg part="svg" aria-hidden="true" focusable="false"></svg>
        `;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    static props = {
        icon:  { type: String },
        size:  { type: String },
        color: { type: String },
        // An icon with a label is meaningful and gets announced; without one
        // it stays decorative and is hidden from assistive tech. Defaulting to
        // decorative is the safe direction — a redundant announcement next to
        // a visible text label is the more common accessibility bug.
        label: { type: String },
    };

    #svg;

    constructor() {
        super();
        ensureSpritesheet();
        this.#svg = this.root.querySelector('svg');
    }

    // Both consumption paths land here: the declarative one (<pl-icon icon="sun">)
    // through attributeChangedCallback, and the imperative one (el.props.icon =
    // 'sun') through the prop setter, which writes the attribute. One repaint path.
    render() {
        if (!this.#svg) return;

        this.#svg.replaceChildren();

        const { icon, label, size, color } = this.props;

        if (icon) {
            const symbol = document.getElementById(`icon-${icon}`);

            if (symbol) {
                this.#svg.setAttribute('viewBox', symbol.getAttribute('viewBox') ?? '0 0 24 24');

                for (const attr of PRESENTATION_ATTRS) {
                    const value = symbol.getAttribute(attr);
                    if (value) this.#svg.setAttribute(attr, value);
                    else this.#svg.removeAttribute(attr);
                }

                this.#svg.append(...[...symbol.children].map(child => child.cloneNode(true)));
            } else {
                console.error(`[${tagName}] unknown icon "${icon}"`);
            }
        }

        // Meaningful vs decorative — never both.
        if (label) {
            this.#svg.setAttribute('role', 'img');
            this.#svg.setAttribute('aria-label', label);
            this.#svg.removeAttribute('aria-hidden');
        } else {
            this.#svg.setAttribute('aria-hidden', 'true');
            this.#svg.removeAttribute('role');
            this.#svg.removeAttribute('aria-label');
        }

        this.style.setProperty('--_icon-width', size);
        this.style.setProperty('--_icon-height', size);
        this.style.setProperty('--_icon-color', color);
    }
}

define(tagName, Icon);
