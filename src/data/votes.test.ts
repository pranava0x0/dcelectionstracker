import { describe, expect, it } from "vitest";
import { councilMembers, getOfficialBySlug, officials } from "./officials";
import {
  VOTE_DESCRIPTION,
  VOTE_LABEL,
  billVotes,
  votesForMember,
  type VoteValue,
} from "./votes";

const ALL_VOTE_VALUES: VoteValue[] = [
  "yes",
  "no",
  "abstain",
  "absent",
  "excused",
  "present",
  "not-in-office",
];

describe("officials slugs", () => {
  it("every official has a unique kebab-case slug", () => {
    const slugs: string[] = officials.flatMap((g) => g.members.map((m) => m.slug));
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug, `bad slug: ${slug}`).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it("getOfficialBySlug returns the matching official", () => {
    expect(getOfficialBySlug("mendelson")?.name).toBe("Phil Mendelson");
    expect(getOfficialBySlug("trayon-white")?.role).toBe("Ward 8");
    expect(getOfficialBySlug("not-a-slug")).toBeUndefined();
  });

  it("councilMembers() returns 13 members", () => {
    const cm = councilMembers();
    expect(cm).toHaveLength(13);
    // Sanity: chair + 4 at-large + 8 wards
    expect(cm.filter((m) => m.role === "Council Chair")).toHaveLength(1);
    expect(cm.filter((m) => m.role.startsWith("At-Large"))).toHaveLength(4);
    expect(cm.filter((m) => m.role.startsWith("Ward "))).toHaveLength(8);
  });
});

describe("billVotes dataset (BL-12 / BL-01)", () => {
  it("every bill has at least one member vote and a primary source URL", () => {
    for (const bill of billVotes) {
      expect(bill.memberVotes.length).toBeGreaterThan(0);
      expect(bill.source.url).toMatch(/^https?:\/\//);
      expect(bill.source.label.length).toBeGreaterThan(0);
    }
  });

  it("every memberSlug in every bill references a real Official", () => {
    for (const bill of billVotes) {
      for (const v of bill.memberVotes) {
        const m = getOfficialBySlug(v.memberSlug);
        expect(m, `bill ${bill.billId}: unknown slug ${v.memberSlug}`).toBeDefined();
      }
    }
  });

  it("every bill records a vote for every current council member (no orphan rows in the matrix)", () => {
    const councilSlugs = new Set(councilMembers().map((m) => m.slug));
    for (const bill of billVotes) {
      const billSlugs = new Set(bill.memberVotes.map((v) => v.memberSlug));
      for (const slug of councilSlugs) {
        expect(billSlugs.has(slug), `bill ${bill.billId}: missing vote for ${slug}`).toBe(true);
      }
    }
  });

  it("no duplicate votes per member per bill", () => {
    for (const bill of billVotes) {
      const slugs = bill.memberVotes.map((v) => v.memberSlug);
      expect(new Set(slugs).size, `bill ${bill.billId} has duplicate member votes`).toBe(slugs.length);
    }
  });

  it("every vote uses a known VoteValue", () => {
    const valid = new Set(ALL_VOTE_VALUES);
    for (const bill of billVotes) {
      for (const v of bill.memberVotes) {
        expect(valid.has(v.vote), `bill ${bill.billId} / ${v.memberSlug}: bad value ${v.vote}`).toBe(true);
      }
    }
  });

  it("voteDate is ISO YYYY-MM-DD", () => {
    for (const bill of billVotes) {
      expect(bill.voteDate, `bill ${bill.billId} bad date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("Secure DC 2024-03-05 matches the documented 12-0-1 with Trayon White voting Present", () => {
    const bill = billVotes.find((b) => b.billId === "B25-0345");
    expect(bill).toBeDefined();
    const trayon = bill!.memberVotes.find((v) => v.memberSlug === "trayon-white");
    expect(trayon?.vote).toBe("present");
    const counts = countVotes(bill!.memberVotes.map((v) => v.vote));
    // current-roster matrix: Crawford NIO + Felder NIO + Trayon Present + remaining 10 Yes
    expect(counts.yes).toBe(10);
    expect(counts.present).toBe(1);
    expect(counts["not-in-office"]).toBe(2);
  });

  it("RENTAL Act 2025-09-17 records the three documented No votes (Nadeau, Lewis George, Trayon White)", () => {
    const bill = billVotes.find((b) => b.billId === "B26-0164");
    expect(bill).toBeDefined();
    const nos = bill!.memberVotes.filter((v) => v.vote === "no").map((v) => v.memberSlug);
    expect(nos.sort()).toEqual(["lewis-george", "nadeau", "trayon-white"]);
  });
});

describe("votesForMember helper", () => {
  it("returns all bills where the member was on Council, in dataset order", () => {
    const allenVotes = votesForMember("allen");
    expect(allenVotes.length).toBeGreaterThanOrEqual(1);
    for (const entry of allenVotes) {
      expect(entry.vote.memberSlug).toBe("allen");
    }
  });

  it("returns an empty array for an unknown slug", () => {
    expect(votesForMember("not-a-slug")).toEqual([]);
  });

  it("returns 3 entries (one per tracked bill) for Mendelson — the chair was on Council for all v1 bills", () => {
    expect(votesForMember("mendelson")).toHaveLength(3);
  });
});

describe("VOTE_LABEL / VOTE_DESCRIPTION coverage", () => {
  it("every VoteValue has a label and description", () => {
    for (const v of ALL_VOTE_VALUES) {
      expect(VOTE_LABEL[v]).toBeDefined();
      expect(VOTE_DESCRIPTION[v]).toBeDefined();
    }
  });
});

function countVotes(votes: VoteValue[]): Record<VoteValue, number> {
  const out: Record<VoteValue, number> = {
    yes: 0,
    no: 0,
    abstain: 0,
    absent: 0,
    excused: 0,
    present: 0,
    "not-in-office": 0,
  };
  for (const v of votes) out[v]++;
  return out;
}
