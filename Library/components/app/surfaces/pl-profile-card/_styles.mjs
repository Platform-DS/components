// ------------------------------
// Profile Card Styles — LIGHT DOM
// ------------------------------
// The avatar overlaps the cover band by half its own height. That's done with
// a negative block margin rather than absolute positioning, so the card's
// height still accounts for the part of the avatar that hangs below the band —
// an absolutely positioned avatar would overlap the name instead of pushing
// it down.

export const STYLES = /*css*/`
@layer pl-components {
  pl-profile-card {
    display: flex;
    flex-direction: column;
    min-inline-size: 0;

    background: var(--card-background, var(--pl-color-surface, #fff));
    border: var(--pl-border-width-small, 1px) solid var(--card-border, var(--pl-color-border, #E5E7EB));
    border-radius: var(--card-radius, var(--pl-border-radius-large, 16px));
    overflow: hidden;

    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    color: var(--pl-color-ink, #111827);
    text-align: var(--profile-align, start);
  }

  pl-profile-card[hidden] { display: none; }

  pl-profile-card [data-cover] {
    aspect-ratio: var(--profile-cover-ratio, 4 / 1);
    background: var(--pl-color-surface-sunken, #F3F4F6);
    overflow: hidden;
  }

  pl-profile-card [data-cover] :is(img, picture, pl-picture, svg, video) {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    display: block;
  }

  /* The avatar rides up onto the cover, and the negative margin pulls the rest
     of the body up with it so nothing is left floating.

     This MUST be a length. A percentage margin — even in the block direction —
     resolves against the containing block's INLINE size, so "-50%" would mean
     half the card's width, which on a 260px card is a 130px pull that drags the
     name straight over the cover image. The default is half of an xl avatar;
     change it to half of whatever size is actually used. */
  pl-profile-card [data-avatar] {
    margin-inline: var(--card-padding, var(--pl-size-16, 1rem));
    box-shadow: 0 0 0 3px var(--card-background, var(--pl-color-surface, #fff));
    border-radius: var(--pl-border-radius-full, 9999px);
  }

  /* Only pulled up when there is actually a cover to ride onto. Applied
     unconditionally, a card without one drags its avatar above the card's own
     top edge, where the card's overflow clipping slices it in half. */
  pl-profile-card [data-cover] + [data-avatar] {
    margin-block-start: calc(var(--profile-avatar-overlap, 2.5rem) * -1);
  }

  /* Centring is done per-element, NOT with align-items on the column: that
     would make every child shrink to its content width, pulling the
     full-bleed cover in off the card's edges. */
  pl-profile-card[data-align="center"] { --profile-align: center; }

  pl-profile-card[data-align="center"] [data-avatar] {
    align-self: center;
    margin-inline: 0;
  }

  /*------------------------------------------------
    Body
  -------------------------------------------------*/

  pl-profile-card > :not([data-cover], [data-avatar]) {
    margin: 0;
    padding-inline: var(--card-padding, var(--pl-size-16, 1rem));
  }

  pl-profile-card > [data-avatar] + * { margin-block-start: var(--pl-size-12, 0.75rem); }
  pl-profile-card > :not([data-cover], [data-avatar]) + * { margin-block-start: var(--pl-size-8, 0.5rem); }
  pl-profile-card > :last-child { padding-block-end: var(--card-padding, var(--pl-size-16, 1rem)); }

  /* No cover: the body still needs its top padding back. */
  pl-profile-card > :first-child:not([data-cover]) { padding-block-start: var(--card-padding, var(--pl-size-16, 1rem)); }

  pl-profile-card [data-name] {
    font-size: var(--pl-font-size-lg, 1.125rem);
    font-weight: var(--pl-font-weight-semibold, 600);
    line-height: var(--pl-line-height-tight, 1.15);
  }

  pl-profile-card [data-name] a { color: inherit; text-decoration: none; }
  pl-profile-card [data-name] a:hover { text-decoration: underline; }

  pl-profile-card [data-role] {
    font-size: var(--pl-font-size-sm, 0.875rem);
    color: var(--pl-color-ink-secondary, #6B7280);
  }

  pl-profile-card [data-meta] {
    display: flex;
    flex-wrap: wrap;
    gap: var(--pl-size-4, 0.25rem);
  }

  pl-profile-card[data-align="center"] :is([data-meta], [data-actions]) { justify-content: center; }

  pl-profile-card [data-actions] {
    display: flex;
    flex-wrap: wrap;
    gap: var(--pl-size-8, 0.5rem);
    margin-block-start: auto;
    padding-block-start: var(--pl-size-12, 0.75rem);
  }
}
`;
