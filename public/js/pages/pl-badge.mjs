// ------------------------------
// Documentation: pl-badge
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-badge',
        title: 'Badge',
        lede: 'A small count or dot pinned to the corner of something else: an unread total on an inbox button, a presence dot on an avatar.',
    }),

    meta({
        'DOM mode': '<strong>Light</strong>',
        'Extends': '<code>BaseElement</code>',
        'Renders': 'A positioned <code>&lt;span&gt;</code> beside your content',
        'Import': '<code>@platformdesign/components/pl-badge</code>',
    }),

    p(`Wrap the thing being badged; the badge pins itself to its corner. Your content is left
       exactly where you put it: the badge is a positioned sibling, not a wrapper the content gets
       moved into, so a button stays a button and an avatar stays an avatar.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-badge';`, 'js'),

    demo(`
        <pl-badge content="4">
            <pl-button variant="secondary" aria-label="Inbox, 4 unread messages">
                <pl-icon icon="mail"></pl-icon>
            </pl-button>
        </pl-badge>
    `),

    callout('note', 'Label the element that owns the badge',
        `The badge is <code>aria-hidden</code>, always. A screen reader should never hear a stray
         "4" floating next to a button called "Inbox". The count is part of what the
         <em>owner</em> means, so the owner's accessible name has to say so:
         <code>aria-label="Inbox, 4 unread messages"</code>, not <code>aria-label="Inbox"</code>.
         Nothing here can write that for you, only you know whether the 4 is unread messages,
         pending invitations, or items in a cart, and guessing would be wrong silently.`),

    section('Badges are supplemental'),

    p(`A badge is a compact reminder of something the interface should already be able to tell
       someone. Use one for a short count or a state that updates an existing control: unread mail,
       new orders, whether a contact is online. If the status matters on its own, give it real
       estate in the UI; don't make a corner dot the only place it exists.`),

    section('Counts, and capping them'),

    p(`<code>max</code> caps the number so a long count can't stretch the badge out of its corner.
       Anything over the cap renders as <code>max+</code>:`),

    demo(`
        <pl-badge content="8">
            <pl-button variant="secondary" aria-label="Inbox, 8 unread messages"><pl-icon icon="mail"></pl-icon></pl-button>
        </pl-badge>
        <pl-badge content="99" max="99">
            <pl-button variant="secondary" aria-label="Inbox, 99 unread messages"><pl-icon icon="mail"></pl-icon></pl-button>
        </pl-badge>
        <pl-badge content="1204" max="99">
            <pl-button variant="secondary" aria-label="Inbox, 1204 unread messages"><pl-icon icon="mail"></pl-icon></pl-button>
        </pl-badge>
    `),

    code(`
        <pl-badge content="1204" max="99">…</pl-badge>   <!-- renders 99+ -->
    `, 'html'),

    p(`Capping is display-only, and only applies when both values are numbers: a text badge
       (<code>content="NEW"</code>) has no notion of being over a limit. Note that the visible
       "99+" is another reason the owner's label has to be written by hand: it should still say
       <em>1204 unread messages</em>.`),

    section('Zero'),

    p(`A count of zero hides the badge, because "0 unread" is the absence of the thing the badge
       exists to flag. Pass <code>show-zero</code> when the zero is itself worth seeing:`),

    demo(`
        <pl-badge content="0">
            <pl-button variant="secondary" aria-label="Inbox, no unread messages"><pl-icon icon="mail"></pl-icon></pl-button>
        </pl-badge>
        <pl-badge content="0" show-zero>
            <pl-button variant="secondary" aria-label="Inbox, 0 unread messages"><pl-icon icon="mail"></pl-icon></pl-button>
        </pl-badge>
    `),

    section('Dot badges'),

    p(`<code>dot</code> drops the text entirely and leaves a small circle. It says <em>something</em>,
       not how much, not what. Use one only where the surrounding UI already makes the state
       clear, like the word "Online" sitting right next to it:`),

    demo(`
        <pl-badge dot>
            <pl-button variant="secondary" aria-label="Notifications, unread"><pl-icon icon="bell"></pl-icon></pl-button>
        </pl-badge>
        <pl-badge dot intent="error">
            <pl-button variant="secondary" aria-label="Orders, new activity"><pl-icon icon="storefront"></pl-icon></pl-button>
        </pl-badge>
    `),

    section('Intents'),

    demo(`
        <pl-badge content="6"><pl-button variant="secondary" aria-label="6 items"><pl-icon icon="mail"></pl-icon></pl-button></pl-badge>
        <pl-badge content="6" intent="success"><pl-button variant="secondary" aria-label="6 items"><pl-icon icon="calendar"></pl-icon></pl-button></pl-badge>
        <pl-badge content="6" intent="warning"><pl-button variant="secondary" aria-label="6 items"><pl-icon icon="bell"></pl-icon></pl-button></pl-badge>
        <pl-badge content="6" intent="error"><pl-button variant="secondary" aria-label="6 items"><pl-icon icon="storefront"></pl-icon></pl-button></pl-badge>
        <pl-badge content="6" intent="neutral"><pl-button variant="secondary" aria-label="6 items"><pl-icon icon="mail"></pl-icon></pl-button></pl-badge>
    `),

    p(`Each fill pairs with its own on-colour, so badge text stays readable in both themes: the
       same rule every coloured fill in the library follows.`),

    section('Corners'),

    p(`Corners are named with logical edges, so <code>end</code> is the right side in a
       left-to-right document and the left side in a right-to-left one, with no second set of
       rules:`),

    demo(`
        <pl-badge content="1" position="top-start"><pl-button variant="secondary" aria-label="top start"><pl-icon icon="mail"></pl-icon></pl-button></pl-badge>
        <pl-badge content="2" position="top-end"><pl-button variant="secondary" aria-label="top end"><pl-icon icon="mail"></pl-icon></pl-button></pl-badge>
        <pl-badge content="3" position="bottom-start"><pl-button variant="secondary" aria-label="bottom start"><pl-icon icon="mail"></pl-icon></pl-button></pl-badge>
        <pl-badge content="4" position="bottom-end"><pl-button variant="secondary" aria-label="bottom end"><pl-icon icon="mail"></pl-icon></pl-button></pl-badge>
    `),

    section('Presence on an avatar'),

    p(`A round owner needs the badge pulled inward, or it floats in the empty corner of the
       circle's bounding box rather than sitting on the circle. That's what
       <code>--badge-offset-block</code> / <code>--badge-offset-inline</code> are for. The status
       is spelled out beside each avatar, which is what makes a wordless dot acceptable here:`),

    demo(`
        <div style="display:grid;gap:1rem">
            <div style="display:flex;align-items:center;gap:.75rem">
                <pl-badge dot intent="success" position="bottom-end"
                    style="--badge-offset-block:12%;--badge-offset-inline:12%;--badge-dot-size:.875rem">
                    <pl-avatar initials="R" alt="" size="lg"></pl-avatar>
                </pl-badge>
                <div><div>Remy Sharp</div><div style="opacity:.7;font-size:.875rem">Online</div></div>
            </div>
            <div style="display:flex;align-items:center;gap:.75rem">
                <pl-badge dot intent="neutral" position="bottom-end"
                    style="--badge-offset-block:12%;--badge-offset-inline:12%;--badge-dot-size:.875rem">
                    <pl-avatar initials="T" alt="" size="lg"></pl-avatar>
                </pl-badge>
                <div><div>Travis Howard</div><div style="opacity:.7;font-size:.875rem">Offline</div></div>
            </div>
        </div>
    `, { layout: 'stack' }),

    p('Without the surrounding layout, the part that matters is just:'),

    code(`
        <pl-badge dot intent="success" position="bottom-end"
            style="--badge-offset-block: 12%; --badge-offset-inline: 12%">
            <pl-avatar initials="R" alt="Remy Sharp" size="lg"></pl-avatar>
        </pl-badge>
    `, 'html'),

    section('Updating from script'),

    code(`
        const badge = document.querySelector('pl-badge');
        const button = badge.querySelector('pl-button');

        badge.content = count;                 // or badge.setAttribute('content', count)
        button.setAttribute('aria-label', \`Inbox, \${count} unread messages\`);
    `, 'js'),

    p(`Both lines matter. Setting <code>content</code> alone updates what is <em>seen</em> and
       nothing of what is <em>announced</em>: the owner's label is where the count actually lives
       for anyone not looking at the corner of a button.`),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>content</code>', '<code>String</code>', 'The count or short text to show. Absent renders nothing.'] },
            { cells: ['<code>max</code>', '<code>Number</code>', 'Caps a numeric count: over it renders <code>max+</code>.'] },
            { cells: ['<code>dot</code>', '<code>Boolean</code>', 'Drop the text; show a small circle instead.'] },
            { cells: ['<code>standalone</code>', '<code>Boolean</code>', 'A label rather than a marker: the badge sits in flow instead of straddling a corner. Use it when the badge has no owner to attach to.'] },
            { cells: ['<code>show-zero</code>', '<code>Boolean</code>', 'Keep the badge visible when the count is <code>0</code>.'] },
            { cells: ['<code>intent</code>', '<code>String</code>', '<code>primary</code> (default), <code>success</code>, <code>warning</code>, <code>error</code>, <code>neutral</code>.'] },
            { cells: ['<code>position</code>', '<code>String</code>', '<code>top-end</code> (default), <code>top-start</code>, <code>bottom-end</code>, <code>bottom-start</code>.'] },
        ],
    ),

    section('Properties'),

    table(
        ['Member', 'Description'],
        [
            { cells: ['<code>content</code>', 'Get the text as rendered (capped, so <code>"99+"</code>), or set it.'] },
            { cells: ['<code>badge</code>', 'The badge element itself, if you need to position it from script.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--badge-background</code> / <code>--badge-color</code>', 'Fill and text, overriding the intent.'] },
            { cells: ['<code>--badge-size</code>', 'Height, and minimum width, of a counted badge.'] },
            { cells: ['<code>--badge-dot-size</code>', 'Diameter of a <code>dot</code> badge.'] },
            { cells: ['<code>--badge-offset-block</code> / <code>--badge-offset-inline</code>', 'Nudge the badge in from the corner: needed for round owners.'] },
            { cells: ['<code>--badge-ring</code> / <code>--badge-ring-width</code>', 'The separating ring. Set it to whatever sits <em>behind</em> the owner, not the owner itself.'] },
            { cells: ['<code>--badge-font-size</code> / <code>--badge-padding-inline</code>', 'Text size and horizontal padding.'] },
        ],
    ),

    callout('note', 'Why the ring defaults to the surface colour',
        `Without a ring, a dark count on a dark icon button reads as one smudged shape. The ring
         separates the two, so it should match what is <em>behind</em> the owner: the page, which
         is why it defaults to <code>--pl-color-surface</code> rather than anything about the
         element being badged. Over a photo or a coloured band, set it yourself.`),

    section('Accessibility'),

    ul([
        'The badge is <code>aria-hidden</code> and carries no role. It is a visual shorthand, and duplicating it into the accessibility tree would announce a bare number with no context.',
        'The owner must carry the full meaning in its accessible name: <code>aria-label="Inbox, 4 unread messages"</code>. Update that name whenever the count changes.',
        'A dot badge says nothing at all on its own: pair it with visible text, as the avatar example does with "Online" / "Offline".',
        'Nothing inside the wrapper is moved or re-parented, so a badged button keeps its focus behaviour, form ownership, and any <code>aria-*</code> references to ids elsewhere in the page.',
        'Colour alone never carries the state: <code>intent</code> tints a badge whose meaning is already in the owner\'s name.',
    ]),
);
