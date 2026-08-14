// ------------------------------
// Documentation — Theming
// ------------------------------

import { page, header, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'Theming',
        lede: 'Design a system in platformdesign.app, export it, drop it in. The components already read those tokens.',
    }),

    p(`Platform Components is the sibling of <a href="https://platformdesign.app" rel="noopener">platformdesign.app</a>
       — an app for building a design system for your product. It exports your system as CSS
       custom properties (or JSON), and these components read those exact token names. So
       theming isn't a configuration step or a build: it's pasting your export onto the page.`),

    p(`This works because custom properties are the one thing that crosses a shadow boundary.
       A component's internals are encapsulated, but the tokens it reads inherit straight
       through — so a plain stylesheet re-themes every component at once, with no rebuild and
       nothing to wire up.`),

    section('Drop in an export'),

    p('An export is a flat block of custom properties on <code>:root</code>. Load it however you load any CSS:'),

    code(`
        <!-- your platformdesign.app export -->
        <link rel="stylesheet" href="/theme.css">
        <link rel="stylesheet" href="node_modules/@platformdesign/components/tokens.css">
    `, 'html'),

    p(`The package ships a default export as <code>tokens.css</code>, so components look right
       out of the box. Replace it with your own export and everything re-themes — same token
       names, different values.`),

    code(`
        :root {
            --color-primary: #2563EB;
            --color-on-primary: #FFFFFF;
            --color-surface: #FFFFFF;
            --color-ink: #111827;
            --size-16: 1rem;
            --border-radius-medium: 8px;
            … the rest of your export
        }
    `, 'css'),

    section('One prefix per type'),

    p(`That is the whole contract: a token is named for what it <em>is</em>, with no project
       namespace. The prefix tells you the type; the component reading it and the designer who
       produced it are naming the same thing.`),

    table(
        ['Prefix', 'Type', 'Examples'],
        [
            { cells: ['<code>--color-*</code>', 'Colours — semantic, intent, and raw scales', '<code>--color-surface</code>, <code>--color-primary</code>, <code>--color-blue-600</code>'] },
            { cells: ['<code>--size-*</code>', 'Spacing and dimension, one scale', '<code>--size-8</code>, <code>--size-16</code>, <code>--size-64</code>'] },
            { cells: ['<code>--font-size-*</code>', 'Type scale', '<code>--font-size-base</code>, <code>--font-size-2xl</code>'] },
            { cells: ['<code>--font-weight-*</code>', 'Weights', '<code>--font-weight-medium</code>, <code>--font-weight-bold</code>'] },
            { cells: ['<code>--font-family-*</code>', 'Families', '<code>--font-family-sans-serif</code>, <code>--font-family-monospace</code>'] },
            { cells: ['<code>--line-height-*</code>, <code>--letter-spacing-*</code>', 'Text metrics', '<code>--line-height-medium</code>'] },
            { cells: ['<code>--border-radius-*</code>, <code>--border-width-*</code>', 'Borders', '<code>--border-radius-medium</code>'] },
            { cells: ['<code>--box-shadow-*</code>, <code>--opacity-*</code>', 'Effects', '<code>--box-shadow-medium</code>'] },
        ],
    ),

    section('How colours are organised'),

    p('The colour tokens come in three layers, from most semantic to most raw:'),

    ul([
        '<strong>Semantic</strong> — what components read for anything neutral: three surface levels (<code>--color-surface</code>, <code>-raised</code>, <code>-sunken</code>), <code>--color-ink</code> and <code>--color-ink-secondary</code>, <code>--color-border</code> and <code>--color-border-strong</code>.',
        '<strong>Intents</strong> — a solid fill plus its on-colour for controls (<code>--color-primary</code> / <code>--color-on-primary</code>), and a tinted ramp for badges and callouts (<code>-surface</code>, <code>-border</code>, <code>-ink</code>). Same shape for <code>success</code>, <code>warning</code>, and <code>error</code>.',
        '<strong>Raw scales</strong> — the palette underneath: <code>--color-gray-50…950</code>, <code>--color-blue-*</code>, <code>--color-green-*</code>, <code>--color-amber-*</code>, <code>--color-red-*</code>.',
    ]),

    p(`A component uses whichever layer fits. A filled control always pairs the solid fill with
       its on-colour, and every on-colour is <strong>white</strong> — in light and dark alike. That
       pairing is fixed on purpose: dark text on a saturated fill is the usual way a button breaks
       when a theme flips.`),

    code(`
        button {
            background: var(--color-primary);
            color:      var(--color-on-primary);   … always white
        }
    `, 'css'),

    section('Overriding — three levels'),

    p('Because tokens are just custom properties, the cascade gives you three scopes, narrowest winning:'),

    code(`
        … 1. Global — swap the whole system (this is your export)
        :root { --color-primary: #7C3AED; }

        … 2. Scoped — re-theme one region of the page
        .checkout { --color-primary: #047857; }
    `, 'css'),

    demo(`
        <pl-button>Default</pl-button>
        <span style="--color-primary: #047857">
            <pl-button>Scoped export</pl-button>
        </span>
    `),

    section('Per-component hooks'),

    p(`For a one-off that shouldn't move the system, each component also exposes its own
       <code>--&lt;component&gt;-*</code> hooks. These sit in front of the tokens, so overriding
       one restyles a single instance without touching your export:`),

    code(`
        <pl-button style="--button-background: #111; --button-color: #fff">
            One-off
        </pl-button>
    `, 'html'),

    demo(`
        <pl-button>Themed by tokens</pl-button>
        <pl-button style="--button-background: #111; --button-color: #fff">
            Instance override
        </pl-button>
    `),

    p('Each component page lists its own hooks under <strong>Custom properties</strong>.'),

    section('Keeping your tokens and the components\' tokens apart'),

    p(`Components never read the contract names directly. They read a parallel set of
       <code>--pl-*</code> aliases, and <code>tokens.css</code> points each alias at its contract
       counterpart:`),

    code(`
        :root {
            --color-primary: #2563EB;                    … the contract
            --pl-color-primary: var(--color-primary);    … what components read
        }
    `, 'css'),

    p(`That single level of indirection buys two things that would otherwise be in conflict.`),

    table(
        ['', 'How'],
        [
            { cells: ['<strong>Inheritance</strong>', 'The alias resolves lazily, so whatever <code>--color-primary</code> computes to on the page is what components use. Load your export and every component follows — load order does not matter.'] },
            { cells: ['<strong>Insulation</strong>', 'The alias is also a seam. An app that wants its own <code>--color-primary</code> for its own layout — distinct from the primary its components render with — pins the alias instead.'] },
        ],
    ),

    code(`
        :root {
            --color-primary: rebeccapurple;   … your application's own chrome
            --pl-color-primary: #2563EB;      … what the components render with
        }
    `, 'css'),

    p(`Without that seam the two would be the same declaration, and an application could never let
       its brand and its components diverge — not even temporarily, while a design system is still
       converging on one palette.`),

    callout('warn', 'Keep tokens.css loaded',
        `It <em>is</em> the bridge. Components fall back to their own built-in defaults when a
         <code>--pl-*</code> alias is missing, so an export loaded on its own — without
         <code>tokens.css</code> alongside it — would be silently ignored.`),

    section('Light and dark'),

    p(`A theme is a <strong>single palette</strong> — one flat set of values. There is no
       <code>light-dark()</code> baked into the tokens, so a component never has to resolve a
       scheme. "Dark mode" is simply a different export, swapped in:`),

    code(`
        … light.css — one export
        :root { --color-surface: #FFFFFF; --color-ink: #111827; }

        … dark.css — a different export, same names
        :root { --color-surface: #0F1115; --color-ink: #E9EBEF; }
    `, 'css'),

    callout('note', 'The toggle in this header does exactly that',
        `It sets <code>data-theme="dark"</code> on <code>&lt;html&gt;</code>, which re-points
         the semantic <code>--color-*</code> tokens at dark values. The components re-theme
         instantly because they read those names — no per-component dark styling exists. That is
         the whole mechanism, and it's the workflow you'd use to ship two exports of your own.`),

    section('Styling internals with ::part'),

    p(`When a token or a hook isn't enough, components expose internal elements through
       <code>part</code>, reachable with <code>::part()</code> from outside the shadow root:`),

    code(`
        pl-button::part(button) {
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }
    `, 'css'),

    callout('warn', 'Parts are an API, tokens are the contract',
        `A <code>::part()</code> rule depends on a component's internal structure. Prefer a token
         or a <code>--&lt;component&gt;-*</code> hook when one exists — those are the stable
         surface, and they're what a platformdesign.app export drives.`),
);
