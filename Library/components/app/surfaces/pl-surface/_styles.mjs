// ------------------------------
// Surface Styles — LIGHT DOM
// ------------------------------
// Every value is a --surface-* hook in front of a token, so the whole component
// is its own theming API. Nothing here is a magic number: change one property
// and the surface is a card, a panel, a well, or a plain outline.

export const STYLES = /*css*/`
:where(pl-surface) {
  --surface-background: var(--pl-color-surface, #FFFFFF);
  --surface-border-color: var(--pl-color-border, #E5E7EB);
  --surface-border-width: var(--pl-border-width-small, 1px);
  --surface-radius: var(--pl-border-radius-large, 16px);
  --surface-padding: var(--pl-size-16, 1rem);
  --surface-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 1px 3px rgb(0 0 0 / 0.06);
}

pl-surface {
  display: block;
  background: var(--surface-background);
  border: var(--surface-border-width) solid var(--surface-border-color);
  border-radius: var(--surface-radius);
  padding: var(--surface-padding);
  box-shadow: var(--surface-shadow);
  /* The radius has to clip, or a slotted image or coloured band squares off
     the corners the surface just rounded. */
  overflow: hidden;
}

pl-surface[hidden] { display: none; }

/* The author's content owns its own rhythm; the surface only sets the frame.
   Stripping the outer margins is the exception, because a slotted <p> or <h3>
   arriving with a browser margin would sit off-centre inside the padding. */
pl-surface > :first-child { margin-block-start: 0; }
pl-surface > :last-child { margin-block-end: 0; }
`;
