// ------------------------------
// Documentation: pl-blank-page
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, pageDemo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-blank-page',
        title: 'Blank Page',
        lede: 'The plainest shell: a header, a measured content column, a footer.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Import': '<code>@platformdesign/components/pl-blank-page</code>',
    }),

    callout('note', 'A page shell is deliberately thin',
        `It owns the vertical rhythm between sections and the measure of the content column, and
         nothing else. The sections inside it are where the page actually lives, so if one of
         these ever grows logic, that is a sign the logic belonged in a section.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-blank-page';`, 'js'),

    code(`
        <pl-blank-page>
            <pl-header>…</pl-header>
            <main>
                <h1>Settings</h1>
                <pl-form>…</pl-form>
            </main>
            <pl-footer>…</pl-footer>
        </pl-blank-page>
    `, 'html'),

    p(`The column fills the viewport height, so a short page still pins its footer to the bottom
       rather than leaving it floating mid-screen. Everything between the header and the footer
       takes the slack.`),


    section('Preview'),

    pageDemo(`
        <pl-blank-page>
            <pl-header>
                <a href="#"><pl-icon icon="cube" size="1.5rem"></pl-icon> Northwind</a>
                <nav aria-label="Main">
                    <ul>
                        <li><a href="#">Orders</a></li>
                        <li><a href="#">Stock</a></li>
                        <li><a href="#" aria-current="page">Settings</a></li>
                    </ul>
                </nav>
                <div data-actions>
                    <pl-button size="sm">New order</pl-button>
                </div>
            </pl-header>

            <main>
                <h1>Settings</h1>
                <p>Everything between the header and the footer takes the slack, so a page with
                   little on it still pins its footer to the bottom of the viewport.</p>

                <pl-form data-variant="card">
                    <pl-label text="Store name">
                        <pl-input name="store" value="Northwind Supply Co."></pl-input>
                    </pl-label>
                    <pl-label text="Contact email">
                        <pl-input type="email" name="email" value="hello@northwind.example"></pl-input>
                    </pl-label>
                    <pl-label text="Default currency">
                        <pl-select name="currency">
                            <option>USD</option>
                            <option>EUR</option>
                            <option>GBP</option>
                        </pl-select>
                    </pl-label>
                    <pl-switch checked>Email me when stock runs low</pl-switch>
                    <div data-actions data-align="end">
                        <pl-button variant="secondary" type="reset">Cancel</pl-button>
                        <pl-button type="submit">Save changes</pl-button>
                    </div>
                </pl-form>
            </main>

            <pl-footer>
                <div data-columns>
                    <div>
                        <a data-brand href="#"><pl-icon icon="cube" size="1.5rem"></pl-icon> Northwind</a>
                        <address>hello@northwind.example</address>
                    </div>
                    <nav aria-label="Support">
                        <h3>Support</h3>
                        <ul><li><a href="#">Help centre</a></li><li><a href="#">Status</a></li></ul>
                    </nav>
                </div>
                <p><small>&copy; 2026 Northwind Supply Co.</small></p>
            </pl-footer>
        </pl-blank-page>
    `, { title: 'Blank page template preview', initial: 1280 }),

    p(`Shrink the preview and the shell holds: the header collapses to its toggle, the content
       column keeps its measure, and the footer stays at the bottom because the shell is a column
       at <code>min-block-size: 100dvh</code> rather than a stack that happens to end there.`),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--page-measure</code>', 'Width of the content column. Defaults to <code>68rem</code>.'] },
            { cells: ['<code>--page-padding</code>', 'Padding around it.'] },
        ],
    ),
);
