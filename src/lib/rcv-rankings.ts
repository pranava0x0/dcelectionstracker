import { CANDIDATES, type Ballot, type CandidateId, type Round } from "./rcv";

export type Rankings = Partial<Record<CandidateId, number>>;

export const RANK_LABEL: Record<number, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
  4: "4th",
  5: "5th",
};

export function userBallotFromRankings(rankings: Rankings): Ballot {
  const entries = Object.entries(rankings) as [CandidateId, number][];
  return entries
    .filter(([, rank]) => typeof rank === "number")
    .sort((a, b) => a[1] - b[1])
    .map(([c]) => c);
}

export function nextRank(rankings: Rankings): number {
  const used = new Set(
    Object.values(rankings).filter((r): r is number => typeof r === "number"),
  );
  for (let i = 1; i <= CANDIDATES.length; i++) {
    if (!used.has(i)) return i;
  }
  return CANDIDATES.length;
}

export function withoutRank(rankings: Rankings, candidate: CandidateId): Rankings {
  const removed = rankings[candidate];
  const next: Rankings = {};
  for (const c of CANDIDATES) {
    const r = rankings[c];
    if (c === candidate || typeof r !== "number") continue;
    next[c] = removed !== undefined && r > removed ? r - 1 : r;
  }
  return next;
}

export function userVoteJourney(
  rounds: Round[],
  ballot: Ballot,
): (CandidateId | "exhausted")[] {
  return rounds.map((round) => {
    const active = new Set(round.active);
    for (const c of ballot) {
      if (active.has(c)) return c;
    }
    return "exhausted";
  });
}
