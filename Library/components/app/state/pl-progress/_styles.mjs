// ------------------------------
// Progress Styles
// ------------------------------
// Same vendor-pseudo situation as pl-meter: ::-webkit-progress-bar is the
// track and ::-webkit-progress-value the fill, while Firefox rolls both into
// ::-moz-progress-bar. Both are written out; each browser ignores the other's.
//
// The indeterminate state is drawn here rather than left to the UA, because
// the native rendering differs so much between browsers that a bar in a
// designed interface would not match itself across two of them. It is a moving
// gradient on the track, which needs no value to be meaningful.

export const STYLES = /*css*/`
  :host {
    display: block;
    --_track: var(--progress-track, var(--pl-color-surface-sunken, #F3F4F6));
    --_fill: var(--progress-fill, var(--pl-color-primary, #2563EB));
  }

  :host([hidden]) { display: none; }

  progress {
    appearance: none;
    -webkit-appearance: none;
    display: block;
    inline-size: 100%;
    block-size: var(--progress-height, 0.5rem);
    border: 0;
    border-radius: var(--pl-border-radius-full, 9999px);
    background: var(--_track);
    overflow: hidden;
  }

  progress::-webkit-progress-bar {
    background: var(--_track);
    border-radius: inherit;
  }

  progress::-webkit-progress-value {
    background: var(--_fill);
    border-radius: inherit;
    transition: inline-size 200ms ease;
  }

  progress::-moz-progress-bar {
    background: var(--_fill);
    border-radius: inherit;
  }

  /*------------------------------------------------
    Indeterminate — a band travelling along the track.
  -------------------------------------------------*/

  :host([indeterminate]) progress {
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      var(--_fill) 50%,
      transparent 100%
    );
    background-size: 40% 100%;
    background-repeat: no-repeat;
    animation: pl-progress-slide 1.4s ease-in-out infinite;
  }

  /* The value pseudos would otherwise paint a filled bar over the animation —
     an indeterminate <progress> still reports a value of 0 to them. */
  :host([indeterminate]) progress::-webkit-progress-bar { background: transparent; }
  :host([indeterminate]) progress::-webkit-progress-value { background: transparent; }
  :host([indeterminate]) progress::-moz-progress-bar { background: transparent; }

  @keyframes pl-progress-slide {
    from { background-position: -40% 0; }
    to { background-position: 140% 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    progress::-webkit-progress-value { transition: none; }
    /* A still band rather than none at all — an empty track would read as
       "nothing is happening". */
    :host([indeterminate]) progress {
      animation: none;
      background-position: 50% 0;
    }
  }
`;
