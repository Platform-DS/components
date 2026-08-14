// ------------------------------
// CTA Styles — LIGHT DOM
// ------------------------------
// The closing ask. Centred and brand-filled by default, because it's the last
// thing on the page and shouldn't look like another content band.

export const STYLES = /*css*/`
@layer pl-components {
  pl-cta {
    --section-width: 46rem;
    --section-space: clamp(3.5rem, 8vw, 6rem);
    justify-items: center;
    text-align: center;
  }

  /* Brand fill unless the author picked a surface. */
  pl-cta:not([surface]) {
    --section-bg: var(--pl-color-primary, #2563EB);
    --section-ink: var(--pl-color-on-primary, #FFFFFF);
    --section-ink-muted: color-mix(in oklab, var(--pl-color-on-primary, #FFFFFF) 78%, transparent);
    --section-accent: var(--pl-color-on-primary, #FFFFFF);
    --section-line: color-mix(in oklab, var(--pl-color-on-primary, #FFFFFF) 30%, transparent);
  }

  pl-cta > h2 {
    font-size: clamp(1.9rem, 1.2rem + 2.6vw, 3rem);
    max-inline-size: 18ch;
    margin-inline: auto;
  }

  pl-cta > h2 + p {
    font-size: var(--pl-font-size-lg, 1.125rem);
    max-inline-size: 46ch;
    margin-inline: auto;
    color: var(--section-ink-muted);
  }

  pl-cta > [data-actions] { justify-content: center; }

  /* A supporting line under the buttons ("No card required."). */
  pl-cta > [data-actions] + p {
    margin-block-start: var(--pl-size-16, 1rem);
    font-size: var(--pl-font-size-sm, 0.875rem);
    color: var(--section-ink-muted);
  }

  /* Inline form variant — an email capture beside the button. */
  pl-cta form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--pl-size-8, 0.5rem);
    inline-size: 100%;
    max-inline-size: 30rem;
    margin-block-start: var(--pl-size-24, 1.5rem);
    margin-inline: auto;
  }

  pl-cta form > pl-input { flex: 1 1 14rem; }
}
`;
