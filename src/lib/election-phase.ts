// Phase-aware "how do I vote right now" copy for the primary voting window.
// Pure and date-driven so it's unit-testable and self-clearing: the banner
// renders nothing before mail ballots go out and nothing after primary day.
// All hours/claims mirror the sourced entries in src/data/elections.ts
// importantDates (DCBOE 2026 Primary Calendar).

export type VotingWindow = {
  /** Mail ballots begin going out. */
  mailStart: string;
  /** First day of in-person early voting. */
  earlyStart: string;
  /** Last day of in-person early voting. */
  earlyEnd: string;
  /** Primary Election Day. */
  primaryDay: string;
};

// ISO YYYY-MM-DD throughout; string comparison is safe for this format.
export const PRIMARY_VOTING_WINDOW: VotingWindow = {
  mailStart: "2026-05-11",
  earlyStart: "2026-06-08",
  earlyEnd: "2026-06-14",
  primaryDay: "2026-06-16",
};

export type VotingPhase =
  | "pre-window" // before mail ballots go out
  | "mail-open" // mail ballots out, early voting not yet open
  | "early-voting" // vote centers open
  | "election-eve" // early voting closed, primary day not yet here
  | "primary-day"
  | "post-primary";

export function classifyVotingPhase(
  buildDate: string,
  w: VotingWindow = PRIMARY_VOTING_WINDOW,
): VotingPhase {
  if (buildDate < w.mailStart) return "pre-window";
  if (buildDate < w.earlyStart) return "mail-open";
  if (buildDate <= w.earlyEnd) return "early-voting";
  if (buildDate < w.primaryDay) return "election-eve";
  if (buildDate === w.primaryDay) return "primary-day";
  return "post-primary";
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-06-14" → "June 14". Parses parts directly — no Date, no timezone drift. */
export function formatMonthDay(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${MONTHS[Number(m) - 1] ?? m} ${Number(d)}`;
}

export type VotingNotice = {
  phase: VotingPhase;
  kicker: string;
  headline: string;
  detail: string;
};

/**
 * The banner copy for the current phase, or null when there is nothing
 * actionable to say (before mail ballots, or after the primary).
 */
export function votingNotice(
  buildDate: string,
  w: VotingWindow = PRIMARY_VOTING_WINDOW,
): VotingNotice | null {
  const phase = classifyVotingPhase(buildDate, w);
  const primary = formatMonthDay(w.primaryDay);
  switch (phase) {
    case "mail-open":
      return {
        phase,
        kicker: "Vote by mail",
        headline: "Mail ballots are going out now.",
        detail: `Early voting opens ${formatMonthDay(w.earlyStart)}. Primary Election Day is ${primary}.`,
      };
    case "early-voting":
      return {
        phase,
        kicker: "You can vote today",
        headline: "Early voting is open now.",
        detail: `Vote Centers are open 8:30am–7pm through ${formatMonthDay(w.earlyEnd)}, with same-day registration. Primary Election Day is ${primary}, 7am–8pm.`,
      };
    case "election-eve":
      return {
        phase,
        kicker: "Almost here",
        headline: `Primary Election Day is ${primary}.`,
        detail:
          "Early voting has ended. Polls are open 7am–8pm on Election Day, with same-day registration. Mail ballots must be postmarked or dropped in a drop box by 8pm.",
      };
    case "primary-day":
      return {
        phase,
        kicker: "Today",
        headline: "Today is Primary Election Day.",
        detail:
          "Polls are open 7am–8pm, with same-day registration. Drop boxes accept mail ballots until 8pm.",
      };
    default:
      return null;
  }
}
