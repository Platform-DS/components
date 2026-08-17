// ------------------------------
// Content Page Styles — LIGHT DOM
// ------------------------------
// One measured column of editorial furniture. Everything reads from tokens
// with fallbacks, so a theme reaches every rule, the ornament, and the drop
// cap alike — swap the palette and the whole article follows.
//
// The accents are indirected through --content-accent and --content-accent-2
// (primary and warning by default) so an author can re-season the decorative
// color — the kicker, the drop cap, the ornament diamonds, the quote mark —
// without touching the semantic tokens underneath.

export const STYLES = /*css*/`
:where(pl-content-page) {
  --content-measure: 52rem;
  --content-padding: var(--pl-size-48, 3rem) var(--pl-size-32, 2rem);
  --content-flow: var(--pl-size-48, 3rem);
  --content-accent: var(--pl-color-primary, #2563EB);
  --content-accent-2: var(--pl-color-warning, #B45309);
  --content-rule: var(--pl-color-border, #E5E7EB);
}

pl-content-page {
  display: block;
  inline-size: 100%;
  max-inline-size: var(--content-measure);
  margin-inline: auto;
  padding: var(--content-padding);
  background: var(--pl-color-surface-sunken, #F3F4F6);
  color: var(--pl-color-ink, #111827);
  font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
  font-size: var(--pl-font-size-base, 1rem);
  line-height: var(--pl-line-height-loose, 1.75);
}

pl-content-page[hidden] { display: none; }

/* UA margins off — blockquote's 1em 40px above all. :where() rather than :is()
   is load-bearing: :is() would take the specificity of its most specific
   argument (0,0,2) and outrank the flow rule below, which zeroes the top margin
   of the one top-level child that is a blockquote — the quote band. :where()
   contributes nothing, so this sits at (0,0,1) and loses to the flow rule on
   source order. Keep it ABOVE that rule. */
pl-content-page :where(h1, h2, h3, p, blockquote) { margin: 0; }

/* The rhythm between movements, owned here so the regions don't have to. */
pl-content-page > * + * { margin-block-start: var(--content-flow); }

/*------------------------------------------------
  Masthead — nameplate left, issue line right, a heavy rule below
-------------------------------------------------*/
pl-content-page [data-masthead] {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--pl-size-16, 1rem);
  flex-wrap: wrap;
  padding-block-end: var(--pl-size-16, 1rem);
  border-block-end: var(--pl-border-width-medium, 2px) solid var(--pl-color-ink, #111827);
}

pl-content-page [data-brand] {
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: var(--pl-font-size-sm, 0.875rem);
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

pl-content-page [data-issue] {
  font-size: var(--pl-font-size-xs, 0.75rem);
  letter-spacing: var(--pl-letter-spacing-loose, 0.12em);
  text-transform: uppercase;
  color: var(--pl-color-ink-secondary, #6B7280);
}

/*------------------------------------------------
  Headline block — kicker, headline, lede, in strict hierarchy
-------------------------------------------------*/
pl-content-page [data-kicker] {
  font-size: var(--pl-font-size-xs, 0.75rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--content-accent);
  margin-block-end: var(--pl-size-16, 1rem);
}

pl-content-page [data-headline] h1 {
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: clamp(2.5rem, 1.4rem + 4.5vw, 4.5rem);
  line-height: var(--pl-line-height-tight, 1.05);
  letter-spacing: var(--pl-letter-spacing-tight, -0.025em);
  text-wrap: balance;
}

pl-content-page [data-lede] {
  margin-block-start: var(--pl-size-16, 1rem);
  font-size: clamp(1.25rem, 1rem + 1vw, 1.625rem);
  line-height: var(--pl-line-height-medium, 1.35);
  color: var(--pl-color-ink-secondary, #6B7280);
  text-wrap: balance;
}

/*------------------------------------------------
  Ornament — a rule broken by rotated diamonds

  The lines are the element's own pseudo-elements; each child span is one
  diamond, so the author chooses how many. They alternate accent colors.
-------------------------------------------------*/
pl-content-page [data-ornament] {
  display: flex;
  align-items: center;
  gap: var(--pl-size-16, 1rem);
}

pl-content-page [data-ornament]::before,
pl-content-page [data-ornament]::after {
  content: "";
  flex: 1;
  block-size: var(--pl-border-width-small, 1px);
  background: var(--content-rule);
}

pl-content-page [data-ornament] > * {
  inline-size: 0.4375rem;
  block-size: 0.4375rem;
  background: var(--content-accent);
  transform: rotate(45deg);
}

pl-content-page [data-ornament] > :nth-child(even) {
  background: var(--content-accent-2);
}

/*------------------------------------------------
  Body — prose beside a pull quote
-------------------------------------------------*/
pl-content-page [data-body] {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
  gap: var(--pl-size-48, 3rem);
}

pl-content-page [data-body] p + p { margin-block-start: var(--pl-size-16, 1.25rem); }

pl-content-page [data-pull-quote] {
  align-self: center;
  padding-inline-start: var(--pl-size-24, 1.5rem);
  border-inline-start: calc(var(--pl-border-width-small, 1px) * 3) solid var(--pl-color-ink, #111827);
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: var(--pl-font-size-xl, 1.5rem);
  line-height: var(--pl-line-height-medium, 1.3);
  letter-spacing: var(--pl-letter-spacing-tight, -0.01em);
}

/* The drop cap is the paragraph's own first letter, so it never drifts from
   the text it opens. */
pl-content-page [data-dropcap]::first-letter {
  float: inline-start;
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: 4em;
  line-height: 0.82;
  color: var(--content-accent);
  padding: 0.08em 0.15em 0 0;
}

/*------------------------------------------------
  Sections — sub header, its subtitle, optional two-column prose
-------------------------------------------------*/
pl-content-page [data-section] h2 {
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: var(--pl-font-size-2xl, 2rem);
  letter-spacing: var(--pl-letter-spacing-tight, -0.015em);
  line-height: var(--pl-line-height-tight, 1.15);
}

pl-content-page [data-subtitle] {
  margin-block: var(--pl-size-8, 0.5rem) var(--pl-size-16, 1.25rem);
  font-size: var(--pl-font-size-xs, 0.75rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--pl-color-ink-secondary, #6B7280);
}

pl-content-page [data-columns] {
  columns: 2;
  column-gap: var(--pl-size-48, 2.5rem);
}

pl-content-page [data-columns] p + p { margin-block-start: var(--pl-size-16, 1.25rem); }

/*------------------------------------------------
  Quote band — the one full-color moment on the page
-------------------------------------------------*/
pl-content-page [data-quote] {
  padding: var(--pl-size-48, 3.5rem) var(--pl-size-64, 4rem);
  background: var(--pl-color-ink, #111827);
  color: var(--pl-color-surface, #FFFFFF);
  border-radius: calc(var(--pl-border-radius-large, 16px) * 1.5);
  text-align: center;
}

pl-content-page [data-quote]::before {
  content: "\\201D";
  display: block;
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: var(--pl-size-64, 4rem);
  line-height: 0.5;
  color: var(--content-accent-2);
  margin-block-end: var(--pl-size-24, 1.5rem);
}

pl-content-page [data-quote] > :first-child {
  max-inline-size: 18ch;
  margin-inline: auto;
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  font-size: var(--pl-font-size-2xl, 2rem);
  line-height: var(--pl-line-height-medium, 1.3);
  letter-spacing: var(--pl-letter-spacing-tight, -0.01em);
  text-wrap: balance;
}

pl-content-page [data-quote] cite {
  display: block;
  margin-block-start: var(--pl-size-24, 1.5rem);
  font-style: normal;
  font-size: var(--pl-font-size-xs, 0.75rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: var(--pl-opacity-60, 0.6);
}

/*------------------------------------------------
  Closing — a short resolution, a CTA, a footnote
-------------------------------------------------*/
pl-content-page [data-closing] {
  max-inline-size: 56ch;
  margin-inline: auto;
  text-align: center;
}

pl-content-page [data-closing] > * + * { margin-block-start: var(--pl-size-16, 1rem); }

pl-content-page [data-footnote] {
  font-size: var(--pl-font-size-xs, 0.75rem);
  font-style: italic;
  color: var(--pl-color-ink-secondary, #6B7280);
}

/*------------------------------------------------
  Colophon — the page's own footer, inside the measure
-------------------------------------------------*/
pl-content-page [data-colophon] {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--pl-size-16, 1rem);
  flex-wrap: wrap;
  padding-block-start: var(--pl-size-16, 1rem);
  border-block-start: var(--pl-border-width-small, 1px) solid var(--content-rule);
  font-size: var(--pl-font-size-xs, 0.75rem);
  color: var(--pl-color-ink-secondary, #6B7280);
}

pl-content-page [data-colophon] > :first-child {
  font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
  font-weight: var(--pl-font-weight-bold, 700);
  color: var(--pl-color-ink, #111827);
}

/*------------------------------------------------
  Narrow — the two-column moments fold before the type shrinks
-------------------------------------------------*/
@media (max-width: 48rem) {
  pl-content-page { --content-flow: var(--pl-size-32, 2rem); }

  pl-content-page [data-body] { grid-template-columns: minmax(0, 1fr); }
  pl-content-page [data-columns] { columns: 1; }

  pl-content-page [data-quote] {
    padding: var(--pl-size-32, 2rem) var(--pl-size-24, 1.5rem);
  }
}

@media (max-width: 40rem) {
  pl-content-page { --content-padding: var(--pl-size-32, 2rem) var(--pl-size-16, 1rem); }
}
`;
