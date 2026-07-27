---
title: Using TypeScript
description: Learn how to use TypeScript with Elena, including authoring components in TS, generated type declarations, and JSX type support.
---

# Using TypeScript

Elena is written in vanilla JavaScript with JSDoc annotations. The **`@elenajs/core`** library ships its own type declarations (`dist/elena.d.ts`) which are generated automatically by `tsc` from the JSDoc so that you get full IntelliSense and type checking.

```ts
import { Elena, html, unsafeHTML, nothing } from "@elenajs/core";
```

For advanced typing, you can also import the utility types directly:

```ts
import type {
  ElenaPropObject,
  ElenaElementConstructor,
  ElenaConstructor 
} from "@elenajs/core";
```

## Generating types

When you build your own Elena components, **`@elenajs/bundler`** can generate TypeScript declarations for each one. Running `elena build` produces:

- **Per-component `.d.ts` files**: A declaration file for each component (e.g. `button.d.ts`) with typed props and event handlers, derived from your JSDoc annotations. This lets TypeScript resolve sub-path imports like `@my-lib/components/dist/button.js`.
- **`custom-elements.json`**: The [Custom Elements Manifest](https://custom-elements-manifest.open-wc.org/), a machine-readable description of your components used by IDEs and documentation tools.
- **`custom-elements.d.ts`**: JSX integration types that map your custom element tag names to their prop types. This enables autocomplete and type checking for `<my-button variant="primary" />` in JSX/TSX files.

## Using the generated types

The generated `custom-elements.d.ts` exports a `CustomElements` type map. To get type checking in JSX (this works with Next.js, see further down for more examples):

```ts
// types.d.ts (in your consuming project)
import type { CustomElements } from "@my-lib/components";

type ElenaIntrinsicElements = {
  [K in keyof CustomElements]: CustomElements[K] & {
    onClick?: (e: MouseEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    children?: React.ReactNode;
  };
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends ElenaIntrinsicElements {}
  }
}
```

## TypeScript examples

Elena provides TypeScript examples for the following JavaScript frameworks:

- **[Next.js](https://github.com/arielsalminen/next-example-project)**
- **[React](https://github.com/arielsalminen/react-example-project)**
- **[Svelte](https://github.com/arielsalminen/svelte-example-project)**
- **[Vue](https://github.com/arielsalminen/vue-example-project)**

## Authoring with TypeScript

`elena build` auto-detects `.ts` files in your source directory and transpiles them via `@rollup/plugin-typescript`. No extra configuration is needed: write `.ts` files and the bundler handles the rest.

When using TypeScript to author Elena components, you can add inline type annotations directly to your instance field declarations:

```ts
/**
 * The style variant of the component.
 * @property
 */
variant: "default" | "primary" | "danger" = "default";
```

### Typing `static props` with `ElenaPropObject`

When using `{ name, reflect }` objects in `static props`, import `ElenaPropObject` to type the array:

```ts
import type { ElenaPropObject } from "@elenajs/core";

export default class Button extends Elena(HTMLElement) {
  static props: (string | ElenaPropObject)[] = [
    { name: "icon", reflect: false },
  ];
}
```
