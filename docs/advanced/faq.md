---
title: Frequently asked questions (FAQ)
description: Frequently asked questions about Elena, Progressive Web Components, browser support, and common patterns.
---

# Frequently asked questions (FAQ)

## What is Elena?

**Elena is a simple, tiny library for building [Progressive Web Components](/components/overview).** Unlike most web component libraries, Elena doesn’t force JavaScript for everything. You can load HTML and CSS first, then use JavaScript to progressively add interactivity.

## Can I build normal web components with Elena?

[Progressive Web Components](/components/overview) is a design philosophy rather than a library feature. This means that Elena supports building any kind of web component and you have the freedom to choose how to build yours. 

The full standard custom element lifecycle and features such as `open` or `closed` Shadow DOM, `<template>`, `<slot>` and even [Declarative Shadow DOM](/components/templates#declarative-shadow-dom) are all supported out of the box with Elena.

## Why was Elena created?

Elena was created by [@arielle](https://arielsalminen.com) after nearly a decade of building enterprise-scale design systems with [web components](https://arielsalminen.com/2019/why-we-use-web-components/). The recurring pain points were often similar: accessibility issues, server-side rendering, layout shifts, flash of invisible content, React Server Components, too much reliance on client-side JavaScript, and compatibility with e.g. third-party analytics tools.

Elena was built to solve these problems while staying grounded in web standards and what the platform natively provides. This is how _“Progressive Web Components”_ were born.

## Why should I use Elena?

**Elena is built for teams creating component libraries and design systems.** If you need web components that work across multiple frameworks (such as [React](https://react.dev), [Next.js](https://nextjs.org), [Vue](https://vuejs.org), [Angular](https://angular.dev)), render HTML and CSS before JavaScript loads, and sidestep common issues like accessibility problems, SSR limitations, and layout shifts, Elena is built for exactly that.

It handles the cross-framework complexity (prop/attribute syncing, event delegation, framework compatibility) so you can focus on building components rather than plumbing.

## What is a Progressive Web Component?

A [Progressive Web Component](/components/overview) is a native Custom Element designed in two layers: a base layer of HTML and CSS that renders immediately, without JavaScript, and an enhancement layer of JavaScript that adds reactivity, event handling, and more advanced templating.

## How is Elena tested?

Elena has a comprehensive automated test suite with 1000+ tests across 57 test files covering unit tests, integration tests, visual diff tests, and benchmark tests:

<img src="/tests.webp" loading="lazy" width="1636" height="2212" alt="Elena vitest test suite" />

Additionally, the `@elenajs/core` library is proud to ship with 100% test coverage across all of its source code:

<img src="/coverage.webp" loading="lazy" width="1764" height="1040" alt="Elena vitest coverage report for @elenajs/core" />

## What is the browser support?

As a baseline, Elena’s progressive approach supports any web browser that’s capable of rendering Custom Elements. After that, it’s up to you to determine what is appropriate for your project when authoring CSS styles and JavaScript interactivity. Elena, the JavaScript library, supports the following browser versions:

- Chrome 71+
- Firefox 69+
- Safari 12.1+
- Edge 79+
- Opera 58+

## Can I use Elena in any project?

Yes. Elena is licensed under the [MIT License](https://opensource.org/licenses/MIT), which means you can use it in personal, commercial, and open source projects. You can modify, distribute, and sublicense it freely. The only requirement is that you include the original copyright notice and license text in any copy or substantial portion of the software.

## Does Elena require a build step?

No. Elena components are vanilla HTML, CSS, and JavaScript and work directly in the browser with a `<script type="module">` tag. No build step, compiler, or transpilation is required. The `@elenajs/bundler` package is available for production optimization: it minifies CSS and JavaScript, generates a Custom Elements Manifest, and produces TypeScript declarations, but it’s entirely optional.

## Can I use Elena with TypeScript?

Yes. Elena itself is written in vanilla JavaScript with JSDoc type annotations, but the `@elenajs/bundler` supports `.ts` component files out of the box. Running `elena build` on a TypeScript project will transpile your components and generate per-component `.d.ts` declaration files automatically.

## Does Elena support server-side rendering?

Yes. Elena’s approach to server-side rendering is simple and straightforward. Since [Progressive Web Components](/components/overview) are primarily HTML and CSS, you don’t need any special logic on the server to render them.

Components without a `render()` method are fully SSR-compatible by default, while components with `render()` provide partial support and complete hydration on the client&nbsp;side.

The “partial support” for the latter means that you can render the initial state without JavaScript, but JS is needed for the interactivity _(unless you also use the provided [@elenajs/ssr](/advanced/ssr#rendering-to-html-strings) tool)._

Elena also supports [Declarative Shadow DOM](/advanced/ssr#declarative-shadow-dom) for cases where you may need stronger isolation, but still want the component to render server-side.

## How does Elena handle accessibility?

Elena uses Light DOM by default, which means assistive technologies like screen readers have full access to the component’s content, just like any other HTML element. There are no Shadow DOM boundaries breaking label or ARIA associations unless you explicitly opt-in. Components are built on semantic HTML, so standard accessibility practices apply without workarounds.

## Is Elena production-ready?

Elena is actively maintained, has a comprehensive test suite, and follows [Semantic Versioning](https://semver.org/). It was built from real-world experience shipping enterprise design systems. That said, Elena is still a young project and there may be bugs which we haven’t found just yet. Check the [changelog](https://github.com/arielsalminen/elena/releases) for the latest updates.

## What are you using to generate the documentation?

Elena’s documentation is built with [VitePress](https://vitepress.dev), a static site generator powered by Vite and Vue. The component API references are generated from the [Custom Elements Manifest](https://custom-elements-manifest.open-wc.org), which is produced automatically by Elena’s build tooling.

## How do you version Elena?

Elena follows [Semantic Versioning](https://semver.org/). Under this scheme, version numbers and the way they change convey meaning about the underlying features and what has been modified from one version to the next.

## How can I contribute?

See the [contributing guidelines](https://github.com/arielsalminen/elena/blob/main/CONTRIBUTING.md) on GitHub.

## I found a bug. How do I report it?

First, make sure the bug is reproducible. Once confirmed, [create a new issue](https://github.com/arielsalminen/elena/issues/new/choose) on GitHub.
