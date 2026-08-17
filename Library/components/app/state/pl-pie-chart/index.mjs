// ------------------------------
// Pie Chart Component
// ------------------------------
// EXTENDS RadialChartElement, which does all of the work: read `data-value`
// off the author's list, turn the running total into conic-gradient stops. This
// file is a tag name and a template.
//
//   <pl-pie-chart>
//     <ul>
//       <li data-value="42">Search</li>
//       <li data-value="31">Direct</li>
//       <li data-value="27">Referral</li>
//     </ul>
//   </pl-pie-chart>
//
// A pie shows how a whole divides. Use a doughnut when you want a figure in
// the middle, and a <pl-meter> when there is only one value — a single-slice
// pie is a circle, and a circle is not a comparison.

// Imports
import { RadialChartElement } from '../../../../_core/elements/RadialChartElement.mjs';
import { define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-pie-chart';

// Shadow DOM
export class PieChart extends RadialChartElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        this.#template.innerHTML = /*html*/`
            <div part="chart" class="chart"></div>
            <slot part="legend"></slot>
        `;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }
}

define(tagName, PieChart);
