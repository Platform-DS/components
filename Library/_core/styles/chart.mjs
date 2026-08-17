// ------------------------------
// Shared chart styles
// ------------------------------
// The pie and the doughnut are the same drawing. One conic-gradient, one
// palette, one legend; the doughnut punches a hole in the middle and the pie
// does not. That is the entire difference, and it is one custom property
// (`--chart-hole`), which is why these share a stylesheet rather than each
// carrying a near-copy of the other.
//
// ------------------------------
// Why a gradient and not an <svg>
// ------------------------------
// A pie chart is a circle divided by angle, and `conic-gradient` divides a
// circle by angle. Drawing it in SVG means computing arc paths in JavaScript
// and re-computing them on every change; drawing it here means JavaScript
// computes a handful of PERCENTAGES and CSS does the geometry. The component
// ends up with no layout code at all, and the chart resizes, respects
// `prefers-reduced-motion`, and prints, without any of that being handled.
//
// ------------------------------
// The split between CSS and JS is deliberate
// ------------------------------
// JavaScript sets ONE property, `--chart-stops`: the cumulative angles, which
// only it can know because only it can read the values. Everything else —
// color, size, hole, legend — is CSS a consumer can override, and the colors
// are the intent tokens, so a chart matches the rest of the system by default
// and re-themes with the rest of it.

/**
 * The palette, shared by every chart so a pie and a bar chart standing next to
 * each other color the same categories the same way.
 */
export const CHART_PALETTE = /*css*/`
    --chart-color-1: var(--pl-color-primary, #2563EB);
    --chart-color-2: var(--pl-color-success, #047857);
    --chart-color-3: var(--pl-color-warning, #B45309);
    --chart-color-4: var(--pl-color-error, #B91C1C);
    --chart-color-5: var(--pl-color-primary-border, #BFDBFE);
    --chart-color-6: var(--pl-color-success-border, #A7F3D0);
    --chart-color-7: var(--pl-color-warning-border, #FDE68A);
    --chart-color-8: var(--pl-color-error-border, #FECACA);`;

/**
 * @param {string} sel  the internal element carrying the gradient
 */
export const chartStyles = (sel = '.chart') => /*css*/`
  :host {
    /* The palette. Intent tokens first, so a chart looks like it belongs to
       the same system as the buttons and badges, and re-themes when they do.
       Override any single one to recolor a slice:
           pl-pie-chart { --chart-color-3: hotpink; }
       Past the four intents the ramp reuses the tinted surface/border steps
       rather than inventing colors, so an eight-slice chart still reads as
       one palette instead of a rainbow. */
    ${CHART_PALETTE}

    --chart-size: 12rem;
    /* 0% is a pie. Anything above it is a doughnut. */
    --chart-hole: 0%;
    --chart-track: var(--pl-color-surface-sunken, #F3F4F6);
    --chart-gap: var(--pl-size-24, 1.5rem);

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--chart-gap);
  }

  :host([hidden]) { display: none; }

  ${sel} {
    flex: none;
    position: relative;
    inline-size: var(--chart-size);
    block-size: var(--chart-size);
    border-radius: var(--pl-border-radius-full, 9999px);

    /* --chart-stops is the only thing JavaScript writes. Before it exists the
       chart is a plain track, which is also what an empty chart should look
       like rather than a black disc. */
    background: conic-gradient(from var(--chart-start, 0deg), var(--chart-stops, var(--chart-track) 0 100%));
  }

  /* The hole. A mask rather than an overlaid circle, so whatever is behind the
     chart shows through it — a card, a gradient, a photograph — instead of the
     chart having to guess the page's background color and paint it back. */
  ${sel} {
    mask: radial-gradient(circle at 50% 50%, transparent var(--chart-hole), #000 calc(var(--chart-hole) + 0.5px));
  }

  /* Middle of the doughnut: a total, a percentage, whatever the author slots.
     Sized off the hole so it cannot spill out of it. */
  .center {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    text-align: center;
    /* Outside the mask, or the hole would erase this too. */
    mask: none;
    pointer-events: none;
  }

  /*------------------------------------------------
    Legend

    The slotted list IS the data — see the note in ChartElement. These rules
    only give each row the color of the slice it names, matched by position,
    which is the one thing the author cannot write themselves without repeating
    the palette.
  -------------------------------------------------*/
  ::slotted(ul),
  ::slotted(ol) {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: var(--pl-size-8, 0.5rem);
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-sm, 0.875rem);
    color: var(--pl-color-ink, #111827);
  }
`;

/**
 * Legend swatches, injected into the DOCUMENT rather than the shadow root.
 *
 * `::slotted()` reaches a slotted element but not its children, and a legend
 * row is `<li>` with text inside it — so the swatch, which is a pseudo-element
 * on that `<li>`, cannot be styled from in here at all. These rules are scoped
 * to the chart tags so they cannot leak, and they are the reason the legend is
 * the author's own markup rather than something the component generates: the
 * text stays theirs, in their tree, translatable and crawlable.
 */
export const CHART_LEGEND_STYLES = (tags) => /*css*/`
${tags.map(tag => `:where(${tag}) :is(li, [data-value])`).join(',\n')} {
  display: flex;
  align-items: center;
  gap: var(--pl-size-8, 0.5rem);
}

${tags.map(tag => `:where(${tag}) :is(li, [data-value])::before`).join(',\n')} {
  content: "";
  flex: none;
  inline-size: var(--chart-swatch, 0.75em);
  block-size: var(--chart-swatch, 0.75em);
  border-radius: var(--pl-border-radius-small, 4px);
  /* Set per row below; the fallback keeps a ninth slice from painting nothing. */
  background: var(--_swatch, var(--chart-track, #F3F4F6));
}

${Array.from({ length: 8 }, (_, i) => tags
    .map(tag => `:where(${tag}) :is(li, [data-value]):nth-child(${i + 1})`)
    .join(',\n')
    + ` { --_swatch: var(--chart-color-${i + 1}); }`).join('\n\n')}
`;

/**
 * Bar chart rows, injected into the DOCUMENT for the same reason the legend
 * swatches are: a row is the author's own `<li>` in the light DOM, and
 * `::slotted()` reaches that `<li>` but never styles a pseudo-element on it.
 *
 * Vertical by default, because that is what most people picture when they say
 * bar chart, and because a column reads against a baseline the way a value
 * reads against zero:
 *
 *              42
 *            ██████        <- ::before, a gradient cut at --_fill
 *            ██████
 *            Search        <- the author's own text
 *
 * The bar is a linear-gradient cut at --_fill, which is exactly what the pie
 * does with a conic one. Same idea, one axis instead of a circle: JavaScript
 * contributes a percentage and CSS draws.
 *
 * content: attr(data-value) is why the number needs no extra markup. It is
 * already on the element as data, and this is the one place CSS can read it.
 *
 * ORDERING, not row/column pinning. A pseudo-element is generated around the
 * element's own text, so left alone the bar takes the first cell and the label
 * comes out in the wrong place. Pinning to grid lines does not fix it either:
 * auto-placement never moves its cursor backwards, so the label still lands
 * after the bar. Ordering does fix it, because the label is an ANONYMOUS grid
 * item and an anonymous item takes order 0 — so a negative order sorts before
 * the label and a positive one after it.
 */
export const CHART_BAR_STYLES = (tag) => /*css*/`
:where(${tag}) :is(ul, ol) {
  display: grid;
  grid-auto-flow: column;
  /* Content-sized, NOT 1fr. Stretching the columns to fill means a wide
     container spreads four bars across the whole page, and a bar chart read
     by comparing lengths stops working when the lengths are that far apart.
     Each column is a slot wide enough for the bar, growing only if its label
     needs more, and the group sits at the start of whatever space it is in. */
  grid-auto-columns: minmax(var(--bar-slot, 3rem), max-content);
  justify-content: var(--bar-align, start);
  gap: var(--bar-gap, var(--pl-size-12, 0.75rem));
  align-items: end;
  inline-size: 100%;
}

:where(${tag}) li {
  display: grid;
  grid-template-rows: auto var(--bar-height, 8rem) auto;
  justify-items: center;
  gap: var(--pl-size-8, 0.5rem);
  min-inline-size: 0;
  text-align: center;
}

/* The bar: full height of its track, filled from the bottom by the gradient.
   Nothing is aligned or positioned — the gradient stop IS the height. */
:where(${tag}) li::before {
  order: -1;
  content: "";
  /* A length, not a percentage: the column is content-sized now, so a
     percentage would resolve against a width that depends on the label. */
  inline-size: var(--bar-thickness, 2.25rem);
  block-size: 100%;
  border-radius: var(--bar-radius, var(--pl-border-radius-medium, 8px));
  background: linear-gradient(
    to top,
    var(--_swatch, var(--chart-color-1)) 0 var(--_fill, 0%),
    var(--chart-track, #F3F4F6) 0 100%
  );
}

/* The value, read straight off the attribute that drew the bar — so the number
   shown and the number measured are the same number, always. */
:where(${tag}) li::after {
  order: -2;
  content: attr(data-value);
  font-variant-numeric: tabular-nums;
  color: var(--pl-color-ink-secondary, #6B7280);
}

:where(${tag})[data-values="hidden"] li::after { content: none; }
:where(${tag})[data-values="hidden"] li { grid-template-rows: var(--bar-height, 8rem) auto; }

/*------------------------------------------------
  Horizontal

  Same rows, turned. Worth reaching for when the labels are long: a column
  chart has only its own width for a label, so "Referral traffic" either wraps,
  truncates, or tilts, and all three are worse than simply putting the label
  beside the bar.
-------------------------------------------------*/
:where(${tag})[data-orientation="horizontal"] :is(ul, ol) {
  grid-auto-flow: row;
  /* Both of these UNDO the vertical defaults, and both are load-bearing.
     Vertical packs content-sized columns at the start so a wide wrapper does
     not fling four bars across the page; horizontal wants the opposite, one
     column filling the width, because the bar's length IS the measurement.
     Left inherited, the single row-column stays content-sized, the 1fr track
     inside each row resolves to 0px, and every bar whose label is wide enough
     to fill the row disappears entirely. */
  grid-auto-columns: minmax(0, 1fr);
  justify-content: normal;
  gap: var(--bar-gap, var(--pl-size-8, 0.5rem));
  align-items: stretch;
}

:where(${tag})[data-orientation="horizontal"] li {
  grid-template-rows: auto;
  grid-template-columns: var(--bar-label, minmax(4rem, max-content)) 1fr var(--bar-value, max-content);
  align-items: center;
  justify-items: stretch;
  gap: var(--pl-size-12, 0.75rem);
  text-align: start;
}

/*
  One grid for every row, not one grid per row.

  Sized independently, each row's label and value columns fit ITS OWN text, so
  the 1fr track between them comes out a different width on every line: a
  one-digit value leaves a wider bar track than a two-digit one, and a long
  label leaves a narrower one. The bars then measure against different scales,
  which is precisely the thing a bar chart exists not to do. Measured on four
  rows it was an 8px spread; with values from 8 to 1,284 it would be far worse.

  Subgrid makes every row adopt the list's columns, so the label column is as
  wide as the longest label, the value column as wide as the longest value, and
  the track between them is identical on every row. The per-row template above
  stays as the fallback for anything without subgrid, where the bars are at
  least still drawn.
*/
@supports (grid-template-columns: subgrid) {
  :where(${tag})[data-orientation="horizontal"] :is(ul, ol) {
    grid-template-columns:
      var(--bar-label, minmax(4rem, max-content))
      1fr
      var(--bar-value, max-content);
  }

  :where(${tag})[data-orientation="horizontal"] li {
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }
}

:where(${tag})[data-orientation="horizontal"] li::before {
  order: 1;
  inline-size: auto;
  block-size: var(--bar-thickness, 0.75rem);
  border-radius: var(--bar-radius, var(--pl-border-radius-full, 9999px));
  background: linear-gradient(
    to right,
    var(--_swatch, var(--chart-color-1)) 0 var(--_fill, 0%),
    var(--chart-track, #F3F4F6) 0 100%
  );
}

:where(${tag})[data-orientation="horizontal"] li::after {
  order: 2;
  text-align: end;
}

:where(${tag})[data-orientation="horizontal"][data-values="hidden"] li {
  grid-template-columns: var(--bar-label, minmax(4rem, max-content)) 1fr;
}

${Array.from({ length: 8 }, (_, i) =>
    `:where(${tag}) li:nth-child(${i + 1}) { --_swatch: var(--chart-color-${i + 1}); }`).join('\n')}

/* Past the palette, keep going in the primary rather than painting nothing —
   a bar chart legitimately has more rows than a pie has readable slices. */
:where(${tag}) li:nth-child(n+9) { --_swatch: var(--chart-color-1); }

@media (prefers-reduced-motion: no-preference) {
  :where(${tag}) li::before { transition: background var(--bar-transition, 240ms) ease; }
}
`;
