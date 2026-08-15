// ------------------------------
// Router: documentation SPA
// ------------------------------
// Every documentation URL renders the same shell (header, sidebar, content
// column) and swaps only the article: which is exactly why this page is an
// SPA while the marketing home page stays static HTML.
//
// Routes are resolved from the generated NAV tree plus a short list of guide
// pages, so adding a component directory adds its route automatically.
//
// Pages are LAZY: a route maps to a module path, imported on first visit. No
// bundler, no manifest: the browser's own module loader is the code-splitter.

import { NAV } from './nav.data.mjs';

const BASE = '/documentation';

// Guides come first in the sidebar and have hand-written modules.
export const GUIDES = [
    { slug: '', title: 'Overview', module: './pages/overview.mjs' },
    { slug: 'installation', title: 'Installation', module: './pages/installation.mjs' },
    { slug: 'authoring', title: 'Authoring components', module: './pages/authoring.mjs' },
    { slug: 'theming', title: 'Theming', module: './pages/theming.mjs' },
    { slug: 'sections', title: 'Content sections', module: './pages/sections.mjs' },
];

/** Every component that has a written page module. */
const COMPONENT_PAGES = new Set([
    'pl-button', 'pl-icon', 'pl-label', 'pl-code-block',
    'pl-input', 'pl-textarea', 'pl-checkbox', 'pl-radio', 'pl-range', 'pl-button-link',
    'pl-select', 'pl-search',
    'pl-hero', 'pl-social-proof', 'pl-benefits', 'pl-features',
    'pl-testimonials', 'pl-faqs', 'pl-cta', 'pl-header', 'pl-footer',
    'pl-button-group', 'pl-form', 'pl-switch', 'pl-color-picker', 'pl-radio-group',
    'pl-autocomplete', 'pl-ratings', 'pl-avatar', 'pl-chip', 'pl-badge',
    'pl-accordion', 'pl-accordion-group', 'pl-dialog', 'pl-popover', 'pl-feedback',
    'pl-product-card', 'pl-profile-card', 'pl-carousel',
    'pl-loading', 'pl-meter', 'pl-progress', 'pl-skeleton',
    'pl-picture', 'pl-video', 'pl-pagination', 'pl-app-navigation',
    'pl-sidebar', 'pl-blank-page', 'pl-marketing-page', 'pl-collection-page', 'pl-product-page',
]);

/** The URL for a documentation slug. */
export const href = slug => (slug ? `${BASE}/${slug}` : BASE);

/** The slug for the current location, '' at the section root. */
export function currentSlug(pathname = location.pathname) {
    if (!pathname.startsWith(BASE)) return '';
    return pathname.slice(BASE.length).replace(/^\/|\/$/g, '');
}

/** Look up what a slug should render. */
function resolve(slug) {
    const guide = GUIDES.find(g => g.slug === slug);
    if (guide) return { kind: 'guide', ...guide };

    for (const surface of NAV) {
        for (const group of surface.groups) {
            const component = group.components.find(c => c.tag === slug);
            if (!component) continue;

            return {
                kind: 'component',
                tag: component.tag,
                status: component.status,
                surface: surface.name,
                group: group.name,
                // Only components with a written page get a module; the rest
                // fall back to the "planned" placeholder.
                module: COMPONENT_PAGES.has(component.tag)
                    ? `./pages/${component.tag}.mjs`
                    : null,
            };
        }
    }

    return null;
}

let outlet = null;
let onNavigate = () => {};

/** Render a route into the outlet, with a view transition where supported. */
async function paint(route, slug) {
    let node;

    try {
        node = route?.module
            ? (await import(route.module)).default(route)
            : fallback(route, slug);
    } catch (error) {
        console.error(`[router] failed to load "${slug}"`, error);
        node = message('Could not load this page', error.message);
    }

    const swap = () => {
        outlet.replaceChildren(node);
        // Move focus to the heading so a keyboard or screen-reader user lands
        // in the new content rather than back at the top of the document. An
        // SPA has to do this by hand: a real navigation does it for free.
        const heading = node.querySelector('h1');
        if (heading) {
            heading.tabIndex = -1;
            heading.focus({ preventScroll: true });
        }
        window.scrollTo({ top: 0 });
    };

    if (document.startViewTransition) document.startViewTransition(swap);
    else swap();

    onNavigate(slug);
}

/** Placeholder for a scaffolded-but-unwritten component. */
function fallback(route, slug) {
    if (route?.kind === 'component') {
        return message(
            route.tag,
            `This component is scaffolded at Library/components/${route.surface}/${route.group}/${route.tag}/ but hasn't been written yet.`,
            route.tag,
        );
    }
    return message('Page not found', `Nothing is documented at "${slug}".`);
}

function message(title, body, tag) {
    const article = document.createElement('article');
    article.className = 'docs-article';
    article.innerHTML = `
        <header class="docs-header">
            ${tag ? `<p><code class="docs-header__tag">&lt;${tag}&gt;</code></p>` : ''}
            <h1>${title}</h1>
        </header>
        <div class="docs-empty"><p>${body}</p></div>
    `;
    return article;
}

export const Router = {
    /** @param {HTMLElement} target where articles render */
    init(target, { onNavigate: callback = () => {} } = {}) {
        outlet = target;
        onNavigate = callback;

        // Intercept in-app links. Anything outside /documentation (the home
        // page, GitHub) is left alone and navigates for real.
        document.addEventListener('click', event => {
            const link = event.target.closest('a[href]');
            if (!link || link.target || link.hasAttribute('download')) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

            const url = new URL(link.href, location.origin);
            if (url.origin !== location.origin) return;
            if (!url.pathname.startsWith(BASE)) return;

            event.preventDefault();
            Router.go(url.pathname);
        });

        window.addEventListener('popstate', () => {
            paint(resolve(currentSlug()), currentSlug());
        });

        const slug = currentSlug();
        paint(resolve(slug), slug);
    },

    go(path, addToHistory = true) {
        if (addToHistory && path !== location.pathname) {
            history.pushState(null, '', path);
        }
        const slug = currentSlug(path);
        paint(resolve(slug), slug);
    },
};

export default Router;
