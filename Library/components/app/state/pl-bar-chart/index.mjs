// ------------------------------
// Bar Chart Component
// ------------------------------
// The same idea as the round charts, on one axis: a value becomes a percentage
// and a CSS gradient draws it. Where a pie cuts a conic-gradient by angle, a
// bar cuts a linear one by width.
//
//   <pl-bar-chart>
//     <ul>
//       <li data-value="42">Search</li>
//       <li data-value="31">Direct</li>
//       <li data-value="27">Referral</li>
//     </ul>
//   </pl-bar-chart>
//
// ------------------------------
// Bars are compared, slices are shared
// ------------------------------
// The one real difference from a pie is the denominator. A slice is a part of a
// whole, so its denominator is the SUM. A bar is a magnitude being compared
// with the bars beside it, so its denominator is the LARGEST value — which is
// what makes the longest bar reach the end of its track and everything else
// read as a proportion of it. Set `total` when the axis has a fixed maximum
// (a score out of ten, a quota) and the bars measure against that instead.
//
// This is also why a bar chart can say things a pie cannot. Values that do not
// sum to a meaningful whole — response times, prices, votes across incomparable
// options — are nonsense as slices and fine as bars.

// Imports
import { ChartElement } from '../../../../_core/elements/ChartElement.mjs';
import { define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { CHART_BAR_STYLES } from '../../../../_core/styles/chart.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-bar-chart';

// Shadow DOM
export class BarChart extends ChartElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`<slot part="rows"></slot>`;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    /** Bars are compared with each other, so the tallest sets the scale. */
    defaultTotal(values) {
        return Math.max(0, ...values);
    }

    connectedCallback() {
        injectStyles(tagName, CHART_BAR_STYLES(tagName));
        super.connectedCallback();
    }

    draw(values, total) {
        // One custom property per row, written on the row itself.
        //
        // The round charts write a single property on their own shadow element
        // because one gradient draws every slice. A bar chart has one gradient
        // PER ROW, so the number has to land on the row — and the rows are the
        // author's elements. It is a private custom property and nothing else:
        // no classes added, no markup rewritten, no text touched.
        //
        // The observer filters on `data-value`, so writing `style` here cannot
        // feed back into another render.
        this.slices.forEach((row, index) => {
            const fill = Math.min(100, (values[index] / total) * 100);
            row.style.setProperty('--_fill', `${fill.toFixed(3)}%`);
        });
    }

    clear() {
        for (const row of this.slices) row.style.removeProperty('--_fill');
    }
}

define(tagName, BarChart);
