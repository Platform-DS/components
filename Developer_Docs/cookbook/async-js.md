# Async JS

General-purpose JavaScript technique notes — independent of the platform architecture spec in the parent directory. Add other standalone technique write-ups here as they come up.

## Promise.all
```js

// slow: sequential - 3 seconds total
const user      = await fetchUser(id);      // 1s
const posts     = await fetchPosts(id);     // 1s
const followers = await fetchFollowers(id); // 1s

// fast: parallel - ~1 second total
const [user, posts, followers] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchFollowers(id),
]);

```

The results come back in the same order as the array, so destructuring works perfectly. If any one of the promises rejects, the whole Promise.all rejects immediately.

## Promise.allSettled

```js
const results = await Promise.allSettled([
  fetchUser(id),
  fetchPosts(id),
  fetchFollowers(id),
]);

results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log(result.value);
  } else {
    console.warn('Failed:', result.reason);
  }
});
```

A profile page that still shows the user and their posts even when the followers count fails to load is a much better experience than a full page error.

**Why it matters**
Faster pages, same code. Wrapping three existing fetch calls in Promise.all can cut load time by 60% or more with almost no refactoring.
Cleaner than chaining. No nested .then() chains, no intermediate variables to pass down. One line, all results.
All browsers. Promise.all is Baseline 2015. Promise.allSettled is Baseline 2020. Both available everywhere without a polyfill.