// ------------------------------
// Accordion Group Component — LIGHT DOM
// ------------------------------
// A stack of pl-accordions that know about each other. Its whole job is the
// one thing a lone accordion cannot decide: whether opening this panel should
// close that one.
//
//   <pl-accordion-group>            <!-- one at a time (default) -->
//   <pl-accordion-group data-multiple>   <!-- as many as you like -->
//
// Exclusivity is the DEFAULT and `data-multiple` opts out, matching how an FAQ
// is usually built and how the attribute reads: its presence adds a capability
// rather than removing one.
//
// ------------------------------
// One listener, not one per child
// ------------------------------
// pl-accordion emits `pl-toggle` as a bubbling composed event, so the group
// listens ONCE on itself and lets the event find it. Nothing here reaches into
// a child to wire anything up, which means accordions added or removed later
// need no registration and no teardown — the group works on whatever is
// inside it at the moment an event arrives.
//
// The group only ever reacts to a panel OPENING. Closing one is never anyone
// else's business, and `pl-toggle` is emitted only on real interaction (see
// pl-accordion), so the panels this closes cannot echo back.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-accordion-group';

// Light DOM
export class AccordionGroup extends BaseElement {
    static mode = 'light';

    #wired = false;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#wired) {
            this.#wired = true;
            this.addEventListener('pl-toggle', event => {
                if (!event.detail?.open) return;
                if (this.hasAttribute('data-multiple')) return;

                for (const accordion of this.#accordions()) {
                    // `open` is a property setter that writes the attribute,
                    // so this repaints the sibling through its own render()
                    // rather than poking at its internals.
                    if (accordion !== event.target) accordion.open = false;
                }
            });
        }

        super.connectedCallback();
    }

    /**
     * Direct children only. A pl-accordion whose panel contains another group
     * belongs to that inner group, and must not be closed by this one.
     */
    #accordions() {
        return [...this.querySelectorAll(':scope > pl-accordion')];
    }

    /** Every open panel, in DOM order. */
    get open() { return this.#accordions().filter(a => a.open); }

    /** Open all — a no-op without `data-multiple`, where it cannot be true. */
    openAll() {
        if (!this.hasAttribute('data-multiple')) return;
        for (const accordion of this.#accordions()) accordion.open = true;
    }

    closeAll() {
        for (const accordion of this.#accordions()) accordion.open = false;
    }
}

define(tagName, AccordionGroup);
