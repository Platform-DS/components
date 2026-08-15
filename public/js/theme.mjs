// ------------------------------
// theme: light / dark toggle
// ------------------------------
// The entire mechanism is one attribute on <html>, which flips `color-scheme`,
// which re-resolves every light-dark() token in the library. That's the whole
// theming story the docs describe, so the site had better use it.
//
// Shared by the static home page and the SPA, hence its own module.

const KEY = 'pl-theme';
const root = document.documentElement;

/** Apply a stored preference before first paint (called from the head). */
export function applyStoredTheme() {
    const stored = localStorage.getItem(KEY);
    if (stored) root.dataset.theme = stored;
}

export function toggleTheme() {
    // No stored value means we're following the OS; read what's actually
    // rendering so the first click flips what the user currently sees rather
    // than jumping to an arbitrary default.
    const current = root.dataset.theme
        ?? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem(KEY, next);
    return next;
}

/** Wire up every toggle button on the page. */
export function initThemeToggle() {
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
        button.addEventListener('click', () => {
            const next = toggleTheme();
            button.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`);
        });
    }
}
