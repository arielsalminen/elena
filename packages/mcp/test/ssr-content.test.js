import { describe, it, expect } from "vitest";
import { SSR_CONTENT } from "../src/lib/ssr-content.js";

describe("SSR_CONTENT", () => {
  it("is a non-empty string", () => {
    expect(typeof SSR_CONTENT).toBe("string");
    expect(SSR_CONTENT.length).toBeGreaterThan(0);
  });

  it("documents layout shift avoidance", () => {
    expect(SSR_CONTENT).toContain("layout shift");
    expect(SSR_CONTENT).toContain(":not([hydrated])");
  });

  it("documents the @elenajs/ssr package", () => {
    expect(SSR_CONTENT).toContain("@elenajs/ssr");
    expect(SSR_CONTENT).toContain("register");
    expect(SSR_CONTENT).toContain("ssr(");
  });

  it("documents Eleventy integration", () => {
    expect(SSR_CONTENT).toContain("Eleventy");
    expect(SSR_CONTENT).toContain("addTransform");
  });

  it("covers both component types", () => {
    expect(SSR_CONTENT).toContain("without a `render()` method");
    expect(SSR_CONTENT).toContain("components with `render()`");
  });

  it("documents client-side hydration", () => {
    expect(SSR_CONTENT).toContain("hydrat");
    expect(SSR_CONTENT).toContain("connectedCallback");
  });

  it("documents pre-rendering without a framework", () => {
    expect(SSR_CONTENT).toContain("Pre-rendering without a framework");
    expect(SSR_CONTENT).toContain("build.mjs");
  });

  it("includes framework example project links", () => {
    expect(SSR_CONTENT).toContain("github.com/arielsalminen/eleventy-example-project");
    expect(SSR_CONTENT).toContain("github.com/arielsalminen/html-example-project");
    expect(SSR_CONTENT).toContain("github.com/arielsalminen/next-example-project");
  });
});
