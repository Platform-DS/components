// ------------------------------
// UI Kit Page — LIGHT DOM
// ------------------------------
// A poster of the system on one page: the palette, the type, and a specimen of
// every component, laid out in labelled panels.
//
//   <pl-ui-kit-page>
//     <div data-masthead>
//       <p data-brand>Northwind</p>
//       <h1>Northwind UI Kit</h1>
//     </div>
//
//     <section data-panel data-span="2">
//       <h2>Colors</h2>
//       <div data-swatches>
//         <div data-swatch="primary">Primary</div>
//         <div data-swatch="success">Success</div>
//       </div>
//     </section>
//
//     <section data-panel>
//       <h2>Buttons</h2>
//       <div data-row><pl-button>Primary</pl-button></div>
//     </section>
//   </pl-ui-kit-page>
//
// ------------------------------
// This is the page a theme is judged on
// ------------------------------
// Its job is to make a theme visible all at once: swap the tokens and every
// panel changes together, which is far more convincing than a screenshot and
// far quicker than clicking through a site. That is why the stylesheet contains
// no literal colors, radii, or type sizes at all — every value is a token, so
// there is nowhere for a theme to fail to reach.
//
// The swatches are the sharpest version of this: each chip paints a token
// directly, so the palette shown IS the palette in force rather than a picture
// of one that can drift out of date.
//
// ------------------------------
// A shell, like the other page templates
// ------------------------------
// It owns the column packing and the panel chrome, and nothing else. What goes inside a
// panel is the author's markup, unchanged and in their own tree — which is what
// lets the kit show real components in real states rather than a rendering of
// them. If this ever grows logic, the logic belonged in a component.

import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

const tagName = 'pl-ui-kit-page';

export class UiKitPage extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, UiKitPage);
