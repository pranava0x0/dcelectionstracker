import { describe, expect, it } from "vitest";
import { VOTE_CENTERS_BY_WARD, totalVoteCenters, voteCentersForWard } from "./vote-centers";

describe("vote-centers dataset (BL-UAT-13)", () => {
  it("has an entry for every DC ward 1-8", () => {
    for (const ward of ["1", "2", "3", "4", "5", "6", "7", "8"]) {
      expect(VOTE_CENTERS_BY_WARD[ward], `Ward ${ward} missing`).toBeDefined();
      expect(VOTE_CENTERS_BY_WARD[ward]!.length, `Ward ${ward} has zero centers`).toBeGreaterThan(0);
    }
  });

  it("every center has a non-empty name, ZIP-bearing address, and an accessible flag", () => {
    for (const [ward, centers] of Object.entries(VOTE_CENTERS_BY_WARD)) {
      for (const c of centers) {
        expect(c.name, `Ward ${ward}: blank name`).not.toBe("");
        expect(c.address, `Ward ${ward} ${c.name}: blank address`).not.toBe("");
        expect(c.address, `Ward ${ward} ${c.name}: missing DC ZIP`).toMatch(/Washington, DC 200\d{2}/);
        expect(typeof c.accessible, `Ward ${ward} ${c.name}: missing accessible flag`).toBe("boolean");
      }
    }
  });

  it("totalVoteCenters returns the sum across wards", () => {
    const sumDirect = Object.values(VOTE_CENTERS_BY_WARD).reduce((s, l) => s + l.length, 0);
    expect(totalVoteCenters()).toBe(sumDirect);
    // DCBOE's 2026-05-17 publication listed 75 centers (a handful are shared
    // listings across ward boundaries). If this number drops below 60 or rises
    // above 85, the data file probably drifted and should be re-verified
    // against DCBOE before relying on it.
    expect(totalVoteCenters()).toBeGreaterThanOrEqual(60);
    expect(totalVoteCenters()).toBeLessThanOrEqual(85);
  });

  it("voteCentersForWard returns the ward list and an empty array for unknown wards", () => {
    expect(voteCentersForWard("1").length).toBeGreaterThan(0);
    expect(voteCentersForWard("99")).toEqual([]);
    expect(voteCentersForWard("")).toEqual([]);
  });
});
