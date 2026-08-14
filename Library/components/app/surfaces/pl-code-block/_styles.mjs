// ------------------------------
// Code Block Styles
// ------------------------------
// A code block reads best on a dark surface regardless of the page theme, so
// this ships dark defaults rather than following light-dark(). Every value is a
// --code-block-* hook, so a consumer (or the docs site) re-themes it to match
// their own palette — see the `pl-code-block { … }` rule in the docs CSS.

export const STYLES = /*css*/`
  *, *::before, *::after { box-sizing: border-box; }

  :host {
    /* Surface */
    --_bg:     var(--code-block-background, #12151b);
    --_fg:     var(--code-block-color, #e6e6e6);
    --_border: var(--code-block-border, #2a2f37);
    --_head:   var(--code-block-head, #9aa0a6);

    /* Syntax — mapped onto the tokenizer's kinds. */
    --_comment:     var(--code-block-syntax-comment, #7c828b);
    --_string:      var(--code-block-syntax-string, #9ece6a);
    --_number:      var(--code-block-syntax-number, #e0af68);
    --_keyword:     var(--code-block-syntax-keyword, #f5c518);
    --_property:    var(--code-block-syntax-property, #7dcfff);
    /* Tag now means "bracket punctuation" only (<, >, </, />) — the tag name
       itself is left plain, same amber family as a number since both read as
       a literal rather than an identifier. Attr matches --_property's blue: an
       attribute name and an object/CSS property are the same kind of thing,
       a key introducing a value. */
    --_tag:         var(--code-block-syntax-tag, #e0af68);
    --_attr:        var(--code-block-syntax-attr, #7dcfff);
    --_punctuation: var(--code-block-syntax-punctuation, #9aa0a6);

    display: block;
    margin: 0;

    background: var(--_bg);
    color: var(--_fg);
    border: 1px solid var(--_border);
    border-radius: var(--pl-border-radius-medium, 10px);
    overflow: hidden;

    font-family: var(--pl-font-family-monospace, ui-monospace, monospace);
  }

  :host([hidden]) { display: none; }

  /* Head — language label on the left, copy on the right. */
  .code__head {
    display: flex;
    align-items: center;
    gap: var(--pl-size-8, 0.5rem);
    padding: var(--pl-size-4, 0.25rem) var(--pl-size-12, 0.75rem);
    border-block-end: 1px solid var(--_border);
    font-size: var(--pl-font-size-xs, 0.75rem);
    color: var(--_head);
  }

  .code__lang {
    margin-inline-end: auto;
    text-transform: lowercase;
    letter-spacing: 0.02em;
  }

  /* No language given: keep the copy button, drop the empty label. */
  .code__lang:empty { display: none; }

  .code__copy {
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
    padding: 0.15rem 0.5rem;
    font: inherit;
    font-size: var(--pl-font-size-xs, 0.75rem);
    color: var(--_head);
    background: transparent;
    border: 1px solid var(--_border);
    border-radius: var(--pl-border-radius-small, 4px);
    cursor: pointer;
    transition: color 120ms, background 120ms, border-color 120ms;
  }

  .code__copy:hover {
    color: var(--_fg);
    border-color: var(--code-block-accent, var(--_keyword));
  }

  .code__copy:focus-visible {
    outline: 2px solid var(--code-block-accent, var(--_keyword));
    outline-offset: 1px;
  }

  .code__copy[data-copied] {
    color: var(--code-block-on-accent, #111);
    background: var(--code-block-accent, var(--_keyword));
    border-color: var(--code-block-accent, var(--_keyword));
  }

  pre {
    margin: 0;
    padding: var(--pl-size-16, 1rem);
    overflow-x: auto;
    font-family: inherit;
    font-size: var(--pl-font-size-sm, 0.875rem);
    line-height: 1.65;
    tab-size: 2;
  }

  pre:focus-visible {
    outline: 2px solid var(--code-block-accent, var(--_keyword));
    outline-offset: -2px;
  }

  code {
    font: inherit;
    white-space: pre;
  }

  /* The slot only carries the source text IN — the highlighted copy is built
     from it in the shadow root. Removing it would drop the slotchange the
     component re-renders on, so it stays but never shows. */
  #source { display: none; }

  .syn--comment     { color: var(--_comment); font-style: italic; }
  .syn--string      { color: var(--_string); }
  .syn--number      { color: var(--_number); }
  .syn--keyword     { color: var(--_keyword); }
  .syn--property    { color: var(--_property); }
  .syn--tag         { color: var(--_tag); }
  .syn--attr        { color: var(--_attr); }
  .syn--punctuation { color: var(--_punctuation); }
`;
