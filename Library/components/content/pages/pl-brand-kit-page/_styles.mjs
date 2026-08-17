// ------------------------------
// Brand Kit Page Styles — LIGHT DOM
// ------------------------------
// A stack of full-color bands. The load-bearing idea is the tone map at the
// top: data-tone resolves to a --_tone-bg / --_tone-ink pair of tokens, and
// every colored thing on the page — bands, variants, tiles, strip cells —
// paints from that pair. One attribute, themed everywhere.
//
// Everything reads from tokens with fallbacks; the swatch circles paint
// tokens directly, so the palette shown IS the palette in force.

export const STYLES = /*css*/`
:where(pl-brand-kit-page) {
  --brand-measure: 60rem;
  --brand-band-padding: var(--pl-size-64, 4rem) var(--pl-size-48, 3rem);
  --brand-mark-size: var(--pl-size-96, 7.5rem);
  --brand-swatch-size: 5.75rem;
  --brand-tile-size: 13.75rem;
  --brand-strip-size: var(--pl-size-16, 1rem);
  --brand-radius: var(--pl-border-radius-medium, 8px);
  --brand-accent: var(--pl-color-warning, #F59E0B);
}

pl-brand-kit-page {
  display: block;
  inline-size: 100%;
  max-inline-size: var(--brand-measure);
  margin-inline: auto;
  background: var(--pl-color-surface, #FFFFFF);
  color: var(--pl-color-ink, #111827);
  font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
  overflow: hidden;
}

pl-brand-kit-page[hidden] { display: none; }

/* :where(), not :is() — a zero-specificity reset stays out of the way of every
   rule below it. Nothing here currently depends on it winning, and keeping it
   weak means adding a flow rule later cannot be silently outranked. */
pl-brand-kit-page :where(h1, h2, h3, p) { margin: 0; }

/*------------------------------------------------
  Tones — a background/ink pair per attribute, read from the theme
-------------------------------------------------*/
pl-brand-kit-page [data-tone="primary"] {
  --_tone-bg: var(--pl-color-primary, #2563EB);
  --_tone-ink: var(--pl-color-on-primary, #FFFFFF);
}

pl-brand-kit-page [data-tone="accent"] {
  --_tone-bg: var(--brand-accent);
  --_tone-ink: var(--pl-color-ink, #111827);
}

pl-brand-kit-page [data-tone="dark"] {
  --_tone-bg: var(--pl-color-ink, #111827);
  --_tone-ink: var(--pl-color-surface, #FFFFFF);
}

pl-brand-kit-page [data-tone="light"] {
  --_tone-bg: var(--pl-color-surface-sunken, #F3F4F6);
  --_tone-ink: var(--pl-color-ink, #111827);
}

pl-brand-kit-page [data-tone] {
  background: var(--_tone-bg);
  color: var(--_tone-ink);
}

/*------------------------------------------------
  Bands — every top-level section is one
-------------------------------------------------*/
pl-brand-kit-page [data-band] {
  padding: var(--brand-band-padding);
  text-align: center;
}

/* The band title sits between two short rules, drawn in the band's own ink. */
pl-brand-kit-page [data-band-title] {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--pl-size-16, 0.875rem);
  margin-block-end: var(--pl-size-48, 2.75rem);
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: var(--pl-font-size-lg, 1.25rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

pl-brand-kit-page [data-band-title]::before,
pl-brand-kit-page [data-band-title]::after {
  content: "";
  inline-size: var(--pl-size-48, 2.5rem);
  block-size: var(--pl-border-width-small, 1px);
  background: currentColor;
  opacity: 0.25;
}

/* A small caps label, wherever a region needs naming. */
pl-brand-kit-page [data-label] {
  font-size: var(--pl-font-size-xs, 0.75rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  letter-spacing: var(--pl-letter-spacing-loose, 0.1em);
  text-transform: uppercase;
  opacity: var(--pl-opacity-70, 0.8);
}

/*------------------------------------------------
  Logo band — the mark on its primary ground
-------------------------------------------------*/
pl-brand-kit-page [data-logo] {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--pl-size-24, 1.75rem);
  padding: var(--pl-size-64, 4.5rem) var(--pl-size-48, 3rem);
  text-align: center;
}

/* In the hero band the label pins to the corner, like a plate in a brand book. */
pl-brand-kit-page [data-logo] > [data-label] {
  position: absolute;
  inset-block-start: var(--pl-size-16, 1.25rem);
  inset-inline-start: var(--pl-size-24, 1.5rem);
}

/* The mark: sized frame for whatever the author puts in it; a dashed slot
   while there is nothing, so the board reads correctly before assets exist. */
pl-brand-kit-page [data-mark] {
  inline-size: var(--brand-mark-size);
  block-size: var(--brand-mark-size);
  display: grid;
  place-items: center;
  border-radius: var(--brand-radius);
  overflow: hidden;
}

pl-brand-kit-page [data-mark]:empty {
  border: var(--pl-border-width-small, 1px) dashed currentColor;
  opacity: var(--pl-opacity-50, 0.5);
}

pl-brand-kit-page [data-mark="circle"] { border-radius: var(--pl-border-radius-full, 999px); }

pl-brand-kit-page [data-mark] :is(img, svg, pl-picture, pl-icon) {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

pl-brand-kit-page [data-wordmark] {
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: clamp(1.75rem, 1rem + 3vw, 2.75rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: var(--pl-line-height-tight, 1);
}

/* Wordmark and tagline read as one lockup: wrap them in a shared element and
   the band's gap stays between the lockup and its neighbors, not inside it. */
pl-brand-kit-page [data-tagline] {
  margin-block-start: var(--pl-size-8, 0.625rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  font-size: var(--pl-font-size-sm, 0.9375rem);
  letter-spacing: 0.35em;
  text-transform: uppercase;
  opacity: var(--pl-opacity-70, 0.85);
}

/*------------------------------------------------
  Variants — the lockup on its other grounds, side by side
-------------------------------------------------*/
pl-brand-kit-page [data-variants] {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

pl-brand-kit-page [data-variant] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--pl-size-16, 1.25rem);
  padding: var(--pl-size-48, 3rem);
  text-align: center;
}

/* A compact lockup: small mark beside a stacked name. */
pl-brand-kit-page [data-lockup] {
  display: flex;
  align-items: center;
  gap: var(--pl-size-16, 1rem);
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: var(--pl-font-size-xl, 1.625rem);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  line-height: var(--pl-line-height-tight, 1.1);
  text-align: start;
}

pl-brand-kit-page [data-variant] [data-mark] {
  --brand-mark-size: var(--pl-size-64, 4rem);
}

/*------------------------------------------------
  Palette — circles, each painting a token directly
-------------------------------------------------*/
pl-brand-kit-page [data-swatches] {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--pl-size-32, 2.75rem);
}

pl-brand-kit-page [data-swatch] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--pl-size-12, 0.75rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  font-size: var(--pl-font-size-sm, 0.875rem);
}

pl-brand-kit-page [data-swatch]::before {
  content: "";
  inline-size: var(--brand-swatch-size);
  block-size: var(--brand-swatch-size);
  border-radius: var(--pl-border-radius-full, 999px);
  border: var(--pl-border-width-small, 1px) solid var(--pl-color-border, #E5E7EB);
  background: var(--_swatch, var(--pl-color-surface-sunken, #F3F4F6));
}

pl-brand-kit-page [data-swatch] small {
  display: block;
  font-weight: var(--pl-font-weight-normal, 400);
  font-size: var(--pl-font-size-xs, 0.75rem);
  color: var(--pl-color-ink-secondary, #6B7280);
  font-variant-numeric: tabular-nums;
}

pl-brand-kit-page [data-swatch="ink"]     { --_swatch: var(--pl-color-ink, #111827); }
pl-brand-kit-page [data-swatch="surface"] { --_swatch: var(--pl-color-surface, #FFFFFF); }
pl-brand-kit-page [data-swatch="sunken"]  { --_swatch: var(--pl-color-surface-sunken, #F3F4F6); }
pl-brand-kit-page [data-swatch="primary"] { --_swatch: var(--pl-color-primary, #2563EB); }
pl-brand-kit-page [data-swatch="accent"]  { --_swatch: var(--brand-accent); }
pl-brand-kit-page [data-swatch="success"] { --_swatch: var(--pl-color-success, #047857); }
pl-brand-kit-page [data-swatch="warning"] { --_swatch: var(--pl-color-warning, #B45309); }
pl-brand-kit-page [data-swatch="danger"]  { --_swatch: var(--pl-color-error, #B91C1C); }

/*------------------------------------------------
  Type — two faces, glyph beside alphabet, divided down the middle
-------------------------------------------------*/
pl-brand-kit-page [data-faces] {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--pl-size-32, 2.5rem);
  align-items: center;
  text-align: start;
}

pl-brand-kit-page [data-face] {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--pl-size-24, 1.5rem);
}

/* The divider is currentColor, faded, so it works on any tone. */
pl-brand-kit-page [data-face] + [data-face] {
  border-inline-start: var(--pl-border-width-small, 1px) solid color-mix(in srgb, currentColor 20%, transparent);
}

pl-brand-kit-page [data-glyph] {
  font-size: var(--pl-size-96, 6rem);
  line-height: var(--pl-line-height-tight, 1);
}

pl-brand-kit-page [data-face="display"] :is([data-glyph], [data-alphabet]) {
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
}

pl-brand-kit-page [data-face="body"] [data-glyph] { font-weight: var(--pl-font-weight-normal, 400); }

pl-brand-kit-page [data-face="mono"] :is([data-glyph], [data-alphabet]) {
  font-family: var(--pl-font-family-monospace, ui-monospace, monospace);
}

pl-brand-kit-page [data-face-name] {
  margin-block-end: var(--pl-size-8, 0.5rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  color: var(--brand-accent);
}

pl-brand-kit-page [data-alphabet] {
  max-inline-size: 14rem;
  font-size: var(--pl-font-size-xs, 0.6875rem);
  line-height: var(--pl-line-height-loose, 1.7);
  opacity: var(--pl-opacity-70, 0.75);
  overflow-wrap: break-word;
}

/* The sentence the faces make together, centered under the specimens. */
pl-brand-kit-page [data-sample] {
  max-inline-size: 35rem;
  margin: var(--pl-size-48, 2.75rem) auto 0;
}

pl-brand-kit-page [data-sample] > :first-child {
  margin-block-end: var(--pl-size-12, 0.75rem);
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: var(--pl-font-size-xl, 1.5rem);
}

pl-brand-kit-page [data-sample] > :last-child {
  font-size: var(--pl-font-size-sm, 0.9375rem);
  line-height: var(--pl-line-height-loose, 1.7);
  opacity: var(--pl-opacity-70, 0.75);
}

/*------------------------------------------------
  Imagery — a 3-across mosaic of photos and toned tiles
-------------------------------------------------*/
pl-brand-kit-page [data-tiles] {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: var(--brand-tile-size);
  gap: var(--pl-size-16, 1rem);
}

pl-brand-kit-page [data-tile] {
  display: grid;
  place-items: center;
  border-radius: calc(var(--brand-radius) * 1.25);
  overflow: hidden;
  background: var(--_tone-bg, var(--pl-color-surface-sunken, #F3F4F6));
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

pl-brand-kit-page [data-tile][data-span="tall"] { grid-row: span 2; }
pl-brand-kit-page [data-tile][data-span="wide"] { grid-column: span 2; }

pl-brand-kit-page [data-tile] :is(img, pl-picture) {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

/* An empty tile is a labelled slot, like the empty mark. */
pl-brand-kit-page [data-tile]:not([data-tone]):empty {
  border: var(--pl-border-width-small, 1px) dashed var(--pl-color-border-strong, #9CA3AF);
}

/*------------------------------------------------
  Strip — the palette once more, as a closing rule
-------------------------------------------------*/
pl-brand-kit-page [data-strip] {
  display: flex;
  block-size: var(--brand-strip-size);
}

pl-brand-kit-page [data-strip] > * { flex: 1; }

/*------------------------------------------------
  Narrow
-------------------------------------------------*/
@media (max-width: 48rem) {
  pl-brand-kit-page { --brand-band-padding: var(--pl-size-48, 3rem) var(--pl-size-24, 1.5rem); }

  pl-brand-kit-page [data-variants],
  pl-brand-kit-page [data-faces] { grid-template-columns: minmax(0, 1fr); }

  pl-brand-kit-page [data-face] + [data-face] {
    border-inline-start: 0;
    border-block-start: var(--pl-border-width-small, 1px) solid color-mix(in srgb, currentColor 20%, transparent);
    padding-block-start: var(--pl-size-24, 1.5rem);
  }

  pl-brand-kit-page [data-tiles] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 40rem) {
  pl-brand-kit-page [data-tiles] { grid-template-columns: minmax(0, 1fr); }
  pl-brand-kit-page [data-tile][data-span] { grid-row: auto; grid-column: auto; }
}
`;
