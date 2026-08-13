# Architecture Principles

The big idea here is "Spec Driven Development" or SDD. We define the spec of our system so we don't have to think about it later.

These principles apply across all three JS layers — `Features/`, `Shared/`, and `Application/` — described in [js-directory-guide.md](./js-directory-guide.md). For how design patterns map onto specific directories, see [directory-patterns.md](./directory-patterns.md).

# Core Principles

### Events Up → State Down

Components communicate upward through events and receive updates downward through attributes,  
properties, or reactive state.

This keeps ownership predictable and avoids tightly coupling reusable components to application  
logic.

* * *

### Local State First

State should exist at the lowest stable ownership boundary.

Preferred order:

1.  Local component state
2.  Feature-level stores
3.  Application-level stores

Examples of local component state:

- Dropdown open/closed
- Active tab
- Checkbox checked state
- Hover/focus state

Examples of feature/application state:

- Search filters
- Wishlist contents
- Product collections
- Authentication state

* * *

## Encapsulation

Features should be as self-contained as possible.

Other parts of the application should not rely on internal implementation details of a feature.

Feature internals should not be imported directly outside the feature. Use the feature entry  
point instead.

* * *

## Avoid Premature Sharing

Just because something *could* be reused does not mean it belongs in `Shared/`.

Only move code into `Shared/` after reuse has been proven across multiple features.

* * *

## Shared Components Should Remain Stateless Relative to the Application

Shared components may manage their own internal UI state, but they should not directly  
coordinate feature or application state.

Shared components should:

- Manage their own local interaction state
- Emit events upward
- Receive updates through attributes/properties
- Remain unaware of feature/application stores

Shared components should not:

- Import global stores
- Mutate feature/application state directly
- Coordinate cross-feature behavior

This keeps shared components portable, predictable, and reusable.


## Window vs No Window

Determine whether the application is:

- Standalone
- Embedded inside another application

Standalone applications may safely leverage the `window` object as an application-level namespace.

Embedded applications should avoid polluting the global scope to prevent collisions with host  
applications.

Think of this similarly to scoped vs global CSS.

* * *

# Notes:

- Try to namespace everything. Examples:
	- `ServiceName.login(email, pw)` vs just `login(email, pw)`
	- `utils.debounce()` or `utils.escapeHTML()`
	- `UserStore.username`

- Not all "namespaces" have to be global. Just make sure the names don't collide when you import multiple.
