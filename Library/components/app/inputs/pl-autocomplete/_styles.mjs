// ------------------------------
// Autocomplete Styles — LIGHT DOM
// ------------------------------
// The visible field is a plain <input>, styled by hand to match pl-input's
// chrome rather than sharing its stylesheet — that stylesheet targets :host,
// which only exists in Shadow DOM (see pl-color-picker for the same trade).
// Same hook names, though, so a page theming one themes both.
//
// <datalist> renders nothing of its own here — the suggestion list is the
// browser's native popup, unstyleable by design — so there is nothing to
// write for it beyond making sure it never occupies layout.

export const STYLES = /*css*/`
@layer pl-components {
  pl-autocomplete { display: block; }
  pl-autocomplete[hidden] { display: none; }

  pl-autocomplete datalist { display: none; }

  pl-autocomplete .pl-autocomplete__input {
    box-sizing: border-box;
    inline-size: 100%;
    margin: 0;

    font: inherit;
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-base, 1rem);
    line-height: var(--pl-line-height-medium, 1.5);
    color: var(--pl-color-ink, #111827);

    background: var(--field-background, var(--pl-color-surface, #fff));
    border: var(--pl-border-width-small, 1px) solid var(--field-border, var(--pl-color-border, #cfcfcf));
    border-radius: var(--pl-border-radius-medium, 10px);
    padding: var(--pl-size-8, 0.5rem) var(--pl-size-12, 0.75rem);

    transition: border-color 120ms ease, box-shadow 120ms ease;
  }

  pl-autocomplete .pl-autocomplete__input::placeholder {
    color: var(--pl-color-ink-secondary, #6B7280);
  }

  pl-autocomplete .pl-autocomplete__input:hover {
    border-color: var(--field-border-hover, var(--pl-color-border-strong, #9CA3AF));
  }

  pl-autocomplete .pl-autocomplete__input:focus-visible {
    outline: none;
    border-color: var(--field-accent, var(--pl-color-primary, #2563EB));
    box-shadow: 0 0 0 3px var(--field-ring, color-mix(in oklab, var(--pl-color-primary, #2563EB) 22%, transparent));
  }

  pl-autocomplete .pl-autocomplete__input:disabled {
    opacity: var(--pl-opacity-50, 0.5);
    cursor: not-allowed;
    background: var(--pl-color-surface-raised, #F9FAFB);
  }

  /* Only after interaction — never a red field the user hasn't touched. */
  pl-autocomplete .pl-autocomplete__input:user-invalid {
    border-color: var(--pl-color-error, #B91C1C);
  }

  pl-autocomplete .pl-autocomplete__input:user-invalid:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--pl-color-error, #B91C1C) 22%, transparent);
  }
}
`;
