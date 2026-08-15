// ------------------------------
// Ratings Styles — LIGHT DOM
// ------------------------------
// Each star is two stacked copies of the same path: a permanent empty
// outline underneath, and a filled copy on top clipped to --fraction (0–1,
// written per-star by index.mjs). A whole rated star is --fraction: 1, an
// unrated one is 0, and a readonly average can land anywhere between for a
// proportionally filled star.
//
// clip-path fills left-to-right, which reads correctly in LTR — the common
// case for every other component in the library — but not RTL, where a
// filled star should read from the right. Flipping it for `dir="rtl"` is
// left for later rather than guessed at without a document to test against.
//
// The range input is the real control (focus, keyboard, form value) but
// pointer-events: none, sized and positioned exactly over the star row —
// see index.mjs for why: a click needs to land on a specific star, not drag
// an invisible thumb.

export const STYLES = /*css*/`
:where(pl-ratings) {
  --star-size: 1.5rem;
}

pl-ratings {
  position: relative;
  display: inline-flex;
}

pl-ratings[hidden] { display: none; }

pl-ratings .pl-ratings__input {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
  pointer-events: none;
}

pl-ratings .pl-ratings__stars {
  display: inline-flex;
  gap: var(--ratings-gap, 0.125rem);
  -webkit-user-select: none;
  user-select: none;
}

pl-ratings:not([disabled], [readonly]) .pl-ratings__stars { cursor: pointer; }
pl-ratings[disabled] .pl-ratings__stars { cursor: not-allowed; }

pl-ratings .pl-ratings__star {
  position: relative;
  display: inline-block;
  inline-size: var(--star-size);
  block-size: var(--star-size);
  --fraction: 0;
}

pl-ratings .pl-ratings__star-icon {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  /* The path has no fill attribute of its own — this is what makes the
     "color" declared below actually paint it, instead of the SVG default black. */
  fill: currentColor;
}

pl-ratings .pl-ratings__star-icon--bg {
  color: var(--ratings-empty, var(--pl-color-border-strong, #9CA3AF));
}

pl-ratings .pl-ratings__star-icon--fg {
  position: absolute;
  inset: 0;
  color: var(--ratings-color, var(--pl-color-warning, #F59E0B));
  clip-path: inset(0 calc((1 - var(--fraction, 0)) * 100%) 0 0);
}

/* One ring for the whole row, driven by the real (invisible) control. */
pl-ratings .pl-ratings__input:focus-visible ~ .pl-ratings__stars {
  outline: 2px solid var(--pl-color-focus, #2563EB);
  outline-offset: 3px;
  border-radius: var(--pl-border-radius-small, 4px);
}

pl-ratings[disabled] { opacity: var(--pl-opacity-60, 0.6); }

@media (prefers-reduced-motion: no-preference) {
  pl-ratings .pl-ratings__star-icon--fg { transition: clip-path 100ms ease; }
}
`;
