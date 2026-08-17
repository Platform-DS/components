// ------------------------------
// Bar Chart Styles
// ------------------------------
// The shared palette, and a column instead of a circle. The rows themselves
// are styled from the DOCUMENT (see CHART_BAR_STYLES): they are the author's
// own <li> elements in the light DOM, and ::slotted() cannot reach a
// pseudo-element on a slotted element's own box.

import { CHART_PALETTE } from '../../../../_core/styles/chart.mjs';

export const STYLES = /*css*/`
  :host {
    ${CHART_PALETTE}

    --chart-track: var(--pl-color-surface-sunken, #F3F4F6);

    display: block;
    inline-size: 100%;
  }

  :host([hidden]) { display: none; }

  ::slotted(ul),
  ::slotted(ol) {
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-sm, 0.875rem);
    color: var(--pl-color-ink, #111827);
  }
`;
