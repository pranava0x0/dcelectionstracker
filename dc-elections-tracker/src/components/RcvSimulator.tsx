"use client";

import { useMemo, useState } from "react";
import {
  BASE_ELECTORATE,
  CANDIDATES,
  CANDIDATE_LABEL,
  type Ballot,
  type CandidateId,
  type Round,
  runIRV,
} from "@/lib/rcv";
import {
  RANK_LABEL,
  type Rankings,
  nextRank,
  userBallotFromRankings,
  userVoteJourney,
  withoutRank,
} from "@/lib/rcv-rankings";

export function RcvSimulator(): JSX.Element {
  const [rankings, setRankings] = useState<Rankings>({});
  const [committedBallot, setCommittedBallot] = useState<Ballot | null>(null);

  const orderedBallot = useMemo(() => userBallotFromRankings(rankings), [rankings]);
  const hasAnyRank = orderedBallot.length > 0;

  const tabulation = useMemo(() => {
    if (!committedBallot) return null;
    const rounds = runIRV([...BASE_ELECTORATE, committedBallot]);
    const journey = userVoteJourney(rounds, committedBallot);
    return { rounds, journey };
  }, [committedBallot]);

  function handleCandidateClick(candidate: CandidateId): void {
    if (committedBallot) return;
    setRankings((prev) => {
      if (prev[candidate] !== undefined) return withoutRank(prev, candidate);
      const rank = nextRank(prev);
      return { ...prev, [candidate]: rank };
    });
  }

  function handleTabulate(): void {
    if (!hasAnyRank) return;
    setCommittedBallot(orderedBallot);
  }

  function handleReset(): void {
    setRankings({});
    setCommittedBallot(null);
  }

  return (
    <div className="mt-5">
      <p className="text-base leading-relaxed text-fg sm:text-[17px]">
        Tap candidates in the order you&apos;d rank them. Your first tap becomes 1st choice, your
        second becomes 2nd, and so on. Tap a ranked candidate again to clear and reshuffle. Then
        tap <span className="font-semibold">Tabulate</span> to see how the runoff plays out
        against twenty hypothetical voters.
      </p>

      <ol className="mt-6 grid grid-cols-1 gap-px bg-rule sm:grid-cols-3 lg:grid-cols-5">
        {CANDIDATES.map((c) => {
          const rank = rankings[c];
          const ranked = typeof rank === "number";
          return (
            <li key={c} className="bg-paper">
              <button
                type="button"
                onClick={() => handleCandidateClick(c)}
                disabled={!!committedBallot}
                aria-pressed={ranked}
                aria-label={ranked ? `${CANDIDATE_LABEL[c]} ranked ${RANK_LABEL[rank!]}` : `Rank ${CANDIDATE_LABEL[c]}`}
                className={
                  "flex w-full items-center justify-between gap-3 p-4 text-left transition-colors " +
                  (ranked
                    ? "bg-primary text-primary-fg hover:opacity-90"
                    : "hover:bg-bg") +
                  (committedBallot ? " cursor-default" : "")
                }
              >
                <span className="display text-base sm:text-lg">{CANDIDATE_LABEL[c]}</span>
                <span
                  className={
                    "flex h-7 min-w-[2.5rem] items-center justify-center rounded-sm font-mono text-[11px] font-bold uppercase tracking-wider " +
                    (ranked ? "bg-paper text-primary" : "border border-rule text-subtle")
                  }
                >
                  {ranked ? RANK_LABEL[rank!] : "—"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleTabulate}
          disabled={!hasAnyRank || !!committedBallot}
          className="rounded-sm bg-primary px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2"
        >
          Tabulate
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasAnyRank && !committedBallot}
          className="rounded-sm border border-rule bg-paper px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-fg transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50 sm:py-2"
        >
          {committedBallot ? "Try a different ballot" : "Reset"}
        </button>
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
          {hasAnyRank
            ? `Your ballot: ${orderedBallot.map((c) => CANDIDATE_LABEL[c].replace("Candidate ", "")).join(" › ")}`
            : "No candidates ranked yet"}
        </p>
      </div>

      {tabulation ? (
        <ResultsBlock rounds={tabulation.rounds} journey={tabulation.journey} ballot={committedBallot!} />
      ) : null}
    </div>
  );
}

function ResultsBlock({
  rounds,
  journey,
  ballot,
}: {
  rounds: Round[];
  journey: (CandidateId | "exhausted")[];
  ballot: Ballot;
}): JSX.Element {
  const winner = rounds[rounds.length - 1]?.winner ?? null;
  const winnerLabel = winner ? CANDIDATE_LABEL[winner] : "—";

  return (
    <section className="mt-8" aria-live="polite">
      <hr className="rule-thick" />
      <span className="kicker mt-3 inline-block">Result</span>
      <h3 className="display mt-1 text-xl text-ink sm:text-2xl">
        {winnerLabel} wins after {rounds.length}{" "}
        {rounds.length === 1 ? "round" : "rounds"} of counting.
      </h3>

      <div className="mt-5 overflow-x-auto border border-rule">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-bg">
            <tr>
              <th
                scope="col"
                className="border-b border-rule px-3 py-2 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-subtle"
              >
                Candidate
              </th>
              {rounds.map((r) => (
                <th
                  key={r.number}
                  scope="col"
                  className="border-b border-l border-rule px-3 py-2 text-right font-mono text-[11px] font-bold uppercase tracking-wider text-subtle"
                >
                  Round {r.number}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CANDIDATES.map((c) => (
              <tr key={c} className="bg-paper">
                <th
                  scope="row"
                  className="border-b border-rule px-3 py-2 text-left font-medium text-ink"
                >
                  {CANDIDATE_LABEL[c]}
                </th>
                {rounds.map((r) => {
                  const wasActive = r.active.includes(c);
                  const eliminatedHere = r.eliminated === c;
                  const wonHere = r.winner === c;
                  return (
                    <td
                      key={r.number}
                      className={
                        "border-b border-l border-rule px-3 py-2 text-right tabular-nums " +
                        (wonHere
                          ? "bg-primary font-bold text-primary-fg"
                          : eliminatedHere
                          ? "text-muted line-through"
                          : !wasActive
                          ? "text-subtle"
                          : "text-fg")
                      }
                    >
                      {wasActive ? r.counts[c] : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="bg-bg">
              <th
                scope="row"
                className="px-3 py-2 text-left font-mono text-[11px] font-semibold uppercase tracking-wider text-muted"
              >
                Exhausted ballots
              </th>
              {rounds.map((r) => (
                <td
                  key={r.number}
                  className="border-l border-rule px-3 py-2 text-right tabular-nums text-muted"
                >
                  {r.exhausted}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 border-l-2 border-primary pl-4 sm:pl-5">
        <p className="kicker">Your ballot</p>
        <p className="mt-2 text-base leading-relaxed text-fg sm:text-[17px]">
          You ranked {ballot.map((c) => CANDIDATE_LABEL[c].replace("Candidate ", "")).join(" › ")}.
          Here&apos;s where your vote landed each round:
        </p>
        <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {journey.map((target, i) => (
            <li
              key={i}
              className="flex items-baseline gap-3 border-t-2 border-rule bg-paper p-3"
            >
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                Round {i + 1}
              </span>
              <span className="text-sm text-fg">
                {target === "exhausted"
                  ? "Ballot exhausted — none of your ranked choices remained"
                  : `Counted for ${CANDIDATE_LABEL[target]}`}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
