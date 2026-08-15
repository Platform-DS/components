// ------------------------------
// Documentation: Utilities overview
// ------------------------------

import { page, header, section, p, ul, code, callout, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'Utilities',
        lede: 'Small modules that add behaviour to a page or a component, without becoming a framework.',
    }),

    p(`Components cover what a page <em>shows</em>. These cover the handful of things a page has to
       <em>do</em> that the platform leaves to you: routing between views, reacting to state,
       building an element, getting a stylesheet into the document. Each is a plain ES module with
       named exports and no dependencies, importable on its own.`),

    code(`import { createRouter } from '@platformdesign/components/utilities/routing/createRouter.mjs';`, 'js'),

    section('What is here'),

    table(
        ['Module', 'Exports', 'For'],
        [
            { cells: ['<a href="/documentation/utilities/create-router">routing/createRouter</a>', '<code>createRouter</code>', 'Client-side navigation: link interception, history, focus, view transitions.'] },
            { cells: ['<a href="/documentation/utilities/state-manager">observers/stateManager</a>', '<code>signal</code>, <code>computed</code>, <code>effect</code>, <code>batch</code>, <code>defineStore</code>', 'Reactive state, with dependencies tracked automatically.'] },
            { cells: ['<a href="/documentation/utilities/create-el">factories/createEl</a>', '<code>createEl</code>', 'Building DOM in JavaScript without string concatenation.'] },
            { cells: ['<a href="/documentation/utilities/inject-styles">_core/injectStyles</a>', '<code>injectStyles</code>', 'Adopting a stylesheet into the document once, for Light DOM components.'] },
            { cells: ['<a href="/documentation/utilities/storage">adapters/storageAdapter</a>', '<code>readStorage</code>, <code>writeStorage</code>', 'localStorage that survives corrupt values.'] },
            { cells: ['<a href="/documentation/utilities/view-transition">decorators/withViewTransitions</a>', '<code>withViewTransition</code>', 'A view transition where supported, a plain update everywhere else.'] },
            { cells: ['<a href="/documentation/utilities/escape-html">helpers/escapeHTML</a>', '<code>escapeHTML</code>', 'Making a value safe to interpolate into markup.'] },
        ],
    ),

    section('What they have in common'),

    ul([
        '<strong>Nothing is required.</strong> No component imports a utility to work. Use one, use all seven, use none.',
        '<strong>No shared runtime.</strong> They do not know about each other, so importing one never drags in the rest.',
        '<strong>Functions, not classes to extend.</strong> Each takes what it needs and returns something you own. Nothing registers a global, and nothing has to be torn down that does not hand you the teardown.',
        '<strong>They stop where your application starts.</strong> The router does not fetch data; the store does not touch the DOM. A utility that guessed at either would be a framework with a smaller name.',
    ]),

    callout('note', 'These are not internals',
        `Everything here is exported from the package and documented as API, which is the
         difference between this section and the machinery in <code>_core/</code>. Base classes and
         the prop declaration system are covered by
         <a href="/documentation/authoring">Authoring components</a> instead: you meet those when
         you are writing a component, not when you are using one. <code>injectStyles</code> spans
         both, which is why it appears here as well.`),

    section('Using them without the components'),

    p(`Every module is standalone. If you want the router and none of the elements, import that
       one file: there is no index to pull in and no side effect to register.`),

    code(`
        // just the router
        import { createRouter } from '@platformdesign/components/utilities/routing/createRouter.mjs';

        // just reactive state
        import { signal, effect } from '@platformdesign/components/utilities/observers/stateManager.mjs';
    `, 'js'),

    p(`They are equally happy in a project that uses none of this library, including one built on
       a framework. <code>signal</code> next to React is a reasonable thing to want, and nothing
       here would notice.`),

    section('Next'),

    ul([
        '<a href="/documentation/utilities/create-router">createRouter</a>: the biggest of them, and the one running this documentation site.',
        '<a href="/documentation/authoring">Authoring components</a>: the base classes and conventions behind the components themselves.',
    ]),
);
