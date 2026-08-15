// ------------------------------
// Tests — createRouter
// ------------------------------
// Covers the parts that are easy to get subtly wrong and hard to notice: route
// matching, which links are and are not intercepted, base containment, and the
// out-of-order render guard.
//
// Run: npm test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Same jsdom arrangement as props.test.mjs: resolved from wherever the
// developer already has it, and missing it SKIPS rather than fails. See the
// long note there for why `skip` is computed at module scope.
let createRouter, window, document;
let skip = false;

async function loadJSDOM() {
    const candidates = [process.env.JSDOM, 'jsdom'].filter(Boolean);
    const failures = [];

    for (const specifier of candidates) {
        try {
            return await import(specifier);
        } catch (error) {
            failures.push(`${specifier}: ${error.message.split('\n')[0]}`);
        }
    }

    throw new Error(failures.join('; '));
}

try {
    const { JSDOM } = await loadJSDOM();
    const dom = new JSDOM('<!doctype html><body><main id="outlet"></main></body>', {
        url: 'https://example.test/',
        pretendToBeVisual: true,
    });

    ({ window } = dom);
    ({ document } = dom.window);

    // In a browser globalThis IS window, which is what the router assumes. In
    // Node they're separate objects, so the handful of globals it reaches for
    // have to be pointed at the jsdom window by hand.
    globalThis.document = document;
    globalThis.location = window.location;
    globalThis.history = window.history;
    globalThis.addEventListener = window.addEventListener.bind(window);
    globalThis.removeEventListener = window.removeEventListener.bind(window);
    for (const key of ['HTMLElement', 'Event', 'MouseEvent', 'Node']) globalThis[key] = window[key];

    ({ createRouter } = await import('../Library/utilities/routing/createRouter.mjs'));
} catch (error) {
    skip = 'jsdom not found — set JSDOM=/path/to/jsdom/lib/api.js';
    console.error(`\n  Skipping router tests. ${error.message}\n`);
}

/** A router whose views are just their route name, so renders are observable. */
function mount({ routes = [], base = '', ...rest } = {}) {
    const outlet = document.getElementById('outlet');
    outlet.replaceChildren();

    const rendered = [];

    const router = createRouter({
        outlet,
        base,
        routes,
        transition: false,
        scroll: false,
        focus: null,
        render: match => {
            rendered.push(match);
            const node = document.createElement('div');
            node.textContent = match.name ?? match.path;
            return node;
        },
        ...rest,
    });

    return { router, outlet, rendered };
}

/** Click an <a href> the way a visitor would, with overrides for the guards. */
function click(href, init = {}) {
    const link = document.createElement('a');
    link.href = href;
    for (const [key, value] of Object.entries(init.attrs ?? {})) link.setAttribute(key, value);
    document.body.append(link);

    // Stop jsdom actually following the links the router is supposed to leave
    // alone — it can't navigate, and logs a "not implemented" error per click.
    // This runs in the TARGET phase, after the router's capture listener, so it
    // cannot mask what is being tested.
    link.addEventListener('click', event => event.preventDefault());

    link.dispatchEvent(new window.MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        button: 0,
        ...init.event,
    }));

    link.remove();
    return link;
}

describe('route matching', { skip }, () => {
    test('a static path matches exactly', async () => {
        const { router, rendered } = mount({ routes: [{ path: '/about', name: 'about' }] });
        window.history.replaceState(null, '', '/about');
        router.start();
        await null;

        assert.equal(rendered.at(-1).name, 'about');
        router.stop();
    });

    test('a trailing slash is the same route', async () => {
        const { router, rendered } = mount({ routes: [{ path: '/about', name: 'about' }] });
        window.history.replaceState(null, '', '/about/');
        router.start();
        await null;

        assert.equal(rendered.at(-1).name, 'about');
        router.stop();
    });

    test(':params are captured and decoded', async () => {
        const { router, rendered } = mount({
            routes: [{ path: '/users/:id/:tab', name: 'user' }],
        });
        router.start();
        await router.go('/users/a%20b/settings');

        assert.deepEqual(rendered.at(-1).params, { id: 'a b', tab: 'settings' });
        router.stop();
    });

    test('* captures the rest of the path', async () => {
        const { router, rendered } = mount({ routes: [{ path: '/files/*', name: 'file' }] });
        router.start();
        await router.go('/files/a/b/c.txt');

        assert.equal(rendered.at(-1).params.rest, 'a/b/c.txt');
        router.stop();
    });

    test('routes are tried in order, so the specific one can win', async () => {
        const { router, rendered } = mount({
            routes: [
                { path: '/users/new', name: 'new' },
                { path: '/users/:id', name: 'detail' },
            ],
        });
        router.start();
        await router.go('/users/new');

        assert.equal(rendered.at(-1).name, 'new');
        router.stop();
    });

    test('an unmatched path renders the fallback, not a stale view', async () => {
        let missed = null;
        const { router, outlet } = mount({
            routes: [{ path: '/about', name: 'about' }],
            fallback: path => {
                missed = path;
                const node = document.createElement('p');
                node.textContent = 'not found';
                return node;
            },
        });
        router.start();
        await router.go('/nowhere');

        assert.equal(missed, '/nowhere');
        assert.equal(outlet.textContent, 'not found');
        router.stop();
    });

    test('resolve replaces pattern matching entirely', async () => {
        const { router, rendered } = mount({
            resolve: path => (path === '/x' ? { name: 'from-resolve' } : null),
        });
        router.start();
        await router.go('/x');

        assert.equal(rendered.at(-1).name, 'from-resolve');
        router.stop();
    });
});

describe('base containment', { skip }, () => {
    test('routes are declared relative to base', async () => {
        const { router, rendered } = mount({
            base: '/app',
            routes: [{ path: '/settings', name: 'settings' }],
        });
        router.start();
        await router.go('/app/settings');

        assert.equal(rendered.at(-1).name, 'settings');
        router.stop();
    });

    test('the base itself is its own root', async () => {
        const { router, rendered } = mount({
            base: '/app',
            routes: [{ path: '/', name: 'home' }],
        });
        router.start();
        await router.go('/app');

        assert.equal(rendered.at(-1).name, 'home');
        router.stop();
    });

    test('a sibling that merely starts the same way is NOT inside it', () => {
        const { router } = mount({ base: '/app' });

        assert.equal(router.local('/app/settings'), '/settings');
        assert.equal(router.local('/app'), '/');
        // The bug a plain startsWith would ship:
        assert.equal(router.local('/appointments'), null);
        assert.equal(router.local('/other'), null);
    });

    test('href() and local() round-trip', () => {
        const { router } = mount({ base: '/app' });

        assert.equal(router.href('/settings'), '/app/settings');
        assert.equal(router.href('/'), '/app');
        assert.equal(router.local(router.href('/settings')), '/settings');
    });
});

describe('link interception', { skip }, () => {
    const routes = [{ path: '/a', name: 'a' }, { path: '/b', name: 'b' }];

    test('an in-app link is intercepted and navigates', async () => {
        const { router, rendered } = mount({ routes });
        window.history.replaceState(null, '', '/a');
        router.start();
        await null;

        click('/b');
        await null;
        await null;

        assert.equal(rendered.at(-1).name, 'b');
        assert.equal(window.location.pathname, '/b');
        router.stop();
    });

    test('these are all left to the browser', async () => {
        const { router, rendered } = mount({ routes, base: '/app' });
        router.start();
        await null;

        const before = rendered.length;

        click('https://elsewhere.test/b');            // another origin
        click('/outside-the-base');                   // outside base
        click('/app/b', { attrs: { target: '_blank' } });
        click('/app/b', { attrs: { download: '' } });
        click('/app/b', { attrs: { rel: 'external' } });
        click('/app/b', { event: { metaKey: true } });
        click('/app/b', { event: { ctrlKey: true } });
        click('/app/b', { event: { shiftKey: true } });
        click('/app/b', { event: { button: 1 } });
        await null;

        assert.equal(rendered.length, before);
        router.stop();
    });

    test('stop() releases the listeners', async () => {
        const { router, rendered } = mount({ routes });
        router.start();
        await null;
        router.stop();

        const before = rendered.length;
        click('/b');
        await null;

        assert.equal(rendered.length, before);
    });
});

describe('history', { skip }, () => {
    test('go() pushes an entry, and popstate renders it back', async () => {
        const { router, rendered } = mount({
            routes: [{ path: '/a', name: 'a' }, { path: '/b', name: 'b' }],
        });
        window.history.replaceState(null, '', '/a');
        router.start();
        await null;

        await router.go('/b');
        assert.equal(rendered.at(-1).name, 'b');

        // jsdom traverses history on a task, so wait for the event itself
        // rather than guessing at a delay.
        const popped = new Promise(resolve => window.addEventListener('popstate', resolve, { once: true }));
        window.history.back();
        await popped;
        await null;

        assert.equal(window.location.pathname, '/a');
        assert.equal(rendered.at(-1).name, 'a');
        router.stop();
    });

    test('history: false renders without touching the URL', async () => {
        const { router, rendered } = mount({
            routes: [{ path: '/a', name: 'a' }, { path: '/b', name: 'b' }],
        });
        window.history.replaceState(null, '', '/a');
        router.start();
        await null;

        await router.go('/b', { history: false });

        assert.equal(rendered.at(-1).name, 'b');
        assert.equal(window.location.pathname, '/a');
        router.stop();
    });

    test('current() reports the painted match', async () => {
        const { router } = mount({ routes: [{ path: '/a', name: 'a' }] });
        router.start();
        await router.go('/a');

        assert.equal(router.current().name, 'a');
        router.stop();
    });
});

describe('render lifecycle', { skip }, () => {
    test('a slow view that was navigated away from never lands', async () => {
        const outlet = document.getElementById('outlet');
        outlet.replaceChildren();

        const release = {};
        const router = createRouter({
            outlet,
            transition: false,
            scroll: false,
            focus: null,
            routes: [{ path: '/slow', name: 'slow' }, { path: '/fast', name: 'fast' }],
            render: match => new Promise(resolve => {
                const node = document.createElement('div');
                node.textContent = match.name;
                if (match.name === 'slow') release.slow = () => resolve(node);
                else resolve(node);
            }),
        });

        router.start();

        const slow = router.go('/slow');
        const fast = router.go('/fast');
        await fast;

        // The slow view resolves only now, after the visitor has moved on.
        release.slow();
        await slow;

        assert.equal(outlet.textContent, 'fast');
        router.stop();
    });

    test('onError renders instead of the throw escaping', async () => {
        const outlet = document.getElementById('outlet');
        outlet.replaceChildren();

        const router = createRouter({
            outlet,
            transition: false,
            scroll: false,
            focus: null,
            routes: [{ path: '/boom' }],
            render: () => { throw new Error('nope'); },
            onError: error => {
                const node = document.createElement('p');
                node.textContent = `caught: ${error.message}`;
                return node;
            },
        });

        router.start();
        await router.go('/boom');

        assert.equal(outlet.textContent, 'caught: nope');
        router.stop();
    });

    test('focus moves to the new view heading', async () => {
        const outlet = document.getElementById('outlet');
        outlet.replaceChildren();

        const router = createRouter({
            outlet,
            transition: false,
            scroll: false,
            routes: [{ path: '/a' }],
            render: () => {
                const node = document.createElement('div');
                node.innerHTML = '<h1>Title</h1>';
                return node;
            },
        });

        router.start();
        await router.go('/a');

        assert.equal(document.activeElement.tagName, 'H1');
        router.stop();
    });

    test('a missing outlet or render is a loud error, not a silent no-op', () => {
        assert.throws(() => createRouter({ render: () => {} }), /outlet/);
        assert.throws(() => createRouter({ outlet: document.body }), /render/);
    });
});
