// ------------------------------
// Router: documentation SPA
// ------------------------------
// Every documentation URL renders the same shell (header, sidebar, content
// column) and swaps only the article: which is exactly why this page is an
// SPA while the marketing home page stays static HTML.
//
// The navigation plumbing — link interception, Back and Forward, focus, view
// transitions — is createRouter() from the library. This file is only the part
// that is specific to these docs: which URLs exist, and what each one renders.
// That split is the point of the utility, and this file is its first consumer.
//
// Routes are built from the generated NAV tree plus short lists of guide and
// utility pages, so adding a component directory adds its route automatically.
//
// Pages are LAZY: a route names a module, imported on first visit. No bundler,
// no manifest: the browser's own module loader is the code-splitter.

import { createRouter } from '../../Library/utilities/routing/createRouter.mjs';
import { NAV } from './nav.data.mjs';

const BASE = '/documentation';

// Guides come first in the sidebar and have hand-written modules.
export const GUIDES = [
    { slug: '', title: 'Overview', module: './pages/overview.mjs' },
    { slug: 'installation', title: 'Installation', module: './pages/installation.mjs' },
    { slug: 'authoring', title: 'Authoring components', module: './pages/authoring.mjs' },
    { slug: 'theming', title: 'Theming', module: './pages/theming.mjs' },
    { slug: 'loading', title: 'Loading states', module: './pages/loading.mjs' },
    { slug: 'sections', title: 'Content sections', module: './pages/sections.mjs' },
];

// Utilities are library modules rather than components: they add behaviour to
// a page or a component instead of rendering one, so they have no tag name and
// no place in the NAV tree. Their own sidebar section, listed by export.
export const UTILITIES = [
    { slug: 'utilities', title: 'Overview', module: './pages/utilities.mjs' },
    { slug: 'utilities/create-router', title: 'createRouter', module: './pages/util-create-router.mjs' },
    { slug: 'utilities/state-manager', title: 'signal, computed, effect', module: './pages/util-state-manager.mjs' },
    { slug: 'utilities/create-el', title: 'createEl', module: './pages/util-create-el.mjs' },
    { slug: 'utilities/inject-styles', title: 'injectStyles', module: './pages/util-inject-styles.mjs' },
    { slug: 'utilities/storage', title: 'readStorage, writeStorage', module: './pages/util-storage.mjs' },
    { slug: 'utilities/view-transition', title: 'withViewTransition', module: './pages/util-view-transition.mjs' },
    { slug: 'utilities/escape-html', title: 'escapeHTML', module: './pages/util-escape-html.mjs' },
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
    'pl-product-card', 'pl-profile-card', 'pl-carousel', 'pl-surface',
    'pl-loading', 'pl-meter', 'pl-progress', 'pl-skeleton',
    'pl-pie-chart', 'pl-doughnut-chart', 'pl-bar-chart',
    'pl-picture', 'pl-video', 'pl-pagination', 'pl-app-navigation',
    'pl-sidebar', 'pl-blank-page', 'pl-marketing-page', 'pl-ui-kit-page',
    'pl-content-page', 'pl-brand-kit-page',
]);

/** The URL for a documentation slug. */
export const href = slug => (slug ? `${BASE}/${slug}` : BASE);

/** The slug for the current location, '' at the section root. */
export function currentSlug(pathname = location.pathname) {
    if (!pathname.startsWith(BASE)) return '';
    return pathname.slice(BASE.length).replace(/^\/|\/$/g, '');
}

/** Every URL this section serves, as routes the library router can match. */
function routes() {
    const list = [...GUIDES, ...UTILITIES].map(entry => ({
        path: `/${entry.slug}`,
        kind: 'guide',
        slug: entry.slug,
        ...entry,
    }));

    for (const surface of NAV) {
        for (const group of surface.groups) {
            for (const component of group.components) {
                list.push({
                    path: `/${component.tag}`,
                    kind: 'component',
                    slug: component.tag,
                    tag: component.tag,
                    status: component.status,
                    surface: surface.name,
                    group: group.name,
                    // Only components with a written page get a module; the
                    // rest fall back to the "planned" placeholder.
                    module: COMPONENT_PAGES.has(component.tag)
                        ? `./pages/${component.tag}.mjs`
                        : null,
                });
            }
        }
    }

    return list;
}

/** Placeholder for a scaffolded-but-unwritten component. */
function placeholder(route) {
    return message(
        route.tag,
        `This component is scaffolded at Library/components/${route.surface}/${route.group}/${route.tag}/ but hasn't been written yet.`,
        route.tag,
    );
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

let router = null;

export const Router = {
    /** @param {HTMLElement} target where articles render */
    init(target, { onNavigate = () => {} } = {}) {
        router = createRouter({
            base: BASE,
            outlet: target,
            routes: routes(),
            render: async route => (route.module
                ? (await import(route.module)).default(route)
                : placeholder(route)),
            fallback: path => message('Page not found', `Nothing is documented at "${path.slice(1)}".`),
            onError: (error, path) => {
                console.error(`[router] failed to load "${path}"`, error);
                return message('Could not load this page', error.message);
            },
            onNavigate: (path, route) => onNavigate(route?.slug ?? currentSlug()),
        });

        router.start();
    },

    go(path, addToHistory = true) {
        router?.go(path, { history: addToHistory });
    },
};

export default Router;
