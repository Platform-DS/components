// ---------------------------------
// Style Reset Style Utility
// ---------------------------------

export const STYLE_RESET = /*css*/`
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
    
    [hidden] {
        display: none;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-family-display);
        font-weight: var(--font-weight-normal);
    }
    
    h1, h2, h3, h4, h5, h6, ul, ol, p {
        margin: 0;
    }
    
    h1, h2, h3, h4 {
        letter-spacing: var(--letter-spacing-wide);
    }
    
    h2, h3, h4 {
        color: light-dark(var(--color-gray-800), var(--color-gray-100));
        font-weight: var(--font-weight-medium);
        margin-block-end: var(--size-16);
    }
    
    h1 {
        font-size: var(--font-size-48);
        font-weight: var(--font-weight-medium);
        line-height: var(--line-height-tight);
        margin-block-end: var(--size-16);
    }
    
    h2 {
        font-size: var(--font-size-40);
        line-height: var(--line-height-tight);
    } 
    
    h3 {
        font-size: var(--font-size-32);
        line-height: var(--line-height-tight);
    }
    
    h4 {
        font-size: var(--font-size-24);
        line-height: var(--line-height-tight);
    }
    
    h5 {
        font-size: var(--font-size-20);
        line-height: var(--line-height-tight);
    }
    
    h6 {
        font-size: var(--font-size-16);
        line-height: var(--line-height-tight);
    }
    
    p, ul, ol, dd {
        color: var(--color-text-secondary);
        line-height: var(--line-height-loose);
        max-width: 75ch;
        margin-block-end: var(--size-16);
    }
    
    li {
        margin-block-end: var(--size-4);
    }
    
    strong {
        font-weight: var(--font-weight-semibold);
        color: var(--color-primary);
    }
    
    /* Data List */
    dl {
        margin-block-start: var(--size-4);
        /* margin-inline-start: var(--size-16); */
    }
    dt {
        margin-block-end: var(--size-4);
    }
    dd {
        margin-block-end: var(--size-12);
    }
    
    pre {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        color: var(--color-text-secondary);
        border: 1px solid var(--color-border-default);
        background: light-dark( var(--color-white), var(--color-black));
        font-size: 13px;
        line-height: var(--line-height-loose);
        border-radius: var(--border-radius-sm);
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
        margin-block: var(--size-16) var(--size-24);
        padding: var(--size-16);
    }
    
    pre code {
        background-color: transparent;
        border: none;
        padding: 0;
    }
    
    code {
        line-height: 1;
        margin: 0px 2px;
        padding: 1px 5px;
        white-space: nowrap;
        border-radius: 3px;
        font-size: 13px;
        border: 1px solid var(--color-border-default);
        color: var(--color-text-secondary);
        background-color: light-dark(rgb(246, 249, 252), var(--color-gray-900));
    }
    
    a {
        color: var(--color-primary);
        text-decoration: underline;
        text-decoration-color: var(--color-primary);
        text-underline-offset: var(--size-2);
    }
    
    hr {
        color: var(--color-border-default);
        margin-block: 0 var(--size-24);
        opacity: 0.5;
        width: 100%;
    }
`;