// ------------------------------
// highlight: a deliberately small syntax highlighter
// ------------------------------
// The site's pitch is "no dependencies", so shipping a 200KB highlighter to
// prove it would be a poor look. This colors four things: comments, strings,
// keywords/tags, and numbers: which is all a short example needs.
//
// It is NOT a parser. It tokenizes with one pass of alternation, ordered so
// that comments and strings win before anything else can match inside them.
// That ordering is the whole trick, and it's why the patterns are combined
// into a single regex rather than applied in sequence.

const escapeHTML = text => text.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));

const JS_KEYWORDS = /\b(?:import|export|from|default|const|let|var|function|return|class|extends|static|new|await|async|if|else|for|of|in|try|catch|throw|typeof|instanceof|this|super|null|undefined|true|false)\b/;

// Order matters: earlier alternatives win.
const GRAMMARS = {
    js: [
        ['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
        ['string', /`(?:\\[\s\S]|[^\\`])*`|'(?:\\[\s\S]|[^\\'])*'|"(?:\\[\s\S]|[^\\"])*"/],
        ['keyword', JS_KEYWORDS],
        ['number', /\b\d+(?:\.\d+)?\b/],
    ],
    html: [
        ['comment', /&lt;!--[\s\S]*?--&gt;/],
        ['string', /"[^"]*"|'[^']*'/],
        ['tag', /&lt;\/?[a-zA-Z][\w-]*|\/?&gt;/],
        ['attr', /\b[a-zA-Z-]+(?==)/],
    ],
    css: [
        ['comment', /\/\*[\s\S]*?\*\//],
        ['string', /"[^"]*"|'[^']*'/],
        ['keyword', /--[\w-]+|@[a-z-]+/],
        ['number', /\b\d+(?:\.\d+)?[a-z%]*\b/],
    ],
    bash: [
        ['comment', /#[^\n]*/],
        ['string', /"[^"]*"|'[^']*'/],
        ['keyword', /\b(?:npm|npx|node|git|cd|install|run)\b/],
    ],
};

GRAMMARS.mjs = GRAMMARS.js;
GRAMMARS.javascript = GRAMMARS.js;
GRAMMARS.shell = GRAMMARS.bash;

/**
 * Highlight source into an HTML string.
 * Input is escaped FIRST, so every pattern matches against already-safe text
 * and the spans we add are the only markup in the result.
 */
export function highlight(source, lang = 'html') {
    const grammar = GRAMMARS[lang];
    const escaped = escapeHTML(source);
    if (!grammar) return escaped;

    // One combined regex, each rule in its own capture group.
    const pattern = new RegExp(grammar.map(([, re]) => `(${re.source})`).join('|'), 'g');

    return escaped.replace(pattern, (match, ...groups) => {
        const index = groups.findIndex((value, i) => i < grammar.length && value !== undefined);
        const kind = index === -1 ? null : grammar[index][0];
        return kind ? `<span class="tok-${kind}">${match}</span>` : match;
    });
}
