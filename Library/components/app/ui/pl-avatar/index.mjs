// ------------------------------
// Avatar Component
// ------------------------------
// EXTENDS the ImageElement base primitive, so it inherits the whole native
// <img> surface for free — src/srcset/sizes, alt, loading, decoding,
// decode(), naturalWidth/Height, the load/error events. This file adds only
// what a plain <img> lacks for an avatar specifically: a circular (or
// rounded-square) crop, a size scale, and a fallback for when there's no
// image yet or the one given fails to load.
//
//   <pl-avatar src="https://…" alt="Ada Lovelace" initials="AL"></pl-avatar>
//
// ------------------------------
// The fallback is a second, independently-accessible state
// ------------------------------
// Hiding a broken/missing <img> with CSS (display, visibility, opacity) also
// removes it — and its `alt` — from the accessibility tree, which would
// leave the fallback silent. So instead of layering the two and hoping the
// broken image doesn't show through, exactly one is ever rendered: the real
// <img> when it has a source and hasn't errored, or the fallback — with its
// own role="img" and aria-label copied from `alt` — when it doesn't. Same
// shape as pl-ratings' readonly mode: two mutually exclusive, both fully
// labelled states, rather than one element trying to serve both.

// Imports
import { ImageElement } from '../../../../_core/elements/ImageElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-avatar';

// A generic silhouette, shown when there are no initials to fall back to
// either. Self-contained rather than routed through pl-icon — see
// pl-ratings' star path for why: it would make this the first component in
// the library to depend on another one.
const PERSON_ICON = /*html*/`
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
`;

// Shadow DOM
export class Avatar extends ImageElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <span part="fallback" class="fallback"></span>
            <img part="img">
        `;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    // Native <img> attributes (spread, delegated straight to the internal
    // element) plus this component's own typed, reflected props.
    static props = {
        ...ImageElement.props,
        initials: { type: String },
        size:     { type: String, default: 'md', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
        shape:    { type: String, default: 'circle', options: ['circle', 'square'] },
    };

    // Whether the CURRENT src has failed — reset whenever src itself changes,
    // so a new source always gets its own chance rather than inheriting the
    // last one's failure.
    #failed = false;
    #lastSrc = undefined;

    constructor() {
        super();

        this.refs = {
            img: this.shadowRoot.querySelector('img'),
            fallback: this.shadowRoot.querySelector('.fallback'),
        };

        // load/error don't cross the shadow boundary on their own (see
        // createNativeElement's NON_COMPOSED_EVENTS) — they're already
        // re-emitted on the host for anyone listening, but the fallback
        // state itself has to be handled here, close to the real <img>.
        this.refs.img.addEventListener('error', () => {
            this.#failed = true;
            this.render();
        });
    }

    render() {
        const { img, fallback } = this.refs ?? {};
        if (!img) return;

        const src = this.getAttribute('src');
        if (src !== this.#lastSrc) {
            this.#lastSrc = src;
            this.#failed = false;
        }

        const showFallback = !src || this.#failed;

        img.hidden = showFallback;
        fallback.hidden = !showFallback;

        if (showFallback) {
            const initials = this.props.initials;
            fallback.textContent = '';
            if (initials) {
                fallback.textContent = initials.slice(0, 2).toUpperCase();
            } else {
                fallback.innerHTML = PERSON_ICON;
            }
            // The <img>'s accessible name (`alt`) only exists while the <img>
            // is the thing being rendered — name the fallback the same way
            // while it's the one standing in for it.
            fallback.setAttribute('role', 'img');
            fallback.setAttribute('aria-label', this.getAttribute('alt') || 'Avatar');
        } else {
            fallback.removeAttribute('role');
            fallback.removeAttribute('aria-label');
        }
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Avatar);
}
