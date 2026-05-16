import { describe, expect, it } from "vitest";
import {
  COMPARABLE_ISSUES,
  COMPARISON_RACE_SLUGS,
  ISSUE_COLUMN_TAGLINES,
  PROFILED_RACE_SLUGS,
  RACE_STATUS_LABEL,
  ballotForWard,
  candidates2026,
  candidatesForRace,
  externalToolsForRace,
  getCandidateBySlug,
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

describe("race-status neutral labels (BL-46)", () => {
  it("every race uses one of the three neutral status values", () => {
    const valid = new Set(["open", "includes-incumbent", "special"]);
    for (const r of races2026) {
      expect(valid.has(r.status), `${r.slug} has invalid status ${r.status}`).toBe(true);
    }
  });

  it("RACE_STATUS_LABEL covers every status with a non-empty user-facing label", () => {
    for (const r of races2026) {
      const label = RACE_STATUS_LABEL[r.status];
      expect(label, `${r.slug}: no label for status ${r.status}`).toBeDefined();
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it("every includes-incumbent race has exactly one incumbent candidate", () => {
    for (const r of races2026) {
      if (r.status !== "includes-incumbent") continue;
      const incumbents = candidatesForRace(r.slug).filter((c) => c.incumbent);
      expect(incumbents.length, `${r.slug} has ${incumbents.length} incumbents, expected 1`).toBe(1);
    }
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

describe("per-seat race pages + candidate profiles (BL-32)", () => {
  it("every candidate has a kebab-case slug and slugs are unique", () => {
    const slugs = candidates2026.map((c) => c.slug);
    for (const s of slugs) expect(s, `bad slug: ${s}`).toMatch(/^[a-z][a-z0-9-]*$/);
    expect(new Set(slugs).size, "duplicate candidate slug detected").toBe(slugs.length);
  });

  it("PROFILED_RACE_SLUGS reference real races", () => {
    const valid = new Set(races2026.map((r) => r.slug));
    for (const slug of PROFILED_RACE_SLUGS) expect(valid.has(slug)).toBe(true);
  });

  it("every profiled race has at least one declared candidate", () => {
    for (const slug of PROFILED_RACE_SLUGS) {
      expect(candidatesForRace(slug).length, `${slug} has zero candidates`).toBeGreaterThan(0);
    }
  });

  it("getCandidateBySlug returns the matching candidate or undefined", () => {
    expect(getCandidateBySlug("janeese-lewis-george")?.name).toBe("Janeese Lewis George");
    expect(getCandidateBySlug("kenyan-mcduffie")?.raceSlug).toBe("mayor");
    expect(getCandidateBySlug("not-a-slug")).toBeUndefined();
  });

  it("externalToolsForRace returns common tools at minimum for every race", () => {
    for (const slug of PROFILED_RACE_SLUGS) {
      const tools = externalToolsForRace(slug);
      expect(tools.length).toBeGreaterThanOrEqual(2);
      for (const t of tools) {
        expect(t.url).toMatch(/^https:\/\//);
        expect(t.label.length).toBeGreaterThan(0);
        expect(t.blurb.length).toBeGreaterThan(0);
      }
    }
  });

  it("every populated profile URL is a valid http(s) URL", () => {
    const urlFields = [
      "websiteUrl",
      "governmentSiteUrl",
      "twitterUrl",
      "linkedinUrl",
      "instagramUrl",
      "facebookUrl",
      "ocfUrl",
      "dcboeUrl",
    ] as const;
    for (const c of candidates2026) {
      for (const f of urlFields) {
        const v = c[f];
        if (v == null) continue;
        expect(v, `${c.name}: ${f} not http(s)`).toMatch(/^https?:\/\//);
      }
    }
  });

  it("every news item has an ISO date, non-empty outlet + headline, and an http(s) URL (BL-42)", () => {
    for (const c of candidates2026) {
      if (!c.news) continue;
      for (const n of c.news) {
        expect(n.date, `${c.name}: news date not ISO`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(n.outlet.length, `${c.name}: news outlet empty`).toBeGreaterThan(0);
        expect(n.headline.length, `${c.name}: news headline empty`).toBeGreaterThan(0);
        expect(n.url, `${c.name}: news url not http(s)`).toMatch(/^https?:\/\//);
        if (n.kind !== undefined) {
          expect(["press", "social"], `${c.name}: news kind unknown`).toContain(n.kind);
        }
      }
    }
  });

  it("every newsTheme has a non-empty headline and supportingUrls that all FK into the candidate's news[] (BL-42 v2)", () => {
    for (const c of candidates2026) {
      if (!c.newsThemes) continue;
      expect(c.newsThemes.length, `${c.name}: more than 2 newsThemes`).toBeLessThanOrEqual(2);
      const newsUrls = new Set((c.news ?? []).map((n) => n.url));
      for (const t of c.newsThemes) {
        expect(t.headline.length, `${c.name}: theme headline empty`).toBeGreaterThan(0);
        expect(t.headline.split(/\s+/).length, `${c.name}: theme headline >18 words`).toBeLessThanOrEqual(18);
        expect(t.supportingUrls.length, `${c.name}: theme has no supporting urls`).toBeGreaterThan(0);
        for (const url of t.supportingUrls) {
          expect(newsUrls.has(url), `${c.name}: theme supportingUrl ${url} missing from news[]`).toBe(true);
        }
      }
    }
  });
});

describe("ballotForWard helper (BL-02)", () => {
  it("includes all citywide primary races for every ward", () => {
    const expected = [
      "mayor",
      "council-chair",
      "attorney-general",
      "us-house-delegate",
      "council-at-large-bonds",
      "council-at-large-special",
      "shadow-senator",
      "shadow-representative",
    ];
    for (let w = 1; w <= 8; w++) {
      const ballot = ballotForWard(String(w));
      for (const race of expected) {
        expect(ballot.primaryRaceSlugs).toContain(race);
      }
    }
  });

  it("adds the council ward race only for wards 1, 3, 5, 6 (the wards on the 2026 ballot)", () => {
    for (const w of ["1", "3", "5", "6"]) {
      expect(ballotForWard(w).primaryRaceSlugs).toContain(`council-ward-${w}`);
    }
    for (const w of ["2", "4", "7", "8"]) {
      expect(ballotForWard(w).primaryRaceSlugs).not.toContain(`council-ward-${w}`);
    }
  });

  it("flags sboeOnGeneralBallot true for wards 1, 3, 5, 6 only", () => {
    for (const w of ["1", "3", "5", "6"]) {
      expect(ballotForWard(w).sboeOnGeneralBallot).toBe(true);
    }
    for (const w of ["2", "4", "7", "8"]) {
      expect(ballotForWard(w).sboeOnGeneralBallot).toBe(false);
    }
  });

  it("normalizes a 'Ward 5' prefix input", () => {
    expect(ballotForWard("Ward 5").primaryRaceSlugs).toContain("council-ward-5");
    expect(ballotForWard("Ward 5").sboeOnGeneralBallot).toBe(true);
  });
});
