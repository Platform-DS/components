// ------------------------------
// Shared button styles
// ------------------------------
// The button look, parameterised by the internal element selector so a real
// <button> (pl-button) and a real <a> (pl-button-link) render identically. Both
// read the same --button-* hooks, so `pl-button, pl-button-link { … }` themes
// the pair at once. Loading and native-disabled specifics stay in pl-button.

export const buttonStyles = (sel) => /*css*/`
  :host {
    /* A filled button always pairs an intent fill with its on-color, which is
       WHITE in every theme. Dark text on a saturated fill is the usual way
       these go wrong when a theme flips, so the pairing is fixed here rather
       than derived from the page's ink. */
    --_bg:       var(--button-background, var(--pl-color-primary, #2563EB));
    --_fg:       var(--button-color, var(--pl-color-on-primary, #FFFFFF));
    --_border:   var(--button-border, transparent);

    /* :hover and :active are MIXED FROM --_bg rather than read from a fixed
       pair of tokens. The point is that they follow whatever fill the button
       actually has: set --button-background to a brand color and its states
       come out in that color automatically, instead of staying the blue the
       default hover token names. Override either directly if you need to.

       States darken in both themes because the label is always white, and
       darkening is the only direction that keeps it at AA while hovered. See
       the intent block in tokens.css for the measurements behind that. */
    --_state-mix: var(--pl-color-state-mix, #000000);
    --_bg-hover: var(--button-background-hover,
      color-mix(in oklab, var(--_bg) calc(100% - var(--pl-color-state-hover-amount, 12%)), var(--_state-mix)));
    --_bg-active: var(--button-background-active,
      color-mix(in oklab, var(--_bg) calc(100% - var(--pl-color-state-active-amount, 22%)), var(--_state-mix)));

    --_pad-block: var(--pl-size-8, 0.5rem);
    --_pad-inline: var(--pl-size-16, 1rem);
    --_font-size: var(--pl-font-size-base, 1rem);
    /* Shared with the fields, so a button and an input are the same height in
       a form row. See the control-height note in tokens.css. */
    --_height: var(--button-height, var(--pl-control-height-md, 2.625rem));

    display: inline-block;
    vertical-align: middle;
  }

  :host([hidden]) { display: none; }

  :host([data-full]) { display: block; }
  :host([data-full]) ${sel} { width: 100%; }

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

    /* A floor, not a fixed height: a wrapped label or a tall icon still grows
       the button rather than spilling out of it. */
    min-block-size: var(--_height);
    padding-block: var(--_pad-block);
    padding-inline: var(--_pad-inline);

    color: var(--_fg);
    background: var(--_bg);
    border: var(--pl-border-width-small, 1px) solid var(--_border);
    /* Shared with the fields, so a button and an input beside it are the same
       shape as well as the same height. Themeable so a wrapper can square off
       the corners it needs to — see pl-button-group, which flattens the inner
       edges of a segmented row. */
    border-radius: var(--button-radius, var(--pl-control-radius, 8px));

    cursor: pointer;
    text-align: center;
    text-decoration: none;   /* anchors carry an underline otherwise */
    white-space: nowrap;
    transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
  }

  ${sel}:hover  { background: var(--_bg-hover); }

  /* A background, not a brightness filter. A filter applies to the whole
     element, so it dimmed the LABEL along with the fill and quietly cut text
     contrast on press; it also darkened in a dark theme, where the fill should
     be getting lighter. */
  ${sel}:active { background: var(--_bg-active); }

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
  /* These two carry no fill, so they invert the rule above: their states mix
     toward the page's INK rather than toward black. Two reasons. Their label
     is the page ink rather than white, so there is no white-on-fill contrast
     to protect; and mixing a transparent background toward black is invisible
     on a dark page, which is exactly what it did before this. Ink flips with
     the theme, so the tint darkens on paper and lightens in the dark, which is
     the behaviour a ghost button wants on either. */
  :host([data-variant="secondary"]),
  :host([data-variant="ghost"]) {
    --_bg: var(--button-background, transparent);
    --_fg: var(--button-color, var(--pl-color-ink, #111827));
    --_state-mix: var(--pl-color-ink, #111827);
  }

  :host([data-variant="secondary"]) {
    --_border: var(--button-border, var(--pl-color-border-strong, #9CA3AF));
  }

  :host([data-variant="ghost"]) {
    --_border: var(--button-border, transparent);
  }

  :host([data-variant="success"]) {
    --_bg: var(--button-background, var(--pl-color-success, #047857));
    --_fg: var(--button-color, var(--pl-color-on-success, #FFFFFF));
    --_border: var(--button-border, transparent);
  }

  :host([data-variant="danger"]) {
    --_bg: var(--button-background, var(--pl-color-error, #B91C1C));
    --_fg: var(--button-color, var(--pl-color-on-error, #FFFFFF));
    --_border: var(--button-border, transparent);
  }

  /*------------------------------------------------
    Sizes
  -------------------------------------------------*/
  :host([data-size="sm"]) {
    --_pad-block: var(--pl-size-4, 0.25rem);
    --_pad-inline: var(--pl-size-12, 0.75rem);
    --_font-size: var(--pl-font-size-sm, 0.875rem);
    --_height: var(--button-height, var(--pl-control-height-sm, 2rem));
  }

  :host([data-size="lg"]) {
    --_pad-block: var(--pl-size-12, 0.75rem);
    --_pad-inline: var(--pl-size-24, 1.5rem);
    --_font-size: var(--pl-font-size-lg, 1.125rem);
    --_height: var(--button-height, var(--pl-control-height-lg, 3.25rem));
  }

  /*------------------------------------------------
    Circle

    A square box with a round corner radius, for ONE icon. It composes with the
    sizes rather than replacing them: the control height is already the right
    diameter at every step, so a 1:1 aspect ratio turns that height into the
    width and the padding goes away. Nothing here restates sm/md/lg.

    Padding is dropped rather than balanced because with a fixed aspect ratio it
    fights the box: horizontal padding would widen the button, which widens the
    height that the ratio derives from, and the circle drifts off the size scale
    it is supposed to share with every other control in the row.
  -------------------------------------------------*/
  :host([data-shape="circle"]) ${sel},
  :host([data-shape="square"]) ${sel} {
    aspect-ratio: 1;
    inline-size: var(--_height);
    min-inline-size: var(--_height);
    padding: 0;
    /* The label is a single glyph, so centring is the whole layout. */
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :host([data-shape="circle"]) ${sel} {
    border-radius: var(--button-radius, var(--pl-border-radius-full, 9999px));
  }

  /* A circle sizes itself, so it cannot also stretch. */
  :host([data-shape="circle"]),
  :host([data-shape="square"]) { inline-size: auto; }

  :host([data-shape="circle"]) ::slotted(pl-icon),
  :host([data-shape="square"]) ::slotted(pl-icon),
  :host([data-shape="circle"]) ::slotted(svg),
  :host([data-shape="square"]) ::slotted(svg) {
    inline-size: var(--button-icon, 1.25em);
    block-size: var(--button-icon, 1.25em);
  }

  ::slotted(svg),
  ::slotted(pl-icon) { flex: none; }
`;
