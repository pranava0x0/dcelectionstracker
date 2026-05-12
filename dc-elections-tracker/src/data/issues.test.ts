import { describe, expect, it } from "vitest";
import { allIssueSlugs, getIssueBySlug, isSubstantiveIssue, issues } from "./issues";

describe("getIssueBySlug", () => {
  it("returns an issue for a known slug", () => {
    expect(getIssueBySlug("statehood")?.title).toBe("Statehood & Federal Pressure");
  });
  it("returns undefined for an unknown slug", () => {
    expect(getIssueBySlug("not-a-real-issue")).toBeUndefined();
  });
});

describe("allIssueSlugs", () => {
  it("excludes static-route slugs (ranked-choice is rendered by a custom page)", () => {
    expect(allIssueSlugs()).not.toContain("ranked-choice");
  });
  it("includes the substantive issue slugs", () => {
    const slugs = allIssueSlugs();
    for (const expected of [
      "statehood",
      "public-safety",
      "housing",
      "budget",
      "transportation",
      "schools",
    ]) {
      expect(slugs).toContain(expected);
    }
  });
});

describe("issue quick-take (BL-55)", () => {
  it("every substantive issue has a quickTake of exactly 3 bullets", () => {
    for (const issue of issues) {
      if (!isSubstantiveIssue(issue)) continue;
      expect(issue.quickTake, `${issue.slug} missing quickTake`).toBeDefined();
      expect(
        issue.quickTake!.length,
        `${issue.slug} has ${issue.quickTake!.length} bullets, expected 3`
      ).toBe(3);
    }
  });

  it("every quick-take bullet stays under 25 words", () => {
    for (const issue of issues) {
      if (!issue.quickTake) continue;
      for (const bullet of issue.quickTake) {
        const wordCount = bullet.split(/\s+/).filter(Boolean).length;
        expect(
          wordCount,
          `${issue.slug}: "${bullet}" is ${wordCount} words`
        ).toBeLessThanOrEqual(25);
      }
    }
  });

  it("every quick-take bullet is non-empty and ends in punctuation", () => {
    for (const issue of issues) {
      if (!issue.quickTake) continue;
      for (const bullet of issue.quickTake) {
        expect(bullet.length, `${issue.slug}: empty bullet`).toBeGreaterThan(0);
        expect(
          /[.?!"']$/.test(bullet),
          `${issue.slug}: "${bullet}" should end in punctuation`
        ).toBe(true);
      }
    }
  });
});
