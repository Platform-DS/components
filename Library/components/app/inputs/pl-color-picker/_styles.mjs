// ------------------------------
// Color Picker Styles — LIGHT DOM
// ------------------------------
// Two real inputs made to look like one field: the border lives on the wrapper,
// both inputs are borderless inside it, and the wrapper takes the focus ring
// when either child has focus (via :focus-within).
//
// Its hooks are named --picker-* rather than --color-picker-*: the --color-*
// prefix is reserved by the token contract for colours, and a width living
// under it would be ambiguous.
//
// The colour swatch is an <input type="color"> with its UA chrome stripped —
// the native picker still opens on click, which is the whole point of using it
// rather than drawing a swatch and building a picker.

export const STYLES = /*css*/`
pl-color-picker { display: block; }
pl-color-picker[hidden] { display: none; }

pl-color-picker .pl-color__field {
  display: flex;
  align-items: stretch;
  inline-size: 100%;
  max-inline-size: var(--picker-width, 12rem);
  overflow: hidden;

  background: var(--field-background, var(--pl-color-surface, #fff));
  border: var(--pl-border-width-small, 1px) solid var(--field-border, var(--pl-color-border, #E5E7EB));
  border-radius: var(--pl-border-radius-medium, 8px);

  transition: border-color 120ms ease, box-shadow 120ms ease;
}

pl-color-picker .pl-color__field:hover {
  border-color: var(--field-border-hover, var(--pl-color-border-strong, #9CA3AF));
}

/* One ring for the pair — the two inputs read as a single control. */
pl-color-picker .pl-color__field:focus-within {
  border-color: var(--field-accent, var(--pl-color-focus, #2563EB));
  box-shadow: 0 0 0 3px var(--field-ring, color-mix(in oklab, var(--pl-color-focus, #2563EB) 22%, transparent));
}

/*------------------------------------------------
  Swatch — a real <input type="color"> with its chrome removed.
-------------------------------------------------*/
pl-color-picker .pl-color__swatch {
  flex: none;
  inline-size: 2.25rem;
  block-size: auto;
  align-self: stretch;
  padding: 0;
  margin: 0;
  border: 0;
  background: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

/* The UA wraps the colour in its own swatch element; strip its padding and
   border so the colour reaches the edges of our field. */
pl-color-picker .pl-color__swatch::-webkit-color-swatch-wrapper { padding: 0; }
pl-color-picker .pl-color__swatch::-webkit-color-swatch { border: 0; border-radius: 0; }
pl-color-picker .pl-color__swatch::-moz-color-swatch { border: 0; border-radius: 0; }

pl-color-picker .pl-color__swatch:focus-visible { outline: none; }

/*------------------------------------------------
  Hex text field
-------------------------------------------------*/
pl-color-picker .pl-color__text {
  flex: 1 1 auto;
  min-inline-size: 0;
  margin: 0;
  border: 0;
  border-inline-start: var(--pl-border-width-small, 1px) solid var(--pl-color-border, #E5E7EB);
  background: none;
  outline: none;

  padding: var(--pl-size-8, 0.5rem) var(--pl-size-12, 0.75rem);
  font-family: var(--pl-font-family-monospace, ui-monospace, monospace);
  font-size: var(--pl-font-size-sm, 0.875rem);
  color: var(--pl-color-ink, #111827);
  text-transform: uppercase;
}

pl-color-picker .pl-color__text::placeholder {
  color: var(--pl-color-ink-secondary, #6B7280);
  text-transform: none;
}

/* Only after the user has typed something invalid — never on first paint. */
pl-color-picker .pl-color__text:user-invalid {
  color: var(--pl-color-error, #B91C1C);
}

pl-color-picker[disabled] .pl-color__field {
  opacity: var(--pl-opacity-60, 0.6);
  cursor: not-allowed;
  background: var(--pl-color-surface-raised, #F9FAFB);
}

pl-color-picker[disabled] :is(.pl-color__swatch, .pl-color__text) { pointer-events: none; }
`;
