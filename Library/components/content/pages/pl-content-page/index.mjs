// ------------------------------
// Content Page — LIGHT DOM
// ------------------------------
// An editorial page: one measured column of long-form reading, with the
// furniture a magazine article has — a masthead, a headline block, ornament
// rules between movements, a pull quote beside the body, a full-width quote
// band, and a colophon at the foot.
//
//   <pl-content-page>
//     <header data-masthead>
//       <p data-brand>Northwind Journal</p>
//       <p data-issue>Vol. 01 — Typography</p>
//     </header>
//
//     <section data-headline>
//       <p data-kicker>This gives context</p>
//       <h1>You will read this first.</h1>
//       <p data-lede>And this line will carry you into the story.</p>
//     </section>
//
//     <div data-ornament><span></span><span></span><span></span></div>
//
//     <section data-body>
//       <div>
//         <p data-dropcap>You will read this body copy…</p>
//         <p>…</p>
//       </div>
//       <blockquote data-pull-quote>You will read this before the body copy.</blockquote>
//     </section>
//
//     <footer data-colophon>…</footer>
//   </pl-content-page>
//
// Every region is optional and none of them nest in a required order: the shell
// styles whatever markers it finds and flows the rest as prose.
//
// A page shell is deliberately thin. It owns the measure, the vertical rhythm,
// and the editorial chrome, and nothing else — the words inside it are the
// author's markup in the author's own tree. If this ever grows logic, the
// logic belonged in a component.

import { BaseElement, define } from '../../../../_core/elements/BaseElement.mjs';
import { injectStyles } from '../../../../_core/utilities/injectStyles.mjs';
import { STYLES } from './_styles.mjs';

const tagName = 'pl-content-page';

export class ContentPage extends BaseElement {
    static mode = 'light';

    connectedCallback() {
        injectStyles(tagName, STYLES);
        super.connectedCallback();
    }
}

define(tagName, ContentPage);
