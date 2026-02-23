# Using Normalized Data State for KKISE state managment

## Context and Problem Statement

In web application development, state is often structured as a tree to mimic the
component hierarchy. For a timeline-based tool like KKISE, this leads to deeply
nested objects where "Timelines" contain arrays of "Intervals."

Example of the current nested structure:

```json
{
{
    "duration": 144142,
    "timelines": [
        {
            "key": "Space",
            "intervals": [{ "id": "int1", "offsetX": 1500, "duration": 132 }, ...]
        }
    ]
}
}
```

The Issues:

- Data Access Complexity: Accessing or updating a specific interval requires
  traversing the entire tree or writing complex helper functions that need both
  the track ID and the interval ID.
- Performance Bottlenecks: In Svelte, updating a single property deep within a
  nested array can trigger unnecessary re-renders of the entire list if the
  reactivity system cannot granularly track the change.
- Boilerplate: Immutably updating a nested interval involves multiple levels of
  object/array spreading.

Why?

- Performance: Minimize re-renders when dragging or resizing intervals.
- DX: Simplify CRUD operations on intervals.
- Scalability: Support hundreds of intervals across multiple tracks without UI
  lag.

## Considered Options

- Nested Arrays: Simple to visualize but hard to manage.
- Standard JS Map: Efficient O(1) access, but lacks native Svelte reactivity
  (requires re-assignment like map = map).
- SvelteMap (Svelte 5 / Reactive Collections): Provides O(1) access and built-in
  reactivity for .set() and .delete() methods.

## Decision Outcome

SvelteMap

### Consequences

- Data Orchestration: Deleting a track now requires a manual cleanup of its
  associated intervals in the flat Map to prevent memory leaks.
- Serialization: Converting the state back to JSON for saving/loading requires a
  "denormalization" step.
