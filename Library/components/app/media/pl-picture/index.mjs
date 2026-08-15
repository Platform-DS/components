// ------------------------------
// Picture Component — LIGHT DOM
// ------------------------------
// A real <picture>: your <source>s and your <img>, wrapped in an element that
// gives them an aspect ratio and a fit.
//
//   <pl-picture ratio="16/9">
//     <source srcset="wide.avif" type="image/avif" media="(min-width: 40rem)">
//     <source srcset="wide.webp" type="image/webp">
//     <img src="wide.jpg" alt="A field at dawn">
//   </pl-picture>
//
// ------------------------------
// Light DOM, because <picture> only works on its own children
// ------------------------------
// A <picture> chooses a source by looking at its CHILD <source> elements. Slot
// them into a shadow root and they are not its children — they are somewhere
// else entirely, and the picture quietly falls back to the <img>'s own src,
// discarding the art direction and every modern format you offered.
//
// Staying in the page's DOM avoids that whole class of problem, and keeps the
// <img> where a crawler, the browser's own preload scanner, and `loading="lazy"`
// all expect to find it.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-picture';

// Light DOM
export class Picture extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return ['ratio', 'fit'];
    }

    #picture = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        // Nothing to build if the author already wrote the <picture> themselves.
        if (!this.#picture) {
            this.#picture = this.querySelector(':scope > picture');
        }

        if (!this.#picture) {
            this.#picture = document.createElement('picture');

            const children = [...this.childNodes];
            this.append(this.#picture);
            for (const node of children) {
                // moveBefore keeps an <img> that has already started loading
                // from being torn down and restarted.
                if (this.#picture.moveBefore) this.#picture.moveBefore(node, null);
                else this.#picture.append(node);
            }
        }

        super.connectedCallback();
    }

    render() {
        // Both are read by CSS, not JS — set as custom properties so a ratio
        // can be any valid CSS value rather than a fixed list.
        const ratio = this.getAttribute('ratio');
        if (ratio) this.style.setProperty('--picture-ratio', ratio);
        else this.style.removeProperty('--picture-ratio');
    }

    /** The real <picture> and the <img> inside it. */
    get picture() { return this.#picture; }
    get image() { return this.#picture?.querySelector('img') ?? null; }
}

define(tagName, Picture);
