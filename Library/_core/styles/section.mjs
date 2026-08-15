// ------------------------------
// Shared section styles — LIGHT DOM
// ------------------------------
// Every content section is a full-width band with a centred, measure-capped
// column inside it. That's done with a grid rather than a wrapper <div>, so the
// author's markup stays exactly what they wrote — which is the whole reason
// content components are Light DOM in the first place.
//
//   [full-start] gutter [content-start] content [content-end] gutter [full-end]
//
// Children land in the `content` column by default; anything that should run
// edge to edge (a background image, a full-bleed strip) opts in with
// `grid-column: full`.
//
// Injected once for all section tags, so the shared rules exist in one place
// and one stylesheet. Wrapped in @layer pl-components so a consumer's own
// unlayered CSS always wins.

/** Every tag that participates in the section layout. */
export const SECTION_TAGS = [
    'pl-hero',
    'pl-social-proof',
    'pl-benefits',
    'pl-features',
    'pl-testimonials',
    'pl-faqs',
    'pl-cta',
];

const SEL = `:is(${SECTION_TAGS.join(', ')})`;

export const SECTION_STYLES = /*css*/`
@layer pl-components {
  ${SEL} {
    /* Layout knobs — override per instance or per page. */
    --section-width: 68rem;
    --section-gutter: var(--pl-size-24, 1.5rem);
    --section-space: clamp(3.5rem, 7vw, 6.5rem);

    /* Resolved per surface, below. */
    --section-bg: var(--pl-color-surface, #fff);
    --section-ink: var(--pl-color-ink, #111);
    --section-ink-muted: var(--pl-color-ink-secondary, #626262);
    --section-accent: var(--pl-color-primary, #2563EB);
    --section-line: var(--pl-color-border, #cfcfcf);

    display: grid;
    grid-template-columns:
      [full-start] minmax(var(--section-gutter), 1fr)
      [content-start] min(var(--section-width), 100% - var(--section-gutter) * 2)
      [content-end] minmax(var(--section-gutter), 1fr)
      [full-end];

    padding-block: var(--section-space);

    background: var(--section-bg);
    color: var(--section-ink);
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-base, 1rem);
    line-height: var(--pl-line-height-medium, 1.5);
  }

  ${SEL} > * { grid-column: content; }
  ${SEL} > [data-bleed] { grid-column: full; }

  /*------------------------------------------------
    Width
  -------------------------------------------------*/
  ${SEL}[data-width="narrow"] { --section-width: 46rem; }
  ${SEL}[data-width="wide"]   { --section-width: 84rem; }
  ${SEL}[data-width="full"]   { --section-width: 100%; --section-gutter: 0px; }

  /*------------------------------------------------
    Surfaces — the band's colour scheme. The ink and brand surfaces invert, so
    muted text and rules are re-pointed too, not just the background.
  -------------------------------------------------*/
  ${SEL}[data-surface="muted"] {
    --section-bg: var(--pl-color-surface-raised, #F9FAFB);
  }

  ${SEL}[data-surface="ink"] {
    --section-bg: var(--pl-color-ink, #111);
    --section-ink: var(--pl-color-surface, #fff);
    --section-ink-muted: var(--pl-color-gray-400, #9CA3AF);
    --section-accent: var(--pl-color-primary-border, #BFDBFE);
    --section-line: var(--pl-color-gray-700, #374151);
  }

  ${SEL}[data-surface="brand"] {
    --section-bg: var(--pl-color-primary, #2563EB);
    --section-ink: var(--pl-color-on-primary, #FFFFFF);
    --section-ink-muted: color-mix(in oklab, var(--pl-color-on-primary, #FFFFFF) 75%, transparent);
    --section-accent: var(--pl-color-on-primary, #FFFFFF);
    --section-line: color-mix(in oklab, var(--pl-color-on-primary, #FFFFFF) 30%, transparent);
  }

  /*------------------------------------------------
    Section header — eyebrow, title, lede.

    Styled structurally so the author writes plain HTML: an <h2> is the title,
    the paragraph directly after it is the lede. Only the eyebrow needs a hook,
    and it's a data attribute rather than a class so it can't collide with a
    consumer's own naming.
  -------------------------------------------------*/
  ${SEL} > * { margin-block: 0; }
  ${SEL} > * + * { margin-block-start: var(--pl-size-16, 1rem); }

  ${SEL} :is(h1, h2, h3, h4) {
    font-family: var(--pl-font-family-display, var(--pl-font-family-sans-serif, system-ui, sans-serif));
    font-weight: var(--pl-font-weight-bold, 700);
    line-height: var(--pl-line-height-tight, 1.15);
    letter-spacing: -0.02em;
    text-wrap: balance;
    color: var(--section-ink);
  }

  ${SEL} > h2 {
    font-size: clamp(1.75rem, 1.1rem + 2.2vw, 2.5rem);
    max-inline-size: 20ch;
  }

  /* The paragraph immediately after the title is the lede. */
  ${SEL} > h2 + p {
    font-size: var(--pl-font-size-lg, 1.125rem);
    color: var(--section-ink-muted);
    max-inline-size: 60ch;
    text-wrap: pretty;
  }

  ${SEL} > [data-eyebrow] {
    font-size: var(--pl-font-size-sm, 0.875rem);
    font-weight: var(--pl-font-weight-semibold, 600);
    letter-spacing: var(--pl-letter-spacing-loose, 0.05em);
    text-transform: uppercase;
    color: var(--section-accent);
  }

  ${SEL} > [data-eyebrow] + h2 { margin-block-start: var(--pl-size-8, 0.5rem); }

  ${SEL} p { text-wrap: pretty; }

  /*------------------------------------------------
    Alignment
  -------------------------------------------------*/
  ${SEL}[data-align="center"] {
    justify-items: center;
    text-align: center;
  }

  ${SEL}[data-align="center"] > :is(h2, h2 + p) {
    margin-inline: auto;
  }

  /*------------------------------------------------
    Actions — a row of buttons/links, in any section.
  -------------------------------------------------*/
  ${SEL} > [data-actions] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--pl-size-12, 0.75rem);
    margin-block-start: var(--pl-size-24, 1.5rem);
  }

  ${SEL}[data-align="center"] > [data-actions] { justify-content: center; }

  /*------------------------------------------------
    Buttons on inverted bands.

    A button reads the PAGE's tokens, which are tuned for the page background —
    so on an ink or brand band a secondary button's near-black text lands on a
    near-black surface, and a primary button on a brand band is brand-on-brand.
    The section is what knows it inverted, so it re-points the button's own
    hooks. pl-cta is listed alongside because it fills with the brand colour
    even when no surface attribute is set.
  -------------------------------------------------*/
  ${SEL}:is([data-surface="ink"], [data-surface="brand"]) :is(pl-button, pl-button-link):is([variant="secondary"], [variant="ghost"]),
  pl-cta:not([data-surface]) :is(pl-button, pl-button-link):is([variant="secondary"], [variant="ghost"]) {
    --button-color: var(--section-ink);
    --button-border: var(--section-ink);
    --button-background-hover: color-mix(in oklab, var(--section-ink) 16%, transparent);
  }

  ${SEL}[data-surface="brand"] :is(pl-button, pl-button-link):is(:not([variant]), [variant="primary"]),
  pl-cta:not([data-surface]) :is(pl-button, pl-button-link):is(:not([variant]), [variant="primary"]) {
    --button-background: var(--section-ink);
    --button-color: var(--section-bg);
    --button-background-hover: color-mix(in oklab, var(--section-ink) 86%, transparent);
  }

  /*------------------------------------------------
    Fields on inverted bands.

    Same problem as the buttons, one step worse. A field reads the PAGE's
    surface, and an inverted band is by definition not the page: in the dark
    theme an ink band renders LIGHT, so the field arrived near-black on a
    near-white band and disappeared.

    A field stays LIGHT on either, rather than flipping with the theme the way
    the band does. It is the one control whose job is to look like paper you
    write on, and paper reads as paper in both themes — a dark well on a light
    band reads as disabled, or as a gap.

    Which is why these are RAW scale steps, against the usual rule. The note in
    tokens.css warns components off them because a raw step is light in both
    themes; here that is precisely the requirement, and the semantic tokens
    cannot express it because they are the thing that moves.
  -------------------------------------------------*/
  ${SEL}:is([data-surface="ink"], [data-surface="brand"]) :is(pl-input, pl-textarea, pl-select, pl-search, pl-autocomplete),
  pl-cta:not([data-surface]) :is(pl-input, pl-textarea, pl-select, pl-search, pl-autocomplete) {
    --field-background: var(--pl-color-gray-50, #F9FAFB);
    --field-color: var(--pl-color-gray-900, #111827);
    --field-placeholder: var(--pl-color-gray-500, #6B7280);
    /* gray-500, not the lighter step a field uses on a page. In the dark
       theme the band this sits on is itself near-white, so a pale border is
       the difference between a visible control boundary and none: measured,
       gray-300 lands at 1.2:1 against that band and gray-500 at 4.1:1, either
       side of the 3:1 that WCAG 1.4.11 asks of a control's own edge. */
    --field-border: var(--pl-color-gray-500, #6B7280);
    --field-border-hover: var(--pl-color-gray-700, #374151);
    /* The default ring is the primary blue, which vanishes on a brand band.
       The band's own ink contrasts with the band by definition. */
    --field-accent: var(--pl-color-gray-900, #111827);
    --field-ring: color-mix(in oklab, var(--section-ink) 45%, transparent);
  }
}
`;
