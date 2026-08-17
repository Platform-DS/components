// ------------------------------
// UI Kit Page Styles — LIGHT DOM
// ------------------------------
// A poster: a masthead, then labelled panels PACKED into columns. The panels
// are the author's own elements marked with data-panel, so what goes in them is
// not this component's business — it supplies the frame, the label, and the
// packing.
//
// Multi-column, not grid, and that is the whole look. A grid rows its panels,
// and a row is as tall as its tallest panel — ten panels of different heights
// become a page of rectangular holes. Multicol stacks each column
// independently, which is how a kit sheet is actually composed: buttons over
// cards, inputs over alerts, each column as tall as its own content. Panels
// declare break-inside: avoid so a panel never splits across columns, and
// data-span="full" panels use column-span: all for the wide moments (a table,
// a navigation bar).
//
// Everything reads from tokens and NOTHING is a literal. That is the whole
// point of this template: it is the page a theme is judged on, so a hard-coded
// color or radius here would be a place the theme silently fails to reach.

export const STYLES = /*css*/`
:where(pl-ui-kit-page) {
  --kit-columns: 3;
  --kit-gap: var(--pl-size-16, 1rem);
  --kit-padding: var(--pl-size-32, 2rem);
  --kit-panel-background: var(--pl-color-surface, #FFFFFF);
  --kit-panel-border: var(--pl-color-border, #E5E7EB);
  --kit-panel-radius: var(--pl-border-radius-large, 16px);
  --kit-panel-padding: var(--pl-size-16, 1rem);
  --kit-swatch-size: var(--pl-size-48, 3rem);
}

pl-ui-kit-page {
  display: block;
  columns: var(--kit-columns);
  column-gap: var(--kit-gap);
  padding: var(--kit-padding);
  background: var(--pl-color-surface-sunken, #F3F4F6);
  color: var(--pl-color-ink, #111827);
  font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
}

pl-ui-kit-page[hidden] { display: none; }

/* Every top-level region keeps itself whole and carries the vertical gap;
   the horizontal gap is the column-gap. */
pl-ui-kit-page > * {
  break-inside: avoid;
  margin-block-end: var(--kit-gap);
}

/*------------------------------------------------
  Masthead — the kit's own identity, not a page header

  One statement, in layers: the logo mark, the name (once, large), a small
  "UI Kit" kicker with a rule, and an optional lede. The name lives in the
  heading — data-brand is the MARK's slot, so the two never repeat each other.
-------------------------------------------------*/
pl-ui-kit-page [data-masthead] {
  column-span: all;
  display: grid;
  justify-items: start;
  gap: var(--pl-size-12, 0.75rem);
  margin-block-end: var(--pl-size-24, 1.5rem);
}

pl-ui-kit-page [data-masthead] :is(h1, h2) {
  margin: 0;
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-size: clamp(2rem, 1.2rem + 3vw, 3.25rem);
  font-weight: var(--pl-font-weight-bold, 700);
  line-height: 1;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

/* The logo lockup: a boxed mark, optionally followed by small-caps text. */
pl-ui-kit-page [data-brand] {
  display: flex;
  align-items: center;
  gap: var(--pl-size-12, 0.75rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  text-transform: uppercase;
  letter-spacing: var(--pl-letter-spacing-loose, 0.05em);
  font-size: var(--pl-font-size-xs, 0.75rem);
  color: var(--pl-color-ink-secondary, #6B7280);
}

pl-ui-kit-page [data-brand] > :is(pl-icon, img, svg):first-child {
  display: grid;
  place-items: center;
  inline-size: var(--pl-size-48, 3rem);
  block-size: var(--pl-size-48, 3rem);
  background: var(--pl-color-surface, #FFFFFF);
  border: var(--pl-border-width-small, 1px) solid var(--pl-color-border, #E5E7EB);
  border-radius: var(--pl-border-radius-medium, 8px);
  color: var(--pl-color-ink, #111827);
}

/* "UI Kit" — the sheet's genre, small, with a rule running out of it. */
pl-ui-kit-page [data-kicker] {
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--pl-size-12, 0.75rem);
  font-size: var(--pl-font-size-xs, 0.75rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--pl-color-primary, #2563EB);
}

pl-ui-kit-page [data-kicker]::after {
  content: "";
  inline-size: var(--pl-size-48, 3rem);
  block-size: var(--pl-border-width-small, 1px);
  background: var(--pl-color-border, #E5E7EB);
}

pl-ui-kit-page [data-masthead] [data-lede] {
  margin: 0;
  max-inline-size: 40ch;
  font-size: var(--pl-font-size-sm, 0.875rem);
  color: var(--pl-color-ink-secondary, #6B7280);
}

/*------------------------------------------------
  Panels
-------------------------------------------------*/
pl-ui-kit-page [data-panel] {
  display: flex;
  flex-direction: column;
  gap: var(--pl-size-12, 0.75rem);
  padding: var(--kit-panel-padding);
  background: var(--kit-panel-background);
  border: var(--pl-border-width-small, 1px) solid var(--kit-panel-border);
  border-radius: var(--kit-panel-radius);
  min-inline-size: 0;
}

/* Full-width moments — a table, a navigation bar. In multicol a spanner also
   splits the flow: panels before it pack above, panels after it pack below,
   so these belong at the end of the sheet.

   The spanner carries its own block-start gap: the panel before it ends at a
   column break, and fragmentation truncates a margin that lands on a break —
   without this the last packed panel sits flush against the spanner. Margins
   of adjoining spanners collapse, so between two full-width panels this does
   not double the gap. */
pl-ui-kit-page [data-panel][data-span="full"] {
  column-span: all;
  margin-block-start: var(--kit-gap);
}

/* The panel title is whatever heading the author put first. */
pl-ui-kit-page [data-panel] > :is(h2, h3, h4):first-child {
  margin: 0;
  font-size: var(--pl-font-size-sm, 0.875rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  text-transform: uppercase;
  letter-spacing: var(--pl-letter-spacing-loose, 0.05em);
  color: var(--pl-color-ink-secondary, #6B7280);
}

/* A row of specimens inside a panel: buttons, chips, badges, anything. */
pl-ui-kit-page [data-row] {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--pl-size-8, 0.5rem);
}

/*------------------------------------------------
  Labelled groups

  A panel of buttons is not one row of buttons — it is "variants", "states",
  "sizes", each named. Without the sub-label a reader has to infer which
  difference each row is demonstrating, which is exactly the information a kit
  exists to carry.
-------------------------------------------------*/
pl-ui-kit-page [data-group] {
  display: grid;
  gap: var(--pl-size-8, 0.375rem);
  min-inline-size: 0;
}

pl-ui-kit-page [data-group-label] {
  margin: 0;
  font-size: var(--pl-font-size-xs, 0.6875rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  letter-spacing: var(--pl-letter-spacing-loose, 0.08em);
  text-transform: uppercase;
  color: var(--pl-color-ink-secondary, #6B7280);
}

/* A caption under a specimen — the icon's name, the value of a control. */
pl-ui-kit-page [data-caption] {
  margin: 0;
  font-size: var(--pl-font-size-xs, 0.6875rem);
  color: var(--pl-color-ink-secondary, #6B7280);
}

/*------------------------------------------------
  Metric rows — a name on the left, its reading on the right
-------------------------------------------------*/
pl-ui-kit-page [data-metric] {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--pl-size-8, 0.5rem);
  font-size: var(--pl-font-size-xs, 0.75rem);
  color: var(--pl-color-ink-secondary, #6B7280);
}

pl-ui-kit-page [data-metric] > :last-child { font-variant-numeric: tabular-nums; }

/* A single figure: label, number, and an optional delta. Layout only — put it
   inside a pl-surface for the frame, so the chrome is the library's card
   chrome rather than a second one invented here. */
pl-ui-kit-page [data-stat] {
  display: grid;
  gap: var(--pl-size-2, 0.125rem);
}

pl-ui-kit-page [data-stat] > :first-child {
  font-size: var(--pl-font-size-xs, 0.75rem);
  color: var(--pl-color-ink-secondary, #6B7280);
}

pl-ui-kit-page [data-stat] [data-figure] {
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: var(--pl-font-size-xl, 1.5rem);
  line-height: var(--pl-line-height-tight, 1.1);
  font-variant-numeric: tabular-nums;
}

pl-ui-kit-page [data-delta] {
  font-size: var(--pl-font-size-xs, 0.75rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  color: var(--pl-color-success, #047857);
}

pl-ui-kit-page [data-delta="down"] { color: var(--pl-color-error, #B91C1C); }

/*------------------------------------------------
  Icon grid — each glyph over its own name, because an unnamed icon
  in a kit is a picture, not a reference.
-------------------------------------------------*/
pl-ui-kit-page [data-icons] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
  gap: var(--pl-size-12, 0.75rem);
}

pl-ui-kit-page [data-icons] > * {
  display: grid;
  justify-items: center;
  gap: var(--pl-size-4, 0.375rem);
  min-inline-size: 0;
  font-size: var(--pl-font-size-xs, 0.625rem);
  color: var(--pl-color-ink-secondary, #6B7280);
  text-align: center;
  /* Icon names are the reference half of this panel, so a long one wraps
     rather than truncating to "shopping-ba". */
  overflow-wrap: anywhere;
}

/* The glyph is shown bare, at its own size, in ink — no chrome around it.
   Boxing every icon added a border the icons themselves don't ship with, and
   any glyph wider than the box overflowed it. */
pl-ui-kit-page [data-icons] pl-icon {
  color: var(--pl-color-ink, #111827);
}

/*------------------------------------------------
  Avatar stack — overlapped, as a team is usually shown
-------------------------------------------------*/
pl-ui-kit-page [data-avatars] {
  display: flex;
  align-items: center;
}

/* A ring drawn OUTSIDE the avatar rather than a border on it: box-shadow
   follows whatever shape the avatar actually is, so this works for the round
   and the square variant without assuming either. */
/* position:relative gives each avatar its own paint order, so the ring draws
   OVER the neighbour it overlaps instead of under it. Without it the stack
   reads as a row of clipped initials rather than overlapping discs. */
pl-ui-kit-page [data-avatars] > * {
  position: relative;
  box-shadow: 0 0 0 var(--pl-border-width-medium, 2px) var(--pl-color-surface, #FFFFFF);
  border-radius: inherit;
}

/* Shallow enough that two-character initials stay readable. */
pl-ui-kit-page [data-avatars] > * + * { margin-inline-start: -0.375rem; }

/*------------------------------------------------
  Table — no pl-table exists, so the kit shows a plain one wearing
  the system's own chrome.
-------------------------------------------------*/
pl-ui-kit-page [data-table] {
  border: var(--pl-border-width-small, 1px) solid var(--pl-color-border, #E5E7EB);
  border-radius: var(--pl-border-radius-medium, 8px);
  overflow: hidden;
}

pl-ui-kit-page [data-table] table {
  inline-size: 100%;
  border-collapse: collapse;
  font-size: var(--pl-font-size-sm, 0.8125rem);
}

pl-ui-kit-page [data-table] th {
  padding: var(--pl-size-8, 0.625rem) var(--pl-size-12, 0.875rem);
  background: var(--pl-color-surface-sunken, #F3F4F6);
  font-size: var(--pl-font-size-xs, 0.6875rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  letter-spacing: var(--pl-letter-spacing-loose, 0.06em);
  text-transform: uppercase;
  color: var(--pl-color-ink-secondary, #6B7280);
  text-align: start;
}

pl-ui-kit-page [data-table] td {
  padding: var(--pl-size-12, 0.75rem) var(--pl-size-12, 0.875rem);
  border-block-start: var(--pl-border-width-small, 1px) solid var(--pl-color-border, #E5E7EB);
}

pl-ui-kit-page [data-table] :is(th, td):last-child {
  text-align: end;
  font-variant-numeric: tabular-nums;
}

/* A stack, for form fields that each need their own line. */
pl-ui-kit-page [data-stack] {
  display: grid;
  gap: var(--pl-size-12, 0.75rem);
}

/*------------------------------------------------
  Swatches

  Each chip paints a token, so the palette IS the theme rather than a picture
  of it. Swap the theme and this panel is the first thing that changes.
-------------------------------------------------*/
pl-ui-kit-page [data-swatches] {
  display: grid;
  /* Sized to the LABEL, not the chip. Tracking the chip width put "Secondary"
     and "Success" hard against each other, because a 3rem chip does not leave
     3rem of room for the word under it. */
  grid-template-columns: repeat(auto-fill, minmax(var(--kit-swatch-track, 5rem), 1fr));
  gap: var(--pl-size-12, 0.75rem);
}

pl-ui-kit-page [data-swatch] {
  display: grid;
  gap: var(--pl-size-4, 0.25rem);
  font-size: var(--pl-font-size-xs, 0.75rem);
  color: var(--pl-color-ink-secondary, #6B7280);
  min-inline-size: 0;
  /* A long token name truncates rather than shoving its neighbour. */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

pl-ui-kit-page [data-swatch]::before {
  content: "";
  display: block;
  block-size: var(--kit-swatch-size);
  border-radius: var(--pl-border-radius-medium, 8px);
  border: var(--pl-border-width-small, 1px) solid var(--pl-color-border, #E5E7EB);
  background: var(--_swatch, var(--pl-color-surface-sunken, #F3F4F6));
}

pl-ui-kit-page [data-swatch="ink"]       { --_swatch: var(--pl-color-ink, #111827); }
pl-ui-kit-page [data-swatch="surface"]   { --_swatch: var(--pl-color-surface, #FFFFFF); }
pl-ui-kit-page [data-swatch="primary"]   { --_swatch: var(--pl-color-primary, #2563EB); }
pl-ui-kit-page [data-swatch="secondary"] { --_swatch: var(--pl-color-ink-secondary, #6B7280); }
pl-ui-kit-page [data-swatch="success"]   { --_swatch: var(--pl-color-success, #047857); }
pl-ui-kit-page [data-swatch="warning"]   { --_swatch: var(--pl-color-warning, #B45309); }
pl-ui-kit-page [data-swatch="danger"]    { --_swatch: var(--pl-color-error, #B91C1C); }

/*------------------------------------------------
  Type specimens
-------------------------------------------------*/
pl-ui-kit-page [data-specimen] {
  display: grid;
  gap: var(--pl-size-4, 0.25rem);
  padding-inline-start: var(--pl-size-16, 1rem);
  border-inline-start: var(--pl-border-width-small, 1px) solid var(--pl-color-border, #E5E7EB);
}

pl-ui-kit-page [data-specimen] > :first-child {
  margin: 0;
  font-size: var(--pl-font-size-xs, 0.75rem);
  color: var(--pl-color-ink-secondary, #6B7280);
}

pl-ui-kit-page [data-specimen] > :last-child {
  margin: 0;
  font-size: var(--pl-font-size-xl, 1.5rem);
  line-height: 1.2;
}

pl-ui-kit-page [data-specimen="display"] > :last-child {
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
}

pl-ui-kit-page [data-specimen="mono"] > :last-child {
  font-family: var(--pl-font-family-monospace, ui-monospace, monospace);
}

/*------------------------------------------------
  Narrow
-------------------------------------------------*/
@media (max-width: 60rem) {
  pl-ui-kit-page { --kit-columns: 2; }
}

@media (max-width: 40rem) {
  pl-ui-kit-page {
    --kit-columns: 1;
    --kit-padding: var(--pl-size-16, 1rem);
  }
}
`;
