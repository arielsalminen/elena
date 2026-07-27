---
title: Framework integrations
description: Elena works with any JavaScript framework. It uses standard web platform APIs, so framework compatibility comes for free without any special adapters or wrappers.
---

# Framework integrations

Elena works with any JavaScript framework. It uses standard web platform APIs, so framework compatibility comes for free without any special adapters or wrappers.

## Plain HTML

Since Elena ships as ES modules, you can load your components directly on a webpage. Here’s an example that loads the `@elenajs/components` from [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/@elenajs/components/dist/bundle.js" type="module"></script>
<link rel="stylesheet" href="https://unpkg.com/@elenajs/components/dist/bundle.css" />
```

This registers all Elena components globally as standard HTML tags.

**[View plain HTML example project →](https://github.com/arielsalminen/html-example-project)**

## Eleventy

Install your own Elena component library as a dependency, then copy the bundle to the output directory via `addPassthroughCopy` in `eleventy.config.js`. This example uses the existing `@elenajs/components` for demo purposes:

```js
eleventyConfig.addPassthroughCopy({
  "node_modules/@elenajs/components/dist/bundle.js": "assets/bundle.js",
  "node_modules/@elenajs/components/dist/bundle.css": "assets/bundle.css",
});
```

Now you can reference the bundle in your template:

```html
<script src="/assets/bundle.js" type="module"></script>
<link rel="stylesheet" href="/assets/bundle.css" />
```

This registers all Elena components globally, making them available as standard HTML tags in any Nunjucks, Liquid, or Markdown template.

For server-side rendering with Eleventy, see [Pre-rendering with Eleventy](/advanced/ssr#pre-rendering-with-eleventy).

**[View Eleventy example project →](https://github.com/arielsalminen/eleventy-example-project)**

## Next.js

Because Elena components access the DOM on hydration, Next.js needs to be configured in a way that supports this. To achieve this, create a `"use client"` component with `useEffect` to defer Elena hydration to the browser:

```tsx
// src/elements-registry.tsx
"use client";

import { useEffect } from "react";

export default function ElementsRegistry() {
  useEffect(() => {
    import("@elenajs/components");
  }, []);

  return null;
}
```

Mount it once in the root layout so components are available everywhere. Elena components can then be used directly in Server Components for markup and styles, with interactivity handled by client components.

### TypeScript

Create a type declaration file to wire Elena’s types into React’s JSX namespace:

```ts
// src/elena.d.ts
import type { CustomElements } from "@elenajs/components";

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

**[View Next.js example project →](https://github.com/arielsalminen/next-example-project)**

## React

Import the component library and its styles, then use the components as regular JSX tags:

```tsx
import "@elenajs/components/dist/bundle.js";
import "@elenajs/components/dist/bundle.css";

function App() {
  return (
    <elena-button variant="primary" onClick={() => console.log("clicked!")}>
      Click me
    </elena-button>
  );
}
```

### TypeScript

When using Vite’s `"jsx": "react-jsx"` transform, augment both the production and development JSX runtimes:

```ts
// src/elena.d.ts
import type { CustomElements } from "@elenajs/components";

type ElenaIntrinsicElements = {
  [K in keyof CustomElements]: CustomElements[K] & {
    onClick?: (e: MouseEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    children?: React.ReactNode;
  };
};

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements extends ElenaIntrinsicElements {}
  }
}

declare module "react/jsx-dev-runtime" {
  namespace JSX {
    interface IntrinsicElements extends ElenaIntrinsicElements {}
  }
}
```

Make sure `tsconfig.json` includes the `src` directory, then restart the TypeScript server in your editor after adding the file.

**[View React example project →](https://github.com/arielsalminen/react-example-project)**

## Svelte

Import the component library and its styles, then use the components as regular template tags:

```svelte
<script lang="ts">
  import "@elenajs/components/dist/bundle.js";
  import "@elenajs/components/dist/bundle.css";
</script>

<elena-button variant="primary" onclick={() => console.log("clicked!")}>Click me</elena-button>
```

### TypeScript

Extend `SvelteHTMLElements` with Elena’s `CustomElements` type map:

```ts
// src/elena.d.ts
import type { CustomElements } from "@elenajs/components";

declare module "svelte/elements" {
  interface SvelteHTMLElements extends CustomElements {}
}
```

The [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) extension is required for template type checking.

**[View Svelte example project →](https://github.com/arielsalminen/svelte-example-project)**

## Vue

Import the component library and its styles, then use the components as regular template tags:

```vue
<script setup lang="ts">
import "@elenajs/components/dist/bundle.js";
import "@elenajs/components/dist/bundle.css";
</script>

<template>
  <elena-button variant="primary" @click="() => console.log('clicked!')">Click me</elena-button>
</template>
```

### TypeScript

Map Elena’s `CustomElements` into Vue’s `GlobalComponents` interface:

```ts
// src/elena.d.ts
import type { CustomElements } from "@elenajs/components";
import type { DefineComponent } from "vue";

type ElenaComponents = {
  [K in keyof CustomElements]: DefineComponent<CustomElements[K]>;
};

declare module "vue" {
  interface GlobalComponents extends ElenaComponents {}
}
```

The [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension is required for template type checking.

**[View Vue example project →](https://github.com/arielsalminen/vue-example-project)**

## Angular

Import the component library and its styles in a component, add `CUSTOM_ELEMENTS_SCHEMA` to the `schemas` array, then use the components as regular template tags:

```typescript
// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "@elenajs/components/dist/bundle.js";
import "@elenajs/components/dist/bundle.css";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  onClick() {
    console.log("clicked!");
  }
}
```

```html
<!-- app.component.html -->
<elena-button variant="primary" (click)="onClick()" text="Click me"></elena-button>
```

`CUSTOM_ELEMENTS_SCHEMA` tells Angular’s template compiler to accept unknown element names without errors. It also bypasses Angular’s template type-checker for these elements, so no additional type declarations are needed.

### Angular-specific syntax

| Concept           | Syntax                          |
| ----------------- | ------------------------------- |
| Event binding     | `(click)="handler()"`           |
| Dynamic attribute | `[attr.variant]="value"`        |
| Reactive state    | `signal()` from `@angular/core` |

**[View Angular example project →](https://github.com/arielsalminen/angular-example-project)**

> [!TIP]
> The provided examples import the existing `@elenajs/components` for demo purposes. Replace it with your own component library for production usage.

## Next steps

- For integration rules and framework-specific notes, see [Known issues](/advanced/gotchas#javascript-frameworks).
- For SSR-specific notes, see [Server-side rendering](/advanced/ssr).
