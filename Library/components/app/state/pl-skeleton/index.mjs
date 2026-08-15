// ------------------------------
// Skeleton Component
// ------------------------------
// A grey placeholder in the shape of content that has not arrived.
//
//   <pl-skeleton></pl-skeleton>                    <!-- one line of text -->
//   <pl-skeleton lines="3"></pl-skeleton>          <!-- a paragraph -->
//   <pl-skeleton variant="circle" size="3rem"></pl-skeleton>
//   <pl-skeleton variant="rect" style="block-size: 12rem"></pl-skeleton>
//
// ------------------------------
// It says nothing, on purpose
// ------------------------------
// The host is aria-hidden. A skeleton is a picture of absent content, and
// announcing it would be announcing shapes — "image, image, image" — with no
// information in any of them.
//
// What SHOULD be announced is that the region is loading, and that belongs on
// the container being filled, not on each placeholder inside it: put
// `aria-busy="true"` on that container while it waits, and remove it when the
// real content lands. The docs page shows the pattern.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-skeleton';

// Shadow DOM
export class Skeleton extends BaseElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`<div part="bars" class="bars"></div>`;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    static props = {
        variant: { type: String, default: 'text', options: ['text', 'circle', 'rect'] },
        lines:   { type: Number, default: 1 },
        size:    { type: String },
    };

    constructor() {
        super();
        this.refs = { bars: this.shadowRoot.querySelector('.bars') };
    }

    render() {
        const { bars } = this.refs ?? {};
        if (!bars) return;

        // Purely decorative — see the header.
        this.setAttribute('aria-hidden', 'true');

        if (this.props.size) {
            this.style.setProperty('--skeleton-size', this.props.size);
        }

        // Only the text variant stacks; a circle or a rect is a single shape.
        const count = this.props.variant === 'text' ? Math.max(1, this.props.lines) : 1;
        if (bars.children.length === count) return;

        bars.replaceChildren();
        for (let i = 0; i < count; i++) {
            const bar = document.createElement('span');
            bar.className = 'bar';
            // The last line of a paragraph is short, which is what makes a
            // stack of bars read as text rather than as a table.
            if (count > 1 && i === count - 1) bar.classList.add('bar--last');
            bars.append(bar);
        }
    }
}

define(tagName, Skeleton);
