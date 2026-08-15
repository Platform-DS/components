// ------------------------------
// App Navigation Styles — LIGHT DOM
// ------------------------------
// The active state keys off `aria-current="page"` rather than a class, so the
// thing a screen reader announces and the thing a sighted user sees are driven
// by one attribute and cannot drift apart.

export const STYLES = /*css*/`
@layer pl-components {
  pl-app-navigation {
    display: block;
    padding: var(--nav-padding, var(--pl-size-12, 0.75rem));
    background: var(--nav-background, transparent);
  }

  pl-app-navigation[hidden] { display: none; }

  pl-app-navigation nav {
    display: flex;
    flex-direction: column;
    gap: var(--pl-size-2, 0.125rem);
  }

  pl-app-navigation a {
    display: flex;
    align-items: center;
    gap: var(--pl-size-8, 0.5rem);

    padding: var(--pl-size-8, 0.5rem) var(--pl-size-12, 0.75rem);
    border-radius: var(--pl-border-radius-medium, 8px);

    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-sm, 0.875rem);
    color: var(--pl-color-ink-secondary, #4B5563);
    text-decoration: none;
  }

  pl-app-navigation a:hover {
    background: var(--pl-color-surface-sunken, #F3F4F6);
    color: var(--pl-color-ink, #111827);
  }

  pl-app-navigation a:focus-visible {
    outline: 2px solid var(--pl-color-focus, #2563EB);
    outline-offset: -2px;
  }

  pl-app-navigation a[aria-current] {
    background: var(--nav-current, color-mix(in oklab, var(--pl-color-primary, #2563EB) 12%, transparent));
    color: var(--pl-color-primary, #2563EB);
    font-weight: var(--pl-font-weight-medium, 500);
  }

  /* A group heading, not a link. */
  pl-app-navigation [data-section] {
    margin: var(--pl-size-16, 1rem) 0 var(--pl-size-4, 0.25rem);
    padding-inline: var(--pl-size-12, 0.75rem);

    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-xs, 0.75rem);
    font-weight: var(--pl-font-weight-semibold, 600);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--pl-color-ink-secondary, #6B7280);
  }

  pl-app-navigation [data-section]:first-child { margin-block-start: 0; }

  pl-app-navigation pl-icon { flex: none; }
}
`;
