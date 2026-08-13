// ------------------------------
// Scheduling
// ------------------------------

// Depth of the current batch() nesting. Above zero, notifications are queued
// instead of delivered, so a run of writes settles before anything reacts.
let depth = 0;

// Queued subscriber -> the arguments it will be called with. Keying by the
// subscriber itself is what collapses several writes into one call, and is
// why Effect and Computed each notify through ONE stable function identity
// rather than a fresh closure per dependency.
const pending = new Map();

// A subscriber that writes to a signal re-enters the drain. The cap turns a
// genuine cycle into one loud error instead of a frozen tab.
const MAX_PASSES = 10_000;

function deliver(fn, args) {
    try {
        fn(...args);
    } catch (err) {
        console.error('Signal error:', err);
    }
}

function notify(subscribers, args) {
    // Snapshot before notifying: an Effect re-runs by unsubscribing and
    // re-subscribing itself synchronously inside this same callback, and
    // Set#forEach visits entries added mid-iteration — without the snapshot,
    // that re-subscription is picked up immediately and recurses forever.
    for (const fn of [...subscribers]) {
        if (depth > 0) {
            // Keep the oldest `oldValue` and the newest `newValue`, so a
            // batched subscriber sees the whole span of the change. When one
            // subscriber watches several signals, the pair describes the last
            // one to change — effects ignore both arguments, so this only
            // concerns direct subscribe() callers.
            const queued = pending.get(fn);
            pending.set(fn, queued ? [args[0], queued[1]] : args);
        } else {
            deliver(fn, args);
        }
    }
}

function flush() {
    // Writes performed by a subscriber land back in `pending` rather than
    // recursing, because the drain itself counts as a batch.
    depth++;
    try {
        let passes = 0;
        while (pending.size) {
            if (++passes > MAX_PASSES) {
                console.error('Signal error: effects kept scheduling each other; dropping the queue.');
                pending.clear();
                break;
            }
            const queue = [...pending];
            pending.clear();
            for (const [fn, args] of queue) deliver(fn, args);
        }
    } finally {
        depth--;
    }
}

/**
 * Applies several writes as one update: subscribers run once, after the last
 * write, so they never observe a half-applied state. Returns whatever `fn`
 * returns, and nests safely.
 */
export function batch(fn) {
    depth++;
    try {
        return fn();
    } finally {
        depth--;
        if (depth === 0) flush();
    }
}

// ------------------------------
// Signal
// ------------------------------

class Signal {
    constructor(value) {
        this._value = value;
        this._subscribers = new Set();
    }

    get value() {
        if (Signal._currentEffect) {
            Signal._currentEffect._dependencies.add(this);
        }
        return this._value;
    }

    set value(newValue) {
        if (this._value === newValue) return;

        const oldValue = this._value;
        this._value = newValue;

        notify(this._subscribers, [newValue, oldValue]);
    }

    subscribe(fn) {
        this._subscribers.add(fn);
        return () => this._subscribers.delete(fn);
    }
}

Signal._currentEffect = null;

// ------------------------------
// Effect
// ------------------------------

class Effect {
    constructor(fn) {
        this._fn = fn;
        this._dependencies = new Set();
        this._cleanup = [];
        // One identity for every dependency. A fresh closure per subscription
        // would make an effect watching two signals look like two different
        // subscribers, and batching would run it twice.
        this._notify = () => this.run();
        this.run();
    }

    run() {
        // cleanup previous subscriptions
        this._cleanup.forEach((unsub) => unsub());
        this._cleanup = [];

        const prev = Signal._currentEffect;
        Signal._currentEffect = this;
        this._dependencies.clear();

        try {
            this._fn();
        } catch (err) {
            // Contained on every run, first included, so creating an effect
            // never throws at a call site that has nothing to do with the
            // failure. The effect stays alive and retries on the next change.
            console.error('Signal error:', err);
        } finally {
            Signal._currentEffect = prev;

            // Subscribe to new dependencies — in `finally`, because a throw
            // half way through `_fn` still leaves the dependencies it managed
            // to read. Resubscribing outside would be skipped on a throw, and
            // since the run began by unsubscribing from everything, the effect
            // would silently detach from the graph and never run again.
            this._dependencies.forEach((dep) => {
                this._cleanup.push(dep.subscribe(this._notify));
            });
        }
    }

    stop() {
        this._cleanup.forEach((fn) => fn());
        this._cleanup = [];
        this._dependencies.clear();
    }
}

// ------------------------------
// Computed
// ------------------------------

/**
 * A derived value that recomputes only when something reads it after one of
 * its sources changed. It is both a subscriber (to its sources) and a source
 * (to whatever reads it), so computed values chain.
 */
class Computed {
    constructor(fn) {
        this._fn = fn;
        this._value = undefined;
        this._stale = true;
        this._subscribers = new Set();
        this._dependencies = new Set();
        this._cleanup = [];
        // Stable identity, for the same reason as Effect#_notify.
        this._invalidate = () => {
            // Notify unconditionally rather than skipping while already
            // stale. Staleness cannot tell us whether subscribers consumed
            // the last notification: after a read that threw, this stays
            // stale forever, and skipping would strand every subscriber on
            // the failed value with no way to recover. Repeat notifications
            // inside a batch collapse in the pending queue anyway.
            this._stale = true;
            notify(this._subscribers, []);
        };
    }

    get value() {
        if (Signal._currentEffect) {
            Signal._currentEffect._dependencies.add(this);
        }
        if (this._stale) this._recompute();
        return this._value;
    }

    set value(_) {
        // Without this the assignment throws a far vaguer TypeError, since a
        // getter-only property is read-only under a module's strict mode.
        throw new TypeError('A computed value is read-only — write to the signals it derives from instead.');
    }

    _recompute() {
        this._cleanup.forEach((unsub) => unsub());
        this._cleanup = [];

        const prev = Signal._currentEffect;
        Signal._currentEffect = this;
        this._dependencies.clear();

        try {
            this._value = this._fn();
            // Only on success: a throw leaves this stale so the next read
            // retries the computation instead of serving a value that was
            // never produced.
            this._stale = false;
        } finally {
            Signal._currentEffect = prev;

            // In `finally` for the same reason as Effect#run — otherwise a
            // throw detaches the computed from its sources permanently.
            this._dependencies.forEach((dep) => {
                this._cleanup.push(dep.subscribe(this._invalidate));
            });
        }
    }

    subscribe(fn) {
        this._subscribers.add(fn);
        return () => this._subscribers.delete(fn);
    }

    stop() {
        this._cleanup.forEach((fn) => fn());
        this._cleanup = [];
        this._dependencies.clear();
        this._stale = true;
    }
}

// ------------------------------
// Public API
// ------------------------------

export function signal(initialValue) {
    return new Signal(initialValue);
}

export function effect(fn) {
    const e = new Effect(fn);
    return () => e.stop();
}

/**
 * Lazy and cached: `fn` does not run until the value is read, and then not
 * again until a source changes. Call `.stop()` to release its subscriptions
 * when the owner goes away.
 */
export function computed(fn) {
    return new Computed(fn);
}

// ------------------------------
// Store (Pinia-style)
// ------------------------------

export function defineStore(setup) {
    let store;

    return function useStore() {
        if (!store) {
            store = setup();
        }
        return (store);
    };
}
