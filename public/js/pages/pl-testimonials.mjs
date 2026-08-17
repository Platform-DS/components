// ------------------------------
// Documentation: pl-testimonials
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-testimonials',
        title: 'Testimonials',
        lede: 'Trust, in someone else\'s words: built on real blockquote markup.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>SectionElement</code>',
        'Guide': '<a href="/documentation/sections">Content sections</a>',
        'Import': '<code>@platformdesign/components/pl-testimonials</code>',
    }),

    p(`Step 6 of the landing-page formula. A quote carries more weight than any claim you make about
       yourself, so this section is deliberately built on the elements HTML already has for it:
       <code>&lt;blockquote&gt;</code> for the quote, <code>&lt;cite&gt;</code> for who said it, and
       a <code>&lt;footer&gt;</code> for the attribution. Correct semantics <em>and</em> the entire
       styling hook, no classes to memorise.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-testimonials';`, 'js'),

    demo(`
        <pl-testimonials>
            <h2>What teams say</h2>
            <ul>
                <li>
                    <blockquote>
                        <p data-rating aria-label="Rated 5 out of 5">★★★★★</p>
                        <p>We deleted our build config and nothing broke.</p>
                        <footer>
                            <span><cite>Ana Ruiz</cite><br>Staff Engineer, Acme</span>
                        </footer>
                    </blockquote>
                </li>
                <li>
                    <blockquote>
                        <p data-rating aria-label="Rated 5 out of 5">★★★★★</p>
                        <p>Finally a library that will still run in five years.</p>
                        <footer>
                            <span><cite>Tomas Lee</cite><br>CTO, Northwind</span>
                        </footer>
                    </blockquote>
                </li>
            </ul>
        </pl-testimonials>
    `, { layout: 'bleed' }),

    callout('a11y', 'Give a star rating a text alternative',
        `"★★★★★" is announced character by character, or as nothing at all, depending on the screen
         reader. Put the rating in words with <code>aria-label="Rated 5 out of 5"</code> so the
         meaning survives: the stars stay as the visual.`),

    section('With an avatar'),

    p('Any image in the footer is sized and rounded automatically.'),

    demo(`
        <pl-testimonials data-surface="muted">
            <ul>
                <li>
                    <blockquote>
                        <p>The whole library is readable in an afternoon.</p>
                        <footer>
                            <img src="/img/logo/logo.svg" alt="">
                            <span><cite>Priya Nair</cite><br>Design Systems Lead</span>
                        </footer>
                    </blockquote>
                </li>
            </ul>
        </pl-testimonials>
    `, { layout: 'bleed' }),

    section('Markup'),

    table(
        ['Element', 'Becomes'],
        [
            { cells: ['<code>&lt;ul&gt; &gt; &lt;li&gt;</code>', 'The auto-fitting grid of quote cards.'] },
            { cells: ['<code>&lt;blockquote&gt;</code>', 'The card: padded, bordered, full height.'] },
            { cells: ['<code>&lt;p&gt;</code>', 'The quote itself.'] },
            { cells: ['<code>&lt;footer&gt;</code>', 'The attribution row, pinned to the card\'s base.'] },
            { cells: ['<code>&lt;cite&gt;</code>', 'The person\'s name, un-italicised and emphasised.'] },
            { cells: ['<code>[data-rating]</code>', 'A star row in the accent color.'] },
        ],
    ),

    callout('note', 'Cards equalise, quotes do not stretch',
        `Every card fills its grid row, and the attribution is pushed to the bottom with
         <code>align-content: space-between</code>, so a short quote and a long one still line their
         footers up.`),

    section('Attributes'),

    p('The shared <code>data-surface</code>, <code>data-align</code>, and <code>data-width</code>. See the <a href="/documentation/sections">Content sections</a> guide.'),

    section('Accessibility'),

    ul([
        'Real <code>&lt;blockquote&gt;</code>/<code>&lt;cite&gt;</code> markup, so quotes are announced as quotations and attributed correctly.',
        'Star ratings need an <code>aria-label</code> stating the rating in words.',
        'Avatars are decorative when the name is beside them. Use <code>alt=""</code>.',
        '<code>&lt;cite&gt;</code> is reset to upright; italic names are a styling default, not a requirement.',
    ]),
);
