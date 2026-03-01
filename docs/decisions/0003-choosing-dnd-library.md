# Choosing DND library

## Context and Problem Statement

In this project we have draggable timelines in KKISE, so we need some draggable
library to move our timelines on draggable area.

Limitations:

- Not abandoned
- Simple in use
- Have y-axis move
- Have nice UX

## Considered Options

- [@dnd-kit/svelte](https://dndkit.com/svelte/quickstart) |
  [Try it](https://main--5fc05e08a4a65d0021ae0bf2.chromatic.com/?path=/story/svelte_sortable-vertical-list--basic-setup)

Pretty nice UX & DX. Last update was maded 3 days ago. The core `@dnd-kit` is
framework-agnostic. Do updates only when needed.

- [@dnd-kit-svelte/svelte](https://github.com/HanielU/dnd-kit-svelte) |
  [Try it](https://next-dnd-kit-svelte.vercel.app/)

Pretty nice UX & DX. Builded on `@dnd-kit`, but not the part of the `@dnd-kit`
packages as `@dnd-kit/svelte`. Do updates only when needed.

- [svelte-dnd-action](https://github.com/isaacHagoel/svelte-dnd-action) |
  [Try it](https://svelte.dev/playground/e2ef044af75c4b16b424b8219fb31fd9?version=3.59.2)

Kinda slow reaction when moving. I can't find the setting for changing reacting
time. Code looks kinda messy, but it svelte-first. Last update 3 months ago. Do
updates only when needed.

- [sveltednd](https://github.com/thisuxhq/sveltednd) |
  [Try it](https://sveltednd.thisux.com/simple-list)

Acceptable, but the "bricks" is not moving when you touch the block. So they
exchange their place only when you keyup the mouse button. Do rerenders all the
time. Last update 11 months ago.

- [Sortable](https://github.com/SortableJS/Sortable) |
  [Try it](https://sortablejs.github.io/Sortable/)

Pretty nice UX. Framework agnostic core, but don't have Svelte adapter. Last
update 3 weeks ago. Do updates only when needed.

## Decision Outcome

**Chosen Option:** [@dnd-kit/svelte](https://dndkit.com/svelte/quickstart)

### Consequences

#### Pros

- **High Customization:** We can decouple the drag logic from the visual styles,
  allowing for complex "ghost" elements or custom drag overlays.
- **Accessibility (A11y):** Robust built-in support for keyboard navigation and
  screen readers, which is often overlooked in other Svelte-specific DND
  libraries.
- **Scalability:** Since the core is framework-agnostic, the logic is more
  robust and less prone to breaking during Svelte version transitions.

#### Cons

- **Abstraction Overhead:** It requires setting up a `DndContext`, `Sensors`,
  and `Sortable` components, which is slightly more verbose than a simple Svelte
  action.
- **Bundle Size:** It carries more weight than "micro-libraries" though this is
  justified by its feature set and reliability.

#### Neutral

- **Port Dependency:** As a port of the original `@dnd-kit`, we need to ensure
  that reactive Svelte stores are correctly synced with the library's internal
  state to avoid stale closure issues.
