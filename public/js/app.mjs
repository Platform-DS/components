// ------------------------------
// app — documentation SPA bootstrap
// ------------------------------
// Builds the shell once (sidebar + content outlet), then hands navigation to
// the Router. The shell is assembled here rather than written into
// documentation.html because the sidebar is generated from the Library tree —
// putting it in the HTML would mean maintaining the same list twice.

import Router from './Router.mjs';
import { sidebar, setActive } from './components/sidebar.mjs';
import { initThemeToggle } from './theme.mjs';

// Registering the whole library up front: the docs demo every component, and
// a single import keeps the examples honest about what a consumer would write.
import '../../Library/index.mjs';

function boot() {
    initThemeToggle();

    const shell = document.querySelector('.docs');
    if (!shell) return;

    const nav = sidebar();
    const main = document.createElement('main');
    main.className = 'docs-main';
    main.id = 'main';

    shell.append(nav, main);

    Router.init(main, {
        onNavigate: slug => setActive(nav, slug),
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
