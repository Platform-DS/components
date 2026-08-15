// ------------------------------
// Feedback Styles — LIGHT DOM
// ------------------------------
// A tinted band with a solid accent rule down its inline-start edge. The tint
// is derived with color-mix from the intent colour rather than being a second
// hand-picked palette — one source of truth per intent, and it stays correct
// when a consumer re-points --pl-color-success at their own green.
//
// Every intent also gets a distinct ICON, because colour alone is not a
// distinction for anyone who cannot see it — and the accent rule plus the
// glyph keep the four states apart in greyscale too.

export const STYLES = /*css*/`
:where(pl-feedback) {
  --_accent: var(--pl-color-primary, #2563EB);
}

pl-feedback {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: var(--pl-size-12, 0.75rem);

  padding: var(--feedback-padding, var(--pl-size-12, 0.75rem) var(--pl-size-16, 1rem));

  background: var(--feedback-background, color-mix(in oklab, var(--_accent) 8%, var(--pl-color-surface, #fff)));
  color: var(--pl-color-ink, #111827);
  border: var(--pl-border-width-small, 1px) solid color-mix(in oklab, var(--_accent) 28%, transparent);
  border-inline-start: 3px solid var(--_accent);
  border-radius: var(--pl-border-radius-medium, 10px);

  font-family: var(--pl-font-family-sans-serif, system-ui, sans-serif);
  font-size: var(--pl-font-size-sm, 0.875rem);
  line-height: var(--pl-line-height-medium, 1.5);
}

pl-feedback[hidden] { display: none; }

pl-feedback[data-intent="success"] { --_accent: var(--pl-color-success, #15803D); }
pl-feedback[data-intent="warning"] { --_accent: var(--pl-color-warning, #B45309); }
pl-feedback[data-intent="error"]   { --_accent: var(--pl-color-error, #B91C1C); }

/* The glyph. Drawn with a mask so it takes the accent colour, and marked
   decorative — the message text is what gets announced. */
pl-feedback::before {
  content: "";
  grid-column: 1;
  inline-size: 1.15rem;
  block-size: 1.15rem;
  /* Optical alignment with the first line of text. */
  margin-block-start: 0.1em;
  background-color: var(--_accent);
  -webkit-mask: var(--_icon) center / contain no-repeat;
  mask: var(--_icon) center / contain no-repeat;

  --_icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M12 11v5M12 7.6v.1'/%3E%3C/svg%3E");
}

pl-feedback[data-intent="success"]::before {
  --_icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='m8 12.5 2.5 2.5L16 9.5'/%3E%3C/svg%3E");
}

pl-feedback[data-intent="warning"]::before {
  --_icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10.3 3.9 1.8 18.3a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z'/%3E%3Cpath d='M12 9v4M12 16.6v.1'/%3E%3C/svg%3E");
}

pl-feedback[data-intent="error"]::before {
  --_icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='m9 9 6 6M15 9l-6 6'/%3E%3C/svg%3E");
}

/* Everything the author wrote shares the second column; the dismiss button
   is pulled back out of the flow into the corner. */
pl-feedback > * { grid-column: 2; margin: 0; }
pl-feedback > * + * { margin-block-start: var(--pl-size-4, 0.25rem); }

pl-feedback [data-title] {
  font-weight: var(--pl-font-weight-semibold, 600);
  color: var(--pl-color-ink, #111827);
}

pl-feedback .pl-feedback__dismiss {
  all: unset;
  grid-column: 3;
  grid-row: 1;
  display: grid;
  place-items: center;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  margin-inline-start: var(--pl-size-8, 0.5rem);
  border-radius: var(--pl-border-radius-full, 9999px);
  color: var(--pl-color-ink-secondary, #6B7280);
  cursor: pointer;
  box-sizing: border-box;
}

pl-feedback:has(.pl-feedback__dismiss) { grid-template-columns: auto 1fr auto; }

pl-feedback .pl-feedback__dismiss svg { inline-size: 0.85rem; block-size: 0.85rem; }

pl-feedback .pl-feedback__dismiss:hover {
  background: color-mix(in oklab, var(--_accent) 14%, transparent);
  color: var(--pl-color-ink, #111827);
}

pl-feedback .pl-feedback__dismiss:focus-visible {
  outline: 2px solid var(--pl-color-focus, #2563EB);
  outline-offset: 1px;
}
`;
