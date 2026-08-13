// ------------------------------
// Button Styles
// ------------------------------
// Adopted as a Constructable Stylesheet — parsed once, shared by every
// instance. Every token carries a fallback so the component still looks
// right in a document that never loaded tokens.css.

export const STYLES = /*css*/`
    :host {
        /* Component API — override these per instance from the light DOM:
           <pl-button style="--pl-button-bg: red"> */
        --_bg: var(--pl-button-bg, var(--pl-color-brand, oklch(0.87 0.19 96)));
        --_fg: var(--pl-button-fg, var(--pl-color-on-brand, oklch(0.09 0 0)));
        --_border: var(--pl-button-border, transparent);
        --_pad-block: var(--pl-space-xs, 0.5rem);
        --_pad-inline: var(--pl-space-md, 1rem);
        --_size: var(--pl-text-base, 1rem);

        display: inline-block;
        vertical-align: middle;
    }

    :host([hidden]) { display: none; }

    :host([full]) { display: block; }
    :host([full]) button { width: 100%; }

    button {
        /* Reset — a shadow root inherits nothing from the page's button styles. */
        appearance: none;
        margin: 0;
        box-sizing: border-box;
        font: inherit;
        font-family: var(--pl-font-sans, system-ui, sans-serif);
        font-size: var(--_size);
        font-weight: var(--pl-weight-medium, 500);
        line-height: var(--pl-leading-tight, 1.15);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--pl-space-xs, 0.5rem);
        width: 100%;

        padding-block: var(--_pad-block);
        padding-inline: var(--_pad-inline);

        color: var(--_fg);
        background: var(--_bg);
        border: 1px solid var(--_border);
        border-radius: var(--pl-radius-md, 0.5rem);

        cursor: pointer;
        text-align: center;
        white-space: nowrap;
        transition:
            background var(--pl-duration-fast, 120ms) var(--pl-ease, ease),
            color var(--pl-duration-fast, 120ms) var(--pl-ease, ease),
            border-color var(--pl-duration-fast, 120ms) var(--pl-ease, ease);
    }

    button:hover  { background: var(--pl-button-bg-hover, var(--pl-color-brand-hover, oklch(0.90 0.16 97))); }
    button:active { background: var(--pl-button-bg-active, var(--pl-color-brand-active, oklch(0.78 0.17 92))); }

    /* :focus-visible only — no ring on a mouse click, always one on Tab. */
    button:focus-visible {
        outline: none;
        box-shadow: var(--pl-focus-ring, 0 0 0 4px oklch(0.63 0.14 87));
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    /*------------------------------------------------
      Variants — driven by the host attribute, so the DOM stays readable:
      <pl-button variant="secondary">

      Each variant re-declares the --pl-button-* hook ahead of its own default.
      Without that, the variant selector's higher specificity would beat the
      :host rule and silently ignore a per-instance override — the hooks have
      to keep working on every variant, not just the default one.
    -------------------------------------------------*/
    :host([variant="secondary"]) {
        --_bg: var(--pl-button-bg, transparent);
        --_fg: var(--pl-button-fg, var(--pl-color-text, oklch(0.09 0 0)));
        --_border: var(--pl-button-border, var(--pl-color-border-strong, oklch(0.70 0 0)));
    }
    :host([variant="secondary"]) button:hover  { background: var(--pl-color-surface-sunken, oklch(0.95 0 0)); }
    :host([variant="secondary"]) button:active { background: var(--pl-color-border, oklch(0.90 0 0)); }

    :host([variant="ghost"]) {
        --_bg: var(--pl-button-bg, transparent);
        --_fg: var(--pl-button-fg, var(--pl-color-text, oklch(0.09 0 0)));
        --_border: var(--pl-button-border, transparent);
    }
    :host([variant="ghost"]) button:hover  { background: var(--pl-color-surface-sunken, oklch(0.95 0 0)); }
    :host([variant="ghost"]) button:active { background: var(--pl-color-border, oklch(0.90 0 0)); }

    :host([variant="danger"]) {
        --_bg: var(--pl-button-bg, var(--pl-color-danger, oklch(0.55 0.20 27)));
        --_fg: var(--pl-button-fg, var(--pl-color-text-on-dark, oklch(0.98 0 0)));
        --_border: var(--pl-button-border, transparent);
    }
    :host([variant="danger"]) button:hover  { filter: brightness(1.1); }
    :host([variant="danger"]) button:active { filter: brightness(0.95); }

    /*------------------------------------------------
      Sizes
    -------------------------------------------------*/
    :host([size="sm"]) {
        --_pad-block: var(--pl-space-2xs, 0.25rem);
        --_pad-inline: var(--pl-space-sm, 0.75rem);
        --_size: var(--pl-text-sm, 0.875rem);
    }

    :host([size="lg"]) {
        --_pad-block: var(--pl-space-sm, 0.75rem);
        --_pad-inline: var(--pl-space-lg, 1.5rem);
        --_size: var(--pl-text-lg, 1.125rem);
    }

    /*------------------------------------------------
      Loading — the spinner is CSS-only, and aria-busy on the real <button>
      is what actually announces the state.
    -------------------------------------------------*/
    :host([loading]) button {
        cursor: progress;
        /* Keep the label's width so the button doesn't jump when it returns. */
        color: transparent;
        position: relative;
    }

    :host([loading]) button::after {
        content: "";
        position: absolute;
        inset: 50% auto auto 50%;
        width: 1em;
        height: 1em;
        margin: -0.5em 0 0 -0.5em;
        border: 2px solid var(--_fg);
        border-block-start-color: transparent;
        border-radius: 50%;
        animation: pl-spin 0.6s linear infinite;
    }

    @keyframes pl-spin {
        to { transform: rotate(1turn); }
    }

    @media (prefers-reduced-motion: reduce) {
        :host([loading]) button::after { animation-duration: 2s; }
    }

    /* Slotted icons align to the label without the consumer styling them. */
    ::slotted(svg),
    ::slotted(pl-icon) {
        flex: none;
    }
`;
