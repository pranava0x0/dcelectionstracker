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
  // AI-generated "at a glance" digest shown at the top of the profile page.
  // Grounding rule: derived ONLY from data already in this file (positions,
  // newsThemes, notes, bio) — no outside claims, no editorializing. ≤ 80 words.
  // Regenerate whenever positions/themes change materially.
  summary?: string;
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
    summary: "Leads the progressive lane with labor, LGBTQ, urbanist, and statehood-coalition endorsements. Platform: publicly owned mixed-income housing with stronger rent stabilization, prevention-first Community Hubs in all eight wards, dedicated regional WMATA funding, and rescinding MPD's ICE-cooperation order. Recently faced backlash for attending indicted ex-councilmember Trayon White's birthday picnic.",
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
    
      statehood: {
        stance: "Personally lobby Congress for statehood, work with DC's delegate and attorney general to protect Home Rule, and rescind MPD's ICE-cooperation order.",
        sourceLabel: "Campaign site — Stand Up For All DC",
        sourceUrl: "https://janeesefordc.com/platform/stand-up-for-all-dc/",
      },
      "public-safety": {
        stance: "Prevention, intervention, and enforcement strategy; open Community Hubs in all eight wards connecting residents to jobs, services, and mental-health support.",
        sourceLabel: "Campaign site — Safe Communities For All",
        sourceUrl: "https://janeesefordc.com/platform/safe-communities-for-all/",
      },
      budget: {
        stance: "Says her proposals can be funded without raising taxes on working people, by cutting budget waste and closing tax loopholes.",
        sourceLabel: "Georgetown Voice — childcare proposal coverage",
        sourceUrl: "https://georgetownvoice.com/2026/04/28/facing-the-highest-child-care-costs-in-the-country-d-c-voters-weigh-lewis-georges-proposal/",
      },
      transportation: {
        stance: "Secure dedicated long-term regional WMATA funding, add bus lanes, free buses for SNAP enrollees, fully fund the STEER Act, release congestion-pricing study.",
        sourceLabel: "Campaign site — Reliable Transportation For All",
        sourceUrl: "https://janeesefordc.com/platform/reliable-transportation-for-all/",
      },
      schools: {
        stance: "Unify truancy referrals under one agency, expand after-school programs in all eight wards, and grow school staffing including mental-health professionals.",
        sourceLabel: "Campaign site — Excellent Schools For All",
        sourceUrl: "https://janeesefordc.com/platform/excellent-schools-for-all/",
      },
    },
    news: [
      { date: "2026-06-09", outlet: "Washington Times", headline: "D.C. mayoral candidates fight it out in final days before election", url: "https://www.washingtontimes.com/news/2026/jun/9/dc-mayoral-candidates-fight-final-days-election/" },
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC mayoral candidate Janeese Lewis George", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-mayoral-candidate-janeese-lewis-george/" },
      { date: "2026-06-05", outlet: "Washington Post", headline: "Lewis George leads in D.C. mayoral race, but many undecided, Post-Schar School polls finds", url: "https://www.washingtonpost.com/dc-md-va/2026/06/05/lewis-george-leads-dc-mayoral-race-many-undecided-post-schar-school-polls-finds/" },
      { date: "2026-06-02", outlet: "Washington Blade", headline: "JR.'s hosts meet & greet for mayoral candidate Janeese Lewis George (Capital Stonewall Democrats + Queers for Janeese GOTV canvass)", url: "https://www.washingtonblade.com/2026/06/02/lgbtq-janeese-lewis-george-event-jrs/" },
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW Endorses D.C. Council Candidates in 2026 Special and Primary Elections (Lewis George for mayor)", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-31", outlet: "Washington Post", headline: "The rise of Janeese Lewis George, who could be D.C.'s first democratic socialist mayor", url: "https://www.washingtonpost.com/dc-md-va/2026/05/31/rise-janeese-lewis-george-who-could-be-dcs-first-democratic-socialist-mayor/" },
      { date: "2026-05-29", outlet: "Washington Examiner", headline: "DC Police Union hits Lewis George over pension-fund affordable-housing proposal", url: "https://www.washingtonexaminer.com/news/campaigns/state/4574949/dc-police-union-janeese-lewis-george-leverage-pension-housing/" },
      { date: "2026-05-28", outlet: "Washington Examiner", headline: "Exclusive: Janeese Lewis George backs safe injection sites in DC for drug use", url: "https://www.washingtonexaminer.com/news/campaigns/4584819/janeese-lewis-george-backs-safe-drug-injection-site-dc/" },
      { date: "2026-05-26", outlet: "Washington Blade (Opinion)", headline: "Why this Black Pride, I ranked Janeese Lewis George #1 for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/26/opinion-ranked-janeese-lewis-george-number-one-mayor-dc/" },
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
        detail: "Greater Greater Washington, Capital Stonewall Democrats, the DC chapter of the National Organization for Women, labor groups, and the statehood-and-resistance coalition Free DC have endorsed Lewis George. A June 5 Washington Post–Schar School poll showed her leading the mayoral field, though many voters remained undecided; Axios reports she also led the field in DC-resident donors.",
        supportingUrls: [
          "https://www.washingtonpost.com/dc-md-va/2026/06/05/lewis-george-leads-dc-mayoral-race-many-undecided-post-schar-school-polls-finds/",
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
    summary: "Former at-large councilmember who resigned his seat to run; backed by establishment figures including Eric Holder, Anthony Williams, and the restaurant association. Anchors his campaign on a $4B RFK-site redevelopment, 1,000 new MPD officers, violence-as-public-health prevention, and a day-one order ending MPD cooperation with federal immigration enforcement.",
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
    
      "public-safety": {
        stance: "Treat violence as a public-health crisis, fully implement the NEAR Act, recruit officers to cut overtime, and oppose any federal takeover of MPD.",
        sourceLabel: "WTOP candidate questionnaire",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-dc-mayoral-candidate-kenyan-mcduffie/",
      },
      budget: {
        stance: "Close the shortfall by cutting MPD overtime spending, ending underperforming programs, and reallocating funds from underspending agencies.",
        sourceLabel: "Hill Rag — mayoral forum",
        sourceUrl: "https://www.hillrag.com/2026/05/07/mayoral-candidates-clash-over-utility-costs-public-safety-solutions/",
      },
      transportation: {
        stance: "Fully fund Metro; direct RFK-area transit money to upgrading the existing station and building Bus Rapid Transit on the H Street corridor.",
        sourceLabel: "WTOP candidate questionnaire",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-dc-mayoral-candidate-kenyan-mcduffie/",
      },
      schools: {
        stance: "End school overcrowding, fund attendance counselors in every school, and hold OSSE, DCPS, and charter LEAs accountable on special-education compliance.",
        sourceLabel: "WTOP candidate questionnaire",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-dc-mayoral-candidate-kenyan-mcduffie/",
      },
    },
    news: [
      { date: "2026-06-09", outlet: "Washington Times", headline: "D.C. mayoral candidates fight it out in final days before election", url: "https://www.washingtontimes.com/news/2026/jun/9/dc-mayoral-candidates-fight-final-days-election/" },
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC mayoral candidate Kenyan McDuffie", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-mayoral-candidate-kenyan-mcduffie/" },
      { date: "2026-06-05", outlet: "Washington Post", headline: "Lewis George leads in D.C. mayoral race, but many undecided, Post-Schar School polls finds", url: "https://www.washingtonpost.com/dc-md-va/2026/06/05/lewis-george-leads-dc-mayoral-race-many-undecided-post-schar-school-polls-finds/" },
      { date: "2026-06-04", outlet: "Washington Examiner", headline: "Obama-era Attorney General Eric Holder endorses Kenyan McDuffie for DC mayor", url: "https://www.washingtonexaminer.com/news/campaigns/state/4594897/eric-holder-endorse-kenyan-mcduffie-dc-mayor/" },
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
        headline: "Picking up establishment muscle — Eric Holder, Anthony Williams, Maryland Sen. Alsobrooks, business/real-estate coalition",
        detail: "Former Mayor Anthony Williams endorsed McDuffie on May 7 and the DC restaurant association (RAMW) added its backing on May 18; Maryland Senator Angela Alsobrooks endorsed him on March 24, and former U.S. Attorney General Eric Holder added his endorsement on June 4. Axios reports consolidation of real-estate and business endorsements.",
        supportingUrls: [
          "https://www.washingtonexaminer.com/news/campaigns/state/4594897/eric-holder-endorse-kenyan-mcduffie-dc-mayor/",
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
    summary: "Former councilmember and DC Chamber of Commerce president on his third mayoral run. 'The Orange Plan' leads with public safety including curfews for minors, revenue growth without tax increases, workforce housing and tiny homes for residents earning under $50,000, and skepticism of DDOT street redesigns.",
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
    
      housing: {
        stance: "Expand attainable homeownership and rentals; supports workforce housing and tiny homes for residents earning $50,000 or less, aligned with transit and jobs.",
        sourceLabel: "Campaign site — The Orange Plan",
        sourceUrl: "https://orangeformayor.com/the-orange-plan/",
      },
      transportation: {
        stance: "Criticizes DDOT street redesigns and questions the effectiveness of some bike lanes and traffic-calming measures.",
        sourceLabel: "Hill Rag — mayoral forum",
        sourceUrl: "https://www.hillrag.com/2026/05/07/mayoral-candidates-clash-over-utility-costs-public-safety-solutions/",
      },
      schools: {
        stance: "Kindergarten-readiness assessments, math and reading mastery by 4th grade, and four guaranteed graduate paths including tuition-free UDC and apprenticeships.",
        sourceLabel: "Campaign site — The Orange Plan",
        sourceUrl: "https://orangeformayor.com/the-orange-plan/",
      },
    },
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC mayoral candidate Vincent Orange", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-mayoral-candidate-vincent-orange/" },
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
    summary: "Real-estate developer, Army veteran, and first-time candidate with stated positions on all six tracked issues: a 50,000-homes-by-2032 plan with 20-day by-right permits, fare-free Metro for DC residents, full MPD staffing, and 'Super Home Rule' reforms toward statehood.",
    name: "Gary Goodweather",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" },
    positions: {
      statehood: {
        stance: "Pursue statehood through every available pathway and advance 'Super Home Rule' reforms to protect DC from congressional interference.",
        sourceLabel: "Campaign site — Policy & Plans",
        sourceUrl: "https://www.goodweatherfordc.com/policy-plans",
      },
      "public-safety": {
        stance: "Fully staff MPD, fix the 911 system, deploy community policing, and expand youth mentorship programs.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://www.goodweatherfordc.com/issues",
      },
      housing: {
        stance: "Build 50,000 homes by 2032 with 36,000 affordable; guarantee 20-day by-right permit approval; replace TOPA with cooperative-conversion and tenant-ownership programs.",
        sourceLabel: "Campaign site — Housing",
        sourceUrl: "https://www.goodweatherfordc.com/housing",
      },
      budget: {
        stance: "Pledges line-by-line agency budget reviews and permitting reform; says a balanced budget denies the federal government an excuse to intervene.",
        sourceLabel: "Hill Rag — mayoral forum",
        sourceUrl: "https://www.hillrag.com/2026/05/07/mayoral-candidates-clash-over-utility-costs-public-safety-solutions/",
      },
      transportation: {
        stance: "Eliminate Metro fares for DC residents ('Fare Free DC'), paired with investments in service reliability, frequency, and extended hours.",
        sourceLabel: "Campaign site — Policy & Plans",
        sourceUrl: "https://www.goodweatherfordc.com/policy-plans",
      },
      schools: {
        stance: "Every child reading by third grade, universal dyslexia screening, chronic absenteeism below 25%, and an Advanced Technical Center in every ward.",
        sourceLabel: "Campaign site — Policy & Plans",
        sourceUrl: "https://www.goodweatherfordc.com/policy-plans",
      },
    },
    websiteUrl: "https://www.goodweatherfordc.com/",
    notes: "First-time DC candidate; real-estate developer and Army veteran.",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC mayoral candidate Gary Goodweather", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-mayoral-candidate-gary-goodweather/" },
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
    summary: "First-time candidate and laid-off federal contractor running on government efficiency and affordability. Tracked positions are limited to fully staffing MPD with a community-policing focus and criticism of the school lottery; nothing stated yet on statehood, housing, budget, or transportation.",
    name: "Hope Solomon",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/dc-mayoral-race-goodweather-solomon-sampath-2026/" },
    positions: {
      "public-safety": {
        stance: "Fully staff MPD, focus on officer retention and pay, and make police part of the community through community policing.",
        sourceLabel: "Hill Rag — mayoral forum",
        sourceUrl: "https://www.hillrag.com/2026/05/07/mayoral-candidates-clash-over-utility-costs-public-safety-solutions/",
      },
      schools: {
        stance: "Criticizes the school lottery, saying too many kids are 'rolling the dice' because a guaranteed good public school still isn't guaranteed.",
        sourceLabel: "Campaign site — About",
        sourceUrl: "https://hopefordc.com/about",
      },
    },
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
    summary: "First-time candidate and government contractor with stated positions on all six tracked issues, including 36,000+ new housing units, a rental junk-fee ban, fee sunset reviews, and defending DC autonomy through litigation. Contested her exclusion from the Fox 5 / Georgetown debate, saying she met the 1,000-donor Fair Elections threshold.",
    name: "Rini Sampath",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/dc-mayoral-race-goodweather-solomon-sampath-2026/" },
    positions: {
      statehood: {
        stance: "Make statehood a national Democratic Party priority, push for full voting representation, and defend DC autonomy through litigation if needed.",
        sourceLabel: "Campaign site — Policy Overviews",
        sourceUrl: "https://riniformayor.com/policy-overviews",
      },
      "public-safety": {
        stance: "Stabilize MPD staffing, reduce overtime dependency, and order a full operational review of the public-safety ecosystem alongside prevention and youth programs.",
        sourceLabel: "Campaign site — Policy Overviews",
        sourceUrl: "https://riniformayor.com/policy-overviews",
      },
      housing: {
        stance: "Cut the 13-month affordable-unit vacancy lag, build over 36,000 units with affordability targets, ban rental junk fees, preserve rental assistance.",
        sourceLabel: "Campaign site — Policy Overviews",
        sourceUrl: "https://riniformayor.com/policy-overviews",
      },
      budget: {
        stance: "Defend DC's local tax decisions against congressional disapproval; eliminate duplicative fees and require sunset reviews so new fees expire unless reauthorized.",
        sourceLabel: "Campaign site — Policy Overviews",
        sourceUrl: "https://riniformayor.com/policy-overviews",
      },
      transportation: {
        stance: "Reduce traffic deaths by prioritizing dangerous corridors, enforce bus lanes and transit-signal priority as standard operations, publish performance dashboards.",
        sourceLabel: "Campaign site — Policy Overviews",
        sourceUrl: "https://riniformayor.com/policy-overviews",
      },
      schools: {
        stance: "Fix school buildings and staffing, cut chronic absenteeism now at 40% of students, expand afterschool programming and early-literacy initiatives.",
        sourceLabel: "Campaign site — Policy Overviews",
        sourceUrl: "https://riniformayor.com/policy-overviews",
      },
    },
    websiteUrl: "https://riniformayor.com/",
    notes: "First-time DC candidate; government contractor.",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC mayoral candidate Rini Sampath", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-mayoral-candidate-rini-sampath/" },
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
    summary: "Platform centers on community policing with body cameras and gun buybacks, new revenue from taxing exempt high-value properties and commuter tolls, and a phonics-first early-grades overhaul targeting 95% third-grade reading proficiency. No stated positions tracked on statehood or housing.",
    name: "Ernest Johnson",
    raceSlug: "mayor",
    party: "D",
    filingStatus: "declared",
    source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" },
    positions: {
      "public-safety": {
        stance: "Community-based policing in every ward, body cameras for all officers, gun buybacks, violence interruption; targets 25% violent-crime reduction by 2029.",
        sourceLabel: "Campaign site — Public Safety",
        sourceUrl: "https://ernestformayor2026.com/technology",
      },
      budget: {
        stance: "Grow revenue without raising taxes on working families: tax currently exempt high-value properties and toll major commuter routes into DC.",
        sourceLabel: "Campaign site — Revenue and Jobs",
        sourceUrl: "https://ernestformayor2026.com/healthcare",
      },
      transportation: {
        stance: "Install speed cameras in school and senior zones, build dedicated bike lanes with enforcement, and crack down on reckless bike and moped riding.",
        sourceLabel: "Campaign site — Public Safety",
        sourceUrl: "https://ernestformayor2026.com/technology",
      },
      schools: {
        stance: "Refocus early grades on phonics-based reading and arithmetic, end social promotion, add mandatory STEM and vocational tracks; 95% third-grade reading proficiency goal.",
        sourceLabel: "Campaign site — Education",
        sourceUrl: "https://ernestformayor2026.com/education",
      },
    },
    websiteUrl: "https://ernestformayor2026.com/",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC mayoral candidate Ernest Johnson", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-mayoral-candidate-ernest-johnson/" },
      { date: "2026-05-21", outlet: "GW Today", headline: "GW Hosts Forum for 2026 D.C. Mayoral Candidates", url: "https://gwtoday.gwu.edu/gw-hosts-forum-2026-dc-mayoral-candidates" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
    ],
  },
  { slug: "kathy-henderson", summary: "No positions on the six tracked issues have been verified from her campaign site or press coverage. Ballot-access status was disputed in May 2026 reporting — confirm against the DCBOE primary candidate list.", name: "Kathy Henderson", raceSlug: "mayor", party: "D", filingStatus: "declared", source: { label: "FOX 5 DC", url: "https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026" }, websiteUrl: "http://electkathyhendersondcmayor.com/", notes: "Ballot-access status disputed in May 2026 press; verify with DCBOE primary candidate list before relying on this entry." },

  // Council Chair (Democratic primary)
  {
    slug: "phil-mendelson",
    summary: "Incumbent Council Chair seeking re-election; endorsed by DC NOW in the primary. Drew an ethics complaint in April 2026, reported by Washington City Paper, over alleged use of his government office for campaign activity. No positions on the six tracked issues have been compiled for this race yet.",
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
  { slug: "calvin-gurley", summary: "Filed to challenge Council Chair Phil Mendelson in the Democratic primary. No positions on the six tracked issues, campaign website, or press coverage have been verified yet for this candidacy.", name: "Calvin Gurley", raceSlug: "council-chair", party: "D", filingStatus: "declared", source: { label: "Ballotpedia", url: "https://ballotpedia.org/Phil_Mendelson" } },

  // Attorney General (Democratic primary)
  {
    slug: "brian-schwalb",
    summary: "Incumbent Attorney General seeking re-election in a two-way primary against J.P. Szymkowicz; endorsed by DC NOW and profiled in WTOP's candidate Q&A. No positions on the six tracked issues have been compiled for this race yet.",
    name: "Brian Schwalb",
    raceSlug: "attorney-general",
    party: "D",
    filingStatus: "declared",
    incumbent: true,
    source: { label: "Wikipedia — 2026 DC AG", url: "https://en.wikipedia.org/wiki/2026_District_of_Columbia_Attorney_General_election" },
    governmentSiteUrl: "https://oag.dc.gov/",
    websiteUrl: "https://brianfordc.com/",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC attorney general candidate Brian Schwalb", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-attorney-general-candidate-brian-schwalb/" },
      { date: "2026-06-05", outlet: "HillRag", headline: "A Two-Way Primary Race for Attorney General", url: "https://www.hillrag.com/2026/06/05/a-two-way-primary-race-for-attorney-general/" },
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW endorses Brian Schwalb for D.C. Attorney General in the 2026 primary", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
    ],
  },
  { slug: "jp-szymkowicz", summary: "Challenging incumbent Attorney General Brian Schwalb in a two-way Democratic primary; profiled in WTOP's candidate Q&A and HillRag's race coverage. No positions on the six tracked issues have been compiled yet.", name: "J.P. Szymkowicz", raceSlug: "attorney-general", party: "D", filingStatus: "declared", source: { label: "Wikipedia — 2026 DC AG", url: "https://en.wikipedia.org/wiki/2026_District_of_Columbia_Attorney_General_election" }, websiteUrl: "https://jp4dc.com/", news: [
    { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC attorney general candidate JP Szymkowicz", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-attorney-general-candidate-jp-szymkowicz/" },
    { date: "2026-06-05", outlet: "HillRag", headline: "A Two-Way Primary Race for Attorney General", url: "https://www.hillrag.com/2026/06/05/a-two-way-primary-race-for-attorney-general/" },
  ] },

  // US House Delegate (Democratic primary)
  {
    slug: "brooke-pinto",
    summary: "Ward 2 councilmember leading the delegate field in fundraising; drew coverage for releasing a 67-page opposition dossier on rival Robert White. Platform: empower local police over federal intervention, citing her Secure DC and Peace DC bills, a $15,000 rent tax deduction, and diversifying DC's economy beyond federal jobs.",
    name: "Brooke Pinto",
    raceSlug: "us-house-delegate",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" },
    positions: {
      statehood: {
        stance: "Fight to end taxation without representation; opposes federal surge, National Guard and ICE presence as proof DC can't chart its own course.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://brookepintoforcongress.com/issues/",
      },
      "public-safety": {
        stance: "Empower local police, not federal intervention; cites Secure DC and Peace DC bills she championed and a resulting violent-crime drop.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://brookepintoforcongress.com/issues/",
      },
      housing: {
        stance: "Make rent tax-deductible up to $15,000, legalize rowhouses in more zones, streamline permitting, tax abatements for first-time and longtime DC homeowners.",
        sourceLabel: "Campaign site — Housing plan",
        sourceUrl: "https://brookepintoforcongress.com/housing/",
      },
      budget: {
        stance: "Diversify DC's economy beyond federal jobs into AI, healthcare, tech and defense manufacturing; expand opportunity zones; opposes Trump tariffs.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://brookepintoforcongress.com/issues/",
      },
      schools: {
        stance: "Robust public-education funding and teacher pay; cites literacy legislation she championed and classroom cellphone restrictions she passed.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://brookepintoforcongress.com/issues/",
      },
    },
    notes: "Ward 2 Councilmember.",
    governmentSiteUrl: "https://dccouncil.gov/council/brooke-pinto/",
    websiteUrl: "https://brookepintoforcongress.com/",
    twitterUrl: "https://x.com/brookepintodc",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC delegate candidate Brooke Pinto", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-delegate-candidate-brooke-pinto/" },
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
    summary: "At-large councilmember running with Congressional Black Caucus, labor, and statehood-coalition support; publicly demanded Pinto withdraw over her opposition dossier. Platform: statehood as the top priority, youth-program crime prevention, federal housing resources, and tax incentives to draw private-sector jobs downtown.",
    name: "Robert White",
    raceSlug: "us-house-delegate",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" },
    positions: {
      statehood: {
        stance: "Statehood is the top priority; protect Home Rule, defend local laws from federal override, and build national coalitions against interference.",
        sourceLabel: "Campaign site — homepage",
        sourceUrl: "https://www.joinrobertwhite.com/",
      },
      "public-safety": {
        stance: "Invest in youth programs that prevent crime, with meaningful consequences for serious offenses; opposes MPD cooperation with federal agents that tramples rights.",
        sourceLabel: "Campaign site — homepage",
        sourceUrl: "https://www.joinrobertwhite.com/",
      },
      housing: {
        stance: "Secure federal resources for affordable housing and support renters' rights through a 'D.C. Forward Economic Plan.'",
        sourceLabel: "Campaign site — homepage",
        sourceUrl: "https://www.joinrobertwhite.com/",
      },
      budget: {
        stance: "Supports federal tax incentives to draw private-sector jobs downtown as DC loses federal employment.",
        sourceLabel: "WTOP voter guide",
        sourceUrl: "https://wtop.com/dc-election/2026/06/dc-delegate-candidates-outline-priorities-on-statehood-economy-and-safety/",
      },
      schools: {
        stance: "Fight for federal funding that supports DC teachers, improves classrooms, and prepares children for the jobs of tomorrow.",
        sourceLabel: "Campaign site — homepage",
        sourceUrl: "https://www.joinrobertwhite.com/",
      },
    },
    notes: "At-Large Councilmember.",
    governmentSiteUrl: "https://dccouncil.gov/council/robert-c-white-jr/",
    websiteUrl: "https://www.joinrobertwhite.com/",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC delegate candidate Robert White", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-delegate-candidate-robert-white/" },
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
    summary: "Calls DC's lack of representation 'a national disgrace rooted in racism' and seeks a strategic 'grand bargain' on Capitol Hill. Platform pairs gun-violence prevention funding with affordable-housing partnerships, defense of career civil servants, and economic diversification into technology and healthcare. No stated position tracked on transportation.",
    name: "Kinney Zalesne",
    raceSlug: "us-house-delegate",
    party: "D",
    filingStatus: "declared",
    source: { label: "NOTUS", url: "https://www.notus.org/money/dc-delegate-candidates-election-2026-brooke-pinto-robert-white-kinney-zalesne" },
    positions: {
      statehood: {
        stance: "Calls DC's lack of representation a national disgrace rooted in racism; wants a strategic 'grand bargain' on Capitol Hill for full representation.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://www.kinneyfordc.com/issues-1",
      },
      "public-safety": {
        stance: "Pair effective law enforcement with prevention and community engagement; robust funding for gun-violence best practices across federal, regional and local levels.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://www.kinneyfordc.com/issues-1",
      },
      housing: {
        stance: "Expand affordable housing through public, private and nonprofit partnerships, treating housing as linked to health, education and safety outcomes.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://www.kinneyfordc.com/issues-1",
      },
      budget: {
        stance: "Opposes the 'assault on our federal agencies'; diversify DC's economy into technology, healthcare and creative sectors while backing career civil servants.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://www.kinneyfordc.com/issues-1",
      },
      schools: {
        stance: "Reduce educational inequities by cutting truancy, supporting teachers and engaging families so every student experiences education's rewards.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://www.kinneyfordc.com/issues-1",
      },
    },
    websiteUrl: "https://www.kinneyfordc.com/",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC delegate candidate Kinney Zalesne", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-delegate-candidate-kinney-zalesne/" },
      { date: "2026-05-11", outlet: "East of the River", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://eastoftheriverdcnews.com/2026/05/11/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Delegate Race: Winning Influence, Leading the Resistance or Both?", url: "https://www.hillrag.com/2026/05/08/the-delegate-race-winning-influence-leading-the-resistance-or-both/" },
      { date: "2026-05-02", outlet: "WTOP", headline: "Affordability, home rule and Trump dominate DC mayoral, delegate debates", url: "https://wtop.com/local/2026/05/affordability-home-rule-and-trump-dominate-dc-mayoral-delegate-debates/" },
    ],
  },
  {
    slug: "trent-holbrook",
    summary: "Former senior legislative counsel to Del. Norton, arguing inside-the-system experience wins the statehood fight. Platform: a local prosecutor's office accountable to DC residents, DC-appointed judges, federal-employee pay raises and shutdown backpay, and protecting DC Tuition Assistance Grants. No stated positions tracked on housing or transportation.",
    name: "Trent Holbrook",
    raceSlug: "us-house-delegate",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" },
    positions: {
      statehood: {
        stance: "Calls DC's disenfranchisement one of the worst enduring civil rights violations; statehood is the fix for federal control of local laws and police.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://trentholbrook.com/Issues",
      },
      "public-safety": {
        stance: "Create a local prosecutor's office accountable only to DC residents and let DC appoint its own judges instead of the president.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://trentholbrook.com/Issues",
      },
      budget: {
        stance: "Work for federal-employee pay raises and shutdown backpay; ensure DC receives federal funding available to states and cities.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://trentholbrook.com/Issues",
      },
      schools: {
        stance: "Preserve and increase DC Tuition Assistance Grant benefits; opposes forced school vouchers.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://trentholbrook.com/Issues",
      },
    },
    notes: "Former senior legislative counsel to Del. Norton.",
    websiteUrl: "https://trentholbrook.com/Home",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC delegate candidate Trent Holbrook", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-delegate-candidate-trent-holbrook/" },
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
    summary: "Former Nuclear Regulatory Commission chair under the Obama administration. His one tracked stated position: exempt DC residents from federal income tax until statehood. No other positions on tracked issues have been verified from his site or coverage.",
    name: "Gregory Jaczko",
    raceSlug: "us-house-delegate",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/" },
    positions: {
      statehood: {
        stance: "Proposes exempting DC residents from federal income tax until statehood, citing taxes paid without full representation.",
        sourceLabel: "51st News — delegate debate",
        sourceUrl: "https://51st.news/washington-dc-delegate-congress-debate-white-pinto/",
      },
    },
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
    summary: "Former community and policy director for retiring incumbent Anita Bonds, who endorsed him. Platform: smart enforcement focused on violent crime and repeat offenders, affordable supply through zoning, ADUs, and adaptive reuse, and early-childhood education expansion. No stated positions tracked on budget or transportation.",
    name: "Kevin B. Chavous",
    raceSlug: "council-at-large-bonds",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" },
    positions: {
      statehood: {
        stance: "Defend DC Home Rule and push back against federal interference from Congress or the White House.",
        sourceLabel: "Campaign site — Platform",
        sourceUrl: "https://www.chavousfordc.com/platform",
      },
      "public-safety": {
        stance: "Smart enforcement focused on violent crime and repeat offenders, community policing, expanded mental-health crisis response, and youth diversion programs.",
        sourceLabel: "Campaign site — Platform",
        sourceUrl: "https://www.chavousfordc.com/platform",
      },
      housing: {
        stance: "Increase affordable supply through zoning, ADUs, and adaptive reuse; expand supportive housing and rental assistance; protect tenants.",
        sourceLabel: "Campaign site — Platform",
        sourceUrl: "https://www.chavousfordc.com/platform",
      },
      schools: {
        stance: "Expand early childhood education, give schools flexibility to address low achievement, and align education spending with measurable outcomes.",
        sourceLabel: "Campaign site — Platform",
        sourceUrl: "https://www.chavousfordc.com/platform",
      },
    },
    notes: "Former community and policy director for Bonds; endorsed by Bonds.",
    websiteUrl: "https://www.chavousfordc.com/",
    news: [
      { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
      { date: "2026-06-02", outlet: "The Washington Informer", headline: "Ranked-Choice Voting in the Democratic At-Large Race: A Chance for Collaboration — Or Not", url: "https://www.washingtoninformer.com/dc-democratic-party-candidates/" },
      { date: "2026-05-29", outlet: "The DC Line", headline: "jonetta rose barras: Nine at-large DC Council Democratic primary candidates fight to win a political lottery", url: "https://thedcline.org/2026/05/29/jonetta-rose-barras-nine-at-large-dc-council-democratic-primary-candidates-fight-to-win-a-political-lottery/" },
      { date: "2026-05-29", outlet: "Washington Area Bicyclist Association", headline: "DC is voting. What are the candidates' transportation priorities?", url: "https://waba.org/2026/05/29/dc-2026-candidates/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "At-Large Race Candidates Split on Safety, Housing and DC's Future", url: "https://www.hillrag.com/2026/05/08/at-large-race-candidates-split-on-safety-housing-and-dcs-future/" },
      { date: "2026-05-01", outlet: "East of the River", headline: "Who is Running for the Democratic Nomination for At-Large Councilmember?", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" },
      { date: "2026-04-23", outlet: "Washington Blade (Opinion)", headline: "ROSENSTEIN: Chavous for Democratic D.C. Council-at-Large", url: "https://www.washingtonblade.com/2026/04/23/opinion-rosenstein-supports-kevin-chavous-dc-council/" },
    ],
  },
  {
    slug: "candace-tiana-nelson",
    summary: "Former ANC 4A commissioner. Platform pairs tenant-side housing policy — stronger rent stabilization, TOPA, and rental assistance — with bus rapid transit for wards 7–8, a standalone Council education committee, and spending oversight before new budget commitments. No stated position tracked on public safety.",
    name: "Candace Tiana Nelson",
    raceSlug: "council-at-large-bonds",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" },
    positions: {
      statehood: {
        stance: "Continue the fight for statehood; refuse to preemptively comply with federal overreach and oppose congressional rollbacks of locally passed laws.",
        sourceLabel: "Campaign site — Our Platform",
        sourceUrl: "https://candacefordc.com/ourplatform",
      },
      housing: {
        stance: "Expand rent stabilization, strengthen TOPA, and increase funding for vouchers, Emergency Rental Assistance, and permanent supportive housing.",
        sourceLabel: "Campaign site — Our Platform",
        sourceUrl: "https://candacefordc.com/ourplatform",
      },
      budget: {
        stance: "Emphasizes good oversight of how public dollars are spent, reviewing existing spending before new commitments.",
        sourceLabel: "51st voter guide",
        sourceUrl: "https://51st.news/at-large-candidates-dc-council-anita-bonds/",
      },
      transportation: {
        stance: "Bus rapid transit for wards 7-8, protected bike lanes toward Vision Zero goals, and study congestion pricing to fund transit subsidies.",
        sourceLabel: "Campaign site — Our Platform",
        sourceUrl: "https://candacefordc.com/ourplatform",
      },
      schools: {
        stance: "Reestablish a standalone education committee, partner with the teachers union on pay and retention, expand funding for high-need students.",
        sourceLabel: "Campaign site — Our Platform",
        sourceUrl: "https://candacefordc.com/ourplatform",
      },
    },
    notes: "Former ANC 4A commissioner.",
    websiteUrl: "https://www.candacefordc.com/",
    news: [
      { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
      { date: "2026-06-02", outlet: "The Washington Informer", headline: "Ranked-Choice Voting in the Democratic At-Large Race: A Chance for Collaboration — Or Not", url: "https://www.washingtoninformer.com/dc-democratic-party-candidates/" },
      { date: "2026-05-29", outlet: "The DC Line", headline: "jonetta rose barras: Nine at-large DC Council Democratic primary candidates fight to win a political lottery", url: "https://thedcline.org/2026/05/29/jonetta-rose-barras-nine-at-large-dc-council-democratic-primary-candidates-fight-to-win-a-political-lottery/" },
      { date: "2026-05-29", outlet: "Washington Area Bicyclist Association", headline: "DC is voting. What are the candidates' transportation priorities?", url: "https://waba.org/2026/05/29/dc-2026-candidates/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "At-Large Race Candidates Split on Safety, Housing and DC's Future", url: "https://www.hillrag.com/2026/05/08/at-large-race-candidates-split-on-safety-housing-and-dcs-future/" },
      { date: "2026-05-01", outlet: "East of the River", headline: "Who is Running for the Democratic Nomination for At-Large Councilmember?", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" },
    ],
  },
  {
    slug: "leniqua-jenkins",
    summary: "Former Ward 7 ANC commissioner and Bonds staffer. Stated platform focuses on three tracked issues: safety through youth programs and community-based violence prevention, homeownership expansion with down-payment assistance, and an early-literacy push targeting 50% third-grade reading proficiency.",
    name: "Leniqua'dominique Jenkins",
    raceSlug: "council-at-large-bonds",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" },
    positions: {
      "public-safety": {
        stance: "Safety through stability and investment: youth programs, mental-health care, community-based violence prevention, and stronger police-community trust.",
        sourceLabel: "Campaign site — Safety",
        sourceUrl: "https://www.votejenkinsfordc.com/safety",
      },
      housing: {
        stance: "Expand homeownership with down-payment assistance and community-based lending, invest in affordable housing, protect tenants from unfair practices.",
        sourceLabel: "Campaign site — Housing",
        sourceUrl: "https://www.votejenkinsfordc.com/housing",
      },
      schools: {
        stance: "Evidence-based literacy instruction from pre-K through grade 3, high-impact tutoring, and a 50% third-grade reading proficiency goal.",
        sourceLabel: "Campaign site — Literacy",
        sourceUrl: "https://www.votejenkinsfordc.com/literacy",
      },
    },
    notes: "Former Ward 7 ANC commissioner and Bonds staffer.",
    websiteUrl: "https://www.votejenkinsfordc.com/",
    news: [
      { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
      { date: "2026-06-02", outlet: "The Washington Informer", headline: "Ranked-Choice Voting in the Democratic At-Large Race: A Chance for Collaboration — Or Not", url: "https://www.washingtoninformer.com/dc-democratic-party-candidates/" },
      { date: "2026-05-29", outlet: "The DC Line", headline: "jonetta rose barras: Nine at-large DC Council Democratic primary candidates fight to win a political lottery", url: "https://thedcline.org/2026/05/29/jonetta-rose-barras-nine-at-large-dc-council-democratic-primary-candidates-fight-to-win-a-political-lottery/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "At-Large Race Candidates Split on Safety, Housing and DC's Future", url: "https://www.hillrag.com/2026/05/08/at-large-race-candidates-split-on-safety-housing-and-dcs-future/" },
      { date: "2026-05-01", outlet: "East of the River", headline: "Who is Running for the Democratic Nomination for At-Large Councilmember?", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" },
    ],
  },
  {
    slug: "oye-owolewa",
    summary: "Current US shadow representative backed by the Working Families Party, DC NOW, and the public-power campaign. Platform: preservation-first housing with CPI-capped rent increases, a millionaires tax and higher capital-gains taxes, fare reduction with enforcement moved out of MPD, tuition-free UDC, and removing police from DCPS schools.",
    name: "Oye Owolewa",
    raceSlug: "council-at-large-bonds",
    party: "D",
    filingStatus: "declared",
    source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" },
    positions: {
      statehood: {
        stance: "Statehood now; oppose congressional overrides, protect voter-approved initiatives, and decouple District policy from harmful federal actions.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://vote4oye.com/issues",
      },
      "public-safety": {
        stance: "Remove police from DCPS schools, fund violence interruption and civilian mental-health crisis response, increase MPD oversight and transparency.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://vote4oye.com/issues",
      },
      housing: {
        stance: "Preservation first: restore TOPA protections, fully fund Emergency Rental Assistance, and cap rent-stabilized increases at the Consumer Price Index.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://vote4oye.com/issues",
      },
      budget: {
        stance: "Raise capital-gains taxes, enact a millionaires tax above $500,000, strengthen the mansion tax, and add accountability to TIF subsidies.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://vote4oye.com/issues",
      },
      transportation: {
        stance: "Back the DMV Moves regional Metro funding plan, reduce and eliminate fares, and move traffic and fare enforcement out of MPD.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://vote4oye.com/issues",
      },
      schools: {
        stance: "Make UDC tuition-free, expand afterschool and summer programs, and increase investment in historically underfunded schools.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://vote4oye.com/issues",
      },
    },
    websiteUrl: "https://www.vote4oye.com/",
    notes: "Current US Shadow Representative.",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know DC Council at-large candidate Oye Owolewa", url: "https://wtop.com/dc-election/2026/06/get-to-know-dc-council-at-large-candidate-oye-owolewa/" },
      { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
      { date: "2026-06-02", outlet: "The Washington Informer", headline: "Ranked-Choice Voting in the Democratic At-Large Race: A Chance for Collaboration — Or Not", url: "https://www.washingtoninformer.com/dc-democratic-party-candidates/" },
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW endorses Oye Owolewa for D.C. Council At-Large in the 2026 primary", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-29", outlet: "The DC Line", headline: "jonetta rose barras: Nine at-large DC Council Democratic primary candidates fight to win a political lottery", url: "https://thedcline.org/2026/05/29/jonetta-rose-barras-nine-at-large-dc-council-democratic-primary-candidates-fight-to-win-a-political-lottery/" },
      { date: "2026-05-29", outlet: "Washington Area Bicyclist Association", headline: "DC is voting. What are the candidates' transportation priorities?", url: "https://waba.org/2026/05/29/dc-2026-candidates/" },
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
  { slug: "nate-fleming", summary: "Former shadow representative. No positions on the six tracked issues have been verified from press coverage, and no campaign website is on file.", name: "Nate Fleming", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/01/15/race-is-on-for-at-large-council-seat/" }, notes: "Former shadow representative." },
  {
    slug: "lisa-raymond",
    summary: "Former DC State Board of Education president with stated positions on all six tracked issues; GGWash's at-large endorsement called her the most reliable on housing and transit. Platform: faster permitting alongside rent-stabilization defense, focus on carjackings and illegal guns, and PreK expansion with educator pay raises.",
    name: "Lisa Raymond",
    raceSlug: "council-at-large-bonds",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/at-large-candidates-dc-council-anita-bonds/" },
    positions: {
      statehood: {
        stance: "Oppose congressional interference in DC laws, protect locally raised dollars from riders and delays, fight for full House and Senate representation.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://lisaraymondfordc.com/issues/",
      },
      "public-safety": {
        stance: "Focus on serious violent crime like carjackings and illegal guns; support a well-trained, adequately staffed police force with stronger transparency.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://lisaraymondfordc.com/issues/",
      },
      housing: {
        stance: "Streamline permitting to speed construction, defend rent stabilization and eviction protections, and invest in the Housing Production Trust Fund.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://lisaraymondfordc.com/issues/",
      },
      budget: {
        stance: "Protect DC's budget from congressional interference; reduce excessive fees and taxes burdening small, neighborhood-serving businesses.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://lisaraymondfordc.com/issues/",
      },
      transportation: {
        stance: "Multi-modal transit serving all eight wards, explore congestion pricing, support electrified transit and low-stress bike networks.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://lisaraymondfordc.com/issues/",
      },
      schools: {
        stance: "Expand PreK seats with educator pay raises, competitive teacher compensation, faster school modernization, and career-technical pathways.",
        sourceLabel: "Campaign site — Issues",
        sourceUrl: "https://lisaraymondfordc.com/issues/",
      },
    },
    websiteUrl: "https://lisaraymondfordc.com/",
    notes: "Former president of the DC State Board of Education.",
    news: [
      { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
      { date: "2026-06-02", outlet: "The Washington Informer", headline: "Ranked-Choice Voting in the Democratic At-Large Race: A Chance for Collaboration — Or Not", url: "https://www.washingtoninformer.com/dc-democratic-party-candidates/" },
      { date: "2026-05-29", outlet: "The DC Line", headline: "jonetta rose barras: Nine at-large DC Council Democratic primary candidates fight to win a political lottery", url: "https://thedcline.org/2026/05/29/jonetta-rose-barras-nine-at-large-dc-council-democratic-primary-candidates-fight-to-win-a-political-lottery/" },
      { date: "2026-05-29", outlet: "Washington Area Bicyclist Association", headline: "DC is voting. What are the candidates' transportation priorities?", url: "https://waba.org/2026/05/29/dc-2026-candidates/" },
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

  { slug: "dwight-davis", summary: "Educator and DCPS community leader who frames education as his core crime-reduction strategy. Platform: mixed-income workforce housing in all wards, anti-displacement protections for longtime residents and seniors, and career pathways with educator retention. No stated positions tracked on budget or transportation.", name: "Dwight Davis", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "East of the River", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" }, websiteUrl: "https://www.dwight4dccouncil.com/", notes: "Educator and DC Public Schools community leader.", positions: {
    statehood: {
      stance: "Defend home rule and budget autonomy, support an independent attorney general, and build national coalitions for statehood and voting representation.",
      sourceLabel: "Campaign site — Issues",
      sourceUrl: "https://dwight4dccouncil.com/issues/",
    },
    "public-safety": {
      stance: "Says crime drops with an educated populace; treats investment in education as his core crime-reduction strategy.",
      sourceLabel: "51st voter guide",
      sourceUrl: "https://51st.news/at-large-candidates-dc-council-anita-bonds/",
    },
    housing: {
      stance: "Expand mixed-income workforce housing in all wards, protect longtime residents and seniors from displacement, build near transit.",
      sourceLabel: "Campaign site — Issues",
      sourceUrl: "https://dwight4dccouncil.com/issues/",
    },
    schools: {
      stance: "High-performing schools regardless of zip code: career pathways, middle-school programming, educator retention, and school mental-health supports.",
      sourceLabel: "Campaign site — Issues",
      sourceUrl: "https://dwight4dccouncil.com/issues/",
    },
  }, news: [
    { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
    { date: "2026-06-02", outlet: "The Washington Informer", headline: "Ranked-Choice Voting in the Democratic At-Large Race: A Chance for Collaboration — Or Not", url: "https://www.washingtoninformer.com/dc-democratic-party-candidates/" },
    { date: "2026-05-29", outlet: "The DC Line", headline: "jonetta rose barras: Nine at-large DC Council Democratic primary candidates fight to win a political lottery", url: "https://thedcline.org/2026/05/29/jonetta-rose-barras-nine-at-large-dc-council-democratic-primary-candidates-fight-to-win-a-political-lottery/" },
  ] },
  { slug: "dyana-forester", summary: "Former president of the Metropolitan Washington Council, AFL-CIO, running a labor-aligned campaign: stronger TOPA and deeply affordable housing, MPD hiring with de-escalation training and oversight, community schools in all eight wards, and a budget that 'puts working families first.' No stated position tracked on transportation.", name: "Dyana N.M. Forester", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "East of the River", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" }, websiteUrl: "https://www.dyanafordc.com/", notes: "Past president of the Metropolitan Washington Council, AFL-CIO.", positions: {
    statehood: {
      stance: "Statehood advocate; pledges to defend DC autonomy, push back against federal overreach, and keep the fight for congressional representation alive.",
      sourceLabel: "Campaign site — Policy Priorities",
      sourceUrl: "https://www.dyanafordc.com/policy-priorities",
    },
    "public-safety": {
      stance: "Backs local MPD hiring, de-escalation and mental-health crisis training, sustained violence-prevention investment, and strong police oversight.",
      sourceLabel: "Campaign site — Policy Priorities",
      sourceUrl: "https://www.dyanafordc.com/policy-priorities",
    },
    housing: {
      stance: "Strengthen TOPA, expand deeply affordable housing options, and protect tenants and workers from being priced out.",
      sourceLabel: "Campaign site — Policy Priorities",
      sourceUrl: "https://www.dyanafordc.com/policy-priorities",
    },
    budget: {
      stance: "Says the budget must be balanced in a way true to DC values that puts working families first.",
      sourceLabel: "51st voter guide",
      sourceUrl: "https://51st.news/at-large-candidates-dc-council-anita-bonds/",
    },
    schools: {
      stance: "Champion the community-schools model with wraparound supports across all eight wards and needs-based DCPS funding.",
      sourceLabel: "Campaign site — Policy Priorities",
      sourceUrl: "https://www.dyanafordc.com/policy-priorities",
    },
  }, news: [
    { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
    { date: "2026-06-02", outlet: "The Washington Informer", headline: "Ranked-Choice Voting in the Democratic At-Large Race: A Chance for Collaboration — Or Not", url: "https://www.washingtoninformer.com/dc-democratic-party-candidates/" },
    { date: "2026-05-29", outlet: "The DC Line", headline: "jonetta rose barras: Nine at-large DC Council Democratic primary candidates fight to win a political lottery", url: "https://thedcline.org/2026/05/29/jonetta-rose-barras-nine-at-large-dc-council-democratic-primary-candidates-fight-to-win-a-political-lottery/" },
  ] },
  { slug: "fred-hill", summary: "Small-business owner and former chair of the DC Board of Zoning Adjustment. Stated positions cover three tracked issues: defending Home Rule, collaborative community safety with expanded mental-health services, and data-driven 'smart growth' housing without displacement. Nothing stated yet on budget, transportation, or schools.", name: "Fred Hill", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "East of the River", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" }, websiteUrl: "https://www.fredhill4dc.com/", notes: "Small-business owner and former chair of the DC Board of Zoning Adjustment.", positions: {
    statehood: {
      stance: "Defend Home Rule against attempts to erode it; DC residents should decide local matters without outside political interference.",
      sourceLabel: "Campaign site — Issues",
      sourceUrl: "http://fredhill4dc.com/issues/",
    },
    "public-safety": {
      stance: "Improve safety through collaboration among community leaders, nonprofits, mental-health professionals, and police, expanding mental-health and youth services.",
      sourceLabel: "Campaign site — Issues",
      sourceUrl: "http://fredhill4dc.com/issues/",
    },
    housing: {
      stance: "Expand affordable housing through thoughtful, data-driven smart growth grounded in community input, creating opportunity without displacement.",
      sourceLabel: "Campaign site — Issues",
      sourceUrl: "http://fredhill4dc.com/issues/",
    },
  }, news: [
    { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
    { date: "2026-06-02", outlet: "The Washington Informer", headline: "Ranked-Choice Voting in the Democratic At-Large Race: A Chance for Collaboration — Or Not", url: "https://www.washingtoninformer.com/dc-democratic-party-candidates/" },
    { date: "2026-05-29", outlet: "The DC Line", headline: "jonetta rose barras: Nine at-large DC Council Democratic primary candidates fight to win a political lottery", url: "https://thedcline.org/2026/05/29/jonetta-rose-barras-nine-at-large-dc-council-democratic-primary-candidates-fight-to-win-a-political-lottery/" },
    { date: "2026-05-29", outlet: "Washington Area Bicyclist Association", headline: "DC is voting. What are the candidates' transportation priorities?", url: "https://waba.org/2026/05/29/dc-2026-candidates/" },
  ] },
  { slug: "greg-jackson", summary: "Gun-violence-prevention advocate with DC and federal government experience. Platform leads with evidence-based prevention and root-cause investment, housing at all income levels with renter protections, and increased childcare and school funding. No stated positions tracked on budget or transportation.", name: "Greg Jackson", raceSlug: "council-at-large-bonds", party: "D", filingStatus: "declared", source: { label: "East of the River", url: "https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/" }, websiteUrl: "https://www.jacksonfordc.com/", notes: "Gun-violence-prevention advocate with DC and federal government experience.", positions: {
    statehood: {
      stance: "Use coalition building, public pressure, and legislative action to protect DC's right to govern its budget, laws, and future.",
      sourceLabel: "Campaign site — Issues",
      sourceUrl: "https://www.jacksonfordc.com/issues",
    },
    "public-safety": {
      stance: "Evidence-based prevention before violence occurs, gun-violence reduction, addressing root causes, and holding offenders accountable.",
      sourceLabel: "Campaign site — Issues",
      sourceUrl: "https://www.jacksonfordc.com/issues",
    },
    housing: {
      stance: "Build housing at all income levels, protect renters, expand homeownership pathways, and help long-term residents keep their homes.",
      sourceLabel: "Campaign site — Issues",
      sourceUrl: "https://www.jacksonfordc.com/issues",
    },
    schools: {
      stance: "Prioritize increased funding for childcare, all schools, and safe spaces so youth can thrive from cradle to career.",
      sourceLabel: "Campaign site — Issues",
      sourceUrl: "https://www.jacksonfordc.com/issues",
    },
  }, news: [
    { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
    { date: "2026-06-02", outlet: "The Washington Informer", headline: "Ranked-Choice Voting in the Democratic At-Large Race: A Chance for Collaboration — Or Not", url: "https://www.washingtoninformer.com/dc-democratic-party-candidates/" },
    { date: "2026-05-29", outlet: "The DC Line", headline: "jonetta rose barras: Nine at-large DC Council Democratic primary candidates fight to win a political lottery", url: "https://thedcline.org/2026/05/29/jonetta-rose-barras-nine-at-large-dc-council-democratic-primary-candidates-fight-to-win-a-political-lottery/" },
  ] },

  // Council At-Large (special — Independent seat vacated by McDuffie running for mayor)
  {
    slug: "doni-crawford",
    summary: "Appointed interim incumbent running in the nonpartisan special election for the at-large seat McDuffie vacated. Washington Blade's opinion section issued a dual endorsement of Patterson and Crawford; covered in WAMU's at-large voter guide and WABA's transportation questionnaire. No positions on the six tracked issues have been compiled yet.",
    name: "Doni Crawford",
    raceSlug: "council-at-large-special",
    party: "I",
    filingStatus: "declared",
    incumbent: true,
    source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" },
    notes: "Appointed interim incumbent.",
    news: [
      { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
      { date: "2026-05-29", outlet: "Washington Area Bicyclist Association", headline: "DC is voting. What are the candidates' transportation priorities?", url: "https://waba.org/2026/05/29/dc-2026-candidates/" },
      { date: "2026-05-28", outlet: "Washington Blade (Opinion)", headline: "Dual endorsement for Independent Council-at-large: Patterson or Crawford (rank one #1, the other #2)", url: "https://www.washingtonblade.com/2026/05/28/opinion-council-at-large-dc-patterson-crawford/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Race To Replace McDuffie!", url: "https://www.hillrag.com/2026/05/08/the-race-to-replace-mcduffie/" },
    ],
  },
  {
    slug: "khalil-lee",
    summary: "Running in the nonpartisan special election for the at-large seat McDuffie vacated; rated in GLAA's 2026 candidate ratings and covered in HillRag's race report. No positions on the six tracked issues have been compiled yet.",
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
    summary: "Running in the nonpartisan at-large special election; ranked first in Washington Blade's opinion dual endorsement (with Crawford second) and covered in WAMU's voter guide. No positions on the six tracked issues have been compiled yet.",
    name: "Jacque Patterson",
    raceSlug: "council-at-large-special",
    party: "I",
    filingStatus: "declared",
    source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" },
    news: [
      { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
      { date: "2026-05-28", outlet: "Washington Blade (Opinion)", headline: "Dual endorsement for Independent Council-at-large: Patterson or Crawford (rank Patterson #1, Crawford #2)", url: "https://www.washingtonblade.com/2026/05/28/opinion-council-at-large-dc-patterson-crawford/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Race To Replace McDuffie!", url: "https://www.hillrag.com/2026/05/08/the-race-to-replace-mcduffie/" },
    ],
  },
  {
    slug: "elissa-silverman",
    summary: "Previously held an at-large Independent seat and is seeking a return in the special election; endorsed by DC NOW and covered in WAMU's voter guide and WABA's transportation questionnaire. No positions on the six tracked issues have been compiled yet.",
    name: "Elissa Silverman",
    raceSlug: "council-at-large-special",
    party: "I",
    filingStatus: "declared",
    source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" },
    notes: "Previously held an At-Large Independent seat.",
    news: [
      { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
      { date: "2026-06-01", outlet: "DC NOW (Nat'l Org. for Women, DC Chapter)", headline: "DCNOW endorses Elissa Silverman for the At-Large (non-majority) special election", url: "https://www.dc-now.org/post/dcnow-endorses-d-c-council-candidates-in-2026-special-and-primary-elections" },
      { date: "2026-05-29", outlet: "Washington Area Bicyclist Association", headline: "DC is voting. What are the candidates' transportation priorities?", url: "https://waba.org/2026/05/29/dc-2026-candidates/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Race To Replace McDuffie!", url: "https://www.hillrag.com/2026/05/08/the-race-to-replace-mcduffie/" },
    ],
  },
  {
    slug: "doug-sloan",
    summary: "Running in the nonpartisan special election for the at-large seat McDuffie vacated; covered in WAMU's at-large voter guide and HillRag's race report. No positions on the six tracked issues have been compiled yet.",
    name: "Doug Sloan",
    raceSlug: "council-at-large-special",
    party: "I",
    filingStatus: "declared",
    source: { label: "Wikipedia — 2026 DC Council", url: "https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election" },
    news: [
      { date: "2026-06-03", outlet: "WAMU", headline: "D.C. Voter Guide 2026: Who is running for the D.C. Council's at-large seats?", url: "https://wamu.org/story/26/06/03/dc-voter-guide-2026-who-running-for-dc-councils-at-large-seats/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Race To Replace McDuffie!", url: "https://www.hillrag.com/2026/05/08/the-race-to-replace-mcduffie/" },
    ],
  },

  // Council Ward 1 (Democratic primary — open seat, Nadeau not running)
  {
    slug: "rashida-brown",
    summary: "ANC commissioner endorsed by outgoing councilmember Brianne Nadeau. Platform: legalize apartments citywide through the Comprehensive Plan, fare-free buses and road pricing, comprehensive tax reform via a permanent revenue commission, and community policing with mental-health crisis teams — while opposing youth-curfew expansion.",
    name: "Rashida Brown",
    raceSlug: "council-ward-1",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" },
    positions: {
      statehood: {
        stance: "Calls this the gravest Home Rule threat in DC history; would work strategically with the mayor, use federal lobbying experience, organize grassroots statehood movements.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-rashida-brown/",
      },
      "public-safety": {
        stance: "Pair community policing with evidence-based violence prevention; send mental health crisis teams to some calls; opposes expanding youth curfews.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-rashida-brown/",
      },
      housing: {
        stance: "Update the Comprehensive Plan and land-use map to legalize apartments citywide; support rental assistance, down-payment help, and tenant protections.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-rashida-brown/",
      },
      budget: {
        stance: "Says the budget is balanced on the most vulnerable; proposes comprehensive tax reform and a permanent tax and revenue commission to broaden the base.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-rashida-brown/",
      },
      transportation: {
        stance: "Prioritize pedestrians, cyclists, and transit over cars: fare-free buses, protected bike lanes, road pricing, and removing parking minimums near transit.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-rashida-brown/",
      },
      schools: {
        stance: "Redirect funding to close disparities between schools west of the park and east of the river; support educator retention and school mental health services.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-rashida-brown/",
      },
    },
    websiteUrl: "https://rashidaforward1.com/",
    notes: "Advisory Neighborhood Commissioner; endorsed by outgoing CM Brianne Nadeau.",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know Ward 1 DC Council candidate Rashida Brown", url: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-rashida-brown/" },
      { date: "2026-05-14", outlet: "Washington Blade", headline: "Capital Stonewall Democrats endorses Janeese Lewis George for D.C. mayor", url: "https://www.washingtonblade.com/2026/05/14/capital-stonewall-democrats-endorses-janeese-lewis-george-for-d-c-mayor/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-10", outlet: "51st", headline: "The state of the 2026 D.C. election (so far)", url: "https://51st.news/2026-dc-election-mayor-ward-1/" },
      { date: "2026-03-29", outlet: "Greater Greater Washington", headline: "We polled Ward 1 on the DC Council primary race", url: "https://ggwash.org/view/103003/we-polled-ward-1-on-dc-council-primary-race" },
    ],
  },
  {
    slug: "miguel-trindade-deramo",
    summary: "ANC commissioner ranked first by Capital Stonewall Democrats with a perfect GLAA score. Platform: a Housing Production Omnibus Act refocusing the trust fund on construction, a top-1% capital-gains surcharge, bus lanes on all key corridors with a connected protected-bike-lane network, and research-backed violence interruption.",
    name: "Miguel Trindade Deramo",
    raceSlug: "council-ward-1",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" },
    positions: {
      statehood: {
        stance: "Calls DC statehood a civil rights issue; would pass protective laws even if Congress may overturn them; founded an ANC Home Rule caucus.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-miguel-trindade-deramo/",
      },
      "public-safety": {
        stance: "Reestablish community-oriented policing under MPD's statutory obligations; fund violence-interruption programs backed by rigorous research.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-miguel-trindade-deramo/",
      },
      housing: {
        stance: "Proposes a Housing Production Omnibus Act refocusing the Housing Production Trust Fund on construction; expand mixed-income housing; simplify TOPA transactions for tenants.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-miguel-trindade-deramo/",
      },
      budget: {
        stance: "Backs a tiered surcharge on realized capital gains for the top 1% to fund vouchers, child tax credits, and pay equity.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-miguel-trindade-deramo/",
      },
      transportation: {
        stance: "Dedicated bus lanes on all key corridors, a complete connected protected-bike-lane network, better bus shelters; backs STEER Act suits against dangerous drivers.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-miguel-trindade-deramo/",
      },
      schools: {
        stance: "Create an education Council with stronger accountability for performance metrics, targeting Ward 1's low test scores and school facility maintenance.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-miguel-trindade-deramo/",
      },
    },
    websiteUrl: "https://miguelward1.com/",
    notes: "Advisory Neighborhood Commissioner.",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know Ward 1 DC Council candidate Miguel Trindade Deramo", url: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-miguel-trindade-deramo/" },
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
    summary: "Tenant organizer who led a March GGWash poll 42%–25% and has consolidated progressive endorsements: WFP, roughly 11 labor unions, GGWash, GLAA, and DC NOW. Platform: rent stabilization for all multifamily renters, citywide apartment legalization, ending MPD–ICE cooperation, and free child care funded by taxes on big business.",
    name: "Aparna Raj",
    raceSlug: "council-ward-1",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" },
    positions: {
      statehood: {
        stance: "Fight for DC statehood to stop federal takeovers of MPD and the budget; never preemptively comply with the Trump administration.",
        sourceLabel: "Campaign site — Platform",
        sourceUrl: "https://aparnafordc.com/platform",
      },
      "public-safety": {
        stance: "End MPD cooperation with ICE, ban masked law enforcement, raise 911 dispatcher pay, expand crisis response teams and violence-prevention programs.",
        sourceLabel: "Campaign site — Platform",
        sourceUrl: "https://aparnafordc.com/platform",
      },
      housing: {
        stance: "Expand rent stabilization to all multifamily renters, restore and fund TOPA, legalize apartments citywide, fund Housing Production Trust Fund with production targets.",
        sourceLabel: "Campaign site — Platform",
        sourceUrl: "https://aparnafordc.com/platform",
      },
      budget: {
        stance: "Fund priorities like free child care through taxes on big business and the ultrawealthy; close corporate tax loopholes.",
        sourceLabel: "Campaign site — Platform",
        sourceUrl: "https://aparnafordc.com/platform",
      },
      transportation: {
        stance: "Reduce or eliminate parking minimums, add transit-oriented density near Metro and bus stops, improve sidewalk maintenance and bike/scooter parking.",
        sourceLabel: "Campaign site — Platform",
        sourceUrl: "https://aparnafordc.com/platform",
      },
      schools: {
        stance: "Invest in counselors, social workers, and nurses in all schools; fully fund after-school programs and summer youth employment.",
        sourceLabel: "Campaign site — Platform",
        sourceUrl: "https://aparnafordc.com/platform",
      },
    },
    websiteUrl: "https://aparnafordc.com/",
    notes: "Communications manager and tenant organizer.",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know Ward 1 DC Council candidate Aparna Raj", url: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-aparna-raj/" },
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
    summary: "Platform stresses visible street-level fixes: closing open-air drug markets, foot patrols, streetlights, and a use-it-or-lose-it policy on vacant properties with 5,000 new Ward 1 homes. Supports youth curfews paired with afterschool programs and taxing professional athletes' DC earnings. Stated positions on all six tracked issues.",
    name: "Terry Lynch",
    raceSlug: "council-ward-1",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" },
    positions: {
      statehood: {
        stance: "Says the mayor and AG must lead, but councilmembers must stand and speak with residents the federal government is threatening; tearing families apart is wrong.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-terry-lynch/",
      },
      "public-safety": {
        stance: "Close open-air drug markets, shift police to foot patrols, fix streetlights; supports youth curfews alongside expanded afterschool programs.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-terry-lynch/",
      },
      housing: {
        stance: "A use-it-or-lose-it policy on vacant properties, 5,000 new Ward 1 housing units, and closing rent-control loopholes to preserve affordable housing.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-terry-lynch/",
      },
      budget: {
        stance: "Close tax loopholes, properly tax undervalued properties, tax professional athletes' DC earnings; prioritize public health, education, and safety.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-terry-lynch/",
      },
      transportation: {
        stance: "Step up enforcement against dangerous drivers of all vehicle types, impound vehicles with outstanding tickets, require identifiers on all vehicles and bikes.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-terry-lynch/",
      },
      schools: {
        stance: "Vigorous oversight of school maintenance; robust afterschool arts, academics, and athletics programs developed with parents and principals.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-terry-lynch/",
      },
    },
    websiteUrl: "https://terrylynchfordc.com/",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know Ward 1 DC Council candidate Terry Lynch", url: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-terry-lynch/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-10", outlet: "51st", headline: "The state of the 2026 D.C. election (so far)", url: "https://51st.news/2026-dc-election-mayor-ward-1/" },
    ],
  },
  {
    slug: "jackie-reyes-yanes",
    summary: "Former Bowser administration official with stated positions on all six tracked issues. Platform: a youth curfew paired with guaranteed youth employment, $30M Home Purchase Assistance and closed rent-control loopholes, 20% affordable units in larger developments, and budget discipline focused on core services and prevention.",
    name: "Jackie Reyes Yanes",
    raceSlug: "council-ward-1",
    party: "D",
    filingStatus: "declared",
    source: { label: "51st", url: "https://51st.news/ward-1-dc-council-primary-election-candidates-2026/" },
    positions: {
      statehood: {
        stance: "Says DC residents deserve full autonomy from congressional interference; Council should be assertive, organized, and unified in defending Home Rule.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-jackie-reyes-yanes/",
      },
      "public-safety": {
        stance: "Supports a youth curfew under 18, street lighting upgrades, guaranteed youth employment, and community-driven programs addressing root causes of crime.",
        sourceLabel: "Campaign site",
        sourceUrl: "https://jackieforward1.com/",
      },
      housing: {
        stance: "Raise Home Purchase Assistance to $30M with $150K income limit, close rent-control loopholes, require 20% affordable units in developments over 10 units.",
        sourceLabel: "Campaign site",
        sourceUrl: "https://jackieforward1.com/",
      },
      budget: {
        stance: "Prioritize core services, identify inefficiencies and reduce duplication, invest in prevention to avoid larger long-term costs.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-jackie-reyes-yanes/",
      },
      transportation: {
        stance: "Invest in Metrobus and Metrorail reliability, safer pedestrian and protected bike infrastructure, and improved traffic enforcement.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-jackie-reyes-yanes/",
      },
      schools: {
        stance: "Improve educator retention, invest in community schools and mental health services, strengthen oversight so resources reach classrooms equitably.",
        sourceLabel: "WTOP candidate Q&A",
        sourceUrl: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-jackie-reyes-yanes/",
      },
    },
    websiteUrl: "https://jackieforward1.com/",
    notes: "Former Bowser administration official.",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know Ward 1 DC Council candidate Jackie Reyes Yanes", url: "https://wtop.com/dc-election/2026/06/get-to-know-ward-1-dc-council-candidate-jackie-reyes-yanes/" },
      { date: "2026-05-12", outlet: "Washington Blade", headline: "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG", url: "https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/" },
      { date: "2026-05-10", outlet: "51st", headline: "The state of the 2026 D.C. election (so far)", url: "https://51st.news/2026-dc-election-mayor-ward-1/" },
    ],
  },
  { slug: "brian-footer", name: "Brian Footer", raceSlug: "council-ward-1", party: "D", filingStatus: "withdrawn", source: { label: "Washington Blade", url: "https://www.washingtonblade.com/2025/12/17/brian-footer-suspends-campaign-for-ward-1-d-c-council-seat/" }, notes: "Advisory Neighborhood Commissioner. Suspended campaign Dec 17, 2025." },

  // Council Ward 3 (Democratic primary)
  {
    slug: "matthew-frumin",
    summary: "Incumbent Ward 3 councilmember running unopposed in the Democratic primary; endorsed by DC NOW. No positions on the six tracked issues have been compiled for this race yet.",
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
    summary: "Incumbent Ward 5 councilmember seeking re-election; endorsed by DC NOW and profiled in WTOP's candidate Q&A. No positions on the six tracked issues have been compiled for this race yet.",
    name: "Zachary Parker",
    raceSlug: "council-ward-5",
    party: "D",
    filingStatus: "declared",
    incumbent: true,
    source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" },
    governmentSiteUrl: "https://dccouncil.gov/council/zachary-parker/",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know Ward 5 DC Council candidate Zachary Parker", url: "https://wtop.com/dc-election/2026/06/get-to-know-ward-5-dc-council-candidate-zachary-parker/" },
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
  { slug: "bernita-carmichael", summary: "Challenging incumbent Zachary Parker in the Ward 5 Democratic primary; profiled in WTOP's candidate Q&A. No positions on the six tracked issues have been compiled yet.", name: "Bernita Carmichael", raceSlug: "council-ward-5", party: "D", filingStatus: "declared", source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" }, news: [
    { date: "2026-06-07", outlet: "WTOP", headline: "Get to know Ward 5 DC Council candidate Bernita Carmichael", url: "https://wtop.com/dc-election/2026/06/get-to-know-ward-5-dc-council-candidate-bernita-carmichael/" },
  ] },

  // Council Ward 6 (Democratic primary)
  {
    slug: "charles-allen",
    summary: "Incumbent Ward 6 councilmember seeking re-election against two challengers; endorsed by DC NOW, profiled in WTOP's candidate Q&A, and featured in HillRag's 'study in contrasts' race coverage. No positions on the six tracked issues have been compiled for this race yet.",
    name: "Charles Allen",
    raceSlug: "council-ward-6",
    party: "D",
    filingStatus: "declared",
    incumbent: true,
    source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" },
    websiteUrl: "https://www.charlesallenward6.com/",
    governmentSiteUrl: "https://dccouncil.gov/council/charles-allen/",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know Ward 6 DC Council candidate Charles Allen", url: "https://wtop.com/dc-election/2026/06/get-to-know-ward-6-dc-council-candidate-charles-allen/" },
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
    summary: "Challenging incumbent Charles Allen in the Ward 6 Democratic primary; profiled in WTOP's candidate Q&A and HillRag's race coverage. No positions on the six tracked issues have been compiled yet.",
    name: "Gloria A. Nauden",
    raceSlug: "council-ward-6",
    party: "D",
    filingStatus: "declared",
    source: { label: "Greater Greater Washington", url: "https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements" },
    websiteUrl: "https://gloriaforward6.com/",
    news: [
      { date: "2026-06-07", outlet: "WTOP", headline: "Get to know Ward 6 DC Council candidate Gloria Ann Nauden", url: "https://wtop.com/dc-election/2026/06/get-to-know-ward-6-dc-council-candidate-gloria-ann-nauden/" },
      { date: "2026-05-08", outlet: "HillRag", headline: "The Ward 6 Council Race: A Study in Contrasts", url: "https://www.hillrag.com/2026/05/08/the-ward-6-council-race-a-study-in-contrasts/" },
    ],
  },
  { slug: "michael-murphy", summary: "Third Democratic challenger to incumbent Allen in Ward 6; profiled in WTOP's candidate Q&A and HillRag's race coverage. No positions on the six tracked issues have been compiled yet.", name: "Michael Murphy", raceSlug: "council-ward-6", party: "D", filingStatus: "declared", source: { label: "HillRag", url: "https://www.hillrag.com/2026/05/08/the-ward-6-council-race-a-study-in-contrasts/" }, notes: "Third Democratic challenger to incumbent Allen in Ward 6.", news: [{ date: "2026-06-07", outlet: "WTOP", headline: "Get to know Ward 6 DC Council candidate Michael Murphy", url: "https://wtop.com/dc-election/2026/06/get-to-know-ward-6-dc-council-candidate-michael-murphy/" }, { date: "2026-05-08", outlet: "HillRag", headline: "The Ward 6 Council Race: A Study in Contrasts", url: "https://www.hillrag.com/2026/05/08/the-ward-6-council-race-a-study-in-contrasts/" }] },

  // Shadow Senator (Democratic primary)
  { slug: "paul-strauss", summary: "Incumbent Shadow Senator seeking re-election to the statehood-advocacy seat, which carries no congressional vote, salary, or office. No positions on the six tracked issues or recent press coverage have been compiled yet.", name: "Paul Strauss", raceSlug: "shadow-senator", party: "D", filingStatus: "declared", incumbent: true, source: { label: "Ballotpedia", url: "https://ballotpedia.org/Paul_Strauss" } },

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

// Races that get a dedicated /elections/[race]/ page + per-candidate profiles.
// Now every 2026 race with at least one declared candidate on file (BL-32 v1 was
// the 4 marquee open seats; expanded 2026-06-11). The marquee 4 stay first — they
// lead the nav popout and the /elections/ grid sort. shadow-representative is
// excluded until a candidate is on file (a profiled race must have ≥1 candidate;
// see elections.test.ts). Position/news research for the newly added races is
// backlogged (BL-59) — their candidate pages render from existing data.
export const PROFILED_RACE_SLUGS = [
  "mayor",
  "council-at-large-bonds",
  "council-ward-1",
  "us-house-delegate",
  "council-chair",
  "attorney-general",
  "council-at-large-special",
  "council-ward-3",
  "council-ward-5",
  "council-ward-6",
  "shadow-senator",
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
