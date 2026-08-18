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
    color: var(--field-color, var(--pl-color-ink, #111));

    background: var(--field-background, var(--pl-color-surface, #fff));

    /* Four independent widths, not a "border" shorthand, so a theme can drop
       three sides and keep one — the Material-style underline field is
       --field-border-inline-start-width: 0, -inline-end-width: 0, and
       -block-start-width: 0, leaving the bottom at its default width. Each
       falls back to ONE uniform override (--field-border-width) before the
       global token, so the common case — every side the same, just a
       different width — is still a single declaration. */
    border-style: solid;
    border-color: var(--field-border, var(--pl-color-border, #cfcfcf));
    border-inline-start-width: var(--field-border-inline-start-width, var(--field-border-width, var(--pl-border-width-small, 1px)));
    border-inline-end-width:   var(--field-border-inline-end-width,   var(--field-border-width, var(--pl-border-width-small, 1px)));
    border-block-start-width:  var(--field-border-block-start-width,  var(--field-border-width, var(--pl-border-width-small, 1px)));
    border-block-end-width:    var(--field-border-block-end-width,    var(--field-border-width, var(--pl-border-width-small, 1px)));
    border-radius: var(--field-radius, var(--pl-control-radius, 8px));
    padding: var(--pl-size-8, 0.5rem) var(--pl-size-12, 0.75rem);

    /* The same floor pl-button meets, so the two line up in a form row rather
       than missing each other by the difference between a tight label line and
       a comfortable field one. See the control-height note in tokens.css.
       A textarea is already taller than this, so it is unaffected. */
    min-block-size: var(--field-height, var(--pl-control-height-md, 2.625rem));

    /* A resting elevation, invisible by default — most kits want a flat
       field. Stored in a custom property rather than repeated in every
       box-shadow below, because focus/error/success don't REPLACE this
       shadow, they layer a ring on top of it; a theme that does set one would
       otherwise watch it vanish the moment a field is touched. (--pl-box-
       shadow-input's default is 0 0 #0000, not none, for exactly that
       layering reason — see the comment on the token in tokens.css.) */
    --_shadow: var(--field-shadow, var(--pl-box-shadow-input, 0 0 #0000));
    box-shadow: var(--_shadow);

    transition: border-color 120ms ease, box-shadow 120ms ease;
  }

  ${sel}::placeholder { color: var(--field-placeholder, var(--pl-color-ink-secondary, #626262)); }

  ${sel}:hover { border-color: var(--field-border-hover, var(--pl-color-border-strong, #9CA3AF)); }

  ${sel}:focus-visible {
    outline: none;
    border-color: var(--field-accent, var(--pl-color-primary, #2563EB));
    box-shadow: var(--_shadow), 0 0 0 3px var(--field-ring, color-mix(in oklab, var(--pl-color-primary, #2563EB) 22%, transparent));
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

  /* An AUTHOR-asserted error, which is a different claim from "the user typed
     something the browser rejects". pl-label sets aria-invalid on the host when
     given an error message, and a field the page has declared invalid should
     look it immediately — the announcement and the chrome must not disagree. */
  :host([aria-invalid="true"]) ${sel} {
    border-color: var(--pl-color-error, #B91C1C);
  }

  ${sel}:user-invalid:focus-visible,
  :host([aria-invalid="true"]) ${sel}:focus-visible {
    box-shadow: var(--_shadow), 0 0 0 3px color-mix(in oklab, var(--pl-color-error, #B91C1C) 22%, transparent);
  }

  /* The author-asserted twin for the happy path: pl-label sets data-success on
     the host when given a success message. ARIA has no "valid" state, so this
     attribute is the styling hook and the label's message line is what speaks.
     Error outranks it in pl-label, so the two can never render together. */
  :host([data-success]) ${sel} {
    border-color: var(--pl-color-success, #047857);
  }

  :host([data-success]) ${sel}:focus-visible {
    box-shadow: var(--_shadow), 0 0 0 3px color-mix(in oklab, var(--pl-color-success, #047857) 22%, transparent);
  }
`;
