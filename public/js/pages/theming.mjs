// ------------------------------
// Documentation: Theming
// ------------------------------

import { page, header, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'Theming',
        lede: 'Design a system in platformdesign.app, export it, drop it in. The components already read those tokens.',
    }),

    p(`Platform Components is the sibling of <a href="https://platformdesign.app" rel="noopener">platformdesign.app</a>:
       an app for building a design system for your product. It exports your system as CSS
       custom properties (or JSON), and these components read those exact token names. So
       theming isn't a configuration step or a build: it's pasting your export onto the page.`),

    p(`This works because custom properties are the one thing that crosses a shadow boundary.
       A component's internals are encapsulated, but the tokens it reads inherit straight
       through, so a plain stylesheet re-themes every component at once, with no rebuild and
       nothing to wire up.`),

    section('Drop in an export'),

    p('An export is a flat block of custom properties on <code>:root</code>. Load it however you load any CSS:'),

    code(`
        <!-- your platformdesign.app export -->
        <link rel="stylesheet" href="/theme.css">
        <link rel="stylesheet" href="node_modules/@platformdesign/components/tokens.css">
    `, 'html'),

    p(`The package ships a default export as <code>tokens.css</code>, so components look right
       out of the box. Replace it with your own export and everything re-themes: same token
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
            { cells: ['<code>--color-*</code>', 'Colours: semantic, intent, and raw scales', '<code>--color-surface</code>, <code>--color-primary</code>, <code>--color-blue-600</code>'] },
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
        '<strong>Semantic</strong>: what components read for anything neutral: three surface levels (<code>--color-surface</code>, <code>-raised</code>, <code>-sunken</code>), <code>--color-ink</code> and <code>--color-ink-secondary</code>, <code>--color-border</code> and <code>--color-border-strong</code>.',
        '<strong>Intents</strong>: a solid fill plus its on-colour for controls (<code>--color-primary</code> / <code>--color-on-primary</code>), and a tinted ramp for badges and callouts (<code>-surface</code>, <code>-border</code>, <code>-ink</code>). Same shape for <code>success</code>, <code>warning</code>, and <code>error</code>.',
        '<strong>Raw scales</strong>: the palette underneath: <code>--color-gray-50…950</code>, <code>--color-blue-*</code>, <code>--color-green-*</code>, <code>--color-amber-*</code>, <code>--color-red-*</code>.',
    ]),

    p(`A component uses whichever layer fits. A filled control always pairs the solid fill with
       its on-colour, and every on-colour is <strong>white</strong>, in light and dark alike. That
       pairing is fixed on purpose: dark text on a saturated fill is the usual way a button breaks
       when a theme flips.`),

    code(`
        button {
            background: var(--color-primary);
            color:      var(--color-on-primary);   … always white
        }
    `, 'css'),

    section('Hover and active are derived, not picked'),

    p(`A theme sets one colour per intent. The interaction states are mixed from it:`),

    code(`
        --color-primary-hover:  color-mix(in oklab, var(--color-primary) 88%, var(--color-state-mix));
        --color-primary-active: color-mix(in oklab, var(--color-primary) 78%, var(--color-state-mix));
    `, 'css'),

    p(`So retheming is one line. Change <code>--color-primary</code> and its hover and press states
       follow, instead of leaving you to pick three harmonious blues and keep them in step forever.
       The same holds for <code>success</code>, <code>warning</code> and <code>error</code>.`),

    callout('note', 'Components derive from their OWN fill, which is what makes this work per instance',
        `<code>pl-button</code> does not read <code>--color-primary-hover</code>. It mixes its
         states from whatever <code>--button-background</code> actually resolves to. That is the
         difference between theming a token and theming one button: set
         <code>--button-background: hotpink</code> on a single instance and its hover and press
         come out hotpink too, with nothing else to set. Before this, that instance kept the
         default blue hover, and the fix was to name a second colour by hand.`),

    code(`
        /* one line, and every state of this button follows */
        .checkout pl-button { --button-background: #7C3AED; }
    `, 'css'),

    section('Which way a state moves'),

    p(`<code>--color-state-mix</code> is what the fill is mixed toward, and it defaults to black:
       states <strong>darken</strong>, in both light and dark themes.`),

    p(`Lightening on a dark page is the more common convention, and it was measured and rejected
       here. Because every on-colour in this system is white, lightening the fill takes the label
       with it: white on the primary fill drops from 5.17:1 to 4.18:1 hovered and 3.53:1 pressed,
       under the 4.5:1 that every solid fill is supposed to carry. A label has to stay readable in
       the state the pointer is sitting on.`),

    p(`The cost is the other direction: on a dark page a darkened fill loses contrast against the
       background, about 3.7:1 at rest and 2.8:1 hovered. That is the half of the trade worth
       paying. Fill-against-page contrast is there so a control can be <em>found</em>, and the
       resting state still clears 3:1; a hovered control has already been found, by the pointer
       that is on it.`),

    p(`If your palette puts <strong>dark text on light fills</strong>, the constraint inverts, and
       so should the mix:`),

    code(`
        :root {
            --color-state-mix: #FFFFFF;        … states lighten instead
            --color-state-hover-amount: 12%;
            --color-state-active-amount: 22%;
        }
    `, 'css'),

    p(`The transparent variants already do exactly this. <code>secondary</code> and
       <code>ghost</code> have no fill and their label is the page ink, so there is no white-on-fill
       contrast to protect. They mix toward <code>--color-ink</code> instead, which flips with the
       theme: the tint darkens on paper and lightens in the dark, which is what a ghost button
       wants on either.`),

    p(`The transparent variants are also the answer to the obvious question, which is why the mix
       direction is not simply <code>light-dark(#000, #fff)</code>. It could be: that does work
       inside <code>color-mix</code>, and it is the right override if your themes live in one file
       and switch on <code>color-scheme</code>.`),

    code(`
        :root {
            color-scheme: light dark;
            --color-state-mix: light-dark(#000000, #FFFFFF);
        }
    `, 'css'),

    p(`It is not the default for two reasons. It only answers to <code>color-scheme</code>, so it
       does nothing for a theme switched by a class or a <code>data-theme</code> attribute, which
       is how most sites with a manual toggle work, this one included. And it assumes flipping is
       what you want, which is exactly what the contrast numbers above say it is not, for a white
       label on a solid fill.`),

    p(`Where flipping <em>is</em> right, <code>--color-ink</code> already does it, without needing
       <code>light-dark()</code> and without caring how the theme was switched: it is a token, so
       it is whatever the loaded palette says it is. That is what the transparent variants use, and
       it works under a media query, a class, an attribute, or a separate stylesheet
       equally.`),

    callout('note', 'The thing dark mode actually has to get right is the ink',
        `A blue button is blue in either theme, give or take a shade. What genuinely changes is the
         reading direction: dark text on light, or light text on dark. That is why the semantic
         tokens are the ones a dark theme re-points, the raw scales stay fixed, and every
         intent's on-colour stays white in both. Get <code>--color-ink</code>, the three surfaces
         and the on-colours right and a dark theme is mostly done; the interaction states are a
         detail underneath that decision, not a second one.`),

    section('Overriding: three levels'),

    p('Because tokens are just custom properties, the cascade gives you three scopes, narrowest winning:'),

    code(`
        … 1. Global: swap the whole system (this is your export)
        :root { --color-primary: #7C3AED; }

        … 2. Scoped: re-theme one region of the page
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
            { cells: ['<strong>Inheritance</strong>', 'The alias resolves lazily, so whatever <code>--color-primary</code> computes to on the page is what components use. Load your export and every component follows: load order does not matter.'] },
            { cells: ['<strong>Insulation</strong>', 'The alias is also a seam. An app that wants its own <code>--color-primary</code> for its own layout: distinct from the primary its components render with: pins the alias instead.'] },
        ],
    ),

    code(`
        :root {
            --color-primary: rebeccapurple;   … your application's own chrome
            --pl-color-primary: #2563EB;      … what the components render with
        }
    `, 'css'),

    p(`Without that seam the two would be the same declaration, and an application could never let
       its brand and its components diverge, not even temporarily, while a design system is still
       converging on one palette.`),

    callout('warn', 'Keep tokens.css loaded',
        `It <em>is</em> the bridge. Components fall back to their own built-in defaults when a
         <code>--pl-*</code> alias is missing, so an export loaded on its own, without
         <code>tokens.css</code> alongside it: would be silently ignored.`),

    section('Light and dark'),

    p(`A theme is a <strong>single palette</strong>. One flat set of values. There is no
       <code>light-dark()</code> baked into the tokens, so a component never has to resolve a
       scheme. "Dark mode" is simply a different export, swapped in:`),

    code(`
        … light.css. One export
        :root { --color-surface: #FFFFFF; --color-ink: #111827; }

        … dark.css: a different export, same names
        :root { --color-surface: #0F1115; --color-ink: #E9EBEF; }
    `, 'css'),

    callout('note', 'The toggle in this header does exactly that',
        `It sets <code>data-theme="dark"</code> on <code>&lt;html&gt;</code>, which re-points
         the semantic <code>--color-*</code> tokens at dark values. The components re-theme
         instantly because they read those names, no per-component dark styling exists. That is
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
         or a <code>--&lt;component&gt;-*</code> hook when one exists. Those are the stable
         surface, and they're what a platformdesign.app export drives.`),
);
