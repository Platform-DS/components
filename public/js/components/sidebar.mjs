// ------------------------------
// sidebar — documentation navigation
// ------------------------------
// Built from the generated NAV tree, so its shape IS Library/components/.
// Groups are native <details> disclosures: open/closed state, keyboard
// support, and the accessible name all come from the platform. The filter
// input just hides non-matching links — no library, no virtual list.

import { NAV } from '../nav.data.mjs';
import { GUIDES, href } from '../Router.mjs';
import { el } from './doc.mjs';

/** One navigable entry. */
function link(slug, label, status) {
    return el('li', {},
        el('a', {
            class: 'docs-nav__link',
            href: href(slug),
            'data-slug': slug,
            'data-status': status === 'planned' ? 'planned' : null,
            title: status === 'planned' ? 'Scaffolded — not written yet' : null,
        },
            el('span', {}, label),
            status === 'planned' ? el('span', { class: 'docs-nav__badge' }, 'soon') : null,
        )
    );
}

/** A collapsible group of links. */
function group(name, items, { open = false } = {}) {
    return el('details', { class: 'docs-nav__group', open: open || null },
        el('summary', {}, name),
        el('ul', { class: 'docs-nav__list' }, items),
    );
}

export function sidebar() {
    const nav = el('nav', { class: 'docs-nav', 'aria-label': 'Documentation' },
        group('Guides', GUIDES.map(g => link(g.slug, g.title)), { open: true }),
        NAV.map(surface =>
            surface.groups.map(g =>
                group(
                    `${surface.name} / ${g.name}`,
                    g.components.map(c => link(c.tag, c.tag, c.status)),
                    // App inputs is where the written components live, so it
                    // opens by default rather than making the first visitor hunt.
                    { open: surface.name === 'app' && g.name === 'inputs' },
                )
            )
        ),
    );

    const search = el('input', {
        class: 'docs-sidebar__search',
        type: 'search',
        placeholder: 'Filter components…',
        'aria-label': 'Filter components',
        onInput: event => filter(nav, event.target.value.trim().toLowerCase()),
    });

    return el('aside', { class: 'docs-sidebar' }, search, nav);
}

/** Hide non-matching links, and any group left with nothing visible. */
function filter(nav, query) {
    for (const details of nav.querySelectorAll('.docs-nav__group')) {
        let visible = 0;

        for (const item of details.querySelectorAll('li')) {
            const match = !query || item.textContent.toLowerCase().includes(query);
            item.hidden = !match;
            if (match) visible++;
        }

        details.hidden = visible === 0;
        // Reveal matches inside collapsed groups; restore on an empty query.
        if (query) details.open = true;
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
