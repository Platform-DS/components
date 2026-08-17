// ------------------------------
// Ratings Component — LIGHT DOM
// ------------------------------
// A row of stars drawn over a real <input type="range">. Light DOM, so the
// range is a genuine control in the page: it submits with the surrounding
// <form>, and its native keyboard behaviour — arrow keys, Home/End, Page
// Up/Down — needs no reimplementing. The star row is a purely visual skin,
// `pointer-events: none` on the range itself, so a click lands on a star
// instead of dragging an invisible thumb.
//
//   <pl-ratings name="stars" value="3" max="5"></pl-ratings>
//
// Clicking a star sets the range's value and dispatches the `input` event a
// real drag would, so one listener handles the mouse, the keyboard, and this
// programmatic path alike — the same "one repaint route" shape as every
// other component here.
//
// Give it a name with pl-label — <pl-label text="Rate this"><pl-ratings>
// — exactly as you would a real <input>: it's the same trick pl-switch and
// pl-color-picker use, and it works here for the same reason (a light DOM
// control, reachable from outside). The range carries aria-valuetext ("3 of
// 5 stars") rather than its own aria-label, specifically so it doesn't
// shadow that wrapping label's name — aria-label on the control would win
// over the <label> association and silently defeat it.
//
// ------------------------------
// readonly: a display, not a control
// ------------------------------
// Set `readonly` for a non-interactive average, e.g. a product card's "4.3 of
// 5". It accepts a fractional `value` and fills the affected star
// proportionally — something a step=1 range can't hold — so readonly mode
// disables the input rather than trying to keep a slider in sync with a
// value it's not shaped for. The stars alone carry the value, via
// role="img" and an aria-label on the host.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-ratings';

// The same path used by the spritesheet's icon-star — inlined rather than
// shared, since drawing it twice per star (see #syncStars below) needs two
// independent <svg><path> nodes anyway, and pulling in pl-icon would make
// this component depend on another one for the first time in the library.
const STAR_PATH = 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0l-4.725 2.885a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z';

const clamp = (value, max) => Math.min(Math.max(value, 0), max);

// Light DOM
export class Ratings extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return ['value', 'max', 'name', 'disabled', 'readonly'];
    }

    #input = null;
    #stars = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#input) {
            this.#input = document.createElement('input');
            this.#input.type = 'range';
            this.#input.min = '0';
            this.#input.step = '1';
            this.#input.className = 'pl-ratings__input';

            this.#stars = document.createElement('div');
            this.#stars.className = 'pl-ratings__stars';
            this.#stars.setAttribute('aria-hidden', 'true');

            this.append(this.#input, this.#stars);

            // One path handles the keyboard (native, on the range), the mouse
            // (the click handler below), and any programmatic `.value =`:
            // whatever changes the range ends here.
            this.#input.addEventListener('input', () => {
                this.setAttribute('value', this.#input.value);
                this.emit('pl-change', { value: Number(this.#input.value) });
            });

            this.#stars.addEventListener('click', event => {
                if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return;
                const star = event.target.closest('.pl-ratings__star');
                if (!star) return;

                this.#input.value = star.dataset.index;
                this.#input.dispatchEvent(new Event('input', { bubbles: true }));
                this.#input.focus();
            });

            // Hover preview — mouse only, and never for a value the click
            // handler above would refuse to commit.
            this.#stars.addEventListener('mouseover', event => {
                if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return;
                const star = event.target.closest('.pl-ratings__star');
                if (star) this.#paint(Number(star.dataset.index));
            });
            this.#stars.addEventListener('mouseleave', () => this.#paint(this.value));
        }

        super.connectedCallback();
    }

    /** Build the star row once, and rebuild it only when `max` actually changes. */
    #syncStars(max) {
        if (this.#stars.children.length === max) return;

        this.#stars.replaceChildren();
        for (let i = 1; i <= max; i++) {
            const star = document.createElement('span');
            star.className = 'pl-ratings__star';
            star.dataset.index = String(i);
            // Two copies of the same path, stacked: the back one is the
            // permanent empty outline color, the front one is clipped to
            // --fraction and carries the filled color — see _styles.mjs.
            star.innerHTML = /*html*/`
                <svg class="pl-ratings__star-icon pl-ratings__star-icon--bg" viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg>
                <svg class="pl-ratings__star-icon pl-ratings__star-icon--fg" viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg>
            `;
            this.#stars.append(star);
        }
    }

    /** Fill the stars up to `amount` (fractional), independent of the committed `value`. */
    #paint(amount) {
        for (const star of this.#stars.children) {
            const fraction = clamp(amount - (Number(star.dataset.index) - 1), 1);
            star.style.setProperty('--fraction', fraction);
        }
    }

    render() {
        if (!this.#input) return;

        const max = Math.max(1, Math.round(Number(this.getAttribute('max'))) || 5);
        const value = clamp(Number(this.getAttribute('value')) || 0, max);
        const disabled = this.hasAttribute('disabled');
        const readonly = this.hasAttribute('readonly');

        this.#syncStars(max);

        this.#input.max = String(max);
        // A readonly average can be fractional ("4.3"); the range can only
        // ever hold a whole star, so on this path it just takes the rounded
        // value and gets out of the way — the stars carry the real number.
        this.#input.value = String(readonly ? Math.round(value) : value);
        this.#input.disabled = disabled || readonly;
        this.#input.toggleAttribute('aria-hidden', readonly);
        this.#input.setAttribute('aria-valuetext', `${value} of ${max} stars`);

        if (this.hasAttribute('name')) this.#input.setAttribute('name', this.getAttribute('name'));
        else this.#input.removeAttribute('name');

        if (readonly) {
            this.setAttribute('role', 'img');
            this.setAttribute('aria-label', `${value} of ${max} stars`);
        } else {
            this.removeAttribute('role');
            this.removeAttribute('aria-label');
        }

        this.#paint(value);
    }

    /** The current rating, clamped to [0, max]. */
    get value() { return clamp(Number(this.getAttribute('value')) || 0, this.max); }
    set value(v) { this.setAttribute('value', String(v)); }

    get max() { return Math.max(1, Math.round(Number(this.getAttribute('max'))) || 5); }
    set max(v) { this.setAttribute('max', String(v)); }

    /** The real control, for focus() and validation. */
    get input() { return this.#input; }

    focus(options) { this.#input?.focus(options); }
}

define(tagName, Ratings);
