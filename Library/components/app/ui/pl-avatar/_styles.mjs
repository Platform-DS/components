// ------------------------------
// Avatar Styles
// ------------------------------
// The host IS the shape: :host carries the size and the border-radius, and
// both the <img> and the fallback fill it at 100%/100% with object-fit:
// cover, so whichever one is showing crops the same way. Exactly one of the
// two is ever visible — see index.mjs — so there's no stacking/z-index here.

export const STYLES = /*css*/`
  :host {
    display: inline-block;
    position: relative;
    overflow: hidden;
    flex: none;

    inline-size: var(--avatar-size, 2.5rem);
    block-size: var(--avatar-size, 2.5rem);

    background: var(--avatar-fallback-background, var(--pl-color-surface-raised, #F3F4F6));
    /* Circle by default. */
    border-radius: var(--pl-border-radius-full, 9999px);
  }

  :host([hidden]) { display: none; }

  :host([shape="square"]) { border-radius: var(--pl-border-radius-medium, 10px); }

  :host([size="xs"]) { --avatar-size: 1.5rem; }
  :host([size="sm"]) { --avatar-size: 2rem; }
  :host([size="md"]) { --avatar-size: 2.5rem; }
  :host([size="lg"]) { --avatar-size: 3.5rem; }
  :host([size="xl"]) { --avatar-size: 5rem; }

  img {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }

  img[hidden] { display: none; }

  .fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: 100%;
    block-size: 100%;

    color: var(--avatar-fallback-color, var(--pl-color-ink-secondary, #6B7280));
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: calc(var(--avatar-size, 2.5rem) * 0.4);
    font-weight: var(--pl-font-weight-semibold, 600);
    line-height: 1;
    letter-spacing: 0.02em;
    -webkit-user-select: none;
    user-select: none;
  }

  .fallback[hidden] { display: none; }

  .fallback svg {
    inline-size: 55%;
    block-size: 55%;
  }
`;
