// ------------------------------
// props — the typed declaration model, shared by every base class
// ------------------------------
// One implementation of "declare it once, get a typed value" serving both
// authoring paths: createNativeElement (components wrapping a real <button>,
// <input>, …) and BaseElement (components that are their own markup). Keeping
// it here means the contract in component-authoring-guide.md §3 has exactly
// one implementation.
//
// Two surfaces, both typed:
//   static props  — attribute-backed. The ATTRIBUTE is canonical: the getter
//                   reads a store, the setter writes the attribute, and
//                   attributeChangedCallback writes the store back. That one
//                   direction of truth is what stops the classic reflection
//                   ping-pong, without needing equality guards on both sides.
//   static state  — JS-only. No attribute, no reflection, repaints on change.

// Authors declare types with real constructors (Boolean, Number, String, Array,
// Object). htmlElementSpec declares them as string tags instead — deliberately,
// since that table is a serializable data contract. Both normalize to one tag.
const TYPE_TAGS = new Map([
    [Boolean, 'boolean'],
    [Number, 'number'],
    [String, 'string'],
    [Array, 'array'],
    [Object, 'object'],
]);

export const typeTagOf = type => (typeof type === 'string' ? type : TYPE_TAGS.get(type) ?? 'string');

/** A readable name for the declared type, for error messages. */
export const typeNameOf = type => (typeof type === 'string' ? type : type?.name ?? String(type));

/** The dataset name for an attribute: data-count -> count, data-user-id -> userId. */
export const dataKey = name => name.startsWith('data-')
    ? name.slice(5).replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase())
    : name;

/**
 * Coerce a raw value (attribute string or JS value) to its declared type,
 * throwing on an invalid one — the "wrap in String()/Number()/… or error out"
 * contract. Absent (null) resolves to false for booleans, else null.
 */
export function coerceValue(raw, type) {
    const tag = typeTagOf(type);
    if (raw == null) return tag === 'boolean' ? false : null;
    switch (tag) {
        case 'number': {
            const number = Number(raw);
            if (raw === '' || Number.isNaN(number)) throw new TypeError(`Expected a number, received ${JSON.stringify(raw)}.`);
            return number;
        }
        case 'boolean':
            return raw === '' || raw === true || raw === 'true';
        case 'object':
        case 'array': {
            const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            const ok = tag === 'array' ? Array.isArray(parsed) : (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed));
            if (!ok) throw new TypeError(`Expected ${tag === 'array' ? 'an array' : 'an object'}.`);
            return parsed;
        }
        default:
            return String(raw);
    }
}

/** Convert a coerced value back to its attribute string form (null = remove it). */
export function toAttributeString(value, type) {
    const tag = typeTagOf(type);
    if (tag === 'boolean') return value ? '' : null;
    if (tag === 'object' || tag === 'array') return JSON.stringify(value);
    return String(value);
}

/**
 * Build the `this.props` namespace for a host element.
 *
 * `skip` lets createNativeElement exclude spec-derived native attributes,
 * which reach the internal element by delegation instead.
 */
export function buildProps(host, store, declarations = {}, skip = () => false) {
    const props = {};

    for (const [name, config] of Object.entries(declarations)) {
        if (skip(config)) continue;
        const key = dataKey(name);

        store[key] = coerceValue(
            host.hasAttribute(name) ? host.getAttribute(name) : (config.default ?? null),
            config.type,
        );

        Object.defineProperty(props, key, {
            enumerable: true,
            get: () => store[key],
            set: value => {
                const attribute = toAttributeString(coerceValue(value, config.type), config.type);
                if (attribute === null) host.removeAttribute(name);
                else host.setAttribute(name, attribute);
            },
        });
    }

    return props;
}

/** Build the `this.state` namespace — typed slots that repaint on change. */
export function buildState(host, store, declarations = {}) {
    const state = {};

    for (const [key, config] of Object.entries(declarations)) {
        store[key] = coerceValue(config.default ?? null, config.type);

        Object.defineProperty(state, key, {
            enumerable: true,
            get: () => store[key],
            set: value => {
                const coerced = coerceValue(value, config.type);
                if (store[key] === coerced) return; // no-op on same value
                store[key] = coerced;
                host.render();
            },
        });
    }

    return state;
}

/**
 * Sync one changed attribute into its typed store slot. Returns true when the
 * name was a declared prop (so the caller knows the change was ours).
 *
 * A bad value logs rather than throwing: attributeChangedCallback runs inside
 * the browser's own callback queue, where an exception is swallowed and the
 * element is left half-updated. Direct JS misuse via a prop setter still throws.
 */
export function syncAttribute(host, store, config, name, newValue) {
    if (!config) return false;
    try {
        store[dataKey(name)] = coerceValue(newValue, config.type);
    } catch (error) {
        console.error(`[${host.localName}] ${name}: ${error.message} (expected ${typeNameOf(config.type)})`);
    }
    return true;
}
