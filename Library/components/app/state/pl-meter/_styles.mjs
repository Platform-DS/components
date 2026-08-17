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
    display: block;
    --_track: var(--meter-track, var(--pl-color-surface-sunken, #F3F4F6));
    --_good: var(--meter-optimum, var(--pl-color-success, #15803D));
    --_ok: var(--meter-suboptimum, var(--pl-color-warning, #B45309));
    --_bad: var(--meter-poor, var(--pl-color-error, #B91C1C));
  }

  :host([hidden]) { display: none; }

  meter {
    appearance: none;
    -webkit-appearance: none;
    display: block;
    inline-size: 100%;
    block-size: var(--meter-height, 0.5rem);
    border: 0;
    border-radius: var(--pl-border-radius-full, 9999px);
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
`;
