---
name: elena-styles
description: Critical CSS rules for Elena components. @scope encapsulation, all:unset reset for Primitives only, SSR hydration pattern, theming, and browser bug workarounds.
---

# Elena Styles — Critical Rules

> Full reference: https://elenajs.com/llms-full.txt
> Page index: https://elenajs.com/llms.txt

## @scope

Use `@scope (tag-name)` to prevent component styles from leaking out to the page. As an alternative, you can use CSS cascade layers (`@layer`) to control style precedence instead of `all: unset`.

## Encapsulation reset

**Primitive Components: include the reset. Composite Components: do NOT.**

The reset prevents global styles from leaking into the component:

```css
@scope (elena-button) {
  :scope,
  *:where(:not(img, svg):not(svg *)),
  *::before,
  *::after {
    all: unset;
    display: revert;
  }
}
```

- The `:where(:not(img, svg):not(svg *))` exclusion is required — do not simplify to `*`. It preserves image and SVG rendering.
- `display: revert` restores browser default display values after `all: unset` removes them.
- Composite Components intentionally let global styles flow in — no reset.

## SSR hydration pattern

Style both the host before hydration AND the rendered inner element with the same baseline styles to avoid layout shift:

```css
:scope:not([hydrated]),
.elena-button {
  font-family: var(--_elena-button-font);
  background: var(--_elena-button-bg);
}
```

The `:scope:not([hydrated])` rule applies before JavaScript runs; the inner element selector applies after Elena renders and adds the `[hydrated]` attribute. This pattern only applies to Primitive Components (those with `render()`).

### Pre-hydration pseudo-elements

Use CSS pseudo-elements with `attr()` to surface additional content before hydration:

```css
:scope:not([hydrated])::before {
  content: attr(label);
}

:scope:not([hydrated])::after {
  content: attr(placeholder);
}
```

## Theming

Define CSS custom properties on `:scope` as the public theming API:

```css
:scope {
  /* Public theming API (with default values set) */
  --_elena-button-bg: var(--elena-button-bg, blue);
  --_elena-button-text: var(--elena-button-text, white);

  /* Internal theming API references (usage) */
  background-color: var(--_elena-button-bg);
  color: var(--_elena-button-text);
}
```

Annotate with `@cssprop [--prop-name] - description` JSDoc on the class for CEM documentation.

## Variant and state styling

Use attribute selectors on `:scope` — not descendant selectors:

```css
:scope[variant="primary"] { color: red }
:scope[disabled] { opacity: 0.5 }
```

## Styles without `@scope`

For older browsers that don’t support `@scope`, use namespaced selectors and the `:is()` pattern instead:

```css
/* Reset makes sure styles don’t leak in */
elena-button,
elena-button *:where(:not(img, svg):not(svg *)),
elena-button *::before,
elena-button *::after {
  all: unset;
  display: revert;
}

elena-button {
  display: inline-block;
}

:is(elena-button:not([hydrated]), .elena-button) {
  /* shared styles */
}

elena-button[variant="primary"] {
  /* variant */
}
```


## Composite Component CSS

Composite Components do NOT include the encapsulation reset. Style the host element and provide attribute-based customization:

```css
@scope (elena-stack) {
  :scope {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  :scope[direction="row"] {
    flex-direction: row;
  }
}
```

## Browser bugs

**Firefox 148**: `@scope` combined with `attr[value]` selectors can be buggy. Fixed in Firefox 149+. For broader Firefox support, use namespaced selectors instead of `@scope`.

**Safari 26.3**: `@scope` rules do not apply to `<input>` and `<textarea>`. Fixed in Safari 26.4 and newer. Workaround for older versions: style form controls outside `@scope` using namespaced selectors, e.g. `elena-input input { ... }`.

## Shadow DOM

Opt in with `static shadow = "open"` and `static styles`. Elena renders into the shadow root. `@scope` is not needed inside Shadow DOM. CSS custom properties still pierce the shadow boundary for theming.

**Warning:** Without Declarative Shadow DOM, Shadow DOM breaks progressive enhancement: nothing is visible until JavaScript runs. See Declarative Shadow DOM (`<template shadowrootmode="open">`) for a standards-based alternative.
