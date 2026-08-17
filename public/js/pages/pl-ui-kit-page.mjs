// ------------------------------
// Documentation: pl-ui-kit-page
// ------------------------------
// The demo is a complete kit rather than a fragment, because that is what this
// template is for: a consuming application drops it in, points it at a theme,
// and the whole system is visible on one screen.
//
// The panels follow the shape of a conventional UI kit sheet — buttons broken
// out by variant, state, and size; fields shown in their valid, success, and
// error readings; charts and cards beside the primitives they are built from.

import { page, header, meta, section, p, ul, code, callout, pageDemo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-ui-kit-page',
        title: 'UI Kit Page',
        lede: 'The whole system on one page, so a theme can be seen all at once.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Generates': 'Nothing; it packs panels into columns',
        'Import': '<code>@platformdesign/components/pl-ui-kit-page</code>',
    }),

    section('What it is for'),

    p(`A poster of the system: the palette, the type, and a specimen of every component, in
       labelled panels. Swap the tokens and every panel changes together, which is a far more
       convincing demonstration of a theme than a screenshot and a far quicker one than clicking
       through a site.`),

    callout('note', 'The stylesheet contains no literal values at all',
        `Not one color, radius, or type size. Every value is a token, because this is the page a
         theme gets judged on and a hard-coded value here would be a place the theme silently
         fails to reach. The swatches are the sharpest version of it: each chip paints a token
         directly, so the palette shown <em>is</em> the palette in force rather than a picture of
         one that can drift out of date.`),

    p(`Inside a panel, specimens are grouped and each group is named — <em>variants</em>,
       <em>states</em>, <em>sizes</em>. A row of six buttons with no labels makes the reader infer
       which difference each one is demonstrating; naming the groups is most of what separates a
       kit from a pile of components.`),

    section('The template'),

    pageDemo(`
        <pl-ui-kit-page>

            <!-- Masthead: the mark, the name once, and the sheet's genre -->
            <header data-masthead>
                <p data-brand><pl-icon icon="cube" size="1.5rem"></pl-icon></p>
                <h1>Northwind</h1>
                <p data-kicker>UI Kit</p>
                <p data-lede>Every component and token in the system, on one sheet.</p>
            </header>

            <!-- The theme itself: palette and faces, as one band -->
            <section data-panel data-span="full">
                <div data-row style="gap:2rem;align-items:flex-start">
                    <div data-group style="flex:1.5 1 22rem">
                        <p data-group-label>Colors</p>
                        <div data-swatches>
                            <div data-swatch="ink">Ink</div>
                            <div data-swatch="surface">Surface</div>
                            <div data-swatch="primary">Primary</div>
                            <div data-swatch="secondary">Secondary</div>
                            <div data-swatch="success">Success</div>
                            <div data-swatch="warning">Warning</div>
                            <div data-swatch="danger">Danger</div>
                        </div>
                    </div>
                    <div data-group style="flex:1 1 16rem">
                        <p data-group-label>Fonts</p>
                        <div data-row style="gap:1rem;align-items:stretch">
                            <div data-specimen="display">
                                <p>Display</p>
                                <p>Ag 123</p>
                            </div>
                            <div data-specimen>
                                <p>Body</p>
                                <p>Ag 123</p>
                            </div>
                            <div data-specimen="mono">
                                <p>Mono</p>
                                <p>Ag 123</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Buttons, broken out the way a kit sheet does it -->
            <section data-panel>
                <h2>Buttons</h2>

                <div data-group>
                    <p data-group-label>Variants</p>
                    <div data-row>
                        <pl-button>Primary</pl-button>
                        <pl-button data-variant="secondary">Secondary</pl-button>
                        <pl-button data-variant="ghost">Ghost</pl-button>
                    </div>
                </div>

                <div data-group>
                    <p data-group-label>States</p>
                    <div data-row>
                        <pl-button data-variant="danger">Danger</pl-button>
                        <pl-button data-variant="success">Success</pl-button>
                        <pl-button disabled>Disabled</pl-button>
                        <pl-button data-loading>Loading</pl-button>
                    </div>
                </div>

                <div data-group>
                    <p data-group-label>Sizes</p>
                    <div data-row>
                        <pl-button data-size="sm">Small</pl-button>
                        <pl-button>Medium</pl-button>
                        <pl-button data-size="lg">Large</pl-button>
                    </div>
                </div>

                <div data-group>
                    <p data-group-label>Circular</p>
                    <div data-row>
                        <pl-button data-shape="circle" title="Add"><pl-icon icon="plus"></pl-icon></pl-button>
                        <pl-button data-shape="circle" data-variant="secondary" title="Edit"><pl-icon icon="pencil"></pl-icon></pl-button>
                        <pl-button data-shape="circle" data-variant="ghost" title="Favorite"><pl-icon icon="star"></pl-icon></pl-button>
                        <pl-button data-shape="circle" data-variant="danger" data-size="sm" title="Delete"><pl-icon icon="trash"></pl-icon></pl-button>
                    </div>
                </div>

                <div data-group>
                    <p data-group-label>Icon &amp; link</p>
                    <div data-row>
                        <pl-button><pl-icon icon="save"></pl-icon> Download</pl-button>
                        <pl-button-link href="#">Text link</pl-button-link>
                    </div>
                </div>
            </section>

            <!-- Surfaces and cards, from the library's own surfaces group -->
            <section data-panel>
                <h2>Surfaces &amp; Cards</h2>
                <pl-surface>
                    <div data-stat>
                        <span>Revenue</span>
                        <span data-figure>$48.2k</span>
                        <span data-delta>▲ 12.4%</span>
                    </div>
                </pl-surface>
                <pl-profile-card data-align="center">
                    <pl-avatar data-avatar initials="AL" alt="Ada Lindqvist"></pl-avatar>
                    <h3 data-name>Ada Lindqvist</h3>
                    <p data-role>Design lead</p>
                    <div data-actions>
                        <pl-button data-size="sm">Follow</pl-button>
                        <pl-button data-size="sm" data-variant="secondary">Message</pl-button>
                    </div>
                </pl-profile-card>
                <pl-product-card>
                    <p data-eyebrow>Outerwear</p>
                    <h3 data-title>Field Jacket</h3>
                    <pl-ratings value="4" readonly></pl-ratings>
                    <p data-price>$148 <s>$195</s></p>
                    <div data-actions>
                        <pl-button data-full data-size="sm"><pl-icon icon="shopping-bag"></pl-icon> Add to bag</pl-button>
                    </div>
                </pl-product-card>
            </section>

            <!-- Fields, in all three readings -->
            <section data-panel>
                <h2>Inputs</h2>
                <div data-stack>
                    <pl-label text="Email input">
                        <pl-input type="email" placeholder="you@example.com"></pl-input>
                    </pl-label>
                    <pl-label text="Input success" success="Verified successfully">
                        <pl-input value="ada@example.com"></pl-input>
                    </pl-label>
                    <pl-label text="Input error" error="Enter a valid email address">
                        <pl-input value="not-an-email"></pl-input>
                    </pl-label>
                    <pl-label text="Select">
                        <pl-select><option>Option one</option><option>Option two</option></pl-select>
                    </pl-label>
                    <pl-label text="Textarea">
                        <pl-textarea rows="2" placeholder="Write a message…"></pl-textarea>
                    </pl-label>
                </div>
            </section>

            <!-- pl-feedback, across its whole range -->
            <section data-panel>
                <h2>Feedback</h2>
                <div data-stack>
                    <pl-feedback data-intent="success">
                        <p data-title>Saved</p>
                        <p>Your changes are live.</p>
                    </pl-feedback>
                    <pl-feedback data-intent="warning">Your trial ends in 3 days.</pl-feedback>
                    <pl-feedback data-intent="error" data-dismissable>Payment failed. Update your card.</pl-feedback>
                    <pl-feedback>A neutral status line, no intent.</pl-feedback>
                </div>
            </section>

            <!-- Selection controls -->
            <section data-panel>
                <h2>Switches &amp; Checkboxes</h2>
                <div data-stack>
                    <pl-switch checked>Notifications</pl-switch>
                    <pl-switch>Auto-save</pl-switch>
                    <pl-checkbox checked>Checked</pl-checkbox>
                    <pl-checkbox>Unchecked</pl-checkbox>
                    <pl-radio name="k-plan" value="on" checked>Radio on</pl-radio>
                    <pl-radio name="k-plan" value="off">Radio off</pl-radio>
                </div>
            </section>

            <!-- Badges and tags -->
            <section data-panel>
                <h2>Badges &amp; Tags</h2>
                <div data-group>
                    <p data-group-label>Badges</p>
                    <div data-row>
                        <pl-badge data-standalone data-intent="primary" content="New"></pl-badge>
                        <pl-badge data-standalone data-intent="success" content="Active"></pl-badge>
                        <pl-badge data-standalone data-intent="warning" content="Pending"></pl-badge>
                        <pl-badge data-standalone data-intent="error" content="Error"></pl-badge>
                    </div>
                </div>
                <div data-group>
                    <p data-group-label>Tags</p>
                    <div data-row>
                        <pl-chip>Design</pl-chip>
                        <pl-chip>Engineering</pl-chip>
                        <pl-chip>Research</pl-chip>
                    </div>
                </div>
            </section>

            <!-- Progress, meter, loading — each with its reading -->
            <section data-panel>
                <h2>Progress, Meter &amp; Loading</h2>
                <div data-stack>
                    <!-- pl-progress's label is an aria-label only, so a visible
                         caption is the kit's job here. pl-meter below renders
                         its own header and needs no such help. -->
                    <div data-group>
                        <div data-metric><span>Progress — uploading</span><span>64%</span></div>
                        <pl-progress value="64" max="100" label="Uploading"></pl-progress>
                    </div>
                    <pl-meter value="7.2" max="10" label="Storage used">
                        <span slot="value">7.2 / 10 GB</span>
                    </pl-meter>
                    <div data-group>
                        <div data-metric><span>Range — volume</span><span>70</span></div>
                        <pl-range value="70"></pl-range>
                    </div>
                    <div data-row>
                        <pl-loading></pl-loading>
                        <span data-caption>Loading</span>
                    </div>
                    <pl-skeleton lines="2"></pl-skeleton>
                </div>
            </section>

            <!-- Charts -->
            <section data-panel>
                <h2>Charts</h2>
                <div data-row style="gap:1.5rem;align-items:flex-start">
                    <pl-doughnut-chart style="--chart-size:7rem">
                        <span slot="center">46%</span>
                        <span slot="center-label">direct</span>
                        <ul>
                            <li data-value="46">Direct</li>
                            <li data-value="28">Referral</li>
                            <li data-value="26">Organic</li>
                        </ul>
                    </pl-doughnut-chart>
                    <pl-pie-chart style="--chart-size:7rem">
                        <ul>
                            <li data-value="42">Search</li>
                            <li data-value="31">Social</li>
                            <li data-value="27">Email</li>
                        </ul>
                    </pl-pie-chart>
                </div>
                <div data-group>
                    <div data-metric><span>Weekly sessions</span><span>Last 7 days</span></div>
                    <!-- Seven day-columns at the default slot width outgrow a
                         one-column panel, so narrow the slots and bars and
                         drop the value row, as a compact weekly chart does. -->
                    <pl-bar-chart data-values="hidden"
                        style="--bar-height:5rem;--bar-slot:1.5rem;--bar-thickness:1.25rem;--bar-gap:0.5rem">
                        <ul>
                            <li data-value="40">M</li>
                            <li data-value="62">T</li>
                            <li data-value="50">W</li>
                            <li data-value="78">T</li>
                            <li data-value="66">F</li>
                            <li data-value="100">S</li>
                            <li data-value="84">S</li>
                        </ul>
                    </pl-bar-chart>
                </div>
            </section>

            <!-- Search and pickers -->
            <section data-panel>
                <h2>Search &amp; Pickers</h2>
                <div data-stack>
                    <pl-search placeholder="Search components…"></pl-search>
                    <pl-label text="Brand color"><pl-color-picker value="#2563EB"></pl-color-picker></pl-label>
                    <div data-group>
                        <p data-group-label>Rating</p>
                        <pl-ratings value="4" readonly></pl-ratings>
                    </div>
                </div>
            </section>

            <!-- People -->
            <section data-panel>
                <h2>Avatars</h2>
                <div data-group>
                    <p data-group-label>Stack</p>
                    <div data-avatars>
                        <pl-avatar initials="KO" alt="Kenny Ortega"></pl-avatar>
                        <pl-avatar initials="DR" alt="Dana Reyes"></pl-avatar>
                        <pl-avatar initials="MS" alt="Mira Shah"></pl-avatar>
                        <pl-avatar initials="+5" alt="Five more"></pl-avatar>
                    </div>
                </div>
                <div data-group>
                    <p data-group-label>Shapes</p>
                    <div data-row>
                        <pl-avatar initials="AL" alt="Ada Lovelace"></pl-avatar>
                        <pl-avatar initials="MH" alt="Margaret Hamilton" shape="square"></pl-avatar>
                        <pl-avatar alt="Unknown person"></pl-avatar>
                    </div>
                </div>
            </section>

            <!-- Icons, bare glyphs over their names -->
            <section data-panel>
                <h2>UI Icons</h2>
                <div data-icons>
                    <div><pl-icon icon="search" size="1.5rem"></pl-icon>search</div>
                    <div><pl-icon icon="bell" size="1.5rem"></pl-icon>bell</div>
                    <div><pl-icon icon="mail" size="1.5rem"></pl-icon>mail</div>
                    <div><pl-icon icon="calendar" size="1.5rem"></pl-icon>calendar</div>
                    <div><pl-icon icon="star" size="1.5rem"></pl-icon>star</div>
                    <div><pl-icon icon="lock" size="1.5rem"></pl-icon>lock</div>
                    <div><pl-icon icon="swatch" size="1.5rem"></pl-icon>swatch</div>
                    <div><pl-icon icon="trash" size="1.5rem"></pl-icon>trash</div>
                    <div><pl-icon icon="check" size="1.5rem"></pl-icon>check</div>
                    <div><pl-icon icon="plus" size="1.5rem"></pl-icon>plus</div>
                    <div><pl-icon icon="pencil" size="1.5rem"></pl-icon>pencil</div>
                    <div><pl-icon icon="refresh" size="1.5rem"></pl-icon>refresh</div>
                    <div><pl-icon icon="save" size="1.5rem"></pl-icon>save</div>
                    <div><pl-icon icon="shopping-bag" size="1.5rem"></pl-icon>shopping-bag</div>
                    <div><pl-icon icon="storefront" size="1.5rem"></pl-icon>storefront</div>
                </div>
            </section>

            <!-- Table: no pl-table exists, so a plain one in the system's chrome -->
            <section data-panel data-span="full">
                <h2>Table</h2>
                <div data-table>
                    <table>
                        <thead>
                            <tr><th>Name</th><th>Role</th><th>Status</th><th>Usage</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Ada Lindqvist</td><td>Design lead</td>
                                <td><pl-badge data-standalone data-intent="success" content="Active"></pl-badge></td>
                                <td>82%</td>
                            </tr>
                            <tr>
                                <td>Kenny Ortega</td><td>Engineer</td>
                                <td><pl-badge data-standalone data-intent="warning" content="Pending"></pl-badge></td>
                                <td>47%</td>
                            </tr>
                            <tr>
                                <td>Mira Shah</td><td>Researcher</td>
                                <td><pl-badge data-standalone data-intent="error" content="Over"></pl-badge></td>
                                <td>103%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Groups and navigation -->
            <section data-panel data-span="full">
                <h2>Button Groups &amp; Navigation</h2>
                <div data-row style="gap:2rem;align-items:flex-start">
                    <div data-group>
                        <p data-group-label>Segmented group</p>
                        <pl-button-group>
                            <pl-button>Day</pl-button>
                            <pl-button data-variant="secondary">Week</pl-button>
                            <pl-button data-variant="secondary">Month</pl-button>
                        </pl-button-group>
                    </div>
                    <div data-group>
                        <p data-group-label>Pagination</p>
                        <pl-pagination page="1" total="3"></pl-pagination>
                    </div>
                    <div data-group style="flex:0 1 18rem">
                        <p data-group-label>Navigation rail</p>
                        <pl-app-navigation label="Main">
                            <a href="#" aria-current="page"><pl-icon icon="mail"></pl-icon> Inbox</a>
                            <a href="#"><pl-icon icon="calendar"></pl-icon> Calendar</a>
                            <a href="#"><pl-icon icon="star"></pl-icon> Favorites</a>
                        </pl-app-navigation>
                    </div>
                </div>
            </section>

            <!-- Disclosure -->
            <section data-panel data-span="full">
                <h2>Disclosure</h2>
                <pl-accordion-group>
                    <pl-accordion open>
                        <h3 data-summary>What is a UI kit page for?</h3>
                        <p>Seeing a theme applied to everything at once, rather than one component at a time.</p>
                    </pl-accordion>
                    <pl-accordion>
                        <h3 data-summary>Does it need every component?</h3>
                        <p>No. It needs enough of them that a theme has nowhere to hide.</p>
                    </pl-accordion>
                </pl-accordion-group>
            </section>

        </pl-ui-kit-page>
    `, { title: 'UI kit template preview', initial: 1280 }),

    p(`The panels PACK: the sheet is CSS columns, not a grid, so each column stacks its panels
       to its own height instead of rowing them against their tallest neighbour — no rectangular
       holes. Three columns drop to two and then one as the page narrows, so the same poster
       works as a printed sheet, a documentation page, or a panel inside a design tool.`),

    section('Theming it'),

    p(`Point the tokens somewhere else and the whole page follows. This is the entire mechanism,
       and it is the reason the template exists:`),

    p(`For a whole page or a whole app, set the contract tokens where the export sets them:`),

    code(`
        :root {
            --color-primary: #7C3AED;
            --color-success: #059669;
            --border-radius-large: 4px;
            --font-family-display: Georgia, serif;
        }
    `, 'css'),

    p(`To render the kit at a theme WITHOUT changing the page around it — a preview pane, two
       themes side by side, a picker — set the <code>--pl-*</code> aliases on the element instead:`),

    code(`
        <pl-ui-kit-page style="
            --pl-color-primary: #7C3AED;
            --pl-color-success: #059669;
            --pl-border-radius-large: 4px;
            --pl-font-family-display: Georgia, serif;
        ">
    `, 'html'),

    callout('warn', 'Scoped overrides must name the alias, not the contract',
        `<code>&lt;pl-ui-kit-page style="--color-primary: …"&gt;</code> has no effect, which is
         surprising until you see why. The bridge
         <code>--pl-color-primary: var(--color-primary)</code> is declared once on
         <code>:root</code> and RESOLVES there; what inherits down the tree is the resolved value,
         not the expression, so redefining the contract further down has nothing left to
         re-resolve. Global themes work because they change the contract in the same place the
         bridge reads it. Anything scoped has to set what components actually read. See
         <a href="/documentation/theming">Theming</a>.`),

    section('Regions'),

    table(
        ['Marker', 'Description'],
        [
            { cells: ['<code>data-masthead</code>', 'The kit\'s identity, spanning all columns: a <code>data-brand</code> mark, the name as its heading, a <code>data-kicker</code> with a rule, an optional <code>data-lede</code>.'] },
            { cells: ['<code>data-panel</code>', 'One labelled box. Its first heading becomes the label. Panels never split across columns.'] },
            { cells: ['<code>data-span="full"</code>', 'Spans all columns. A spanner splits the packing — panels before it pack above, panels after below — so spanning panels belong at the end.'] },
            { cells: ['<code>data-group</code>', 'A named cluster inside a panel — one variant axis, one idea.'] },
            { cells: ['<code>data-group-label</code>', 'The small caps title of a group: <em>Variants</em>, <em>Sizes</em>, <em>Circular</em>.'] },
            { cells: ['<code>data-row</code>', 'A wrapping row of specimens.'] },
            { cells: ['<code>data-stack</code>', 'A vertical stack, for fields that each need a line.'] },
            { cells: ['<code>data-metric</code>', 'A name on the left and its reading on the right, above a bar.'] },
            { cells: ['<code>data-stat</code>', 'A single figure: label, <code>data-figure</code>, and an optional <code>data-delta</code> (<code>data-delta="down"</code> turns it red). Layout only — put it inside a <code>pl-surface</code> for the frame.'] },
            { cells: ['<code>data-caption</code>', 'Small muted text beside or under a specimen.'] },
            { cells: ['<code>data-swatches</code>', 'The palette grid.'] },
            { cells: ['<code>data-swatch="primary"</code>', 'One chip. Paints the matching token: <code>ink</code>, <code>surface</code>, <code>primary</code>, <code>secondary</code>, <code>success</code>, <code>warning</code>, <code>danger</code>.'] },
            { cells: ['<code>data-specimen</code>', 'A type sample. <code>display</code> or <code>mono</code> for the other families.'] },
            { cells: ['<code>data-icons</code>', 'A grid of bare glyphs, each over its own name. No chrome around the icons.'] },
            { cells: ['<code>data-avatars</code>', 'An overlapped avatar stack.'] },
            { cells: ['<code>data-table</code>', 'Wraps a plain <code>&lt;table&gt;</code> in the system\'s chrome. There is no <code>pl-table</code>; the kit shows the real thing.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Default', 'Description'],
        [
            { cells: ['<code>--kit-columns</code>', '<code>3</code>', 'How many columns the panels pack into. Drops to 2 then 1 as the page narrows.'] },
            { cells: ['<code>--kit-gap</code>', '<code>--pl-size-16</code>', 'Space between panels.'] },
            { cells: ['<code>--kit-padding</code>', '<code>--pl-size-32</code>', 'Space around the poster.'] },
            { cells: ['<code>--kit-panel-background</code>', '<code>--pl-color-surface</code>', 'Panel fill.'] },
            { cells: ['<code>--kit-panel-border</code>', '<code>--pl-color-border</code>', 'Panel border.'] },
            { cells: ['<code>--kit-panel-radius</code>', '<code>--pl-border-radius-large</code>', 'Panel corners.'] },
            { cells: ['<code>--kit-swatch-size</code>', '<code>--pl-size-48</code>', 'Height of a color chip.'] },
            { cells: ['<code>--kit-swatch-track</code>', '<code>5rem</code>', 'Minimum width of a swatch cell. Sized to the label, not the chip.'] },
        ],
    ),

    section('Next'),

    ul([
        '<a href="/documentation/theming">Theming</a>: the token contract this page exists to display.',
        '<a href="/documentation/pl-brand-kit-page">pl-brand-kit-page</a>: the same theme presented as a brand board.',
        '<a href="/documentation/pl-content-page">pl-content-page</a>: the theme\'s typography at work on an article.',
        '<a href="/documentation/pl-marketing-page">pl-marketing-page</a>: the other template built for showing a theme, on real content.',
    ]),
);
