// ------------------------------
// Badge Component — LIGHT DOM
// ------------------------------
// Wraps an existing control or item and pins a small count — or a bare dot —
// to its corner. The thing being badged stays exactly as authored; the badge
// is a positioned sibling, not a wrapper the content gets moved into.
//
//   <pl-badge content="4">
//     <pl-button aria-label="Inbox, 4 unread messages">
//       <pl-icon icon="mail"></pl-icon>
//     </pl-button>
//   </pl-badge>
//
// Light DOM for the usual reason: the badged content is the page's own —
// buttons, links, avatars, anything focusable or form-bearing — and putting
// a shadow boundary between it and the document would break the very things
// that make it work (label association, form ownership, `aria-*` references
// pointing at ids elsewhere in the page).
//
// ------------------------------
// The badge is decorative. The OWNER carries the meaning.
// ------------------------------
// The badge span is always `aria-hidden`, so a screen reader never hears a
// stray "4" floating next to a button called "Inbox". A badge is a visual
// shorthand for something the owner should already be saying, which means
// the accessible name belongs on the owner and has to be written there by
// hand:
//
//   aria-label="Inbox, 4 unread messages"     ✅ the whole meaning
//   aria-label="Inbox"                        ❌ the count is lost entirely
//
// Nothing here can generate that name: only the author knows whether the 4
// is unread messages, pending invitations, or items in a cart. Deriving one
// would mean guessing wrong in a place where being wrong is silent.
//
// And because a dot has no text at all, it says even less on its own — use
// one only where the surrounding UI already makes the state obvious ("Online"
// spelled out beside an avatar), never as the sole indicator of something a
// user needs.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-badge';

// Light DOM
export class Badge extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return ['content', 'max', 'dot', 'intent', 'position', 'show-zero'];
    }

    #badge = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#badge) {
            this.#badge = document.createElement('span');
            this.#badge.className = 'pl-badge__badge';
            // See the header: the owner's accessible name is the whole story,
            // so the badge itself stays out of the accessibility tree.
            this.#badge.setAttribute('aria-hidden', 'true');
            // Appended, not wrapped around anything — the author's content is
            // left untouched in its original position and order.
            this.append(this.#badge);
        }

        super.connectedCallback();
    }

    /**
     * What the badge displays: a count capped by `max` ("99+"), any other
     * string verbatim, or nothing at all for a dot.
     */
    #label() {
        const content = this.getAttribute('content');
        if (content == null) return '';

        const max = Number(this.getAttribute('max'));
        const count = Number(content);
        // Only cap when BOTH are real numbers — a non-numeric badge ("NEW",
        // "beta") has no notion of "over the limit" to apply.
        if (Number.isFinite(count) && Number.isFinite(max) && this.hasAttribute('max') && count > max) {
            return `${max}+`;
        }
        return content;
    }

    /**
     * Whether there is anything to show. A dot always shows — it carries a
     * state, not a quantity. A count of zero hides by default, since "0
     * unread" is the absence of the thing the badge exists to flag; pass
     * `show-zero` when the zero is itself worth seeing.
     */
    #visible() {
        if (this.hasAttribute('dot')) return true;

        const content = this.getAttribute('content');
        if (content == null || content === '') return false;
        if (Number(content) === 0 && !this.hasAttribute('show-zero')) return false;

        return true;
    }

    render() {
        if (!this.#badge) return;

        const visible = this.#visible();
        this.#badge.hidden = !visible;
        // Nothing to read out, but an empty box would still be drawn — the
        // dot's size comes from CSS, so its text stays empty either way.
        this.#badge.textContent = this.hasAttribute('dot') ? '' : this.#label();
    }

    /** The badge element itself, for positioning tweaks from script. */
    get badge() { return this.#badge; }

    /** The displayed count/text — reads back capped, exactly as rendered. */
    get content() { return this.#label(); }
    set content(v) {
        if (v == null) this.removeAttribute('content');
        else this.setAttribute('content', String(v));
    }
}

define(tagName, Badge);
