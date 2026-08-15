// ------------------------------
// Marketing Page Styles — LIGHT DOM
// ------------------------------
// No max width here on purpose. Content sections are full-bleed bands that cap
// their own inner measure, so constraining them from outside would leave a
// coloured band floating in the middle of the page with white either side.

export const STYLES = /*css*/`
@layer pl-components {
  pl-marketing-page {
    display: block;
    /* Sections own their own vertical space, so the shell adds none between
       them — a gap here would double whatever they already set. */
  }

  pl-marketing-page[hidden] { display: none; }
}
`;
