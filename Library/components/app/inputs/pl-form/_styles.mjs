// ------------------------------
// Form Styles — LIGHT DOM
// ------------------------------
// A stacked column of fields with consistent spacing. Deliberately plain: a
// form's job is rhythm, not decoration.

export const STYLES = /*css*/`
@layer pl-components {
  pl-form { display: block; }
  pl-form[hidden] { display: none; }

  pl-form > form {
    display: flex;
    flex-direction: column;
    gap: var(--form-gap, var(--pl-size-16, 1rem));
    padding: var(--form-padding, 0);
    margin: 0;
  }

  /* Boxed — a card around the fields. */
  pl-form[data-variant="card"] > form {
    padding: var(--form-padding, var(--pl-size-24, 1.5rem));
    background: var(--pl-color-surface-raised, #F9FAFB);
    border: 1px solid var(--pl-color-border, #E5E7EB);
    border-radius: var(--pl-border-radius-large, 16px);
  }

  /* A row of actions at the end sits horizontally, not in the column. */
  pl-form [data-actions] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--pl-size-8, 0.5rem);
    margin-block-start: var(--pl-size-8, 0.5rem);
  }

  pl-form [data-actions][data-align="end"] { justify-content: flex-end; }

  /* Side-by-side fields. */
  pl-form [data-row] {
    display: flex;
    flex-wrap: wrap;
    gap: var(--form-gap, var(--pl-size-16, 1rem));
  }

  pl-form [data-row] > * { flex: 1 1 12rem; }

  pl-form fieldset {
    display: flex;
    flex-direction: column;
    gap: var(--form-gap, var(--pl-size-16, 1rem));
    margin: 0;
    padding: 0;
    border: 0;
  }

  pl-form legend {
    padding: 0;
    font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
    font-size: var(--pl-font-size-sm, 0.875rem);
    font-weight: var(--pl-font-weight-semibold, 600);
    color: var(--pl-color-ink, #111827);
  }
}
`;
