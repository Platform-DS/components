// ------------------------------
// Escape HTML Utility
// ------------------------------

export function escapeHTML(value) {
    const replacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
    };
    replacements["'"] = '&#39;';

    return String(value).replace(/[&<>"']/g, (character) => replacements[character]);
};
