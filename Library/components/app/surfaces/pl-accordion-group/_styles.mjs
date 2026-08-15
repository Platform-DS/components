// ------------------------------
// Accordion Group Styles — LIGHT DOM
// ------------------------------
// Almost nothing: each pl-accordion already draws its own bottom rule, so the
// group only has to add the matching top rule and, in the boxed variant, the
// sides. Anything more would mean two components deciding the same border.

export const STYLES = /*css*/`
@layer pl-components {
  pl-accordion-group {
    display: block;
    border-block-start: var(--pl-border-width-small, 1px) solid var(--accordion-border, var(--pl-color-border, #E5E7EB));
  }

  pl-accordion-group[hidden] { display: none; }

  /* Boxed — a card around the stack. The last child's own rule would double
     with the box's edge, so it is dropped. */
  pl-accordion-group[data-variant="card"] {
    border: var(--pl-border-width-small, 1px) solid var(--accordion-border, var(--pl-color-border, #E5E7EB));
    border-radius: var(--pl-border-radius-large, 16px);
    background: var(--pl-color-surface, #fff);
    padding-inline: var(--pl-size-16, 1rem);
  }

  pl-accordion-group[data-variant="card"] > pl-accordion:last-child { border-block-end: 0; }
}
`;
