// ------------------------------
// createRouter — client-side routing
// ------------------------------
// The plumbing every single-page view needs and nobody enjoys writing twice:
// intercept in-app links, keep the URL and the view in step through Back and
// Forward, and move focus so the change is not silent to a screen reader.
//
//   const router = createRouter({
//       base: '/app',
//       outlet: document.querySelector('main'),
//       routes: [
//           { path: '/',            module: './views/home.mjs' },
//           { path: '/users/:id',   module: './views/user.mjs' },
//           { path: '/files/*',     module: './views/file.mjs' },
//       ],
//       render: match => import(match.module).then(m => m.default(match)),
//   });
//
//   router.start();
//
// What it deliberately does NOT do: fetch data, cache views, own state, or
// render anything itself. `render` returns a node and the router puts it in the
// outlet. Everything above that line is your application, and a router that
// guesses at it becomes a framework.
//
// Views are LAZY by convention: a route names a module and `render` imports it
// on first visit, so the browser's own module loader is the code-splitter. No
// bundler and no manifest are involved.

import { withViewTransition } from '../decorators/withViewTransitions.mjs';

/** Trailing slashes are noise: "/a/" and "/a" are the same route. */
const normalise = path => path.replace(/\/+$/, '') || '/';

/**
 * Turn a route pattern into a matcher.
 *
 * `:name` captures one segment, `*` captures the rest. Two forms is the whole
 * grammar on purpose — anything more expressive is a job for `resolve`, where
 * you have real code instead of a string to encode the rule in.
 */
function compile(pattern) {
    const params = [];

    const source = normalise(pattern || '/')
        // Escape regex metacharacters, leaving `*` and `:` to mean what they
        // mean in a route pattern rather than what they mean in a RegExp.
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\/:([A-Za-z0-9_]+)/g, (_, name) => {
            params.push(name);
            return '/([^/]+)';
        })
        .replace(/\*/g, () => {
            params.push('rest');
            return '(.*)';
        });

    return { pattern: new RegExp(`^${source}$`), params };
}

/**
 * @param {object}      options
 * @param {Element}     options.outlet      where a rendered view is placed
 * @param {Array}       [options.routes]    `[{ path, ...anything }]`; the rest of
 *                                          each object is passed through to `render`
 * @param {string}      [options.base]      path prefix owned by this router; links
 *                                          outside it navigate for real
 * @param {Function}    options.render      `(match) => Node | Promise<Node>`
 * @param {Function}    [options.resolve]   `(path) => route | null`, in place of
 *                                          pattern matching
 * @param {Function}    [options.fallback]  `(path) => Node` when nothing matches
 * @param {Function}    [options.onError]   `(error, path) => Node` when render throws
 * @param {Function}    [options.onNavigate] `(path, match) => void`, after every swap
 * @param {string|null} [options.focus]     selector focused after a swap, null to skip
 * @param {boolean}     [options.scroll]    scroll to top after a swap
 * @param {boolean}     [options.transition] use a view transition where supported
 */
export function createRouter({
    outlet,
    routes = [],
    base = '',
    render,
    resolve,
    fallback,
    onError,
    onNavigate,
    focus = 'h1',
    scroll = true,
    transition = true,
} = {}) {
    if (!outlet) throw new TypeError('createRouter: an `outlet` element is required');
    if (typeof render !== 'function') throw new TypeError('createRouter: `render` must be a function');

    const prefix = base.replace(/\/+$/, '');
    const compiled = routes.map(route => ({ route, ...compile(route.path ?? '/') }));

    let started = false;
    let current = null;
    // Only the newest navigation may paint. Without this, a slow view that was
    // navigated away from still lands in the outlet when its import finally
    // resolves, replacing the page the visitor is now on.
    let generation = 0;

    /** The router-relative path for a full pathname, or null if outside `base`. */
    function toLocal(pathname) {
        if (prefix && !pathname.startsWith(prefix)) return null;
        // A path equal to the base is the base's own root, not a sibling whose
        // name merely starts the same way: /appointments is not inside /app.
        const rest = pathname.slice(prefix.length);
        if (prefix && rest && !rest.startsWith('/')) return null;
        return normalise(rest || '/');
    }

    /** The full pathname for a router-relative path. */
    const toHref = path => (prefix + (path === '/' ? '' : path)) || '/';

    function match(path) {
        if (resolve) {
            const route = resolve(path);
            return route ? { ...route, path, params: {} } : null;
        }

        for (const { route, pattern, params } of compiled) {
            const found = pattern.exec(path);
            if (!found) continue;

            return {
                ...route,
                path,
                params: Object.fromEntries(params.map((name, i) => [name, decodeURIComponent(found[i + 1])])),
            };
        }

        return null;
    }

    async function paint(path) {
        const ticket = ++generation;
        const found = match(path);
        let node;

        try {
            node = found
                ? await render(found)
                : fallback?.(path) ?? null;
        } catch (error) {
            node = onError?.(error, path) ?? null;
            if (!onError) console.error(`[router] "${path}" failed to render`, error);
        }

        if (ticket !== generation) return;

        current = found;

        const swap = () => {
            if (node) outlet.replaceChildren(node);

            // A real navigation resets focus for free; an SPA has to do it by
            // hand, or a keyboard visitor is left in the old page's tab order
            // and a screen reader announces nothing at all.
            if (focus) {
                const target = (node ?? outlet).querySelector?.(focus);
                if (target) {
                    target.tabIndex = -1;
                    target.focus({ preventScroll: true });
                }
            }

            if (scroll) globalThis.scrollTo?.({ top: 0 });
        };

        if (transition) withViewTransition(swap);
        else swap();

        onNavigate?.(path, found);
    }

    function onClick(event) {
        // Leave anything the browser is about to handle differently alone:
        // a new tab, a download, a modified click, a non-primary button.
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const link = event.target.closest?.('a[href]');
        if (!link || link.target || link.hasAttribute('download')) return;
        if (link.getAttribute('rel') === 'external') return;

        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin) return;

        const path = toLocal(url.pathname);
        if (path === null) return;

        event.preventDefault();
        router.go(url.pathname + url.search + url.hash);
    }

    const onPopState = () => paint(toLocal(location.pathname) ?? '/');

    const router = {
        /** Begin intercepting links, and render the current URL. */
        start() {
            if (started) return router;
            started = true;

            // Capture phase: a click handler inside a component that stops
            // propagation should not be able to break site navigation.
            document.addEventListener('click', onClick, { capture: true });
            globalThis.addEventListener('popstate', onPopState);

            paint(toLocal(location.pathname) ?? '/');
            return router;
        },

        /** Undo start(): listeners removed, outlet left as it is. */
        stop() {
            document.removeEventListener('click', onClick, { capture: true });
            globalThis.removeEventListener('popstate', onPopState);
            started = false;
            return router;
        },

        /**
         * Navigate to a full pathname.
         * @param {string} to
         * @param {{ replace?: boolean, history?: boolean }} [options]
         */
        go(to, { replace = false, history: push = true } = {}) {
            const url = new URL(to, location.href);

            if (push && url.pathname + url.search !== location.pathname + location.search) {
                history[replace ? 'replaceState' : 'pushState'](null, '', url);
            }

            return paint(toLocal(url.pathname) ?? '/');
        },

        /** Re-render the current path, e.g. after the data behind it changed. */
        refresh: () => paint(toLocal(location.pathname) ?? '/'),

        /** The match currently painted, or null. */
        current: () => current,

        /** Router-relative path -> full pathname, for building hrefs. */
        href: toHref,

        /** Full pathname -> router-relative path, or null if outside `base`. */
        local: toLocal,
    };

    return router;
}

export default createRouter;
