// ------------------------------
// Blank Page Styles — LIGHT DOM
// ------------------------------
// A column that fills the viewport height, so a short page still pins its
// footer to the bottom rather than leaving it floating mid-screen.

export const STYLES = /*css*/`
pl-blank-page {
  display: flex;
  flex-direction: column;
  min-block-size: 100dvh;
}

pl-blank-page[hidden] { display: none; }

/* Whatever sits between the header and the footer takes the slack. */
pl-blank-page > main {
  flex: 1;
  inline-size: 100%;
  max-inline-size: var(--page-measure, 68rem);
  margin-inline: auto;
  padding: var(--page-padding, var(--pl-size-48, 3rem) var(--pl-size-24, 1.5rem));
}

pl-blank-page > main > * + * { margin-block-start: var(--pl-size-24, 1.5rem); }
`;
