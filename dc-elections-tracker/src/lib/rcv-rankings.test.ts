import { describe, expect, it } from "vitest";
import { runIRV, type Round } from "./rcv";
import {
  nextRank,
  userBallotFromRankings,
  userVoteJourney,
  withoutRank,
  type Rankings,
} from "./rcv-rankings";

describe("userBallotFromRankings", () => {
  it("returns an empty ballot when nothing is ranked", () => {
    expect(userBallotFromRankings({})).toEqual([]);
  });

  it("returns candidates in rank order, not key order", () => {
    const rankings: Rankings = { C: 1, A: 2, B: 3 };
    expect(userBallotFromRankings(rankings)).toEqual(["C", "A", "B"]);
  });

  it("ignores candidates that have no rank assigned", () => {
    const rankings: Rankings = { A: 1, C: 2 };
    expect(userBallotFromRankings(rankings)).toEqual(["A", "C"]);
  });

  it("handles partial rankings without filling gaps", () => {
    const rankings: Rankings = { A: 1, B: 3, C: 4 };
    expect(userBallotFromRankings(rankings)).toEqual(["A", "B", "C"]);
  });
});

describe("nextRank", () => {
  it("returns 1 for an empty ranking", () => {
    expect(nextRank({})).toBe(1);
  });

  it("returns the next sequential rank when ranks are densely used from 1", () => {
    expect(nextRank({ A: 1, B: 2 })).toBe(3);
  });

  it("fills the lowest gap when ranks are sparse", () => {
    expect(nextRank({ A: 1, B: 3 })).toBe(2);
    expect(nextRank({ A: 2, B: 4 })).toBe(1);
  });

  it("caps at the candidate-count ceiling when all 5 are ranked", () => {
    expect(nextRank({ A: 1, B: 2, C: 3, D: 4, E: 5 })).toBe(5);
  });
});

describe("withoutRank", () => {
  it("removes the candidate from the rankings", () => {
    const rankings: Rankings = { A: 1, B: 2, C: 3 };
    expect(withoutRank(rankings, "B")).toEqual({ A: 1, C: 2 });
  });

  it("renumbers higher ranks down by one so there are no gaps", () => {
    const rankings: Rankings = { A: 1, B: 2, C: 3, D: 4 };
    const after = withoutRank(rankings, "B");
    expect(after).toEqual({ A: 1, C: 2, D: 3 });
  });

  it("does not renumber ranks below the removed one", () => {
    const rankings: Rankings = { A: 1, B: 2, C: 3 };
    const after = withoutRank(rankings, "C");
    expect(after).toEqual({ A: 1, B: 2 });
  });

  it("is a no-op when the candidate is not ranked", () => {
    const rankings: Rankings = { A: 1, B: 2 };
    expect(withoutRank(rankings, "C")).toEqual({ A: 1, B: 2 });
  });

  it("returns an empty rankings object when removing the only ranked candidate", () => {
    expect(withoutRank({ A: 1 }, "A")).toEqual({});
  });
});

describe("userVoteJourney", () => {
  function makeRound(active: string[], number: number): Round {
    const counts: Record<string, number> = {};
    for (const c of active) counts[c] = 0;
    return {
      number,
      active: active as Round["active"],
      counts: counts as Round["counts"],
      exhausted: 0,
      eliminated: null,
      winner: null,
    };
  }

  it("traces the ballot to its first-still-active choice in each round", () => {
    const rounds = [
      makeRound(["A", "B", "C", "D", "E"], 1),
      makeRound(["A", "B", "C", "D"], 2),
      makeRound(["A", "B", "C"], 3),
    ];
    expect(userVoteJourney(rounds, ["B", "C", "A"])).toEqual(["B", "B", "B"]);
  });

  it("falls through to the next ranked candidate when the first is eliminated", () => {
    const rounds = [
      makeRound(["A", "B", "C"], 1),
      makeRound(["A", "B"], 2),
    ];
    expect(userVoteJourney(rounds, ["C", "A"])).toEqual(["C", "A"]);
  });

  it("returns 'exhausted' when all of the voter's ranked candidates are eliminated", () => {
    const rounds = [
      makeRound(["A", "B"], 1),
      makeRound(["A"], 2),
    ];
    expect(userVoteJourney(rounds, ["B"])).toEqual(["B", "exhausted"]);
  });

  it("integrates with runIRV — the journey length matches the number of rounds", () => {
    const rounds = runIRV([["A"], ["A"], ["B"], ["C"]], ["A", "B", "C"]);
    const journey = userVoteJourney(rounds, ["C", "A"]);
    expect(journey.length).toBe(rounds.length);
  });
});
