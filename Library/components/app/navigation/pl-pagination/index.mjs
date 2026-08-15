// ------------------------------
// Pagination Component — LIGHT DOM
// ------------------------------
// Numbered navigation through a paged list.
//
//   <pl-pagination page="3" total="12" href="/products?page={page}"></pl-pagination>
//
// ------------------------------
// Real links, in the page's own DOM
// ------------------------------
// Pagination is navigation, and every page in the set should be a URL a
// crawler can follow, a reader can open in a new tab, and the browser can
// prefetch. That rules out buttons-plus-JavaScript, and it rules out a shadow
// root: these links belong in the document.
//
// `href` is a template with a `{page}` placeholder. Leave it off and the
// component emits buttons instead, for a list that pages in place without
// changing the URL — but a real URL is the better answer whenever there is one.
//
// ------------------------------
// The window of numbers
// ------------------------------
// Long sets are truncated to first / … / a window around the current page / …
// / last, which is the only part of this that needs any logic. The window is
// kept a CONSTANT WIDTH — near the ends it slides rather than shrinking — so
// the control does not change size as you move through the set.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-pagination';

const GAP = '…';

// Shadow DOM
export class Pagination extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return ['page', 'total', 'href', 'data-siblings', 'label'];
    }

    #nav = null;
    #list = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#nav) {
            this.#nav = document.createElement('nav');
            this.#list = document.createElement('ul');
            this.#list.className = 'pl-pagination__list';
            this.#nav.append(this.#list);
            this.append(this.#nav);

            // Buttons only — a link navigates on its own.
            this.#list.addEventListener('click', event => {
                const button = event.target.closest('button[data-page]');
                if (!button) return;
                this.#go(Number(button.dataset.page));
            });
        }

        super.connectedCallback();
    }

    get page() { return Math.max(1, Number(this.getAttribute('page')) || 1); }
    set page(value) { this.setAttribute('page', String(value)); }

    get total() { return Math.max(1, Number(this.getAttribute('total')) || 1); }

    #go(page) {
        if (page === this.page) return;
        this.page = page;
        this.emit('pl-page', { page });
    }

    /** The page numbers to show, with nulls standing in for the gaps. */
    #window() {
        const { page, total } = this;
        const siblings = Math.max(0, Number(this.dataset.siblings) || 1);

        // first + last + current + its siblings + two gaps.
        const span = siblings * 2 + 5;
        if (total <= span) return Array.from({ length: total }, (_, i) => i + 1);

        // Clamp the window so it slides at the ends instead of collapsing.
        const start = Math.max(2, Math.min(page - siblings, total - span + 3));
        const end = Math.min(total - 1, Math.max(page + siblings, span - 2));

        const pages = [1];
        if (start > 2) pages.push(null);
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < total - 1) pages.push(null);
        pages.push(total);
        return pages;
    }

    /** One page item — a link when there is an href template, else a button. */
    #item(page) {
        const li = document.createElement('li');

        if (page === null) {
            const span = document.createElement('span');
            span.className = 'pl-pagination__gap';
            span.textContent = GAP;
            // The ellipsis is decoration; the numbers around it carry the sense.
            span.setAttribute('aria-hidden', 'true');
            li.append(span);
            return li;
        }

        const current = page === this.page;
        const template = this.getAttribute('href');
        const control = document.createElement(template ? 'a' : 'button');

        control.className = 'pl-pagination__page';
        control.textContent = String(page);
        // "Page 3" rather than a bare "3", which on its own says nothing about
        // what the number refers to.
        control.setAttribute('aria-label', `Page ${page}`);
        if (current) control.setAttribute('aria-current', 'page');

        if (template) control.href = template.replace('{page}', String(page));
        else {
            control.type = 'button';
            control.dataset.page = String(page);
        }

        li.append(control);
        return li;
    }

    /** Previous / next, disabled at the ends. */
    #step(direction) {
        const li = document.createElement('li');
        const target = this.page + direction;
        const outside = target < 1 || target > this.total;
        const template = this.getAttribute('href');

        // At the ends this becomes a <span>: a disabled link is not a thing,
        // and a link to nowhere is worse than no link.
        const control = document.createElement(outside ? 'span' : (template ? 'a' : 'button'));
        control.className = `pl-pagination__step pl-pagination__step--${direction < 0 ? 'prev' : 'next'}`;
        control.setAttribute('aria-label', direction < 0 ? 'Previous page' : 'Next page');
        if (outside) control.setAttribute('aria-disabled', 'true');

        control.innerHTML = /*html*/`
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="m15 6-6 6 6 6" />
            </svg>
        `;

        if (!outside) {
            if (template) control.href = template.replace('{page}', String(target));
            else { control.type = 'button'; control.dataset.page = String(target); }
        }

        li.append(control);
        return li;
    }

    render() {
        if (!this.#list) return;

        // A navigation landmark needs a name — several on one page otherwise
        // announce identically.
        this.#nav.setAttribute('aria-label', this.getAttribute('label') ?? 'Pagination');

        this.#list.replaceChildren(
            this.#step(-1),
            ...this.#window().map(page => this.#item(page)),
            this.#step(1),
        );
    }
}

define(tagName, Pagination);
