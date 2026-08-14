// ------------------------------
// Range Styles
// ------------------------------
// A styled slider over a real <input type="range">. Track and thumb are drawn
// with the vendor pseudo-elements (they can't be unified into one selector, so
// WebKit and Gecko are listed separately). The filled portion is native on
// Gecko (::-moz-range-progress); on WebKit it's a gradient driven by the
// --range-percent the component updates as the value changes.

export const STYLES = /*css*/`
  :host { display: block; }
  :host([hidden]) { display: none; }

  input {
    -webkit-appearance: none;
    appearance: none;
    inline-size: 100%;
    margin: 0;
    background: transparent;
    cursor: pointer;
  }

  input:focus { outline: none; }
  input:disabled { opacity: var(--pl-opacity-50, 0.5); cursor: not-allowed; }

  /* Track — WebKit paints its own fill via a gradient. */
  input::-webkit-slider-runnable-track {
    block-size: var(--range-track-size, 0.375rem);
    border-radius: var(--pl-border-radius-full, 9999px);
    background: linear-gradient(
      to right,
      var(--range-fill, var(--pl-color-primary, #2563EB)) 0 var(--range-percent, 0%),
      var(--range-track, var(--pl-color-border, #E5E7EB)) var(--range-percent, 0%) 100%
    );
  }

  input::-moz-range-track {
    block-size: var(--range-track-size, 0.375rem);
    border-radius: var(--pl-border-radius-full, 9999px);
    background: var(--range-track, var(--pl-color-border, #E5E7EB));
  }

  input::-moz-range-progress {
    block-size: var(--range-track-size, 0.375rem);
    border-radius: var(--pl-border-radius-full, 9999px);
    background: var(--range-fill, var(--pl-color-primary, #2563EB));
  }

  /* Thumb */
  input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    inline-size: var(--range-thumb-size, 1.1rem);
    block-size: var(--range-thumb-size, 1.1rem);
    /* Centre the thumb on the track. */
    margin-block-start: calc((var(--range-track-size, 0.375rem) - var(--range-thumb-size, 1.1rem)) / 2);
    border-radius: var(--pl-border-radius-full, 9999px);
    background: var(--range-thumb, var(--pl-color-primary, #2563EB));
    border: 2px solid var(--pl-color-surface, #fff);
    box-shadow: var(--pl-box-shadow-small, 0 1px 2px #14131014);
  }

  input::-moz-range-thumb {
    inline-size: var(--range-thumb-size, 1.1rem);
    block-size: var(--range-thumb-size, 1.1rem);
    border-radius: var(--pl-border-radius-full, 9999px);
    background: var(--range-thumb, var(--pl-color-primary, #2563EB));
    border: 2px solid var(--pl-color-surface, #fff);
    box-shadow: var(--pl-box-shadow-small, 0 1px 2px #14131014);
  }

  input:focus-visible::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--pl-color-primary, #2563EB) 30%, transparent);
  }
  input:focus-visible::-moz-range-thumb {
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--pl-color-primary, #2563EB) 30%, transparent);
  }
`;
