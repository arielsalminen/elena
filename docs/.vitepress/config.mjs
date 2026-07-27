import { defineConfig } from "vitepress";
import footnote from "markdown-it-footnote";
import { copyFile, mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import llmstxt from "vitepress-plugin-llms";
import { elenaSSRPlugin } from "./plugins/elena-ssr.js";

const __themedir = fileURLToPath(new URL("./theme/components", import.meta.url));

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function copyComponentAssets() {
  const src = path.resolve(__dirname, "../../packages/components/dist");
  const dest = path.resolve(__dirname, "../public/components");

  return {
    name: "copy-component-assets",
    async buildStart() {
      try {
        await mkdir(dest, { recursive: true });
        await copyFile(path.join(src, "bundle.js"), path.join(dest, "bundle.js"));
        await copyFile(path.join(src, "bundle.css"), path.join(dest, "bundle.css"));
        await copyFile(path.join(src, "bundle.js.map"), path.join(dest, "bundle.js.map"));
      } catch (e) {
        console.warn("░█ [ELENA]: Could not copy component assets:", e.message);
      }
    },
  };
}

const pathPrefix = process.env.ELENA_PATH || "/";
const noIndex = process.env.ELENA_NOINDEX === "true";

export default defineConfig({
  scrollOffset: 86,
  title: "Elena",
  lang: "en-GB",
  base: pathPrefix,
  ignoreDeadLinks: false,
  sitemap: {
    hostname: "https://elenajs.com",
  },
  description: "Simple, tiny library for building Progressive Web Components.",
  cleanUrls: true,
  transformHtml(html, id, { pageData }) {
    const pagePath = pageData.relativePath.replace(/index\.md$/, "").replace(/\.md$/, "");
    const href = `/${pagePath}`;

    return html.replace(
      new RegExp(
        `(VPSidebarItem level-\\d+ is-link"[^>]*>` +
          `<div class="item"[^>]*>` +
          `<div class="indicator"[^>]*></div>` +
          `<a [^>]*href="${href}")`
      ),
      match => match.replace("VPSidebarItem level-", "VPSidebarItem is-active level-")
    );
  },
  transformPageData(pageData) {
    const isHome = pageData.relativePath === "index.md";
    const title = isHome
      ? "Elena | Progressive Web Components"
      : pageData.title
        ? `${pageData.title} | Elena`
        : "Elena | Progressive Web Components";

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: pageData.description }],
      ["meta", { name: "twitter:description", content: pageData.description }]
    );
  },
  head: [
    ...(noIndex ? [["meta", { name: "robots", content: "noindex, nofollow" }]] : []),
    ["meta", { property: "og:site_name", content: "Elena" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:url", content: "https://elenajs.com/" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { property: "og:image", content: "https://elenajs.com/social.png" }],
    ["meta", { name: "twitter:image", content: "https://elenajs.com/social.png" }],
    ["meta", { property: "og:image:alt", content: "Page image for Elenajs.com" }],
    ["meta", { name: "twitter:image:alt", content: "Page image for Elenajs.com" }],
    ["meta", { name: "fediverse:creator", content: "@ariel@front-end.social" }],

    ["link", { rel: "icon", href: "/favicon.ico", sizes: "48x48" }],
    ["link", { rel: "icon", href: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
    ["link", { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
  ],
  markdown: {
    headers: true,
    toc: {
      level: [1, 2],
    },
    config: md => {
      md.use(footnote);

      // Wrap tables in a scrollable container for small viewports
      md.renderer.rules.table_open = () => '<div class="table-container"><table>';
      md.renderer.rules.table_close = () => "</table></div>";
    },
  },
  vite: {
    plugins: [elenaSSRPlugin(), copyComponentAssets(), llmstxt()],
    resolve: {
      alias: {
        "./VPDocAsideOutline.vue": path.join(__themedir, "VPDocAsideOutline.vue"),
      },
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: tag => tag.startsWith("elena-"),
      },
    },
  },
  themeConfig: {
    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        forceLocale: true,
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
    nav: [
      { text: "Docs", link: "/", activeMatch: "^(?!/api/|/playground/)" },
      { text: "Playground", link: "/playground/", activeMatch: "/playground/" },
      { text: "API Reference", link: "/api/" },
      {
        text: "Tools",
        items: [
          {
            text: "@elenajs/core",
            link: "https://github.com/arielsalminen/elena/tree/main/packages/core",
          },
          {
            text: "@elenajs/bundler",
            link: "https://github.com/arielsalminen/elena/tree/main/packages/bundler",
          },
          {
            text: "@elenajs/cli",
            link: "https://github.com/arielsalminen/elena/tree/main/packages/cli",
          },
          {
            text: "@elenajs/ssr",
            link: "https://github.com/arielsalminen/elena/tree/main/packages/ssr",
          },
          {
            text: "@elenajs/components",
            link: "https://github.com/arielsalminen/elena/tree/main/packages/components",
          },
          {
            text: "@elenajs/plugin-cem-define",
            link: "https://github.com/arielsalminen/elena/tree/main/packages/plugin-cem-define",
          },
          {
            text: "@elenajs/plugin-cem-prop",
            link: "https://github.com/arielsalminen/elena/tree/main/packages/plugin-cem-prop",
          },
          {
            text: "@elenajs/plugin-cem-tag",
            link: "https://github.com/arielsalminen/elena/tree/main/packages/plugin-cem-tag",
          },
          {
            text: "@elenajs/plugin-cem-typescript",
            link: "https://github.com/arielsalminen/elena/tree/main/packages/plugin-cem-typescript",
          },
          {
            text: "@elenajs/plugin-rollup-css",
            link: "https://github.com/arielsalminen/elena/tree/main/packages/plugin-rollup-css",
          },
          {
            text: "@elenajs/mcp",
            link: "https://github.com/arielsalminen/elena/tree/main/packages/mcp",
          },
        ],
      },
      {
        text: "About",
        items: [
          {
            text: "FAQ",
            link: "/advanced/faq",
          },
          {
            text: "Releases",
            link: "https://github.com/arielsalminen/elena/releases",
          },
          {
            text: "Code of conduct",
            link: "/about/code-of-conduct",
          },
          {
            text: "Privacy policy",
            link: "/about/privacy",
          },
          {
            text: "Contributing",
            link: "https://github.com/arielsalminen/elena/blob/main/CONTRIBUTING.md",
          },
          {
            text: "License (MIT)",
            link: "https://github.com/arielsalminen/elena/blob/main/LICENSE",
          },
        ],
      },
    ],

    sidebar: [
      {
        text: "Getting started",
        collapsed: false,
        items: [
          { text: "Introduction", link: "/" },
          { text: "Quick start", link: "/start/" },
          { text: "Live examples", link: "/examples/" },
        ],
      },
      {
        text: "Components",
        collapsed: false,
        items: [
          { text: "Overview", link: "/components/overview" },
          { text: "Lifecycle", link: "/components/lifecycle" },
          { text: "Rendering", link: "/components/rendering" },
          { text: "Options", link: "/components/options" },
          { text: "Props", link: "/components/props" },
          { text: "Events", link: "/components/events" },
          { text: "Methods", link: "/components/methods" },
          { text: "Mixins", link: "/components/mixins" },
          { text: "Templates", link: "/components/templates" },
          { text: "Styles", link: "/components/styles" },
        ],
      },
      {
        text: "Digging deeper",
        collapsed: false,
        items: [
          { text: "Creating documentation", link: "/advanced/docs" },
          { text: "Loading components", link: "/advanced/loading" },
          { text: "Component libraries", link: "/advanced/libraries" },
          { text: "Server-side rendering", link: "/advanced/ssr" },
          { text: "Framework integrations", link: "/advanced/frameworks" },
          { text: "Command line interface", link: "/advanced/cli" },
          { text: "Using TypeScript", link: "/advanced/typescript" },
          { text: "Scoping styles", link: "/advanced/scoping" },
          { text: "Known issues", link: "/advanced/gotchas" },
          { text: "MCP server", link: "/advanced/mcp" },
          { text: "FAQ", link: "/advanced/faq" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/arielsalminen/elena" }],

    search: {
      provider: "local",
      options: {
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 },
          },
        },
      },
    },

    editLink: {
      pattern: "https://github.com/arielsalminen/elena/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright:
        "Copyright © 2025-2026 <a href='https://arielsalminen.com' target='_blank'>Ariel Salminen</a>",
    },
  },
});
