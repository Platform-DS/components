// ------------------------------
// Radio Group Styles — LIGHT DOM
// ------------------------------
// A labelled stack of options. Column by default, because a vertical list is
// easier to scan and does not force a scan-line reset per option.

export const STYLES = /*css*/`
:where(pl-radio-group) {
  display: flex;
  flex-direction: column;
  gap: var(--radio-group-gap, var(--pl-size-8, 0.5rem));
  font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
}

pl-radio-group[hidden] { display: none; }

pl-radio-group .pl-radio-group__label {
  font-size: var(--pl-font-size-sm, 0.875rem);
  font-weight: var(--pl-font-weight-semibold, 600);
  line-height: var(--pl-line-height-medium, 1.5);
  color: var(--pl-color-ink, #111827);
  margin-block-end: var(--pl-size-2, 0.125rem);
}

pl-radio-group .pl-radio-group__hint {
  font-size: var(--pl-font-size-xs, 0.75rem);
  color: var(--pl-color-ink-secondary, #6B7280);
  margin-block-start: calc(var(--pl-size-4, 0.25rem) * -1);
}

/* The options themselves. */
pl-radio-group .pl-radio-group__options {
  display: flex;
  flex-direction: column;
  gap: var(--radio-group-gap, var(--pl-size-8, 0.5rem));
}

pl-radio-group[data-orientation="horizontal"] .pl-radio-group__options {
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--radio-group-gap, var(--pl-size-16, 1rem));
}

pl-radio-group[disabled] {
  opacity: var(--pl-opacity-60, 0.6);
  cursor: not-allowed;
}

/*------------------------------------------------
  Card variant — each option gets a hit area, which is easier to click and
  reads as a set of choices rather than a list of dots.
-------------------------------------------------*/
pl-radio-group[data-variant="card"] .pl-radio-group__options { gap: var(--radio-group-gap, var(--pl-size-8, 0.5rem)); }

pl-radio-group[data-variant="card"] pl-radio {
  padding: var(--pl-size-12, 0.75rem) var(--pl-size-16, 1rem);
  border: var(--pl-border-width-small, 1px) solid var(--pl-color-border, #E5E7EB);
  border-radius: var(--pl-border-radius-medium, 8px);
  background: var(--pl-color-surface, #fff);
  transition: border-color 120ms ease, background 120ms ease;
}

pl-radio-group[data-variant="card"] pl-radio:hover {
  border-color: var(--pl-color-border-strong, #9CA3AF);
}

/* The host mirrors its checked state as an attribute, so the card can
   respond in CSS alone. */
pl-radio-group[data-variant="card"] pl-radio[checked] {
  border-color: var(--pl-color-primary, #2563EB);
  background: var(--pl-color-primary-surface, #EFF6FF);
}

pl-radio-group[data-variant="card"][data-orientation="horizontal"] pl-radio { flex: 1 1 10rem; }
`;
