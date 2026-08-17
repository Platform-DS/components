// ------------------------------
// Accordion Component — LIGHT DOM
// ------------------------------
// A heading that shows and hides the content beneath it.
//
//   <pl-accordion open>
//     <h3 data-summary>What does zero dependencies mean?</h3>
//     <p>No runtime, no peer packages, no build step.</p>
//   </pl-accordion>
//
// The author's own heading is kept and a real <button> is moved INSIDE it —
// the pattern assistive tech expects, since the heading stays a heading (so
// it appears in the document outline and in a screen reader's heading list)
// while the button is what gets focused and pressed.
//
// ------------------------------
// Why not <details>
// ------------------------------
// <details name="…"> gives single-open behaviour natively and would be the
// obvious answer for one accordion on its own. It isn't used here because of
// what pl-accordion-group has to do around it: exclusivity in this library is
// opt-OUT via `data-multiple`, the group has to be able to close a panel that
// the user didn't just click, and the panel needs a height to animate. A
// `name`-grouped <details> owns all of that itself and offers no way in.
//
// So the disclosure is rebuilt on the standard button pattern — `aria-expanded`
// on the trigger, `aria-controls` pointing at a labelled region — which is a
// documented ARIA pattern rather than a bespoke one, and leaves the group free
// to coordinate.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-accordion';

let uid = 0;

// Light DOM
export class Accordion extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return ['open', 'disabled'];
    }

    #button = null;
    #panel = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#button) this.#build();

        super.connectedCallback();
    }

    /**
     * Split the author's children into a trigger and a panel, once.
     *
     * Everything is MOVED rather than re-created, so an already-upgraded
     * component inside the panel (a pl-button, a pl-code-block) keeps its
     * state instead of being torn down and rebuilt.
     */
    #build() {
        const id = ++uid;

        // The summary is whatever the author marked, or the first heading, or
        // — failing both — the first element. Falling all the way back means a
        // forgotten `data-summary` produces a slightly odd accordion rather
        // than one with no trigger at all.
        const summary = this.querySelector(':scope > [data-summary]')
            ?? this.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)')
            ?? this.firstElementChild;

        this.#button = document.createElement('button');
        this.#button.type = 'button';
        this.#button.className = 'pl-accordion__trigger';
        this.#button.id = `pl-accordion-trigger-${id}`;
        this.#button.setAttribute('aria-controls', `pl-accordion-panel-${id}`);

        // A marker element, not a background image, so its rotation can be
        // animated and its color inherited.
        const marker = document.createElement('span');
        marker.className = 'pl-accordion__marker';
        marker.setAttribute('aria-hidden', 'true');

        this.#panel = document.createElement('div');
        this.#panel.className = 'pl-accordion__panel';
        this.#panel.id = `pl-accordion-panel-${id}`;
        // Named by its own trigger, so a screen reader user who lands inside
        // the region knows which disclosure they are in.
        this.#panel.setAttribute('role', 'region');
        this.#panel.setAttribute('aria-labelledby', this.#button.id);

        const body = document.createElement('div');
        body.className = 'pl-accordion__body';
        this.#panel.append(body);

        // Split before moving anything — the live child list shifts as we go.
        const rest = [...this.childNodes].filter(node => node !== summary);

        if (summary) {
            summary.classList.add('pl-accordion__heading');
            // The button goes INSIDE the heading, wrapping its text. The
            // heading element itself is untouched, so <h3> stays an <h3>.
            const label = [...summary.childNodes];
            summary.append(this.#button);
            for (const node of label) {
                if (this.#button.moveBefore) this.#button.moveBefore(node, null);
                else this.#button.append(node);
            }
            this.#button.append(marker);
        }

        this.append(this.#panel);
        for (const node of rest) {
            if (body.moveBefore) body.moveBefore(node, null);
            else body.append(node);
        }

        this.#button.addEventListener('click', () => {
            if (this.hasAttribute('disabled')) return;
            const open = !this.hasAttribute('open');
            this.toggleAttribute('open', open);
            // The group listens for this to close its siblings. Emitted only
            // on real interaction, never from render(), so a group closing a
            // panel can't bounce an event back and forth.
            this.emit('pl-toggle', { open });
        });
    }

    render() {
        if (!this.#button) return;

        const open = this.hasAttribute('open');
        this.#button.setAttribute('aria-expanded', String(open));
        this.#button.disabled = this.hasAttribute('disabled');
        // `hidden` rather than a class: the panel is genuinely not available
        // when closed, so it leaves the accessibility tree and the tab order
        // without needing anything else to be kept in sync.
        this.#panel.hidden = !open;
    }

    /** Open state. Setting it reflects to the attribute and repaints. */
    get open() { return this.hasAttribute('open'); }
    set open(value) { this.toggleAttribute('open', Boolean(value)); }

    /** The real controls, for focus management from a group. */
    get trigger() { return this.#button; }
    get panel() { return this.#panel; }

    focus(options) { this.#button?.focus(options); }
}

define(tagName, Accordion);
