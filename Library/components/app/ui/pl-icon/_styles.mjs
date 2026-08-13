export const STYLES = /*css*/`
    :host {
        display: inline-flex;
        width: var(--_icon-width, 1.5rem);
        height: var(--_icon-height, 1.5rem);
        color: var(--_icon-color, currentColor);
        line-height: 0;
    }
    svg {
        width: 100%;
        height: 100%;
        /* No blanket fill/stroke here — each symbol in the spritesheet
           declares its own fill/stroke ("none" + stroke for outline icons
           like sun/moon, "currentColor" fill for solid ones), and forcing
           fill here would override that (e.g. filling in the sun/moon's
           open ray paths into solid wedges instead of thin lines). */
    }
`;