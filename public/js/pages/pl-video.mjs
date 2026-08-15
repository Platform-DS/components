// ------------------------------
// Documentation: pl-video
// ------------------------------

import { page, header, meta, section, p, ul, code, callout, demo, table } from '../components/doc.mjs';

export default () => page(
    header({
        tag: 'pl-video',
        title: 'Video',
        lede: 'A real <video>, with its whole native surface inherited.',
    }),

    meta({
        'DOM mode': 'Shadow',
        'Extends': '<code>VideoElement</code>',
        'Wraps': '<code>&lt;video&gt;</code>',
        'Import': '<code>@platformdesign/components/pl-video</code>',
    }),

    p(`Attributes, properties, methods and events all come from the element itself:
       <code>controls</code>, <code>poster</code>, <code>autoplay</code>, <code>loop</code>,
       <code>muted</code>, <code>playsinline</code>, <code>currentTime</code>,
       <code>duration</code>, <code>paused</code>, <code>play()</code>, <code>pause()</code>,
       and the media events, which the base re-emits on the host because none of them cross a
       shadow boundary on their own.`),

    section('Usage'),

    code(`import '@platformdesign/components/pl-video';`, 'js'),

    code(`
        <pl-video src="clip.mp4" poster="poster.jpg" controls data-ratio></pl-video>

        <pl-video controls poster="poster.jpg" data-ratio>
            <source src="clip.webm" type="video/webm">
            <source src="clip.mp4" type="video/mp4">
            <track kind="captions" src="captions.vtt" srclang="en" label="English" default>
        </pl-video>
    `, 'html'),

    callout('note', 'Sources are adopted, not slotted',
        `A <code>&lt;video&gt;</code> picks its source by walking its own <em>child</em>
         <code>&lt;source&gt;</code> elements, and slotted light-DOM children are not children of
         the element they are slotted into: left in a <code>&lt;slot&gt;</code> they would be
         ignored and the video would play nothing. So, exactly as
         <a href="/documentation/pl-select">pl-select</a> does with its options, your
         <code>&lt;source&gt;</code> and <code>&lt;track&gt;</code> elements are <strong>moved</strong>
         into the real video. The same applies to captions: a <code>&lt;track&gt;</code> has to be
         a child of the video, or there are no captions.`),

    section('From script'),

    code(`
        const video = document.querySelector('pl-video');

        await video.play();
        video.currentTime = 30;
        console.log(video.duration, video.paused);

        // Media events are re-emitted on the host, so this works:
        video.addEventListener('timeupdate', () => console.log(video.currentTime));
        video.addEventListener('ended', () => console.log('done'));
    `, 'js'),

    section('Attributes'),

    table(
        ['Attribute', 'Type', 'Description'],
        [
            { cells: ['<code>src</code> / <code>poster</code>', '<code>String</code>', 'Native.'] },
            { cells: ['<code>controls</code>, <code>autoplay</code>, <code>loop</code>, <code>muted</code>, <code>playsinline</code>', '<code>Boolean</code>', 'Native.'] },
            { cells: ['<code>preload</code>', '<code>String</code>', '<code>none</code>, <code>metadata</code>, <code>auto</code>.'] },
            { cells: ['<code>data-ratio</code>', '<em>presentational</em>', 'Hold a fixed aspect box. See below.'] },
            { cells: ['<code>data-fit</code>', '<code>String</code>', '<code>contain</code> to letterbox instead of cropping.'] },
        ],
    ),

    section('Custom properties'),

    table(
        ['Property', 'Description'],
        [
            { cells: ['<code>--video-ratio</code>', 'The shape held by <code>data-ratio</code>. Defaults to <code>16 / 9</code>.'] },
            { cells: ['<code>--video-radius</code>', 'Corner radius.'] },
            { cells: ['<code>--video-background</code>', 'Behind the frame: black by default, as letterboxing expects.'] },
        ],
    ),

    section('Accessibility'),

    ul([
        'Ship a <code>&lt;track kind="captions"&gt;</code>. It is the single highest-value thing on this page, and it only works because the track is adopted into the real video.',
        'Avoid <code>autoplay</code> with sound. If you must autoplay, pair it with <code>muted</code>: browsers block it otherwise, and it is hostile besides.',
        '<code>controls</code> gives you the browser\'s own player: keyboard operable, labelled, and familiar. Replacing it means rebuilding all of that.',
        'Set <code>data-ratio</code> to reserve the frame before metadata loads, so the page does not jump.',
    ]),
);
