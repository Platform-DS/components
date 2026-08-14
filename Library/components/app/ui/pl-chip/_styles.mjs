// ------------------------------
// Chip Styles
// ------------------------------
// A pill: full-radius border by default, padding, one line of text. The ×
// is a real <button> (see index.mjs for why) but `all: unset` strips every
// bit of its native chrome first, so nothing about it reads as "a button" —
// just a small glyph that happens to be focusable and clickable.

export const STYLES = /*css*/`
  :host {
    display: inline-flex;
    align-items: center;
    gap: var(--chip-gap, 0.375rem);
    max-inline-size: 100%;

    padding-inline: var(--chip-padding-inline, 0.75rem);
    padding-block: var(--chip-padding-block, 0.3125rem);

    background: var(--chip-background, var(--pl-color-surface, #fff));
    color: var(--chip-color, var(--pl-color-ink, #111827));
    border: var(--pl-border-width-small, 1px) solid var(--chip-border, var(--pl-color-border, #E5E7EB));
    border-radius: var(--chip-radius, var(--pl-border-radius-full, 9999px));

    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-sm, 0.875rem);
    line-height: var(--pl-line-height-tight, 1.15);
  }

  :host([hidden]) { display: none; }

  .label {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Reset first, THEN add back only what a small glyph control needs — the
     native button chrome (border, background, padding, font) has nothing to
     do with how this should look. */
  .remove {
    all: unset;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;

    inline-size: var(--chip-remove-size, 1rem);
    block-size: var(--chip-remove-size, 1rem);
    border-radius: var(--pl-border-radius-full, 9999px);

    color: inherit;
    opacity: 0.6;
    cursor: pointer;
    box-sizing: border-box;
  }

  .remove[hidden] { display: none; }

  .remove svg {
    inline-size: 100%;
    block-size: 100%;
  }

  .remove:hover { opacity: 1; background: var(--chip-remove-hover, color-mix(in oklab, currentColor 15%, transparent)); }

  .remove:focus-visible {
    opacity: 1;
    outline: 2px solid var(--pl-color-focus, #2563EB);
    outline-offset: 1px;
  }
`;
