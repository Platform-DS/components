// ------------------------------
// Documentation: pl-profile-card
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

const WAVE = seed => `https://api.dicebear.com/10.x/waves/svg?seed=${seed}`;

export default () => page(
    header({
        tag: 'pl-profile-card',
        title: 'Profile Card',
        lede: 'A person: a cover band, an avatar riding up onto it, and whatever else belongs with them.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Generates': 'Nothing; it is a layout',
        'Import': '<code>@platformdesign/components/pl-profile-card</code>',
    }),

    p(`Like <a href="/documentation/pl-product-card">pl-product-card</a>, this generates no markup:
       the regions are marked on your own elements, and everything inside is a component that
       already exists.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-profile-card';`, 'js'),

    demo(`
        <pl-profile-card style="max-inline-size: 20rem">
            <div data-cover><img src="${WAVE('4a5cq3t7')}" alt=""></div>
            <pl-avatar data-avatar size="xl" initials="AL" alt=""></pl-avatar>
            <h3 data-name><a href="#">Ada Lovelace</a></h3>
            <p data-role>Principal Engineer</p>
            <p>Writes the notes everyone else ends up reading.</p>
            <div data-meta>
                <pl-chip>Compilers</pl-chip>
                <pl-chip>Mathematics</pl-chip>
            </div>
            <div data-actions>
                <pl-button size="sm">Follow</pl-button>
                <pl-button size="sm" variant="secondary">Message</pl-button>
            </div>
        </pl-profile-card>
    `, { layout: 'stack' }),

    p(`The avatar's <code>alt</code> is empty on purpose: the name is right there in the card, so
       a filled one would make a screen reader say it twice.`),

    section('Centred'),

    demo(`
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(12rem,1fr));gap:1rem;inline-size:100%">
            <pl-profile-card align="center">
                <div data-cover><img src="${WAVE('zk28fq')}" alt=""></div>
                <pl-avatar data-avatar size="xl" initials="GH" alt=""></pl-avatar>
                <h3 data-name>Grace Hopper</h3>
                <p data-role>Rear Admiral</p>
                <div data-actions><pl-button size="sm" variant="secondary">Message</pl-button></div>
            </pl-profile-card>
            <pl-profile-card align="center">
                <div data-cover><img src="${WAVE('m4t7xz')}" alt=""></div>
                <pl-avatar data-avatar size="xl" initials="KJ" alt=""></pl-avatar>
                <h3 data-name>Katherine Johnson</h3>
                <p data-role>Research Mathematician</p>
                <div data-actions><pl-button size="sm" variant="secondary">Message</pl-button></div>
            </pl-profile-card>
        </div>
    `, { layout: 'stack' }),

    callout('note', 'Two things the overlap gets wrong if you are not careful',
        `The avatar is pulled up with a NEGATIVE BLOCK MARGIN, and that margin has to be a
         <em>length</em>. A percentage margin, even in the block direction: resolves against the
         containing block's <strong>inline</strong> size, so <code>-50%</code> would mean half the
         card's width: on a 260px card, a 130px pull that drags the name straight over the cover.
         <br><br>
         Centring is also done per element rather than with <code>align-items: center</code> on the
         column, because that would make every child shrink to its content width, including the
         cover, which would pull in off the card's edges instead of running full bleed.`),

    section('Without a cover'),

    demo(`
        <pl-profile-card style="max-inline-size: 18rem">
            <pl-avatar data-avatar size="lg" initials="MH" alt=""></pl-avatar>
            <h3 data-name>Margaret Hamilton</h3>
            <p data-role>Director of Software Engineering</p>
        </pl-profile-card>
    `, { layout: 'stack' }),

    section('Regions'),

    table(
        ['Marker', 'Description'],
        [
            { cells: ['<code>data-cover</code>', 'The banner. Wide aspect box, image cropped to fill.'] },
            { cells: ['<code>data-avatar</code>', 'Usually a <a href="/documentation/pl-avatar">pl-avatar</a>. Rides up onto the cover with a ring around it.'] },
            { cells: ['<code>data-name</code>', 'The person\'s name. Put the link here if there is one.'] },
            { cells: ['<code>data-role</code>', 'Secondary line beneath the name.'] },
            { cells: ['<code>data-meta</code>', 'A wrapping row: chips, tags, counts.'] },
            { cells: ['<code>data-actions</code>', 'Buttons, pinned to the bottom.'] },
        ],
    ),

    section('Attributes and custom properties'),

    table(
        ['Name', 'Description'],
        [
            { cells: ['<code>align="center"</code>', 'Centres the text, avatar, meta and actions. The cover stays full bleed.'] },
            { cells: ['<code>--profile-avatar-overlap</code>', 'How far the avatar rides up. Defaults to <code>2.5rem</code>: half of an <code>xl</code> avatar; set it to half of whatever size you use.'] },
            { cells: ['<code>--profile-cover-ratio</code>', 'Aspect ratio of the cover. Defaults to <code>4 / 1</code>.'] },
            { cells: ['<code>--card-padding</code> / <code>--card-background</code> / <code>--card-border</code> / <code>--card-radius</code>', 'Shared with <a href="/documentation/pl-product-card">pl-product-card</a>.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'Cover and avatar images are decoration when the name is already in the card. Give them <code>alt=""</code> so they are skipped rather than announced twice.',
        'Headings stay at whatever level suits the surrounding document; nothing here changes them.',
        'The avatar\'s ring is drawn with <code>box-shadow</code> in the card\'s own background colour, so it separates the avatar from any cover image without depending on what that image contains.',
    ]),
);
