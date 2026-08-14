// ------------------------------
// sidebar — documentation navigation
// ------------------------------
// Built from the generated NAV tree, so its shape IS Library/components/:
// two surface sections (App, Content), each a header over its collapsible
// groups (Inputs, Surfaces, …). The surface name is a section header rather
// than a prefix on every group, so "Inputs" reads as "Inputs", not
// "app / inputs" ten times over.
//
// Groups are native <details> disclosures — open/closed state, keyboard
// support, and the accessible name all come from the platform.
//
// sidebar() builds the rail only. The filter input is searchField(), a
// separate export — it lives in the site header (app.mjs places it there),
// not the rail it searches. It just hides non-matching links: no library, no
// virtual list.

import { NAV } from '../nav.data.mjs';
import { GUIDES, href } from '../Router.mjs';
import { el } from './doc.mjs';

// Directory slugs are lowercase; a couple want a nicer display form.
const LABELS = { ui: 'UI', app: 'App', content: 'Content' };
const label = name => LABELS[name] ?? name[0].toUpperCase() + name.slice(1);

/** One navigable entry. */
function link(slug, text, status) {
    return el('li', {},
        el('a', {
            class: 'docs-nav__link',
            href: href(slug),
            'data-slug': slug,
            'data-status': status === 'planned' ? 'planned' : null,
            title: status === 'planned' ? 'Scaffolded — not written yet' : null,
        },
            el('span', {}, text),
            status === 'planned' ? el('span', { class: 'docs-nav__badge' }, 'soon') : null,
        )
    );
}

/** A collapsible group of component links, titled by its directory name. */
function group(name, items, { open = false } = {}) {
    return el('details', { class: 'docs-nav__group', open: open || null },
        el('summary', {}, label(name)),
        el('ul', { class: 'docs-nav__list' }, items),
    );
}

/** A titled section: one header over its content, grouping the tree visibly. */
function block(title, ...content) {
    return el('div', { class: 'docs-nav__block' },
        el('p', { class: 'docs-nav__section' }, title),
        ...content,
    );
}

export function sidebar() {
    const nav = el('nav', { class: 'docs-nav', 'aria-label': 'Documentation' },
        // Guides are few and always relevant — a plain list, no disclosure.
        block('Guides',
            el('ul', { class: 'docs-nav__list' },
                GUIDES.map(g => link(g.slug, g.title))),
        ),
        // One section per surface, its groups nested beneath.
        NAV.map(surface =>
            block(label(surface.name),
                surface.groups.map(g =>
                    group(
                        g.name,
                        g.components.map(c => link(c.tag, c.tag, c.status)),
                        // App inputs holds the written components, so it opens
                        // by default rather than making the first visitor hunt.
                        { open: surface.name === 'app' && g.name === 'inputs' },
                    )
                )
            )
        ),
    );

    return el('aside', { class: 'docs-sidebar' }, nav);
}

/**
 * The filter input, built separately from sidebar() so the caller can place
 * it in the header instead of the rail — the sidebar is pure navigation, and
 * a "search this page" affordance conventionally lives with the rest of the
 * header controls, not buried at the top of the thing it searches.
 *
 * Takes the element sidebar() returned; filter() just needs something that
 * contains the nav markup, and the sidebar aside qualifies as well as the
 * inner <nav> would.
 */
export function searchField(sidebarEl) {
    // The icon is decorative (the input's own aria-label names the field), so
    // it stays out of the accessibility tree.
    return el('div', { class: 'site-header__field' },
        el('pl-icon', {
            class: 'site-header__field-icon',
            icon: 'search',
            size: '1rem',
        }),
        el('input', {
            class: 'site-header__search',
            type: 'search',
            placeholder: 'Filter components…',
            'aria-label': 'Filter components',
            onInput: event => filter(sidebarEl, event.target.value.trim().toLowerCase()),
        }),
    );
}

/** Hide non-matching links, then any group or section left with nothing shown. */
function filter(nav, query) {
    for (const item of nav.querySelectorAll('.docs-nav__list > li')) {
        item.hidden = query ? !item.textContent.toLowerCase().includes(query) : false;
    }

    for (const details of nav.querySelectorAll('.docs-nav__group')) {
        const visible = [...details.querySelectorAll('li')].some(li => !li.hidden);
        details.hidden = !visible;
        // Reveal matches inside collapsed groups; restore on an empty query.
        if (query) details.open = visible;
    }

    for (const section of nav.querySelectorAll('.docs-nav__block')) {
        const visible = [...section.querySelectorAll('.docs-nav__list > li')].some(li => !li.hidden);
        section.hidden = !visible;
    }
}

/** Mark the active link — called by the router after every navigation. */
export function setActive(root, slug) {
    for (const link of root.querySelectorAll('.docs-nav__link')) {
        const active = link.dataset.slug === slug;
        if (active) {
            link.setAttribute('aria-current', 'page');
            link.closest('.docs-nav__group')?.setAttribute('open', '');
        } else {
            link.removeAttribute('aria-current');
        }
    }
}
