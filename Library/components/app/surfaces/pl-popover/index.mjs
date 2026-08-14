// ------------------------------
// Popover Component — LIGHT DOM
// ------------------------------
// A panel that opens from the control that invoked it, in the top layer.
//
//   <pl-button popovertarget="filters">Filters</pl-button>
//
//   <pl-popover id="filters" placement="block-end">
//     <p>Anything at all in here.</p>
//   </pl-popover>
//
// As with pl-dialog there is no JavaScript in that example — but here there is
// no id transfer either, because the `popover` attribute goes on the HOST. A
// custom element carries it perfectly well, so `popovertarget` resolves
// straight to <pl-popover> and the browser handles the rest: top layer,
// light dismiss, Escape, and returning focus to the invoker.
//
// ------------------------------
// Positioning is CSS, not measurement
// ------------------------------
// A popover opened by `popovertarget` gets its invoker as an IMPLICIT anchor,
// so `position-area` can place the panel against that control without either
// side naming the other, and `position-try-fallbacks` flips it to the opposite
// edge when there isn't room. That is the whole "open in the direction that
// fits" behaviour, done by the style engine at paint time — no scroll
// listeners, no getBoundingClientRect, nothing to re-measure when the page
// moves. See _styles.mjs for the fallback where anchor positioning is missing.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-popover';

// Light DOM
export class Popover extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return ['manual'];
    }

    #wired = false;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#wired) {
            this.#wired = true;
            // `toggle` fires on the popover itself and doesn't bubble, so it's
            // re-emitted composed for anyone listening further up.
            this.addEventListener('toggle', event => {
                this.emit('pl-toggle', { open: event.newState === 'open' });
            });
        }

        super.connectedCallback();
    }

    render() {
        // "auto" is the light-dismissing kind — clicking away or pressing
        // Escape closes it, and only one auto popover in a tree stays open.
        // "manual" opts out of all of that, for something that must stay put
        // until the page decides otherwise.
        this.setAttribute('popover', this.hasAttribute('manual') ? 'manual' : 'auto');
    }

    get open() { return this.matches(':popover-open'); }

    // Thin passes to the native API, for the times a script owns the panel.
    show() { this.showPopover(); }
    hide() { this.hidePopover(); }
    toggle(force) { this.togglePopover(force); }
}

define(tagName, Popover);
