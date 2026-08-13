// ------------------------------
// With View Transition Utility
// ------------------------------
// Mirrors Library/utilities/decorators/withViewTransition — Platform Shared
// copy so the app router can use it without importing from Library/.

export function withViewTransition(fn) {
    const doc = globalThis.document;
    const skipTransition =
      globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true ||
      !doc ||
      typeof doc.startViewTransition !== 'function';

    if (skipTransition) {
      fn();
      return undefined;
    }

    let transition;
    try {
      transition = doc.startViewTransition(() => {
        fn();
      });
    } catch {
      fn();
      return undefined;
    }

    transition?.ready?.catch(() => {});
    transition?.updateCallbackDone?.catch(() => {});
    transition?.finished?.catch(() => {});
    return transition;
}
