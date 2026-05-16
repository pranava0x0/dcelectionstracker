export type Source = { label: string; url: string };

export type ImportantDate = {
  iso: string;
  label: string;
  source?: Source;
};

// Race seat-status. Three values, neutral wording:
//   - "open"               → no incumbent is running
//   - "includes-incumbent" → the current officeholder is running, alongside challengers
//   - "special"            → mid-term vacancy under special-election rules
// "incumbent" was renamed to "includes-incumbent" in BL-46 to avoid implying the race
// belongs to its current holder.
export type RaceStatus = "open" | "includes-incumbent" | "special";

export type Race = {
  slug: string;
  office: string;
  status: RaceStatus;
  oneLine: string;
};

// User-facing labels for race-status pills. Kept here so the UI never renders the raw
// machine-string ("includes-incumbent") to a voter.
export const RACE_STATUS_LABEL: Record<RaceStatus, string> = {
  open: "Open seat",
  "includes-incumbent": "Incumbent running",
  special: "Special election",
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

// Recent coverage item shown in the "Recent press & social" block on each
// candidate profile page. Editorial rule: factual citation only — outlet +
// headline + ISO date + canonical URL. No commentary, no paraphrasing of the
// headline. Populated by the dc-data-refresh skill (Step 2.5 — per-candidate
// news + social refresh, 60-day lookback. See BL-42).
//
// `kind` distinguishes press coverage (default) from a candidate's own social
// post or campaign update. Social items render with a small "SOCIAL" pill in
// the profile UI so voters can tell at a glance which were said BY the
// candidate vs. ABOUT the candidate.
export type NewsItem = {
  date: string;   // ISO YYYY-MM-DD
  outlet: string; // e.g. "Washington Post", "DCist", "X (@handle)", "Bluesky"
  headline: string; // for a social post, the post text trimmed to ≤ 200 chars
  url: string;
  kind?: "press" | "social"; // default "press" if absent
};

// One editorial "theme" summarizing a cluster of news items in plain English.
// Rendered at the top of the candidate profile page so voters see the current
// story without having to scan every headline. Synthesized by the dc-data-refresh
// skill (Step 2.5f) from items already in `Candidate.news[]`.
//
// Editorial rules:
//   - `headline` is a short factual phrase — what the candidate is doing or what
//     happened to them, not a value judgement ("Excluded from May 8 debate
//     after meeting Fair Elections threshold" ✓; "Underdog snubbed" ✗)
//   - `detail` is at most 2 sentences explaining the theme; same factual bar
//   - Every URL in `supportingUrls` MUST also appear as a `NewsItem.url` in the
//     candidate's `news[]` array — the test enforces this so themes can never
//     point at links the receipt list doesn't carry
//   - At least 2 supporting URLs per theme (a single article is not a theme).
//     Exception: a candidate's own pinned campaign post can stand alone.
//   - Cap at 2 themes per candidate. If you find more, pick the two with the
//     most recent supporting items.
export type NewsTheme = {
  headline: string; // ≤ 18 words, factual
  detail?: string;  // ≤ 2 sentences, factual
  supportingUrls: string[]; // FK to NewsItem.url entries in this candidate's news[]
};

export type Candidate = {
  slug: string; // kebab-case, globally unique within candidates2026. Used by /elections/[race]/[candidate]/ routes (BL-32).
  name: string;
  raceSlug: string;
  party: CandidateParty;
  filingStatus: FilingStatus;
  incumbent?: boolean;
  source: Source;
  ocfUrl?: string;
  dcboeUrl?: string;
  websiteUrl?: string;
  // Social + government profile URLs. All optional; only populate from the
  // candidate's own confirmed accounts. The candidate profile page renders one
  // labeled link per populated field — no icon library (CLAUDE.md tech rule).
  governmentSiteUrl?: string; // official DC.gov / dccouncil.gov page for incumbents
  twitterUrl?: string;        // X/Twitter
  linkedinUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  notes?: string;
  bio?: string; // ≤ 2 sentences, factual only — never editorial. Shown on the per-candidate profile page (BL-32).
  // Comparison-matrix positions (BL-19). Sparse — only populate cells you can cite directly
  // from the candidate (website, press release, debate quote). Reporter characterizations
  // and endorsement-org summaries are NOT valid sources. Missing keys render as
  // "No position stated" in the UI — do not infer.
  positions?: Partial<Record<ComparableIssueSlug, Position>>;
  // Recent coverage (BL-42). Sparse — populated by the data-refresh skill from
  // the media-source database (BL-33). Render newest-first on profile page.
  news?: NewsItem[];
  // Editorial themes synthesized from `news[]` (BL-42 v2). At most 2 themes per
  // candidate; each theme's supportingUrls must appear in news[]. Rendered as
  // the "What's happening" block near the top of the profile page.
  newsThemes?: NewsTheme[];
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
  { slug: "mayor", office: "Mayor", status: "open", oneLine: "Open seat — Bowser not seeking a fourth term. First open mayoral race in DC since 2014. 10 declared Democrats; profile page lists the full roster." },
  { slug: "council-chair", office: "Council Chair", status: "includes-incumbent", oneLine: "Phil Mendelson (D) unopposed by major-name challenger; Calvin Gurley also filed." },
  { slug: "attorney-general", office: "Attorney General", status: "includes-incumbent", oneLine: "Brian Schwalb (D) seeks re-election; challenged by J.P. Szymkowicz." },
  { slug: "us-house-delegate", office: "U.S. House Delegate", status: "open", oneLine: "Open seat — Norton retired after 18 terms. First open Delegate race in 35 years. 5 declared Democrats." },
  { slug: "council-at-large-bonds", office: "Council At-Large (Bonds seat)", status: "open", oneLine: "Open Democratic seat — Anita Bonds retiring. 5 declared Democrats including Owolewa and Chavous." },
  { slug: "council-at-large-special", office: "Council At-Large (special)", status: "special", oneLine: "Nonpartisan special election to fill the Independent seat vacated by Kenyan McDuffie. Filed: Crawford, Silverman, Patterson, Lee, Sloan." },
  { slug: "council-ward-1", office: "Council Ward 1", status: "open", oneLine: "Open seat — Nadeau not seeking re-election. 6 declared Democrats." },
  { slug: "council-ward-3", office: "Council Ward 3", status: "includes-incumbent", oneLine: "Matthew Frumin (D) unopposed in the Democratic primary." },
  { slug: "council-ward-5", office: "Council Ward 5", status: "includes-incumbent", oneLine: "Zachary Parker (D) seeks re-election; challenged by Bernita Carmichael." },
  { slug: "council-ward-6", office: "Council Ward 6", status: "includes-incumbent", oneLine: "Charles Allen (D) seeks re-election; challenged by Gloria Nauden." },
  { slug: "shadow-senator", office: "Shadow Senator", status: "includes-incumbent", oneLine: "Paul Strauss (D) seeks re-election. Statehood-advocacy seat with no congressional vote, salary, or office." },
  { slug: "shadow-representative", office: "Shadow Representative", status: "open", oneLine: "Open seat — Owolewa not seeking re-election (running for At-Large Council)." },
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

// Declared candidates for the June 16, 2026 primary, hand-seeded from publicly reported
// announcements as of 2026-05-10. Filing status is "declared" by default — the data-refresh
// skill should upgrade to "filed" once the candidate is confirmed on the DCBOE primary
// candidate roster PDF (https://www.dcboe.org/candidates) and add ocfUrl + dcboeUrl per row.
// Names with apostrophes / accents preserved as published. Listed roughly in announcement
// order per race; the UI sorts alphabetically on render.
export const candidates2026: Candidate[] = [
  // Mayor (Democratic primary)
  {
    slug: "janeese-lewis-george",
    name: "Janeese Lewis George",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "Wikipedia — 2026 DC mayoral", url: "https://en.wikipedia.org/wiki/2026_Washington,_D.C.,_mayoral_election" },
    websiteUrl: "https://janeesefordc.com/",
    governmentSiteUrl: "https://dccouncil.gov/council/janeese-lewis-george/",
    positions: {
      housing: {
        stance: "Strengthen rent stabilization, build publicly owned mixed-income housing (Dignified Homes DC), restore TOPA tenant-purchase rights, reform zoning to add supply.",
        sourceLabel: "Campaign site — Homes For All",
        sourceUrl: "https://janeesefordc.com/platform/homes-for-all/",
      },
    },
    news: [
      { date: "2026-05-14", outlet: "Washington Post (Opinion)", headline: "Opinion | Janeese Lewis George plan would weaken mayoral control of D.C. schools", url: "https://www.washingtonpost.com/opinions/2026/05/14/janeese-lewis-george-plan-would-weaken-mayoral-control-dc-schools/" },
      { date: "2026-05-14", outlet: "Washington Blade", headline: "Capital Stonewall Democrats endorses Janeese Lewis George for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/" },
      { date: "2026-05-12", outlet: "The Georgetowner", headline: "Mayoral Candidate Janeese Lewis George", url: "https://georgetowner.com/articles/2026/05/12/mayoral-candidate-janeese-lewis-george/" },
      { date: "2026-05-08", outlet: "Greater Greater Washington", headline: "GGWash endorses Janeese Lewis George for mayor of the District of Columbia", url: "https://ggwash.org/view/102464/ggwash-endorses-janeese-lewis-george-for-dc-mayor" },
      { date: "2026-05-01", outlet: "Axios DC", headline: "DC mayor's race: Endorsements for Janeese Lewis George, Kenyan McDuffie", url: "https://www.axios.com/local/washington-dc/2026/05/01/dc-mayor-race-janeese-lewis-george-kenyan-mcduffie" },
      { date: "2026-03-01", outlet: "Campaign site", headline: "Our movement is broad and inclusive, and that is how I will govern as mayor", url: "https://janeesefordc.com/2026/03/our-movement-is-broad/", kind: "social" },
      { date: "2026-02-01", outlet: "Campaign site", headline: "Janeese Lewis George starts 2026 with thousands of DC donors and petition signatures", url: "https://janeesefordc.com/2026/02/janeese-lewis-george-starts-2026/", kind: "social" },
    ],
    newsThemes: [
      {
        headline: "Leading the progressive lane with labor, LGBTQ, and urbanist endorsements",
        detail: "Greater Greater Washington, Capital Stonewall Democrats, and labor groups have endorsed Lewis George for the June 16 Democratic primary. Axios reports she has also led the field in DC-resident donors this period.",
        supportingUrls: [
          "https://ggwash.org/view/102464/ggwash-endorses-janeese-lewis-george-for-dc-mayor",
          "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/",
          "https://www.axios.com/local/washington-dc/2026/05/01/dc-mayor-race-janeese-lewis-george-kenyan-mcduffie",
          "https://janeesefordc.com/2026/02/janeese-lewis-george-starts-2026/",
        ],
      },
    ],
  },
  {
    slug: "kenyan-mcduffie",
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
    news: [
      { date: "2026-05-12", outlet: "The Georgetowner", headline: "Mayoral Candidate Kenyan McDuffie", url: "https://georgetowner.com/articles/2026/05/12/mayoral-candidate-kenyan-mcduffie/" },
      { date: "2026-05-01", outlet: "Axios DC", headline: "DC mayor's race: Endorsements for Janeese Lewis George, Kenyan McDuffie", url: "https://www.axios.com/local/washington-dc/2026/05/01/dc-mayor-race-janeese-lewis-george-kenyan-mcduffie" },
      { date: "2026-04-15", outlet: "WTOP", headline: "Kenyan McDuffie and Janeese Lewis George go toe to toe in DC mayoral debate", url: "https://wtop.com/dc/2026/04/kenyan-mcduffie-and-janeese-lewis-george-go-toe-to-toe-in-dc-mayoral-debate/" },
      { date: "2026-03-12", outlet: "Axios DC", headline: "McDuffie targets housing, speed cameras and Trump in mayoral bid", url: "https://www.axios.com/local/washington-dc/2026/03/12/kenyan-mcduffie-dc-mayor-election-janeese-lewis-george" },
      { date: "2026-03-08", outlet: "Washington Post", headline: "McDuffie, Lewis George reveal distinct styles in D.C. mayoral race", url: "https://www.washingtonpost.com/dc-md-va/2026/03/08/dc-mayors-race-mcduffie-lewis-george-styles/" },
      { date: "2026-03-03", outlet: "Washington Post", headline: "In D.C. mayoral race, McDuffie aims to make city 'most affordable' in U.S.", url: "https://www.washingtonpost.com/dc-md-va/2026/03/03/dc-mayoral-election-mcduffie/" },
      { date: "2026-01-14", outlet: "Washington Post", headline: "Kenyan McDuffie launches campaign for D.C. mayor", url: "https://www.washingtonpost.com/dc-md-va/2026/01/14/kenyan-mcduffie-dc-mayor/" },
    ],
    newsThemes: [
      {
        headline: "Running as the centrist counterweight to Lewis George with a business-and-real-estate-backed coalition",
        detail: "Axios reports McDuffie has consolidated real-estate and business endorsements; head-to-head debate coverage from WTOP and the Washington Post frames the race as McDuffie vs. Lewis George.",
        supportingUrls: [
          "https://www.axios.com/local/washington-dc/2026/05/01/dc-mayor-race-janeese-lewis-george-kenyan-mcduffie",
          "https://wtop.com/dc/2026/04/kenyan-mcduffie-and-janeese-lewis-george-go-toe-to-toe-in-dc-mayoral-debate/",
          "https://www.washingtonpost.com/dc-md-va/2026/03/08/dc-mayors-race-mcduffie-lewis-george-styles/",
        ],
      },
      {
        headline: "Anchoring the platform on a $4B RFK redevelopment, 1,000 new MPD officers, and a 'most affordable city' pitch",
        detail: "WaPo and Axios describe his stated plan: invest near the former RFK Stadium site to create jobs, expand MPD by 1,000 officers, and lower the cost of housing, utilities, and child care.",
        supportingUrls: [
          "https://www.axios.com/local/washington-dc/2026/03/12/kenyan-mcduffie-dc-mayor-election-janeese-lewis-george",
          "https://www.washingtonpost.com/dc-md-va/2026/03/03/dc-mayoral-election-mcduffie/",
          "https://www.washingtonpost.com/dc-md-va/2026/01/14/kenyan-mcduffie-dc-mayor/",
        ],
      },
    ],
  },
  {
    slug: "vincent-orange",
    name: "Vincent Orange",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" },
    websiteUrl: "https://orangeformayor.com/",
    facebookUrl: "https://www.facebook.com/VincentOrangeVO/",
    instagramUrl: "https://www.instagram.com/vincentorangevo/",
    notes: "Former DC Councilmember and former DC Chamber of Commerce president. Third mayoral run.",
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
    news: [
      { date: "2026-04-25", outlet: "HillRag", headline: "Mayoral Candidates Debate Youth Curfew and Immigration Enforcement", url: "https://www.hillrag.com/2026/04/25/mayoral-candidates-clash-over-curfew-and-immigration-enforcement/" },
      { date: "2026-04-23", outlet: "The Georgetowner", headline: "A Tense but Polite Mayoral Forum at MLK Library", url: "https://georgetowner.com/articles/2026/04/23/a-tense-but-polite-mayoral-forum-at-mlk-library/" },
      { date: "2026-01-26", outlet: "The Georgetowner", headline: "Update on 2026 D.C. Campaigns for Mayor, Delegate, and Council — Holmes Norton ends campaign, Orange starts his", url: "https://georgetowner.com/articles/2026/01/26/holmes-norton-ends-campaign-orange-starts-his/" },
      { date: "2026-01-23", outlet: "Washington Post", headline: "Former D.C. Council member Vincent Orange running for mayor", url: "https://www.washingtonpost.com/dc-md-va/2026/01/23/dc-mayor-vincent-orange-running/" },
      { date: "2026-01-23", outlet: "WJLA", headline: "Former DC Councilmember Vincent Orange will run for Mayor", url: "https://wjla.com/news/local/vincent-orange-running-for-mayor-dc-mayoral-run-dc-councilman-chamber-of-commerce-president-conflict-of-interest-scandal-resignation" },
    ],
    newsThemes: [
      {
        headline: "Third mayoral run, framed around 'The Orange Plan' of public safety, curfews, and pro-business growth",
        detail: "WaPo and WJLA covered his January launch; recent forums at MLK Library and HillRag's debate report capture him pushing minor curfews and immigration enforcement on the campaign trail.",
        supportingUrls: [
          "https://www.washingtonpost.com/dc-md-va/2026/01/23/dc-mayor-vincent-orange-running/",
          "https://wjla.com/news/local/vincent-orange-running-for-mayor-dc-mayoral-run-dc-councilman-chamber-of-commerce-president-conflict-of-interest-scandal-resignation",
          "https://www.hillrag.com/2026/04/25/mayoral-candidates-clash-over-curfew-and-immigration-enforcement/",
          "https://georgetowner.com/articles/2026/04/23/a-tense-but-polite-mayoral-forum-at-mlk-library/",
        ],
      },
    ],
  },
  { slug: "gary-goodweather", name: "Gary Goodweather", raceSlug: "mayor", party: "D", filingStatus: "declared", source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" } },
  { slug: "hope-solomon", name: "Hope Solomon", raceSlug: "mayor", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/dc-mayoral-race-goodweather-solomon-sampath-2026/" } },
  {
    slug: "rini-sampath",
    name: "Rini Sampath",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/dc-mayoral-race-goodweather-solomon-sampath-2026/" },
    websiteUrl: "https://riniformayor.com/",
    notes: "First-time DC candidate; government contractor.",
    news: [
      { date: "2026-05-05", outlet: "GW Hatchet", headline: "Democratic mayoral, delegate candidates debate DC issues in double-header event", url: "https://gwhatchet.com/2026/05/05/democratic-mayoral-delegate-candidates-debate-dc-issues-in-double-header-event/" },
      { date: "2026-05-01", outlet: "X (@maustermuhle)", headline: "Next week's mayoral debate hosted by @fox5dc and @Georgetown is getting more criticism for excluding some candidates. In @RiniSampath's case, she says she hit one of the eligibility requirements (1,000 campaign donors) but still isn't being allowed in.", url: "https://x.com/maustermuhle/status/2054605130196983818", kind: "social" },
      { date: "2026-04-23", outlet: "The Georgetowner", headline: "A Tense but Polite Mayoral Forum at MLK Library", url: "https://georgetowner.com/articles/2026/04/23/a-tense-but-polite-mayoral-forum-at-mlk-library/" },
      { date: "2026-04-04", outlet: "National Today", headline: "Theni-born Rini Sampath runs for Washington DC mayor", url: "https://nationaltoday.com/us/dc/washington/news/2026/04/04/theni-born-rini-sampath-runs-for-washington-dc-mayor/" },
      { date: "2026-03-20", outlet: "51st", headline: "Meet the first-timers running for D.C. mayor", url: "https://51st.news/dc-mayoral-race-goodweather-solomon-sampath-2026/" },
    ],
    newsThemes: [
      {
        headline: "Excluded from the Fox 5 / Georgetown debate despite saying she hit the 1,000-donor Fair Elections threshold",
        detail: "Sampath's campaign argues she met the Fox 5 / Georgetown debate's donor-count eligibility but was still kept off the stage; the controversy was amplified by reporter Martin Austermuhle and is part of her public framing that the DC political machine is treating the race as a two-horse contest.",
        supportingUrls: [
          "https://x.com/maustermuhle/status/2054605130196983818",
          "https://51st.news/dc-mayoral-race-goodweather-solomon-sampath-2026/",
          "https://gwhatchet.com/2026/05/05/democratic-mayoral-delegate-candidates-debate-dc-issues-in-double-header-event/",
        ],
      },
    ],
  },
  { slug: "ernest-johnson", name: "Ernest Johnson", raceSlug: "mayor", party: "D", filingStatus: "declared", source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" } },
  { slug: "kathy-henderson", name: "Kathy Henderson", raceSlug: "mayor", party: "D", filingStatus: "declared", source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" } },

  // Council Chair (Democratic primary)
  { slug: "phil-mendelson", name: "Phil Mendelson", raceSlug: "council-chair", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Ballotpedia", url: "https://ballotpedia.org/Phil_Mendelson" }, governmentSiteUrl: "https://dccouncil.gov/council/phil-mendelson/" },
  { slug: "calvin-gurley", name: "Calvin Gurley", raceSlug: "council-chair", party: "D", filingStatus: "declared", source: { label: "Ballotpedia", url: "https://ballotpedia.org/Phil_Mendelson" } },

  // Attorney General (Democratic primary)
  { slug: "brian-schwalb", name: "Brian Schwalb", raceSlug: "attorney-general", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Wikipedia — 2026 DC AG", url: "https://en.wikipedia.org/wiki/2026_District_of_Columbia_Attorney_General_election" }, governmentSiteUrl: "https://oag.dc.gov/" },
  { slug: "jp-szymkowicz", name: "J.P. Szymkowicz", raceSlug: "attorney-general", party: "D", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC AG", url: "https://en.wikipedia.org/wiki/2026_District_of_Columbia_Attorney_General_election" }, websiteUrl: "https://jp4dc.com/" },

  // US House Delegate (Democratic primary)
  { slug: "brooke-pinto", name: "Brooke Pinto", raceSlug: "us-house-delegate", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" }, notes: "Ward 2 Councilmember.", governmentSiteUrl: "https://dccouncil.gov/council/brooke-pinto/" },
  { slug: "robert-white", name: "Robert White", raceSlug: "us-house-delegate", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" }, notes: "At-Large Councilmember.", governmentSiteUrl: "https://dccouncil.gov/council/robert-c-white-jr/" },
  { slug: "kinney-zalesne", name: "Kinney Zalesne", raceSlug: "us-house-delegate", party: "D", filingStatus: "declared", source: { label: "NOTUS", url: "https://www.notus.org/money/dc-delegate-candidates-election-2026-brooke-pinto-robert-white-kinney-zalesne" } },
  { slug: "trent-holbrook", name: "Trent Holbrook", raceSlug: "us-house-delegate", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" }, notes: "Former senior legislative counsel to Del. Norton." },
  { slug: "gregory-jaczko", name: "Gregory Jaczko", raceSlug: "us-house-delegate", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" }, notes: "Former NRC chair." },

  // Council At-Large (open Democratic seat — Bonds retiring)
  { slug: "kevin-b-chavous", name: "Kevin B. Chavous", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" }, notes: "Former community and policy director for Bonds; endorsed by Bonds." },
  { slug: "candace-tiana-nelson", name: "Candace Tiana Nelson", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" }, notes: "Former ANC 4A commissioner." },
  { slug: "leniqua-jenkins", name: "Leniqua'dominique Jenkins", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" }, notes: "Former Ward 7 ANC commissioner and Bonds staffer." },
  {
    slug: "oye-owolewa",
    name: "Oye Owolewa",
    raceSlug: "council-at-large-bonds",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" },
    websiteUrl: "https://www.vote4oye.com/",
    notes: "Current US Shadow Representative.",
    news: [
      { date: "2026-03-03", outlet: "Northeastern News", headline: "Northeastern Grad and DC Statehood Advocate Eyes Council Role", url: "https://news.northeastern.edu/2026/03/03/dc-council-oye-owolewa/" },
      { date: "2026-02-20", outlet: "Washington Informer", headline: "In D.C. Council Run, Shadow Rep. Oye Owolewa Stands as Antithesis to Incumbent Bonds", url: "https://www.washingtoninformer.com/owolewa-bonds-council-run/" },
      { date: "2026-02-15", outlet: "Working Families Party", headline: "WFP Endorses Oye Owolewa; Aparna Raj for DC Council", url: "https://workingfamilies.org/2026/02/wfp-endorses-oye-owolewa-aparna-raj-for-dc-council/" },
      { date: "2026-02-01", outlet: "We Power DC", headline: "Rep. Oye Owolewa (At-Large Candidate) signs the Public Power Pledge", url: "https://www.wepowerdc.org/latest-news/rep-oye-owolewa-at-large-candidate-signs-the-public-power-pledge" },
      { date: "2026-01-15", outlet: "Axios DC", headline: "Oye Owolewa, DC's 'shadow' rep, has new relevance in Trump era", url: "https://www.axios.com/local/washington-dc/2026/01/15/dc-council-trump-shadow-representative-senator-election" },
    ],
    newsThemes: [
      {
        headline: "Moving from shadow rep to challenger for Bonds's open seat with progressive endorsements and a public-power pledge",
        detail: "WFP and the Public Power campaign have backed him; Washington Informer and Northeastern News profile him as the progressive alternative to the seat's outgoing incumbent. Axios highlights a heightened national profile under the Trump-era federal pressure on DC.",
        supportingUrls: [
          "https://workingfamilies.org/2026/02/wfp-endorses-oye-owolewa-aparna-raj-for-dc-council/",
          "https://www.wepowerdc.org/latest-news/rep-oye-owolewa-at-large-candidate-signs-the-public-power-pledge",
          "https://www.washingtoninformer.com/owolewa-bonds-council-run/",
          "https://www.axios.com/local/washington-dc/2026/01/15/dc-council-trump-shadow-representative-senator-election",
        ],
      },
    ],
  },
  { slug: "nate-fleming", name: "Nate Fleming", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" }, notes: "Former shadow representative." },

  // Council At-Large (special — Independent seat vacated by McDuffie running for mayor)
  { slug: "doni-crawford", name: "Doni Crawford", raceSlug: "council-at-large-special", party: "I", filingStatus: "declared", incumbent: true, source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" }, notes: "Appointed interim incumbent." },
  { slug: "khalil-lee", name: "Khalil Lee", raceSlug: "council-at-large-special", party: "I", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" } },
  { slug: "jacque-patterson", name: "Jacque Patterson", raceSlug: "council-at-large-special", party: "I", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" } },
  { slug: "elissa-silverman", name: "Elissa Silverman", raceSlug: "council-at-large-special", party: "I", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" }, notes: "Previously held an At-Large Independent seat." },
  { slug: "doug-sloan", name: "Doug Sloan", raceSlug: "council-at-large-special", party: "I", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" } },

  // Council Ward 1 (Democratic primary — open seat, Nadeau not running)
  { slug: "rashida-brown", name: "Rashida Brown", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" }, notes: "Advisory Neighborhood Commissioner." },
  { slug: "miguel-trindade-deramo", name: "Miguel Trindade Deramo", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" }, notes: "Advisory Neighborhood Commissioner." },
  { slug: "aparna-raj", name: "Aparna Raj", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" }, notes: "Communications manager and tenant organizer." },
  { slug: "terry-lynch", name: "Terry Lynch", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" } },
  { slug: "jackie-reyes-yanes", name: "Jackie Reyes Yanes", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" }, notes: "Former Bowser administration official." },
  { slug: "brian-footer", name: "Brian Footer", raceSlug: "council-ward-1", party: "D", filingStatus: "declared", source: { label: "Washington Blade", url: "https://www.washingtonblade.com/2025/07/10/brian-footer-announces-candidacy-ward-1-dc-council/" }, notes: "Advisory Neighborhood Commissioner." },

  // Council Ward 3 (Democratic primary)
  { slug: "matthew-frumin", name: "Matthew Frumin", raceSlug: "council-ward-3", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Ballotpedia", url: "https://ballotpedia.org/Matthew_Frumin" } },

  // Council Ward 5 (Democratic primary)
  { slug: "zachary-parker", name: "Zachary Parker", raceSlug: "council-ward-5", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" } },
  { slug: "bernita-carmichael", name: "Bernita Carmichael", raceSlug: "council-ward-5", party: "D", filingStatus: "declared", source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" } },

  // Council Ward 6 (Democratic primary)
  { slug: "charles-allen", name: "Charles Allen", raceSlug: "council-ward-6", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" } },
  { slug: "gloria-a-nauden", name: "Gloria A. Nauden", raceSlug: "council-ward-6", party: "D", filingStatus: "declared", source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" } },

  // Shadow Senator (Democratic primary)
  { slug: "paul-strauss", name: "Paul Strauss", raceSlug: "shadow-senator", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Ballotpedia", url: "https://ballotpedia.org/Paul_Strauss" } },

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

export function getCandidateBySlug(slug: string): Candidate | undefined {
  return candidates2026.find((c) => c.slug === slug);
}

// Races that get a dedicated /elections/[race]/ page + per-candidate profiles (BL-32 v1
// scope). Limited to the 4 open seats with the most declared candidates and press
// coverage. Other races are still discoverable via /elections/ (BL-03 expand-on-click) and
// can be promoted into this list once their candidate pool fills out and the data-refresh
// skill has populated bios + positions.
export const PROFILED_RACE_SLUGS = [
  "mayor",
  "council-at-large-bonds",
  "council-ward-1",
  "us-house-delegate",
];

// External voter-research tools to link from each per-race page (BL-32). Per-race
// overrides extend the common list.
export type ExternalTool = { label: string; url: string; blurb: string };

const COMMON_EXTERNAL_TOOLS: ExternalTool[] = [
  {
    label: "DCBOE — Official primary candidate list",
    url: "https://www.dcboe.org/candidates",
    blurb: "Authoritative filing roster from the DC Board of Elections.",
  },
  {
    label: "DC OCF — Campaign finance filings",
    url: "https://efs.ocf.dc.gov/",
    blurb: "Per-committee fundraising and expenditure reports.",
  },
];

const RACE_EXTERNAL_TOOLS: Record<string, ExternalTool[]> = {
  mayor: [
    {
      label: "Ballotpedia — 2026 DC mayoral",
      url: "https://ballotpedia.org/Mayoral_election_in_Washington,_D.C._(2026)",
      blurb: "Cross-checked candidate roster and prior-election context.",
    },
    {
      label: "Wikipedia — 2026 DC mayoral",
      url: "https://en.wikipedia.org/wiki/2026_Washington,_D.C.,_mayoral_election",
      blurb: "Running summary with endorsement and event references.",
    },
  ],
  "us-house-delegate": [
    {
      label: "Ballotpedia — 2026 DC Delegate race",
      url: "https://ballotpedia.org/United_States_House_of_Representatives_election_in_the_District_of_Columbia,_2026",
      blurb: "Cross-checked candidate roster and prior-election context.",
    },
  ],
  "council-at-large-bonds": [
    {
      label: "Ballotpedia — 2026 DC Council races",
      url: "https://ballotpedia.org/City_elections_in_Washington,_D.C._(2026)",
      blurb: "Cross-checked candidate roster across all 2026 Council seats.",
    },
  ],
  "council-ward-1": [
    {
      label: "Ballotpedia — 2026 DC Council races",
      url: "https://ballotpedia.org/City_elections_in_Washington,_D.C._(2026)",
      blurb: "Cross-checked candidate roster across all 2026 Council seats.",
    },
  ],
};

export function externalToolsForRace(slug: string): ExternalTool[] {
  return [...(RACE_EXTERNAL_TOOLS[slug] ?? []), ...COMMON_EXTERNAL_TOOLS];
}

// Race slugs every DC voter sees on the June 16, 2026 primary ballot regardless of ward.
const CITYWIDE_PRIMARY_RACES: string[] = [
  "mayor",
  "council-chair",
  "attorney-general",
  "us-house-delegate",
  "council-at-large-bonds",
  "council-at-large-special",
  "shadow-senator",
  "shadow-representative",
];

// Wards whose Council seat is on the 2026 primary ballot.
const COUNCIL_WARDS_ON_2026_BALLOT = new Set(["1", "3", "5", "6"]);

// Wards whose SBOE seat is on the November 3, 2026 general ballot (terms ending Jan 2027).
// Note: SBOE is nonpartisan and never appears on the June primary.
const SBOE_WARDS_ON_2026_BALLOT = new Set(["1", "3", "5", "6"]);

export type BallotForWard = {
  primaryRaceSlugs: string[]; // races on the user's June 16 primary ballot
  sboeOnGeneralBallot: boolean; // whether the user's ward has an SBOE seat up on Nov 3
};

export function ballotForWard(ward: string): BallotForWard {
  const normalized = ward.replace(/^ward\s*/i, "").trim();
  const primaryRaceSlugs = [...CITYWIDE_PRIMARY_RACES];
  if (COUNCIL_WARDS_ON_2026_BALLOT.has(normalized)) {
    primaryRaceSlugs.push(`council-ward-${normalized}`);
  }
  return {
    primaryRaceSlugs,
    sboeOnGeneralBallot: SBOE_WARDS_ON_2026_BALLOT.has(normalized),
  };
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
