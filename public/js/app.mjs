// ------------------------------
// app: documentation SPA bootstrap
// ------------------------------
// Builds the shell once (sidebar + content outlet), then hands navigation to
// the Router. The shell is assembled here rather than written into
// documentation.html because the sidebar is generated from the Library tree:
// putting it in the HTML would mean maintaining the same list twice.

import Router, { href } from './Router.mjs';
import { sidebar, setActive } from './components/sidebar.mjs';
import { siteSearch } from './components/search.mjs';
import { initThemeToggle } from './theme.mjs';

// Registering the whole library up front: the docs demo every component, and
// a single import keeps the examples honest about what a consumer would write.
import '../../Library/index.mjs';

const MENU_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>`;

/**
 * Off-canvas navigation for small screens.
 *
 * The rail is a full-height panel that slides in from the left, with a
 * scrim behind it. Built here rather than in the HTML because, exactly as with
 * pl-header, the collapse CSS is gated on a flag this sets, so if the script
 * never runs, the rail stays a plain visible column instead of being stranded
 * off-screen behind a button that cannot work.
 */
function initOffCanvas(shell, nav) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'docs-nav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', nav.id ||= 'docs-sidebar');
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.innerHTML = MENU_ICON;

    const scrim = document.createElement('div');
    scrim.className = 'docs-scrim';
    scrim.hidden = true;

    const setOpen = open => {
        shell.classList.toggle('is-nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
        scrim.hidden = !open;
        // Only trap scrolling while the panel is actually over the content.
        document.body.style.overflow = open ? 'hidden' : '';
        // The search field used to live in this panel and took focus on open;
        // it's in the header now, so move focus to the first thing in the
        // panel instead: a group summary or, above "Guides", a plain link.
        if (open) nav.querySelector('summary, a')?.focus();
    };

    toggle.addEventListener('click', () => setOpen(!shell.classList.contains('is-nav-open')));
    scrim.addEventListener('click', () => setOpen(false));

    // Escape closes it, and focus returns to the control that opened it.
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && shell.classList.contains('is-nav-open')) {
            setOpen(false);
            toggle.focus();
        }
    });

    // Following a link should dismiss the panel rather than leave it covering
    // the page it just navigated to.
    nav.addEventListener('click', event => {
        if (event.target.closest('a')) setOpen(false);
    });

    document.querySelector('.site-header')?.prepend(toggle);
    shell.append(scrim);
    shell.classList.add('has-off-canvas');

    return { setOpen };
}

function boot() {
    initThemeToggle();

    const shell = document.querySelector('.docs');
    if (!shell) return;

    const nav = sidebar();
    const main = document.createElement('main');
    // dot-field is the shared masthead pattern (see styles/utilities).
    main.className = 'docs-main dot-field';
    main.id = 'main';

    shell.append(nav, main);

    // The field filters the sidebar (`nav`) but sits in the header, to the
    // right of the nav links and ahead of the theme toggle. Picking a result
    // goes through the router rather than a real navigation, so it doesn't
    // reload the SPA shell it's already standing in.
    const search = siteSearch({ sidebar: nav, navigate: slug => Router.go(href(slug)) });
    const headerNav = document.querySelector('.site-header__nav');
    headerNav?.insertBefore(search, headerNav.querySelector('.theme-toggle'));

    const offCanvas = initOffCanvas(shell, nav);

    Router.init(main, {
        onNavigate: slug => {
            setActive(nav, slug);
            offCanvas.setOpen(false);
        },
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
