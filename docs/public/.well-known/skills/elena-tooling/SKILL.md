---
name: elena-tooling
description: Critical rules for the Elena build toolchain. Bundler config, CLI scaffolding, Custom Elements Manifest, SSR with @elenajs/ssr, and TypeScript.
---

# Elena Tooling — Critical Rules

> Full reference: https://elenajs.com/llms-full.txt
> Page index: https://elenajs.com/llms.txt

## Bundler

- Run `elena build` or `elena watch` from the project root. Reads `elena.config.mjs` (or `elena.config.js`). Use `--config <path>` to specify a custom config file.
- Set `bundle: false` to disable the single-file bundle. Individual component modules are always built regardless. The bundler auto-detects `src/index.ts` as the entry point if `src/index.js` doesn't exist.
- Set `analyze: false` to skip Custom Elements Manifest and TypeScript declaration generation entirely.
- The `target` option enables syntax transpilation for older browser support (e.g. `["chrome 71", "safari 12.1"]`). Off by default.
- TypeScript source files are auto-detected — no extra config needed.

## Custom Elements Manifest

- Props without a `@property` JSDoc annotation won't appear in `custom-elements.json`.
- Run `elena build` before using `@elenajs/mcp` — the server reads `dist/custom-elements.json`. Without it, component lookup returns errors.

## CLI scaffolding

- `npx elena-create` — interactive prompts for component name, features, CSS variables, and language (JS/TS/HTML).
- Pass a kebab-case name with at least one hyphen to skip the name prompt: `npx elena-create my-button`.

## SSR

> `@elenajs/ssr` is experimental and not yet ready for production use. APIs may change without notice.

- Call `register(...components)` before calling `ssr(html)`. Each class must have a `tagName` defined.
- `ssr()` only expands registered components that have `render()`. Composite Components (no `render()`) don't need registration: they're fully SSR-compatible by default.
- If a component's `render()` throws, the SSR renderer logs a warning and passes it through without expansion.
- The output is a raw HTML string. Serve it as-is; the client bundle hydrates it when JavaScript loads.

## TypeScript

- In `.ts` files, use inline types instead of `@type` JSDoc: `variant: "default" | "primary" = "default"`.
- Keep the `@property` JSDoc annotation on each prop — it's still required for the CEM analyzer.
