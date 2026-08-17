// ------------------------------
// RadialChartElement — the conic-gradient charts (pie, doughnut)
// ------------------------------
// Everything the two round charts have in common that a bar chart does not:
// slices are shares of one whole, so the denominator is the sum, and the
// drawing is a single conic-gradient painted on one element.
//
// It lives here rather than in either component because pl-pie-chart and
// pl-doughnut-chart differ by exactly one CSS declaration, and duplicating this
// into both would be the first crack in that.

import { ChartElement } from './ChartElement.mjs';

export class RadialChartElement extends ChartElement {
    /** Slices are parts of a whole, so the whole is their sum. */
    defaultTotal(values) {
        return values.reduce((a, b) => a + b, 0);
    }

    get #chart() {
        return this.root.querySelector('.chart');
    }

    draw(values, total) {
        const chart = this.#chart;
        if (!chart) return;

        // Decorative: the slotted list carries the meaning. See ChartElement.
        chart.setAttribute('aria-hidden', 'true');

        // Cumulative, because a conic-gradient stop is an absolute angle rather
        // than a width. Each slice is written `color 0 <end>`: a start of 0 is
        // clamped up to the previous stop, which is what produces a hard edge
        // between slices instead of a blend.
        let running = 0;
        const stops = values.map((value, index) => {
            running += value;
            const end = Math.min(100, (running / total) * 100);
            return `var(--chart-color-${index + 1}, var(--chart-track)) 0 ${end.toFixed(3)}%`;
        });

        // A partial chart needs its remainder drawn, or the last slice would be
        // stretched around the rest of the circle by the gradient's own
        // extend-to-100% behaviour.
        if (running < total) stops.push('var(--chart-track) 0 100%');

        chart.style.setProperty('--chart-stops', stops.join(', '));
    }

    clear() {
        // Removing the property lets the stylesheet's own fallback (a plain
        // track) take over, rather than leaving the last render on screen.
        this.#chart?.style.removeProperty('--chart-stops');
    }
}
