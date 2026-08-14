// ------------------------------
// FAQs Component — LIGHT DOM
// ------------------------------
// Step 7 of the landing-page formula: objection handling. Questions a visitor
// would otherwise leave to go ask someone else.
//
//   <pl-faqs exclusive schema>
//     <h2>Questions</h2>
//     <details>
//       <summary>Do I need a build step?</summary>
//       <p>No. The library ships standard ES modules.</p>
//     </details>
//   </pl-faqs>
//
// Disclosure is <details>/<summary> — the browser owns the open state, the
// keyboard, the accessible name, and find-in-page opening a closed answer. None
// of that is worth rebuilding on aria-expanded and a click handler.
//
// Two opt-in behaviours, both small:
//   exclusive — only one answer open at a time, using the NATIVE `name`
//               attribute on <details> rather than a JS click handler
//   schema    — emit FAQPage structured data so the questions can appear as
//               rich results in search

// Imports
import { SectionElement } from '../../../../_core/elements/SectionElement.mjs';
import { define } from '../../../../_core/elements/BaseElement.mjs';
import { STYLES } from './_styles.mjs';

// Component Settings
const tagName = 'pl-faqs';

let uid = 0;

// Light DOM
export class Faqs extends SectionElement {
    static css = STYLES;

    #schemaScript = null;

    connectedCallback() {
        super.connectedCallback();

        // Exclusive accordion, the native way: same `name` on every <details>
        // makes the browser close the others. No JS state to keep in sync, and
        // it degrades to independent disclosures where `name` isn't supported.
        if (this.hasAttribute('exclusive')) {
            const group = this.getAttribute('name') || `pl-faqs-${++uid}`;
            for (const details of this.querySelectorAll(':scope > details')) {
                details.name = group;
            }
        }

        if (this.hasAttribute('schema')) this.#emitSchema();
    }

    disconnectedCallback() {
        this.#schemaScript?.remove();
        this.#schemaScript = null;
    }

    /**
     * FAQPage structured data, built from the questions already on the page —
     * so the markup stays the single source of truth and the two can't drift.
     */
    #emitSchema() {
        const entries = [];

        for (const details of this.querySelectorAll(':scope > details')) {
            const question = details.querySelector('summary')?.textContent.trim();
            if (!question) continue;

            const answer = [...details.children]
                .filter(child => child.tagName !== 'SUMMARY')
                .map(child => child.textContent.trim())
                .join(' ')
                .trim();

            if (answer) {
                entries.push({
                    '@type': 'Question',
                    name: question,
                    acceptedAnswer: { '@type': 'Answer', text: answer },
                });
            }
        }

        if (!entries.length) return;

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        // Escaping `<` keeps a stray "</script>" inside an answer from ending
        // the block early — the one real injection risk in a JSON-LD payload.
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: entries,
        }).replace(/</g, '\\u003c');

        this.append(script);
        this.#schemaScript = script;
    }
}

define(tagName, Faqs);
