// ------------------------------
// Header Component — LIGHT DOM
// ------------------------------
// Step 1 of the landing-page formula: a simple, always-visible header. On a
// landing page it should carry the brand and ONE call to action — every extra
// link is another way to leave before converting.
//
//   <pl-header>
//     <a href="/"><img src="/logo.svg" alt="">Platform</a>
//     <nav aria-label="Main">
//       <ul><li><a href="/docs">Docs</a></li></ul>
//     </nav>
//     <div data-actions>
//       <pl-button-link href="/start">Get started</pl-button-link>
//     </div>
//   </pl-header>
//
// The nav is authored as plain markup so it's crawlable and works with styles
// off. On small screens the component adds a disclosure toggle wired with
// aria-expanded / aria-controls — and only then does the collapse CSS apply, so
// with JavaScript disabled the nav simply stays open rather than becoming
// unreachable behind a dead button.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-header';

const MENU_ICON = /*html*/`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/>
    </svg>`;

const CLOSE_ICON = /*html*/`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/>
    </svg>`;

let uid = 0;

// Light DOM
export class Header extends BaseElement {
    static mode = 'light';

    #nav = null;
    #toggle = null;
    #media = null;
    // Held as one bound reference so removeEventListener can actually match it.
    #onBreakpoint = () => this.#sync();

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();

        this.#nav = this.querySelector(':scope > nav');
        if (!this.#nav || this.#toggle) return;

        this.#nav.id ||= `pl-header-nav-${++uid}`;

        this.#toggle = document.createElement('button');
        this.#toggle.type = 'button';
        this.#toggle.dataset.navToggle = '';
        this.#toggle.setAttribute('aria-expanded', 'false');
        this.#toggle.setAttribute('aria-controls', this.#nav.id);
        this.#toggle.setAttribute('aria-label', 'Open menu');
        this.#toggle.innerHTML = MENU_ICON;
        this.#toggle.addEventListener('click', () => this.toggle());

        // Insert before the nav so the tab order is brand → toggle → nav.
        this.insertBefore(this.#toggle, this.#nav);

        // Only now does the collapse CSS engage.
        this.dataset.collapsible = '';

        // `hidden` is what actually closes the panel, so it's only applied
        // while the viewport is small enough for the toggle to be showing.
        this.#media = matchMedia('(max-width: 48rem)');
        this.#media.addEventListener('change', this.#onBreakpoint);
        this.#sync();
    }

    disconnectedCallback() {
        this.#media?.removeEventListener('change', this.#onBreakpoint);
    }

    /** Open or close the nav panel. */
    toggle(force) {
        const open = force ?? this.#toggle.getAttribute('aria-expanded') === 'false';

        this.#toggle.setAttribute('aria-expanded', String(open));
        this.#toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        this.#toggle.innerHTML = open ? CLOSE_ICON : MENU_ICON;
        this.#nav.hidden = !open;

        this.emit('pl-nav-toggle', { open });
    }

    /** Above the breakpoint the nav is always shown, regardless of state. */
    #sync() {
        if (this.#media.matches) this.toggle(false);
        else this.#nav.hidden = false;
    }
}

define(tagName, Header);
