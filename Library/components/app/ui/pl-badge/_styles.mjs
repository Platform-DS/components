// ------------------------------
// Badge Styles — LIGHT DOM
// ------------------------------
// The host is the positioning context; the badge is absolutely positioned in
// one of its corners and the wrapped content is left entirely alone. That is
// the whole reason nothing gets moved into a wrapper in index.mjs — the badge
// can be pinned to the host's corner without touching what's inside it.
//
// Corners are named with LOGICAL edges (start/end, not left/right) and set
// with logical inset properties, so a badge lands on the correct side in an
// RTL document without a second set of rules.
//
// The offset hooks (--badge-offset-*) exist because "the corner" depends on
// what's underneath: a square icon button wants the badge right at its edge,
// while a circular avatar wants it pulled inward so it sits ON the circle
// rather than off in the empty corner of its bounding box. See the pl-avatar
// example in the docs.

export const STYLES = /*css*/`
pl-badge {
  position: relative;
  display: inline-flex;
  /* Not a grid or block: the host must hug its content exactly, or the
     corner it pins to would be the corner of a wider box than the thing
     being badged. */
  flex: none;
  vertical-align: middle;
}

pl-badge[hidden] { display: none; }

pl-badge > .pl-badge__badge {
  position: absolute;
  z-index: 1;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  min-inline-size: var(--badge-size, 1.25rem);
  block-size: var(--badge-size, 1.25rem);
  padding-inline: var(--badge-padding-inline, 0.3125rem);

  background: var(--badge-background, var(--pl-color-primary, #2563EB));
  color: var(--badge-color, var(--pl-color-on-primary, #fff));
  border-radius: var(--pl-border-radius-full, 9999px);

  font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
  font-size: var(--badge-font-size, var(--pl-font-size-xs, 0.75rem));
  font-weight: var(--pl-font-weight-medium, 500);
  line-height: 1;
  white-space: nowrap;

  /* Separates the badge from whatever it overlaps — without it, a dark
     count on a dark icon button reads as one smudged shape. Matches the
     page behind the owner, not the owner itself, so it works over an
     image or an avatar too. */
  border: var(--badge-ring-width, 2px) solid var(--badge-ring, var(--pl-color-surface, #fff));
}

pl-badge > .pl-badge__badge[hidden] { display: none; }

/*------------------------------------------------
  Standalone — a label rather than a marker on something.

  Normally the badge straddles its owner's corner, which means it sticks out
  past the host's box and needs room around it. A badge with no owner — a
  "New" or "Sale" pill dropped into a card's corner — has no corner to
  straddle, and that overhang only gets it clipped by whatever is doing the
  cropping. This puts the badge back in flow, so the host sizes to it and it
  can be positioned like any ordinary box.
-------------------------------------------------*/

pl-badge[data-standalone] > .pl-badge__badge {
  position: static;
  translate: none;
}

/*------------------------------------------------
  Dot — a state, not a quantity. No text, so it collapses to a circle.
-------------------------------------------------*/
pl-badge[data-dot] > .pl-badge__badge {
  min-inline-size: var(--badge-dot-size, 0.625rem);
  inline-size: var(--badge-dot-size, 0.625rem);
  block-size: var(--badge-dot-size, 0.625rem);
  padding: 0;
}

/*------------------------------------------------
  Corners. Default is top-end; the badge is centred ON the corner, so half
  of it sits outside the owner's box.
-------------------------------------------------*/
pl-badge > .pl-badge__badge,
pl-badge[data-position="top-end"] > .pl-badge__badge {
  inset-block-start: var(--badge-offset-block, 0);
  inset-inline-end: var(--badge-offset-inline, 0);
  translate: 50% -50%;
}

pl-badge[data-position="top-start"] > .pl-badge__badge {
  inset-block-start: var(--badge-offset-block, 0);
  inset-inline-start: var(--badge-offset-inline, 0);
  inset-inline-end: auto;
  translate: -50% -50%;
}

pl-badge[data-position="bottom-end"] > .pl-badge__badge {
  inset-block-start: auto;
  inset-block-end: var(--badge-offset-block, 0);
  inset-inline-end: var(--badge-offset-inline, 0);
  translate: 50% 50%;
}

pl-badge[data-position="bottom-start"] > .pl-badge__badge {
  inset-block-start: auto;
  inset-block-end: var(--badge-offset-block, 0);
  inset-inline-start: var(--badge-offset-inline, 0);
  inset-inline-end: auto;
  translate: -50% 50%;
}

/*------------------------------------------------
  Intents. Every fill pairs with its own on-color, so the text stays
  readable in either theme — the library-wide rule for colored fills.
-------------------------------------------------*/
pl-badge[data-intent="success"] > .pl-badge__badge {
  background: var(--badge-background, var(--pl-color-success, #15803D));
  color: var(--badge-color, var(--pl-color-on-success, #fff));
}

pl-badge[data-intent="warning"] > .pl-badge__badge {
  background: var(--badge-background, var(--pl-color-warning, #B45309));
  color: var(--badge-color, var(--pl-color-on-warning, #fff));
}

pl-badge[data-intent="error"] > .pl-badge__badge {
  background: var(--badge-background, var(--pl-color-error, #B91C1C));
  color: var(--badge-color, var(--pl-color-on-error, #fff));
}

pl-badge[data-intent="neutral"] > .pl-badge__badge {
  background: var(--badge-background, var(--pl-color-border-strong, #9CA3AF));
  color: var(--badge-color, var(--pl-color-surface, #fff));
}
`;
