// ------------------------------
// Documentation: withViewTransition
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'withViewTransition',
        lede: 'A view transition where it is supported and wanted, a plain update everywhere else.',
    }),

    meta({
        'Import': '<code>utilities/decorators/withViewTransitions.mjs</code>',
        'Exports': '<code>withViewTransition</code>',
        'Depends on': '<em>nothing</em>',
    }),

    p(`<code>document.startViewTransition</code> animates between two states of the DOM: you make
       the change inside a callback and the browser cross-fades the before and after. This wraps it
       so the call site never has to ask whether it exists.`),

    section('Usage'),

    code(`
        import { withViewTransition } from
            '@platformdesign/components/utilities/decorators/withViewTransitions.mjs';

        withViewTransition(() => {
            outlet.replaceChildren(nextView);
        });
    `, 'js'),

    p(`The callback runs exactly once either way, so nothing downstream needs a branch. Where a
       transition happens, the returned object is the browser's <code>ViewTransition</code>;
       otherwise it is <code>undefined</code>.`),

    section('When it skips the animation'),

    table(
        ['Condition', 'Why'],
        [
            { cells: ['<code>prefers-reduced-motion: reduce</code>', 'A cross-fade is motion. This is the setting where someone has said they do not want it, and honouring it is not optional.'] },
            { cells: ['No <code>startViewTransition</code>', 'The API is not everywhere yet. The update still happens, without the animation.'] },
            { cells: ['No <code>document</code>', 'Server-side or in a worker, where there is nothing to animate.'] },
            { cells: ['The call threw', 'A transition already running, for instance. The update is more important than the animation, so it runs regardless.'] },
        ],
    ),

    callout('note', 'Why the promises are caught and thrown away',
        `A <code>ViewTransition</code> exposes <code>ready</code>, <code>updateCallbackDone</code>
         and <code>finished</code>, and they reject in ordinary circumstances: navigating again
         mid-transition rejects the one in flight. Nobody is awaiting them here, and an unhandled
         rejection would be logged as an error for something that is not one. They are caught
         precisely so an interrupted animation stays quiet.`),

    section('Naming what moves'),

    p(`By default the whole page cross-fades. Give an element a
       <code>view-transition-name</code> and the browser animates that element from its old
       position to its new one instead, which is where the effect starts being worth having:`),

    code(`
        .hero-image { view-transition-name: hero; }
    `, 'css'),

    p(`The name has to be unique at any moment: two elements sharing one skips the transition
       entirely. Style the generated pseudo-elements to control the animation itself:`),

    code(`
        ::view-transition-old(hero) { animation-duration: 200ms; }
        ::view-transition-new(hero) { animation-duration: 200ms; }
    `, 'css'),

    section('Where this library uses it'),

    p(`<a href="/documentation/utilities/create-router">createRouter</a> swaps views through it, so
       every navigation on this documentation site goes through this function. That is also why
       navigating here is instant with reduced motion switched on: same code path, no animation.`),

    section('Next'),

    ul([
        '<a href="/documentation/utilities/create-router">createRouter</a>: its main consumer.',
        '<a href="/documentation/utilities">Utilities</a>: the rest of them.',
    ]),
);
