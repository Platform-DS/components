// ------------------------------
// Tests — the typed props/state model
// ------------------------------
// Covers the contract in component-authoring-guide.md §3: types are enforced,
// props reflect to attributes in both directions, state never touches the DOM,
// and observedAttributes derives from the declaration.
//
// Run: npm test

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// jsdom isn't a dependency of this package — the library ships zero — so it's
// resolved from wherever the developer already has it. Missing it SKIPS the
// suite rather than failing it, so `npm test` on a fresh clone reports honestly
// instead of red.
//
// ESM ignores NODE_PATH, so an out-of-tree copy has to be pointed at
// explicitly:
//   JSDOM=/path/to/node_modules/jsdom/lib/api.js npm test
//
// This runs at module scope, not in before(): node:test needs `skip` as a
// BOOLEAN when the describe() is declared. A function there is merely truthy,
// which silently skips everything.
let BaseElement, define;
let skip = false;

/** First importable candidate wins. */
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
    const dom = new JSDOM('<!doctype html><body></body>', { pretendToBeVisual: true });

    for (const key of ['window', 'document', 'HTMLElement', 'customElements', 'CustomEvent', 'Event', 'Node']) {
        globalThis[key] = key === 'window' ? dom.window : dom.window[key];
    }

    ({ BaseElement, define } = await import('../Library/_core/elements/BaseElement.mjs'));
} catch (error) {
    skip = 'jsdom not found — set JSDOM=/path/to/jsdom/lib/api.js';
    console.error(`\n  Skipping DOM tests. ${error.message}\n`);
}

/** Define a throwaway component and return a connected instance. */
let seq = 0;
function mount({ props = {}, state = {}, mode = 'light', onRender } = {}) {
    const tag = `test-el-${++seq}`;

    class Test extends BaseElement {
        static mode = mode;
        static props = props;
        static state = state;
        render() { onRender?.(this); }
    }

    define(tag, Test);
    const el = document.createElement(tag);
    document.body.append(el);
    return el;
}

describe('typed props', { skip }, () => {
    test('defaults apply before any attribute is set', () => {
        const el = mount({ props: {
            label: { type: String, default: 'hi' },
            count: { type: Number, default: 0 },
            open: { type: Boolean, default: false },
        } });

        assert.equal(el.props.label, 'hi');
        assert.equal(el.props.count, 0);
        assert.equal(el.props.open, false);
    });

    test('observedAttributes derives from the declaration', () => {
        const el = mount({ props: { a: { type: String }, b: { type: Number } } });
        assert.deepEqual(el.constructor.observedAttributes, ['a', 'b']);
    });

    test('setting a prop reflects to the attribute', () => {
        const el = mount({ props: { count: { type: Number, default: 0 } } });
        el.props.count = 42;
        assert.equal(el.getAttribute('count'), '42');
    });

    test('setting the attribute updates the prop, typed', () => {
        const el = mount({ props: { count: { type: Number, default: 0 } } });
        el.setAttribute('count', '7');
        assert.equal(el.props.count, 7);
        assert.equal(typeof el.props.count, 'number');
    });

    test('booleans use presence, not a value', () => {
        const el = mount({ props: { open: { type: Boolean, default: false } } });

        el.props.open = true;
        assert.equal(el.getAttribute('open'), '');

        el.props.open = false;
        assert.equal(el.hasAttribute('open'), false);
    });

    test('arrays and objects round-trip through JSON', () => {
        const el = mount({ props: {
            items: { type: Array, default: [] },
            config: { type: Object, default: {} },
        } });

        el.props.items = ['a', 'b'];
        assert.equal(el.getAttribute('items'), '["a","b"]');
        assert.deepEqual(el.props.items, ['a', 'b']);

        el.props.config = { x: 1 };
        assert.deepEqual(el.props.config, { x: 1 });
    });

    test('an invalid value throws from the setter', () => {
        const el = mount({ props: { count: { type: Number, default: 0 } } });
        assert.throws(() => { el.props.count = 'banana'; }, TypeError);
    });

    test('an invalid ATTRIBUTE logs instead of throwing', () => {
        // attributeChangedCallback runs in the browser's callback queue, where
        // a throw is swallowed and leaves the element half-updated.
        const el = mount({ props: { count: { type: Number, default: 0 } } });
        const original = console.error;
        let logged = false;
        console.error = () => { logged = true; };

        try {
            assert.doesNotThrow(() => el.setAttribute('count', 'banana'));
            assert.equal(logged, true);
        } finally {
            console.error = original;
        }
    });

    test('an attribute present at upgrade wins over the default', () => {
        const tag = `test-upgrade-${++seq}`;
        class Test extends BaseElement {
            static mode = 'light';
            static props = { size: { type: String, default: 'md' } };
        }
        define(tag, Test);

        document.body.innerHTML = `<${tag} size="lg"></${tag}>`;
        assert.equal(document.querySelector(tag).props.size, 'lg');
    });
});

describe('state', { skip }, () => {
    test('is typed but never becomes an attribute', () => {
        const el = mount({ state: { internal: { type: Number, default: 5 } } });

        assert.equal(el.state.internal, 5);
        el.state.internal = 9;
        assert.equal(el.state.internal, 9);
        assert.equal(el.hasAttribute('internal'), false);
    });

    test('a change repaints', () => {
        let renders = 0;
        const el = mount({
            state: { n: { type: Number, default: 0 } },
            onRender: () => renders++,
        });

        const before = renders;
        el.state.n = 1;
        assert.ok(renders > before);
    });

    test('setting the same value is a no-op', () => {
        let renders = 0;
        const el = mount({
            state: { n: { type: Number, default: 0 } },
            onRender: () => renders++,
        });

        el.state.n = 1;
        const steady = renders;
        el.state.n = 1;
        assert.equal(renders, steady);
    });
});

describe('DOM mode', { skip }, () => {
    test('light mode attaches no shadow root', () => {
        const el = mount({ mode: 'light' });
        assert.equal(el.shadowRoot, null);
        assert.equal(el.root, el);
    });

    test('open mode attaches a shadow root and root points at it', () => {
        const el = mount({ mode: 'open' });
        assert.ok(el.shadowRoot);
        assert.equal(el.root, el.shadowRoot);
    });
});

describe('events and registration', { skip }, () => {
    test('emit dispatches a composed CustomEvent with detail', () => {
        const el = mount();
        let heard = null;
        el.addEventListener('pl-change', event => { heard = event.detail; });

        el.emit('pl-change', { value: 1 });
        assert.deepEqual(heard, { value: 1 });
    });

    test('emit crosses the shadow boundary and bubbles', () => {
        const el = mount({ mode: 'open' });
        let heard = false;
        document.body.addEventListener('pl-x', () => { heard = true; });

        el.emit('pl-x');
        assert.equal(heard, true);
    });

    test('define is guarded against a duplicate registration', () => {
        const tag = `test-dupe-${++seq}`;
        class A extends BaseElement {}
        define(tag, A);
        assert.doesNotThrow(() => define(tag, A));
    });
});
