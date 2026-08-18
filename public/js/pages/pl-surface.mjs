// ------------------------------
// Documentation: pl-surface
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-surface',
        title: 'Surface',
        lede: 'A background, a border, a radius, a shadow. Nothing else.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Generates': 'Nothing; it is a frame',
        'Import': '<code>@platformdesign/components/pl-surface</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-surface';`, 'js'),

    demo(`
        <pl-surface style="max-inline-size:22rem">
            <h3 style="margin:0 0 .5rem">Weekly summary</h3>
            <p style="margin:0;color:var(--color-ink-secondary)">Everything is fine. Nothing needs
               your attention, which is the best kind of summary.</p>
        </pl-surface>
    `, { layout: 'stack' }),

    p(`It exists because that combination gets written by hand on nearly every page, and slightly
       differently each time: a border that does not match the cards next to it, a shadow invented
       on the spot, a radius one step off the scale. One tag makes those consistent by default.`),

    section('Everything is a custom property'),

    p(`All six values are <code>--surface-*</code> hooks sitting in front of tokens, so the
       component is its own theming API. Change one and the frame becomes something else entirely:`),

    demo(`
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:1rem;inline-size:100%">
            <pl-surface>Default</pl-surface>

            <pl-surface style="--surface-shadow:none;--surface-background:var(--color-surface-sunken)">
                A well
            </pl-surface>

            <pl-surface style="--surface-shadow:none;--surface-background:transparent">
                An outline
            </pl-surface>

            <pl-surface style="--surface-border-width:0;--surface-shadow:0 8px 24px rgb(0 0 0 / .12)">
                Raised
            </pl-surface>

            <pl-surface style="--surface-radius:var(--border-radius-full);--surface-padding:var(--size-24)">
                A pill
            </pl-surface>

            <pl-surface style="--surface-background:var(--color-primary-surface);--surface-border-color:var(--color-primary-border)">
                An intent
            </pl-surface>
        </div>
    `, { layout: 'stack' }),

    section('Custom properties'),

    table(
        ['Property', 'Default', 'Description'],
        [
            { cells: ['<code>--surface-background</code>', '<code>--pl-color-surface</code>', 'The fill.'] },
            { cells: ['<code>--surface-border-color</code>', '<code>--pl-color-border</code>', 'The border color.'] },
            { cells: ['<code>--surface-border-width</code>', '<code>--pl-border-width-small</code>', 'Set to <code>0</code> for a borderless surface.'] },
            { cells: ['<code>--surface-radius</code>', '<code>--pl-border-radius-large</code>', 'Corner rounding.'] },
            { cells: ['<code>--surface-padding</code>', '<code>--pl-size-16</code>', 'Space inside the frame.'] },
            { cells: ['<code>--surface-shadow</code>', '<code>--pl-box-shadow-surface</code>', 'Any <code>box-shadow</code> value, or <code>none</code>. Retheming <code>--pl-box-shadow-surface</code> moves every surface at once; set this instance hook to diverge from that.'] },
        ],
    ),

    p(`Set them on one instance with <code>style</code>, or on every instance at once from your own
       stylesheet, which is usually what you want:`),

    code(`
        pl-surface {
            --surface-radius: var(--border-radius-medium);
            --surface-shadow: none;
        }
    `, 'css'),

    section('Light DOM, and no markup of its own'),

    callout('note', 'Why a generic container must not have a shadow root',
        `A surface frames content that belongs to the page. A shadow root would cut that content
         off from the page's own cascade, which is exactly wrong here: a heading inside a surface
         should be styled by the same rule that styles every other heading on the site. So there is
         no template and no slot. Your children stay where you wrote them and the component
         contributes one stylesheet.`),

    p(`The only thing it does to your content is strip the outer margins, so a slotted
       <code>&lt;p&gt;</code> or <code>&lt;h3&gt;</code> arriving with a browser margin does not sit
       off-center inside the padding. Rhythm between children stays yours.`),

    section('Not a card'),

    p(`<a href="/documentation/pl-product-card">pl-product-card</a> and
       <a href="/documentation/pl-profile-card">pl-profile-card</a> know what goes inside them and
       lay it out: a media band, a title, a price, an avatar riding onto a cover. This knows nothing
       and lays out nothing. Reach for a card when the content has a shape the component should
       understand, and for a surface when you just want the frame.`),

    section('Next'),

    ul([
        '<a href="/documentation/pl-product-card">pl-product-card</a>: a surface that knows it holds a product.',
        '<a href="/documentation/pl-profile-card">pl-profile-card</a>: a surface that knows it holds a person.',
        '<a href="/documentation/theming">Theming</a>: how the tokens behind these defaults fit together.',
    ]),
);
