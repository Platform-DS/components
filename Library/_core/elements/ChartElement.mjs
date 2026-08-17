// ------------------------------
// ChartElement — shared base for every chart
// ------------------------------
// Reads `data-value` off the author's own list items, resolves a denominator,
// and hands both to `draw()`. What a subclass does with them is the only thing
// that differs between a pie, a doughnut and a bar chart: each one turns the
// numbers into PERCENTAGES and lets a CSS gradient do the geometry. No canvas,
// no SVG path maths, no resize observer, in any of them.
//
//   <pl-pie-chart>
//     <ul>
//       <li data-value="42">Search</li>
//       <li data-value="31">Direct</li>
//       <li data-value="27">Referral</li>
//     </ul>
//   </pl-pie-chart>
//
// ------------------------------
// The list is the chart, and that is the accessibility story
// ------------------------------
// The gradient is `aria-hidden`. It is a colored circle: announcing it would
// announce a shape, and a shape carries none of the information a pie chart is
// FOR. What a screen reader should get is the numbers, and the numbers are
// already on the page as a real list, in the author's own words — so the
// component leaves them exactly where they are and paints beside them.
//
// This is why the data lives in slotted markup rather than a `values="42,31,27"`
// attribute or a JS property. A list survives styles being off, JavaScript
// failing, a translation pass, and a search crawler. An attribute of numbers
// survives none of those, and would still need a legend written by hand.
//
// ------------------------------
// The denominator is the subclass's decision
// ------------------------------
// A pie slice is a SHARE — its denominator is the sum, because the slices are
// parts of one whole. A bar is a MAGNITUDE — its denominator is the largest
// value, because the bars are being compared with each other rather than
// summed. Same data, different question, so `defaultTotal()` is where the two
// diverge and everything above it is shared.

import { BaseElement } from './BaseElement.mjs';
import { injectStyles } from '../utilities/injectStyles.mjs';
import { CHART_LEGEND_STYLES } from '../styles/chart.mjs';

/** Every tag whose legend these document-level rules color. */
const CHART_TAGS = ['pl-pie-chart', 'pl-doughnut-chart'];

export class ChartElement extends BaseElement {
    static props = {
        /**
         * The denominator. Defaults to the sum of the slices, which is what a
         * pie chart normally means. Set it larger to draw a PARTIAL chart —
         * "3 of 10 seats used" — and the remainder is left as bare track.
         */
        total: { type: Number },
    };

    /** Every element carrying a value, in document order. */
    get slices() {
        return [...this.querySelectorAll('[data-value]')];
    }

    /** The parsed values, with anything unusable dropped rather than NaN'd. */
    get values() {
        return this.slices
            .map(el => Number(el.dataset.value))
            .map(n => (Number.isFinite(n) && n > 0 ? n : 0));
    }

    /**
     * The denominator when `total` is not set. Overridden per chart type: the
     * sum for anything showing shares of a whole, the maximum for anything
     * comparing magnitudes.
     */
    defaultTotal(values) {
        return values.reduce((a, b) => a + b, 0);
    }

    /**
     * Turn resolved numbers into whatever this chart draws with.
     *
     * @param {number[]} values  parsed and sanitised, in document order
     * @param {number}   total   the denominator, always greater than zero
     */
    draw() {}

    /** Called when there is nothing to draw, so a chart can reset itself. */
    clear() {}

    render() {
        const values = this.values;
        const total = this.props.total > 0 ? this.props.total : this.defaultTotal(values);

        // No data yet is a legitimate state — a chart waiting on a fetch — and
        // so is every value being zero. Both should show the empty chart the
        // stylesheet already describes rather than the last render, or a
        // division by zero.
        if (!(total > 0)) {
            this.clear();
            return;
        }

        this.draw(values, total);
    }

    connectedCallback() {
        // Document-level, and deliberately: the legend is the author's own
        // markup in the LIGHT DOM, so ::slotted() reaches the <ul> but never
        // the <li> inside it, and the swatch is a pseudo-element on that <li>.
        // Scoped to the chart tags and wrapped in :where(), so it cannot leak
        // and cannot outrank anything the page says about its own lists.
        injectStyles('pl-chart-legend', CHART_LEGEND_STYLES(CHART_TAGS));

        super.connectedCallback();

        // The values live in the author's markup, so the component has to watch
        // that markup: a chart fed by a fetch gets its <li>s appended after
        // upgrade, and a chart driven by an app gets `data-value` rewritten in
        // place. Neither is an attribute on the host, so neither would reach
        // attributeChangedCallback.
        this.#observer ??= new MutationObserver(() => this.render());
        this.#observer.observe(this, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-value'],
        });
    }

    disconnectedCallback() {
        this.#observer?.disconnect();
        this.#observer = null;
    }

    #observer = null;
}
