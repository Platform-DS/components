// ------------------------------
// Documentation: createRouter
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'createRouter',
        lede: 'Client-side navigation: link interception, history, focus, and view transitions.',
    }),

    meta({
        'Import': '<code>utilities/routing/createRouter.mjs</code>',
        'Exports': '<code>createRouter</code>',
        'Depends on': '<code>withViewTransition</code>',
    }),

    p(`This is the router running the page you are reading. It was written for these docs, then
       pulled out once it became clear that none of what it does is specific to them: it does the
       plumbing every single-page view needs and nobody enjoys writing twice.`),

    section('Usage'),

    code(`
        import { createRouter } from '@platformdesign/components/utilities/routing/createRouter.mjs';

        const router = createRouter({
            base: '/app',
            outlet: document.querySelector('main'),
            routes: [
                { path: '/',          module: './views/home.mjs' },
                { path: '/users/:id', module: './views/user.mjs' },
                { path: '/files/*',   module: './views/file.mjs' },
            ],
            render: async match => (await import(match.module)).default(match),
        });

        router.start();
    `, 'js'),

    p(`<code>render</code> receives the matched route with its <code>params</code> filled in, and
       returns a node. Views are lazy by convention: a route names a module, imported on first
       visit, so the browser's own module loader is the code-splitter. No bundler and no manifest
       are involved.`),

    section('What it handles for you'),

    ul([
        '<strong>Link interception</strong>, including all the cases where it should not intercept: another origin, outside <code>base</code>, <code>target</code>, <code>download</code>, <code>rel="external"</code>, a modified click, or a non-primary button.',
        '<strong>Back and Forward</strong>, via <code>popstate</code>, without pushing a duplicate entry.',
        '<strong>Focus</strong>, moved to the new view\'s heading. A real navigation does this for free; an SPA has to do it by hand or a keyboard visitor is left in the old page\'s tab order.',
        '<strong>View transitions</strong> where the browser supports them, and where the visitor has not asked for reduced motion.',
        '<strong>Out-of-order renders.</strong> A slow view that was navigated away from is discarded when its import finally resolves, instead of replacing the page the visitor is now on.',
    ]),

    callout('note', 'It stops where your application starts',
        `It does not fetch data, cache views, own state, or render anything itself.
         <code>render</code> returns a node and the router puts it in the outlet. Everything above
         that line is your application, and a router that guesses at it becomes a framework.`),

    section('Options'),

    table(
        ['Option', 'Default', 'Description'],
        [
            { cells: ['<code>outlet</code>', '<em>required</em>', 'The element a rendered view is placed into.'] },
            { cells: ['<code>render</code>', '<em>required</em>', '<code>(match) => Node | Promise&lt;Node&gt;</code>. Receives the matched route plus <code>path</code> and <code>params</code>.'] },
            { cells: ['<code>routes</code>', '<code>[]</code>', '<code>[{ path, ...anything }]</code>. Everything other than <code>path</code> is passed through to <code>render</code> untouched.'] },
            { cells: ['<code>base</code>', "<code>''</code>", 'The path prefix this router owns. Links outside it navigate for real, so one router can live alongside ordinary pages.'] },
            { cells: ['<code>resolve</code>', '<em>none</em>', '<code>(path) => route | null</code>, replacing pattern matching entirely when your routes come from somewhere else.'] },
            { cells: ['<code>fallback</code>', '<em>none</em>', '<code>(path) => Node</code> when nothing matches: your 404.'] },
            { cells: ['<code>onError</code>', '<em>none</em>', '<code>(error, path) => Node</code> when <code>render</code> throws. Without one, the error is logged and the outlet is left alone.'] },
            { cells: ['<code>onNavigate</code>', '<em>none</em>', '<code>(path, match) => void</code> after every swap. Where you mark the active nav link or close a menu.'] },
            { cells: ['<code>focus</code>', "<code>'h1'</code>", 'Selector focused after a swap. <code>null</code> to skip.'] },
            { cells: ['<code>scroll</code>', '<code>true</code>', 'Scroll to the top after a swap.'] },
            { cells: ['<code>transition</code>', '<code>true</code>', 'Use a view transition where supported.'] },
        ],
    ),

    section('Returned'),

    table(
        ['Member', 'Description'],
        [
            { cells: ['<code>start()</code>', 'Begin intercepting links and render the current URL. Idempotent.'] },
            { cells: ['<code>stop()</code>', 'Remove the listeners. The outlet is left as it is.'] },
            { cells: ['<code>go(to, { replace, history })</code>', 'Navigate to a pathname. <code>replace</code> swaps the current history entry; <code>history: false</code> renders without touching history at all.'] },
            { cells: ['<code>refresh()</code>', 'Re-render the current path, after the data behind it changed.'] },
            { cells: ['<code>current()</code>', 'The match currently painted, or <code>null</code>.'] },
            { cells: ['<code>href(path)</code>', 'Router-relative path to full pathname, for building links.'] },
            { cells: ['<code>local(pathname)</code>', 'Full pathname to router-relative path, or <code>null</code> if outside <code>base</code>.'] },
        ],
    ),

    section('Route patterns'),

    p('Two forms, which is the whole grammar:'),

    table(
        ['Pattern', 'Matches', 'params'],
        [
            { cells: ['<code>/users</code>', '<code>/users</code>', '<code>{}</code>'] },
            { cells: ['<code>/users/:id</code>', '<code>/users/42</code>', '<code>{ id: "42" }</code>'] },
            { cells: ['<code>/users/:id/:tab</code>', '<code>/users/42/settings</code>', '<code>{ id: "42", tab: "settings" }</code>'] },
            { cells: ['<code>/files/*</code>', '<code>/files/a/b/c.txt</code>', '<code>{ rest: "a/b/c.txt" }</code>'] },
        ],
    ),

    p(`Values are decoded, and routes are tried in the order given, so put the specific one first.
       Anything more expressive than this is a job for <code>resolve</code>, where you have real
       code instead of a string to encode the rule in.`),

    code(`
        createRouter({
            outlet,
            render,
            // routes from a CMS, a manifest, anywhere
            resolve: path => manifest.find(entry => entry.url === path) ?? null,
        });
    `, 'js'),

    section('base, and why the check is not startsWith'),

    p(`<code>base</code> is the slice of the URL space this router owns. Links inside it are
       intercepted; links outside are left to the browser, so an SPA can sit in one part of a site
       that is otherwise ordinary pages.`),

    p(`The containment test is on segment boundaries rather than a plain prefix, because a prefix
       is wrong in a way that shows up much later: <code>/appointments</code> starts with
       <code>/app</code> without being inside it, and a plain <code>startsWith</code> would swallow
       that link and render a 404 in place of a page that exists.`),

    section('Server support'),

    p(`Client-side routing needs the server to serve the same document for every path under
       <code>base</code>, or a refresh returns a 404 from the server before the router ever runs.
       On a static host that is usually one rewrite rule:`),

    code(`
        # nginx
        location /app/ { try_files $uri /app/index.html; }
    `, 'bash'),

    section('This site'),

    p(`These docs are the router's first consumer. Their own <code>Router.mjs</code> is now only
       the part that is specific to them: which URLs exist and what each renders. Routes are built
       from the generated component tree, so adding a component directory adds its route with no
       list to update.`),

    code(`
        createRouter({
            base: '/documentation',
            outlet: main,
            routes: routes(),   // guides + utilities + every component in the tree
            render: async route => (route.module
                ? (await import(route.module)).default(route)
                : placeholder(route)),
            fallback: path => message('Page not found', …),
            onNavigate: (path, route) => setActive(nav, route?.slug),
        }).start();
    `, 'js'),

    section('Next'),

    ul([
        '<a href="/documentation/utilities/view-transition">withViewTransition</a>: the transition handling the router delegates to.',
        '<a href="/documentation/utilities">Utilities</a>: the rest of them.',
    ]),
);
