// ------------------------------
// Social Proof Styles — LIGHT DOM
// ------------------------------
// A quiet band: logos, ratings, or headline stats. Deliberately restrained —
// it sits directly under the hero and must not compete with it.

export const STYLES = /*css*/`
:where(pl-social-proof) {
  --section-space: clamp(2rem, 4vw, 3.5rem);
}

/* Optional lead-in line ("Trusted by teams at…"). */
pl-social-proof > p:first-child {
  font-size: var(--pl-font-size-sm, 0.875rem);
  color: var(--section-ink-muted);
  text-align: center;
}

/* A list of logos or stats. Wraps and centres at any count. */
pl-social-proof > ul {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: clamp(1.5rem, 4vw, 3.5rem);
  list-style: none;
  margin-block-start: var(--pl-size-24, 1.5rem);
  padding: 0;
}

/* Logos: normalised to one optical height, muted until hovered so the band
   reads as texture rather than a row of competing brand colours. */
pl-social-proof :is(img, svg) {
  display: block;
  block-size: var(--social-proof-logo-height, 1.75rem);
  inline-size: auto;
  max-inline-size: 9rem;
  object-fit: contain;
  opacity: var(--pl-opacity-70, 0.7);
  filter: grayscale(1);
  transition: opacity 150ms ease, filter 150ms ease;
}

pl-social-proof li:hover :is(img, svg) {
  opacity: 1;
  filter: none;
}

/*------------------------------------------------
  Stats — <li> holding a big number and a label. The number is whatever
  element the author emphasised (<strong>, <b>), so no class is needed.
-------------------------------------------------*/
pl-social-proof li:has(strong, b) {
  display: grid;
  gap: 0.15rem;
  justify-items: center;
  text-align: center;
}

pl-social-proof :is(strong, b) {
  font-family: var(--pl-font-family-display, inherit);
  font-size: clamp(1.75rem, 1.2rem + 1.6vw, 2.5rem);
  font-weight: var(--pl-font-weight-bold, 700);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--section-ink);
}

pl-social-proof li:has(strong, b) {
  font-size: var(--pl-font-size-sm, 0.875rem);
  color: var(--section-ink-muted);
}

@media (prefers-reduced-motion: reduce) {
  pl-social-proof :is(img, svg) { transition: none; }
}
`;
