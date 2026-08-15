// ------------------------------
// search: the site-wide component finder
// ------------------------------
// One field, shared by the docs header and the home header, built on
// pl-autocomplete: a real <input> plus a real <datalist>, so the suggestion
// popup, its filtering, and its keyboard handling are entirely the
// browser's — nothing here is a custom listbox.
//
// It does up to two things, depending on where it's placed:
//   - narrows a sidebar as you type, on the native `input` event
//   - jumps to a component when you commit an exact name, on `change` —
//     the browser's own moment for "a suggestion was picked, or you typed
//     one out and pressed Enter or moved on"
//
// The home page has no sidebar, so only the second applies there. That
// asymmetry is exactly why this takes `sidebar` as an option rather than
// assuming one exists: the same field, used two different amounts.

import { NAV } from '../nav.data.mjs';
import { GUIDES, UTILITIES, href } from '../Router.mjs';
import { filter as filterSidebar } from './sidebar.mjs';
import { el } from './doc.mjs';

/** Every named, reachable thing in the docs: guides, utilities, components. */
function index() {
    const entries = GUIDES.map(g => ({ name: g.title, slug: g.slug }));

    // Titled by export name, so searching "signal" or "createRouter" finds the
    // page — those are what a consumer knows the utility by, not its filename.
    // The overview's title is "Overview" too, so it's listed under a name that
    // says which one it is.
    for (const utility of UTILITIES) {
        entries.push({
            name: utility.slug === 'utilities' ? 'Utilities' : utility.title,
            slug: utility.slug,
        });
    }

    for (const surface of NAV) {
        for (const group of surface.groups) {
            for (const component of group.components) {
                // A "planned" component has no page yet — suggesting one
                // would send a search for it straight to a stub.
                if (component.status === 'planned') continue;
                entries.push({ name: component.tag, slug: component.tag });
            }
        }
    }

    return entries;
}

/**
 * The header search field.
 *
 * @param {object} [options]
 * @param {HTMLElement} [options.sidebar] the docs rail to narrow as the field
 *   is typed into. Omit on a page with no sidebar — the home page.
 * @param {(slug: string) => void} [options.navigate] called with the matched
 *   slug once a result is committed. Defaults to a real navigation, correct
 *   for the home page (a fresh load into the SPA); the docs page passes the
 *   router's own `go()` instead, so picking a result doesn't reload the shell
 *   it's already standing in.
 */
export function siteSearch({ sidebar, navigate = slug => { location.href = href(slug); } } = {}) {
    const entries = index();
    const bySlug = new Map(entries.map(entry => [entry.name, entry.slug]));
    const name = sidebar ? 'Filter components' : 'Search components';

    const autocomplete = el('pl-autocomplete', {
        placeholder: `${name}…`,
        onInput: event => {
            if (sidebar) filterSidebar(sidebar, event.target.value.trim().toLowerCase());
        },
        onChange: event => {
            const slug = bySlug.get(event.target.value.trim());
            if (slug != null) navigate(slug);
        },
    });
    autocomplete.options = entries.map(entry => entry.name);

    // pl-autocomplete's real <input> doesn't exist until it's connected
    // (see its own connectedCallback), so an aria-label set here — before
    // that — would land on nothing. A wrapping <label> sidesteps the timing
    // entirely: the association is resolved live, against whatever the
    // label's descendants are once the tree is actually in the document, the
    // same implicit wrapping pl-switch and pl-color-picker rely on for the
    // same reason.
    //
    // .sr-only goes on a SPAN around just the text, not the label itself —
    // it clips its whole subtree, and the label's other child is the real,
    // meant-to-be-visible input. Putting it on the label would hide that too.
    //
    // The icon is decorative — stays out of the accessibility tree.
    return el('div', { class: 'site-header__field' },
        el('pl-icon', { class: 'site-header__field-icon', icon: 'search', size: '1rem' }),
        el('label', {}, el('span', { class: 'sr-only' }, name), autocomplete),
    );
}
