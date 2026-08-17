// ------------------------------
// Doughnut Chart Styles
// ------------------------------
// The shared chart stylesheet plus one declaration. `--chart-hole` is the
// entire difference between this component and pl-pie-chart, which is why it
// is a custom property rather than two implementations: a consumer can make a
// pie thinner or a doughnut fatter without either component knowing.

import { chartStyles } from '../../../../_core/styles/chart.mjs';

export const STYLES = /*css*/`
  ${chartStyles('.chart')}

  :host { --chart-hole: 62%; }

  /* The containing block for .center. It wraps the chart rather than the chart
     carrying the centre itself, because the mask that cuts the hole applies to
     the whole element and would cut the figure out of the middle with it. */
  .figure {
    flex: none;
    position: relative;
    display: grid;
  }

  /* Scales with the chart rather than the page, so the middle stays in
     proportion when --chart-size changes. */
  .center {
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: calc(var(--chart-size) / 7);
    font-weight: var(--pl-font-weight-bold, 700);
    line-height: 1.1;
    color: var(--pl-color-ink, #111827);
  }

  ::slotted([slot="center"]) {
    margin: 0;
    font: inherit;
    color: inherit;
  }

  ::slotted([slot="center-label"]) {
    margin: 0;
    display: block;
    font-size: var(--pl-font-size-xs, 0.75rem);
    font-weight: var(--pl-font-weight-medium, 500);
    color: var(--pl-color-ink-secondary, #6B7280);
  }
`;
