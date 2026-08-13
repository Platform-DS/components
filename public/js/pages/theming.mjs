// ------------------------------
// Documentation — Theming
// ------------------------------

import { page, header, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'Theming',
        lede: 'Custom properties are the only thing that crosses a shadow boundary — so they are the API.',
    }),

    p(`Shadow DOM blocks the cascade by design. A <code>button { color: red }</code> rule in
       your stylesheet cannot reach inside <code>&lt;pl-button&gt;</code>, and that is the point:
       it is what makes a component's appearance predictable no matter whose page it lands on.`),

    p(`Custom properties are the deliberate exception. They inherit through shadow boundaries,
       which makes them the one channel a component can expose for styling — and the reason this
       library needs no theming configuration, no Sass variables, and no rebuild.`),

    section('Three levels of override'),

    p('From broadest to narrowest, each one wins over the last:'),

    code(`
        /* 1. Global — every component, everywhere */
        :root {
            --pl-color-brand: oklch(0.72 0.19 250);
        }

        /* 2. Scoped — one region of the page */
        .checkout {
            --pl-color-brand: oklch(0.65 0.20 25);
        }
    `, 'css'),

    code(`
        <!-- 3. Instance — one element -->
        <pl-button style="--pl-button-bg: black; --pl-button-fg: white">
            One-off
        </pl-button>
    `, 'html'),

    demo(`
        <pl-button>Default</pl-button>
        <pl-button style="--pl-button-bg: oklch(0.55 0.20 265); --pl-button-fg: white">
            Instance override
        </pl-button>
        <span style="--pl-color-brand: oklch(0.72 0.17 150)">
            <pl-button>Scoped override</pl-button>
        </span>
    `),

    section('Light and dark'),

    p(`Semantic tokens are defined with <code>light-dark()</code>, which resolves against the
       <code>color-scheme</code> property. That means the whole system switches on one
       declaration — there is no theme class to apply to every element, and no JavaScript
       required:`),

    code(`
        :root { color-scheme: light dark; }   /* follow the OS */
        :root { color-scheme: dark; }         /* force dark   */
    `, 'css'),

    callout('note', 'The toggle in this page header does exactly that',
        `It sets <code>data-theme</code> on <code>&lt;html&gt;</code>, which flips
         <code>color-scheme</code>, which re-resolves every <code>light-dark()</code> token.
         That is the entire implementation — about fifteen lines in
         <code>public/js/theme.mjs</code>.`),

    section('Token reference'),

    p('Raw palette tokens hold values. Semantic tokens reference them and are what components read — override semantic tokens to re-theme, palette tokens to re-brand.'),

    table(
        ['Token', 'Purpose'],
        [
            { cells: ['<code>--pl-color-brand</code>', 'Primary action colour. The yellow.'] },
            { cells: ['<code>--pl-color-on-brand</code>', 'Text and icons drawn on top of the brand colour.'] },
            { cells: ['<code>--pl-color-surface</code>', 'Page background.'] },
            { cells: ['<code>--pl-color-surface-raised</code>', 'Cards, panels, anything above the page.'] },
            { cells: ['<code>--pl-color-surface-sunken</code>', 'Wells, inset fields, hover fills.'] },
            { cells: ['<code>--pl-color-text</code>', 'Body text.'] },
            { cells: ['<code>--pl-color-text-muted</code>', 'Secondary and supporting text.'] },
            { cells: ['<code>--pl-color-border</code>', 'Default separators and outlines.'] },
            { cells: ['<code>--pl-color-focus</code>', 'Focus ring colour.'] },
            { cells: ['<code>--pl-space-*</code>', '3xs → 3xl spacing scale, 4px base.'] },
            { cells: ['<code>--pl-text-*</code>', 'xs → 4xl type scale.'] },
            { cells: ['<code>--pl-radius-*</code>', 'sm, md, lg, full.'] },
            { cells: ['<code>--pl-duration-*</code>', 'Motion timings — zeroed under <code>prefers-reduced-motion</code>.'] },
        ],
    ),

    section('Per-component hooks'),

    p(`Components also expose their own narrower properties, named after the component. These
       take precedence over the semantic tokens, so you can restyle one component without
       touching the system:`),

    code(`
        pl-button {
            --pl-button-bg: oklch(0.20 0 0);
            --pl-button-fg: white;
            --pl-button-bg-hover: oklch(0.30 0 0);
        }
    `, 'css'),

    p('Each component page lists its own hooks under <strong>Custom properties</strong>.'),

    section('Styling internals with ::part'),

    p(`When a custom property is not enough, components expose their internal elements through
       <code>part</code>, which <code>::part()</code> can reach from outside:`),

    code(`
        pl-button::part(button) {
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }
    `, 'css'),

    callout('warn', 'Parts are an API, custom properties are a contract',
        `A <code>::part()</code> rule depends on a component's internal structure. Prefer a
         custom property when one exists — it will keep working across versions in a way a part
         selector might not.`),
);
