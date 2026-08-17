// ------------------------------
// sidebar: documentation navigation
// ------------------------------
// Built from the generated NAV tree, so its shape IS Library/components/:
// two surface sections (App, Content), each a header over its collapsible
// groups (Inputs, Surfaces, …). The surface name is a section header rather
// than a prefix on every group, so "Inputs" reads as "Inputs", not
// "app / inputs" ten times over.
//
// Groups are native <details> disclosures: open/closed state, keyboard
// support, and the accessible name all come from the platform.
//
// sidebar() builds the rail only. Filtering it is filter(), a separate
// export driven by the header search field (see components/search.mjs) —
// that field is shared with the home page, which has no rail at all, so it
// can't be built here.

import { NAV } from '../nav.data.mjs';
import { GUIDES, UTILITIES, href } from '../Router.mjs';
import { el } from './doc.mjs';

// Directory slugs are lowercase; a couple want a nicer display form. Exported:
// search.mjs uses the same names for its suggestion hints, so a component's
// group reads "Inputs" there too rather than "inputs".
const LABELS = { ui: 'UI', app: 'App', content: 'Content', pages: 'Page Templates' };

/**
 * Group order within a surface, where it should not be left to chance.
 *
 * NAV mirrors the directory, and a directory has no meaningful order — the
 * groups currently come out in whatever sequence their alphabetically-first
 * component happens to create them in. That is fine until it isn't: Page
 * Templates belongs at the END of Content, after the pieces you build a page
 * out of, because it is the thing you reach for once you know what the pieces
 * are. Ordering is presentation, so it lives here rather than in the generated
 * data. Anything unlisted keeps its existing position, after the named ones.
 */
const GROUP_ORDER = {
    content: ['sections', 'structure', 'pages'],
};

function ordered(surface) {
    const wanted = GROUP_ORDER[surface.name];
    if (!wanted) return surface.groups;

    const rank = name => (wanted.indexOf(name) === -1 ? wanted.length : wanted.indexOf(name));
    return [...surface.groups].sort((a, b) => rank(a.name) - rank(b.name));
}
export const label = name => LABELS[name] ?? name[0].toUpperCase() + name.slice(1);

/** One navigable entry. */
function link(slug, text, status) {
    return el('li', {},
        el('a', {
            class: 'docs-nav__link',
            href: href(slug),
            'data-slug': slug,
            'data-status': status === 'planned' ? 'planned' : null,
            title: status === 'planned' ? 'Scaffolded, not written yet' : null,
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
    // Order runs from what you read first to what you reach for last: the
    // guides, then the two component surfaces, then the utilities — which are
    // the only section you go looking for rather than browse into.
    const nav = el('nav', { class: 'docs-nav', 'aria-label': 'Documentation' },
        // Few and always relevant: a plain list, no disclosure.
        block('Overview',
            el('ul', { class: 'docs-nav__list' },
                GUIDES.map(g => link(g.slug, g.title))),
        ),
        // One section per surface, its groups nested beneath.
        NAV.map(surface =>
            block(label(surface.name),
                ordered(surface).map(g =>
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
        // Utilities are modules, not elements: no tag name and no place in the
        // NAV tree, so they get their own section rather than being wedged into
        // one. Listed by what you import, not by file name.
        block('Utilities',
            el('ul', { class: 'docs-nav__list' },
                UTILITIES.map(u => link(u.slug, u.title))),
        ),
        // Filtered to zero is a real, reachable state (search for a typo, or
        // for a word that just isn't a component name) — this is what fills
        // in rather than leaving a rail that has silently gone blank.
        el('p', { class: 'docs-nav__empty', hidden: true }),
    );

    return el('aside', { class: 'docs-sidebar' }, nav);
}

/**
 * Hide links that don't match `query`, then any group or section left with
 * nothing shown, then say so if that was everything.
 *
 * One function doing all three, not split across independent reactions to
 * the same query: they aren't independent — group and section visibility are
 * DERIVED from which links matched, and the empty message is derived from
 * both. A single pass keeps that dependency explicit instead of three
 * observers each re-deriving a state the others already computed.
 */
export function filter(root, query) {
    for (const item of root.querySelectorAll('.docs-nav__list > li')) {
        item.hidden = query ? !item.textContent.toLowerCase().includes(query) : false;
    }

    let anyVisible = false;
    for (const details of root.querySelectorAll('.docs-nav__group')) {
        const visible = [...details.querySelectorAll('li')].some(li => !li.hidden);
        details.hidden = !visible;
        anyVisible ||= visible;
        // Reveal matches inside collapsed groups; restore on an empty query.
        if (query) details.open = visible;
    }

    for (const section of root.querySelectorAll('.docs-nav__block')) {
        const visible = [...section.querySelectorAll('.docs-nav__list > li')].some(li => !li.hidden);
        section.hidden = !visible;
        anyVisible ||= visible;
    }

    const empty = root.querySelector('.docs-nav__empty');
    if (empty) {
        empty.hidden = !query || anyVisible;
        empty.textContent = `No components match "${query}".`;
    }
}

/** Mark the active link: called by the router after every navigation. */
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
