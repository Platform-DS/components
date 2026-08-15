// ------------------------------
// Documentation: pl-avatar
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

const MYSTERY = 'http://www.gravatar.com/avatar/?d=mp';

export default () => page(
    header({
        tag: 'pl-avatar',
        title: 'Avatar',
        lede: 'A circular (or squared) photo, with a fallback that\'s just as accessible as the real thing.',
    }),

    meta({
        'DOM mode': '<strong>Shadow</strong>',
        'Extends': '<code>ImageElement</code>',
        'Wraps': '<code>&lt;img&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-avatar</code>',
    }),

    p(`<code>&lt;pl-avatar&gt;</code> inherits the whole native <code>&lt;img&gt;</code> surface:
       <code>src</code>, <code>srcset</code>, <code>alt</code>, <code>loading</code>,
       <code>decoding</code>, <code>decode()</code>, the <code>load</code>/<code>error</code>
       events, for free, the same way <a href="/documentation/pl-input">pl-input</a> inherits
       <code>&lt;input&gt;</code>. What it adds is a size scale, a circular crop, and a fallback for
       when there's no image yet or the one given fails to load.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-avatar';`, 'js'),

    demo(`
        <pl-avatar src="${MYSTERY}" alt="Unknown user"></pl-avatar>
    `),

    p(`That demo's <code>src</code> is Gravatar's own "mystery person" placeholder
       (<code>?d=mp</code>, no hash): a real, always-resolving image, which is why it's the one
       used throughout this page rather than an asset shipped with the docs.`),

    section('Sizes'),

    demo(`
        <pl-avatar src="${MYSTERY}" alt="" size="xs"></pl-avatar>
        <pl-avatar src="${MYSTERY}" alt="" size="sm"></pl-avatar>
        <pl-avatar src="${MYSTERY}" alt="" size="md"></pl-avatar>
        <pl-avatar src="${MYSTERY}" alt="" size="lg"></pl-avatar>
        <pl-avatar src="${MYSTERY}" alt="" size="xl"></pl-avatar>
    `),

    code(`
        <pl-avatar size="xs" src="…"></pl-avatar>  <!-- 1.5rem -->
        <pl-avatar size="sm" src="…"></pl-avatar>  <!-- 2rem   -->
        <pl-avatar size="md" src="…"></pl-avatar>  <!-- 2.5rem, default -->
        <pl-avatar size="lg" src="…"></pl-avatar>  <!-- 3.5rem -->
        <pl-avatar size="xl" src="…"></pl-avatar>  <!-- 5rem   -->
    `, 'html'),

    p(`For anything between the steps, set <code>--avatar-size</code> directly: it's what every
       preset above resolves to.`),

    code(`<pl-avatar style="--avatar-size: 4.25rem" src="…"></pl-avatar>`, 'html'),

    section('Shape'),

    demo(`
        <pl-avatar src="${MYSTERY}" alt="" size="lg"></pl-avatar>
        <pl-avatar src="${MYSTERY}" alt="" size="lg" shape="square"></pl-avatar>
    `),

    code(`
        <pl-avatar shape="circle" src="…"></pl-avatar>  <!-- default -->
        <pl-avatar shape="square" src="…"></pl-avatar>
    `, 'html'),

    section('Fallback'),

    p(`With no <code>src</code>, or one that fails to load, the avatar shows <code>initials</code>
       if given, or a generic silhouette if not. Both are drawn <em>instead of</em> the
       <code>&lt;img&gt;</code>, never behind it. See the callout below for why that's not just a
       stacking-order detail.`),

    demo(`
        <pl-avatar initials="AL" alt="Ada Lovelace" size="lg"></pl-avatar>
        <pl-avatar alt="Unnamed user" size="lg"></pl-avatar>
        <pl-avatar src="https://broken.example/nothing-here.png" initials="BR" alt="Broken source" size="lg"></pl-avatar>
    `),

    code(`
        <pl-avatar initials="AL" alt="Ada Lovelace"></pl-avatar>
        <pl-avatar alt="Unnamed user"></pl-avatar>  <!-- no initials either -->
    `, 'html'),

    callout('note', 'Why the fallback isn\'t just a CSS-hidden layer',
        `Hiding a broken or missing <code>&lt;img&gt;</code> with <code>display</code>,
         <code>visibility</code>, or <code>opacity</code> also removes it, and its
         <code>alt</code>, from the accessibility tree, which would leave the fallback
         unlabelled. So exactly one of the two is ever rendered: the real <code>&lt;img&gt;</code>
         while it has a source and hasn't errored, or the fallback, with its own
         <code>role="img"</code> and an <code>aria-label</code> copied from <code>alt</code>,
         when it doesn't. Never both, and never neither.`),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>src</code>, <code>srcset</code>, <code>sizes</code>', '<code>String</code>', 'Native: the image source(s).'] },
            { cells: ['<code>alt</code>', '<code>String</code>', 'Native, also becomes the fallback\'s <code>aria-label</code> when it\'s the one showing.'] },
            { cells: ['<code>loading</code>, <code>decoding</code>, <code>fetchpriority</code>', '<code>String</code>', 'Native: passed straight through.'] },
            { cells: ['<code>initials</code>', '<code>String</code>', 'Fallback text. Up to 2 characters are shown, upper-cased.'] },
            { cells: ['<code>size</code>', '<code>String</code>', '<code>xs</code> / <code>sm</code> / <code>md</code> (default) / <code>lg</code> / <code>xl</code>.'] },
            { cells: ['<code>shape</code>', '<code>String</code>', '<code>circle</code> (default) or <code>square</code>.'] },
        ],
    ),

    p('Every other native <code>&lt;img&gt;</code> attribute, property, and method not listed above works exactly as it does on a plain one.'),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--avatar-size</code>', 'Width and height. The <code>size</code> presets each set this.'] },
            { cells: ['<code>--avatar-fallback-background</code>', 'Background shown behind the fallback (and while the real image loads).'] },
            { cells: ['<code>--avatar-fallback-color</code>', 'Colour of the initials text / silhouette icon.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'A real <code>&lt;img&gt;</code>, so <code>alt</code> is the accessible name exactly as it would be anywhere else. Pass a person\'s name, not the word "avatar".',
        'The fallback is never simultaneously present with a hidden, still-in-the-tree <code>&lt;img&gt;</code>. See the callout above. Whichever is showing carries the name.',
        'Purely decorative avatars (a stack of them next to a name already visible elsewhere) should get <code>alt=""</code>, same as a plain <code>&lt;img&gt;</code> would.',
    ]),
);
