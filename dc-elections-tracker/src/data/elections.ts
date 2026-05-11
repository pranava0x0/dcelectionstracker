export type Source = { label: string; url: string };

export type ImportantDate = {
  iso: string;
  label: string;
  source?: Source;
};

export type Race = {
  slug: string;
  office: string;
  status: "open" | "incumbent" | "special";
  oneLine: string;
};

export type CandidateParty = "D" | "I" | "R" | "Statehood Green" | "Nonpartisan" | "TBD";

export type FilingStatus = "declared" | "filed" | "withdrawn" | "petitioning";

// Issue slugs that can appear as columns in the candidate comparison matrix (BL-19).
// Mirrors the 6 substantive issue pages in src/data/issues.ts. Excludes "ranked-choice"
// (BL-16) since that's procedural — voters don't take policy positions on it.
export type ComparableIssueSlug =
  | "statehood"
  | "public-safety"
  | "housing"
  | "budget"
  | "transportation"
  | "schools";

export type Position = {
  stance: string; // ≤ 25 words, candidate's stated position
  sourceLabel: string; // citation label (e.g., "Candidate site", "WaPo", "GGW questionnaire")
  sourceUrl: string; // direct link to the candidate's words, not a reporter's characterization
};

// One-line framings displayed under each issue column header. These describe what the
// position cell is asking about — keeps voters oriented as they scan the matrix.
export const ISSUE_COLUMN_TAGLINES: Record<ComparableIssueSlug, string> = {
  statehood: "DC autonomy, Home Rule, response to federal overrides",
  "public-safety": "Secure DC, civilian review, federalized MPD response",
  housing: "Rent freeze ballot, TOPA reform, construction targets",
  budget: "FY27 shortfall, federal workforce loss, tax decisions",
  transportation: "Camera enforcement, WMATA funding, traffic deaths",
  schools: "DCPS vs. charters, OSSE oversight, federal K-12 funding",
};

export type Candidate = {
  name: string;
  raceSlug: string;
  party: CandidateParty;
  filingStatus: FilingStatus;
  incumbent?: boolean;
  source: Source;
  ocfUrl?: string;
  dcboeUrl?: string;
  websiteUrl?: string;
  notes?: string;
  // Comparison-matrix positions (BL-19). Sparse — only populate cells you can cite directly
  // from the candidate (website, press release, debate quote). Reporter characterizations
  // and endorsement-org summaries are NOT valid sources. Missing keys render as
  // "No position stated" in the UI — do not infer.
  positions?: Partial<Record<ComparableIssueSlug, Position>>;
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
  { slug: "mayor", office: "Mayor", status: "open", oneLine: "Open seat — Bowser not seeking a fourth term. First open mayoral race in DC since 2014." },
  { slug: "council-chair", office: "Council Chair", status: "incumbent", oneLine: "Phil Mendelson (D) seeks a fourth full term." },
  { slug: "attorney-general", office: "Attorney General", status: "incumbent", oneLine: "Brian Schwalb (D) seeks re-election." },
  { slug: "us-house-delegate", office: "U.S. House Delegate", status: "open", oneLine: "Open seat — Norton retired after 18 terms. First open Delegate race in 35 years." },
  { slug: "council-at-large-bonds", office: "Council At-Large (Bonds seat)", status: "open", oneLine: "Open Democratic seat — Anita Bonds retiring." },
  { slug: "council-at-large-special", office: "Council At-Large (special)", status: "special", oneLine: "Special election to fill the Independent seat vacated by Kenyan McDuffie." },
  { slug: "council-ward-1", office: "Council Ward 1", status: "open", oneLine: "Open seat — Brianne Nadeau not seeking re-election." },
  { slug: "council-ward-3", office: "Council Ward 3", status: "incumbent", oneLine: "Matthew Frumin (D) seeks re-election." },
  { slug: "council-ward-5", office: "Council Ward 5", status: "incumbent", oneLine: "Zachary Parker (D) seeks re-election." },
  { slug: "council-ward-6", office: "Council Ward 6", status: "incumbent", oneLine: "Charles Allen (D) seeks re-election." },
  { slug: "shadow-senator", office: "Shadow Senator", status: "incumbent", oneLine: "Paul Strauss (D) seeks re-election. Statehood-advocacy seat with no congressional vote, salary, or office." },
  { slug: "shadow-representative", office: "Shadow Representative", status: "open", oneLine: "Open seat — Owolewa not seeking re-election (running for At-Large Council)." },
];

// Declared candidates for the June 16, 2026 primary, hand-seeded from publicly reported
// announcements as of 2026-05-10. Filing status is "declared" by default — the data-refresh
// skill should upgrade to "filed" once the candidate is confirmed on the DCBOE primary
// candidate roster PDF (https://www.dcboe.org/candidates) and add ocfUrl + dcboeUrl per row.
// Names with apostrophes / accents preserved as published. Listed roughly in announcement
// order per race; the UI sorts alphabetically on render.
export const candidates2026: Candidate[] = [
  // Mayor (Democratic primary)
  {
    name: "Janeese Lewis George",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "Wikipedia — 2026 DC mayoral", url: "https://en.wikipedia.org/wiki/2026_Washington,_D.C.,_mayoral_election" },
    websiteUrl: "https://janeesefordc.com/",
    positions: {
      housing: {
        stance: "Strengthen rent stabilization, build publicly owned mixed-income housing (Dignified Homes DC), restore TOPA tenant-purchase rights, reform zoning to add supply.",
        sourceLabel: "Campaign site — Homes For All",
        sourceUrl: "https://janeesefordc.com/platform/homes-for-all/",
      },
    },
  },
  {
    name: "Kenyan McDuffie",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "Wikipedia — 2026 DC mayoral", url: "https://en.wikipedia.org/wiki/2026_Washington,_D.C.,_mayoral_election" },
    websiteUrl: "https://kenyanmcduffie.com/",
    notes: "Resigned At-Large Council seat to run.",
    positions: {
      housing: {
        stance: "Expand down-payment assistance for first-time buyers; create a Stay in DC fund to prevent small-business displacement.",
        sourceLabel: "Campaign platform",
        sourceUrl: "https://kenyanmcduffie.com/platform",
      },
      statehood: {
        stance: "Day-one executive directive ending MPD cooperation with federal immigration enforcement; defend DC autonomy against federal overreach.",
        sourceLabel: "Campaign platform",
        sourceUrl: "https://kenyanmcduffie.com/platform",
      },
    },
  },
  {
    name: "Vincent Orange",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" },
    websiteUrl: "https://orangeformayor.com/",
    notes: "Former DC Councilmember.",
    positions: {
      statehood: {
        stance: "Orange Plan names preservation of Home Rule and DC statehood as a core plank.",
        sourceLabel: "Campaign site — Meet Vincent Orange",
        sourceUrl: "https://orangeformayor.com/meet-vincent-orange/",
      },
      budget: {
        stance: "Grow city revenue by stimulating economic activity rather than raising taxes.",
        sourceLabel: "Campaign site — Meet Vincent Orange",
        sourceUrl: "https://orangeformayor.com/meet-vincent-orange/",
      },
      "public-safety": {
        stance: "Public safety is the foundation of the Orange Plan; supports curfews for minors and stronger enforcement.",
        sourceLabel: "Campaign site — Meet Vincent Orange",
        sourceUrl: "https://orangeformayor.com/meet-vincent-orange/",
      },
    },
  },
  { name: "Gary Goodweather", raceSlug: "mayor", party: "D", filingStatus: "declared", source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" } },
  { name: "Hope Solomon", raceSlug: "mayor", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/dc-mayoral-race-goodweather-solomon-sampath-2026/" } },
  { name: "Rini Sampath", raceSlug: "mayor", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/dc-mayoral-race-goodweather-solomon-sampath-2026/" } },
  { name: "Ernest Johnson", raceSlug: "mayor", party: "D", filingStatus: "declared", source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" } },
  { name: "Kathy Henderson", raceSlug: "mayor", party: "D", filingStatus: "declared", source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" } },

  // Council Chair (Democratic primary)
  { name: "Phil Mendelson", raceSlug: "council-chair", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Ballotpedia", url: "https://ballotpedia.org/Phil_Mendelson" } },
  { name: "Calvin Gurley", raceSlug: "council-chair", party: "D", filingStatus: "declared", source: { label: "Ballotpedia", url: "https://ballotpedia.org/Phil_Mendelson" } },

  // Attorney General (Democratic primary)
  { name: "Brian Schwalb", raceSlug: "attorney-general", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Wikipedia — 2026 DC AG", url: "https://en.wikipedia.org/wiki/2026_District_of_Columbia_Attorney_General_election" } },
  { name: "J.P. Szymkowicz", raceSlug: "attorney-general", party: "D", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC AG", url: "https://en.wikipedia.org/wiki/2026_District_of_Columbia_Attorney_General_election" }, websiteUrl: "https://jp4dc.com/" },

  // US House Delegate (Democratic primary)
  { name: "Brooke Pinto", raceSlug: "us-house-delegate", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" }, notes: "Ward 2 Councilmember." },
  { name: "Robert White", raceSlug: "us-house-delegate", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" }, notes: "At-Large Councilmember." },
  { name: "Kinney Zalesne", raceSlug: "us-house-delegate", party: "D", filingStatus: "declared", source: { label: "NOTUS", url: "https://www.notus.org/money/dc-delegate-candidates-election-2026-brooke-pinto-robert-white-kinney-zalesne" } },
  { name: "Trent Holbrook", raceSlug: "us-house-delegate", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" }, notes: "Former senior legislative counsel to Del. Norton." },
  { name: "Gregory Jaczko", raceSlug: "us-house-delegate", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" }, notes: "Former NRC chair." },

  // Council At-Large (open Democratic seat — Bonds retiring)
  { name: "Kevin B. Chavous", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" }, notes: "Former community and policy director for Bonds; endorsed by Bonds." },
  { name: "Candace Tiana Nelson", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" }, notes: "Former ANC 4A commissioner." },
  { name: "Leniqua'dominique Jenkins", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" }, notes: "Former Ward 7 ANC commissioner and Bonds staffer." },
  { name: "Oye Owolewa", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" }, notes: "Current US Shadow Representative." },
  { name: "Nate Fleming", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" }, notes: "Former shadow representative." },

  // Council At-Large (special — Independent seat vacated by McDuffie running for mayor)
  { name: "Doni Crawford", raceSlug: "council-at-large-special", party: "I", filingStatus: "declared", incumbent: true, source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" }, notes: "Appointed interim incumbent." },
  { name: "Khalil Lee", raceSlug: "council-at-large-special", party: "I", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" } },
  { name: "Jacque Patterson", raceSlug: "council-at-large-special", party: "I", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" } },
  { name: "Elissa Silverman", raceSlug: "council-at-large-special", party: "I", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" }, notes: "Previously held an At-Large Independent seat." },
  { name: "Doug Sloan", raceSlug: "council-at-large-special", party: "I", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" } },

  // Council Ward 1 (Democratic primary — open seat, Nadeau not running)
  { name: "Rashida Brown", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" }, notes: "Advisory Neighborhood Commissioner." },
  { name: "Miguel Trindade Deramo", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" }, notes: "Advisory Neighborhood Commissioner." },
  { name: "Aparna Raj", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" }, notes: "Communications manager and tenant organizer." },
  { name: "Terry Lynch", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" } },
  { name: "Jackie Reyes Yanes", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" }, notes: "Former Bowser administration official." },
  { name: "Brian Footer", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "Washington Blade", url: "https://www.washingtonblade.com/2025/07/10/brian-footer-announces-candidacy-ward-1-dc-council/" }, notes: "Advisory Neighborhood Commissioner." },

  // Council Ward 3 (Democratic primary)
  { name: "Matthew Frumin", raceSlug: "council-ward-3", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Ballotpedia", url: "https://ballotpedia.org/Matthew_Frumin" } },

  // Council Ward 5 (Democratic primary)
  { name: "Zachary Parker", raceSlug: "council-ward-5", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" } },
  { name: "Bernita Carmichael", raceSlug: "council-ward-5", party: "D", filingStatus: "declared", source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" } },

  // Council Ward 6 (Democratic primary)
  { name: "Charles Allen", raceSlug: "council-ward-6", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" } },
  { name: "Gloria A. Nauden", raceSlug: "council-ward-6", party: "D", filingStatus: "declared", source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" } },

  // Shadow Senator (Democratic primary)
  { name: "Paul Strauss", raceSlug: "shadow-senator", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Ballotpedia", url: "https://ballotpedia.org/Paul_Strauss" } },

  // Shadow Representative (Democratic primary) — Owolewa not running; declared field unconfirmed in v1.
];

export function candidatesForRace(raceSlug: string): Candidate[] {
  return candidates2026
    .filter((c) => c.raceSlug === raceSlug && c.filingStatus !== "withdrawn")
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getRaceBySlug(slug: string): Race | undefined {
  return races2026.find((r) => r.slug === slug);
}

// Ordered list of comparable issue slugs (matches the order the issue pages appear in
// the site nav and on the homepage). Used by the candidate comparison matrix (BL-19).
export const COMPARABLE_ISSUES: ComparableIssueSlug[] = [
  "statehood",
  "public-safety",
  "housing",
  "budget",
  "transportation",
  "schools",
];

// Race slugs that get a comparison-matrix block on /elections/ (BL-19 v1 scope).
// Adding more races just requires populating positions for their candidates.
export const COMPARISON_RACE_SLUGS = ["mayor", "council-at-large-bonds", "council-ward-1"];

export const registrationLinks = [
  { label: "DC Board of Elections — Register or update your registration", url: "https://www.dcboe.org/voters/register-to-vote" },
  { label: "Check your registration status", url: "https://www.dcboe.org/voters/register-to-vote/check-voter-registration-status" },
  { label: "Find your polling place", url: "https://www.dcboe.org/voters/where-to-vote/voting-locations-on-election-day" },
  { label: "Request a mail-in ballot", url: "https://www.dcboe.org/voters/in-person-mail-in-voting/by-mail" },
  { label: "How ranked-choice voting works in DC (Initiative 83)", url: "https://www.dcboe.org/elections/ranked-choice-voting" },
];
