// ------------------------------
// Product Card Styles — LIGHT DOM
// ------------------------------
// A flex column so [data-actions] can be pushed to the bottom with margin-top:
// auto. That's what keeps a row of cards with different title lengths lined up
// along their buttons instead of each one ending wherever its text did.

export const STYLES = /*css*/`
:where(pl-product-card) {
  display: flex;
  flex-direction: column;
  /* Never wider than its column — a card in a grid track or a carousel
     slide must not set the width of either. */
  min-inline-size: 0;

  background: var(--card-background, var(--pl-color-surface, #fff));
  border: var(--pl-border-width-small, 1px) solid var(--card-border, var(--pl-color-border, #E5E7EB));
  border-radius: var(--card-radius, var(--pl-border-radius-large, 16px));
  overflow: hidden;

  font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
  color: var(--pl-color-ink, #111827);
}

pl-product-card[hidden] { display: none; }

/*------------------------------------------------
  Media — a fixed aspect box, so a grid of cards stays on one baseline
  regardless of what each image's intrinsic ratio happens to be.
-------------------------------------------------*/

pl-product-card [data-media] {
  position: relative;
  aspect-ratio: var(--card-media-ratio, 1);
  background: var(--pl-color-surface-sunken, #F3F4F6);
  overflow: hidden;
}

pl-product-card [data-media] :is(img, picture, pl-picture, video) {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  display: block;
}

/* Anything marked as a badge floats over the image's corner. A pl-badge here
   wants the "standalone" attribute: without it the badge straddles its host's
   corner and half of it lands outside the cropped media box. */
pl-product-card [data-media] [data-badge] {
  position: absolute;
  inset-block-start: var(--pl-size-8, 0.5rem);
  inset-inline-start: var(--pl-size-8, 0.5rem);
  z-index: 1;
}

/*------------------------------------------------
  Body
-------------------------------------------------*/

pl-product-card > :not([data-media]) {
  margin: 0;
  padding-inline: var(--card-padding, var(--pl-size-16, 1rem));
}

pl-product-card > :not([data-media]):first-child { padding-block-start: var(--card-padding, var(--pl-size-16, 1rem)); }

pl-product-card > [data-media] + * { margin-block-start: var(--pl-size-12, 0.75rem); }
pl-product-card > :not([data-media]) + :not([data-media]) { margin-block-start: var(--pl-size-8, 0.5rem); }

pl-product-card > :last-child { padding-block-end: var(--card-padding, var(--pl-size-16, 1rem)); }

pl-product-card [data-eyebrow] {
  font-size: var(--pl-font-size-xs, 0.75rem);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pl-color-ink-secondary, #6B7280);
}

pl-product-card [data-title] {
  font-size: var(--pl-font-size-base, 1rem);
  font-weight: var(--pl-font-weight-medium, 500);
  line-height: var(--pl-line-height-tight, 1.15);
}

/* The title's link stretches over the media and body so the whole card is
   one click target — while the real controls in [data-actions], which sit
   above it, stay individually clickable. One <a> wrapping everything would
   have swallowed them. */
pl-product-card [data-title] a {
  color: inherit;
  text-decoration: none;
}

pl-product-card [data-title] a::after {
  content: "";
  position: absolute;
  inset: 0;
}

pl-product-card:has([data-title] a) { position: relative; }

pl-product-card [data-title] a:hover { text-decoration: underline; }

pl-product-card [data-title] a:focus-visible {
  outline: 2px solid var(--pl-color-focus, #2563EB);
  outline-offset: 2px;
  border-radius: var(--pl-border-radius-small, 4px);
}

pl-product-card [data-price] {
  font-size: var(--pl-font-size-base, 1rem);
  font-weight: var(--pl-font-weight-semibold, 600);
}

pl-product-card [data-price] s {
  margin-inline-start: var(--pl-size-4, 0.25rem);
  font-weight: var(--pl-font-weight-normal, 400);
  color: var(--pl-color-ink-secondary, #6B7280);
}

/*------------------------------------------------
  Actions — pinned to the bottom, and above the title's stretched link.
-------------------------------------------------*/

pl-product-card [data-actions] {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--pl-size-8, 0.5rem);
  margin-block-start: auto;
  padding-block-start: var(--pl-size-12, 0.75rem);
}
`;
