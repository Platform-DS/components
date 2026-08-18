// ------------------------------
// Brand Kit Page — LIGHT DOM
// ------------------------------
// A brand board: full-color bands stacked edge to edge — the logo on its
// ground, the logo's variants, the palette as circles, the type faces as
// specimens, an imagery grid, and a color strip to close.
//
//   <pl-brand-kit-page
//       name="Northwind" tagline="Tagline"
//       brand-icon="<svg viewBox=&quot;0 0 24 24&quot;>…</svg>"
//       images='["https://…jpg", "https://…jpg"]'>
//
//     <section data-logo data-tone="primary">
//       <p data-label>Primary logo</p>
//       <div data-mark></div>                <!-- filled: brand-icon, or the default -->
//       <p data-wordmark></p>                <!-- filled: name -->
//       <p data-tagline></p>                 <!-- filled: tagline -->
//     </section>
//
//     <div data-variants>
//       <section data-variant data-tone="accent">…</section>
//       <section data-variant data-tone="light">…</section>
//     </div>
//
//     <section data-band>
//       <h2 data-band-title>Imagery &amp; applications</h2>
//       <div data-tiles>
//         <div data-tile data-span="tall"></div>   <!-- filled: images[0] -->
//         <div data-tile></div>                    <!-- filled: images[1] -->
//         <div data-tile data-tone="primary">Northwind</div>
//         <div data-tile data-tone="accent">Tagline</div>
//         <div data-tile></div>                    <!-- filled: images[2] -->
//       </div>
//     </section>
//
//     <div data-strip>
//       <span data-tone="primary"></span><span data-tone="dark"></span>
//     </div>
//   </pl-brand-kit-page>
//
// ------------------------------
// Tones, not colors
// ------------------------------
// Every colored region takes data-tone — primary, accent, dark, light — and
// each tone is a background/ink PAIR read from the theme's tokens. That is
// what makes this a template rather than a picture of one: swap the theme and
// the logo band, the strip, and the tiles all recolor together, and the
// swatch circles repaint because each one paints a token directly.
//
// ------------------------------
// Three narrow exceptions to "the page owns nothing"
// ------------------------------
// Every OTHER region is still exactly what it looks like: markup the author
// wrote, in the author's own tree, untouched. render() only ever fills what
// the author left EMPTY, never what they filled in themselves, and it stops
// at three deliberately narrow cases:
//
//   `data-mark` gets an icon. A brand board with a dashed hole where the logo
//   goes doesn't read as a brand board. Every empty <div data-mark> gets a
//   placeholder icon — `brand-icon` if given, else the library's default.
//   "Validated" means "does this parse as an <svg>?", not sanitized for an
//   untrusted source: this is markup a developer writes into their own page,
//   the same trust level as every other attribute on it. Inline <script> and
//   event-handler attributes are stripped anyway, since it goes straight into
//   the live document and costs nothing to remove.
//
//   `data-wordmark` / `data-tagline` get text. `name` and `tagline` fill
//   whichever of these the author left empty, so the same two strings don't
//   have to be retyped by hand into the logo band.
//
//   The imagery grid gets photos. `images` walks the EXISTING
//   `[data-tiles] [data-tile]` elements in document order and drops one URL
//   into each empty, untoned tile it finds — the toned "application" tiles
//   and any tile the author already filled are never touched. The default
//   template ships three such slots, which is why `images` takes at most
//   three; a custom layout with more or fewer empty tiles just gets that many
//   filled, and extra URLs beyond what the grid has room for are dropped with
//   a console warning. This is the same idea as `data-mark`, aimed at a grid
//   that already existed rather than a new one invented for the purpose.
//
// `images`, `name`, and `tagline` are typed props (component-authoring-guide
// .md §3 — Array and String are two of the typed constructors) because each
// needs to land as a real value on `this.props`. `brand-icon` is deliberately
// NOT a prop: it's markup, not a value with a type to enforce, so it's a
// plain observed attribute read straight off the element — the guide's "When
// you need props, and when you don't."
//
// If this component ever needs a FOURTH kind of generated content, that's the
// signal to stop and ask whether the logic belongs in a real component
// instead.

import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

const tagName = 'pl-brand-kit-page';

// A generic placeholder mark — used wherever the author leaves a data-mark
// empty and no brand-icon override is given.
const DEFAULT_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M460-171.46v-297.08L200-619.08v283.23q0 6.16 3.08 11.54 3.07 5.39 9.23 9.23L460-171.46Zm40 0 247.69-143.62q6.16-3.84 9.23-9.23 3.08-5.38 3.08-11.54v-283.23L500-468.54v297.08Zm-20-331.46 257-148.54-244.69-141.62q-6.16-3.84-12.31-3.84t-12.31 3.84L223-651.46l257 148.54ZM192.31-279.69q-15.16-8.69-23.73-23.62-8.58-14.92-8.58-32.31v-288.76q0-17.39 8.58-32.31 8.57-14.93 23.73-23.62l255.38-147.15q15.16-8.69 32.31-8.69 17.15 0 32.31 8.69l255.38 147.15q15.16 8.69 23.73 23.62 8.58 14.92 8.58 32.31v288.76q0 17.39-8.58 32.31-8.57 14.93-23.73 23.62L512.31-132.54q-15.16 8.69-32.31 8.69-17.15 0-32.31-8.69L192.31-279.69ZM480-480Z"/></svg>`;

// Cached across every instance — the default icon never changes, so it only
// needs parsing once.
let cachedDefaultIcon;

/**
 * Parse an author-supplied SVG string into an element ready to clone, or null
 * if it's empty or not well-formed SVG. Strips <script> and any on* attribute
 * before returning — cheap insurance for markup that is about to go straight
 * into the live document — but this is not a sanitizer: an svg passed as
 * brand-icon is written by whoever builds the page, the same trust level as
 * every other attribute on it.
 */
function parseIcon(source, { warnOnInvalid = false } = {}) {
    if (!source) return null;

    const doc = new DOMParser().parseFromString(source, 'image/svg+xml');
    const root = doc.documentElement;

    if (!root || root.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror')) {
        if (warnOnInvalid) {
            console.warn(`[${tagName}] "brand-icon" is not a well-formed <svg> — using the default mark instead.`);
        }
        return null;
    }

    root.querySelectorAll('script').forEach(node => node.remove());
    for (const el of [root, ...root.querySelectorAll('*')]) {
        for (const { name } of [...el.attributes]) {
            if (/^on/i.test(name)) el.removeAttribute(name);
        }
    }

    return root;
}

export class BrandKitPage extends BaseElement {
    static mode = 'light';

    static props = {
        images:  { type: Array,  default: [] },
        name:    { type: String, default: '' },
        tagline: { type: String, default: '' },
    };

    static get observedAttributes() {
        return [...Object.keys(this.props), 'brand-icon'];
    }

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }

    render() {
        this.#renderMarks();
        this.#renderIdentity();
        this.#renderImagery();
    }

    #renderMarks() {
        const icon = parseIcon(this.getAttribute('brand-icon'), { warnOnInvalid: true })
            ?? (cachedDefaultIcon ??= parseIcon(DEFAULT_ICON_SVG));
        if (!icon) return;

        for (const mark of this.querySelectorAll('[data-mark]')) {
            const generated = mark.querySelector(':scope > svg[data-brand-mark-icon]');

            // Real content the author put there themselves — never touched.
            if (mark.children.length && !generated) continue;

            const clone = icon.cloneNode(true);
            clone.setAttribute('data-brand-mark-icon', '');
            clone.setAttribute('aria-hidden', 'true');
            clone.setAttribute('focusable', 'false');

            if (generated) generated.replaceWith(clone);
            else mark.append(clone);
        }
    }

    #renderIdentity() {
        this.#fillText('[data-wordmark]', this.props.name);
        this.#fillText('[data-tagline]', this.props.tagline);
    }

    /** Set textContent on every matching, empty (or previously-generated) element. */
    #fillText(selector, value) {
        for (const el of this.querySelectorAll(selector)) {
            const generated = el.hasAttribute('data-brand-generated-text');

            // Real text the author typed themselves — never touched.
            if (el.textContent.trim() && !generated) continue;

            if (value) {
                el.textContent = value;
                el.setAttribute('data-brand-generated-text', '');
            } else if (generated) {
                el.textContent = '';
                el.removeAttribute('data-brand-generated-text');
            }
        }
    }

    /**
     * Drop `images` into the EXISTING imagery grid rather than building a new
     * one — one URL per empty, untoned [data-tile], in document order. The
     * toned "application" tiles and anything the author already filled are
     * never candidates.
     */
    #renderImagery() {
        const images = this.props.images ?? [];

        const slots = [...this.querySelectorAll('[data-tiles] > [data-tile]:not([data-tone])')]
            .filter(tile => tile.children.length === 0
                || (tile.children.length === 1 && tile.firstElementChild.hasAttribute('data-brand-reference-image')));

        if (images.length && !slots.length) {
            console.warn(`[${tagName}] "images" was set, but no empty [data-tile] was found to put them in.`);
        } else if (images.length > slots.length) {
            console.warn(`[${tagName}] "images" has ${images.length} URLs but only ${slots.length} empty tile(s) — the rest are ignored.`);
        }

        slots.forEach((tile, index) => {
            const src = images[index];

            if (!src) {
                tile.replaceChildren(); // clear a previously-generated image, if any
                return;
            }

            const img = document.createElement('img');
            img.src = src;
            img.alt = `Reference image ${index + 1}`;
            img.loading = 'lazy';
            img.setAttribute('data-brand-reference-image', '');
            tile.replaceChildren(img);
        });
    }
}

define(tagName, BrandKitPage);
