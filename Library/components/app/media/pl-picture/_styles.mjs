// ------------------------------
// Picture Styles — LIGHT DOM
// ------------------------------
// Without a `ratio` the element takes the image's own intrinsic size, which is
// the right default: an aspect ratio nobody asked for is a crop nobody asked
// for. Once one is set, the box holds that shape and the image fills it.

export const STYLES = /*css*/`
@layer pl-components {
  pl-picture {
    display: block;
    overflow: hidden;
    border-radius: var(--picture-radius, 0);
  }

  pl-picture[hidden] { display: none; }

  pl-picture picture {
    display: block;
    block-size: 100%;
  }

  pl-picture img {
    display: block;
    inline-size: 100%;
    block-size: auto;
  }

  /* A ratio turns the box into a fixed shape and the image into its filling. */
  pl-picture[ratio] { aspect-ratio: var(--picture-ratio, auto); }

  pl-picture[ratio] img {
    block-size: 100%;
    object-fit: var(--picture-fit, cover);
  }

  pl-picture[fit="contain"] { --picture-fit: contain; }
  pl-picture[fit="fill"] { --picture-fit: fill; }
  pl-picture[fit="none"] { --picture-fit: none; }
}
`;
