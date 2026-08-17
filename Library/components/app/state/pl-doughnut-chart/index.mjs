// ------------------------------
// Doughnut Chart Component
// ------------------------------
// The same drawing as pl-pie-chart with a hole in it, which is one custom
// property (`--chart-hole`) and not a second implementation. What the hole buys
// is somewhere to put a figure:
//
//   <pl-doughnut-chart>
//     <span slot="center">1,284</span>
//     <span slot="center-label">visits</span>
//     <ul>
//       <li data-value="42">Search</li>
//       <li data-value="31">Direct</li>
//       <li data-value="27">Referral</li>
//     </ul>
//   </pl-doughnut-chart>
//
// The middle is a slot rather than an attribute because it is usually a
// formatted number — thousands separators, a currency, a unit — and formatting
// belongs to the page that knows the locale, not to a chart.

// Imports
import { RadialChartElement } from '../../../../_core/elements/RadialChartElement.mjs';
import { define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-doughnut-chart';

// Shadow DOM
export class DoughnutChart extends RadialChartElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        // The centre sits OUTSIDE the masked element: the mask that cuts the
        // hole would cut this too.
        this.#template.innerHTML = /*html*/`
            <div part="figure" class="figure">
                <div part="chart" class="chart"></div>
                <div part="center" class="center">
                    <slot name="center"></slot>
                    <slot name="center-label"></slot>
                </div>
            </div>
            <slot part="legend"></slot>
        `;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }
}

define(tagName, DoughnutChart);
