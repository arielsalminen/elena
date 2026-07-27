---
title: Live examples
description: Live demo of Elena’s Progressive Web Components on a regular page without any server-side configuration.
ssr: false
head:
  - - link
    - rel: preload
      href: /components/bundle.js
      as: script
      crossOrigin: anonymous
  - - script
    - type: module
      src: /components/bundle.js
---

<script setup>
import { ref, computed, onMounted } from "vue";

const count = ref(0);
const variants = ["primary", "danger", "default"];
const variantIndex = ref(0);
const currentVariant = computed(() => variants[variantIndex.value]);
const cycleButtonText = computed(() => `Click to cycle (${currentVariant.value})`);

function cycleVariant() {
  variantIndex.value = (variantIndex.value + 1) % variants.length;
}
</script>

# Live examples

This page demonstrates Elena’s [Progressive Web Components](/components/overview) on a regular page without any server-side configuration. This is the recommended way to consume them. It  gives you almost identical loading experience compared to using the experimental `@elenajs/ssr` tool. You can compare with a&nbsp;[version that has pre-rendering](/examples/pre-rendered) to see the difference.

## Basic example

<div class="elena-demo">
  <elena-stack direction="row">
    <elena-button type="submit">Button</elena-button>
    <elena-button icon="<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M20 16a1 1 0 0 1 1 1v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2a1 1 0 0 1 2 0v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1v-2a1 1 0 0 1 1 -1m-8 -13a1 1 0 0 1 1 1v9.585l3.293 -3.292a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1 -.09 .08l.09 -.08a1 1 0 0 1 -.674 .292l-.033 .001h-.032l-.054 -.004l.086 .004a1 1 0 0 1 -.617 -.213a1 1 0 0 1 -.09 -.08l-5 -5a1 1 0 0 1 1.414 -1.414l3.293 3.292v-9.585a1 1 0 0 1 1 -1' /></svg>">Download</elena-button>
    <elena-button label="Settings" icon="<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path fill='none' d='M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065' /><path fill='none' d='M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0' /></svg>"></elena-button>
  </elena-stack>
</div>

```html
<elena-stack>
  <elena-button type="submit">Button</elena-button>
  <elena-button icon="download">Download</elena-button>
  <elena-button label="Settings" icon="settings"></elena-button>
</elena-stack>
```

## Component variants

<div class="elena-demo">
  <elena-stack direction="row">
    <elena-button variant="primary">Primary</elena-button>
    <elena-button variant="primary" icon="<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M8 9l4 -4l4 4' fill='none'/><path fill='none' d='M16 15l-4 4l-4 -4'/></svg>">Primary</elena-button>
    <elena-button variant="default">Default</elena-button>
    <elena-button variant="danger">Danger</elena-button>
    <elena-button variant="outline">Outline</elena-button>
    <elena-button disabled>Disabled</elena-button>
  </elena-stack>
</div>

```html
<elena-stack>
  <elena-button variant="primary">Primary</elena-button>
  <elena-button variant="primary" icon="sort">Primary</elena-button>
  <elena-button>Default</elena-button>
  <elena-button variant="danger">Danger</elena-button>
  <elena-button variant="outline">Outline</elena-button>
  <elena-button disabled>Disabled</elena-button>
</elena-stack>
```

## Component sizes

<div class="elena-demo">
  <elena-stack direction="row">
    <elena-button size="sm" icon="<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M5 12l5 5l10 -10'/></svg>">Small</elena-button>
    <elena-button size="md" icon="<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M5 12l5 5l10 -10'/></svg>">Medium</elena-button>
    <elena-button size="lg" icon="<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M5 12l5 5l10 -10'/></svg>">Large</elena-button>
  </elena-stack>
</div>

```html
<elena-stack>
  <elena-button size="sm" icon="checked">Small</elena-button>
  <elena-button size="md" icon="checked">Medium</elena-button>
  <elena-button size="lg" icon="checked">Large</elena-button>
</elena-stack>
```

## Components as links

<div class="elena-demo">
  <elena-stack direction="row">
    <elena-button href="https://github.com/arielsalminen/elena" variant="primary">Elena on GitHub</elena-button>
    <elena-button href="https://elenajs.com" target="_blank" icon="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6'/><path d='M11 13l9 -9'/><path d='M15 4h5v5'/></svg>">External</elena-button>
    <elena-button href="#file" download icon="<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M20 16a1 1 0 0 1 1 1v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2a1 1 0 0 1 2 0v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1v-2a1 1 0 0 1 1 -1m-8 -13a1 1 0 0 1 1 1v9.585l3.293 -3.292a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1 -.09 .08l.09 -.08a1 1 0 0 1 -.674 .292l-.033 .001h-.032l-.054 -.004l.086 .004a1 1 0 0 1 -.617 -.213a1 1 0 0 1 -.09 -.08l-5 -5a1 1 0 0 1 1.414 -1.414l3.293 3.292v-9.585a1 1 0 0 1 1 -1' /></svg>">Download</elena-button>
  </elena-stack>
</div>

```html
<elena-stack>
  <elena-button href="#" variant="primary">Elena on GitHub</elena-button>
  <elena-button href="#" target="_blank" icon="external">External</elena-button>
  <elena-button href="#" download icon="download">Download</elena-button>
</elena-stack>
```

## Interactive components

<div class="elena-demo">
  <elena-stack direction="row">
    <elena-button variant="primary" @click="count++">Increment</elena-button>
    <elena-button variant="danger" @click="count = 0">Reset</elena-button>
  </elena-stack>
  <p><strong>Count:</strong> "{{ count }}"</p>
</div>

```html
<elena-stack>
  <elena-button variant="primary">Increment</elena-button>
  <elena-button variant="danger">Reset</elena-button>
</elena-stack>
```

## Dynamic components

<div class="elena-demo">
  <elena-stack direction="row">
    <elena-button :variant="currentVariant" :text="cycleButtonText" @click="cycleVariant">Click to cycle (primary)</elena-button>
    <elena-button :variant="currentVariant" :text="currentVariant" @click="cycleVariant">primary</elena-button>
  </elena-stack>
  <p><strong>Current:</strong> "{{ currentVariant }}"</p>
</div>

```html
<elena-stack>
  <elena-button variant="primary">Click to cycle (primary)</elena-button>
  <elena-button variant="primary">primary</elena-button>
</elena-stack>
```

## Full width components

<div class="elena-demo">
  <elena-button variant="primary" expand>Full width</elena-button>
</div>

```html
<elena-button variant="primary" expand>Full width</elena-button>
```

## Animated components

<div class="elena-demo">
  <elena-stack direction="row">
    <elena-button variant="primary" loading>Loading...</elena-button>
    <elena-button variant="danger" loading>Loading...</elena-button>
    <elena-button loading>Loading...</elena-button>
  </elena-stack>
</div>

```html
<elena-stack>
  <elena-button loading variant="primary">Loading...</elena-button>
  <elena-button loading variant="danger">Loading...</elena-button>
  <elena-button loading>Loading...</elena-button>
</elena-stack>
```

## Styling components

<div class="elena-demo">
  <elena-stack direction="row">
    <elena-button style="--elena-button-bg: #ffddd2; --elena-button-border: #ffddd2; --elena-button-text: #463634">Custom style</elena-button>
    <elena-button style="--elena-button-bg: #ffddd2; --elena-button-border: #ffddd2; --elena-button-text: #463634" icon="<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3' /></svg>">Like</elena-button>
    <elena-button style="--elena-button-bg: #ffddd2; --elena-button-border: #ffddd2; --elena-button-text: #463634" label="Love" icon="<svg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' /></svg>"></elena-button>
  </elena-stack>
</div>

```html
<elena-stack>
  <elena-button style="--bg:x">Custom style</elena-button>
  <elena-button style="--bg:x" icon="thumb">Like</elena-button>
  <elena-button style="--bg:x" label="Love" icon="heart"></elena-button>
</elena-stack>
```

## Example library

**[@elenajs/components](https://github.com/arielsalminen/elena/tree/main/packages/components)** is a reference component library built with Elena. It demonstrates real-world component patterns and is available as a starting point for your own library.

::: code-group

```sh [npm]
npm install @elenajs/components
```

```sh [yarn]
yarn add @elenajs/components
```

```sh [pnpm]
pnpm add @elenajs/components
```

```sh [bun]
bun add @elenajs/components
```

:::

It includes the following components:

| Component              | Tag                      | Description                                                     |
| ---------------------- | ------------------------ | --------------------------------------------------------------- |
| Button                 | `<elena-button>`         | Renders a `<button>` or `<a>` with variants, states, and icons. |
| Spinner                | `<elena-spinner>`        | Animated loading indicator that inherits the current color.     |
| Stack                  | `<elena-stack>`          | Flexbox layout wrapper with configurable direction and gap.     |
| Visually Hidden        | `<elena-visually-hidden>`| Hides content visually while keeping it accessible.             |

### Usage

Import the full bundle to register all components:

```js
import "@elenajs/components";
```

Or import individual components for better tree-shaking:

```js
import "@elenajs/components/dist/button.js";
import "@elenajs/components/dist/stack.js";
```

Each component has a matching CSS file:

```css
@import "@elenajs/components/dist/button.css";
@import "@elenajs/components/dist/stack.css";
```

Or import the full CSS bundle:

```css
@import "@elenajs/components/dist/bundle.css";
```

The source code is in `packages/components/` of the [Elena monorepo](https://github.com/arielsalminen/elena) and serves as an example of how to structure, build, and publish a library with `@elenajs/bundler`.

## Next steps

- For more details, view [Component Libraries](/advanced/libraries).
- Explore [Framework Integration](/advanced/frameworks) examples for React, Vue, Angular, Next.js and more.
- Browse our [FAQ](/advanced/faq) for frequently asked questions.
- Try Elena in the [Playground](/playground/).
