// ------------------------------
// Brand Kit Page — LIGHT DOM
// ------------------------------
// A brand board: full-color bands stacked edge to edge — the logo on its
// ground, the logo's variants, the palette as circles, the type faces as
// specimens, an imagery grid, and a color strip to close.
//
//   <pl-brand-kit-page>
//     <section data-logo data-tone="primary">
//       <p data-label>Primary logo</p>
//       <div data-mark></div>
//       <p data-wordmark>Northwind</p>
//       <p data-tagline>Tagline</p>
//     </section>
//
//     <div data-variants>
//       <section data-variant data-tone="accent">…</section>
//       <section data-variant data-tone="light">…</section>
//     </div>
//
//     <section data-band>
//       <h2 data-band-title>Color palette</h2>
//       <div data-swatches>
//         <div data-swatch="primary">Primary <small>Brand blue</small></div>
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
// A page shell is deliberately thin. It owns the bands, the tones, and the
// specimen chrome, and nothing else — what sits in a band is the author's
// markup in the author's own tree. If this ever grows logic, the logic
// belonged in a component.

import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

const tagName = 'pl-brand-kit-page';

export class BrandKitPage extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, BrandKitPage);
