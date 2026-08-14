// ------------------------------
// HTML Element Spec — master lookup for attributes, props, methods, events
// ------------------------------
// A growing contract of what each HTML element exposes. Start with `global`
// (everything inherits), `button`, and `input`; add keys as the system needs
// them (a, video, …). Consumers merge global + the element's own entry — see
// elementSpecFor / mergedSpecFor / booleanAttributesFor / valuedAttributeNamesFor.
//
// Every bucket is a UNIFORM array of { name, type, prop?, options? } so a
// consumer never has to branch on "string or object?":
//   reflected   — attribute <-> property. `name` is BOTH the attribute and the
//                 property; add `prop` only when the JS property name differs
//                 (class → className, readonly → readOnly, tabindex → tabIndex).
//   properties  — JS property only, no matching attribute (defaultValue, files…)
//   attributes  — attribute only, no matching property (capture)
//   prefixes    — string[] freeform attribute prefixes (data-, aria-)
//   methods     — string[] callable DOM methods
//   events      — string[] event names the element (or HTMLElement) fires
//
// `type` is a STRING tag, not a constructor — serializable (config is JSON, the
// designer consumes these), realm-safe, and Node-safe (no FileList/ValidityState
// globals). 'boolean' = presence attribute; 'string' / 'number' take a value;
// richer prop-only types keep their platform name ('FileList', 'ValidityState',
// 'Date') as documentation. `options` lists enumerated values (datalist hints).
//
// There is no runtime "is this attribute supported?" API — this table is the
// curated answer. Unknown names are still allowed at the call site (the designer
// lets authors type freely); this just supplies defaults/suggestions.

const frozen = (...entries) => Object.freeze(entries.map(entry => Object.freeze(entry)));

const EMPTY = Object.freeze({
    properties: Object.freeze([]),
    attributes: Object.freeze([]),
    reflected: Object.freeze([]),
    prefixes: Object.freeze([]),
    methods: Object.freeze([]),
    events: Object.freeze([]),
});

export const HTML_ELEMENT_SPEC = Object.freeze({
    global: Object.freeze({
        properties: frozen(
            { name: 'innerHTML', type: 'string' },
            { name: 'textContent', type: 'string' },
            { name: 'innerText', type: 'string' },
        ),
        attributes: Object.freeze([]),
        reflected: frozen(
            { name: 'class', prop: 'className', type: 'string' },
            { name: 'hidden', type: 'boolean' },
            { name: 'id', type: 'string' },
            { name: 'inert', type: 'boolean' },
            { name: 'itemid', type: 'string' },
            { name: 'part', type: 'string' },
            { name: 'role', type: 'string' },
            { name: 'slot', type: 'string' },
            { name: 'tabindex', prop: 'tabIndex', type: 'number' },
            { name: 'title', type: 'string' },
        ),
        prefixes: Object.freeze(['data-', 'aria-']),
        methods: Object.freeze(['focus', 'blur', 'click', 'animate']),
        events: Object.freeze([
            'click',
            'pointerdown', 'pointerup', 'pointermove',
            'pointerenter', 'pointerleave', 'pointercancel',
            'contextmenu', 'wheel',
            'keyup', 'keydown',
        ]),
    }),

    button: Object.freeze({
        properties: Object.freeze([]),
        attributes: Object.freeze([]),
        reflected: frozen(
            { name: 'aria-pressed', prop: 'ariaPressed', type: 'string', options: ['true', 'false', 'mixed'] },
            { name: 'autofocus', type: 'boolean' },
            { name: 'command', type: 'string' },
            { name: 'commandfor', prop: 'commandFor', type: 'string' },
            { name: 'disabled', type: 'boolean' },
            { name: 'form', type: 'string' },
            { name: 'formaction', prop: 'formAction', type: 'string' },
            { name: 'formenctype', prop: 'formEnctype', type: 'string' },
            { name: 'formmethod', prop: 'formMethod', type: 'string' },
            { name: 'formnovalidate', prop: 'formNoValidate', type: 'boolean' },
            { name: 'formtarget', prop: 'formTarget', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'popovertarget', prop: 'popoverTargetElement', type: 'string' },
            { name: 'popovertargetaction', prop: 'popoverTargetAction', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'value', type: 'string' },
        ),
        prefixes: Object.freeze([]),
        methods: Object.freeze([]),
        events: Object.freeze([]),
    }),

    input: Object.freeze({
        // JS property only — no matching attribute.
        properties: frozen(
            { name: 'defaultChecked', type: 'boolean' },
            { name: 'defaultValue', type: 'string' },
            { name: 'files', type: 'FileList' },
            { name: 'indeterminate', type: 'boolean' },
            { name: 'selectionStart', type: 'number' },
            { name: 'selectionEnd', type: 'number' },
            { name: 'selectionDirection', type: 'string' },
            { name: 'validity', type: 'ValidityState' },
            { name: 'validationMessage', type: 'string' },
            { name: 'willValidate', type: 'boolean' },
            { name: 'valueAsDate', type: 'Date' },
            { name: 'valueAsNumber', type: 'number' },
        ),
        // Attribute only — no matching property.
        attributes: frozen(
            { name: 'capture', type: 'string' },
        ),
        reflected: frozen(
            { name: 'accept', type: 'string' },
            { name: 'alt', type: 'string' },
            { name: 'autocomplete', type: 'string' },
            { name: 'checked', type: 'boolean' },
            { name: 'disabled', type: 'boolean' },
            { name: 'form', type: 'string' },
            { name: 'formaction', prop: 'formAction', type: 'string' },
            { name: 'formenctype', prop: 'formEnctype', type: 'string' },
            { name: 'formmethod', prop: 'formMethod', type: 'string' },
            { name: 'formnovalidate', prop: 'formNoValidate', type: 'boolean' },
            { name: 'formtarget', prop: 'formTarget', type: 'string' },
            { name: 'height', type: 'number' },
            { name: 'inputmode', prop: 'inputMode', type: 'string' },
            { name: 'list', type: 'string' },
            { name: 'max', type: 'string' },
            { name: 'maxlength', prop: 'maxLength', type: 'number' },
            { name: 'min', type: 'string' },
            { name: 'minlength', prop: 'minLength', type: 'number' },
            { name: 'multiple', type: 'boolean' },
            { name: 'name', type: 'string' },
            { name: 'pattern', type: 'string' },
            { name: 'placeholder', type: 'string' },
            { name: 'readonly', prop: 'readOnly', type: 'boolean' },
            { name: 'required', type: 'boolean' },
            { name: 'size', type: 'number' },
            { name: 'src', type: 'string' },
            { name: 'step', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'value', type: 'string' },
            { name: 'width', type: 'number' },
            { name: 'dirname', prop: 'dirName', type: 'string' },
        ),
        prefixes: Object.freeze([]),
        methods: Object.freeze([
            'checkValidity',
            'reportValidity',
            'setCustomValidity',
            'select',
            'setRangeText',
            'setSelectionRange',
            'showPicker',
        ]),
        events: Object.freeze([
            'beforeinput',
            'change',
            'input',
            'invalid',
            'select',
            'compositionstart',
            'compositionupdate',
            'compositionend',
        ]),
    }),

    a: Object.freeze({
        // URL decomposition + relList — properties with no matching attribute.
        properties: frozen(
            { name: 'origin', type: 'string' },
            { name: 'protocol', type: 'string' },
            { name: 'username', type: 'string' },
            { name: 'password', type: 'string' },
            { name: 'host', type: 'string' },
            { name: 'hostname', type: 'string' },
            { name: 'port', type: 'string' },
            { name: 'pathname', type: 'string' },
            { name: 'search', type: 'string' },
            { name: 'hash', type: 'string' },
            { name: 'text', type: 'string' },
            { name: 'relList', type: 'DOMTokenList' },
        ),
        attributes: Object.freeze([]),
        reflected: frozen(
            { name: 'href', type: 'string' },
            { name: 'target', type: 'string', options: ['_self', '_blank', '_parent', '_top'] },
            { name: 'rel', type: 'string' },
            { name: 'download', type: 'string' },
            { name: 'hreflang', type: 'string' },
            { name: 'ping', type: 'string' },
            { name: 'referrerpolicy', prop: 'referrerPolicy', type: 'string' },
            { name: 'type', type: 'string' },
        ),
        prefixes: Object.freeze([]),
        methods: Object.freeze([]),
        events: Object.freeze([]),
    }),

    textarea: Object.freeze({
        // `value`/`defaultValue` are properties — <textarea> has no value
        // attribute (its value is its text content).
        properties: frozen(
            { name: 'value', type: 'string' },
            { name: 'defaultValue', type: 'string' },
            { name: 'textLength', type: 'number' },
            { name: 'type', type: 'string' },
            { name: 'selectionStart', type: 'number' },
            { name: 'selectionEnd', type: 'number' },
            { name: 'selectionDirection', type: 'string' },
            { name: 'validity', type: 'ValidityState' },
            { name: 'validationMessage', type: 'string' },
            { name: 'willValidate', type: 'boolean' },
        ),
        attributes: Object.freeze([]),
        reflected: frozen(
            { name: 'autocomplete', type: 'string' },
            { name: 'cols', type: 'number' },
            { name: 'dirname', prop: 'dirName', type: 'string' },
            { name: 'disabled', type: 'boolean' },
            { name: 'form', type: 'string' },
            { name: 'maxlength', prop: 'maxLength', type: 'number' },
            { name: 'minlength', prop: 'minLength', type: 'number' },
            { name: 'name', type: 'string' },
            { name: 'placeholder', type: 'string' },
            { name: 'readonly', prop: 'readOnly', type: 'boolean' },
            { name: 'required', type: 'boolean' },
            { name: 'rows', type: 'number' },
            { name: 'wrap', type: 'string', options: ['soft', 'hard', 'off'] },
        ),
        prefixes: Object.freeze([]),
        methods: Object.freeze([
            'checkValidity',
            'reportValidity',
            'setCustomValidity',
            'select',
            'setRangeText',
            'setSelectionRange',
        ]),
        events: Object.freeze([
            'beforeinput',
            'change',
            'input',
            'invalid',
            'select',
            'compositionstart',
            'compositionupdate',
            'compositionend',
        ]),
    }),

    select: Object.freeze({
        // JS property only — <select> has no value/selectedIndex content
        // attributes; its value lives on the element.
        properties: frozen(
            { name: 'value', type: 'string' },
            { name: 'selectedIndex', type: 'number' },
            { name: 'length', type: 'number' },
            { name: 'options', type: 'HTMLOptionsCollection' },
            { name: 'selectedOptions', type: 'HTMLCollection' },
            { name: 'type', type: 'string' },
            { name: 'validity', type: 'ValidityState' },
            { name: 'validationMessage', type: 'string' },
            { name: 'willValidate', type: 'boolean' },
        ),
        attributes: Object.freeze([]),
        reflected: frozen(
            { name: 'autocomplete', type: 'string' },
            { name: 'disabled', type: 'boolean' },
            { name: 'form', type: 'string' },
            { name: 'multiple', type: 'boolean' },
            { name: 'name', type: 'string' },
            { name: 'required', type: 'boolean' },
            { name: 'size', type: 'number' },
        ),
        prefixes: Object.freeze([]),
        // `remove` is deliberately omitted — forwarding it would clobber the
        // host's own Element.remove(). Use el.options / el.native for that.
        methods: Object.freeze([
            'add',
            'item',
            'namedItem',
            'checkValidity',
            'reportValidity',
            'setCustomValidity',
            'showPicker',
        ]),
        // change/input compose already; invalid does not, so createNativeElement
        // re-emits it on the host.
        events: Object.freeze([
            'change',
            'input',
            'invalid',
        ]),
    }),

    img: Object.freeze({
        // Resolved/intrinsic state — read-only properties with no attribute.
        // createNativeElement mirrors that read-only-ness automatically (it
        // reads the native descriptor), so these stay getter-only on the host.
        properties: frozen(
            { name: 'complete', type: 'boolean' },
            { name: 'currentSrc', type: 'string' },
            { name: 'naturalWidth', type: 'number' },
            { name: 'naturalHeight', type: 'number' },
            { name: 'x', type: 'number' },
            { name: 'y', type: 'number' },
        ),
        attributes: Object.freeze([]),
        // The modern surface only — <img>'s deprecated presentational
        // attributes (align, border, hspace, vspace, longdesc, lowsrc, name)
        // are intentionally omitted; layout belongs in CSS.
        reflected: frozen(
            { name: 'alt', type: 'string' },
            { name: 'crossorigin', prop: 'crossOrigin', type: 'string', options: ['anonymous', 'use-credentials'] },
            { name: 'decoding', type: 'string', options: ['sync', 'async', 'auto'] },
            { name: 'fetchpriority', prop: 'fetchPriority', type: 'string', options: ['high', 'low', 'auto'] },
            { name: 'height', type: 'number' },
            { name: 'ismap', prop: 'isMap', type: 'boolean' },
            { name: 'loading', type: 'string', options: ['eager', 'lazy'] },
            { name: 'referrerpolicy', prop: 'referrerPolicy', type: 'string' },
            { name: 'sizes', type: 'string' },
            { name: 'src', type: 'string' },
            { name: 'srcset', type: 'string' },
            { name: 'usemap', prop: 'useMap', type: 'string' },
            { name: 'width', type: 'number' },
        ),
        prefixes: Object.freeze([]),
        methods: Object.freeze(['decode']),
        // Neither bubbles NOR composes, so createNativeElement re-emits both
        // on the host (see NON_COMPOSED_EVENTS) — without that, a `load`
        // listener on the custom element would never fire.
        events: Object.freeze(['load', 'error']),
    }),
});

/** The element's own entry (no global merge), or an empty stub if unknown. */
export function elementSpecFor(tagName) {
    const key = String(tagName ?? '').toLowerCase();
    return HTML_ELEMENT_SPEC[key] ?? EMPTY;
}

/** global + element buckets concatenated for one tag. */
export function mergedSpecFor(tagName) {
    const local = elementSpecFor(tagName);
    const g = HTML_ELEMENT_SPEC.global;
    return {
        properties: [...g.properties, ...local.properties],
        attributes: [...g.attributes, ...local.attributes],
        reflected: [...g.reflected, ...local.reflected],
        prefixes: [...g.prefixes, ...local.prefixes],
        methods: [...g.methods, ...local.methods],
        events: [...g.events, ...local.events],
    };
}

/** Every attribute-bearing entry for a tag (reflected + attribute-only). */
function attributeEntries(tag) {
    const spec = mergedSpecFor(tag);
    return [...spec.reflected, ...spec.attributes];
}

/** Boolean attribute names for an element (global + tag), presence-only. */
export function booleanAttributesFor(elementOrTag) {
    const tag = typeof elementOrTag === 'string' ? elementOrTag : (elementOrTag?.tagName ?? '');
    return attributeEntries(tag).filter(entry => entry.type === 'boolean').map(entry => entry.name);
}

/**
 * Valued attribute names (+ prefixes like "data-") suggested for an element.
 * Boolean attrs are excluded — those are toggles, not value fields.
 */
export function valuedAttributeNamesFor(elementOrTag) {
    const tag = typeof elementOrTag === 'string' ? elementOrTag : (elementOrTag?.tagName ?? '');
    const valued = attributeEntries(tag).filter(entry => entry.type !== 'boolean').map(entry => entry.name);
    return [...valued, ...mergedSpecFor(tag).prefixes];
}

/** True when `name` is a known boolean attribute for this element (or global). */
export function isBooleanAttribute(name, elementOrTag) {
    return booleanAttributesFor(elementOrTag).includes(name);
}
