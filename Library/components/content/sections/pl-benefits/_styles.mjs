// ------------------------------
// Benefits Styles — LIGHT DOM
// ------------------------------
// An auto-fitting grid of outcomes. The markup is a plain <ul> — a list of
// benefits IS a list — so it reads correctly with styles off and announces its
// length to a screen reader.

export const STYLES = /*css*/`
@layer pl-components {
  pl-benefits > ul {
    display: grid;
    /* 13.5rem so the common four-up row fits at the default section width
       instead of orphaning the fourth card onto its own line. */
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 13.5rem), 1fr));
    gap: var(--pl-size-24, 1.5rem);
    list-style: none;
    margin-block-start: var(--pl-size-48, 3rem);
    padding: 0;
  }

  /* Fixed column count when the author wants control over the rhythm. */
  pl-benefits[columns="2"] > ul { grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr)); }
  pl-benefits[columns="4"] > ul { grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr)); }

  pl-benefits > ul > li {
    display: grid;
    /* The icon row sizes to content; everything else flows under it. */
    align-content: start;
    gap: var(--pl-size-8, 0.5rem);
  }

  /* Card treatment — opt in per section. */
  pl-benefits[variant="card"] > ul > li {
    padding: var(--pl-size-24, 1.5rem);
    background: var(--pl-color-surface, #fff);
    border: 1px solid var(--section-line);
    border-radius: var(--pl-border-radius-large, 20px);
  }

  pl-benefits[surface="default"][variant="card"] > ul > li,
  pl-benefits[variant="card"]:not([surface]) > ul > li {
    background: var(--pl-color-surface-raised, #F9FAFB);
  }

  pl-benefits :is(h3, h4) {
    font-size: var(--pl-font-size-lg, 1.125rem);
    margin-block: 0;
  }

  pl-benefits li p {
    margin-block: 0;
    color: var(--section-ink-muted);
  }

  /*------------------------------------------------
    Leading icon — any <pl-icon>, <svg>, or <img> first in the item.
  -------------------------------------------------*/
  pl-benefits li > :is(pl-icon, svg, img):first-child {
    display: grid;
    place-items: center;
    inline-size: 2.5rem;
    block-size: 2.5rem;
    margin-block-end: var(--pl-size-8, 0.5rem);
    padding: 0.55rem;
    box-sizing: border-box;
    color: var(--pl-color-on-primary, #FFFFFF);
    background: var(--section-accent);
    border-radius: var(--pl-border-radius-medium, 10px);
  }

  pl-benefits[surface="brand"] li > :is(pl-icon, svg, img):first-child {
    color: var(--pl-color-primary, #2563EB);
  }
}
`;
