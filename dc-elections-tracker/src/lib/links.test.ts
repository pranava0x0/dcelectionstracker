import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("path() with NEXT_PUBLIC_BASE_PATH unset (dev)", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    vi.resetModules();
  });

  it("returns absolute paths unchanged", async () => {
    const { path } = await import("./links");
    expect(path("/")).toBe("/");
    expect(path("/issues/statehood/")).toBe("/issues/statehood/");
  });

  it("returns external URLs unchanged", async () => {
    const { path } = await import("./links");
    expect(path("https://example.com")).toBe("https://example.com");
    expect(path("http://example.com")).toBe("http://example.com");
  });

  it("returns non-slash strings unchanged (mailto, anchors, relative)", async () => {
    const { path } = await import("./links");
    expect(path("mailto:foo@bar.com")).toBe("mailto:foo@bar.com");
    expect(path("#main-content")).toBe("#main-content");
    expect(path("foo")).toBe("foo");
  });
});

describe("path() with NEXT_PUBLIC_BASE_PATH set (production)", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/dcelectionstracker");
    vi.resetModules();
  });

  it("prepends basePath to absolute paths", async () => {
    const { path } = await import("./links");
    expect(path("/")).toBe("/dcelectionstracker/");
    expect(path("/issues/statehood/")).toBe(
      "/dcelectionstracker/issues/statehood/",
    );
  });

  it("does not prepend basePath to external URLs (UAT-005 behavior)", async () => {
    const { path } = await import("./links");
    expect(path("https://example.com")).toBe("https://example.com");
    expect(path("http://example.com")).toBe("http://example.com");
  });

  it("does not prepend basePath to mailto / anchor / relative", async () => {
    const { path } = await import("./links");
    expect(path("mailto:foo@bar.com")).toBe("mailto:foo@bar.com");
    expect(path("#main-content")).toBe("#main-content");
    expect(path("foo")).toBe("foo");
  });
});

describe("isExternal()", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    vi.resetModules();
  });

  it("recognizes http and https URLs", async () => {
    const { isExternal } = await import("./links");
    expect(isExternal("http://example.com")).toBe(true);
    expect(isExternal("https://example.com/path")).toBe(true);
  });

  it("rejects internal paths and other schemes", async () => {
    const { isExternal } = await import("./links");
    expect(isExternal("/issues/statehood/")).toBe(false);
    expect(isExternal("mailto:foo@bar.com")).toBe(false);
    expect(isExternal("#main-content")).toBe(false);
    expect(isExternal("foo")).toBe(false);
  });
});
