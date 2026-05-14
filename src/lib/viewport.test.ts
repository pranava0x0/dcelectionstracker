import { describe, it, expect } from "vitest";
import { classifyViewport, BREAKPOINTS } from "./viewport";

describe("classifyViewport()", () => {
  it("classifies typical phone widths as mobile", () => {
    // iPhone SE (320), iPhone 13 (390), Galaxy S20 (412), iPhone 14 Pro Max (430)
    expect(classifyViewport(320)).toBe("mobile");
    expect(classifyViewport(390)).toBe("mobile");
    expect(classifyViewport(412)).toBe("mobile");
    expect(classifyViewport(430)).toBe("mobile");
    expect(classifyViewport(639)).toBe("mobile");
  });

  it("classifies the tablet band (sm…lg) inclusively at sm and exclusively at lg", () => {
    // iPad mini portrait (768), iPad portrait (810), iPad landscape just under lg (1023)
    expect(classifyViewport(640)).toBe("tablet");
    expect(classifyViewport(768)).toBe("tablet");
    expect(classifyViewport(810)).toBe("tablet");
    expect(classifyViewport(1023)).toBe("tablet");
  });

  it("classifies desktop at and above the lg breakpoint", () => {
    // Smallest "desktop" 1024, common laptop 1280, full HD 1920, 4K 2560.
    expect(classifyViewport(1024)).toBe("desktop");
    expect(classifyViewport(1280)).toBe("desktop");
    expect(classifyViewport(1920)).toBe("desktop");
    expect(classifyViewport(2560)).toBe("desktop");
  });

  it("treats a desktop window resized below lg as tablet, and below sm as mobile", () => {
    // The "autodetect on resize" contract: classification is purely a
    // function of width. The same rules apply whether the device is a
    // phone or a desktop browser the user has dragged narrow.
    expect(classifyViewport(1100)).toBe("desktop");
    expect(classifyViewport(900)).toBe("tablet");
    expect(classifyViewport(500)).toBe("mobile");
  });

  it("falls back to mobile on non-finite or zero widths", () => {
    // Defensive fallback: invalid widths (NaN, +/-Infinity) collapse to the
    // most-conservative single-column rendering rather than defaulting
    // desktop and breaking small-screen users.
    expect(classifyViewport(0)).toBe("mobile");
    expect(classifyViewport(Number.NaN)).toBe("mobile");
    expect(classifyViewport(Number.POSITIVE_INFINITY)).toBe("mobile");
    expect(classifyViewport(Number.NEGATIVE_INFINITY)).toBe("mobile");
  });

  it("uses the documented Tailwind-aligned breakpoint constants", () => {
    expect(BREAKPOINTS.tablet).toBe(640);
    expect(BREAKPOINTS.desktop).toBe(1024);
  });
});
