// ------------------------------
// Shared button styles
// ------------------------------
// The button look, parameterised by the internal element selector so a real
// <button> (pl-button) and a real <a> (pl-button-link) render identically. Both
// read the same --button-* hooks, so `pl-button, pl-button-link { … }` themes
// the pair at once. Loading and native-disabled specifics stay in pl-button.

export const buttonStyles = (sel) => /*css*/`
  :host {
    /* A filled button always pairs an intent fill with its on-colour, which is
       WHITE in every theme. Dark text on a saturated fill is the usual way
       these go wrong when a theme flips, so the pairing is fixed here rather
       than derived from the page's ink. */
    --_bg:       var(--button-background, var(--pl-color-primary, #2563EB));
    --_fg:       var(--button-color, var(--pl-color-on-primary, #FFFFFF));
    --_bg-hover: var(--button-background-hover, var(--pl-color-primary-hover, #1D4ED8));
    --_border:   var(--button-border, transparent);

    --_pad-block: var(--pl-size-8, 0.5rem);
    --_pad-inline: var(--pl-size-16, 1rem);
    --_font-size: var(--pl-font-size-base, 1rem);

    display: inline-block;
    vertical-align: middle;
  }

  :host([hidden]) { display: none; }

  :host([full]) { display: block; }
  :host([full]) ${sel} { width: 100%; }

  ${sel} {
    appearance: none;
    box-sizing: border-box;
    margin: 0;
    width: 100%;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--pl-size-8, 0.5rem);

    font: inherit;
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--_font-size);
    font-weight: var(--pl-font-weight-medium, 500);
    line-height: var(--pl-line-height-tight, 1.15);

    padding-block: var(--_pad-block);
    padding-inline: var(--_pad-inline);

    color: var(--_fg);
    background: var(--_bg);
    border: var(--pl-border-width-small, 1px) solid var(--_border);
    /* Themeable so a wrapper can square off the corners it needs to — see
       pl-button-group, which flattens the inner edges of a segmented row. */
    border-radius: var(--button-radius, var(--pl-border-radius-small, 4px));

    cursor: pointer;
    text-align: center;
    text-decoration: none;   /* anchors carry an underline otherwise */
    white-space: nowrap;
    transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
  }

  ${sel}:hover  { background: var(--_bg-hover); }
  ${sel}:active { filter: brightness(0.92); }

  /* :focus-visible only — no ring on a mouse click, always one on Tab. */
  ${sel}:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px var(--pl-color-surface, #fff),
      0 0 0 4px var(--pl-color-focus, #2563EB);
  }

  /* Disabled via the host attribute, so it works for a real <a> (which has no
     :disabled) exactly as for a <button>. */
  :host([disabled]) { cursor: not-allowed; }
  :host([disabled]) ${sel} {
    opacity: var(--pl-opacity-50, 0.5);
    pointer-events: none;
  }

  /*------------------------------------------------
    Variants — each re-declares the --button-* hook ahead of its default, so a
    per-instance override still wins over the variant selector's specificity.
  -------------------------------------------------*/
  /* Outline and ghost carry no fill, so their text follows the page ink and
     stays legible when the theme flips. */
  :host([variant="secondary"]) {
    --_bg: var(--button-background, transparent);
    --_fg: var(--button-color, var(--pl-color-ink, #111827));
    --_bg-hover: var(--button-background-hover, var(--pl-color-surface-sunken, #F3F4F6));
    --_border: var(--button-border, var(--pl-color-border-strong, #9CA3AF));
  }

  :host([variant="ghost"]) {
    --_bg: var(--button-background, transparent);
    --_fg: var(--button-color, var(--pl-color-ink, #111827));
    --_bg-hover: var(--button-background-hover, var(--pl-color-surface-sunken, #F3F4F6));
    --_border: var(--button-border, transparent);
  }

  :host([variant="success"]) {
    --_bg: var(--button-background, var(--pl-color-success, #047857));
    --_fg: var(--button-color, var(--pl-color-on-success, #FFFFFF));
    --_bg-hover: var(--button-background-hover, var(--pl-color-success-hover, #065F46));
    --_border: var(--button-border, transparent);
  }

  :host([variant="danger"]) {
    --_bg: var(--button-background, var(--pl-color-error, #B91C1C));
    --_fg: var(--button-color, var(--pl-color-on-error, #FFFFFF));
    --_bg-hover: var(--button-background-hover, var(--pl-color-error-hover, #991B1B));
    --_border: var(--button-border, transparent);
  }

  /*------------------------------------------------
    Sizes
  -------------------------------------------------*/
  :host([size="sm"]) {
    --_pad-block: var(--pl-size-4, 0.25rem);
    --_pad-inline: var(--pl-size-12, 0.75rem);
    --_font-size: var(--pl-font-size-sm, 0.875rem);
  }

  :host([size="lg"]) {
    --_pad-block: var(--pl-size-12, 0.75rem);
    --_pad-inline: var(--pl-size-24, 1.5rem);
    --_font-size: var(--pl-font-size-lg, 1.125rem);
  }

  ::slotted(svg),
  ::slotted(pl-icon) { flex: none; }
`;
