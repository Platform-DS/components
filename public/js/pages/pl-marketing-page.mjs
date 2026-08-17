// ------------------------------
// Documentation: pl-marketing-page
// ------------------------------
// The demo below is the whole landing-page formula in one piece, because that
// is what this page is for: a consuming application should be able to copy it
// out, replace the copy, and have a working page rather than assemble nine
// sections from nine separate examples.

import { page, header, meta, section, p, ul, code, callout, pageDemo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-marketing-page',
        title: 'Marketing Page',
        lede: 'Full-bleed sections stacked edge to edge: the shell the content sections were built for.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Import': '<code>@platformdesign/components/pl-marketing-page</code>',
    }),

    callout('note', 'A page shell is deliberately thin',
        `It owns the vertical rhythm between sections and the measure of the content column, and
         nothing else. The sections inside it are where the page actually lives, so if one of
         these ever grows logic, that is a sign the logic belonged in a section.`),

    section('The formula'),

    p(`The content sections were not designed as a loose kit. They are the nine steps of a landing
       page, in order, and each section file names the step it is. Fill them in from the top and
       the page argues in the sequence a visitor reads it in.`),

    table(
        ['Step', 'Component', 'The job'],
        [
            { cells: ['1', '<a href="/documentation/pl-header">pl-header</a>', 'Simple and sticky. The brand and <strong>one</strong> call to action: every extra link is another way to leave before converting.'] },
            { cells: ['2', '<a href="/documentation/pl-hero">pl-hero</a>', 'The value proposition and main offer. Why would they choose you? One call to action, one strong supporting image.'] },
            { cells: ['3', '<a href="/documentation/pl-social-proof">pl-social-proof</a>', 'Proof you can deliver what you just said. Ratings, customer logos, or headline numbers.'] },
            { cells: ['4', '<a href="/documentation/pl-benefits">pl-benefits</a>', 'How their life gets better. Their end result, not your feature list.'] },
            { cells: ['5', '<a href="/documentation/pl-features">pl-features</a>', 'The product itself. Screenshots, specifics, what makes you different: the bragging section.'] },
            { cells: ['6', '<a href="/documentation/pl-testimonials">pl-testimonials</a>', 'Trust in someone else\'s words. Quotes, ratings, or a full customer story.'] },
            { cells: ['7', '<a href="/documentation/pl-faqs">pl-faqs</a>', 'Objection handling. Time, money and trust, phrased as questions and answered honestly.'] },
            { cells: ['8', '<a href="/documentation/pl-cta">pl-cta</a>', 'The last chance to convert. Usually the header\'s call to action repeated, or a short contact form.'] },
            { cells: ['9', '<a href="/documentation/pl-footer">pl-footer</a>', 'Simple. Drop the links that have nothing to do with the offer, and include a real way to reach you.'] },
        ],
    ),

    p(`None of the nine is required and the order is a default rather than a rule. Drop the steps
       that do not apply and the rest still stack correctly, because every band owns its own
       spacing instead of relying on the shell to space it.`),

    section('The complete template'),

    p(`All nine steps, filled in. The copy is placeholder and the product is invented, but the
       markup is not: this is the whole structure, and replacing the words in it gives you a
       working landing page.`),

    pageDemo(`
        <pl-marketing-page>

            <!-- 1. Header: brand, minimal nav, one call to action -->
            <pl-header>
                <a href="#top"><pl-icon icon="cube" size="1.5rem"></pl-icon> Northwind</a>
                <nav aria-label="Main">
                    <ul>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#faqs">FAQs</a></li>
                    </ul>
                </nav>
                <div data-actions>
                    <pl-button-link href="#start" data-size="sm">Start free</pl-button-link>
                </div>
            </pl-header>

            <!-- 2. Hero: the value proposition and the main offer -->
            <pl-hero data-layout="split">
                <p data-eyebrow>Inventory, minus the spreadsheet</p>
                <h1>Know what you have, before a customer asks.</h1>
                <p>Northwind keeps stock counts right across every channel you sell on, so you
                   stop overselling things you ran out of on Tuesday.</p>
                <div data-actions>
                    <pl-button-link href="#start" data-size="lg">Start free for 30 days</pl-button-link>
                    <pl-button-link href="#features" data-variant="secondary" data-size="lg">See how it works</pl-button-link>
                </div>
                <p><small>No card required. Two minutes to connect your first store.</small></p>
                <figure>
                    <svg viewBox="0 0 640 420" role="img" aria-label="The Northwind stock dashboard">
                        <rect width="640" height="420" rx="14" fill="var(--pl-color-surface-sunken, #F3F4F6)"/>
                        <rect x="28" y="28" width="180" height="20" rx="6" fill="var(--pl-color-primary, #2563EB)"/>
                        <rect x="28" y="76" width="584" height="88" rx="10" fill="var(--pl-color-surface, #FFF)"/>
                        <rect x="28" y="184" width="280" height="200" rx="10" fill="var(--pl-color-surface, #FFF)"/>
                        <rect x="332" y="184" width="280" height="200" rx="10" fill="var(--pl-color-surface, #FFF)"/>
                        <rect x="52" y="212" width="140" height="14" rx="5" fill="var(--pl-color-border, #E5E7EB)"/>
                        <rect x="52" y="242" width="200" height="14" rx="5" fill="var(--pl-color-border, #E5E7EB)"/>
                        <rect x="356" y="212" width="160" height="14" rx="5" fill="var(--pl-color-border, #E5E7EB)"/>
                        <rect x="356" y="242" width="120" height="14" rx="5" fill="var(--pl-color-border, #E5E7EB)"/>
                    </svg>
                </figure>
            </pl-hero>

            <!-- 3. Social proof: ratings, logos, and numbers, as real text -->
            <pl-social-proof data-surface="muted">
                <p>Keeping stock straight for independent retailers since 2019</p>
                <ul>
                    <li><strong>4.8 out of 5</strong> across 900 reviews</li>
                    <li><strong>12,400</strong> stores connected</li>
                    <li><strong>99.98%</strong> sync uptime</li>
                    <li><strong>2 min</strong> to first sync</li>
                </ul>
            </pl-social-proof>

            <!-- 4. Benefits: the visitor's end result, not your feature list -->
            <pl-benefits>
                <h2>Four things you stop worrying about</h2>
                <p>The point is not the software. The point is the Monday morning you no longer spend
                   reconciling three stock counts by hand.</p>
                <ul>
                    <li>
                        <pl-icon icon="check"></pl-icon>
                        <h3>No more overselling</h3>
                        <p>Counts update everywhere within seconds of a sale, so you stop apologising
                           for an order you cannot fill.</p>
                    </li>
                    <li>
                        <pl-icon icon="refresh"></pl-icon>
                        <h3>Mondays back</h3>
                        <p>The reconciliation you do by hand every week stops being a task that
                           exists.</p>
                    </li>
                    <li>
                        <pl-icon icon="storefront"></pl-icon>
                        <h3>Room to add a channel</h3>
                        <p>Selling somewhere new stops meaning another spreadsheet tab and another
                           thing to forget.</p>
                    </li>
                    <li>
                        <pl-icon icon="lock"></pl-icon>
                        <h3>An audit you can answer</h3>
                        <p>Every movement is written down, so where a unit went is a question with
                           an answer.</p>
                    </li>
                </ul>
            </pl-benefits>

            <!-- 5. Features: the product itself. The bragging section -->
            <pl-features id="features" data-surface="muted">
                <h2>What you actually get</h2>
                <article>
                    <div>
                        <p data-eyebrow>Live counts</p>
                        <h3>One number, everywhere you sell</h3>
                        <p>Connect a channel and its stock becomes the same stock as everywhere else.
                           A sale on one is a decrement on all of them, in the same second.</p>
                        <ul>
                            <li>Nine channels supported out of the box</li>
                            <li>Bundles and variants counted correctly</li>
                            <li>Conflicts flagged rather than guessed at</li>
                        </ul>
                    </div>
                    <figure>
                        <svg viewBox="0 0 560 340" role="img" aria-label="Stock levels across four sales channels">
                            <rect width="560" height="340" rx="12" fill="var(--pl-color-surface, #FFF)"/>
                            <rect x="32" y="36" width="140" height="16" rx="6" fill="var(--pl-color-ink-secondary, #6B7280)"/>
                            <rect x="32" y="88" width="496" height="52" rx="8" fill="var(--pl-color-surface-sunken, #F3F4F6)"/>
                            <rect x="32" y="156" width="496" height="52" rx="8" fill="var(--pl-color-surface-sunken, #F3F4F6)"/>
                            <rect x="32" y="224" width="496" height="52" rx="8" fill="var(--pl-color-surface-sunken, #F3F4F6)"/>
                            <rect x="452" y="104" width="56" height="20" rx="10" fill="var(--pl-color-success, #16A34A)"/>
                            <rect x="452" y="172" width="56" height="20" rx="10" fill="var(--pl-color-success, #16A34A)"/>
                            <rect x="452" y="240" width="56" height="20" rx="10" fill="var(--pl-color-warning, #D97706)"/>
                        </svg>
                    </figure>
                </article>
                <article>
                    <div>
                        <p data-eyebrow>Forecasting</p>
                        <h3>Reorder before you run out, not after</h3>
                        <p>Northwind reads your sell-through rate and tells you what to reorder this
                           week, with the lead time of each supplier already accounted for.</p>
                    </div>
                    <figure>
                        <svg viewBox="0 0 560 340" role="img" aria-label="A projected stock level falling toward a reorder point">
                            <rect width="560" height="340" rx="12" fill="var(--pl-color-surface, #FFF)"/>
                            <path d="M40 96 L160 148 L280 132 L400 216 L520 268" fill="none"
                                  stroke="var(--pl-color-primary, #2563EB)" stroke-width="6" stroke-linecap="round"/>
                            <path d="M40 252 L520 252" fill="none" stroke="var(--pl-color-error, #DC2626)"
                                  stroke-width="3" stroke-dasharray="10 10"/>
                            <rect x="32" y="284" width="180" height="14" rx="5" fill="var(--pl-color-border, #E5E7EB)"/>
                        </svg>
                    </figure>
                </article>
            </pl-features>

            <!-- 6. Testimonials: trust, in someone else's words -->
            <pl-testimonials>
                <h2>What shop owners say</h2>
                <ul>
                    <li>
                        <blockquote>
                            <p data-rating aria-label="5 out of 5">★★★★★</p>
                            <p>We oversold constantly at the weekend and I had stopped noticing how
                               much time I spent apologising for it. That stopped in the first month.</p>
                            <footer>
                                <pl-avatar initials="RO" alt="Robin Okafor"></pl-avatar>
                                <span><cite>Robin Okafor</cite><br>Owner, Fieldnote Supply</span>
                            </footer>
                        </blockquote>
                    </li>
                    <li>
                        <blockquote>
                            <p data-rating aria-label="5 out of 5">★★★★★</p>
                            <p>The reorder list is the part I did not expect to care about. It is
                               right often enough that I have stopped second-guessing it.</p>
                            <footer>
                                <pl-avatar initials="JL" alt="Jules Lambert"></pl-avatar>
                                <span><cite>Jules Lambert</cite><br>Buyer, Corner Provisions</span>
                            </footer>
                        </blockquote>
                    </li>
                    <li>
                        <blockquote>
                            <p data-rating aria-label="4 out of 5">★★★★☆</p>
                            <p>Setup took an afternoon rather than the week I had blocked out. The
                               fourth channel was the only fiddly one.</p>
                            <footer>
                                <pl-avatar initials="SM" alt="Sam Mehta"></pl-avatar>
                                <span><cite>Sam Mehta</cite><br>Operations, Halden Goods</span>
                            </footer>
                        </blockquote>
                    </li>
                </ul>
            </pl-testimonials>

            <!-- 7. FAQs: the objections, answered before they leave to ask -->
            <pl-faqs id="faqs" data-surface="muted" data-exclusive>
                <h2>Questions worth asking first</h2>
                <details open>
                    <summary>How long does setup actually take?</summary>
                    <p>About two minutes for the first channel, because it is an OAuth screen and a
                       confirmation. Most shops have everything connected inside an afternoon.</p>
                </details>
                <details>
                    <summary>What happens to my existing stock counts?</summary>
                    <p>Nothing, until you say so. Northwind imports them, shows you where your
                       channels disagree, and waits for you to pick the number that is right.</p>
                </details>
                <details>
                    <summary>What does it cost after the trial?</summary>
                    <p>29 a month for up to three channels, 79 for unlimited. No setup fee, and no
                       charge per order.</p>
                </details>
                <details>
                    <summary>Can I get my data out again?</summary>
                    <p>Yes, as CSV or through the API, at any time, including after you cancel. It
                       is your stock history.</p>
                </details>
                <details>
                    <summary>What if it breaks during a sale?</summary>
                    <p>Sales keep going. If a sync fails, the channel keeps its last known count and
                       we retry, so the worst case is a stale number rather than a stopped shop.</p>
                </details>
            </pl-faqs>

            <!-- 8. The closing call to action: the header's offer, repeated -->
            <pl-cta id="start">
                <h2>Stop selling what you do not have.</h2>
                <p>Thirty days free, every feature included. Connect one channel and see whether the
                   numbers agree with you.</p>
                <div data-actions>
                    <pl-button-link href="#start" data-size="lg">Start free for 30 days</pl-button-link>
                    <pl-button-link href="#start" data-variant="secondary" data-size="lg">Talk to us first</pl-button-link>
                </div>
                <p><small>No card required. Cancel from the settings page in one click.</small></p>
            </pl-cta>

            <!-- 9. Footer: contact details, and nothing that competes with the offer -->
            <pl-footer>
                <div data-columns>
                    <div>
                        <a data-brand href="#top"><pl-icon icon="cube" size="1.5rem"></pl-icon> Northwind</a>
                        <address>
                            hello@northwind.example<br>
                            +1 555 0142<br>
                            18 Wharf Road, Portland, OR 97209
                        </address>
                    </div>
                    <nav aria-label="Product">
                        <h3>Product</h3>
                        <ul>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#start">Pricing</a></li>
                            <li><a href="#faqs">FAQs</a></li>
                        </ul>
                    </nav>
                    <nav aria-label="Company">
                        <h3>Company</h3>
                        <ul>
                            <li><a href="#top">About</a></li>
                            <li><a href="#top">Support</a></li>
                        </ul>
                    </nav>
                </div>
                <p><small>&copy; 2026 Northwind Supply Co.</small> <a href="#top">Privacy</a> <a href="#top">Terms</a></p>
            </pl-footer>

        </pl-marketing-page>
    `, { title: 'Marketing page template preview', initial: 1280 }),

    p(`Resize it. The preview is a real viewport rather than a box on this page, so the template
       answers the width you pick the way it would answer a device: the hero splits and rejoins,
       the header collapses to its toggle, the feature rows stop alternating. Expand hands it the
       whole content area when a phone-sized column is not enough to judge by.`),

    callout('note', 'One thing is missing on purpose',
        `The FAQs carry <code>data-exclusive</code> but not <code>data-schema</code>, and you <em>do</em>
         want <code>data-schema</code> on a real landing page: it emits FAQPage structured data so the
         questions can appear as rich results. It is left off here because this is a documentation
         page, and the questions above are about an invented shop. Everything else in that markup
         is exactly what you would ship.`),

    section('Adapting it'),

    ul([
        '<strong>Cut before you add.</strong> Nine bands is the long version. A page with a hero, proof, benefits and a close converts perfectly well, and every section you remove is one fewer scroll before the offer.',
        '<strong>Alternate the surfaces.</strong> The template runs default, <code>muted</code>, default, <code>muted</code> so the bands read as separate. Set <code>data-surface="ink"</code> or <code>"brand"</code> on one band for weight, but not on several: contrast stops meaning anything once everything has it.',
        '<strong>Repeat one call to action.</strong> The header, the hero and the close all say the same thing here and point at the same place. Three different offers is three decisions.',
        '<strong>Swap the SVG placeholders for real screenshots.</strong> They are inline so this example stays self-contained; a real page wants <code>&lt;img&gt;</code> or <a href="/documentation/pl-picture">pl-picture</a> with real dimensions set, so the image reserves its own space.',
        '<strong>Give each section an <code>id</code>.</strong> The nav and both calls to action are in-page links here, which is what a single-page marketing site wants.',
    ]),

    section('Composition'),

    p(`Three things this shell does, and one it deliberately does not:`),

    table(
        ['Behaviour', 'Why'],
        [
            { cells: ['No maximum width', 'Each section is a full-bleed band that caps its own inner measure. Constraining them from outside would leave a colored band floating in the middle of the page with white either side.'] },
            { cells: ['No gap between sections', 'Every band owns its vertical space through <code>--section-space</code>. A gap here would double whatever they already set.'] },
            { cells: ['Fills the viewport', 'A column at <code>min-block-size: 100dvh</code>, with the slack placed above <code>pl-footer</code>. A short page still pins its footer to the bottom rather than leaving it floating mid-screen.'] },
            { cells: ['<em>No logic</em>', 'It is a stylesheet and a tag name. Anything that needed state would belong to a section, not to the page around them.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<em>none</em>', 'By design: the sections inside carry the layout. To change the rhythm of the whole page, set <code>--section-space</code> on the shell and every band inherits it.'] },
        ],
    ),

    code(`
        <pl-marketing-page style="--section-space: 4rem">
            …
        </pl-marketing-page>
    `, 'html'),

    section('Next'),

    ul([
        '<a href="/documentation/sections">Content sections</a>: the section system, surfaces, widths and alignment.',
        '<a href="/documentation/pl-hero">pl-hero</a>: step 2, and the one worth the most attention.',
        '<a href="/documentation/loading">Loading states</a>: keeping a page this size still while its components upgrade.',
    ]),
);
