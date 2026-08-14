// ------------------------------
// Documentation — pl-features
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-features',
        title: 'Features',
        lede: 'The bragging section — show the product, one alternating row at a time.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>SectionElement</code>',
        'Guide': '<a href="/documentation/sections">Content sections</a>',
        'Import': '<code>@platformdesign/components/pl-features</code>',
    }),

    p(`Step 5 of the landing-page formula. Where <a href="/documentation/pl-benefits">pl-benefits</a>
       sells the outcome, this is where you show the thing itself: screenshots, specifics, what makes
       it different. Each feature is an <code>&lt;article&gt;</code> pairing copy with media, and
       rows alternate which side the media sits on so the eye zig-zags down the page instead of
       marching along one edge.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-features';`, 'js'),

    demo(`
        <pl-features surface="muted">
            <h2>What you actually get</h2>
            <article>
                <div>
                    <p data-eyebrow>Authoring</p>
                    <h3>Declare props once</h3>
                    <p>observedAttributes derives from the declaration, so it can never drift.</p>
                    <ul>
                        <li>Typed and coerced</li>
                        <li>Reflected both ways</li>
                    </ul>
                </div>
                <figure><img src="/img/logo/platform-thumbnail.png" alt=""></figure>
            </article>
            <article>
                <div>
                    <p data-eyebrow>Theming</p>
                    <h3>Drop in an export</h3>
                    <p>Design a system, export it, paste it. The components read those tokens.</p>
                </div>
                <figure><img src="/img/logo/platform-thumbnail.png" alt=""></figure>
            </article>
        </pl-features>
    `, { layout: 'bleed' }),

    callout('note', 'The alternation is automatic',
        `Even-numbered rows move their figure ahead of the copy with <code>order</code> — a visual
         reordering only. The DOM order stays copy-then-media in every row, so a screen reader and a
         keyboard user get the same consistent sequence throughout.`),

    section('Markup'),

    p('Each feature is one <code>&lt;article&gt;</code> holding a copy <code>&lt;div&gt;</code> and a figure:'),

    code(`
        <pl-features>
            <h2>Section title</h2>
            <article>
                <div>
                    <p data-eyebrow>Category</p>
                    <h3>Feature name</h3>
                    <p>What it does.</p>
                    <ul><li>A specific</li></ul>
                </div>
                <figure><img src="…" alt=""></figure>
            </article>
        </pl-features>
    `, 'html'),

    table(
        ['Element', 'Becomes'],
        [
            { cells: ['<code>&lt;article&gt;</code>', 'One two-column row; alternates side automatically.'] },
            { cells: ['<code>&lt;div&gt;</code>', 'The copy column.'] },
            { cells: ['<code>[data-eyebrow]</code>', 'The small category label.'] },
            { cells: ['<code>&lt;figure&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;video&gt;</code>', 'The media column, rounded to match the system.'] },
            { cells: ['<code>&lt;figcaption&gt;</code>', 'A muted caption under the media.'] },
        ],
    ),

    section('Attributes'),

    p('The shared <code>surface</code>, <code>align</code>, and <code>width</code> — see the <a href="/documentation/sections">Content sections</a> guide.'),

    section('Accessibility'),

    ul([
        'Rows are <code>&lt;article&gt;</code> elements, so each feature is an addressable region.',
        'Screenshots that only repeat the adjacent copy are decorative — give them <code>alt=""</code> rather than a redundant description.',
        'Reordering is visual only; DOM order is unchanged, so reading and tab order stay consistent row to row.',
        'Below 55rem the columns stack, copy first.',
    ]),
);
