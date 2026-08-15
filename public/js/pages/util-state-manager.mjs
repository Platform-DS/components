// ------------------------------
// Documentation: stateManager
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'signal, computed, effect',
        lede: 'Reactive state in about 300 lines, with dependencies tracked automatically.',
    }),

    meta({
        'Import': '<code>utilities/observers/stateManager.mjs</code>',
        'Exports': '<code>signal</code>, <code>computed</code>, <code>effect</code>, <code>batch</code>, <code>defineStore</code>',
        'Depends on': '<em>nothing</em>',
    }),

    p(`A signal is a value that knows who is reading it. Read one inside an effect and the effect
       subscribes to it; write to it and the effect runs again. Nothing is declared: the graph is
       built by the act of reading.`),

    section('Usage'),

    code(`
        import { signal, computed, effect, batch } from
            '@platformdesign/components/utilities/observers/stateManager.mjs';

        const first = signal('Ada');
        const last  = signal('Lovelace');

        const full = computed(() => \`\${first.value} \${last.value}\`);

        effect(() => {
            document.title = full.value;
        });

        first.value = 'Grace';    // effect runs, title is "Grace Lovelace"
        first.value = 'Grace';    // nothing happens: same value
    `, 'js'),

    section('The four pieces'),

    table(
        ['Export', 'Signature', 'Description'],
        [
            { cells: ['<code>signal</code>', '<code>signal(initial) => { value }</code>', 'A readable, writable value. Assigning an equal value (<code>===</code>) notifies nobody.'] },
            { cells: ['<code>computed</code>', '<code>computed(fn) => { value }</code>', 'A derived value, lazy and cached: <code>fn</code> does not run until something reads it, and not again until a source changes. Read-only, and computeds chain.'] },
            { cells: ['<code>effect</code>', '<code>effect(fn) => stop</code>', 'Runs <code>fn</code> immediately, then again whenever anything it read changes. Returns its own teardown.'] },
            { cells: ['<code>batch</code>', '<code>batch(fn)</code>', 'Queue notifications until <code>fn</code> returns, so a run of writes settles before anything reacts.'] },
        ],
    ),

    section('Dependencies are re-collected on every run'),

    p(`An effect drops its old subscriptions and re-collects them each time it runs, so a branch
       that was not taken is not subscribed to. Here nothing happens when <code>name</code> changes
       while <code>loggedIn</code> is false, because that run never read it:`),

    code(`
        effect(() => {
            greeting.textContent = loggedIn.value ? \`Hi \${name.value}\` : 'Sign in';
        });
    `, 'js'),

    p(`The cost of that precision is the usual one: read a signal after an <code>await</code> and
       it is not tracked, because collection ends when the synchronous part of the function does.
       Read what you depend on up front.`),

    section('Batching'),

    p(`Every write notifies immediately by default. When several belong together, wrap them, and
       subscribers run once at the end rather than once per write:`),

    code(`
        batch(() => {
            cart.value = [];
            total.value = 0;
            coupon.value = null;
        });   // effects run here, once
    `, 'js'),

    p(`Effects are queued by function identity, which is what collapses them. That is also why an
       effect watching three signals is one subscriber rather than three, and runs once.`),

    section('Stores'),

    p(`<code>defineStore</code> is a lazy singleton: the setup function runs on first use, and
       every later call returns the same object. Enough structure to keep shared state in one
       place, and no more.`),

    code(`
        export const useCart = defineStore(() => {
            const items = signal([]);
            const total = computed(() => items.value.reduce((n, i) => n + i.price, 0));

            return {
                items,
                total,
                add: item => { items.value = [...items.value, item]; },
            };
        });

        // anywhere
        const cart = useCart();
        cart.add({ price: 12 });
    `, 'js'),

    callout('note', 'Signals hold immutable values',
        `<code>items.value.push(x)</code> notifies nobody: the array is the same array, so the
         identity check that makes repeated writes cheap also makes a mutation invisible. Assign a
         new value instead, as <code>add</code> does above. This is the one rule that catches
         people out.`),

    section('Cleaning up'),

    p(`<code>effect</code> returns its stop function, and <code>computed</code> has
       <code>.stop()</code>. In a component, tear down in <code>disconnectedCallback</code> or the
       effect outlives the element that made it:`),

    code(`
        connectedCallback() {
            this.#stop = effect(() => {
                this.textContent = count.value;
            });
        }

        disconnectedCallback() {
            this.#stop?.();
        }
    `, 'js'),

    section('Errors are contained'),

    p(`A throw inside an effect is logged, not propagated: creating an effect never throws at a
       call site that has nothing to do with the failure, and the effect stays subscribed and
       retries on the next change. A computed that throws stays stale, so the next read recomputes
       rather than serving a value that was never produced.`),

    section('When not to reach for this'),

    p(`Reactivity earns its keep when several things derive from one value and the derivations are
       independent. It costs more than it returns when there is one consumer and one producer: an
       event listener that sets <code>textContent</code> is already the whole feature, and wrapping
       it in a signal adds a graph to reason about with nothing to show for it.`),

    p(`This library's own components use no signals at all. Attributes are their reactive state,
       and <code>attributeChangedCallback</code> is the platform's own version of this idea. The
       utility is for your application state, which the platform does not have an opinion about.`),

    section('Next'),

    ul([
        '<a href="/documentation/utilities">Utilities</a>: the rest of them.',
        '<a href="/documentation/authoring">Authoring components</a>: how components handle their own state instead.',
    ]),
);
