// ------------------------------
// Documentation: storageAdapter
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, table } from '../components/doc.mjs';

export default () => page(
    header({
        title: 'readStorage, writeStorage',
        lede: 'localStorage with JSON handled and a corrupt value survived.',
    }),

    meta({
        'Import': '<code>utilities/adapters/storageAdapter.mjs</code>',
        'Exports': '<code>readStorage</code>, <code>writeStorage</code>',
        'Depends on': '<em>nothing</em>',
    }),

    p(`<code>localStorage</code> stores strings, so every real use of it is the same four lines:
       stringify going in, parse coming out, a default when the key is absent, and a
       <code>try</code> because <code>JSON.parse</code> throws on anything it did not write.`),

    section('Usage'),

    code(`
        import { readStorage, writeStorage } from
            '@platformdesign/components/utilities/adapters/storageAdapter.mjs';

        const prefs = readStorage('prefs', { theme: 'light', density: 'cosy' });

        prefs.theme = 'dark';
        writeStorage('prefs', prefs);
    `, 'js'),

    table(
        ['Function', 'Description'],
        [
            { cells: ['<code>readStorage(key, fallback)</code>', 'The parsed value, or <code>fallback</code> when the key is missing or the stored text is not valid JSON.'] },
            { cells: ['<code>writeStorage(key, value)</code>', 'Stores <code>value</code> as JSON.'] },
        ],
    ),

    callout('note', 'The fallback is the whole point',
        `Stored data outlives the code that wrote it. A key written by last year's version, or by a
         browser extension, or truncated by a quota error, will not parse, and an uncaught
         <code>SyntaxError</code> at start-up takes the page down over a preference. Returning the
         default turns that into a visitor whose theme reset, which nobody files a bug about.`),

    section('What it does not do'),

    p(`It does not catch a throw from <code>setItem</code>. That happens on a full quota, and in
       Safari's private mode where the API exists but rejects every write. If you are storing
       something that can grow, guard the write yourself: the failure is real, and what to do
       about it depends entirely on what you were storing:`),

    code(`
        try {
            writeStorage('draft', draft);
        } catch {
            notify('Your draft could not be saved locally.');
        }
    `, 'js'),

    p(`It also does not react to change. <code>localStorage</code> fires a <code>storage</code>
       event in <em>other</em> tabs on the same origin, which is the platform's own way to keep two
       tabs in step, and is worth wiring to a <a href="/documentation/utilities/state-manager">signal</a>
       if that matters to you:`),

    code(`
        const theme = signal(readStorage('theme', 'light'));

        addEventListener('storage', event => {
            if (event.key === 'theme') theme.value = JSON.parse(event.newValue);
        });
    `, 'js'),

    section('Next'),

    ul([
        '<a href="/documentation/utilities/state-manager">signal, computed, effect</a>: for state that has to react.',
        '<a href="/documentation/utilities">Utilities</a>: the rest of them.',
    ]),
);
