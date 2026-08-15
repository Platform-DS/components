// ------------------------------
// Label Styles — LIGHT DOM
// ------------------------------
// This component has no shadow root, so these styles are NOT encapsulated and
// can't be adopted onto a shadow root. They're injected into the document once,
// on first use, scoped by the `pl-label` tag name. Unlayered, so a page's bare
// element styles do not silently outrank them — see injectStyles.
//
// Reads the platformdesign.app token contract (--color-*, --size-*, --font-*),
// each with a fallback so it renders with no tokens loaded.

export const STYLES = /*css*/`
  pl-label {
      display: block;
      font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
      font-size: var(--pl-font-size-sm, 0.875rem);
      font-weight: var(--pl-font-weight-medium, 500);
      line-height: var(--pl-line-height-medium, 1.5);
      color: var(--pl-color-ink, #111);
  }

  pl-label .pl-label__text {
      display: flex;
      align-items: center;
      gap: var(--pl-size-4, 0.25rem);
      margin-block-end: var(--pl-size-4, 0.25rem);
  }

  pl-label .pl-label__required {
      color: var(--pl-color-error, #B91C1C);
  }

  pl-label .pl-label__hint {
      display: block;
      margin-block-start: var(--pl-size-4, 0.25rem);
      font-size: var(--pl-font-size-xs, 0.75rem);
      font-weight: var(--pl-font-weight-normal, 400);
      color: var(--pl-color-ink-secondary, #626262);
  }

  pl-label .pl-label__error {
      display: block;
      margin-block-start: var(--pl-size-4, 0.25rem);
      font-size: var(--pl-font-size-xs, 0.75rem);
      font-weight: var(--pl-font-weight-normal, 400);
      color: var(--pl-color-error, #B91C1C);
  }

  pl-label[disabled] {
      opacity: var(--pl-opacity-50, 0.5);
      cursor: not-allowed;
  }
`;
