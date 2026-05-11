export type ImportantDate = {
  iso: string;
  label: string;
  source?: { label: string; url: string };
};

export type Race = {
  office: string;
  status: "open" | "incumbent" | "special";
  oneLine: string;
};

export const PRIMARY_DATE = "2026-06-16T07:00:00-04:00";
export const GENERAL_DATE = "2026-11-03T07:00:00-05:00";

export const importantDates: ImportantDate[] = [
  {
    iso: "2026-05-11",
    label: "Mail ballots begin going out",
    source: { label: "DCBOE 2026 Primary Calendar", url: "https://www.dcboe.org/getmedia/3a7e75bc-4a1b-4aa6-9fc3-f30163beb2b5/2026-Primary-Election-Calendar-Version-08072025.pdf" },
  },
  {
    iso: "2026-05-22",
    label: "Drop boxes open",
    source: { label: "DCBOE", url: "https://www.dcboe.org/" },
  },
  {
    iso: "2026-05-26",
    label: "Voter registration deadline (advance) — same-day registration available during early voting and on election day",
    source: { label: "DCBOE", url: "https://www.dcboe.org/" },
  },
  {
    iso: "2026-06-08",
    label: "Early voting begins",
    source: { label: "DCBOE", url: "https://www.dcboe.org/" },
  },
  {
    iso: "2026-06-14",
    label: "Early voting ends",
    source: { label: "DCBOE", url: "https://www.dcboe.org/" },
  },
  {
    iso: "2026-06-16",
    label: "DC Primary Election Day — polls 7am to 8pm. Ranked-choice voting debuts (Initiative 83).",
    source: { label: "DCBOE", url: "https://www.dcboe.org/" },
  },
  {
    iso: "2026-11-03",
    label: "General Election Day. All ~345 ANC seats also on the ballot.",
    source: { label: "DCBOE", url: "https://www.dcboe.org/" },
  },
];

export const races2026: Race[] = [
  { office: "Mayor", status: "open", oneLine: "Open seat — Bowser not seeking a fourth term. First open mayoral race in DC since 2014. Declared: McDuffie, Lewis George, Orange, Goodweather, Ford + 5 others (10 total)." },
  { office: "Council Chair", status: "incumbent", oneLine: "Phil Mendelson (D) unopposed in the Democratic primary." },
  { office: "Attorney General", status: "incumbent", oneLine: "Brian Schwalb (D) seeks re-election; challenged by J.P. Szymkowicz." },
  { office: "U.S. House Delegate", status: "open", oneLine: "Open seat — Norton retired after 18 terms. First open Delegate race in 35 years. Declared: Pinto, R. White, Zalesne, Brown, Chaffin + 5 others (10 total)." },
  { office: "Council At-Large (Bonds seat)", status: "open", oneLine: "Open Democratic seat — Anita Bonds retiring. Declared: Owolewa, Forester, Chavous, Jackson, Nelson + 4 others (9 total)." },
  { office: "Council At-Large (special)", status: "special", oneLine: "Nonpartisan special election to fill the Independent seat vacated by Kenyan McDuffie. Filed: Crawford, Silverman, Patterson, Lee, Sloan." },
  { office: "Council Ward 1", status: "open", oneLine: "Open seat — Nadeau not seeking re-election. Declared: Brown, Reyes-Yanes, Raj, Lynch, Trinidade Deramo." },
  { office: "Council Ward 3", status: "incumbent", oneLine: "Matthew Frumin (D) unopposed in the Democratic primary." },
  { office: "Council Ward 5", status: "incumbent", oneLine: "Zachary Parker (D) seeks re-election; challenged by Bernita Carmichael." },
  { office: "Council Ward 6", status: "incumbent", oneLine: "Charles Allen (D) seeks re-election; challenged by Michael Murphy and Gloria Nauden." },
  { office: "Shadow Senator", status: "incumbent", oneLine: "Paul Strauss (D) seeks re-election; challenged by Markus Batchelor and Brandon Winfield-Dean. Statehood-advocacy seat with no congressional vote, salary, or office." },
  { office: "Shadow Representative", status: "open", oneLine: "Open seat — Owolewa running for At-Large Council. Franklin Garcia is the only declared Democrat as of May 2026." },
];

export type ElectionStat = {
  value: string;
  label: string;
  source: { label: string; url: string };
};

// DCBOE publishes a monthly Voter Registration Statistics PDF. Numbers below
// reflect the most recent report; update on each refresh run.
export const electionStats: ElectionStat[] = [
  {
    value: "476,066",
    label: "Active registered voters in DC (Feb 28, 2026)",
    source: {
      label: "DCBOE registration statistics",
      url: "https://www.dcboe.org/data,-maps,-forms/voter-registration-statistics",
    },
  },
  {
    value: "May 11",
    label: "Mail ballots begin going out for the June 16 primary",
    source: {
      label: "DCBOE 2026 Primary Calendar",
      url: "https://www.dcboe.org/getmedia/3a7e75bc-4a1b-4aa6-9fc3-f30163beb2b5/2026-Primary-Election-Calendar-Version-08072025.pdf",
    },
  },
  {
    value: "May 22",
    label: "Drop boxes open citywide; full list posted by DCBOE",
    source: {
      label: "DCBOE",
      url: "https://www.dcboe.org/",
    },
  },
];

export const registrationLinks = [
  { label: "DC Board of Elections — Register or update your registration", url: "https://www.dcboe.org/voters/register-to-vote" },
  { label: "Check your registration status", url: "https://www.dcboe.org/voters/register-to-vote/check-voter-registration-status" },
  { label: "Find your polling place", url: "https://www.dcboe.org/voters/where-to-vote/voting-locations-on-election-day" },
  { label: "Request a mail-in ballot", url: "https://www.dcboe.org/voters/in-person-mail-in-voting/by-mail" },
  { label: "How ranked-choice voting works in DC (Initiative 83)", url: "https://www.dcboe.org/elections/ranked-choice-voting" },
];
