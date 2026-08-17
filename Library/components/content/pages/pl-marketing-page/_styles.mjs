// ------------------------------
// Marketing Page Styles — LIGHT DOM
// ------------------------------
// No max width here on purpose. Content sections are full-bleed bands that cap
// their own inner measure, so constraining them from outside would leave a
// colored band floating in the middle of the page with white either side.

export const STYLES = /*css*/`
pl-marketing-page {
  /* A column that fills the viewport, so a short page — one hero and a
     footer, say — still pins its footer to the bottom instead of leaving it
     floating mid-screen. Sections own their own vertical space, so there is
     no gap here: one would double the padding they already set. */
  display: flex;
  flex-direction: column;
  min-block-size: 100dvh;
}

pl-marketing-page[hidden] { display: none; }

/* The slack goes above the footer rather than to a nominated child, so the
   rule holds whatever the page is made of. */
pl-marketing-page > pl-footer { margin-block-start: auto; }
`;
