export type Source = { label: string; url: string };
export type Stat = { value: string; label: string; source?: Source; alarm?: boolean };
export type Stake = { headline: string; detail: string };
export type Decider = { name: string; role: string };
export type RecentMove = { date: string; headline: string; source: Source };

export type Issue = {
  slug: string;
  title: string;
  oneLiner: string;
  hero: string;
  // BL-55: 3-bullet "bite" summary rendered as an open <details> at the top of the
  // IssueDetail page. Each bullet must be a single factual claim, ≤ 25 words, drawn
  // from this issue's existing hero/stats — no new editorial content.
  quickTake?: string[];
  stats: Stat[];
  whatsAtStake: Stake[];
  whoDecides: Decider[];
  recentMoves: RecentMove[];
  voterQuestions: string[];
  liveSources: Source[];
};

// Slugs whose pages live as static routes under src/app/issues/<slug>/page.tsx
// instead of the [slug] dynamic route + IssueDetail. They appear in the homepage
// issue grid but are excluded from allIssueSlugs() so the [slug] route doesn't
// try to render them. The arrays below (whatsAtStake, whoDecides, recentMoves,
// voterQuestions, liveSources) are intentionally empty for these — the static
// page composes its own equivalents inline.
export const STATIC_ROUTE_SLUGS = new Set(["ranked-choice"]);

export const issues: Issue[] = [
  {
    slug: "ranked-choice",
    title: "Ranked-choice voting",
    oneLiner: "DC's first-ever ranked-choice primary is June 16, 2026. Rank up to five candidates per race.",
    hero: "",
    stats: [
      {
        value: "1st",
        label: "ranked-choice primary in DC history (June 16, 2026)",
        alarm: true,
        source: { label: "DCBOE — Ranked-Choice Voting", url: "https://www.dcboe.org/elections/ranked-choice-voting" },
      },
    ],
    whatsAtStake: [],
    whoDecides: [],
    recentMoves: [],
    voterQuestions: [],
    liveSources: [],
  },
  {
    slug: "statehood",
    title: "Statehood & Federal Pressure",
    oneLiner: "DC residents pay federal taxes and have no vote in Congress. In 2025–2026, that gap got wider.",
    hero: "Under the 1973 Home Rule Act, DC elects its own Mayor and Council, but Congress reviews every DC law and can nullify it with a joint disapproval resolution. In August 2025, President Trump invoked Section 740 of that Act for the first time in its history, federalizing the Metropolitan Police Department for 30 days and deploying the DC National Guard alongside out-of-state troops. In February 2026, Congress and the President overrode a DC tax law for the first time on record. Delegate Eleanor Holmes Norton, the District's non-voting representative since 1991, ended her reelection campaign in January 2026 — leaving the seat open for the first time in 35 years. DC still has zero voting members in the U.S. House or Senate.",
    quickTake: [
      "First-ever invocation of Home Rule Act §740: MPD was federalized for 30 days in August 2025.",
      "Congress overrode a DC tax law (PL 119-78) on Feb 18, 2026 — the first such override in 50+ years of Home Rule.",
      "The Delegate seat is open for the first time in 35 years after Norton ended her reelection bid.",
    ],
    stats: [
      {
        value: "1st",
        label: "invocation of Home Rule Act §740 in DC history (Aug 11, 2025)",
        source: { label: "NPR", url: "https://www.npr.org/2025/08/12/nx-s1-5498728/trump-washington-dc-police-takeover" },
        alarm: true,
      },
      {
        value: "PL 119-78",
        label: "first DC tax law overridden by Congress (Feb 18, 2026)",
        source: { label: "Congress.gov H.J.Res.142", url: "https://www.congress.gov/bill/119th-congress/house-joint-resolution/142/text" },
        alarm: true,
      },
      {
        value: "0",
        label: "voting members DC has in the U.S. House or Senate",
        source: { label: "ACLU-DC explainer", url: "https://www.acludc.org/news/dc-home-rule-what-it-how-it-works-and-why-it-matters/" },
        alarm: true,
      },
      {
        value: "30 days",
        label: "statutory limit on §740 invocation; lapsed Sep 10, 2025 when Congress did not extend",
        source: { label: "CNN", url: "https://www.cnn.com/2025/09/10/politics/dc-police-takeover-end-trump-bowser" },
      },
    ],
    whatsAtStake: [
      {
        headline: "Local laws can be overridden",
        detail: "Congress reviewed and overrode DC's tax conformity bill in February 2026 — only the fifth disapproval since Home Rule, and the first ever for a tax law.",
      },
      {
        headline: "Local police can be federalized",
        detail: "§740 was used for the first time in August 2025. The DC Circuit signaled in December 2025 that the President holds 'unique power' over the District, suggesting weak judicial guardrails on future invocations.",
      },
      {
        headline: "DC's Delegate seat is open",
        detail: "Eleanor Holmes Norton (D) ended her 2026 reelection bid on Jan 26, 2026 after 18 terms. The non-voting House Delegate is DC's loudest microphone for statehood and Home Rule defense.",
      },
    ],
    whoDecides: [
      { name: "U.S. Congress", role: "Reviews every DC law (30 legislative days for civil, 60 for criminal). Sets the District's federal payment and approves its budget." },
      { name: "President of the United States", role: "Signs or vetoes disapproval resolutions; can invoke §740 to federalize MPD; issues executive orders affecting federal land and law enforcement in DC." },
      { name: "DC Council & Mayor", role: "Pass laws and the local budget — subject to congressional review and, since Feb 2026, override." },
      { name: "DC Attorney General Brian Schwalb (D)", role: "Sues the federal government on the District's behalf; filed and joined challenges to the 2025 Guard deployment and federal funding freezes." },
    ],
    recentMoves: [
      {
        date: "2026-01-27",
        headline: "House committee reports H.R. 5183, DC Home Rule Improvement Act of 2025",
        source: { label: "Congress.gov", url: "https://www.congress.gov/bill/119th-congress/house-bill/5183" },
      },
      {
        date: "2026-02-18",
        headline: "Trump signs PL 119-78 — first congressional override of a DC tax law",
        source: { label: "Congress.gov", url: "https://www.congress.gov/bill/119th-congress/house-joint-resolution/142/text" },
      },
      {
        date: "2026-02-12",
        headline: "Senate votes 49–47 to overturn DC tax decoupling (~$650M / 5 yrs)",
        source: { label: "DC Council", url: "https://dccouncil.gov/council-separates-elements-of-district-tax-code-from-the-federal-to-fund-family-tax-savings-and-youth-tax-credit-reinstates-temporary-juvenile-curfew/" },
      },
      {
        date: "2026-01-26",
        headline: "Del. Eleanor Holmes Norton ends 2026 reelection bid after 18 terms",
        source: { label: "NPR", url: "https://www.npr.org/2026/01/26/g-s1-107327/eleanor-holmes-norton-ending-reelection-campaign" },
      },
      {
        date: "2025-12-17",
        headline: "DC Circuit lets Trump's National Guard deployment in DC continue",
        source: { label: "NPR", url: "https://www.npr.org/2025/12/17/nx-s1-5647680/federal-court-says-troops-can-stay-in-d-c-and-hints-at-prolonged-deployment" },
      },
      {
        date: "2025-11-20",
        headline: "U.S. District Court rules DC Guard deployment illegal (later stayed)",
        source: { label: "DC AG Schwalb", url: "https://oag.dc.gov/release/attorney-general-schwalb-issues-statement-court" },
      },
      {
        date: "2025-09-10",
        headline: "MPD federalization lapses at the 30-day statutory limit",
        source: { label: "CNN", url: "https://www.cnn.com/2025/09/10/politics/dc-police-takeover-end-trump-bowser" },
      },
      {
        date: "2025-08-11",
        headline: "Trump invokes Home Rule §740 for the first time in history; federalizes MPD",
        source: { label: "Washington Post", url: "https://www.washingtonpost.com/politics/2025/08/11/trump-national-guard-dc-crime-crackdown/" },
      },
      {
        date: "2025-06-10",
        headline: "House votes 266–148 to repeal DC noncitizen voting law (Senate did not act)",
        source: { label: "Roll Call", url: "https://rollcall.com/2025/06/10/house-passes-pair-of-bills-in-rebuke-to-dc/" },
      },
      {
        date: "2025-03-27",
        headline: "EO 14252 establishes federal 'DC Safe and Beautiful Task Force'",
        source: { label: "EO 14252 (UCSB)", url: "https://www.presidency.ucsb.edu/documents/executive-order-14252-making-the-district-columbia-safe-and-beautiful" },
      },
    ],
    voterQuestions: [
      "How would you respond if Congress overrides another DC law in 2026 or 2027?",
      "Do you support DC v. federal litigation, and on what grounds — taxation, autonomy, civil rights?",
      "What is your statehood strategy beyond reintroducing HR 51?",
    ],
    liveSources: [
      { label: "Home Rule Act overview (CRS)", url: "https://www.congress.gov/crs-product/R47927" },
      { label: "ACLU-DC: Home Rule explained", url: "https://www.acludc.org/news/dc-home-rule-what-it-how-it-works-and-why-it-matters/" },
      { label: "DC Office of the Attorney General", url: "https://oag.dc.gov/" },
      { label: "New Columbia Statehood Commission", url: "https://statehood.dc.gov/page/new-columbia-statehood-commission" },
      { label: "Eleanor Holmes Norton — official site", url: "https://norton.house.gov/" },
    ],
  },

  {
    slug: "public-safety",
    title: "Public Safety & Justice",
    oneLiner: "Crime is at multi-year lows. The political fight over it isn't.",
    hero: "DC homicides fell 52% in the first four months of 2026 versus the same window in 2025, and overall violent crime fell 29% in 2025 — the steepest single-year decline on record. Yet the Metropolitan Police Department's sworn strength stands at 3,033 officers (Jan 2026), the lowest count in 50 years. DC is the only U.S. jurisdiction whose local crimes are prosecuted by a federally-appointed U.S. Attorney rather than a locally-elected District Attorney; that office has been led by Trump appointee Jeanine Pirro since August 2025. The Council made the Secure DC Act of 2024's pretrial detention expansion permanent in mid-2025 (the 'Peace DC' bill). Juvenile crime, especially carjacking, remains the most politically charged subset of the data.",
    quickTake: [
      "Homicides fell 52% YTD 2026; violent crime fell 29% in 2025 — the steepest single-year decline on record.",
      "MPD sworn strength is 3,033 officers (Jan 2026), the lowest count in 50 years.",
      "DC has no locally-elected DA; Trump appointee Jeanine Pirro has run the U.S. Attorney's office since Aug 2025.",
    ],
    stats: [
      {
        value: "−52%",
        label: "homicides YTD 2026 (mid-April) vs. same period 2025",
        source: { label: "MPD daily crime report (via Townhall)", url: "https://townhall.com/tipsheet/scott-mcclallen/2026/04/18/dc-homicides-plunge-52-percent-as-national-guard-deployment-transforms-citys-crime-landscape-n2674698" },
      },
      {
        value: "3,033",
        label: "MPD sworn officers (Jan 2026) — 50-year low",
        source: { label: "ACLU-DC FY26 MPD Budget brief", url: "https://www.acludc.org/app/uploads/2025/07/ACLU-DC_FY26_MPDBudget.pdf" },
        alarm: true,
      },
      {
        value: "−29%",
        label: "violent crime in DC, 2025 vs. 2024",
        source: { label: "MPD daily crime", url: "https://mpdc.dc.gov/dailycrime" },
      },
      {
        value: "53%",
        label: "of August 2025 carjacking arrestees were juveniles",
        source: { label: "WJLA", url: "https://wjla.com/news/local/washington-dc-youth-rehabilitation-act-crime-rate-carjacking-teen-arrests-youth-crime-juvenile-crime-juvenile-justice-yra" },
        alarm: true,
      },
    ],
    whatsAtStake: [
      {
        headline: "Pretrial detention is permanent",
        detail: "The Secure DC Act of 2024 expanded rebuttable-presumption pretrial detention for violent crimes with a sunset clause. The Peace DC bill (passed July 2025) made the change permanent — no remaining sunset.",
      },
      {
        headline: "Federal prosecutors set the agenda",
        detail: "DC has no locally-elected District Attorney. The U.S. Attorney for DC, Jeanine Pirro since August 2025, prosecutes nearly every local felony and misdemeanor. The office's 2026 federal trial win rate is roughly 50%.",
      },
      {
        headline: "Youth detention conditions worsened",
        detail: "Reported youth injuries at the Department of Youth Rehabilitation Services rose roughly 5x between January 2022 (6) and January 2025 (30). The committed-youth population grew 30% from FY24 to FY25.",
      },
    ],
    whoDecides: [
      { name: "MPD Interim Chief Jeffery Carroll", role: "Day-to-day command of the Metropolitan Police Department. Chief Pamela Smith resigned in December 2025 amid allegations of crime-statistics falsification; Carroll, a 24-year MPD veteran, was appointed interim chief by Mayor Bowser on Jan 6, 2026." },
      { name: "U.S. Attorney for DC, Jeanine Pirro", role: "Prosecutes local crime in DC. Trump appointee, confirmed by the Senate Aug 2, 2025." },
      { name: "DC Council Judiciary Committee", role: "Authors the criminal code and oversees MPD, DOC, and DYRS budgets. Chair: Brooke Pinto (D, Ward 2)." },
      { name: "DC Superior Court judges", role: "Hand down sentences and rule on suppression motions. Federal judges in DC have repeatedly suppressed evidence in 2026 USAO gun cases." },
    ],
    recentMoves: [
      {
        date: "2026-01-06",
        headline: "Mayor Bowser names Jeffery Carroll, 24-year MPD veteran, interim chief",
        source: { label: "Mayor's office", url: "https://mayor.dc.gov/release/mayor-bowser-announces-jeffery-carroll-interim-chief-police" },
      },
      {
        date: "2026-04-18",
        headline: "DC homicides −52% YTD, carjackings −44% vs. same period in 2025",
        source: { label: "Townhall (citing MPD)", url: "https://townhall.com/tipsheet/scott-mcclallen/2026/04/18/dc-homicides-plunge-52-percent-as-national-guard-deployment-transforms-citys-crime-landscape-n2674698" },
      },
      {
        date: "2026-01-15",
        headline: "MPD sworn strength reported at 3,033 — 50-year low",
        source: { label: "ACLU-DC", url: "https://www.acludc.org/app/uploads/2025/07/ACLU-DC_FY26_MPDBudget.pdf" },
      },
      {
        date: "2025-12-15",
        headline: "Chief Pamela Smith resigns amid crime-stats falsification allegations",
        source: { label: "WUSA9", url: "https://www.wusa9.com/article/news/police/top-dc-police-officials-replaced-staffing-shakeup-metropolitan-police-department/65-cf01128c-47b5-472e-ba03-48ef99374059" },
      },
      {
        date: "2025-08-11",
        headline: "Trump federalizes MPD via Home Rule §740 (lapses Sep 10 at 30-day limit)",
        source: { label: "CNN", url: "https://www.cnn.com/politics/live-news/trump-presidency-dc-crime-08-11-25" },
      },
      {
        date: "2025-08-02",
        headline: "Senate confirms Jeanine Pirro as U.S. Attorney for DC",
        source: { label: "Washington Post", url: "https://www.washingtonpost.com/politics/2025/08/02/jeanine-pirro-dc-attorney-senate-vote-trump/" },
      },
      {
        date: "2025-07-15",
        headline: "Council passes Peace DC, making Secure DC pretrial detention permanent",
        source: { label: "CM Brooke Pinto release", url: "https://www.brookepintodc.com/newsroom/dc-council-passes-my-peace-dc-plan" },
      },
      {
        date: "2024-03-05",
        headline: "Council passes Secure DC Act 12–0 (Trayon White voted Present)",
        source: { label: "The Eagle", url: "https://www.theeagleonline.com/article/2024/03/dc-council-votes-to-pass-secure-dc-crime-bill" },
      },
    ],
    voterQuestions: [
      "Do you support adding a locally-elected District Attorney for DC?",
      "What's your concrete plan to bring MPD sworn strength back above 3,500?",
      "Should the Youth Rehabilitation Act age cap stay at 24, or be lowered?",
    ],
    liveSources: [
      { label: "MPD daily crime", url: "https://mpdc.dc.gov/dailycrime" },
      { label: "MPD staffing reports FY2026", url: "https://mpdc.dc.gov/page/mpd-staffing-reports-fy2026" },
      { label: "U.S. Attorney's Office for DC", url: "https://www.justice.gov/usao-dc" },
      { label: "DC Council Judiciary Committee", url: "https://dccouncil.gov/committees/committee-on-the-judiciary-and-public-safety/" },
      { label: "DYRS — Youth Services Center", url: "https://dyrs.dc.gov/page/youth-services-center" },
    ],
  },

  {
    slug: "housing",
    title: "Housing & Evictions",
    oneLiner: "Median rent is $2,500. FY25 evictions hit a 7-year high. The eviction-notice window just shrank from 30 days to 10.",
    hero: "DC's median rent in April 2026 was $2,500 — about 28% above the national average. FY25 saw 1,933 completed evictions, the highest since 2018. The RENTAL Act, signed by Mayor Bowser on Nov 13, 2025 and effective Jan 1, 2026, cut tenant eviction-notice from 30 to 10 days, exempted new multifamily buildings from TOPA for 15 years, and capped relocation assistance. Downtown office-to-residential conversions have produced 1,904 units since 2024 with 1,803 more under construction — but only roughly 10% of units in the launched projects are affordable. The Housing Choice Voucher waitlist remains closed; DCHA continues operating under a HUD-mandated three-year recovery plan.",
    quickTake: [
      "Median rent in April 2026 was $2,500 — about 28% above the national average.",
      "The RENTAL Act cut tenant eviction-notice from 30 days to 10, effective Jan 1, 2026.",
      "FY25 saw 1,933 completed evictions — a 7-year high.",
    ],
    stats: [
      {
        value: "$2,500",
        label: "median rent in DC, April 2026 (~28% above national average)",
        source: { label: "Rent.com DC trends", url: "https://www.rent.com/district-of-columbia/washington-apartments/rent-trends" },
      },
      {
        value: "1,933",
        label: "FY25 completed evictions — 7-year high",
        source: { label: "New America", url: "https://www.newamerica.org/insights/an-update-on-dc-evictions-june-2025-through-february-2026/" },
        alarm: true,
      },
      {
        value: "30 → 10",
        label: "days of eviction notice required, after Jan 1, 2026 (RENTAL Act)",
        source: { label: "Ballard Spahr summary", url: "https://www.ballardspahr.com/insights/alerts-and-articles/2026/01/new-topa-law-and-other-important-legal-developments" },
        alarm: true,
      },
      {
        value: "176 / 1,745",
        label: "affordable units in launched downtown HID conversions (~10%)",
        source: { label: "DCFPI critique", url: "https://www.dcfpi.org/all/downtown-tax-abatement-tailor-made-for-developers-at-the-expense-of-dc-residents/" },
      },
    ],
    whatsAtStake: [
      {
        headline: "Eviction notice slashed",
        detail: "RENTAL Act dropped tenant notice from 30 to 10 days. Combined with the FY25 eviction count, this is the steepest tilt toward landlords since the pandemic-era moratorium ended.",
      },
      {
        headline: "Downtown subsidies, but mostly market-rate",
        detail: "The Housing in Downtown program offers a 20-year tax abatement (capped at $2.5M/yr per project, 2024–26). Of 1,745 launched units, 1,569 are market-rate and only 176 are affordable.",
      },
      {
        headline: "DCHA still under federal recovery plan",
        detail: "After HUD's 2022 assessment, the DC Housing Authority is operating under a Three-Year Recovery Plan. HUD found ADA violations in March 2025 and ordered file-review verification by March 2, 2026.",
      },
    ],
    whoDecides: [
      { name: "DC Council Housing Committee", role: "Authors RENTAL Act, IZ rules, TOPA reforms, and the FY budget for DCHD/DCHA. Chair: Robert White (D, At-Large)." },
      { name: "Department of Housing and Community Development (DHCD)", role: "Runs Inclusionary Zoning, the Home Purchase Assistance Program (HPAP), and Housing Production Trust Fund grants." },
      { name: "DC Housing Authority (DCHA)", role: "Administers federal Housing Choice Vouchers, public housing, and the Local Rent Supplement Program. Currently under HUD-supervised recovery." },
      { name: "DC Zoning Commission", role: "Approves Comp Plan map amendments and IZ-relevant zoning text changes. The 'DC 2050' rewrite is in progress." },
    ],
    recentMoves: [
      {
        date: "2026-02-28",
        headline: "FY26 eviction filings tracking near 7-year high through February",
        source: { label: "New America", url: "https://www.newamerica.org/insights/an-update-on-dc-evictions-june-2025-through-february-2026/" },
      },
      {
        date: "2026-01-01",
        headline: "RENTAL Act takes effect: eviction notice cut from 30 to 10 days",
        source: { label: "Ballard Spahr", url: "https://www.ballardspahr.com/insights/alerts-and-articles/2026/01/new-topa-law-and-other-important-legal-developments" },
      },
      {
        date: "2025-12-15",
        headline: "HUD orders DCHA to verify federal-housing file reviews by Mar 2, 2026",
        source: { label: "DCHA compliance page", url: "https://www.dchousing.org/wordpress/compliance-requirements-for-hud-assisted-properties-acc-public-housing/" },
      },
      {
        date: "2025-11-13",
        headline: "Mayor Bowser signs RENTAL Act after Council passage in September",
        source: { label: "Arnold & Porter", url: "https://www.arnoldporter.com/en/perspectives/advisories/2025/09/dc-council-passes-significant-topa-changes" },
      },
      {
        date: "2025-05-12",
        headline: "2025 Point-in-Time count: DC homelessness down 9% to 5,138; family homelessness −18.1%",
        source: { label: "DHS", url: "https://dhs.dc.gov/release/2025-point-time-results-show-decrease-homelessness-highlighting-continued-success-key" },
      },
      {
        date: "2025-03-06",
        headline: "HUD letter finds ADA violations at DCHA",
        source: { label: "Washington Post", url: "https://www.washingtonpost.com/dc-md-va/2025/03/06/disability-act-dc-housing-authority/" },
      },
      {
        date: "2025-03-13",
        headline: "OTR reports TY2026 commercial property values fall sharply (~$464M projected loss)",
        source: { label: "OTR / MyTaxDC", url: "https://mytaxdc.wordpress.com/2025/03/13/office-of-tax-and-revenue-reports-significant-decline-in-district-of-columbia-commercial-real-estate-value-in-tax-year-2026-assessment/" },
      },
    ],
    voterQuestions: [
      "Would you sign or veto a bill restoring the 30-day eviction notice?",
      "What share of HID-program units should be affordable, and how would you enforce it?",
      "When will the Housing Choice Voucher waitlist reopen, and at what funded size?",
    ],
    liveSources: [
      { label: "DHCD — Inclusionary Zoning", url: "https://dhcd.dc.gov/service/inclusionary-zoning-iz-affordable-housing-program" },
      { label: "DHCD — HPAP", url: "https://dhcd.dc.gov/page/hpap-eligibility-how-apply-and-program-details" },
      { label: "DCHA Three-Year Recovery Plan", url: "https://www.dchousing.org/wordpress/about-us/three-year-recovery-plan/" },
      { label: "DMPED — Housing in Downtown", url: "https://dmped.dc.gov/page/housing-downtown-hid-program" },
      { label: "DC Office of Planning — Comprehensive Plan", url: "https://planning.dc.gov/comprehensiveplan" },
    ],
  },

  {
    slug: "budget",
    title: "Budget, Taxes & Federal Workforce",
    oneLiner: "DC lost ~22,000 federal jobs in 2025. Out-year revenue is now projected $342M/yr lower.",
    hero: "Federal civilians make up roughly a quarter of DC's nonfarm employment — more than ten times the national average. In 2025, DC lost about 22,000 federal jobs, and the broader DMV region lost roughly 54,000. The OCFO's February 2026 revenue estimate revised FY26 local revenue up $75M but cut the FY25–FY29 out-year forecast by an average of $342M per year. Downtown office vacancy stood at 19.7% at the end of 2025; commercial property values are projected to fall $10.2B (15.4%) since 2020, costing roughly $464M in property-tax revenue over three years. The FY26 DC budget totals $21.8B. Congress overrode DC's tax-conformity bill in February 2026 — the first such override in 50+ years of Home Rule.",
    quickTake: [
      "DC lost about 22,000 federal jobs in 2025.",
      "OCFO cut its FY25–29 out-year revenue forecast by $342M/year on average (Feb 2026).",
      "Congress overrode a DC tax law (PL 119-78) on Feb 18, 2026 — the first such override on record.",
    ],
    stats: [
      {
        value: "−22,000",
        label: "federal jobs lost in DC in 2025 (OPM-derived)",
        source: { label: "WTOP / OPM", url: "https://wtop.com/dc/2026/03/how-did-doge-cuts-impact-dcs-economy-new-opm-data-offers-insight/" },
        alarm: true,
      },
      {
        value: "−$342M/yr",
        label: "OCFO out-year revenue revision (FY25–29 average), Feb 2026",
        source: { label: "OCFO", url: "https://cfo.dc.gov/release/ocfo-releases-february-2026-revenue-estimates" },
        alarm: true,
      },
      {
        value: "19.7%",
        label: "downtown office vacancy rate (end-2025)",
        source: { label: "Commercial Search", url: "https://www.commercialsearch.com/news/washington-dc-office-market-update/" },
      },
      {
        value: "$21.8B",
        label: "FY26 DC budget (Bowser's 'Grow DC' plan, first reading June 2025)",
        source: { label: "DC Council Budget Office", url: "https://www.dccouncilbudget.com/fy-2026-budget" },
      },
    ],
    whatsAtStake: [
      {
        headline: "Tax base shrinking from above and below",
        detail: "Federal RIFs are removing high-income earners; office vacancy is destroying commercial property assessments. Both feed the long-feared 'doom loop' even as headline FY26 income-tax withholding has held up.",
      },
      {
        headline: "Congress can now strike tax laws",
        detail: "PL 119-78, signed Feb 18, 2026, was the first congressional disapproval of a DC tax law on record. Future DC tax legislation faces a precedent that didn't exist before.",
      },
      {
        headline: "Reserves are larger than they look",
        detail: "DC's four reserve funds (Contingency, Emergency, Cash Flow, Fiscal Stabilization) ended FY24 with $1.572B in fund balance. That's a real cushion — but it cannot absorb a multi-year $300M+ structural revenue cut.",
      },
    ],
    whoDecides: [
      { name: "DC Chief Financial Officer (Glen Lee)", role: "Independent of Mayor and Council. Issues quarterly revenue estimates and certifies the budget." },
      { name: "DC Council Committee of the Whole", role: "Final budget authority before it goes to Congress. Chair: Phil Mendelson (D)." },
      { name: "U.S. House and Senate Appropriations Committees", role: "Approve DC's local budget as part of federal appropriations; can attach riders that block specific DC spending (e.g., the Harris cannabis rider)." },
      { name: "Office of the President / OPM", role: "Drives federal RIFs, return-to-office rules, and contracting policy that determine roughly a quarter of DC's labor market." },
    ],
    recentMoves: [
      {
        date: "2026-02-27",
        headline: "OCFO February 2026 revenue estimate: FY26 +$75M, out-years −$342M/yr",
        source: { label: "OCFO", url: "https://cfo.dc.gov/release/ocfo-releases-february-2026-revenue-estimates" },
      },
      {
        date: "2026-02-18",
        headline: "Trump signs PL 119-78 — first DC tax law overridden by Congress",
        source: { label: "Congress.gov", url: "https://www.congress.gov/bill/119th-congress/house-joint-resolution/142/text" },
      },
      {
        date: "2026-01-15",
        headline: "Census revises DC's 2024 population down 11k; 2025 growth slows to 0.3%",
        source: { label: "DC Policy Center", url: "https://www.dcpolicycenter.org/publications/chart-of-the-week-dc-population-growth-slowed-key-trends-concerning/" },
      },
      {
        date: "2025-09-17",
        headline: "Council gives final 11–2 approval to $3.8B Commanders / RFK stadium deal",
        source: { label: "Commanders / DC Council", url: "https://www.commanders.com/news/d-c-council-gives-final-approval-for-rfk-stadium-project" },
      },
      {
        date: "2025-07-15",
        headline: "Council passes $21.8B FY26 'Grow DC' budget on first reading",
        source: { label: "DC Council Budget Office", url: "https://www.dccouncilbudget.com/fy-2026-budget" },
      },
      {
        date: "2025-03-13",
        headline: "OTR: TY2026 commercial property values fall sharply; ~$464M projected revenue loss over 3 years",
        source: { label: "MyTaxDC", url: "https://mytaxdc.wordpress.com/2025/03/13/office-of-tax-and-revenue-reports-significant-decline-in-district-of-columbia-commercial-real-estate-value-in-tax-year-2026-assessment/" },
      },
    ],
    voterQuestions: [
      "How would you close a $342M/yr structural revenue gap without raising local taxes?",
      "What is the right level for DC's rainy-day reserves given federal-workforce exposure?",
      "Should DC challenge congressional disapproval of its tax laws in federal court?",
    ],
    liveSources: [
      { label: "DC Office of the Chief Financial Officer", url: "https://cfo.dc.gov/" },
      { label: "OCFO Quarterly Revenue Estimates", url: "https://cfo.dc.gov/page/revenue-estimates" },
      { label: "DC Council Budget Office", url: "https://www.dccouncilbudget.com/" },
      { label: "OTR — DC tax rates", url: "https://otr.cfo.dc.gov/page/dc-tax-rates" },
      { label: "BLS — DC employment", url: "https://www.bls.gov/eag/eag.dc_washington_md.htm" },
    ],
  },

  {
    slug: "transportation",
    title: "Transportation",
    oneLiner: "Traffic deaths fell more than half in 2025. Now USDOT wants to ban the cameras.",
    hero: "DC traffic fatalities dropped from 52 in 2024 (a 16-year high) to 25 in 2025 — the largest single-year decline on record, and a partial vindication of the long-missed Vision Zero goal. The District's automated traffic enforcement program collected $267.3M in FY25, up from $139.5M in FY23, with 547 cameras citywide. In January 2026, the U.S. Department of Transportation formally proposed banning DC's automated cameras in the upcoming surface transportation bill; Mayor Bowser called the loss a $1B hole over four years. WMATA balanced its FY26 budget without service cuts or fare hikes, but only by drawing down reserves. The structural funding gap is intact, with a regional dedicated-funding solution (DMVMoves) targeted for 2028 at the earliest.",
    quickTake: [
      "DC traffic fatalities dropped from 52 in 2024 to 25 in 2025 — the largest single-year decline on record.",
      "USDOT formally proposed banning DC's automated traffic cameras in Jan 2026 — Bowser estimates $1B over 4 years at risk.",
      "WMATA balanced its FY26 budget without service cuts, but only by drawing reserves; the structural gap is intact.",
    ],
    stats: [
      {
        value: "25",
        label: "DC traffic deaths in 2025 (down from 52 in 2024)",
        source: { label: "DC News Now", url: "https://www.dcnewsnow.com/news/local-news/washington-dc/traffic-fatalities-in-dc-drop-more-than-50-in-2025-attorney-general-says/" },
      },
      {
        value: "$1B",
        label: "Bowser's estimate of revenue at risk over 4 years if USDOT bans DC's automated cameras",
        source: { label: "WUSA9", url: "https://www.wusa9.com/article/news/local/dc/automated-traffic-camera-enforcement-program-trump-dc-revenue-charles-allen/65-80524e9e-40e3-4bf1-9855-862d6c3cbcbc" },
        alarm: true,
      },
      {
        value: "$267.3M",
        label: "DC automated enforcement revenue, FY25",
        source: { label: "DC Policy Center", url: "https://www.dcpolicycenter.org/publications/speed-cameras-in-d-c/" },
      },
      {
        value: "~22%",
        label: "share of WMATA's $5B FY26 budget covered by fares",
        source: { label: "WMATA FY26 budget", url: "https://www.wmata.com/initiatives/budget/index.cfm" },
      },
    ],
    whatsAtStake: [
      {
        headline: "WMATA balanced — by drawing reserves",
        detail: "FY26 closed without service cuts or fare hikes, but federal pandemic relief is gone and reserves are finite. The dedicated-funding solution depends on DC, Maryland, and Virginia all agreeing — earliest 2028.",
      },
      {
        headline: "Cameras vs. revenue vs. safety",
        detail: "Top 10 cameras alone produced $65M in 2025. USDOT's January 2026 proposal would zero out the program. Vision Zero advocates argue the deterrent matters; opponents call it a regressive tax.",
      },
      {
        headline: "Bus and bike lanes are reversible",
        detail: "Connecticut Avenue's protected bike lane was canceled by DDOT in April 2024, then restored by the Council in the FY25 budget. The Arizona Avenue NW lane was removed in mid-2025 after pushback.",
      },
    ],
    whoDecides: [
      { name: "DDOT Director Sharon Kershbaum", role: "Builds bus lanes, bike lanes, ATE deployments, Vision Zero programs. Confirmed by Council September 2024." },
      { name: "WMATA Board", role: "Approves the budget, fare and service changes. Three jurisdictions appoint members; DC has 2 voting and 2 alternate seats." },
      { name: "DC Council Transportation Committee", role: "Authors traffic-safety legislation including the STEER Act; sets ATE rules. Chair: Charles Allen (D, Ward 6)." },
      { name: "U.S. Department of Transportation", role: "Holds federal authority over interstate highways, NPS roads inside DC, and (per the January 2026 proposal) potentially over DC's automated camera program." },
    ],
    recentMoves: [
      {
        date: "2026-03-19",
        headline: "House committee advances Stop DC CAMERA Act 21–19 to ban DC traffic cameras",
        source: { label: "Congress.gov H.R. 5525", url: "https://www.congress.gov/bill/119th-congress/house-bill/5525/text" },
      },
      {
        date: "2026-01-15",
        headline: "USDOT formally proposes banning DC's automated traffic cameras",
        source: { label: "Planetizen", url: "https://www.planetizen.com/news/2026/01/136708-usdot-formally-moves-ban-dc-traffic-cameras" },
      },
      {
        date: "2026-01-05",
        headline: "DC traffic deaths fall to 25 in 2025, >50% drop YoY",
        source: { label: "DC News Now", url: "https://www.dcnewsnow.com/news/local-news/washington-dc/traffic-fatalities-in-dc-drop-more-than-50-in-2025-attorney-general-says/" },
      },
      {
        date: "2025-08-01",
        headline: "DDOT moves Visitor Parking Permit program fully digital",
        source: { label: "DDOT", url: "https://ddot.dc.gov/publication/proposed-changes-rpp-regulations" },
      },
      {
        date: "2025-06-12",
        headline: "Arizona Avenue NW bike lane removed after community pushback",
        source: { label: "Washington Post", url: "https://www-staging.washingtonpost.com/dc-md-va/2025/06/12/arizona-bike-lane-dc/" },
      },
      {
        date: "2025-01-01",
        headline: "DC Circulator bus service phased out",
        source: { label: "DDOT", url: "https://ddot.dc.gov/" },
      },
    ],
    voterQuestions: [
      "If USDOT bans DC speed cameras, how do you backfill the revenue and the safety deterrent?",
      "Do you support a regional payroll or sales tax to dedicate funding to WMATA?",
      "When DDOT pulls a bike or bus lane after community pushback, what's the standard for reversal?",
    ],
    liveSources: [
      { label: "DDOT", url: "https://ddot.dc.gov/" },
      { label: "WMATA", url: "https://www.wmata.com/" },
      { label: "Vision Zero DC", url: "https://www.visionzero.dc.gov/" },
      { label: "DC Policy Center — speed cameras", url: "https://www.dcpolicycenter.org/publications/speed-cameras-in-d-c/" },
    ],
  },

  {
    slug: "schools",
    title: "Schools",
    oneLiner: "Test scores hit a record one-year gain. The Ward 3 to Ward 8 gap is still 55 points.",
    hero: "DC's 2025 statewide assessment posted the largest one-year gains on record: 57.9% of students at or approaching grade level in ELA and 47.5% in math. But the ward-level gap remains stark — in 2024, math proficiency was 60% in Ward 3 and 5% in Ward 8. Public school enrollment was essentially flat in SY2025-26, with the long-running roughly 52/48 split between DC Public Schools and the public charter sector. In July 2025 the Trump administration withheld about $6.8B in approved K-12 grants nationwide; DC joined a 24-state lawsuit. Chancellor Lewis Ferebee remains in role; State Superintendent Antoinette Mitchell was confirmed unanimously in May 2025.",
    quickTake: [
      "2025 DC CAPE posted the largest one-year gains on record: 57.9% ELA and 47.5% math at or approaching grade level.",
      "Ward 3 vs. Ward 8 math proficiency gap remains stark — 60% vs. 5% in 2024.",
      "DC joined a 24-state lawsuit after the Trump administration withheld ~$6.8B in K-12 grants in July 2025.",
    ],
    stats: [
      {
        value: "57.9% / 47.5%",
        label: "DC CAPE 2025: ELA / Math at or approaching grade level (record one-year gain)",
        source: { label: "OSSE", url: "https://osse.dc.gov/release/dc%E2%80%99s-2025-statewide-assessment-results-show-significant-gains-english-and-math-proficiency-0" },
      },
      {
        value: "60% vs. 5%",
        label: "math proficiency: Ward 3 vs. Ward 8 (2024 DC CAPE)",
        source: { label: "EmpowerK12", url: "https://www.empowerk12.org/data-dashboard-source/dc-parcc-dash" },
        alarm: true,
      },
      {
        value: "$6.8B",
        label: "federal K-12 grants frozen July 2025; DC joined multistate lawsuit",
        source: { label: "Chalkbeat", url: "https://www.chalkbeat.org/2025/07/01/trump-administration-withholds-education-funding-angering-schools/" },
        alarm: true,
      },
      {
        value: "~52/48",
        label: "DCPS / public charter enrollment split (SY2025-26)",
        source: { label: "OSSE Enrollment Audit", url: "https://osse.dc.gov/enrollment" },
      },
    ],
    whatsAtStake: [
      {
        headline: "Federal K-12 funds remain politically exposed",
        detail: "The July 2025 freeze swept Title II, after-school, and English-learner funds. DC joined the 24-state suit; partial release followed but the precedent is set.",
      },
      {
        headline: "Ward-level gaps persist",
        detail: "2025 gains were real (Ward 8 posted the largest career-readiness gains since 2022) but a 55-point math-proficiency gap doesn't close in one year.",
      },
      {
        headline: "Enrollment is flat, not declining",
        detail: "SY2025-26 total public-school enrollment fell 0.2%; pre-K dropped 3%. DCPS/charter split is stable. The closure-and-consolidation fight is dormant — for now.",
      },
    ],
    whoDecides: [
      { name: "DCPS Chancellor Lewis Ferebee", role: "Runs DC Public Schools (the LEA). Appointed 2019; reports to the Mayor." },
      { name: "State Superintendent Antoinette Mitchell (OSSE)", role: "Runs the State Education Agency: testing, special-ed compliance, child care, transportation. Confirmed May 2025." },
      { name: "DC State Board of Education (9 elected members)", role: "Sets state-level standards (graduation requirements, social-studies framework). Does not run schools." },
      { name: "DC Public Charter School Board (PCSB)", role: "Charter authorizer — approves, reviews, and closes the city's ~120 charter schools." },
    ],
    recentMoves: [
      {
        date: "2025-08-15",
        headline: "DCPS launches bell-to-bell phone ban for SY2025-26",
        source: { label: "DCPS", url: "https://dcps.dc.gov/release/dc-public-schools-will-be-phone-free-beginning-school-year-2025-2026" },
      },
      {
        date: "2025-08-01",
        headline: "OSSE: 2025 DC CAPE shows record one-year gains in ELA and math",
        source: { label: "OSSE", url: "https://osse.dc.gov/release/dc%E2%80%99s-2025-statewide-assessment-results-show-significant-gains-english-and-math-proficiency-0" },
      },
      {
        date: "2025-07-01",
        headline: "Trump administration withholds ~$6.8B in K-12 grants; DC joins multistate suit",
        source: { label: "Chalkbeat", url: "https://www.chalkbeat.org/2025/07/01/trump-administration-withholds-education-funding-angering-schools/" },
      },
      {
        date: "2025-05-06",
        headline: "Council unanimously confirms Dr. Antoinette Mitchell as State Superintendent",
        source: { label: "OSSE", url: "https://osse.dc.gov/release/dc-council-confirms-dr-antoinette-s-mitchell-state-superintendent" },
      },
    ],
    voterQuestions: [
      "What's your concrete plan to close the Ward 3 to Ward 8 proficiency gap by 10 points in one term?",
      "Do you support more, fewer, or the same number of charter schools — and on what criteria?",
      "If federal K-12 funds are frozen again, what local revenue source backfills them?",
    ],
    liveSources: [
      { label: "OSSE", url: "https://osse.dc.gov/" },
      { label: "DC Public Schools", url: "https://dcps.dc.gov/" },
      { label: "DC Public Charter School Board", url: "https://dcpcsb.org/" },
      { label: "DC State Board of Education", url: "https://sboe.dc.gov/" },
      { label: "EmpowerK12 — data dashboards", url: "https://www.empowerk12.org/data-dashboard-source/dc-parcc-dash" },
    ],
  },
];

export function getIssueBySlug(slug: string): Issue | undefined {
  return issues.find((i) => i.slug === slug);
}

export function allIssueSlugs(): string[] {
  return issues.map((i) => i.slug).filter((slug) => !STATIC_ROUTE_SLUGS.has(slug));
}

// BL-55: substantive issues (i.e. those that render through IssueDetail, not a static
// page) must carry a 3-bullet quickTake summary. Surfaced as a colocated test in
// issues.test.ts so the data-refresh skill can't quietly drop the bullets when adding
// new issues.
export function isSubstantiveIssue(issue: Issue): boolean {
  return !STATIC_ROUTE_SLUGS.has(issue.slug);
}
