# @platformdesign/components

Native web components. No build step, no framework, no dependencies.

```bash
npm install @platformdesign/components
```

```html
<script type="module">
    import '@platformdesign/components/pl-button';
</script>

<pl-button variant="primary">Save</pl-button>
```

That's the whole integration. The library ships standard ES modules and standard CSS, so a `<script type="module">` tag is a complete install — there is nothing to compile, configure, or keep current.

---

## Why

Every component library eventually asks you to adopt its ecosystem. This one asks you to use the browser's.

- **No toolchain.** Ship the source. It's ES modules and CSS.
- **No framework.** A custom element is an HTML element — it works in React, Vue, Angular, Svelte, Rails, Django, or a static file.
- **No theming API.** Custom properties are the only thing that crosses a shadow boundary, so they *are* the theming API. Override a token; every component follows.
- **No supply chain.** Zero dependencies means zero transitive dependencies. Nothing to audit, nothing to hijack upstream, no postinstall scripts.

---

## Usage

Import one component — this registers `<pl-button>` and nothing else:

```js
import '@platformdesign/components/pl-button';
```

Or register everything at once:

```js
import '@platformdesign/components';
```

Classes are exported too, for subclassing or `instanceof`:

```js
import { Button } from '@platformdesign/components';
```

The source path resolves as well, if you prefer knowing where a file lives:

```js
import '@platformdesign/components/app/inputs/pl-button';
```

### Styles

Components carry their own styles. The one stylesheet you load is the token file — the design tokens every component reads, and the entire theming surface.

```css
@import "@platformdesign/components/tokens.css";
```

It's optional: every component references tokens with fallbacks and renders correctly without it. Loading it (or your own theme) is what makes the set share one system.

### Theming

Platform Components is the sibling of [platformdesign.app](https://platformdesign.app). You design a system there, export it as CSS custom properties, and drop it in — the components read those exact token names, so an export is drop-in.

The contract is a naming convention: one prefix per type, no project namespace, so the tokens a designer produces and the tokens a component reads are the same tokens.

```css
:root {
    --color-primary: #2563EB;      /* solid fill for controls */
    --color-on-primary: #FFFFFF;   /* text carried on that fill */
    --color-surface: #FFFFFF;
    --color-ink: #111827;
    --size-16: 1rem;
    --border-radius-medium: 8px;
}
```

The package's `tokens.css` ships a deliberately **neutral** default — a conventional blue primary with green, amber, and red intents — so it reads as a starting point rather than as somebody else's brand. Point the contract tokens at your own values to re-theme everything.

A filled control always pairs an intent fill with its on-colour, and every on-colour is **white**, in light and dark alike. Dark text on a saturated fill is the usual way a button breaks when a theme flips, so that pairing is fixed rather than derived from the page's ink.

A theme is a **single palette**. There is no `light-dark()` in the tokens; "dark mode" is a different export swapped in (e.g. by toggling `data-theme` and re-pointing the semantic `--color-*` tokens). Components re-theme instantly because they read the names, not a scheme.

### Your tokens vs the components' tokens

Components never read the contract names directly. They read a parallel set of `--pl-*` aliases, and `tokens.css` points each one at its contract counterpart:

```css
:root {
    --color-primary: #2563EB;                 /* the contract */
    --pl-color-primary: var(--color-primary); /* what components read */
}
```

That one level of indirection gives you both halves of what you usually have to choose between:

- **Inheritance** — the alias resolves lazily, so whatever `--color-primary` computes to on your page is what components use. Load order doesn't matter.
- **Insulation** — the alias is a seam. If your application wants its own `--color-primary` for its own layout, distinct from the primary its components render with, pin `--pl-color-primary` instead and the two can diverge.

Keep `tokens.css` loaded — it *is* the bridge. Components fall back to built-in defaults when an alias is missing, so an export loaded on its own would be silently ignored.

For a one-off, each component also exposes `--<component>-*` hooks (`--button-background`, `--button-color`) that sit in front of the tokens.

---

## Repository layout

```
Library/                    the published package
  _core/
    elements/               base classes (BaseElement, ButtonElement, …)
    utilities/              createNativeElement, htmlElementSpec, props
    styles/                 tokens.css and shared style modules
  components/
    app/                    interactive UI — mostly Shadow DOM
      inputs/ ui/ surfaces/ navigation/ state/ media/
    content/                page content — Light DOM
      sections/ structure/ pages/
  utilities/                framework-free helpers

public/                     the documentation site
Developer_Docs/             authoring guide and architecture principles
scripts/                    dev server and metadata generation
```

### Shadow vs Light

The split that matters most:

- **`components/app/`** is interactive UI and uses **Shadow DOM** for style encapsulation.
- **`components/content/`** is page content and uses **Light DOM**, so it stays visible to the page's cascade, to search crawlers, and to browser translation.

Some app components are Light DOM too, when their whole purpose is a document-level relationship a shadow boundary would break — `<pl-label>` is the clearest case, since `<label>` association is scoped to a single DOM tree.

---

## Development

```bash
npm run dev        # serve the docs site at localhost:3000
npm test           # run the test suite
npm run exports    # regenerate package exports, barrel, and docs nav
```

The tests need a DOM. Since the package itself ships zero dependencies, jsdom isn't one either — point at a copy you already have, or the suite skips rather than fails:

```bash
JSDOM=/path/to/node_modules/jsdom/lib/api.js npm test
```

`npm run exports` reads `Library/components/` and rewrites three generated files: the `exports` map in `package.json`, the `Library/index.mjs` barrel, and `public/js/nav.data.mjs`. Run it after adding or removing a component directory — never edit those three by hand.

The dev server serves `Library/` directly, so the documentation imports the same source a consumer gets from npm. There is no build, and therefore no way for the docs to document a stale copy.

---

## Authoring a component

Declare typed props once; `observedAttributes` derives from them.

```js
import { BaseElement, define } from '@platformdesign/components/_core/elements/BaseElement.mjs';

export class Example extends BaseElement {
    static props = {
        open: { type: Boolean, default: false },
    };

    render() {
        this.refs.panel.hidden = !this.props.open;
    }
}

define('pl-example', Example);
```

Values are typed and coerced — `this.props.open` is a real boolean, and assigning a bad value throws. See [Developer_Docs/component-authoring-guide.md](./Developer_Docs/component-authoring-guide.md) for the full model, including the Shadow/Light decision and how reflection avoids feedback loops.

---

## Browser support

Requires ES modules, custom elements, and `CSSStyleSheet.replaceSync` — Chrome/Edge 120+, Safari 16.4+, Firefox 115+. No polyfills are shipped, and none are planned; the whole point is to use what the browser already does.

---

## License

MIT
