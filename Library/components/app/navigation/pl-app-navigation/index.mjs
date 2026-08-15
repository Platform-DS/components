// ------------------------------
// App Navigation Component — LIGHT DOM
// ------------------------------
// The persistent navigation rail of an application: your links, grouped, with
// the current one marked.
//
//   <pl-app-navigation label="Main">
//     <p data-section>Workspace</p>
//     <a href="/inbox" aria-current="page"><pl-icon icon="mail"></pl-icon> Inbox</a>
//     <a href="/calendar"><pl-icon icon="calendar"></pl-icon> Calendar</a>
//     <p data-section>Account</p>
//     <a href="/settings">Settings</a>
//   </pl-app-navigation>
//
// It generates no links. They are yours, in the page's DOM, so they are real
// URLs a crawler can follow and the browser can prefetch — and the current one
// is marked with `aria-current="page"`, which is both the accessible answer and
// the CSS hook the active style keys off. One attribute, not a class plus an
// attribute that can disagree with it.
//
// The rail is a <nav> landmark, named from `label` — several unnamed landmarks
// on one page all announce as "navigation" and are impossible to tell apart.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-app-navigation';

// Light DOM
export class AppNavigation extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return ['label'];
    }

    #nav = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#nav) {
            this.#nav = document.createElement('nav');

            const children = [...this.childNodes];
            this.append(this.#nav);
            for (const node of children) {
                if (this.#nav.moveBefore) this.#nav.moveBefore(node, null);
                else this.#nav.append(node);
            }
        }

        super.connectedCallback();
    }

    render() {
        if (!this.#nav) return;
        this.#nav.setAttribute('aria-label', this.getAttribute('label') ?? 'Main');
    }

    /** The <nav> landmark, for anything that needs to scroll or measure it. */
    get nav() { return this.#nav; }
}

define(tagName, AppNavigation);
