// ------------------------------
// Dialog Styles — LIGHT DOM
// ------------------------------
// The <dialog> is centred by the UA's own top-layer positioning; all that is
// added is the surface, a measure, and the backdrop tint.
//
// The open/close transition uses `transition-behavior: allow-discrete` with
// `@starting-style`, which is what lets a property that flips discretely
// (`display`, `overlay`) animate at all. Without those two the dialog would
// simply appear — which is why this is a progressive nicety: browsers that
// don't support them get an instant dialog and nothing broken.
//
// `overlay` must be in the transition list or the element leaves the top layer
// the instant close() is called, and the exit animation plays behind the rest
// of the page instead of above it.

export const STYLES = /*css*/`
pl-dialog { display: contents; }

pl-dialog .pl-dialog__dialog {
  position: relative;
  box-sizing: border-box;

  inline-size: min(100% - var(--pl-size-32, 2rem), var(--dialog-width, 32rem));
  max-block-size: calc(100dvh - var(--pl-size-64, 4rem));
  padding: var(--dialog-padding, var(--pl-size-24, 1.5rem));

  background: var(--dialog-background, var(--pl-color-surface, #fff));
  color: var(--pl-color-ink, #111827);
  border: var(--pl-border-width-small, 1px) solid var(--pl-color-border, #E5E7EB);
  border-radius: var(--pl-border-radius-large, 16px);
  box-shadow: var(--pl-box-shadow-large, 0 24px 48px rgb(0 0 0 / 0.18));

  /* allow-discrete is what makes "display" animatable; without it the two
     opacity/translate steps below would never be seen. */
  opacity: 0;
  translate: 0 0.5rem;
  transition:
    opacity 180ms ease,
    translate 180ms ease,
    display 180ms allow-discrete,
    overlay 180ms allow-discrete;
}

pl-dialog .pl-dialog__dialog[open] {
  opacity: 1;
  translate: 0 0;
}

/* The state to animate FROM on entry. Must come after the [open] rule. */
@starting-style {
  pl-dialog .pl-dialog__dialog[open] {
    opacity: 0;
    translate: 0 0.5rem;
  }
}

pl-dialog .pl-dialog__dialog::backdrop {
  background: var(--dialog-backdrop, rgb(0 0 0 / 0.45));
  backdrop-filter: blur(2px);

  opacity: 0;
  transition:
    opacity 180ms ease,
    display 180ms allow-discrete,
    overlay 180ms allow-discrete;
}

pl-dialog .pl-dialog__dialog[open]::backdrop { opacity: 1; }

@starting-style {
  pl-dialog .pl-dialog__dialog[open]::backdrop { opacity: 0; }
}

/*------------------------------------------------
  Content regions
-------------------------------------------------*/

pl-dialog [data-title] {
  margin: 0 var(--pl-size-32, 2rem) var(--pl-size-8, 0.5rem) 0;
  font-size: var(--pl-font-size-lg, 1.125rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  line-height: var(--pl-line-height-tight, 1.15);
}

pl-dialog .pl-dialog__dialog > :last-child { margin-block-end: 0; }

pl-dialog [data-actions] {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--pl-size-8, 0.5rem);
  margin-block-start: var(--pl-size-24, 1.5rem);
}

/* The wrapping form is layout-neutral — it exists only to close the dialog. */
pl-dialog [data-actions] form { display: contents; }

/*------------------------------------------------
  Dismiss — a submit button in a method="dialog" form.
-------------------------------------------------*/

pl-dialog .pl-dialog__dismiss {
  position: absolute;
  inset-block-start: var(--pl-size-12, 0.75rem);
  inset-inline-end: var(--pl-size-12, 0.75rem);
  margin: 0;
}

pl-dialog .pl-dialog__dismiss button {
  all: unset;
  display: grid;
  place-items: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  border-radius: var(--pl-border-radius-full, 9999px);
  color: var(--pl-color-ink-secondary, #6B7280);
  cursor: pointer;
}

pl-dialog .pl-dialog__dismiss button svg { inline-size: 1rem; block-size: 1rem; }

pl-dialog .pl-dialog__dismiss button:hover {
  background: var(--pl-color-surface-sunken, #F3F4F6);
  color: var(--pl-color-ink, #111827);
}

pl-dialog .pl-dialog__dismiss button:focus-visible {
  outline: 2px solid var(--pl-color-focus, #2563EB);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  pl-dialog .pl-dialog__dialog,
  pl-dialog .pl-dialog__dialog::backdrop { transition: none; }
}
`;
