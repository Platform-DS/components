// ------------------------------
// Video Styles
// ------------------------------
// A responsive block by default. `ratio` reserves the shape before any metadata
// has loaded, which is what stops the page jumping when the video finally
// reports its own dimensions.

export const STYLES = /*css*/`
  :host {
    display: block;
    inline-size: 100%;
  }

  :host([hidden]) { display: none; }

  video {
    display: block;
    inline-size: 100%;
    block-size: auto;
    background: var(--video-background, #000);
    border-radius: var(--video-radius, 0);
  }

  :host([ratio]) video {
    aspect-ratio: var(--video-ratio, 16 / 9);
    block-size: 100%;
    object-fit: var(--video-fit, cover);
  }

  :host([fit="contain"]) video { --video-fit: contain; }
`;
