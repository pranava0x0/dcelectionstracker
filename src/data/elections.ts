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
// All items are stored in the data, but the UI displays top 6 items with a
// "Show all" disclosure for older items. This maintains full editorial history
// while keeping the profile page compact.
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
    label: "Early voting begins — 8:30am to 7pm at Vote Centers; same-day registration available",
    source: { label: "DCBOE 2026 Primary Calendar", url: "https://www.dcboe.org/getmedia/3a7e75bc-4a1b-4aa6-9fc3-f30163beb2b5/2026-Primary-Election-Calendar-Version-08072025.pdf" },
  },
  {
    iso: "2026-06-14",
    label: "Early voting ends — last day before Election Day",
    source: { label: "DCBOE 2026 Primary Calendar", url: "https://www.dcboe.org/getmedia/3a7e75bc-4a1b-4aa6-9fc3-f30163beb2b5/2026-Primary-Election-Calendar-Version-08072025.pdf" },
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
  { slug: "mayor", office: "Mayor", status: "open", oneLine: "Open seat — Bowser not seeking a fourth term. First open mayoral race in DC since 2014. 8 declared Democrats; profile page lists the full roster." },
  { slug: "council-chair", office: "Council Chair", status: "includes-incumbent", oneLine: "Phil Mendelson (D) unopposed by major-name challenger; Calvin Gurley also filed." },
  { slug: "attorney-general", office: "Attorney General", status: "includes-incumbent", oneLine: "Brian Schwalb (D) seeks re-election; challenged by J.P. Szymkowicz." },
  { slug: "us-house-delegate", office: "U.S. House Delegate", status: "open", oneLine: "Open seat — Norton retired after 18 terms. First open Delegate race in 35 years. 5 declared Democrats." },
  { slug: "council-at-large-bonds", office: "Council At-Large (Bonds seat)", status: "open", oneLine: "Open Democratic seat — Anita Bonds retiring. 10 declared Democrats tracked here including Owolewa, Chavous, Forester, Jackson, and Raymond (GGWash pick)." },
  { slug: "council-at-large-special", office: "Council At-Large (special)", status: "special", oneLine: "Nonpartisan special election to fill the Independent seat vacated by Kenyan McDuffie. Filed: Crawford, Silverman, Patterson, Lee, Sloan." },
  { slug: "council-ward-1", office: "Council Ward 1", status: "open", oneLine: "Open seat — Nadeau not seeking re-election. 5 active Democrats after Brian Footer suspended Dec 17, 2025." },
  { slug: "council-ward-3", office: "Council Ward 3", status: "includes-incumbent", oneLine: "Matthew Frumin (D) unopposed in the Democratic primary." },
  { slug: "council-ward-5", office: "Council Ward 5", status: "includes-incumbent", oneLine: "Zachary Parker (D) seeks re-election; challenged by Bernita Carmichael." },
  { slug: "council-ward-6", office: "Council Ward 6", status: "includes-incumbent", oneLine: "Charles Allen (D) seeks re-election; challenged by Gloria Nauden and Michael Murphy." },
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
    value: "478,797",
    label: "Active registered voters in DC (Apr 30, 2026); 75% Democratic",
    source: {
      label: "DCBOE registration statistics (April 2026)",
      url: "https://www.dcboe.org/getmedia/3c291ec7-9318-4365-a423-81a08b408e3a/Data-Statistics-Report-4_2026.pdf",
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
    value: "55",
    label: "Mail-ballot drop boxes citywide, open since May 22 through June 16 at 8pm",
    source: {
      label: "DCBOE — drop-box reporting",
      url: "https://dcboe.org/dcboe/media/PDFFiles/Drop-Boxes-Reporting.pdf",
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
      { date: "2026-06-02", outlet: "Washington Blade", headline: "JR.'s hosts meet & greet for mayoral candidate Janeese Lewis George (Capital Stonewall Democrats + Queers for Janeese GOTV canvass)", url: "https://www.washingtonblade.com/2026/06/02/lgbtq-janeese-lewis-george-event-jrs/" },
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW Endorses D.C. Council Candidates in 2026 Special and Primary Elections (Lewis George for mayor)", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-31", outlet: "Washington Post", headline: "The rise of Janeese Lewis George, who could be D.C.'s first democratic socialist mayor", url: "https://www.washingtonpost.com/dc-md-va/2026/05/31/rise-janeese-lewis-george-who-could-be-dcs-first-democratic-socialist-mayor/" },
      { date: "2026-05-29", outlet: "Washington Examiner", headline: "DC Police Union hits Lewis George over pension-fund affordable-housing proposal", url: "https://www.washingtonexaminer.com/news/campaigns/state/4574949/dc-police-union-janeese-lewis-george-leverage-pension-housing/" },
      { date: "2026-05-28", outlet: "Washington Examiner", headline: "Exclusive: Janeese Lewis George backs safe injection sites in DC for drug use", url: "https://www.washingtonexaminer.com/news/campaigns/4584819/janeese-lewis-george-backs-safe-drug-injection-site-dc/" },
      { date: "2026-05-22", outlet: "Washington Post", headline: "In D.C. mayoral race, praise for indicted lawmaker prompts careful tiptoeing", url: "https://www.washingtonpost.com/dc-md-va/2026/05/22/dc-mayoral-race-praise-indicted-lawmaker-prompts-careful-tiptoeing/" },
      { date: "2026-05-21", outlet: "GW Today", headline: "GW Hosts Forum for 2026 D.C. Mayoral Candidates", url: "https://gwtoday.gwu.edu/gw-hosts-forum-2026-dc-mayoral-candidates" },
      { date: "2026-05-20", outlet: "Washington Post (Opinion)", headline: "Opinion | In D.C. mayor's race, Janeese Lewis George calls Trayon White her 'mentor'", url: "https://www.washingtonpost.com/opinions/2026/05/20/dc-mayor-race-janeese-lewis-george-calls-trayon-white-her-mentor/" },
      { date: "2026-05-20", outlet: "City Cast DC", headline: "City Cast DC Poll: Lewis George leads for mayor; ranked choice could boost McDuffie", url: "https://dc.citycast.fm/dc-politics/dc-election-mayor-poll-2026" },
      { date: "2026-05-18", outlet: "Jewish Insider", headline: "D.C. mayoral contender Janeese Lewis George campaigns with embattled councilman with antisemitic history", url: "https://jewishinsider.com/2026/05/janeese-lewis-george-campaign-trayon-white-antisemitic-history/" },
      { date: "2026-05-14", outlet: "Washington Blade", headline: "Capital Stonewall Democrats endorses Janeese Lewis George for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/" },
      { date: "2026-05-14", outlet: "Washington Post", headline: "Ads target D.C. mayoral hopefuls on crime, utilities ahead of June primary", url: "https://www.washingtonpost.com/dc-md-va/2026/05/14/ads-target-dc-mayoral-hopefuls-crime-utilities-ahead-june-primary/" },
      { date: "2026-05-14", outlet: "Washington Post (Opinion)", headline: "Opinion | Janeese Lewis George plan would weaken mayoral control of D.C. schools", url: "https://www.washingtonpost.com/opinions/2026/05/14/janeese-lewis-george-plan-would-weaken-mayoral-control-dc-schools/" },
      { date: "2026-05-13", outlet: "Free DC", headline: "Free DC endorses Janeese Lewis George for D.C. Mayor", url: "https://freedcproject.org/news/our-2026-endorsements-guide" },
      { date: "2026-05-08", outlet: "Greater Greater Washington", headline: "GGWash endorses Janeese Lewis George for mayor of the District of Columbia", url: "https://ggwash.org/view/102464/ggwash-endorses-janeese-lewis-george-for-dc-mayor" },
      { date: "2026-05-01", outlet: "Axios DC", headline: "DC mayor's race: Endorsements for Janeese Lewis George, Kenyan McDuffie", url: "https://www.axios.com/local/washington-dc/2026/05/01/dc-mayor-race-janeese-lewis-george-kenyan-mcduffie" },
      { date: "2026-04-29", outlet: "Washington Post", headline: "Janeese Lewis George faces probe over D.C. mayoral campaign's ties to unions", url: "https://www.washingtonpost.com/dc-md-va/2026/04/29/janeese-lewis-george-unions-allegation/" },
    ],
    newsThemes: [
      {
        headline: "Leading the progressive lane with labor, LGBTQ, urbanist, statehood, and women's-rights endorsements",
        detail: "Greater Greater Washington, Capital Stonewall Democrats, the DC chapter of the National Organization for Women, labor groups, and the statehood-and-resistance coalition Free DC have endorsed Lewis George. Axios reports she also led the field in DC-resident donors.",
        supportingUrls: [
          "https://ggwash.org/view/102464/ggwash-endorses-janeese-lewis-george-for-dc-mayor",
          "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/",
          "https://freedcproject.org/news/our-2026-endorsements-guide",
          "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections",
          "https://www.axios.com/local/washington-dc/2026/05/01/dc-mayor-race-janeese-lewis-george-kenyan-mcduffie",
        ],
      },
      {
        headline: "Faces backlash after attending Trayon White's birthday picnic and calling the indicted councilmember a past 'mentor'",
        detail: "Lewis George — who voted with colleagues to expel White in 2025 — attended his 42nd birthday picnic and described him as 'one of the only people who would mentor me' from her Council arrival. The Washington Post editorial board and news desk both covered the appearance; Jewish Insider noted White's documented history of antisemitic posts.",
        supportingUrls: [
          "https://www.washingtonpost.com/opinions/2026/05/20/dc-mayor-race-janeese-lewis-george-calls-trayon-white-her-mentor/",
          "https://www.washingtonpost.com/dc-md-va/2026/05/22/dc-mayoral-race-praise-indicted-lawmaker-prompts-careful-tiptoeing/",
          "https://jewishinsider.com/2026/05/janeese-lewis-george-campaign-trayon-white-antisemitic-history/",
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
      { date: "2026-05-31", outlet: "Washington Post", headline: "In D.C. mayor's race, Kenyan R. McDuffie wants to offer 'more opportunities' for residents", url: "https://www.washingtonpost.com/dc-md-va/2026/05/31/dc-mayoral-candidate-kenyan-mcduffie-wants-offer-more-opportunities-resident/" },
      { date: "2026-05-28", outlet: "Axios DC", headline: "D.C. mayoral candidates sharpen final messages", url: "https://www.axios.com/local/washington-dc/2026/05/28/dc-mayor-election-candidates-voting" },
      { date: "2026-05-20", outlet: "City Cast DC", headline: "City Cast DC Poll: Lewis George leads for mayor; ranked choice could boost McDuffie", url: "https://dc.citycast.fm/dc-politics/dc-election-mayor-poll-2026" },
      { date: "2026-05-18", outlet: "Axios DC", headline: "DC restaurant association backs Kenyan McDuffie in mayor's race", url: "https://www.axios.com/local/washington-dc/2026/05/18/dc-mayor-race-endorsements-restaurants-ramw" },
      { date: "2026-05-18", outlet: "FOX 5 DC", headline: "Who won the DC mayoral debate? Analysts weigh in", url: "https://www.fox5dc.com/news/who-won-dc-mayoral-debate-analysts-weigh" },
      { date: "2026-05-14", outlet: "Washington Post", headline: "Ads target D.C. mayoral hopefuls on crime, utilities ahead of June primary", url: "https://www.washingtonpost.com/dc-md-va/2026/05/14/ads-target-dc-mayoral-hopefuls-crime-utilities-ahead-june-primary/" },
      { date: "2026-05-14", outlet: "51st", headline: "We fact checked the attacks in the DC mayoral race", url: "https://51st.news/dc-mayoral-race-fact-check/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-07", outlet: "Washington Post", headline: "Former D.C. mayor Anthony Williams endorses Kenyan McDuffie for mayor", url: "https://www.washingtonpost.com/dc-md-va/2026/05/07/anthony-williams-endorses-kenyan-mcduffie-dc-mayor/" },
      { date: "2026-05-01", outlet: "Axios DC", headline: "DC mayor's race: Endorsements for Janeese Lewis George, Kenyan McDuffie", url: "https://www.axios.com/local/washington-dc/2026/05/01/dc-mayor-race-janeese-lewis-george-kenyan-mcduffie" },
      { date: "2026-03-24", outlet: "WJLA", headline: "Md. Senator Angela Alsobrooks endorses Kenyan McDuffie for DC Mayor", url: "https://wjla.com/news/local/kenyan-mcduffie-angela-alsobrooks-endorsement-mayor-senator-maryland-prince-georges-washingtonian-election-campaign-race-home-rule-politics" },
      { date: "2026-03-12", outlet: "Axios DC", headline: "McDuffie targets housing, speed cameras and Trump in mayoral bid", url: "https://www.axios.com/local/washington-dc/2026/03/12/kenyan-mcduffie-dc-mayor-election-janeese-lewis-george" },
      { date: "2026-03-03", outlet: "Washington Post", headline: "In D.C. mayoral race, McDuffie aims to make city 'most affordable' in U.S.", url: "https://www.washingtonpost.com/dc-md-va/2026/03/03/dc-mayoral-election-mcduffie/" },
      { date: "2026-01-14", outlet: "Washington Post", headline: "Kenyan McDuffie launches campaign for D.C. mayor", url: "https://www.washingtonpost.com/dc-md-va/2026/01/14/kenyan-mcduffie-dc-mayor/" },
    ],
    newsThemes: [
      {
        headline: "Picking up establishment muscle — Anthony Williams, Maryland Sen. Alsobrooks, business/real-estate coalition",
        detail: "Former Mayor Anthony Williams endorsed McDuffie on May 7 and the DC restaurant association (RAMW) added its backing on May 18; Maryland Senator Angela Alsobrooks endorsed him on March 24. Axios reports consolidation of real-estate and business endorsements.",
        supportingUrls: [
          "https://www.washingtonpost.com/dc-md-va/2026/05/07/anthony-williams-endorses-kenyan-mcduffie-dc-mayor/",
          "https://www.axios.com/local/washington-dc/2026/05/18/dc-mayor-race-endorsements-restaurants-ramw",
          "https://wjla.com/news/local/kenyan-mcduffie-angela-alsobrooks-endorsement-mayor-senator-maryland-prince-georges-washingtonian-election-campaign-race-home-rule-politics",
          "https://www.axios.com/local/washington-dc/2026/05/01/dc-mayor-race-janeese-lewis-george-kenyan-mcduffie",
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
      { date: "2026-05-21", outlet: "GW Today", headline: "GW Hosts Forum for 2026 D.C. Mayoral Candidates", url: "https://gwtoday.gwu.edu/gw-hosts-forum-2026-dc-mayoral-candidates" },
      { date: "2026-05-02", outlet: "WTOP", headline: "Affordability, home rule and Trump dominate DC mayoral, delegate debates", url: "https://wtop.com/local/2026/05/affordability-home-rule-and-trump-dominate-dc-mayoral-delegate-debates/" },
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
  {
    slug: "gary-goodweather",
    name: "Gary Goodweather",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" },
    websiteUrl: "https://www.goodweatherfordc.com/",
    notes: "First-time DC candidate; real-estate developer and Army veteran.",
    news: [
      { date: "2026-05-21", outlet: "GW Today", headline: "GW Hosts Forum for 2026 D.C. Mayoral Candidates", url: "https://gwtoday.gwu.edu/gw-hosts-forum-2026-dc-mayoral-candidates" },
      { date: "2026-05-18", outlet: "FOX 5 DC", headline: "Who won the DC mayoral debate? Analysts weigh in", url: "https://www.fox5dc.com/news/who-won-dc-mayoral-debate-analysts-weigh" },
      { date: "2026-05-18", outlet: "The Hoya", headline: "DC Mayoral Candidates Debate Affordability, Federal Intervention", url: "https://thehoya.com/news/dc-mayoral-candidates-debate-affordability-federal-intervention/" },
      { date: "2026-05-05", outlet: "GW Hatchet", headline: "Democratic mayoral, delegate candidates debate DC issues in double-header event", url: "https://gwhatchet.com/2026/05/05/democratic-mayoral-delegate-candidates-debate-dc-issues-in-double-header-event/" },
      { date: "2026-05-02", outlet: "WTOP", headline: "Affordability, home rule and Trump dominate DC mayoral, delegate debates", url: "https://wtop.com/local/2026/05/affordability-home-rule-and-trump-dominate-dc-mayoral-delegate-debates/" },
      { date: "2026-03-20", outlet: "51st", headline: "Meet the first-timers running for D.C. mayor", url: "https://51st.news/dc-mayoral-race-goodweather-solomon-sampath-2026/" },
    ],
  },
  {
    slug: "hope-solomon",
    name: "Hope Solomon",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/dc-mayoral-race-goodweather-solomon-sampath-2026/" },
    websiteUrl: "https://hopefordc.com/",
    notes: "First-time candidate; laid-off federal contractor.",
    news: [
      { date: "2026-05-02", outlet: "WTOP", headline: "Affordability, home rule and Trump dominate DC mayoral, delegate debates", url: "https://wtop.com/local/2026/05/affordability-home-rule-and-trump-dominate-dc-mayoral-delegate-debates/" },
      { date: "2026-03-20", outlet: "51st", headline: "Meet the first-timers running for D.C. mayor", url: "https://51st.news/dc-mayoral-race-goodweather-solomon-sampath-2026/" },
      { date: "2026-02-17", outlet: "The Georgetowner", headline: "Campaign Update: Hope Solomon Running for Mayor", url: "https://georgetowner.com/articles/2026/02/17/campaign-updates-hope-solomon-running-for-mayor/" },
      { date: "2026-02-13", outlet: "Axios DC", headline: "2026 D.C. mayoral candidates now include DOGE'd federal worker Hope Solomon", url: "https://www.axios.com/local/washington-dc/2026/02/13/doged-federal-worker-running-for-mayor-dc" },
    ],
    newsThemes: [
      {
        headline: "Laid-off federal contractor running on government efficiency and affordability",
        detail: "Axios framed Solomon's candidacy around her recent federal-contractor layoff; Georgetowner profiled her February launch.",
        supportingUrls: [
          "https://www.axios.com/local/washington-dc/2026/02/13/doged-federal-worker-running-for-mayor-dc",
          "https://georgetowner.com/articles/2026/02/17/campaign-updates-hope-solomon-running-for-mayor/",
        ],
      },
    ],
  },
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
      { date: "2026-05-21", outlet: "GW Today", headline: "GW Hosts Forum for 2026 D.C. Mayoral Candidates", url: "https://gwtoday.gwu.edu/gw-hosts-forum-2026-dc-mayoral-candidates" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-05", outlet: "GW Hatchet", headline: "Democratic mayoral, delegate candidates debate DC issues in double-header event", url: "https://gwhatchet.com/2026/05/05/democratic-mayoral-delegate-candidates-debate-dc-issues-in-double-header-event/" },
      { date: "2026-05-02", outlet: "WTOP", headline: "Affordability, home rule and Trump dominate DC mayoral, delegate debates", url: "https://wtop.com/local/2026/05/affordability-home-rule-and-trump-dominate-dc-mayoral-delegate-debates/" },
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
  {
    slug: "ernest-johnson",
    name: "Ernest Johnson",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" },
    websiteUrl: "https://ernestformayor2026.com/",
    news: [
      { date: "2026-05-21", outlet: "GW Today", headline: "GW Hosts Forum for 2026 D.C. Mayoral Candidates", url: "https://gwtoday.gwu.edu/gw-hosts-forum-2026-dc-mayoral-candidates" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
    ],
  },
  { slug: "kathy-henderson", name: "Kathy Henderson", raceSlug: "mayor", party: "D", filingStatus: "declared", source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" }, websiteUrl: "http://electkathyhendersondcmayor.com/", notes: "Ballot-access status disputed in May 2026 press; verify with DCBOE primary candidate list before relying on this entry." },

  // Council Chair (Democratic primary)
  {
    slug: "phil-mendelson",
    name: "Phil Mendelson",
    raceSlug: "council-chair",
    party: "D",
    filingStatus: "declared",
    incumbent: true,
    source: { label: "Ballotpedia", url: "https://ballotpedia.org/Phil_Mendelson" },
    governmentSiteUrl: "https://dccouncil.gov/council/phil-mendelson/",
    news: [
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW endorses Phil Mendelson for D.C. Council Chair in the 2026 primary", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-14", outlet: "Washington Blade", headline: "Capital Stonewall Democrats endorses Janeese Lewis George for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-04-02", outlet: "Washington City Paper", headline: "Council Chair Phil Mendelson Draws Ethics Complaint For Using Government Office For Campaign Activity", url: "https://washingtoncitypaper.com/article/782998/mendelson-ethics-complaint-government-resources-campaign-activity/" },
    ],
  },
  { slug: "calvin-gurley", name: "Calvin Gurley", raceSlug: "council-chair", party: "D", filingStatus: "declared", source: { label: "Ballotpedia", url: "https://ballotpedia.org/Phil_Mendelson" } },

  // Attorney General (Democratic primary)
  {
    slug: "brian-schwalb",
    name: "Brian Schwalb",
    raceSlug: "attorney-general",
    party: "D",
    filingStatus: "declared",
    incumbent: true,
    source: { label: "Wikipedia — 2026 DC AG", url: "https://en.wikipedia.org/wiki/2026_District_of_Columbia_Attorney_General_election" },
    governmentSiteUrl: "https://oag.dc.gov/",
    websiteUrl: "https://brianfordc.com/",
    news: [
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW endorses Brian Schwalb for D.C. Attorney General in the 2026 primary", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
    ],
  },
  { slug: "jp-szymkowicz", name: "J.P. Szymkowicz", raceSlug: "attorney-general", party: "D", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC AG", url: "https://en.wikipedia.org/wiki/2026_District_of_Columbia_Attorney_General_election" }, websiteUrl: "https://jp4dc.com/" },

  // US House Delegate (Democratic primary)
  {
    slug: "brooke-pinto",
    name: "Brooke Pinto",
    raceSlug: "us-house-delegate",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" },
    notes: "Ward 2 Councilmember.",
    governmentSiteUrl: "https://dccouncil.gov/council/brooke-pinto/",
    websiteUrl: "https://brookepintoforcongress.com/",
    twitterUrl: "https://x.com/brookepintodc",
    news: [
      { date: "2026-05-22", outlet: "Axios DC", headline: "How DC's next delegate would handle Trump", url: "https://www.axios.com/local/washington-dc/2026/05/22/delegate-election-robert-white-brooke-pinto" },
      { date: "2026-05-11", outlet: "East of the River", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://eastoftheriverdcnews.com/2026/05/11/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://www.hillrag.com/2026/05/08/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-02", outlet: "WTOP", headline: "Affordability, home rule and Trump dominate DC mayoral, delegate debates", url: "https://wtop.com/local/2026/05/affordability-home-rule-and-trump-dominate-dc-mayoral-delegate-debates/" },
      { date: "2026-04-27", outlet: "WAMU", headline: "Brooke Pinto is lapping the D.C. delegate field in fundraising. Will it matter in June?", url: "https://wamu.org/story/26/04/27/brooke-pinto-fundraising-dc-delegate-race-robert-white/" },
      { date: "2026-04-14", outlet: "Washington Post", headline: "Brooke Pinto releases opposition report on Robert White in D.C. delegate race", url: "https://www.washingtonpost.com/dc-md-va/2026/04/14/pinto-white-campaign-opposition-report-dc-delegate-race/" },
    ],
    newsThemes: [
      {
        headline: "Lapping the delegate field in fundraising while taking heat for a 67-page opposition dossier on Robert White",
        detail: "WAMU reports Pinto leads delegate-race fundraising by a wide margin. WaPo and Washingtonian covered her mid-April release of an opposition file on Robert White, which White called for her to withdraw over.",
        supportingUrls: [
          "https://wamu.org/story/26/04/27/brooke-pinto-fundraising-dc-delegate-race-robert-white/",
          "https://www.washingtonpost.com/dc-md-va/2026/04/14/pinto-white-campaign-opposition-report-dc-delegate-race/",
          "https://www.hillrag.com/2026/05/08/the-delegate-race-winning-influence-leading-the-resistance-or-both/",
        ],
      },
    ],
  },
  {
    slug: "robert-white",
    name: "Robert White",
    raceSlug: "us-house-delegate",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" },
    notes: "At-Large Councilmember.",
    governmentSiteUrl: "https://dccouncil.gov/council/robert-c-white-jr/",
    websiteUrl: "https://www.joinrobertwhite.com/",
    news: [
      { date: "2026-05-22", outlet: "Axios DC", headline: "How DC's next delegate would handle Trump", url: "https://www.axios.com/local/washington-dc/2026/05/22/delegate-election-robert-white-brooke-pinto" },
      { date: "2026-05-13", outlet: "Free DC", headline: "Free DC endorses Robert White for Delegate to the U.S. House", url: "https://freedcproject.org/news/our-2026-endorsements-guide" },
      { date: "2026-05-11", outlet: "East of the River", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://eastoftheriverdcnews.com/2026/05/11/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://www.hillrag.com/2026/05/08/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-02", outlet: "WTOP", headline: "Affordability, home rule and Trump dominate DC mayoral, delegate debates", url: "https://wtop.com/local/2026/05/affordability-home-rule-and-trump-dominate-dc-mayoral-delegate-debates/" },
      { date: "2026-04-14", outlet: "Washingtonian", headline: "Robert White Calls for Brooke Pinto to Withdraw From DC Delegate Race After She Posts Very Personal Opposition Research", url: "https://washingtonian.com/2026/04/14/robert-white-calls-for-brooke-pinto-to-withdraw-from-dc-delegate-race-after-she-posts-very-personal-opposition-research/" },
    ],
    newsThemes: [
      {
        headline: "Running on a CBC-, labor-, and statehood-coalition 'resistance' lane after publicly demanding Pinto withdraw over opposition dossier",
        detail: "Washingtonian reported White's April 14 call for Pinto to withdraw. The East of the River / HillRag joint profile frames him as the progressive choice against Pinto's insider lane; Free DC formally endorsed him on May 13 as their delegate pick.",
        supportingUrls: [
          "https://washingtonian.com/2026/04/14/robert-white-calls-for-brooke-pinto-to-withdraw-from-dc-delegate-race-after-she-posts-very-personal-opposition-research/",
          "https://www.hillrag.com/2026/05/08/the-delegate-race-winning-influence-leading-the-resistance-or-both/",
          "https://eastoftheriverdcnews.com/2026/05/11/the-delegate-race-winning-influence-leading-the-resistance-or-both/",
          "https://freedcproject.org/news/our-2026-endorsements-guide",
        ],
      },
    ],
  },
  {
    slug: "kinney-zalesne",
    name: "Kinney Zalesne",
    raceSlug: "us-house-delegate",
    party: "D",
    filingStatus: "declared",
    source: { label: "NOTUS", url: "https://www.notus.org/money/dc-delegate-candidates-election-2026-brooke-pinto-robert-white-kinney-zalesne" },
    websiteUrl: "https://www.kinneyfordc.com/",
    news: [
      { date: "2026-05-11", outlet: "East of the River", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://eastoftheriverdcnews.com/2026/05/11/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://www.hillrag.com/2026/05/08/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-02", outlet: "WTOP", headline: "Affordability, home rule and Trump dominate DC mayoral, delegate debates", url: "https://wtop.com/local/2026/05/affordability-home-rule-and-trump-dominate-dc-mayoral-delegate-debates/" },
    ],
  },
  {
    slug: "trent-holbrook",
    name: "Trent Holbrook",
    raceSlug: "us-house-delegate",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" },
    notes: "Former senior legislative counsel to Del. Norton.",
    websiteUrl: "https://trentholbrook.com/Home",
    news: [
      { date: "2026-05-11", outlet: "East of the River", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://eastoftheriverdcnews.com/2026/05/11/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-10", outlet: "WJLA", headline: "Candidates for DC Delegate talk statehood, federal oversight at weekend forum", url: "https://wjla.com/news/elections/dc-delegate-candidates-statehood-congress-weekend-forum-st-coletta-democrats-primary-eleanor-holms-norton-washington-pinto-holbrook-zalesne-jaczko-representation-capitol-hill-staff-politics" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://www.hillrag.com/2026/05/08/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-02", outlet: "WTOP", headline: "Affordability, home rule and Trump dominate DC mayoral, delegate debates", url: "https://wtop.com/local/2026/05/affordability-home-rule-and-trump-dominate-dc-mayoral-delegate-debates/" },
      { date: "2026-01-07", outlet: "CNN Politics", headline: "Longtime DC delegate faces challenge from former staffer for seat in Congress", url: "https://www.cnn.com/2026/01/07/politics/trent-holbrook-challenging-eleanor-holmes-norton-dc-delegate" },
      { date: "2026-01-06", outlet: "Washington Post", headline: "Eleanor Holmes Norton top aide running for her seat in Congress", url: "https://www.washingtonpost.com/dc-md-va/2026/01/06/congress-holmes-norton-seat-staff-holbrook/" },
    ],
    newsThemes: [
      {
        headline: "Former Norton senior counsel arguing inside-the-system experience wins the statehood fight",
        detail: "CNN and WaPo covered his January launch as Norton's top aide challenging her. The May 11 East of the River and HillRag profile contrasts him with the field as the institutional-Capitol-Hill candidate.",
        supportingUrls: [
          "https://www.cnn.com/2026/01/07/politics/trent-holbrook-challenging-eleanor-holmes-norton-dc-delegate",
          "https://www.washingtonpost.com/dc-md-va/2026/01/06/congress-holmes-norton-seat-staff-holbrook/",
          "https://www.hillrag.com/2026/05/08/the-delegate-race-winning-influence-leading-the-resistance-or-both/",
        ],
      },
    ],
  },
  {
    slug: "gregory-jaczko",
    name: "Gregory Jaczko",
    raceSlug: "us-house-delegate",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" },
    notes: "Former NRC chair (Obama administration).",
    websiteUrl: "https://gojaczko4dc.com/",
    news: [
      { date: "2026-05-11", outlet: "East of the River", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://eastoftheriverdcnews.com/2026/05/11/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://www.hillrag.com/2026/05/08/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-02", outlet: "WTOP", headline: "Affordability, home rule and Trump dominate DC mayoral, delegate debates", url: "https://wtop.com/local/2026/05/affordability-home-rule-and-trump-dominate-dc-mayoral-delegate-debates/" },
    ],
  },

  // Council At-Large (open Democratic seat — Bonds retiring)
  {
    slug: "kevin-b-chavous",
    name: "Kevin B. Chavous",
    raceSlug: "council-at-large-bonds",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" },
    notes: "Former community and policy director for Bonds; endorsed by Bonds.",
    websiteUrl: "https://www.chavousfordc.com/",
    news: [
      { date: "2026-05-08", outlet: "HillRag", headline: "At-Large Race Candidates Split on Safety, Housing and DC's Future", url: "https://www.hillrag.com/2026/05/08/at-large-race-candidates-split-on-safety-housing-and-dcs-future/" },
      { date: "2026-05-01", outlet: "East of the River", headline: "Who is Running for the Democratic Nomination for At-Large Councilmember?", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" },
      { date: "2026-04-23", outlet: "Washington Blade (Opinion)", headline: "ROSENSTEIN: Chavous for Democratic D.C. Council-at-Large", url: "https://www.washingtonblade.com/2026/04/23/opinion-rosenstein-supports-kevin-chavous-dc-council/" },
    ],
  },
  {
    slug: "candace-tiana-nelson",
    name: "Candace Tiana Nelson",
    raceSlug: "council-at-large-bonds",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" },
    notes: "Former ANC 4A commissioner.",
    websiteUrl: "https://www.candacefordc.com/",
    news: [
      { date: "2026-05-08", outlet: "HillRag", headline: "At-Large Race Candidates Split on Safety, Housing and DC's Future", url: "https://www.hillrag.com/2026/05/08/at-large-race-candidates-split-on-safety-housing-and-dcs-future/" },
      { date: "2026-05-01", outlet: "East of the River", headline: "Who is Running for the Democratic Nomination for At-Large Councilmember?", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" },
    ],
  },
  {
    slug: "leniqua-jenkins",
    name: "Leniqua'dominique Jenkins",
    raceSlug: "council-at-large-bonds",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" },
    notes: "Former Ward 7 ANC commissioner and Bonds staffer.",
    websiteUrl: "https://www.votejenkinsfordc.com/",
    news: [
      { date: "2026-05-08", outlet: "HillRag", headline: "At-Large Race Candidates Split on Safety, Housing and DC's Future", url: "https://www.hillrag.com/2026/05/08/at-large-race-candidates-split-on-safety-housing-and-dcs-future/" },
      { date: "2026-05-01", outlet: "East of the River", headline: "Who is Running for the Democratic Nomination for At-Large Councilmember?", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" },
    ],
  },
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
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW endorses Oye Owolewa for D.C. Council At-Large in the 2026 primary", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-14", outlet: "Washington Blade", headline: "Capital Stonewall Democrats endorses Janeese Lewis George for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "At-Large Race Candidates Split on Safety, Housing and DC's Future", url: "https://www.hillrag.com/2026/05/08/at-large-race-candidates-split-on-safety-housing-and-dcs-future/" },
      { date: "2026-03-03", outlet: "Northeastern News", headline: "Northeastern Grad and DC Statehood Advocate Eyes Council Role", url: "https://news.northeastern.edu/2026/03/03/dc-council-oye-owolewa/" },
      { date: "2026-02-20", outlet: "Washington Informer", headline: "In D.C. Council Run, Shadow Rep. Oye Owolewa Stands as Antithesis to Incumbent Bonds", url: "https://www.washingtoninformer.com/owolewa-bonds-council-run/" },
      { date: "2026-02-15", outlet: "Working Families Party", headline: "WFP Endorses Oye Owolewa; Aparna Raj for DC Council", url: "https://workingfamilies.org/2026/02/wfp-endorses-oye-owolewa-aparna-raj-for-dc-council/" },
      { date: "2026-02-01", outlet: "We Power DC", headline: "Rep. Oye Owolewa (At-Large Candidate) signs the Public Power Pledge", url: "https://www.wepowerdc.org/latest-news/rep-oye-owolewa-at-large-candidate-signs-the-public-power-pledge" },
      { date: "2026-01-15", outlet: "Axios DC", headline: "Oye Owolewa, DC's 'shadow' rep, has new relevance in Trump era", url: "https://www.axios.com/local/washington-dc/2026/01/15/dc-council-trump-shadow-representative-senator-election" },
    ],
    newsThemes: [
      {
        headline: "Moving from shadow rep to challenger for Bonds's open seat with progressive endorsements and a public-power pledge",
        detail: "WFP, the DC chapter of the National Organization for Women, and the Public Power campaign have backed him; Washington Informer and Northeastern News profile him as the progressive alternative to the seat's outgoing incumbent. Axios highlights a heightened national profile under the Trump-era federal pressure on DC.",
        supportingUrls: [
          "https://workingfamilies.org/2026/02/wfp-endorses-oye-owolewa-aparna-raj-for-dc-council/",
          "https://www.wepowerdc.org/latest-news/rep-oye-owolewa-at-large-candidate-signs-the-public-power-pledge",
          "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections",
          "https://www.washingtoninformer.com/owolewa-bonds-council-run/",
          "https://www.axios.com/local/washington-dc/2026/01/15/dc-council-trump-shadow-representative-senator-election",
        ],
      },
    ],
  },
  { slug: "nate-fleming", name: "Nate Fleming", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" }, notes: "Former shadow representative." },
  {
    slug: "lisa-raymond",
    name: "Lisa Raymond",
    raceSlug: "council-at-large-bonds",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/at-large-candidates-dc-council-anita-bonds/" },
    websiteUrl: "https://lisaraymondfordc.com/",
    notes: "Former president of the DC State Board of Education.",
    news: [
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "At-Large Race Candidates Split on Safety, Housing and DC's Future", url: "https://www.hillrag.com/2026/05/08/at-large-race-candidates-split-on-safety-housing-and-dcs-future/" },
      { date: "2026-05-01", outlet: "East of the River", headline: "Who is Running for the Democratic Nomination for At-Large Councilmember?", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" },
    ],
    newsThemes: [
      {
        headline: "Greater Greater Washington endorses Raymond as most reliable on housing and transit; GLAA rates her +7.5",
        detail: "GGWash named Raymond their at-large pick for her transit-oriented development focus and DC government experience. GLAA gave her a +7.5 rating on May 12, the highest in the at-large field.",
        supportingUrls: [
          "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/",
          "https://www.hillrag.com/2026/05/08/at-large-race-candidates-split-on-safety-housing-and-dcs-future/",
        ],
      },
    ],
  },

  { slug: "dwight-davis", name: "Dwight Davis", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "East of the River", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" }, websiteUrl: "https://www.dwight4dccouncil.com/", notes: "Educator and DC Public Schools community leader." },
  { slug: "dyana-forester", name: "Dyana N.M. Forester", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "East of the River", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" }, websiteUrl: "https://www.dyanafordc.com/", notes: "Past president of the Metropolitan Washington Council, AFL-CIO." },
  { slug: "fred-hill", name: "Fred Hill", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "East of the River", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" }, websiteUrl: "https://www.fredhill4dc.com/", notes: "Small-business owner and former chair of the DC Board of Zoning Adjustment." },
  { slug: "greg-jackson", name: "Greg Jackson", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "East of the River", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" }, websiteUrl: "https://www.jacksonfordc.com/", notes: "Gun-violence-prevention advocate with DC and federal government experience." },

  // Council At-Large (special — Independent seat vacated by McDuffie running for mayor)
  {
    slug: "doni-crawford",
    name: "Doni Crawford",
    raceSlug: "council-at-large-special",
    party: "I",
    filingStatus: "declared",
    incumbent: true,
    source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" },
    notes: "Appointed interim incumbent.",
    news: [
      { date: "2026-05-28", outlet: "Washington Blade (Opinion)", headline: "Dual endorsement for Independent Council-at-large: Patterson or Crawford (rank one #1, the other #2)", url: "https://www.washingtonblade.com/2026/05/28/opinion-council-at-large-dc-patterson-crawford/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Race To Replace McDuffie!", url: "https://www.hillrag.com/2026/05/08/the-race-to-replace-mcduffie/" },
    ],
  },
  {
    slug: "khalil-lee",
    name: "Khalil Lee",
    raceSlug: "council-at-large-special",
    party: "I",
    filingStatus: "declared",
    source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" },
    news: [
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Race To Replace McDuffie!", url: "https://www.hillrag.com/2026/05/08/the-race-to-replace-mcduffie/" },
    ],
  },
  {
    slug: "jacque-patterson",
    name: "Jacque Patterson",
    raceSlug: "council-at-large-special",
    party: "I",
    filingStatus: "declared",
    source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" },
    news: [
      { date: "2026-05-28", outlet: "Washington Blade (Opinion)", headline: "Dual endorsement for Independent Council-at-large: Patterson or Crawford (rank Patterson #1, Crawford #2)", url: "https://www.washingtonblade.com/2026/05/28/opinion-council-at-large-dc-patterson-crawford/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Race To Replace McDuffie!", url: "https://www.hillrag.com/2026/05/08/the-race-to-replace-mcduffie/" },
    ],
  },
  {
    slug: "elissa-silverman",
    name: "Elissa Silverman",
    raceSlug: "council-at-large-special",
    party: "I",
    filingStatus: "declared",
    source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" },
    notes: "Previously held an At-Large Independent seat.",
    news: [
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW endorses Elissa Silverman for the At-Large (non-majority) special election", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Race To Replace McDuffie!", url: "https://www.hillrag.com/2026/05/08/the-race-to-replace-mcduffie/" },
    ],
  },
  {
    slug: "doug-sloan",
    name: "Doug Sloan",
    raceSlug: "council-at-large-special",
    party: "I",
    filingStatus: "declared",
    source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" },
    news: [
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Race To Replace McDuffie!", url: "https://www.hillrag.com/2026/05/08/the-race-to-replace-mcduffie/" },
    ],
  },

  // Council Ward 1 (Democratic primary — open seat, Nadeau not running)
  {
    slug: "rashida-brown",
    name: "Rashida Brown",
    raceSlug: "council-ward-1",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" },
    notes: "Advisory Neighborhood Commissioner; endorsed by outgoing CM Brianne Nadeau.",
    news: [
      { date: "2026-05-14", outlet: "Washington Blade", headline: "Capital Stonewall Democrats endorses Janeese Lewis George for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-10", outlet: "51st", headline: "The state of the 2026 D.C. election (so far)", url: "https://51st.news/2026-dc-election-mayor-ward-1/" },
      { date: "2026-03-29", outlet: "Greater Greater Washington", headline: "We polled Ward 1 on the DC Council primary race", url: "https://ggwash.org/view/103003/we-polled-ward-1-on-dc-council-primary-race" },
    ],
  },
  {
    slug: "miguel-trindade-deramo",
    name: "Miguel Trindade Deramo",
    raceSlug: "council-ward-1",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" },
    notes: "Advisory Neighborhood Commissioner.",
    news: [
      { date: "2026-05-14", outlet: "Washington Blade", headline: "Capital Stonewall Democrats endorses Janeese Lewis George for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
    ],
    newsThemes: [
      {
        headline: "Top-ranked by Capital Stonewall Democrats with a perfect GLAA score in the would-be first-Latino Ward 1 race",
        detail: "Stonewall ranked Trindade Deramo #1 in their Ward 1 preference list on May 14; GLAA gave him +10 on May 12.",
        supportingUrls: [
          "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/",
          "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/",
        ],
      },
    ],
  },
  {
    slug: "aparna-raj",
    name: "Aparna Raj",
    raceSlug: "council-ward-1",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" },
    notes: "Communications manager and tenant organizer.",
    news: [
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW endorses Aparna Raj for D.C. Council Ward 1 in the 2026 primary", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-14", outlet: "Washington Blade", headline: "Capital Stonewall Democrats endorses Janeese Lewis George for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-10", outlet: "51st", headline: "The state of the 2026 D.C. election (so far)", url: "https://51st.news/2026-dc-election-mayor-ward-1/" },
      { date: "2026-04-15", outlet: "The Wash", headline: "Nearly a Dozen Labor Unions In DC Endorse Aparna Raj for Council", url: "https://thewash.org/2026/04/15/nearly-a-dozen-labor-unions-in-dc-endorse-aparna-raj-for-council/" },
      { date: "2026-04-01", outlet: "Greater Greater Washington", headline: "Our 2026 DC Council Democratic primary endorsements", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" },
      { date: "2026-03-29", outlet: "Greater Greater Washington", headline: "We polled Ward 1 on the DC Council primary race", url: "https://ggwash.org/view/103003/we-polled-ward-1-on-dc-council-primary-race" },
      { date: "2026-02-15", outlet: "Working Families Party", headline: "WFP Endorses Oye Owolewa; Aparna Raj for DC Council", url: "https://workingfamilies.org/2026/02/wfp-endorses-oye-owolewa-aparna-raj-for-dc-council/" },
    ],
    newsThemes: [
      {
        headline: "Leads March GGWash poll 42%–25% and consolidating progressive endorsements — WFP, ~11 labor unions, GGWash, GLAA +10, DCNOW",
        detail: "A March 27–29 GGWash poll of 232 likely Ward 1 Democratic primary voters put Raj at 42% among decided voters. GGWash, WFP, the DC chapter of the National Organization for Women, and nearly a dozen labor unions have endorsed her; GLAA gave her +10 on May 12.",
        supportingUrls: [
          "https://ggwash.org/view/103003/we-polled-ward-1-on-dc-council-primary-race",
          "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements",
          "https://thewash.org/2026/04/15/nearly-a-dozen-labor-unions-in-dc-endorse-aparna-raj-for-council/",
          "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections",
          "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/",
        ],
      },
    ],
  },
  {
    slug: "terry-lynch",
    name: "Terry Lynch",
    raceSlug: "council-ward-1",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" },
    news: [
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-10", outlet: "51st", headline: "The state of the 2026 D.C. election (so far)", url: "https://51st.news/2026-dc-election-mayor-ward-1/" },
    ],
  },
  {
    slug: "jackie-reyes-yanes",
    name: "Jackie Reyes Yanes",
    raceSlug: "council-ward-1",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" },
    notes: "Former Bowser administration official.",
    news: [
      { date: "2026-05-10", outlet: "51st", headline: "The state of the 2026 D.C. election (so far)", url: "https://51st.news/2026-dc-election-mayor-ward-1/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
    ],
  },
  { slug: "brian-footer", name: "Brian Footer", raceSlug: "council-ward-1", party: "D", filingStatus: "withdrawn", source: { label: "Washington Blade", url: "https://www.washingtonblade.com/2025/12/17/brian-footer-suspends-campaign-for-ward-1-d-c-council-seat/" }, notes: "Advisory Neighborhood Commissioner. Suspended campaign Dec 17, 2025." },

  // Council Ward 3 (Democratic primary)
  {
    slug: "matthew-frumin",
    name: "Matthew Frumin",
    raceSlug: "council-ward-3",
    party: "D",
    filingStatus: "declared",
    incumbent: true,
    source: { label: "Ballotpedia", url: "https://ballotpedia.org/Matthew_Frumin" },
    websiteUrl: "https://frumin2026.com/",
    news: [
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW endorses Matthew Frumin for D.C. Council Ward 3 in the 2026 primary", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-14", outlet: "Washington Blade", headline: "Capital Stonewall Democrats endorses Janeese Lewis George for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-10", outlet: "51st", headline: "The state of the 2026 D.C. election (so far)", url: "https://51st.news/2026-dc-election-mayor-ward-1/" },
    ],
  },

  // Council Ward 5 (Democratic primary)
  {
    slug: "zachary-parker",
    name: "Zachary Parker",
    raceSlug: "council-ward-5",
    party: "D",
    filingStatus: "declared",
    incumbent: true,
    source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" },
    governmentSiteUrl: "https://dccouncil.gov/council/zachary-parker/",
    news: [
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW endorses Zachary Parker for D.C. Council Ward 5 in the 2026 primary", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-14", outlet: "Washington Blade", headline: "Capital Stonewall Democrats endorses Janeese Lewis George for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
    ],
    newsThemes: [
      {
        headline: "Backed by Capital Stonewall Democrats, DCNOW, and a +7 GLAA rating as Ward 5 incumbent faces a challenger",
        detail: "Stonewall Democrats endorsed Parker on May 14 and the DC chapter of the National Organization for Women added its backing on June 1; GLAA's May 12 ratings gave him +7, the highest among ward incumbents. Bernita Carmichael did not return GLAA's questionnaire.",
        supportingUrls: [
          "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/",
          "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections",
          "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/",
        ],
      },
    ],
  },
  { slug: "bernita-carmichael", name: "Bernita Carmichael", raceSlug: "council-ward-5", party: "D", filingStatus: "declared", source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" } },

  // Council Ward 6 (Democratic primary)
  {
    slug: "charles-allen",
    name: "Charles Allen",
    raceSlug: "council-ward-6",
    party: "D",
    filingStatus: "declared",
    incumbent: true,
    source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" },
    websiteUrl: "https://www.charlesallenward6.com/",
    governmentSiteUrl: "https://dccouncil.gov/council/charles-allen/",
    news: [
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW endorses Charles Allen for D.C. Council Ward 6 in the 2026 primary", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-14", outlet: "Washington Blade", headline: "Capital Stonewall Democrats endorses Janeese Lewis George for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Ward 6 Council Race: A Study in Contrasts", url: "https://www.hillrag.com/2026/05/08/the-ward-6-council-race-a-study-in-contrasts/" },
      { date: "2026-05-02", outlet: "Campaign newsletter", headline: "Ward 6 Update: May 2, 2026", url: "https://www.charlesallenward6.com/newsletter0502", kind: "social" },
    ],
    newsThemes: [
      {
        headline: "Capital Stonewall Democrats, DCNOW, and GLAA back the incumbent; HillRag frames Ward 6 as a study in contrasts",
        detail: "Allen picked up the Capital Stonewall Democrats endorsement, the DC chapter of the National Organization for Women's nod, and a +6.5 GLAA rating in the final two weeks. HillRag's May 8 race profile contrasts his incumbent record against two challengers.",
        supportingUrls: [
          "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/",
          "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections",
          "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/",
          "https://www.hillrag.com/2026/05/08/the-ward-6-council-race-a-study-in-contrasts/",
        ],
      },
    ],
  },
  {
    slug: "gloria-a-nauden",
    name: "Gloria A. Nauden",
    raceSlug: "council-ward-6",
    party: "D",
    filingStatus: "declared",
    source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" },
    websiteUrl: "https://gloriaforward6.com/",
    news: [
      { date: "2026-05-08", outlet: "HillRag", headline: "The Ward 6 Council Race: A Study in Contrasts", url: "https://www.hillrag.com/2026/05/08/the-ward-6-council-race-a-study-in-contrasts/" },
    ],
  },
  { slug: "michael-murphy", name: "Michael Murphy", raceSlug: "council-ward-6", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/05/08/the-ward-6-council-race-a-study-in-contrasts/" }, notes: "Third Democratic challenger to incumbent Allen in Ward 6.", news: [{ date: "2026-05-08", outlet: "HillRag", headline: "The Ward 6 Council Race: A Study in Contrasts", url: "https://www.hillrag.com/2026/05/08/the-ward-6-council-race-a-study-in-contrasts/" }] },

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
    label: "DCBOE — 2026 Primary Candidates list (PDF, Feb 2 filing)",
    url: "https://www.dcboe.org/getmedia/7f585e7c-887c-42c5-988f-9a9c59ba9020/2026-PRIMARY-CANDIDATES-02022026.pdf",
    blurb: "Authoritative filing roster from the DC Board of Elections — refreshed when DCBOE issues a new PDF version.",
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
  { label: "DC Board of Elections — Register or update your registration", url: "https://www.dcboe.org/voters/register-to-vote/register-update-voter-registration" },
  { label: "Check your registration status", url: "https://apps.dcboe.org/VRS" },
  { label: "Find your polling place (DCBOE Vote Center Locator)", url: "https://dcgis.maps.arcgis.com/apps/instant/nearby/index.html?appid=763576faa0b1470ca0559c377cf3b497" },
  { label: "Request a mail-in ballot", url: "https://www.dcboe.org/voters/casting-your-vote/mail-ballot-request" },
  { label: "How ranked-choice voting works in DC (Initiative 83)", url: "https://www.dcboe.org/rcv" },
];
