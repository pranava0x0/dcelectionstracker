import { describe, expect, it } from "vitest";
import {
  classifyVotingPhase,
  formatMonthDay,
  votingNotice,
  PRIMARY_VOTING_WINDOW,
} from "./election-phase";

describe("classifyVotingPhase", () => {
  it("is pre-window before mail ballots go out", () => {
    expect(classifyVotingPhase("2026-05-10")).toBe("pre-window");
    expect(classifyVotingPhase("2026-01-01")).toBe("pre-window");
  });

  it("is mail-open from mail start until early voting opens", () => {
    expect(classifyVotingPhase("2026-05-11")).toBe("mail-open");
    expect(classifyVotingPhase("2026-06-07")).toBe("mail-open");
  });

  it("is early-voting from the first through the last early-voting day", () => {
    expect(classifyVotingPhase("2026-06-08")).toBe("early-voting");
    expect(classifyVotingPhase("2026-06-11")).toBe("early-voting");
    expect(classifyVotingPhase("2026-06-14")).toBe("early-voting");
  });

  it("is election-eve between early voting end and primary day", () => {
    expect(classifyVotingPhase("2026-06-15")).toBe("election-eve");
  });

  it("is primary-day on primary day only", () => {
    expect(classifyVotingPhase("2026-06-16")).toBe("primary-day");
  });

  it("is post-primary after primary day", () => {
    expect(classifyVotingPhase("2026-06-17")).toBe("post-primary");
    expect(classifyVotingPhase("2026-12-31")).toBe("post-primary");
  });
});

describe("formatMonthDay", () => {
  it("formats without timezone drift", () => {
    expect(formatMonthDay("2026-06-08")).toBe("June 8");
    expect(formatMonthDay("2026-06-16")).toBe("June 16");
    expect(formatMonthDay("2026-11-03")).toBe("November 3");
  });
});

describe("votingNotice", () => {
  it("returns null before the window and after the primary", () => {
    expect(votingNotice("2026-05-01")).toBeNull();
    expect(votingNotice("2026-06-17")).toBeNull();
  });

  it("surfaces mail ballots before early voting", () => {
    const n = votingNotice("2026-05-20");
    expect(n?.phase).toBe("mail-open");
    expect(n?.headline).toContain("Mail ballots");
    expect(n?.detail).toContain("June 8");
  });

  it("surfaces early voting with hours, end date, and primary day", () => {
    const n = votingNotice("2026-06-11");
    expect(n?.phase).toBe("early-voting");
    expect(n?.headline).toBe("Early voting is open now.");
    expect(n?.detail).toContain("8:30am–7pm");
    expect(n?.detail).toContain("June 14");
    expect(n?.detail).toContain("June 16");
  });

  it("flips to election-eve copy the day after early voting ends", () => {
    const n = votingNotice("2026-06-15");
    expect(n?.phase).toBe("election-eve");
    expect(n?.headline).toContain("June 16");
    expect(n?.detail).toContain("7am–8pm");
  });

  it("announces election day on primary day", () => {
    const n = votingNotice("2026-06-16");
    expect(n?.phase).toBe("primary-day");
    expect(n?.headline).toBe("Today is Primary Election Day.");
  });

  it("derives copy from the window passed in, not hard-coded dates", () => {
    const n = votingNotice("2026-10-30", {
      mailStart: "2026-10-05",
      earlyStart: "2026-10-26",
      earlyEnd: "2026-11-01",
      primaryDay: "2026-11-03",
    });
    expect(n?.phase).toBe("early-voting");
    expect(n?.detail).toContain("November 1");
    expect(n?.detail).toContain("November 3");
  });
});
