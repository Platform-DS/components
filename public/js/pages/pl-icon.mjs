// ------------------------------
// Documentation — pl-icon
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table, el } from '../components/doc.mjs';
import { SPRITESHEET } from '../../../Library/components/app/ui/pl-icon/_spritesheet.mjs';

/** Every icon name in the spritesheet, read from the source of truth. */
const ICONS = [...SPRITESHEET.matchAll(/id="icon-([\w-]+)"/g)].map(m => m[1]);

/** A clickable grid of every available icon. */
function gallery() {
    const grid = el('div', {
        class: 'demo__stage',
        style: 'display:grid;grid-template-columns:repeat(auto-fill,minmax(6rem,1fr));gap:.5rem;background-image:none',
    });

    for (const name of ICONS) {
        const cell = el('button', {
            type: 'button',
            title: `Copy "${name}"`,
            style: 'display:grid;gap:.4rem;justify-items:center;padding:.75rem .25rem;font:inherit;font-size:var(--pl-text-xs);color:var(--pl-color-text-muted);background:none;border:1px solid var(--pl-color-border);border-radius:var(--pl-radius-md);cursor:pointer;overflow:hidden',
            onClick: async () => {
                await navigator.clipboard.writeText(name);
                const label = cell.lastElementChild;
                const previous = label.textContent;
                label.textContent = 'copied';
                setTimeout(() => { label.textContent = previous; }, 1200);
            },
        });

        cell.innerHTML = `<pl-icon icon="${name}" size="1.5rem"></pl-icon>`;
        cell.append(el('span', { style: 'max-inline-size:100%;overflow:hidden;text-overflow:ellipsis' }, name));
        grid.append(cell);
    }

    return el('div', { class: 'demo' }, grid);
}

export default () => page(
    header({
        tag: 'pl-icon',
        title: 'Icon',
        lede: 'One symbol from a shared spritesheet, injected once and reused by every instance.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>BaseElement</code>',
        'Icons': `${ICONS.length} available`,
        'Import': '<code>@platformdesign/components/pl-icon</code>',
    }),

    section('Usage'),

    code(`import '@platformdesign/components/pl-icon';`, 'js'),

    demo(`
        <pl-icon icon="sun"></pl-icon>
        <pl-icon icon="moon"></pl-icon>
        <pl-icon icon="check"></pl-icon>
        <pl-icon icon="trash"></pl-icon>
    `),

    section('Size and colour'),

    p(`<code>size</code> takes any CSS length. Colour defaults to <code>currentColor</code>, so
       an icon matches its surrounding text without being told to:`),

    demo(`
        <pl-icon icon="sparkle" size="1rem"></pl-icon>
        <pl-icon icon="sparkle" size="1.5rem"></pl-icon>
        <pl-icon icon="sparkle" size="2.5rem"></pl-icon>
        <pl-icon icon="sparkle" size="2.5rem" color="oklch(0.87 0.19 96)"></pl-icon>
        <span style="color: oklch(0.6 0.2 25)">
            <pl-icon icon="sparkle" size="2.5rem"></pl-icon> inherits
        </span>
    `),

    section('Inside a button'),

    demo(`
        <pl-button><pl-icon icon="plus" size="1rem"></pl-icon> New project</pl-button>
        <pl-button variant="secondary"><pl-icon icon="copy" size="1rem"></pl-icon> Duplicate</pl-button>
        <pl-button variant="danger" aria-label="Delete">
            <pl-icon icon="trash" size="1rem"></pl-icon>
        </pl-button>
    `),

    section('Accessibility'),

    p(`Icons are <strong>decorative by default</strong> — the SVG carries
       <code>aria-hidden="true"</code> and is skipped by assistive technology. That is the right
       default: most icons sit beside a visible text label, and announcing both is the more
       common bug.`),

    p('Give an icon a <code>label</code> only when it carries meaning that nothing else conveys:'),

    demo(`
        <pl-icon icon="check" label="Passed" color="oklch(0.6 0.16 150)"></pl-icon>
        <pl-icon icon="close" label="Failed" color="oklch(0.6 0.2 25)"></pl-icon>
    `),

    callout('a11y', 'Which one do I need?',
        `<p>Next to visible text — <strong>no label</strong>. The text already says it.</p>
         <p>Alone in a button — <strong>no label on the icon</strong>; put
         <code>aria-label</code> on the button instead, so the accessible name belongs to the
         thing being activated.</p>
         <p>Alone, conveying status — <strong>label the icon</strong>.</p>`),

    section('Props'),

    table(
        ['Prop', 'Type', 'Default', 'Description'],
        [
            { cells: ['<code>icon</code>', '<code>String</code>', '—', 'Symbol name from the spritesheet, without the <code>icon-</code> prefix.'] },
            { cells: ['<code>size</code>', '<code>String</code>', '<code>1.5rem</code>', 'Any CSS length. Sets both width and height.'] },
            { cells: ['<code>color</code>', '<code>String</code>', '<code>currentColor</code>', 'Any CSS colour.'] },
            { cells: ['<code>label</code>', '<code>String</code>', '—', 'Accessible name. Makes the icon meaningful rather than decorative.'] },
        ],
    ),

    section('Parts'),

    table(
        ['Part', 'Description'],
        [{ cells: ['<code>svg</code>', 'The internal <code>&lt;svg&gt;</code> element.'] }],
    ),

    section(`All ${ICONS.length} icons`),

    p('Click any icon to copy its name.'),

    gallery(),

    section('How it works'),

    p(`The spritesheet is injected into the document once, on first use, and every instance
       reads from it. Rather than referencing a symbol with <code>&lt;use href="#icon-x"&gt;</code>,
       the component <em>clones</em> the symbol's children into its own shadow SVG — a
       <code>&lt;use&gt;</code> inside a shadow root cannot reliably resolve an ID defined
       outside it across browsers.`),

    ul([
        'One network cost and one parse, no matter how many icons are on the page.',
        'No per-icon HTTP requests and no icon font.',
        'Presentation attributes (<code>fill</code>, <code>stroke</code>, <code>stroke-width</code>) are copied from the symbol onto the local SVG, since cloning the children alone would lose them.',
    ]),
);
