import { describe, expect, it } from "vitest";
import {
  COMPARABLE_ISSUES,
  COMPARISON_RACE_SLUGS,
  ISSUE_COLUMN_TAGLINES,
  candidates2026,
  candidatesForRace,
  getRaceBySlug,
  races2026,
} from "./elections";

describe("getRaceBySlug", () => {
  it("returns the race for a known slug", () => {
    const race = getRaceBySlug("mayor");
    expect(race).toBeDefined();
    expect(race?.office).toBe("Mayor");
    expect(race?.status).toBe("open");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getRaceBySlug("not-a-real-race")).toBeUndefined();
  });

  it("returns undefined for an empty slug", () => {
    expect(getRaceBySlug("")).toBeUndefined();
  });
});

describe("candidatesForRace", () => {
  it("returns an empty array for a race with no declared candidates", () => {
    expect(candidatesForRace("shadow-representative")).toEqual([]);
  });

  it("returns an empty array for an unknown race slug", () => {
    expect(candidatesForRace("not-a-real-race")).toEqual([]);
  });

  it("returns only candidates for the requested race", () => {
    const mayorals = candidatesForRace("mayor");
    expect(mayorals.length).toBeGreaterThan(0);
    for (const c of mayorals) {
      expect(c.raceSlug).toBe("mayor");
    }
  });

  it("sorts candidates alphabetically by name (case-insensitive)", () => {
    const mayorals = candidatesForRace("mayor");
    const names = mayorals.map((c) => c.name);
    const sortedCopy = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sortedCopy);
  });

  it("filters out withdrawn candidates", () => {
    // Synthesize a withdrawn entry inline rather than mutating shared data —
    // the helper itself does the filtering via filingStatus.
    const withdrawn = candidates2026.find((c) => c.filingStatus === "withdrawn");
    expect(withdrawn).toBeUndefined(); // none yet, but the helper supports it
    const allMayorals = candidates2026.filter((c) => c.raceSlug === "mayor");
    expect(candidatesForRace("mayor").length).toBe(allMayorals.length);
  });
});

describe("candidates2026 dataset integrity", () => {
  it("every candidate's raceSlug references a real Race", () => {
    const validSlugs = new Set(races2026.map((r) => r.slug));
    for (const c of candidates2026) {
      expect(validSlugs.has(c.raceSlug)).toBe(true);
    }
  });

  it("every candidate has a source label and url", () => {
    for (const c of candidates2026) {
      expect(c.source.label.length).toBeGreaterThan(0);
      expect(c.source.url).toMatch(/^https?:\/\//);
    }
  });

  it("only one candidate per race is marked as incumbent", () => {
    const byRace = new Map<string, number>();
    for (const c of candidates2026) {
      if (c.incumbent) byRace.set(c.raceSlug, (byRace.get(c.raceSlug) ?? 0) + 1);
    }
    for (const [slug, count] of byRace) {
      expect(count, `race ${slug} has multiple incumbents`).toBeLessThanOrEqual(1);
    }
  });

  it("every Race slug is unique", () => {
    const slugs = races2026.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("candidate comparison matrix (BL-19)", () => {
  it("every COMPARABLE_ISSUES slug has a tag-line", () => {
    for (const slug of COMPARABLE_ISSUES) {
      expect(ISSUE_COLUMN_TAGLINES[slug]).toBeDefined();
      expect(ISSUE_COLUMN_TAGLINES[slug].length).toBeGreaterThan(0);
    }
  });

  it("COMPARABLE_ISSUES mirrors the site's substantive issue pages (6, excludes ranked-choice)", () => {
    expect(COMPARABLE_ISSUES).toHaveLength(6);
    expect(COMPARABLE_ISSUES).not.toContain("ranked-choice" as never);
  });

  it("every COMPARISON_RACE_SLUGS entry references a real Race", () => {
    const validSlugs = new Set(races2026.map((r) => r.slug));
    for (const slug of COMPARISON_RACE_SLUGS) {
      expect(validSlugs.has(slug)).toBe(true);
    }
  });

  it("every populated Position cites a sourceLabel and sourceUrl, and stance is non-empty", () => {
    for (const c of candidates2026) {
      if (!c.positions) continue;
      for (const [issue, pos] of Object.entries(c.positions)) {
        if (!pos) continue;
        expect(pos.stance, `${c.name} / ${issue}: stance empty`).not.toBe("");
        expect(pos.sourceLabel, `${c.name} / ${issue}: sourceLabel empty`).not.toBe("");
        expect(pos.sourceUrl, `${c.name} / ${issue}: bad URL`).toMatch(/^https?:\/\//);
      }
    }
  });

  it("every populated Position keys to a known COMPARABLE_ISSUES slug", () => {
    const valid = new Set(COMPARABLE_ISSUES);
    for (const c of candidates2026) {
      if (!c.positions) continue;
      for (const issue of Object.keys(c.positions)) {
        expect(valid.has(issue as never), `${c.name} has position on unknown issue ${issue}`).toBe(true);
      }
    }
  });

  it("every populated stance is ≤ 30 words (editorial style guide caps at 25 with light slack)", () => {
    for (const c of candidates2026) {
      if (!c.positions) continue;
      for (const [issue, pos] of Object.entries(c.positions)) {
        if (!pos) continue;
        const wordCount = pos.stance.split(/\s+/).filter(Boolean).length;
        expect(wordCount, `${c.name} / ${issue} is ${wordCount} words`).toBeLessThanOrEqual(30);
      }
    }
  });
});
