---
name: elena-authoring
description: Critical rules for authoring Elena components. Component types, props, events, templates, lifecycle, mixins, and framework compatibility.
---

# Elena Authoring — Critical Rules

> Full reference: https://elenajs.com/llms-full.txt
> Page index: https://elenajs.com/llms.txt

## Component types

Three types — the type determines whether `render()` is present:

- **Primitive**: owns its DOM, MUST have `render()` returning an `html` tagged template. Elena calls `replaceChildren()` on every render.
- **Composite**: wraps composed children, must NOT have `render()`. Never touches light DOM children.
- **Declarative**: hybrid using `<template shadowrootmode="open">` in the HTML markup. No `render()`.

## Props

- Props must be declared in BOTH `static props` AND as class field defaults. Neither alone is sufficient.
- The type is inferred from the default value: `false` → Boolean, `0` → Number, `[]` → Array, `{}` → Object, `"..."` → String.
- `"text"` is a reserved built-in prop. Never include it in `static props` — Elena throws: `"text" is reserved.`
- Use `{ name: "icon", reflect: false }` in `static props` to suppress attribute reflection for a specific prop.
- Annotate every prop with JSDoc `@property` and `@type` on the class field.

## Events

- `static events` tells Elena which events to manage from the inner element.
- Bubbling events (like `click`, `change`, `input`) pass through to the host naturally with all their original properties intact.
- Non-bubbling events (like `focus` and `blur`) are forwarded to the host as plain `Event` instances.
- Never override `handleEvent()` on a component that uses `static events` — Elena uses it internally for delegation.
- Dispatch custom events with `new CustomEvent("my-event", { bubbles: true, composed: true, detail: { value } })`.

## Templates

- `render()` must return an `html` tagged template literal. Import `html` and `nothing` from `@elenajs/core`.
- Use `nothing` (not `""` or `false`) in conditional expressions to avoid template shape changes.
- Nested `html` fragments pass through without double-escaping. Plain string values are auto-escaped (XSS-safe).
- `this.text` captures the element's `textContent` on connect. Use it in `render()` for text content.
- `unsafeHTML(str)` bypasses escaping — only use for trusted, sanitized content.
- `html` does NOT block JavaScript URIs. Always validate URLs before interpolating into `href` or other URL attributes: `const safeUrl = /^https?:\/\//.test(url) ? url : "#";`

## Lifecycle

- `willUpdate()` — runs before every render. Must NOT call `super`. Use for derived state.
- `firstUpdated()` — runs once after the first render. `this.element` is available here.
- `updated()` — runs after every render, including the first. Runs after `firstUpdated()`.
- `this.element` is available in `render()`, lifecycle methods, and custom methods. It is resolved after the first render completes.
- `requestUpdate()` — manually schedule a re-render when Elena cannot detect a change (e.g. mutating an array in place).
- `updateComplete` — Promise that resolves after the current render microtask finishes. Use to await DOM updates: `await element.updateComplete`.
- All lifecycle methods except `willUpdate()` should call `super`.

## Mixins

- Apply mixins after `Elena()`: `class Foo extends Draggable(Elena(HTMLElement)) {}`.
- Mixins that override lifecycle methods must call `super` (except `willUpdate()`).
- Props introduced by a mixin must be listed in `static props` on the final concrete class.

## Registration

- Always call `ClassName.define()` after the class body, not inside it.
- `define()` is a no-op in non-browser environments (SSR-safe).

## Framework compatibility

- Never render a framework component inside a Primitive Component. Elena calls `replaceChildren()` on render, destroying the framework tree.
- For dynamic text content in frameworks, use the `text` property: `<elena-button text={label} />`. Children won't update after hydration.
- Avoid letting the framework and Elena both mutate the same attribute — the framework's reconciler will win on next render.
- **Angular:** Text children are inserted after `connectedCallback` fires, so Elena has already replaced the host's inner DOM by then. Always use `text` as a property binding, never as a child node: `<elena-button [text]="label"></elena-button>`.
- **React 17:** Does not pass `Array` or `Object` type props or event handlers to custom elements correctly. Use React 18+ or pass all props as string attributes.
