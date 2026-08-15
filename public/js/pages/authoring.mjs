// ------------------------------
// Documentation: Authoring components
// ------------------------------
// The web-facing summary of Developer_Docs/component-authoring-guide.md.

import { page, header, section, p, ul, code, callout, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'Authoring components',
        lede: 'Pick an anatomy, declare typed props, render once.',
    }),

    p(`Every component in the library is built the same way. Deciding the DOM mode first is
       what keeps the rest simple, because that choice determines what the component can and
       cannot reach.`),

    section('1. Choose the anatomy'),

    table(
        ['Base', 'Use when', 'Gives you'],
        [
            { cells: [
                '<code>createNativeElement(tag)</code>',
                'The component wraps one native element: a button, an input, an anchor.',
                'Every native attribute, property, method, and event of that element, reflected automatically.',
            ] },
            { cells: [
                '<code>BaseElement</code>',
                'There is no single native element to wrap: a card, an accordion, a hero.',
                'Typed props, a derived <code>observedAttributes</code>, one <code>render()</code>, and <code>emit()</code>.',
            ] },
        ],
    ),

    p(`Wrapping a native element matters more than it sounds. It is what lets
       <code>&lt;pl-button type="submit"&gt;</code> actually submit a form: there is a real
       <code>&lt;button&gt;</code> in the shadow root doing the work, so form participation,
       validation, and keyboard behaviour are inherited rather than reimplemented.`),

    section('2. Choose Shadow or Light'),

    p('<code>static mode</code> decides, and it is a functional choice, not a stylistic one.'),

    ul([
        '<strong>Shadow</strong> (default). Style encapsulation and real <code>&lt;slot&gt;</code>s. Correct for app components.',
        '<strong>Light</strong>: the markup joins the page\'s DOM and cascade. Correct for all content components, and for app components whose job is to participate in a document-level relationship.',
    ]),

    callout('warn', 'What a shadow boundary breaks',
        `<code>&lt;label&gt;</code> association, <code>aria-controls</code> /
         <code>aria-labelledby</code> / <code>aria-describedby</code> (all ID-based), form
         ownership, search indexing, and browser translation. All five are scoped to a single
         DOM tree. When a component's whole purpose is one of those, it belongs in the Light
         DOM. See <a href="/documentation/pl-label">pl-label</a>.`),

    section('3. Declare typed props'),

    p(`A component declares its public API once. <code>observedAttributes</code> derives from
       that declaration, so it is never hand-maintained and can never drift:`),

    code(`
        static props = {
            variant: { type: String,  default: 'primary' },
            size:    { type: String,  default: 'md' },
            loading: { type: Boolean, default: false },
        };
    `, 'js'),

    p(`Values are typed and coerced. Read and write them through <code>this.props</code>, where
       a number is a number rather than the string the DOM would give you:`),

    code(`
        el.props.loading = true;    // reflects to the attribute
        el.props.count = 42;        // stays a Number, not "42"
        el.props.count = 'banana';  // throws a TypeError
    `, 'js'),

    table(
        ['Surface', 'Backed by an attribute?', 'Use for'],
        [
            { cells: ['<code>static props</code>', 'Yes: reflected both ways', 'Anything a consumer should be able to set in HTML.'] },
            { cells: ['<code>static state</code>', 'No: JavaScript only', 'Internal values that should trigger a repaint but do not belong in the DOM.'] },
        ],
    ),

    callout('note', 'Why the attribute is canonical',
        `The property setter writes the <em>attribute</em>, and
         <code>attributeChangedCallback</code> writes the value back into the store. Because
         updates only ever flow one direction, there is no reflection loop to guard against:
         the classic property-sets-attribute-sets-property ping-pong cannot happen.`),

    section('4. Render once'),

    p(`<code>render()</code> is the only method that writes to the DOM. It runs on connect and
       after any observed attribute changes, so it must be safe to call repeatedly. Update
       what exists rather than rebuilding it.`),

    code(`
        render() {
            const { button } = this.refs;
            button.toggleAttribute('aria-busy', this.props.loading);
            button.disabled = this.disabled || this.props.loading;
        }
    `, 'js'),

    section('5. Events up, state down'),

    p(`Components never reach into application state. They receive values through attributes and
       properties, and report upward with events. <code>emit()</code> dispatches a composed
       <code>CustomEvent</code> that escapes the shadow boundary:`),

    code(`this.emit('pl-change', { value });`, 'js'),

    section('The full skeleton'),

    code(`
        import { BaseElement, define } from '@platformdesign/components/_core/elements/BaseElement.mjs';
        import { STYLES } from './_styles.mjs';

        const tagName = 'pl-example';

        export class Example extends BaseElement {
            static #template = document.createElement('template');
            static #sheet = new CSSStyleSheet();

            static {
                this.#template.innerHTML = /*html*/\`
                    <div part="wrapper"><slot></slot></div>
                \`;
                this.#sheet.replaceSync(STYLES);
                this.template = this.#template;
                this.styles = this.#sheet;
            }

            static props = {
                open: { type: Boolean, default: false },
            };

            constructor() {
                super();
                this.refs = {
                    wrapper: this.root.querySelector('[part="wrapper"]'),
                };
            }

            render() {
                this.refs.wrapper.toggleAttribute('data-open', this.props.open);
            }
        }

        define(tagName, Example);
    `, 'js'),

    p(`<code>define()</code> is guarded, so importing a component twice: directly and through
       the barrel: cannot throw on a duplicate registration.`),

    callout('note', 'The full guide',
        `This page is the short version. <code>Developer_Docs/component-authoring-guide.md</code>
         covers state categories, styling strategy per DOM mode, and the reflection rules in
         depth.`),
);
