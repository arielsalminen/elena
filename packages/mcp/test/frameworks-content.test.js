import { describe, it, expect } from "vitest";
import { FRAMEWORKS_CONTENT } from "../src/lib/frameworks-content.js";

describe("FRAMEWORKS_CONTENT", () => {
  it("is a non-empty string", () => {
    expect(typeof FRAMEWORKS_CONTENT).toBe("string");
    expect(FRAMEWORKS_CONTENT.length).toBeGreaterThan(0);
  });

  it("covers all major frameworks", () => {
    expect(FRAMEWORKS_CONTENT).toContain("Plain HTML");
    expect(FRAMEWORKS_CONTENT).toContain("Eleventy");
    expect(FRAMEWORKS_CONTENT).toContain("Next.js");
    expect(FRAMEWORKS_CONTENT).toContain("React");
    expect(FRAMEWORKS_CONTENT).toContain("Svelte");
    expect(FRAMEWORKS_CONTENT).toContain("Vue");
    expect(FRAMEWORKS_CONTENT).toContain("Angular");
  });

  it("documents the text property workaround for Primitive Components", () => {
    expect(FRAMEWORKS_CONTENT).toContain("text");
    expect(FRAMEWORKS_CONTENT).toContain("replaceChildren");
  });

  it("documents Angular text binding caveat", () => {
    expect(FRAMEWORKS_CONTENT).toContain("[text]");
    expect(FRAMEWORKS_CONTENT).toContain("connectedCallback");
  });

  it("documents React 17 limitation", () => {
    expect(FRAMEWORKS_CONTENT).toContain("React 17");
    expect(FRAMEWORKS_CONTENT).toContain("React 18");
  });

  it("documents TypeScript setup for at least one framework", () => {
    expect(FRAMEWORKS_CONTENT).toContain("CustomElements");
    expect(FRAMEWORKS_CONTENT).toContain(".d.ts");
  });

  it("includes example project links", () => {
    expect(FRAMEWORKS_CONTENT).toContain("github.com/arielsalminen/html-example-project");
    expect(FRAMEWORKS_CONTENT).toContain("github.com/arielsalminen/react-example-project");
    expect(FRAMEWORKS_CONTENT).toContain("github.com/arielsalminen/angular-example-project");
  });
});
