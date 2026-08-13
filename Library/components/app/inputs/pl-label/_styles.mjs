// ------------------------------
// Label Styles — LIGHT DOM
// ------------------------------
// This component has no shadow root, so these styles are NOT encapsulated and
// can't be adopted as a Constructable Stylesheet on a shadow root. They're
// injected into the document once, on first use, scoped by the `pl-label` tag
// name and a BEM-ish class so they behave predictably in the page cascade.
//
// @layer matters here: putting component styles in a named layer means a
// consumer's own unlayered CSS always wins, so nobody has to fight
// specificity to restyle a label.

export const STYLES = /*css*/`
@layer pl-components {
    pl-label {
        display: block;
        font-family: var(--pl-font-sans, system-ui, sans-serif);
        font-size: var(--pl-text-sm, 0.875rem);
        font-weight: var(--pl-weight-medium, 500);
        line-height: var(--pl-leading-base, 1.6);
        color: var(--pl-color-text, oklch(0.09 0 0));
    }

    pl-label .pl-label__text {
        display: flex;
        align-items: center;
        gap: var(--pl-space-2xs, 0.25rem);
        margin-block-end: var(--pl-space-2xs, 0.25rem);
    }

    pl-label .pl-label__required {
        color: var(--pl-color-danger, oklch(0.55 0.20 27));
    }

    pl-label .pl-label__hint {
        display: block;
        margin-block-start: var(--pl-space-2xs, 0.25rem);
        font-size: var(--pl-text-xs, 0.75rem);
        font-weight: var(--pl-weight-normal, 400);
        color: var(--pl-color-text-muted, oklch(0.47 0 0));
    }

    pl-label .pl-label__error {
        display: block;
        margin-block-start: var(--pl-space-2xs, 0.25rem);
        font-size: var(--pl-text-xs, 0.75rem);
        font-weight: var(--pl-weight-normal, 400);
        color: var(--pl-color-danger, oklch(0.55 0.20 27));
    }

    pl-label[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
`;
