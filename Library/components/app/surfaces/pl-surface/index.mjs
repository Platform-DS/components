// ------------------------------
// Surface Component — LIGHT DOM
// ------------------------------
// A background, a border, a radius, a shadow. That is the whole component.
//
//   <pl-surface>
//     <h3>Weekly summary</h3>
//     <p>Everything is fine.</p>
//   </pl-surface>
//
// It exists because that combination is written by hand on nearly every page,
// and written slightly differently each time — a border that does not match the
// cards next to it, a shadow invented on the spot, a radius one step off the
// scale. One tag makes those consistent by default and still leaves every value
// overridable, because all six are custom properties:
//
//   <pl-surface style="--surface-shadow: none; --surface-background: transparent">
//
// ------------------------------
// Light DOM, and no markup of its own
// ------------------------------
// A surface is a frame around content that belongs to the page. Putting a
// shadow root here would cut that content off from the page's own cascade,
// which is the one thing a generic container must never do — a heading inside
// a surface should be styled by the same rule that styles every other heading.
// So there is no template and no slot: the children stay exactly where the
// author wrote them, and the component contributes one stylesheet.
//
// It is also why this is not a "card". pl-product-card and pl-profile-card know
// what goes inside them and lay it out; this knows nothing and lays out nothing.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-surface';

// Light DOM
export class Surface extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, Surface);
