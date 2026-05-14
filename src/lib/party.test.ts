import { describe, it, expect } from "vitest";
import { partyTone } from "./party";

describe("partyTone()", () => {
  it("maps Democrat to a blue chip with label 'D'", () => {
    const tone = partyTone("D");
    expect(tone.label).toBe("D");
    expect(tone.stripe).toContain("hsl(210");
    expect(tone.pill).toContain("text-white");
  });

  it("maps Republican to a primary chip with label 'R'", () => {
    const tone = partyTone("R");
    expect(tone.label).toBe("R");
    expect(tone.stripe).toBe("bg-primary");
    expect(tone.pill).toContain("bg-primary");
  });

  it("maps Independent to ink with label 'I'", () => {
    const tone = partyTone("I");
    expect(tone.label).toBe("I");
    expect(tone.stripe).toBe("bg-ink");
    expect(tone.pill).toBe("bg-ink text-white");
  });

  // UAT-003: oversized "Statehood Green" / "Nonpartisan" badges fixed.
  it("abbreviates 'Statehood Green' to 'SG' (UAT-003)", () => {
    const tone = partyTone("Statehood Green");
    expect(tone.label).toBe("SG");
    expect(tone.stripe).toContain("hsl(140");
  });

  it("abbreviates 'Nonpartisan' to 'NP' (UAT-003)", () => {
    const tone = partyTone("Nonpartisan");
    expect(tone.label).toBe("NP");
    expect(tone.stripe).toBe("bg-muted");
    expect(tone.pill).toBe("bg-muted text-white");
  });

  it("falls back to the raw party string for unknown values", () => {
    const tone = partyTone("Whig");
    expect(tone.label).toBe("Whig");
    expect(tone.stripe).toBe("bg-muted");
  });

  it("returns short labels suitable for the h-5 min-w-[20px] chip", () => {
    // The chip is sized for 1-2 character codes. UAT-003 was the bug
    // where "Nonpartisan" overflowed; this asserts every documented party
    // collapses to <=2 chars (the unknown-fallback is intentionally not
    // bounded — it shouldn't fire in production data).
    const documented = ["D", "R", "I", "Statehood Green", "Nonpartisan"];
    for (const p of documented) {
      expect(partyTone(p).label.length).toBeLessThanOrEqual(2);
    }
  });
});
