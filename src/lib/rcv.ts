export type CandidateId = "A" | "B" | "C" | "D" | "E";

export type Ballot = CandidateId[];

export type Round = {
  number: number;
  active: CandidateId[];
  counts: Record<CandidateId, number>;
  exhausted: number;
  eliminated: CandidateId | null;
  winner: CandidateId | null;
};

export const CANDIDATES: CandidateId[] = ["A", "B", "C", "D", "E"];

export const CANDIDATE_LABEL: Record<CandidateId, string> = {
  A: "Candidate A",
  B: "Candidate B",
  C: "Candidate C",
  D: "Candidate D",
  E: "Candidate E",
};

export const BASE_ELECTORATE: Ballot[] = [
  ...repeat<Ballot>(["A", "B", "C"], 3),
  ...repeat<Ballot>(["B", "A", "C"], 3),
  ...repeat<Ballot>(["C", "B", "A"], 2),
  ...repeat<Ballot>(["D", "A", "C"], 2),
  ...repeat<Ballot>(["E", "B", "A"], 1),
];

function repeat<T>(value: T, times: number): T[] {
  return Array.from({ length: times }, () => value);
}

function firstActive(ballot: Ballot, active: Set<CandidateId>): CandidateId | null {
  for (const c of ballot) {
    if (active.has(c)) return c;
  }
  return null;
}

function emptyCounts(active: CandidateId[]): Record<CandidateId, number> {
  const out = {} as Record<CandidateId, number>;
  for (const c of active) out[c] = 0;
  return out;
}

export function runIRV(ballots: Ballot[], candidates: CandidateId[] = CANDIDATES): Round[] {
  const rounds: Round[] = [];
  const active = new Set<CandidateId>(candidates);
  const firstRoundCounts: Record<CandidateId, number> = emptyCounts(candidates);

  for (const b of ballots) {
    const first = firstActive(b, active);
    if (first) firstRoundCounts[first]++;
  }

  let roundNumber = 1;
  while (active.size > 0) {
    const counts = emptyCounts([...active]);
    let exhausted = 0;
    for (const b of ballots) {
      const first = firstActive(b, active);
      if (first) counts[first]++;
      else exhausted++;
    }

    const totalActive = Object.values(counts).reduce((a, b) => a + b, 0);
    const majority = Math.floor(totalActive / 2) + 1;

    const sortedDesc = [...active].sort((x, y) => counts[y] - counts[x]);
    const leader = sortedDesc[0];
    if (!leader) return rounds;

    if (counts[leader] >= majority || active.size === 1) {
      const winner = pickWinner(sortedDesc, counts, firstRoundCounts);
      rounds.push({
        number: roundNumber,
        active: [...active],
        counts,
        exhausted,
        eliminated: null,
        winner,
      });
      return rounds;
    }

    const loser = pickLoser([...active], counts, firstRoundCounts);
    rounds.push({
      number: roundNumber,
      active: [...active],
      counts,
      exhausted,
      eliminated: loser,
      winner: null,
    });
    active.delete(loser);
    roundNumber++;
  }
  return rounds;
}

function pickLoser(
  candidates: CandidateId[],
  counts: Record<CandidateId, number>,
  firstRoundCounts: Record<CandidateId, number>,
): CandidateId {
  const min = Math.min(...candidates.map((c) => counts[c]));
  const tiedForMin = candidates.filter((c) => counts[c] === min);
  if (tiedForMin.length === 1) return tiedForMin[0]!;
  const minOriginal = Math.min(...tiedForMin.map((c) => firstRoundCounts[c]));
  const tiedOriginal = tiedForMin.filter((c) => firstRoundCounts[c] === minOriginal);
  return [...tiedOriginal].sort().reverse()[0]!;
}

function pickWinner(
  sortedDesc: CandidateId[],
  counts: Record<CandidateId, number>,
  firstRoundCounts: Record<CandidateId, number>,
): CandidateId {
  const first = sortedDesc[0]!;
  const top = counts[first];
  const tiedForTop = sortedDesc.filter((c) => counts[c] === top);
  if (tiedForTop.length === 1) return tiedForTop[0]!;
  const maxOriginal = Math.max(...tiedForTop.map((c) => firstRoundCounts[c]));
  const tiedOriginal = tiedForTop.filter((c) => firstRoundCounts[c] === maxOriginal);
  return [...tiedOriginal].sort()[0]!;
}
