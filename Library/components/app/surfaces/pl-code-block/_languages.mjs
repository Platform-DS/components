/**
 * Grammars for <code-ui>, plus the scanner that applies them.
 *
 * A grammar is an ordered list of rules. The scanner walks the source left to
 * right and takes the FIRST rule that matches at the current index, so order
 * encodes precedence: `comment` and `string` sit at the top of every grammar,
 * which is what stops a keyword inside a comment — or a brace inside a string —
 * from being highlighted on its own. The outer token swallows it.
 *
 * Every pattern is sticky (`y`). That is what makes the left-to-right scan
 * possible: `exec()` will only match starting exactly at `lastIndex`, never by
 * skipping ahead to the next occurrence.
 *
 * Kinds are deliberately few — comment, string, number, keyword, property,
 * punctuation — because each one costs a color, and a palette stops being
 * readable long before it runs out of hues.
 */

const json = [
    // A string is a key only when a colon follows it; everything else is a value.
    { kind: 'property',    pattern: /"(?:\\.|[^"\\])*"(?=\s*:)/y },
    { kind: 'string',      pattern: /"(?:\\.|[^"\\])*"/y },
    { kind: 'keyword',     pattern: /\b(?:true|false|null)\b/y },
    { kind: 'number',      pattern: /(?<![\w-])-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/y },
    { kind: 'punctuation', pattern: /[{}[\],:]/y },
];

const css = [
    { kind: 'comment',     pattern: /\/\*[\s\S]*?\*\//y },
    { kind: 'string',      pattern: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/y },
    { kind: 'keyword',     pattern: /@[\w-]+/y },
    // Hex colors are values, so they read in the same color as numbers.
    { kind: 'number',      pattern: /#[0-9a-fA-F]{3,8}\b/y },
    { kind: 'property',    pattern: /--[\w-]+/y },
    { kind: 'property',    pattern: /[\w-]+(?=\s*:)/y },
    // Pseudo-classes only — a declaration's colon is followed by whitespace or
    // a value, so `color: red` cannot be mistaken for one.
    { kind: 'keyword',     pattern: /:[\w-]+/y },
    { kind: 'keyword',     pattern: /[a-zA-Z-][\w-]*(?=\()/y },
    // The lookbehind keeps the `1` in `h1` from reading as a number.
    { kind: 'number',      pattern: /(?<![\w-])-?(?:\d*\.)?\d+(?:px|rem|em|%|vw|vh|s|ms|deg|fr|ch|pt)?\b/y },
    { kind: 'punctuation', pattern: /[{}:;,()]/y },
];

const bash = [
    { kind: 'comment',     pattern: /#[^\n]*/y },
    // Single quotes do not process escapes in shell, hence the simpler pattern.
    { kind: 'string',      pattern: /"(?:\\.|[^"\\])*"|'[^']*'/y },
    { kind: 'string',      pattern: /https?:\/\/[^\s"'\\]+/y },
    // Only the first word of a line is the command. Requiring a leading letter
    // is what keeps the `-H` starting a continuation line out of this rule.
    { kind: 'keyword',     pattern: /(?<=^[ \t]*)[a-zA-Z][\w.-]*/my },
    // A flag's dash never follows a word character — that is the whole
    // difference between `-H` and the hyphen inside `Content-Type`.
    { kind: 'property',    pattern: /(?<![\w-])--?[\w-]+/y },
    { kind: 'punctuation', pattern: /[\\|&;<>()]/y },
];

/**
 * Markdown, which is not a language and is highlighted anyway.
 *
 * The Rules page (RulesPanel.js) stores a plain string and renders NOTHING —
 * no headings, no bold, no links. Coloring the syntax is what lets someone
 * write structure and see that they have: a `##` that came out the right
 * color is a heading, and one that did not is a hash. That is the whole job,
 * and it is why this belongs in a syntax table rather than in a renderer.
 *
 * Mapped onto the six kinds every grammar here shares, so the palette stays
 * the palette: a heading reads as a `keyword` because it is the strongest
 * mark in the file, a link's text as a `string`, list bullets and the rest of
 * the marks as `punctuation`. Nothing gets a color of its own.
 *
 * Multi-line by necessity — a fenced block and a heading are both anchored to
 * the start of a LINE — so these patterns carry `m` alongside the sticky `y`
 * that the scanner requires.
 */
const markdown = [
    // Fences first, and greedy to the closing ```: everything inside is code
    // and must not be re-read as marks. Same precedence argument as `comment`
    // at the top of every grammar above.
    { kind: 'comment',     pattern: /```[\s\S]*?(?:```|$)/y },
    { kind: 'string',      pattern: /`[^`\n]+`/y },
    // ATX headings, whole line. The hashes alone would leave the words the
    // same color as body text, which is exactly the distinction being drawn.
    { kind: 'keyword',     pattern: /^[ \t]*#{1,6} [^\n]*/my },
    // Setext underlines, the other way to write a heading.
    { kind: 'keyword',     pattern: /^[ \t]*(?:={3,}|-{3,})[ \t]*$/my },
    { kind: 'string',      pattern: /!?\[[^\]\n]*\]\([^)\n]*\)/y },
    { kind: 'number',      pattern: /\*\*[^\n]+?\*\*|__[^\n]+?__/y },
    // Emphasis, and the one rule that has to be careful: a lone `*` is a
    // bullet, so the closing mark is required before this claims anything.
    { kind: 'property',    pattern: /\*[^\s*][^\n]*?\*|_[^\s_][^\n]*?_/y },
    { kind: 'punctuation', pattern: /^[ \t]*(?:[-*+]|\d+\.)[ \t]/my },
    { kind: 'punctuation', pattern: /^[ \t]*>[ \t]?/my },
    { kind: 'comment',     pattern: /^[ \t]*\|[^\n]*/my },
];

const js = [
    { kind: 'comment',     pattern: /\/\/[^\n]*|\/\*[\s\S]*?\*\//y },
    // Template, single, and double quotes — escapes included so a quote inside
    // a string can't close it early.
    { kind: 'string',      pattern: /`(?:\\.|[^\\`])*`|'(?:\\.|[^\\'])*'|"(?:\\.|[^\\"])*"/y },
    { kind: 'keyword',     pattern: /\b(?:import|export|from|as|default|const|let|var|function|return|class|extends|super|new|await|async|yield|if|else|for|while|do|of|in|try|catch|finally|throw|switch|case|break|continue|typeof|instanceof|void|delete|this|null|undefined|true|false)\b/y },
    { kind: 'number',      pattern: /\b0[xX][0-9a-fA-F]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y },
    // A bare identifier immediately before `(` is a call — colored like a
    // property so method chains and helpers read as distinct from prose.
    { kind: 'property',    pattern: /[a-zA-Z_$][\w$]*(?=\s*\()/y },
    { kind: 'punctuation', pattern: /[{}[\]();,.:?=+\-*/%<>!&|^~]/y },
];

// Aliased to js: our JSX-free examples don't need a separate grammar.
const javascript = js;

const html = [
    { kind: 'comment',     pattern: /<!--[\s\S]*?-->/y },
    // Attribute values.
    { kind: 'string',      pattern: /"[^"]*"|'[^']*'/y },
    // Bracket punctuation only — matched on its own, ahead of everything else,
    // so the tag name it wraps is left unmatched. An unmatched run renders as
    // plain text (see tokenize()'s `kind: null` case), which is what gives the
    // tag name the page's own foreground instead of a color competing with
    // the brackets and attributes around it.
    { kind: 'tag',         pattern: /<\/|\/>|[<>]/y },
    // An attribute name is the token immediately before its `=`. A boolean
    // attribute (no `=`) is left unmatched for the same reason as the tag name.
    { kind: 'attr',        pattern: /[a-zA-Z_:][\w:.-]*(?==)/y },
    { kind: 'punctuation', pattern: /=/y },
];

/** Grammar per `language` value. Aliases point at the same rule list. */
export const GRAMMARS = {
    js, javascript, mjs: js,
    html, xml: html,
    json,
    css,
    bash, sh: bash, shell: bash,
    markdown, md: markdown,
};

/**
 * Splits `source` into `{ kind, text }` runs. Text matched by no rule comes
 * back with `kind: null` and is rendered unstyled, so the concatenation of
 * every `text` always reproduces the input exactly.
 */
export function tokenize(source, grammar) {
    const tokens = [];
    let plain = '';
    let index = 0;

    const flush = () => {
        if (plain) tokens.push({ kind: null, text: plain });
        plain = '';
    };

    scan: while (index < source.length) {
        for (const rule of grammar) {
            rule.pattern.lastIndex = index;
            const match = rule.pattern.exec(source);

            // An empty match would leave `index` where it is and spin forever,
            // so it is treated as no match at all.
            if (match && match[0]) {
                flush();
                tokens.push({ kind: rule.kind, text: match[0] });
                index += match[0].length;
                continue scan;
            }
        }

        plain += source[index++];
    }

    flush();
    return tokens;
}
