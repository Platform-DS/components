// ------------------------------
// Shared field styles
// ------------------------------
// The text-field chrome shared by pl-input and pl-textarea, parameterised by
// the internal element selector. Themeable through --field-* hooks; invalid
// styling uses :user-invalid so a field only turns red AFTER the user has
// interacted, never on first paint.

export const fieldStyles = (sel) => /*css*/`
  :host { display: block; }
  :host([hidden]) { display: none; }

  ${sel} {
    box-sizing: border-box;
    width: 100%;
    margin: 0;

    font: inherit;
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-base, 1rem);
    line-height: var(--pl-line-height-medium, 1.5);
    color: var(--pl-color-ink, #111);

    background: var(--field-background, var(--pl-color-surface, #fff));
    border: var(--pl-border-width-small, 1px) solid var(--field-border, var(--pl-color-border, #cfcfcf));
    border-radius: var(--pl-border-radius-medium, 10px);
    padding: var(--pl-size-8, 0.5rem) var(--pl-size-12, 0.75rem);

    transition: border-color 120ms ease, box-shadow 120ms ease;
  }

  ${sel}::placeholder { color: var(--pl-color-ink-secondary, #626262); }

  ${sel}:hover { border-color: var(--field-border-hover, var(--pl-color-border-strong, #9CA3AF)); }

  ${sel}:focus-visible {
    outline: none;
    border-color: var(--field-accent, var(--pl-color-primary, #2563EB));
    box-shadow: 0 0 0 3px var(--field-ring, color-mix(in oklab, var(--pl-color-primary, #2563EB) 22%, transparent));
  }

  ${sel}:disabled {
    opacity: var(--pl-opacity-50, 0.5);
    cursor: not-allowed;
    background: var(--pl-color-surface-raised, #F9FAFB);
  }

  /* Only after interaction — never a red field the user hasn't touched. */
  ${sel}:user-invalid {
    border-color: var(--pl-color-error, #B91C1C);
  }

  ${sel}:user-invalid:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--pl-color-error, #B91C1C) 22%, transparent);
  }
`;
