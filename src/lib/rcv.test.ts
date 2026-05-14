import { describe, expect, it } from "vitest";
import { BASE_ELECTORATE, type Ballot, runIRV } from "./rcv";

describe("runIRV", () => {
  it("declares a single first-round majority winner with no eliminations", () => {
    const ballots: Ballot[] = [["A"], ["A"], ["A"], ["B"]];
    const rounds = runIRV(ballots, ["A", "B"]);
    expect(rounds).toHaveLength(1);
    expect(rounds[0]!.winner).toBe("A");
    expect(rounds[0]!.eliminated).toBeNull();
    expect(rounds[0]!.counts.A).toBe(3);
    expect(rounds[0]!.counts.B).toBe(1);
  });

  it("eliminates lowest candidate and transfers to next preference", () => {
    const ballots: Ballot[] = [
      ["A", "B"],
      ["A", "B"],
      ["B"],
      ["B"],
      ["C", "B"],
    ];
    const rounds = runIRV(ballots, ["A", "B", "C"]);
    expect(rounds[0]!.eliminated).toBe("C");
    expect(rounds[0]!.counts.C).toBe(1);
    expect(rounds[1]!.winner).toBe("B");
    expect(rounds[1]!.counts.B).toBe(3);
    expect(rounds[1]!.counts.A).toBe(2);
  });

  it("counts exhausted ballots when no remaining preferences are active", () => {
    const ballots: Ballot[] = [["A"], ["A"], ["B"], ["C"]];
    const rounds = runIRV(ballots, ["A", "B", "C"]);
    expect(rounds[0]!.eliminated).toBe("C");
    expect(rounds[0]!.exhausted).toBe(0);
    expect(rounds[1]!.exhausted).toBe(1);
    expect(rounds[1]!.winner).toBe("A");
  });

  it("breaks elimination tie using lowest first-round support", () => {
    const ballots: Ballot[] = [
      ["A"],
      ["A"],
      ["A"],
      ["A"],
      ["B"],
      ["B"],
      ["C"],
      ["C"],
      ["C"],
      ["D", "B"],
    ];
    const rounds = runIRV(ballots, ["A", "B", "C", "D"]);
    expect(rounds[0]!.eliminated).toBe("D");
    expect(rounds[1]!.eliminated).toBe("B");
    expect(rounds[1]!.counts.B).toBe(3);
    expect(rounds[1]!.counts.C).toBe(3);
  });

  it("breaks elimination tie alphabetically last when first-round support is also tied", () => {
    const ballots: Ballot[] = [
      ["A"],
      ["A"],
      ["A"],
      ["B"],
      ["C"],
      ["D"],
    ];
    const rounds = runIRV(ballots, ["A", "B", "C", "D"]);
    expect(rounds[0]!.eliminated).toBe("D");
  });

  it("base electorate produces a B-leaning narrow win without any user ballot", () => {
    const rounds = runIRV(BASE_ELECTORATE);
    const last = rounds[rounds.length - 1]!;
    expect(last.winner).toBe("B");
    expect(last.counts.B).toBeGreaterThan(last.counts.A);
  });

  it("base electorate + user A>C>B can flip the result to A on tiebreak", () => {
    const userBallot: Ballot = ["A", "C", "B"];
    const rounds = runIRV([...BASE_ELECTORATE, userBallot]);
    const last = rounds[rounds.length - 1]!;
    expect(last.winner).toBe("A");
  });

  it("returns rounds in order with monotonically growing round numbers", () => {
    const rounds = runIRV(BASE_ELECTORATE);
    rounds.forEach((r, i) => expect(r.number).toBe(i + 1));
  });

  it("handles empty ballots gracefully", () => {
    const ballots: Ballot[] = [["A"], ["B"], []];
    const rounds = runIRV(ballots, ["A", "B"]);
    expect(rounds[0]!.exhausted).toBe(1);
  });
});
