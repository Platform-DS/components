// ------------------------------
// Carousel Component — LIGHT DOM
// ------------------------------
// A horizontal run of anything — usually cards — that snaps as it scrolls.
//
//   <pl-carousel label="Featured products">
//     <pl-product-card>…</pl-product-card>
//     <pl-product-card>…</pl-product-card>
//   </pl-carousel>
//
// ------------------------------
// The scrolling is CSS. The buttons only nudge it.
// ------------------------------
// `overflow-inline: auto` plus `scroll-snap-type` already gives a carousel
// that works with a trackpad, a touch swipe, a scrollbar, and the arrow keys —
// with momentum, rubber-banding, and snap points the platform tuned. None of
// that is re-implemented here. There is no transform track, no index to keep,
// no transition to drive, and nothing to resync on resize.
//
// All the script does is add two buttons that call `scrollBy` and grey
// themselves out at the ends. That's why they are BUILT here rather than
// written in the HTML: the `data-controls` flag the CSS keys off is set only
// once the buttons exist, so if this script never runs the carousel is a plain
// scrollable strip rather than a dead pair of arrows over content that cannot
// move.

// Imports
import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-carousel';

const ARROW = /*html*/`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="m15 6-6 6 6 6" />
    </svg>
`;

// Light DOM
export class Carousel extends BaseElement {
    static mode = 'light';

    static get observedAttributes() {
        return ['label'];
    }

    #track = null;
    #prev = null;
    #next = null;

    connectedCallback() {
        injectStyles(tagName, STYLES);

        if (!this.#track) this.#build();

        super.connectedCallback();
    }

    #build() {
        this.#track = document.createElement('div');
        this.#track.className = 'pl-carousel__track';
        // A scrollable region needs to be focusable and named, or a keyboard
        // user can reach the slides' controls but never the scroll itself.
        this.#track.tabIndex = 0;
        this.#track.setAttribute('role', 'group');

        const children = [...this.childNodes];
        this.append(this.#track);
        for (const node of children) {
            if (this.#track.moveBefore) this.#track.moveBefore(node, null);
            else this.#track.append(node);
        }

        this.#prev = this.#button('prev', 'Previous');
        this.#next = this.#button('next', 'Next');
        this.append(this.#prev, this.#next);

        // Only now does the CSS start reserving room for the buttons.
        this.setAttribute('data-controls', '');

        // Called straight from the event, with no rAF throttle in front of it.
        // Scroll events are already dispatched at most once per frame, so
        // coalescing bought nothing — and a dropped frame (a hidden tab, a
        // display:none ancestor) would leave the "already queued" latch stuck
        // on and the buttons frozen for the rest of the page's life.
        this.#track.addEventListener('scroll', () => this.#syncEnds(), { passive: true });

        // The end state depends on the track's width, which changes with the
        // viewport even though nothing scrolled.
        new ResizeObserver(() => this.#syncEnds()).observe(this.#track);
    }

    #button(direction, label) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `pl-carousel__control pl-carousel__control--${direction}`;
        button.setAttribute('aria-label', label);
        button.innerHTML = ARROW;
        button.addEventListener('click', () => this.scrollBySlide(direction === 'next' ? 1 : -1));
        return button;
    }

    /** Move by one slide, letting the platform animate and snap. */
    scrollBySlide(direction = 1) {
        const slide = this.#track?.firstElementChild;
        if (!slide) return;

        const gap = parseFloat(getComputedStyle(this.#track).columnGap) || 0;
        this.#track.scrollBy({ left: (slide.offsetWidth + gap) * direction, behavior: 'smooth' });
    }

    /**
     * Grey out whichever end has been reached. `scrollLeft` runs negative in a
     * right-to-left document, so the distance travelled is its absolute value;
     * the 1px slack absorbs sub-pixel rounding, which would otherwise leave a
     * button live at a position it cannot move from.
     */
    #syncEnds() {
        if (!this.#prev) return;

        const { scrollLeft, clientWidth, scrollWidth } = this.#track;

        // Before first layout every measurement is 0, and 0 + 0 >= -1 would
        // disable "next" on a carousel that has plenty to scroll. There is
        // nothing meaningful to decide yet, so decide nothing — the observer
        // below re-runs this the moment real dimensions exist.
        if (!clientWidth) return;

        const travelled = Math.abs(scrollLeft);

        this.#prev.disabled = travelled <= 1;
        this.#next.disabled = travelled + clientWidth >= scrollWidth - 1;
    }

    render() {
        if (!this.#track) return;
        // Names the scrollable region — "Featured products, group".
        this.#track.setAttribute('aria-label', this.getAttribute('label') ?? 'Carousel');
        // Covers the case where the track is already laid out on connect, so
        // the ends are not left to the ResizeObserver alone.
        this.#syncEnds();
    }

    /** The scroll container, for anything that wants to drive it directly. */
    get track() { return this.#track; }
}

define(tagName, Carousel);
