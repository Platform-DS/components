# Component Authoring Guide

Building a component follows this order: pick the **anatomy** (Shadow vs Light DOM), design its **state**, wire up its **attributes and properties**, then apply **styling** appropriate to the DOM mode you chose. This guide covers all four in that order.

* * *


### Shadow DOM Component

Used for elements that need slots and encapsulation. Most application components will use Shadow DOM.

Component styles live in a sibling `_styles.mjs` module and are applied with a Constructable Stylesheet (`CSSStyleSheet` + `adoptedStyleSheets`). This is the recommended way to style Shadow DOM components — see [Sharing Styles (Shadow DOM)](#sharing-styles-shadow-dom) for why.

```js
// Imports
import { STYLES } from './_styles.mjs';

//Component Settings
const tagName = "element-name"; /* Must be lowercase and hyphenated */

//Shadow DOM
class ShadowElement extends HTMLElement {
    static #template = document.createElement("template");
    static #sheet = new CSSStyleSheet();

    static {
      this.#template.innerHTML = /*html*/`
        <div>
          <slot></slot>
        </div>
      `;
      this.#sheet.replaceSync(STYLES);
    }


    // Plain string attributes: list them directly.
    // For typed, reflected props, derive this from `props` instead — see
    // "Reflecting Properties & Attributes". Omit both this and
    // attributeChangedCallback when a component has no attributes.
    static observedAttributes = [];

    //onCreated
    constructor() {
      //Setup
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.adoptedStyleSheets = [ShadowElement.#sheet];
      this.shadowRoot.append(
        ShadowElement.#template.content.cloneNode(true)
      );
      
      //List of DOM References to be used in render function
      this.refs = {
        //button: this.shadowRoot.querySelector("button")
      };
    }

    //Required For Every Component
    render() {
      // Load once, update forever.
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        this.render();
    }

    connectedCallback() {
      console.log("Custom element added to page.");
      //Render Element
      this.render();
    }

    disconnectedCallback() {
      console.log("Custom element removed from page.");
    }

    connectedMoveCallback() {
      console.log("Custom element moved with moveBefore()");
    }

    adoptedCallback() {
      console.log("Custom element moved to new page.");
    }
}

customElements.define(tagName, ShadowElement);
```

`_styles.mjs` exports the CSS as a string:

```js
export const STYLES = /*css*/`
  :host {
    display: block;
  }
`;
```

---

### Light DOM Component

Used for elements that don't need slots or encapsulation such as global layout components or SEO friendly content.

```js
//Component Settings
const tagName = "name-tier";

class LightElement extends HTMLElement {
    static #template = document.createElement("template");
    
    static {
        this.#template.innerHTML = /*html*/`
          <div class=""></div>
        `;
    }

    //OnMounted
    connectedCallback() { 
        const fragment = LightElement.#template.content.cloneNode(true); 	  
        this.append(fragment); 
    }
}

customElements.define(tagName, LightElement);

```

* * *

## 2. State

A component's state can be thought of in three categories:

1. Public Reactive State
2. Private Internal State
3. Derived (Computed) State

Keeping these responsibilities separate makes components easier to understand, test, and maintain.

### Public Reactive State

Public reactive state is the API exposed by your component. It can be modified by consumers of the component and should trigger updates when it changes.

There are two ways to expose public state:

- **Attributes** — the HTML API
- **Properties** — the JavaScript API

Although they often represent the same concept, they are not the same thing. Attributes are always strings and live in the DOM, while properties can store any JavaScript value.

#### Attributes — HTML API

Attributes are useful when configuring a component declaratively in HTML.

```html
<ui-button
    data-count="10"
    data-active>
</ui-button>
```

Attributes are ideal for:

- Initial component configuration (hydration)
- Server-side rendering (SSR)
- Simple values such as strings, numbers, and boolean flags
- Values that should be visible in the DOM

To observe attribute changes, implement `attributeChangedCallback()`.

```js
class ShadowElement extends HTMLElement {

    static observedAttributes = [
        "data-count",
        "data-active"
    ];

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        this.render();
    }

    render() {
        // Load once, update forever.
    }

}
```

#### Using `dataset`

When working with `data-*` attributes, use the `dataset` API instead of calling `getAttribute()` and `setAttribute()` directly.

```js
element.dataset.count = "10";

console.log(element.dataset.count);
```

is equivalent to:

```js
element.setAttribute("data-count", "10");

console.log(
    element.getAttribute("data-count")
);
```

> **Important:** All HTML attributes—including `data-*` attributes—are always stored as **strings**.

For example:

```js
element.dataset.count = 10;

console.log(element.dataset.count);
```

Outputs:

```text
"10"
```

not

```text
10
```

Likewise:

```js
element.dataset.active = true;
```

becomes:

```text
"true"
```

For this reason, attributes often require parsing before they are used.


#### Properties — JavaScript API

Properties are useful when your component is being controlled from JavaScript.

Unlike attributes, properties can store any JavaScript value without serialization.

```js
button.count = 10;

button.active = true;

button.items = [];

button.user = {
    id: 1234
};
```

Properties are ideal for:

- Numbers
- Booleans
- Arrays
- Objects
- Functions
- Runtime application state


* * *

### Private Internal State

Private state contains implementation details that should never be accessed from outside the component.

Examples include:

- Cached DOM references
- Timers
- Animation state
- Internal flags
- Helper values

Use JavaScript private fields (`#`) whenever possible.

```js
class UiButton extends HTMLElement {

    #button;
    #animationFrame;
    #isAnimating = false;

}
```

Private methods can also help organize implementation details.

```js
class UiButton extends HTMLElement {

    #updateButtonState() {
        // Internal implementation
    }

}
```

Private state is not part of your component's public API.

* * *

### Derived (Computed) State

Derived state is **calculated** from existing state instead of being stored independently.

Rather than keeping duplicate values synchronized, compute them when needed using JavaScript getters.

```js
class UiButton extends HTMLElement {

    static props = {
        loading: { type: Boolean },
        disabled: { type: Boolean }
    };

    get isInteractive() {
        return !this.loading && !this.disabled;
    }

}
```

Here, `isInteractive` is derived from `loading` and `disabled`.

Because it is computed on demand, it can never become out of sync with the underlying state.

Think of getters as the native JavaScript equivalent of Vue's computed properties.

* * *

### State Summary

| State Type | Purpose | Examples |
|------------|---------|----------|
| Public Reactive State | Public component API | Attributes, Properties |
| Private Internal State | Internal implementation | `#button`, `#observer`, timers |
| Derived (Computed) State | Values calculated from other state | Getters such as `isInteractive` |

* * *

## 3. Reflecting Properties & Attributes

[Section 2](#2-state) established that attributes (the HTML API) and properties (the JavaScript API) often describe the same concept through two different surfaces. **Reflection** is the mechanism that keeps those two surfaces in sync: when the property changes, the attribute updates to match, and when the attribute changes, the property updates to match.

The base classes in `Library/_core/` implement all of this. You declare; they wire. This section describes the declaration model first, then the mechanism underneath it — because you will eventually need to debug the mechanism.

### When you need `props`, and when you don't

Most attributes don't need any of this. A plain attribute is a string — the default — so just list it in `observedAttributes` and read it where you need it:

```js
static observedAttributes = ["data-count", "data-active"];
```

The **only** reason to declare an attribute in `props` is so it reflects a property *and* adheres to a specific **type**. Reach for `props` when an attribute needs to:

- Stay in sync with a property so consumers can drive the component from either HTML or JavaScript.
- Land as a real type on the property side, even though the DOM only ever stores strings.
- Remain visible in the DOM so it can be targeted by CSS or read by tooling.

### Declare reflected props once

Describe each reflected member in a single static declaration, paired with the type to enforce and an optional default. Membership in `props` *is* the signal that a member reflects — there's no separate `reflect` flag to keep in sync.

```js
static props = {
    variant: { type: String,  default: 'primary' },
    loading: { type: Boolean, default: false },
    count:   { type: Number,  default: 0 },
};
```

Supported types are the real constructors: `String`, `Number`, `Boolean`, `Array`, `Object`. Arrays and objects round-trip through JSON when they cross into an attribute.

### Read and write through `this.props`

Values live on a `this.props` namespace rather than directly on the element:

```js
this.props.loading = true;   // reflects to the attribute
this.props.count;            // 42 — a Number, not "42"
this.props.count = 'banana'; // throws a TypeError
```

The namespace exists to prevent collisions. A component extending a native element already inherits dozens of real properties from it (`disabled`, `value`, `type`, `form`, …), and defining our own accessors on the instance would eventually clobber one of them. `this.props.x` can never collide with `this.disabled`.

> **Native attributes are not in `this.props`.** When a component extends a native primitive, the inherited native attributes are tagged `native: true` and reach the real element by direct delegation — you write `this.disabled`, not `this.props.disabled`, because that *is* the native property.

### Derive `observedAttributes` from the declaration

Every prop reflects, so the observed list is just its keys. The base classes do this for you:

```js
static get observedAttributes() {
    return Object.keys(this.props);
}
```

Adding a reflected prop automatically wires up its attribute; you never edit an array by hand. When a component has no attributes at all, omit both `observedAttributes` and `attributeChangedCallback` entirely.

### `props` vs `state`

Two declaration surfaces, both typed, differing only in whether the value belongs in the DOM:

| | `static props` | `static state` |
|---|---|---|
| Backed by an attribute | Yes, reflected both ways | No |
| Visible in the DOM | Yes | No |
| Set from HTML | Yes | No |
| Read/write at | `this.props.x` | `this.state.x` |
| Triggers `render()` | Yes | Yes |

Use `props` for anything a consumer should be able to set in markup. Use `state` for internal values that should still repaint — an open/closed flag, a hover index, a cached fetch result.

```js
static state = {
    activeIndex: { type: Number, default: 0 },
    items:       { type: Array,  default: [] },
};
```

### The mechanism: one direction of truth

This is the part worth understanding, because it's what keeps reflection from looping.

**The attribute is canonical.** The property setter does not store a value — it writes the *attribute*. `attributeChangedCallback` is what writes the value into the backing store and calls `render()`.

```
this.props.loading = true
        │
        ▼
  setAttribute('loading', '')
        │
        ▼
  attributeChangedCallback()
        │
        ├─ store the coerced value
        └─ render()
```

Because updates only ever travel that one direction, there is no property→attribute→property ping-pong to guard against. The classic bug — a setter reflecting to an attribute whose callback calls the setter again — is structurally impossible rather than defended against with equality checks.

Two details follow from this:

- `attributeChangedCallback` still early-returns on `oldValue === newValue`, but only to skip redundant *repaints*, not to break a loop.
- A bad value from an attribute **logs** instead of throwing. `attributeChangedCallback` runs inside the browser's own callback queue, where an exception is swallowed and the element is left half-updated. Direct JS misuse via a prop setter still throws, because there the caller can actually catch it.

### What this looks like in a component

Extending a base class, the whole declaration is this:

```js
export class Button extends ButtonElement {
    static props = {
        ...ButtonElement.props,              // native <button> surface
        variant: { type: String,  default: 'primary' },
        loading: { type: Boolean, default: false },
    };

    render() {
        const { button } = this.refs;
        button.toggleAttribute('aria-busy', this.props.loading);
        button.disabled = this.disabled || this.props.loading;
    }
}
```

`render()` is the only method that writes to the DOM. It runs on connect and after every observed attribute change, so it must be safe to call repeatedly — update what exists rather than rebuilding it.

### Doing it by hand

If you're writing a component that extends `HTMLElement` directly, this is what the base class is doing for you. Worth reading once:

```js
class MyButton extends HTMLElement {
    static props = {
        loading: { type: Boolean }
    };

    static get observedAttributes() {
        return Object.keys(MyButton.props);
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._loading = false;
    }

    get loading() {
        return this._loading;
    }

    set loading(value) {
        const { type } = MyButton.props.loading;
        if (value?.constructor !== type) {
            console.warn(`loading must be a ${type.name}, got`, typeof value);
            return;
        }
        // Write the ATTRIBUTE, not the field — attributeChangedCallback below
        // is what updates state and repaints.
        this.toggleAttribute('loading', value);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name in MyButton.props) {
            // Boolean attributes: presence = true, absence = null
            this._loading = newValue !== null;
        }
        this.render();
    }

    render() {
        this.shadowRoot
            .querySelector('button')
            .toggleAttribute('aria-busy', this.loading);
    }
}

customElements.define('my-button', MyButton);
```

> **Boolean vs. non-Boolean attributes.** The example uses `toggleAttribute` and `newValue !== null` because a Boolean's truth is its *presence* in the DOM. For a `Number` or `String` prop, reflect with `setAttribute(name, value)` and parse on the way back in — e.g. `this._count = Number(newValue)` — so the property still lands as the declared type.

In practice, extend `BaseElement` or a native primitive instead and skip all of it.

* * *

## 4. Styling

For naming conventions, cascade layers, and BEM usage, see [css-architecture.md](./css-architecture.md). This section covers how styles are *shared* across the two DOM modes.

### Sharing Styles (Light DOM)

Because Light DOM lives in the main document, style sharing is essentially unrestricted. Every component participates in the normal CSS cascade, so styles can come from many different places.

You can:

- Import a stylesheet into your application.
- Include global styles in your page.
- Bundle component styles into your main CSS file.
- Load styles from a CDN or design system.
- Inherit styles from parent elements.

Since everything shares the same document, every component can see the same CSS.

```text
Document
├── app.css
├── typography.css
├── buttons.css
├── forms.css
└── <light-component>
```

This makes style sharing extremely simple and efficient because the browser only has to load each stylesheet once.

The tradeoff is that there is **no encapsulation**. Any selector can affect any element if it is specific enough.

For example:

```css
button {
  color: red;
}

.card button {
  color: blue;
}

#app button {
  color: green;
}
```

All of these selectors are capable of affecting buttons inside your component.

Because of this, Light DOM projects typically adopt a naming convention such as **BEM** or another CSS architecture to reduce collisions.

* * *

### Sharing Styles (Shadow DOM)

Shadow DOM flips the model.

Each component owns its own isolated stylesheet, so styles are **not inherited from the page** like they are in Light DOM.

For example, this global stylesheet:

```css
button {
  color: red;
}
```

will **not** style a `<button>` inside a Shadow DOM component.

The Shadow DOM intentionally blocks the normal CSS cascade to provide true encapsulation.

There are only a few exceptions that cross the Shadow boundary:

- CSS Custom Properties (`--color-primary`)
- Certain inherited properties (such as `color`, `font-family`, etc.)
- Styling the host element itself
- Explicit APIs such as `::part()` and `::slotted()`

### Recommended approach: Constructable Stylesheets

Do **not** inject a `<style>` tag into the shadow root for each instance. Instead, use [Constructable Stylesheets](https://web.dev/articles/constructable-stylesheets): keep CSS in an external JS module, build one `CSSStyleSheet` shared by the class, and assign it with `adoptedStyleSheets`.

This is the suggested pattern for every Shadow DOM component in this project.

#### 1. External styles module

Each component directory includes a sibling `_styles.mjs` that exports its CSS as a string:

```txt
components/collection/card/
  index.mjs
  _meta.mjs
  _styles.mjs
```

```js
// _styles.mjs
export const STYLES = /*css*/`
  :host {
    display: block;
  }

  .card {
    /* ... */
  }
`;
```

Keeping styles outside the component class:

- Avoids duplicating CSS text per instance
- Makes the stylesheet easy to review and edit
- Lets the build / editor treat it as CSS (via the `/*css*/` tag)

#### 2. One shared `CSSStyleSheet` per component class

Create the sheet as a static private field and fill it once in a `static {}` block:

```js
import { STYLES } from './_styles.mjs';

class ShadowElement extends HTMLElement {
    static #sheet = new CSSStyleSheet();

    static {
      this.#sheet.replaceSync(STYLES);
    }
}
```

The browser parses the CSS once. Every instance reuses the same sheet object.

#### 3. Adopt the sheet on the shadow root

In the constructor, after `attachShadow`, assign the sheet before appending template content:

```js
constructor() {
  super();
  this.attachShadow({ mode: "open" });
  this.shadowRoot.adoptedStyleSheets = [ShadowElement.#sheet];
  this.shadowRoot.append(
    ShadowElement.#template.content.cloneNode(true)
  );
}
```

### Sharing styles across components

Because components cannot simply "reuse" global CSS, cross-cutting styles are organized into reusable modules.

For example:

```js
import base from "./base.mjs";
import buttons from "./buttons.mjs";
import typography from "./typography.mjs";
```

Each module is converted into a `CSSStyleSheet` the same way as the component-local sheet:

```js
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(base);
```

This provides many of the same performance benefits as global CSS while preserving Shadow DOM encapsulation.

For larger projects, it's common to split styles into reusable layers:

- Base styles
- Typography
- Layout utilities
- Theme variables
- Component-specific styles

These can then be combined as needed:

```js
this.shadowRoot.adoptedStyleSheets = [
  baseSheet,
  typographySheet,
  themeSheet,
  ShadowElement.#sheet
];
```

Unlike Light DOM, these shared styles are **only available to the components that explicitly adopt them**, giving you complete control over where CSS is applied.
