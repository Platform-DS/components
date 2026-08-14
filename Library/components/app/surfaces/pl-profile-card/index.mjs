// ------------------------------
// Profile Card Component — LIGHT DOM
// ------------------------------
// A person: a cover band, an avatar overlapping it, a name, and whatever else
// belongs with them. Like pl-product-card it generates no markup — the regions
// are marked on the author's own elements:
//
//   <pl-profile-card>
//     <div data-cover><img src="…" alt=""></div>
//     <pl-avatar data-avatar size="xl" initials="AL" alt=""></pl-avatar>
//     <h3 data-name>Ada Lovelace</h3>
//     <p data-role>Principal Engineer</p>
//     <p>Writes the notes everyone else reads.</p>
//     <div data-meta>
//       <pl-chip>Compilers</pl-chip>
//       <pl-chip>Mathematics</pl-chip>
//     </div>
//     <div data-actions><pl-button size="sm">Follow</pl-button></div>
//   </pl-profile-card>
//
// The avatar's alt is empty on purpose in that example: the name is right
// there in the card, so a filled alt would make a screen reader say it twice.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-profile-card';

// Light DOM
export class ProfileCard extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, ProfileCard);
