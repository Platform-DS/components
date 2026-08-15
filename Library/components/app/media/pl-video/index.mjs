// ------------------------------
// Video Component
// ------------------------------
// EXTENDS the VideoElement base primitive, so it inherits the native <video>
// surface — src, poster, controls, autoplay, loop, muted, playsinline, preload,
// currentTime/duration/paused/volume, play()/pause()/load(), and the media
// events, which the base re-emits on the host because none of them cross a
// shadow boundary on their own.
//
//   <pl-video src="clip.mp4" poster="poster.jpg" controls></pl-video>
//
//   <pl-video controls poster="poster.jpg">
//     <source src="clip.webm" type="video/webm">
//     <source src="clip.mp4" type="video/mp4">
//     <track kind="captions" src="captions.vtt" srclang="en" label="English" default>
//   </pl-video>
//
// ------------------------------
// Sources are ADOPTED, not slotted
// ------------------------------
// A <video> picks its source by walking its own CHILD <source> elements, and
// slotted light-DOM children are not children of the element they are slotted
// into. Left in a <slot> they would be ignored entirely and the video would
// play nothing — so, exactly as pl-select does with <option>, the author's
// <source> and <track> elements are MOVED into the real <video>.
//
// The same applies to <track>: captions have to be children of the video, or
// there are no captions.

// Imports
import { VideoElement } from '../../../../_core/elements/VideoElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-video';

// The child elements a <video> reads from its own subtree.
const MEDIA_CHILDREN = 'source, track';

// Shadow DOM
export class Video extends VideoElement {
    static #template = document.createElement('template');
    static #sheet = new CSSStyleSheet();

    static {
        // No <slot>: everything meaningful is adopted into the video itself.
        this.#template.innerHTML = /*html*/`<video part="video"></video>`;
        this.#sheet.replaceSync(STYLES);
        this.template = this.#template;
        this.styles = this.#sheet;
    }

    static props = { ...VideoElement.props };

    #adopted = false;

    constructor() {
        super();
        this.refs = { video: this.shadowRoot.querySelector('video') };
    }

    connectedCallback() {
        this.#adopt();
        super.connectedCallback();
    }

    /**
     * Move the author's <source>/<track> into the real <video>, once.
     *
     * Order matters to a video — the first playable <source> wins — so they go
     * in as found rather than being sorted or filtered.
     */
    #adopt() {
        if (this.#adopted) return;

        const media = [...this.querySelectorAll(`:scope > :is(${MEDIA_CHILDREN})`)];
        if (!media.length) return;

        this.#adopted = true;
        for (const node of media) this.refs.video.append(node);

        // Sources appearing after the element has already picked one are only
        // considered on an explicit reload.
        this.refs.video.load();
    }
}

if (!customElements.get(tagName)) {
    customElements.define(tagName, Video);
}
