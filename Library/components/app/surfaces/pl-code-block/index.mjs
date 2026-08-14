// Imports
import { STYLES } from './_styles.mjs';
import { GRAMMARS, tokenize } from './_languages.mjs';

// Component Settings
const tagName = "pl-code-block";

/**
 * Light-DOM source arrives indented to match the surrounding HTML. Strip the
 * shared indent and the blank first and last lines so a block renders from
 * column zero no matter how deeply its tag was nested in the page.
 */
function dedent(text) {
    const lines = text.replace(/\t/g, "    ").split("\n");

    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines.at(-1).trim()) lines.pop();

    const indents = lines.filter(line => line.trim()).map(line => line.match(/^ */)[0].length);
    const common = indents.length ? Math.min(...indents) : 0;

    return lines.map(line => line.slice(common)).join("\n");
}

/**
 * Syntax highlighting, and only that — no copy button, no line numbers, no
 * filename chrome.
 *
 *   <pl-code-block language="json">{ "color": [] }</pl-code-block>
 *
 * The slotted light DOM is the source of truth and is never displayed: the
 * component reads its text, tokenises it, and renders the highlighted copy
 * inside the shadow root. That indirection is required rather than stylistic,
 * because `::slotted()` matches only the top level of assigned nodes — spans
 * wrapped around slotted text could never be colored from in here.
 *
 * An unknown or omitted `language` renders the source verbatim, so a block is
 * never worse off than the plain <pre> it replaces.
 */
export class CodeUI extends HTMLElement {
    static #template = document.createElement("template");
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <div part="head" class="code__head">
                <span part="language" class="code__lang" id="lang"></span>
                <button part="copy" class="code__copy" id="copy" type="button">Copy</button>
            </div>
            <pre id="pre"><code id="out"></code></pre>
            <span id="source"><slot></slot></span>
        `;
        this.#sheet.replaceSync(STYLES);
    }

    // Public HTML API
    static props = {
        language: {
            type: String,
            default: '',
            description: 'Grammar used to highlight the slotted source. Omitted or unrecognised renders plain text.',
            options: Object.keys(GRAMMARS),
        },
    };

    // Derived from the declaration — never hand-maintained.
    static get observedAttributes() {
        return Object.keys(this.props);
    }

    #observer = null;
    #copyTimer = 0;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets = [CodeUI.#sheet];
        this.shadowRoot.append(CodeUI.#template.content.cloneNode(true));

        this.refs = {
            pre: this.shadowRoot.querySelector("#pre"),
            out: this.shadowRoot.querySelector("#out"),
            slot: this.shadowRoot.querySelector("slot"),
            lang: this.shadowRoot.querySelector("#lang"),
            copy: this.shadowRoot.querySelector("#copy"),
        };

        // Covers content that arrives or changes after upgrade.
        this.refs.slot.addEventListener("slotchange", () => {
            if (this.isConnected) this.render();
        });

        this.refs.copy.addEventListener("click", () => this.#copy());
    }

    /** Copy the raw source (not the highlighted markup) to the clipboard. */
    async #copy() {
        try {
            await navigator.clipboard.writeText(dedent(this.#source()));
        } catch {
            return; // clipboard blocked (insecure context, denied permission) — no-op
        }

        const { copy } = this.refs;
        copy.textContent = "Copied";
        copy.dataset.copied = "";
        clearTimeout(this.#copyTimer);
        this.#copyTimer = setTimeout(() => {
            copy.textContent = "Copy";
            delete copy.dataset.copied;
        }, 1400);
    }

    #source() {
        return this.refs.slot.assignedNodes().map(node => node.textContent).join("");
    }

    /**
     * A block that scrolls sideways has to be reachable by keyboard, so it
     * becomes a tab stop only while it actually overflows (WCAG 2.1.1).
     * Naming the region gives the focus stop something to announce.
     */
    #syncScroll() {
        const { pre } = this.refs;

        if (pre.scrollWidth <= pre.clientWidth) {
            pre.removeAttribute("tabindex");
            pre.removeAttribute("role");
            pre.removeAttribute("aria-label");
            return;
        }

        pre.setAttribute("tabindex", "0");
        pre.setAttribute("role", "region");
        pre.setAttribute("aria-label", this.language ? `${this.language} code sample` : "Code sample");
    }

    render() {
        this.refs.lang.textContent = this.language;

        const source = dedent(this.#source());
        const grammar = GRAMMARS[this.language.toLowerCase()];
        const fragment = document.createDocumentFragment();

        if (!grammar) {
            fragment.append(source);
        } else {
            for (const { kind, text } of tokenize(source, grammar)) {
                if (!kind) {
                    fragment.append(text);
                    continue;
                }
                const span = document.createElement("span");
                span.className = `syn syn--${kind}`;
                // textContent, never innerHTML — the source is author content
                // and must never be parsed as markup.
                span.textContent = text;
                fragment.append(span);
            }
        }

        this.refs.out.replaceChildren(fragment);
        this.#syncScroll();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (this.isConnected) this.render();
    }

    connectedCallback() {
        this.render();

        // Whether the block overflows depends on the width it is given, so it
        // has to be re-checked as the viewport changes, not just once.
        this.#observer ??= new ResizeObserver(() => this.#syncScroll());
        this.#observer.observe(this.refs.pre);
    }

    disconnectedCallback() {
        this.#observer?.disconnect();
        clearTimeout(this.#copyTimer);
    }

    // --- Attribute accessors (attribute is canonical; name matches property) ---

    get language() { return this.getAttribute("language") ?? CodeUI.props.language.default; }
    set language(value) {
        if (value == null) this.removeAttribute("language");
        else this.setAttribute("language", value);
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, CodeUI);
}

export default CodeUI;
