// DC Council voting record dataset. Powers the matrix on /officials/ (BL-12) and the
// per-member mini-record on each official card (BL-01). One BillVote = one bill at one
// stage (typically the final reading). Member votes are linked to Official.slug — a
// dataset-integrity test asserts every memberSlug refers to a real Official.
//
// SCOPE NOTES:
// - Only currently-seated council members are tracked. Historical members (e.g. Vincent
//   Gray, Kenyan McDuffie) who held a seat at the time of a vote but no longer hold it
//   appear in source-of-record tallies but not in the matrix — their successor's slug
//   shows `not-in-office` for those dates.
// - `not-in-office` is a real vote value (not a synonym for absent). It distinguishes
//   "wasn't on Council at all" from "was on Council but missed this vote."

export type VoteValue =
  | "yes"
  | "no"
  | "abstain"
  | "absent"
  | "excused"
  | "present"
  | "not-in-office";

export type MemberVote = {
  memberSlug: string; // FK to Official.slug
  vote: VoteValue;
  note?: string;
};

export type BillVote = {
  billId: string; // e.g. "B25-0345"
  billName: string;
  voteDate: string; // ISO date
  voteStage: "first reading" | "final reading" | "committee" | "emergency";
  result: "passed" | "failed" | "vetoed" | "overridden";
  summary: string; // ≤ 2 sentences plain-English context
  memberVotes: MemberVote[];
  source: { label: string; url: string };
};

// v1 scope: 3 bills with sourceable per-member tallies. FY26 Budget (10-2 final passage
// on July 28, 2025) and Sanctuary Values Repeal pause (committee-only on June 24, 2025)
// are backlogged — the aggregate tallies are public but per-member breakdowns require
// deeper LIMS work that the data-refresh skill should attempt before re-adding them.
export const billVotes: BillVote[] = [
  {
    billId: "B25-0345",
    billName: "Secure DC Omnibus Amendment Act of 2024",
    voteDate: "2024-03-05",
    voteStage: "final reading",
    result: "passed",
    summary:
      "Council's flagship 2024 public-safety package. Extended pre-trial detention presumptions, restored 'drug-free zones,' and broadened police authorities.",
    source: {
      label: "DC Council — Public Safety Bill Receives Final Vote",
      url: "https://dccouncil.gov/councils-public-safety-bill-receives-final-vote-of-support-restaurant-revitalization-measure-also-moves-forward/",
    },
    memberVotes: [
      { memberSlug: "mendelson", vote: "yes" },
      { memberSlug: "bonds", vote: "yes" },
      { memberSlug: "robert-white", vote: "yes" },
      { memberSlug: "christina-henderson", vote: "yes" },
      {
        memberSlug: "crawford",
        vote: "not-in-office",
        note: "Appointed to fill vacated At-Large seat in January 2026.",
      },
      { memberSlug: "nadeau", vote: "yes" },
      { memberSlug: "pinto", vote: "yes" },
      { memberSlug: "frumin", vote: "yes" },
      { memberSlug: "lewis-george", vote: "yes" },
      { memberSlug: "parker", vote: "yes" },
      { memberSlug: "allen", vote: "yes" },
      {
        memberSlug: "felder",
        vote: "not-in-office",
        note: "Won Ward 7 special election later in 2024; not yet sworn in at this vote.",
      },
      {
        memberSlug: "trayon-white",
        vote: "present",
        note: "Recorded as Present rather than Yes or No.",
      },
    ],
  },
  {
    billId: "B26-0187",
    billName: "Peace DC Omnibus Amendment Act of 2025",
    voteDate: "2025-07-01",
    voteStage: "final reading",
    result: "passed",
    summary:
      "Brooke Pinto's follow-on public-safety package extending pre-trial detention presumptions permanently and easing record-sealing for some convictions. Companion to the Residential Tranquility Amendment, voted separately.",
    source: {
      label: "DC Law 26-52 — Peace DC Omnibus Amendment Act",
      url: "https://code.dccouncil.gov/us/dc/council/laws/26-52",
    },
    memberVotes: [
      { memberSlug: "mendelson", vote: "yes" },
      { memberSlug: "bonds", vote: "yes" },
      { memberSlug: "robert-white", vote: "yes" },
      { memberSlug: "christina-henderson", vote: "yes" },
      {
        memberSlug: "crawford",
        vote: "not-in-office",
        note: "Appointed to fill vacated At-Large seat in January 2026.",
      },
      { memberSlug: "nadeau", vote: "yes" },
      { memberSlug: "pinto", vote: "yes" },
      { memberSlug: "frumin", vote: "yes" },
      { memberSlug: "lewis-george", vote: "yes" },
      { memberSlug: "parker", vote: "yes" },
      { memberSlug: "allen", vote: "yes" },
      { memberSlug: "felder", vote: "yes" },
      {
        memberSlug: "trayon-white",
        vote: "not-in-office",
        note: "Expelled February 2025; re-sworn-in August 8, 2025 after winning the July 15 special election.",
      },
    ],
  },
  {
    billId: "B26-0164",
    billName: "Rebalancing Expectations for Neighbors, Tenants, and Landlords (RENTAL) Act of 2025",
    voteDate: "2025-09-17",
    voteStage: "final reading",
    result: "passed",
    summary:
      "Major rental-housing overhaul. Created a 15-year TOPA exemption for newly constructed multifamily buildings and rewrote eviction processes. Signed into law November 13, 2025; effective December 31, 2025.",
    source: {
      label: "Holland & Knight — RENTAL Act passes",
      url: "https://www.hklaw.com/en/insights/publications/2025/09/dc-council-passes-rental-act-including-significant-tenant-opportunity",
    },
    memberVotes: [
      { memberSlug: "mendelson", vote: "yes" },
      { memberSlug: "bonds", vote: "yes" },
      { memberSlug: "robert-white", vote: "yes" },
      { memberSlug: "christina-henderson", vote: "yes" },
      {
        memberSlug: "crawford",
        vote: "not-in-office",
        note: "Appointed to fill vacated At-Large seat in January 2026.",
      },
      { memberSlug: "nadeau", vote: "no" },
      { memberSlug: "pinto", vote: "yes" },
      { memberSlug: "frumin", vote: "yes" },
      { memberSlug: "lewis-george", vote: "no" },
      { memberSlug: "parker", vote: "yes" },
      { memberSlug: "allen", vote: "yes" },
      { memberSlug: "felder", vote: "yes" },
      { memberSlug: "trayon-white", vote: "no" },
    ],
  },
];

export function votesForMember(memberSlug: string): Array<{ bill: BillVote; vote: MemberVote }> {
  return billVotes
    .map((bill) => {
      const vote = bill.memberVotes.find((v) => v.memberSlug === memberSlug);
      return vote ? { bill, vote } : null;
    })
    .filter((entry): entry is { bill: BillVote; vote: MemberVote } => entry !== null);
}

export const VOTE_LABEL: Record<VoteValue, string> = {
  yes: "Y",
  no: "N",
  abstain: "A",
  absent: "—",
  excused: "E",
  present: "P",
  "not-in-office": "·",
};

export const VOTE_DESCRIPTION: Record<VoteValue, string> = {
  yes: "Voted Yes",
  no: "Voted No",
  abstain: "Abstained",
  absent: "Absent",
  excused: "Excused",
  present: "Present (declined to vote yes or no)",
  "not-in-office": "Not on Council at the time of this vote",
};
