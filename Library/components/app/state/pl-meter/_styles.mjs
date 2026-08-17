// ------------------------------
// Meter Styles
// ------------------------------
// Styling a native <meter> means going through vendor pseudo-elements, and
// there is no standard one — WebKit/Blink expose ::-webkit-meter-bar plus a
// separate value pseudo for EACH zone, Firefox exposes ::-moz-meter-bar and
// tints it by itself. Both sets are written out below; a browser simply
// ignores the ones it does not know.
//
// The three WebKit value pseudos are the whole reason to use <meter> rather
// than draw a bar: the browser decides which one applies from low/high/optimum,
// so the color follows the value with nothing watching it.
//
// `appearance: none` is required first — without it WebKit keeps its own
// rendering and ignores everything here.

export const STYLES = /*css*/`
  :host {
    display: grid;
    gap: var(--meter-gap, var(--pl-size-4, 0.25rem));

    --_track: var(--meter-track, var(--pl-color-surface-sunken, #F3F4F6));
    --_good: var(--meter-optimum, var(--pl-color-success, #15803D));
    --_ok: var(--meter-suboptimum, var(--pl-color-warning, #B45309));
    --_bad: var(--meter-poor, var(--pl-color-error, #B91C1C));

    /* Gradient mode. The base is one color and the light end is mixed from it,
       so a themed meter needs one value rather than two that have to be kept
       in a sensible relationship with each other. */
    --_base: var(--meter-color, var(--pl-color-primary, #2563EB));
    --_ramp: var(--meter-gradient, linear-gradient(
      to right,
      color-mix(in oklab, var(--_base) 28%, var(--pl-color-surface, #FFFFFF)),
      var(--_base)
    ));
  }

  :host([hidden]) { display: none; }

  /*------------------------------------------------
    Header — the label, and a formatted readout beside it
  -------------------------------------------------*/
  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--pl-size-12, 0.75rem);
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--meter-label-size, var(--pl-font-size-sm, 0.875rem));
    line-height: var(--pl-line-height-medium, 1.5);
  }

  .header[hidden] { display: none; }

  .label { color: var(--pl-color-ink, #111827); }

  /* Tabular, so a readout counting up does not jitter its own width. */
  .value {
    color: var(--pl-color-ink-secondary, #6B7280);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  /*------------------------------------------------
    Bar
  -------------------------------------------------*/
  meter {
    appearance: none;
    -webkit-appearance: none;
    display: block;
    inline-size: 100%;
    block-size: var(--meter-height, 0.5rem);
    border: 0;
    border-radius: var(--meter-radius, var(--pl-border-radius-full, 9999px));
    background: var(--_track);
    overflow: hidden;
  }

  /* WebKit / Blink — the track, then one rule per zone. */
  meter::-webkit-meter-inner-element {
    -webkit-appearance: none;
    appearance: none;
  }

  meter::-webkit-meter-bar {
    background: var(--_track);
    border: 0;
    border-radius: inherit;
  }

  meter::-webkit-meter-optimum-value {
    background: var(--_good);
    border-radius: inherit;
  }

  meter::-webkit-meter-suboptimum-value {
    background: var(--_ok);
    border-radius: inherit;
  }

  meter::-webkit-meter-even-less-good-value {
    background: var(--_bad);
    border-radius: inherit;
  }

  /* Firefox — one pseudo, which it already tints per zone; :-moz-meter-* on
     the host element is what selects which zone the value falls in. */
  meter::-moz-meter-bar {
    background: var(--_good);
    border-radius: inherit;
  }

  meter:-moz-meter-sub-optimum::-moz-meter-bar { background: var(--_ok); }
  meter:-moz-meter-sub-sub-optimum::-moz-meter-bar { background: var(--_bad); }

  /*------------------------------------------------
    Gradient fill

    The point of a ramp is that a POSITION has a color: two thirds along is the
    same shade whatever the current value is. A gradient painted on the fill
    alone does the opposite — it stretches, so the far end is the dark end at
    every value and the color says nothing.

    So the gradient has to span the TRACK while only the fill shows it, and the
    fill's width is the browser's to set. background-size solves it: sizing the
    fill's background to 100% / fraction makes the ramp exactly as wide as the
    track, and the fill becomes a window onto the first fraction of it.
    --_fraction is the one thing JavaScript contributes here (see index.mjs).

    Deliberately NOT combined with low/high/optimum: those two answer different
    questions. Zones say good or bad; a ramp says low or high. A meter that did
    both would be claiming that more is worse and darker at the same time.
  -------------------------------------------------*/
  /* Split by engine, and it MUST stay split: one invalid selector invalidates
     the whole list, so grouping ::-moz-meter-bar in with the WebKit pseudos
     makes Chrome drop the rule entirely and the ramp silently never paints.
     That is the same reason the zone rules above are written out twice. */
  :host([data-fill="gradient"]) meter::-webkit-meter-optimum-value,
  :host([data-fill="gradient"]) meter::-webkit-meter-suboptimum-value,
  :host([data-fill="gradient"]) meter::-webkit-meter-even-less-good-value {
    background-image: var(--_ramp);
    background-repeat: no-repeat;
    background-size: calc(100% / var(--_fraction, 1)) 100%;
  }

  :host([data-fill="gradient"]) meter::-moz-meter-bar {
    background-image: var(--_ramp);
    background-repeat: no-repeat;
    background-size: calc(100% / var(--_fraction, 1)) 100%;
  }
`;
