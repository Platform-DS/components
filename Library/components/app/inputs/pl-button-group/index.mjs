// ------------------------------
// Button Group Component — LIGHT DOM
// ------------------------------
// A wrapper, so it stays in the page's own DOM: the buttons inside are the
// author's real elements, and nothing has to be slotted across a shadow
// boundary for the group to lay them out or for a <form> to see them.
//
//   <pl-button-group>
//     <pl-button data-variant="secondary">Day</pl-button>
//     <pl-button data-variant="secondary">Week</pl-button>
//     <pl-button data-variant="secondary">Month</pl-button>
//   </pl-button-group>
//
// Presentation only — it does not manage which segment is selected. For a
// toolbar of toggles, set aria-pressed on the buttons yourself; the pressed
// styling follows. For a set of mutually exclusive options where the CHOICE is
// the data, reach for pl-radio-group instead: it submits a value and announces
// itself as a group of options.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-button-group';

// Light DOM
export class ButtonGroup extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();

        // A row of related controls is a toolbar unless the author has said
        // otherwise. Set on connect rather than baked into markup so the
        // author writes plain buttons.
        if (!this.hasAttribute('role')) this.setAttribute('role', 'group');
    }
}

define(tagName, ButtonGroup);
