// ------------------------------
// Documentation: pl-footer
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-footer',
        title: 'Footer',
        lede: 'Close the page: a real way to reach you, and only the links that still matter.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Import': '<code>@platformdesign/components/pl-footer</code>',
    }),

    p(`Step 9 of the landing-page formula. Drop the navigation that has nothing to do with the offer:
       a landing-page footer should close the page, not reopen the whole site, and include
       something concrete: an email address, a phone number, or a postal address.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-footer';`, 'js'),

    demo(`
        <pl-footer data-surface="ink">
            <div data-columns>
                <div>
                    <a data-brand href="#"><pl-icon icon="cube" size="1.25rem"></pl-icon> Platform</a>
                    <address>hello@platform.example</address>
                </div>
                <nav aria-label="Product">
                    <h3>Product</h3>
                    <ul>
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">Installation</a></li>
                    </ul>
                </nav>
                <nav aria-label="Company">
                    <h3>Company</h3>
                    <ul>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </nav>
            </div>
            <p><small>© 2026 Platform</small> <a href="#">Privacy</a></p>
        </pl-footer>
    `, { layout: 'bleed' }),

    callout('note', 'The last child becomes the meta row',
        `Whatever you put last: the copyright and legal links: is separated with a rule and laid
         out as a spaced row automatically. No wrapper class to remember. A footer holding only that
         row skips the rule, so a one-line footer still looks deliberate.`),

    section('Minimal'),

    p('For a landing page, this is often all a footer should be.'),

    demo(`
        <pl-footer>
            <p><small>© 2026 Platform</small> <a href="#">hello@platform.example</a></p>
        </pl-footer>
    `, { layout: 'bleed' }),

    section('Markup'),

    table(
        ['Element', 'Becomes'],
        [
            { cells: ['<code>[data-columns]</code>', 'The auto-fitting column grid.'] },
            { cells: ['<code>[data-brand]</code>', 'The brand lockup.'] },
            { cells: ['<code>&lt;nav&gt;</code>', 'A link column.'] },
            { cells: ['<code>&lt;h3&gt;</code>', 'A column heading: small, uppercase, muted.'] },
            { cells: ['<code>&lt;address&gt;</code>', 'Contact details, un-italicised.'] },
            { cells: ['Last child', 'The meta row, ruled off above.'] },
        ],
    ),

    section('Attributes'),

    table(
        ['Attribute', 'Values', 'Description'],
        [
            { cells: ['<code>data-surface</code>', '<code>ink</code>', 'A dark footer. The default is a muted tint.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--footer-bg</code>', 'Background color.'] },
            { cells: ['<code>--footer-ink</code>', 'Primary text color.'] },
            { cells: ['<code>--footer-line</code>', 'The meta row rule.'] },
            { cells: ['<code>--footer-width</code>', 'Measure of the content column.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'Use <code>&lt;address&gt;</code> for real contact details. It is what the element is for, and it is reset to upright here.',
        'Label each <code>&lt;nav&gt;</code> ("Product", "Company") so they are distinguishable from one another and from the header nav.',
        'Column headings are <code>&lt;h3&gt;</code> elements, so the outline holds even though they are styled small.',
        'Put the footer inside your page\'s <code>&lt;footer&gt;</code> landmark, or use it as one.',
    ]),
);
