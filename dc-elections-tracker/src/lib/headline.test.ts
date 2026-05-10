import { describe, it, expect } from "vitest";
import { timeUntilPrimaryHeadline } from "./headline";

// Matches PRIMARY_DATE in src/data/elections.ts. Equivalent UTC: 2026-06-16T11:00:00Z.
const PRIMARY = "2026-06-16T07:00:00-04:00";

describe("timeUntilPrimaryHeadline()", () => {
  it("says 'The primary is here.' once the target moment passes", () => {
    expect(
      timeUntilPrimaryHeadline(PRIMARY, new Date("2026-06-16T12:00:00Z").getTime()),
    ).toBe("The primary is here.");
    expect(
      timeUntilPrimaryHeadline(PRIMARY, new Date("2026-07-01T00:00:00Z").getTime()),
    ).toBe("The primary is here.");
  });

  it("says 'The primary is here.' at the exact target moment", () => {
    expect(
      timeUntilPrimaryHeadline(PRIMARY, new Date(PRIMARY).getTime()),
    ).toBe("The primary is here.");
  });

  it("says 'One day until the primary.' with <24h remaining", () => {
    // 12h before target.
    const now = new Date("2026-06-15T23:00:00Z").getTime();
    expect(timeUntilPrimaryHeadline(PRIMARY, now)).toBe(
      "One day until the primary.",
    );
  });

  it("says 'N days until the primary.' for 2-6 days remaining", () => {
    const now = new Date("2026-06-13T11:00:00Z").getTime();
    expect(timeUntilPrimaryHeadline(PRIMARY, now)).toBe(
      "3 days until the primary.",
    );
  });

  it("says 'One week until the primary.' at exactly 7 days out", () => {
    const now = new Date("2026-06-09T11:00:00Z").getTime();
    expect(timeUntilPrimaryHeadline(PRIMARY, now)).toBe(
      "One week until the primary.",
    );
  });

  // UAT-004: hardcoded "Five weeks until the primary." became stale weekly.
  // 2026-05-10 was the headline-on-launch date — same string, but now derived.
  it("says 'Five weeks until the primary.' at 2026-05-10 (UAT-004)", () => {
    const now = new Date("2026-05-10T18:00:00Z").getTime();
    expect(timeUntilPrimaryHeadline(PRIMARY, now)).toBe(
      "Five weeks until the primary.",
    );
  });

  it("uses words for 0-12 weeks", () => {
    // 56 days = exactly 8 weeks
    const now = new Date("2026-04-21T11:00:00Z").getTime();
    expect(timeUntilPrimaryHeadline(PRIMARY, now)).toBe(
      "Eight weeks until the primary.",
    );
  });

  it("falls back to a numeric word when over 12 weeks", () => {
    // ~135 days from primary → ~19 weeks, beyond the NUM_WORDS table.
    const now = new Date("2026-02-01T11:00:00Z").getTime();
    expect(timeUntilPrimaryHeadline(PRIMARY, now)).toBe(
      "19 weeks until the primary.",
    );
  });

  it("rounds to the nearest week (not floor) for the headline framing", () => {
    // 38 days remaining → 38/7 = 5.43 → round = 5 weeks, not 6.
    // (Math.ceil for days, Math.round for weeks — see headline.ts.)
    const now = new Date("2026-05-09T11:00:00Z").getTime();
    expect(timeUntilPrimaryHeadline(PRIMARY, now)).toBe(
      "Five weeks until the primary.",
    );
  });
});
