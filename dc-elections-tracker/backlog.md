# DC Elections Tracker — Backlog

Active work in `issues.md`. Resolved items move to git history.

**Priority ladder:**
- P1 = ship before June 16, 2026 primary
- P2 = ship before November 3, 2026 general
- P3 = nice-to-have / post-election
- P4 = blocked (needs backend or is waiting on external event)

**Scoring columns:**
- Complexity: S = single component, M = multi-component, L = new data pipeline, XL = major new subsystem
- Effort: S < 1 day · M = 1–2 days · L = 3–5 days · XL = 1+ week
- Impact: ★★★ Very High · ★★ High · ★ Med · · Low

---

## P1 — Ship before June 16, 2026 primary

Sorted within tier by impact ÷ effort (best bang first).

| ID | Feature | Complexity | Effort | Impact | Rationale |
|---|---|---|---|---|---|
| BL-35 | Fix "Are you registered?" nav button — currently links to `/elections/` instead of DCBOE registration | S | S | ★★★ | Button is the highest-visibility CTA on every page; misdirects voters to an internal page instead of the DCBOE registration tool |
| BL-16 | RCV explainer page + interactive ballot simulator | M | M | ★★★ | DC's first-ever ranked-choice primary; DCBOE has no public education campaign; every voter needs this |
| BL-03 | Declared 2026 candidate list on /elections/ — full per-race rosters with OCF/DCBOE filing links and party badges (extends BL-26 inline names) | S | S | ★★★ | BL-26 added top-5 names per race; BL-03 promotes those into structured per-race candidate cards |
| BL-32 | Per-seat race pages + candidate profile cards — each seat gets a dedicated page with candidate roster, issue positions, forums attended, news/media, and links to external comparison tools | XL | XL | ★★★ | Core voter-decision tool; no static non-partisan DC source does this at seat level; see full spec below |
| BL-27 | Delegate race explainer — what the Delegate can/can't do + doxxing controversy context | M | M | ★★ | Most contentious race on the ballot; 5 declared; doxxing scandal happened; no context on site |
| BL-17 | SBOE candidate guide — all candidates for the 4 ward seats (Wards 2, 4, 7, 8) + at-large on June ballot | M | M | ★★ | WaPo and DCist barely cover SBOE; 4 of 9 seats are on the June ballot; clear differentiation |
| BL-12 | "Who voted how" matrix — Council × major bills (Secure DC, Peace DC, RENTAL Act, FY26 budget, Sanctuary repeal pause), with ward labels | M | M | ★★ | Most-cited missing feature in civic tracker feedback nationally (Chicago Sun-Times model) |
| BL-01 | Per-councilmember voting record on flagship bills — individual pages or inline table in IssueDetail | M | M | ★★ | Same underlying data as BL-12; both can ship together once the voting-record data type is built |
| BL-19 | Candidate comparison matrix — Mayor race + Ward 1/3/5/6 + At-Large, one row per issue (housing, policing, federal workers, schools, budget) | M | M | ★★ | Open mayoral race (first since 2014); voters need side-by-side; Philadelphia Committee of Seventy model |
| BL-04 | Candidate questionnaire snapshot — one row per declared candidate × 5 yes/no policy questions | M | M | ★ | Ballotpedia has thin DC coverage; standardized Q&A differentiates from WaPo narrative coverage |
| BL-02 | Address-based ward + ANC lookup — paste address → ward, ANC, SMD, polling place | L | L | ★★ | Highest-traffic feature on comparable civic sites (Chicago Votes, VOTE411, NYC Board of Elections) |

---

### Specs — P1 items

#### BL-16 · RCV Explainer + Interactive Ballot Simulator

**Why urgent:** Initiative 83 (74% approval, Nov 2024) brings ranked-choice voting to DC primaries for the first time on June 16, 2026. DCBOE regulations were not finalized as of late 2025; no public education campaign is active. NYC RCV post-mortems show voter confusion is the #1 complaint in a jurisdiction's first RCV election; 15% of NYC voters in 2021 said they didn't understand the system before voting.

**Page:** `/issues/ranked-choice/` (fits the existing IssueDetail pattern) or a dedicated `/rcv/` route.

**Static IssueDetail sections to build:**

1. **What changed** — Initiative 83 text; DC Law 25-295 implementation; what Council voted to fund (RCV yes; open primaries no; 8-4 vote); current DCBOE implementation status.
2. **How tabulation works** — plain-language walkthrough with a step-by-step example: 5 candidates, first round, last place eliminated, votes redistribute, repeat until majority. One static SVG/table built in code — no external image.
3. **Your ballot** — annotated sample ballot layout showing the ranking columns (1st–5th choice per race). Source: DCBOE sample ballot PDF once published; until then, use the ballot format from the official DC law.
4. **Common questions** (FAQ accordion or flat list): Do I have to rank all five? What if my first choice wins in round 1? What if all my ranked choices are eliminated (exhausted ballot)? Does ranking a second choice hurt my first choice? Does this take longer to count?
5. **Interactive simulator** (client-side JS only — no backend): Present 5 fictional candidates. User drags or clicks to set a ranking 1st–5th (or fewer). On "Tabulate," run the instant-runoff algorithm in JS and display a round-by-round table: who was eliminated, whose votes transferred where, final result. Reusable with a "Try again" button. No real candidate names until DCBOE publishes official ballots.
6. **Stat tiles:** 74% of DC voters approved I-83 (Nov 2024) · 5 = max candidates rankable per race · 8 ward Council seats use RCV · [alarm] First RCV election in DC history.

**Data:** No new `rcv.ts` needed; inline the static FAQ content directly in the page or as a `const` in the page file. The simulator runs off a small pure function (< 80 lines of TS).

**Sources:** DC Initiative 83 full text (makeallvotescountdc.org) · DC Law 25-295 (code.dccouncil.gov) · DCBOE RCV page (dcboe.org/elections/ranked-choice-voting) · FairVote RCV Resource Center (rcvresources.org) · NYC Board of Elections 2021 post-election report.

---

#### BL-03 · Declared 2026 Candidate List

**Page:** `/elections/` (already exists). The current `races2026` array in `elections.ts` lists races but not individual candidates. This item adds a per-race candidate roster.

**Data shape to add to `elections.ts`:**
```ts
export type Candidate = {
  name: string;
  race: string;            // matches Race.office
  party: Party | "TBD";
  filingStatus: "declared" | "filed" | "withdrawn" | "petitioning";
  ocfLink?: string;        // DC OCF committee registration URL
  dcboeLink?: string;      // DCBOE candidate page URL
  websiteUrl?: string;
  notes?: string;
};
```

**Render:** Below each `Race` card on `/elections/`, a sorted (alphabetical) list of declared candidates with party badge, filing status, and icon links to OCF + DCBOE filings. No commentary. No photos until official filing period closes.

**Scope:** Mayor · Council Chair · At-Large (Bonds seat + special) · Wards 1/3/5/6 · Attorney General · US House Delegate · Shadow Senator (Strauss seat) · Shadow Representative · SBOE Wards 2/4/7/8 + At-Large.

**Sources:** DC OCF (ocf.dc.gov — search by office) · DCBOE candidate filing portal · Washington Post / DCist candidate announcements (secondary, to fill gaps before OCF records update).

---

#### BL-17 · SBOE Candidate Guide

**Why:** Four of nine SBOE seats are on the June 16 primary ballot (Wards 2, 4, 7, 8) plus the at-large seat. These are among the least-covered races in DC; Ballotpedia pages are stubs; WaPo rarely runs SBOE profiles. The DC SBOE sets academic standards, approves the DC Healthy Youth Act curriculum, oversees OSSE accountability, and has authority over public charter school authorization.

**Data shape** (add to or alongside `elections.ts`):
```ts
export type SBOECandidate = {
  name: string;
  ward: string | "At-Large";
  incumbentSince?: string;
  bio: string;              // ≤ 2 sentences
  keyPositions: {
    schoolFunding: string;  // ≤ 1 sentence each
    charterExpansion: string;
    schoolSafety: string;
    teacherPay: string;
  };
  questionnaire?: {
    q1: string; q2: string; q3: string; q4: string; q5: string;
  };
  websiteUrl?: string;
  source: { label: string; url: string };
};
```

**Page:** New `/sboe/` route or a dedicated SBOE section at the bottom of `/elections/`. Given depth, a standalone page is preferred. Editorial note at top: "The DC State Board of Education sets academic standards and holds OSSE accountable. It does not run schools directly."

**UI:** Same IssueCard-style bordered grid (no rounded corners). One card per candidate with name, ward, bio line, and a 4-row mini-table for key positions.

**Sources:** DCBOE candidate filings · sboe.dc.gov · Ballotpedia (for prior election results) · DC Policy Center education research.

---

#### BL-12 + BL-01 · Voting Record Matrix + Per-Member Record

**These share the same underlying data.** Build the data layer once; render in two places.

**New data shape** (add to `officials.ts` or new `votes.ts`):
```ts
export type BillVote = {
  billId: string;           // e.g., "B25-0485"
  billName: string;         // e.g., "Secure DC Omnibus Amendment Act of 2024"
  voteDate: string;         // ISO date
  result: "passed" | "failed" | "vetoed" | "overridden";
  councilVotes: {
    member: string;         // matches Official.name
    vote: "yes" | "no" | "abstain" | "absent" | "excused";
    note?: string;
  }[];
  source: { label: string; url: string };
};
```

**Bills to cover (v1 set):** Secure DC Omnibus (B25-0485) · Peace DC Community Safety Amendment Act · RENTAL Act (rent freeze debate) · FY2026 Budget · Sanctuary Values Repeal pause vote.

**Render — BL-12 (matrix):** A `<table>` or CSS grid on `/officials/` or a new `/council/votes/` route. Rows = bills, columns = council members. Each cell: colored pill (green = yes, red = no, gray = absent/abstain). Mobile: transpose so members are rows.

**Render — BL-01 (per-member):** On each official's card (or a linked `/officials/[slug]/` page), a mini-table of just their votes across all tracked bills.

**Sources:** dccouncil.gov (official vote records under each legislation's page) · DC Council LIMS · WaPo/DCist for context on disputed votes.

---

#### BL-19 · Candidate Comparison Matrix

**Model:** Philadelphia Committee of Seventy candidate grid · NYC CFB voter guide · Chicago Sun-Times voter guide structured-data table.

**Page:** `/elections/compare/` or inline section on `/elections/`.

**Races to cover in v1:** Mayor · At-Large (Bonds open seat) · Ward 1 (open seat).

**Issue columns (5 max for readability):**
1. Housing / Rent (position on rent freeze ballot initiative, TOPA reform, new construction targets)
2. Public safety (Secure DC support or opposition; civilian review board stance)
3. Federal workforce / DOGE (position on DC fiscal exposure; plans if federal funding cut)
4. Schools (DCPS vs. charter balance; OSSE accountability stance)
5. Budget gap (how to close FY27 projected $700M+ shortfall — cuts vs. new revenue)

**Data shape:**
```ts
export type CandidatePosition = {
  candidate: string;        // matches Candidate.name
  race: string;
  positions: {
    housing: string;        // ≤ 25 words + sourceUrl
    publicSafety: string;
    federalWorkers: string;
    schools: string;
    budget: string;
  };
  positionSources: Record<string, string>; // key = position field, value = source URL
};
```

**Editorial rule:** Every position cell must link to a primary source (candidate website, debate transcript, WaPo quote). If no stated position, cell reads "No position stated" in muted text — never inferred.

---

#### BL-32 · Per-Seat Race Pages + Candidate Profile Cards

**Why:** Voters need a single place to evaluate every candidate for a specific seat — their positions, their record at public forums, recent news, and links to the tools that compare them. No static non-partisan DC source does this at the seat level today. This is the biggest feature gap between DC Elections Tracker and a full voter guide.

**Route structure:**
```
/[race-slug]/                  # per-seat race page
/[race-slug]/[candidate-slug]/ # per-candidate profile page
```
Example: `/mayor/` · `/mayor/muriel-bowser/`

All routes use Next.js `generateStaticParams` — static export only, no server runtime.

---

**Per-seat race page (`/elections/[race-slug]/`):**

1. **Header** — race title, office description (1–2 sentences: what the seat does, term length, salary if public), election date, filing deadline status.
2. **Candidate grid** — one card per declared candidate. Each card: name, party badge, photo placeholder (no photos until candidate provides one), filing status pill ("declared" / "filed" / "withdrawn"), and a "View profile →" link.
3. **Issue position matrix** — table or grid: rows = candidates, columns = 4–5 key issues for that race (pulled from the relevant `issues.ts` issue page). Each cell: candidate's stated position in ≤ 20 words + source icon (links to primary source). If no stated position: "No position stated" in muted text — never inferred.
4. **Forums & events attended** — list of public candidate forums, debates, town halls. Per event: date, host org, format (in-person/virtual), link to recording or summary. Per candidate: attended / not invited / did not attend. Source: DC LWV, DC Democratic State Committee, ward Dem clubs, WAMU/DCist.
5. **News & media** — curated list of recent coverage. Per item: ISO date, outlet, headline, URL. No editorial commentary — factual citation only. Max 10 items; oldest drops off when new ones are added.
6. **External comparison tools** — a clearly labeled "Other tools" section linking to: DCBOE official candidate page · DC OCF campaign finance · Ballotpedia race page · WAMU/DCist voter guide · DC LWV guide (when published) · VoteSmart profile (where available). Each link labeled with the tool name and what it provides ("DC OCF — campaign finance filings").

---

**Per-candidate profile page (`/elections/[race-slug]/[candidate-slug]/`):**

1. **Identity block** — name, party, race, filing status, photo (optional; candidate-provided only).
2. **Links row** — icon links for: personal website · government/official website · LinkedIn · Twitter/X · Instagram · Facebook · DC OCF committee page · Ballotpedia · DCBOE filing. All `target="_blank" rel="noopener noreferrer"`. Only render icons where a URL exists.
3. **Bio** — ≤ 3 sentences. Source cited. No editorial framing.
4. **Positions on key issues** — same 4–5 issue columns as the race matrix, expanded to full sentences with source links. "No position stated" where absent.
5. **Forums attended** — same event list as the race page, filtered to this candidate.
6. **News & media** — filtered to coverage of this candidate specifically.
7. **Back to race** — breadcrumb link back to `/[race-slug]/`.

---

**Data shapes (new file `src/data/candidates.ts`):**
```ts
export type CandidateProfile = {
  slug: string;
  name: string;
  race: string;              // matches Race.slug
  party: Party | "TBD";
  filingStatus: "declared" | "filed" | "withdrawn" | "petitioning";
  bio?: string;              // ≤ 3 sentences + sourceUrl
  photoUrl?: string;         // candidate-provided only
  links: {
    website?: string;
    governmentSite?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    ocf?: string;
    ballotpedia?: string;
    dcboe?: string;
  };
  positions: {
    issue: string;           // matches issue slug
    position: string;        // ≤ 25 words
    sourceUrl: string;
  }[];
  forumsAttended: string[];  // matches CandidateForum.id
  news: {
    date: string;            // ISO
    outlet: string;
    headline: string;
    url: string;
  }[];
};

export type CandidateForum = {
  id: string;
  date: string;              // ISO
  title: string;
  host: string;
  format: "in-person" | "virtual" | "hybrid";
  race: string;              // matches Race.slug
  recordingUrl?: string;
  summaryUrl?: string;
};
```

**External comparison tools to link per race:**
- DCBOE candidate filing portal (dcboe.org)
- DC OCF committee search (ocf.dc.gov)
- Ballotpedia DC race page
- WAMU / DCist voter guide (when live)
- DC League of Women Voters guide (when live)
- VoteSmart (votesmart.org) where profiles exist

**Editorial rules:**
- Every position cell must cite a primary source (candidate website, debate transcript, WaPo/DCist quote). Inferred positions are not allowed.
- Photos are optional and candidate-provided only — no scraped headshots.
- News items are factual citations, not editorial summaries. No commentary.
- "No position stated" is a valid and honest cell value — do not fill gaps with inference.

**Scope for v1 (P1 races):** Mayor · Council Chair · At-Large (Bonds open seat) · Ward 1 · Ward 3 · Ward 5 · Ward 6 · Attorney General · US House Delegate.

---

#### BL-02 · Address-Based Ward + ANC Lookup

**Model:** NYC Board of Elections sample ballot lookup · VOTE411.org · DC OP Address GIS API (MAR).

**Approach (static-friendly):** DC's Master Address Repository API at `https://citizenatlas.dc.gov/newwebservices/locationverifier.asmx` returns ward, ANC, and SMD for any DC address, no API key required. Call from the client on user submit.

**Component:** `WardLookup.tsx` — text input + button. On submit: calls MAR API, parses JSON, displays ward, ANC, SMD, and deep-links to DCBOE polling place finder pre-filled with the address.

**Display after lookup:**
- Ward number with link to ward council member on `/officials/`
- ANC and SMD number with link to oanc.dc.gov for that ANC
- Link to DCBOE polling place locator (passes address as URL param)
- Which ward council + ANC/SMD races are on your June 2026 ballot

**Error handling:** If MAR returns no match → "Address not found — try DCBOE's own lookup at dcboe.org" with link.

---

## P2 — Ship before November 3, 2026 general

Sorted within tier by impact ÷ effort.

| ID | Feature | Complexity | Effort | Impact | Rationale |
|---|---|---|---|---|---|
| BL-08 | Federal RIF tracker — running counter of DC-resident federal employees affected by 2025–2026 RIFs, by agency | M | M | ★★ | Top voter issue; 72K DC-region federal job losses (BLS); differentiated from national trackers by DC-resident focus |
| BL-14 | Polling-place lookup by address (link to BL-02 once it ships; standalone fallback before then) | M | M | ★★ | DCBOE has a locator but it's opaque on mobile; surfacing it in DC Elections Tracker flow improves access |
| BL-18 | Campaign finance summary cards — per candidate: total raised, top 5 donors, industry breakdown | L | L | ★★ | NYC CFB and Philadelphia ArcGIS dashboards prove voters want this; OCF exports are public |
| BL-13 | Translate landing page + key dates to Spanish | M | M | ★ | Growing Spanish-speaking population; Ward 1/4/14th St. NW communities; immigration enforcement is a live issue |
| BL-20 | Endorsement tracker — newspapers, unions, civic orgs, elected officials by race | S | M | ★ | NYC and Chicago voter guides show endorsements are top sorting signal for low-info voters |
| BL-05 | ANC commissioner directory — all 46 ANCs, ~345 SMDs, sourced from oanc.dc.gov | M | L | ★ | Civic infrastructure that builds long-term authority; deferred because primary is ward-level |

---

### Specs — P2 items

#### BL-08 · Federal RIF Tracker

**Why:** BLS data shows DC region lost 72,000 federal jobs (DC −24K, MD −24.9K, VA −23.5K) through March 2026. Brookings March 2026: 96% of DC-area job losses are federal. Federal employment is at its lowest since 2001.

**Data shape** (new section in `issues.ts` or standalone stat tiles):
```ts
export type RIFSnapshot = {
  asOf: string;             // ISO date of BLS/OPM data vintage
  dcResidentsCut: number;
  topAgencies: { agency: string; estimatedCut: number; source: string }[];
  wardBreakdown?: { ward: string; estimatedCut: number }[];
  courtOrdersActive: number;
  source: { label: string; url: string };
};
```

**Render:** Stat tile on homepage (`alarm: true`) + section on `/issues/economy/` (or new `/issues/federal-workers/`). Show: DC-resident total cut, top 5 agencies, note on pending court orders that may restore positions. Add `last_verified` timestamp.

**Sources:** BLS CES state/metro data · Brookings metro policy reports · OPM RIF notices · Washington Post federal workforce coverage.

---

#### BL-18 · Campaign Finance Summary Cards

**Pipeline (no backend):**
1. Download OCF bulk CSV exports from ocf.dc.gov (published quarterly; also available per committee).
2. Run a Node script in `/scripts/` to transform CSV → `public/data/campaign-finance.json`.
3. JSON structure: one record per candidate committee with `totalRaised`, `totalSpent`, `cashOnHand`, `topDonors[]`, `industryBreakdown{}`.
4. Commit JSON to repo; GitHub Actions rebuilds static site.
5. Update after each OCF quarterly deadline (Jan 31, Apr 15, Jul 31, Oct 15) plus 10-day pre-primary disclosure.

**UI component:** `FinanceCard.tsx` — total raised (large `display-tight` number), top 5 donors bulleted, 4-category bar (individual, business/real estate, PAC/outside, union), cash on hand. All sourced from OCF with link.

**Sources:** DC OCF (ocf.dc.gov) · Committee registration lookup · Contribution and expenditure search.

---

#### BL-20 · Endorsement Tracker

**Data shape** (add to `elections.ts`):
```ts
export type Endorsement = {
  endorser: string;
  endorserType: "newspaper" | "union" | "civic" | "elected" | "party";
  race: string;             // matches Race.office
  candidate: string;        // matches Candidate.name
  date: string;             // ISO
  sourceUrl: string;
};
```

**Key DC endorsers to track:** Washington Post · DCist/WAMU Voter Guide · SEIU 32BJ · Washington Teachers Union (WTU) · DC Federation of Civic Associations · DC for Democracy · Ward-level Democratic clubs.

**Render:** Badge list on candidate cards + filterable `/elections/endorsements/` table. Editorial note: "Endorsements are listed as facts. This tracker does not make endorsements."

---

## P3 — Nice to have / post-election

Sorted within tier by impact ÷ effort.

| ID | Feature | Complexity | Effort | Impact | Rationale |
|---|---|---|---|---|---|
| BL-22 | Ward-level election results map — choropleth of June 16 results by ward/precinct | L | L | ★★ | Post-primary data journalism; build Leaflet + GeoJSON template now, populate after June 16 |
| BL-30 | Collapsible category groups on `/officials/` and `/elections/` — collapsed by default on mobile, expanded on desktop | S | S | ★ | Pages grow long as more officials/races are added; grouping by category (e.g. "DC Board of Elections", "DC Council", "Mayor") with a `<details>`-based toggle reduces scroll burden on mobile without hiding content on desktop |
| BL-31 | Replace horizontal marquee in `AlertTicker` with a vertical rolling ticker (physical-board style) | M | M | ★★ | Horizontal scroll is slow to read and easy to miss; a vertical rotate-up animation (one item at a time, like a Reuters/departure-board ticker) is faster to scan and more visually distinctive. Each alert must fit in 1 line on desktop and max 2 lines on mobile — copy should be trimmed to enforce this. No external animation library; implement with a CSS `@keyframes` translate-up + opacity fade cycling through `alerts.ts` items via a small `useEffect`. `prefers-reduced-motion` should pause the cycle and show the first item statically. |
| BL-26 | Nav separator: visually split Officials + Elections from issue links | S | S | · | Officials/Elections are utility nav; issue pages are editorial content — a `|` divider or spacing gap makes the distinction legible without adding a new nav group |
| BL-28 | Stat tile grid vertical alignment broken on desktop — alarm prefix ("–") wraps to its own line, misaligning the number across cards | S | S | · | The "–$342M/yr" stat renders the minus sign on a separate line from the value, creating ragged tops across the 4-up desktop grid |
| BL-29 | Stat tile source attribution links are too small to read/tap — increase size across all issue pages | S | S | ★ | Current `text-[10px]` mono label is barely legible at desktop and undersized as a tap target on mobile; applies to every `IssueDetail` stat tile on every issue page |
| BL-06 | WMATA service map embed — real-time service alerts from WMATA RSS at build time | M | M | ★ | Service cuts are a real issue but not tied to candidate accountability in the same way |
| BL-07 | Eviction filings map by ward / building — sourced from DC Courts | L | L | ★ | Eviction data (7-year high) is a strong issue page addition; requires DC Courts data pipeline |
| BL-10 | Light search across all issue pages — client-side, build-time index (Pagefind) | M | S | · | Low voter impact vs. cost; useful for journalists and power users |
| BL-11 | RSS / Atom feed of recent moves across all issues | S | S | · | Niche but serves journalists and RSS users; small lift once `alerts.ts` is stable |
| BL-09 | Shadow Senator / Shadow Rep explainer mini-page | S | S | · | Good civic education; low voter impact vs. other P3 items |

---

### Specs — P3 items

#### BL-22 · Ward-Level Election Results Map

**Why post-primary:** June 16, 2026 produces the first RCV results in DC history. Round-by-round ward-level data will be historically significant. DCBOE publishes unofficial results election night and certified results within ~30 days.

**Stack:** `react-leaflet` (already in codebase). DC ward boundary GeoJSON available from DC GIS (opendata.dc.gov).

**Data shape** (populate post-June 16):
```ts
export type RaceResult = {
  race: string;
  round: number;           // 1–n (RCV rounds)
  wardResults: {
    ward: string;
    candidates: { name: string; votes: number; pct: number }[];
  }[];
  source: string;          // DCBOE results URL
};
```

**Render:** Choropleth with ward-level color intensity by leading candidate. Slider to step through RCV rounds. Click a ward → vote breakdown for that round.

**Source:** DCBOE unofficial and certified results (dcboe.org/elections/election-results).

---

#### BL-26 · Nav Separator: Officials + Elections vs. Issue Links

**Why:** The desktop inline nav (`NavBar.tsx`) lists all 9 routes as a flat sequence. Officials and Elections are utility/directory pages; the five issue pages (Housing, Public Safety, Economy, Schools, Federal Power) are editorial content. A visual separator makes that split legible at a glance without restructuring the nav.

**Simplest approach:** insert a `|` character (or a short `<span aria-hidden="true">` divider) between the last issue link and the Officials link in the `lg:flex` row. Same separator can be a faint `border-l` rule in the `<details>` mobile drawer.

**Scope:** `NavBar.tsx` only. No data changes, no route changes. Test that the separator does not appear in the skip-to-content focus ring or screen reader output (`aria-hidden="true"` on the divider element).

---

#### BL-07 · Eviction Filings Map

**Why deferred:** DC eviction filings are at a 7-year high (stat already in issue data). A map would meaningfully upgrade the housing issue page but requires a DC Courts data pipeline — they publish filing stats irregularly and format changes without notice.

**Pipeline (when ready):** DC Courts publishes quarterly eviction filing stats by ward (PDF). Transform to JSON via a script. Display as a ward-level choropleth (same Leaflet base as BL-22). Update quarterly.

**Sources:** DC Courts (dccourts.gov) · DC Fiscal Policy Institute housing reports · DC Policy Center.

---

## P4 — Blocked or future

| ID | Feature | Complexity | Effort | Impact | Blocker |
|---|---|---|---|---|---|
| BL-15 | Recent-moves email digest | L | XL | · | Needs backend (email list, send infrastructure). Revisit with Buttondown or Substack if readership grows. |
| BL-24 | Amharic translation of landing page | M | L | ★ | Blocked on BL-13 (Spanish) shipping first; Amharic Unicode rendering needs QA across browsers. DC has a large Ethiopian/Eritrean community concentrated in Wards 1 and 4. |
| BL-25 | Full "What's on my ballot" — address → all races + measures + ANC/SMD, printable ballot plan | XL | XL | ★★★ | Needs SMD-level address mapping and complete candidate roster per SMD. Viable as v3 once BL-02 + BL-03 + candidate data are stable. |

---

## Missing topic areas (v2 / v3 candidates)

| Topic | Why deferred from v1 | When to add |
|---|---|---|
| **Schools (deeper dive)** | Ships in v1 with shallow depth. Deeper lift: per-school report cards, MCAP by ward, OSSE accountability, charter authorizer fights, 2025–26 closure pipeline | Before SY26-27 starts — late summer 2026 |
| **Healthcare access** | DC Health, hospital closures (United Medical Center / Cedar Hill), and Medicaid PHE unwinding are real; did not surface as top primary-voter issues | If reader research surfaces demand |
| **Immigration enforcement** | Ships as a section under Public Safety; deserves its own page given Sanctuary Values fight and EO 14252 | After June primary if reader signals interest |
| **Cannabis / I-71 marketplace** | Ships as a section under Public Safety; 84+ shop closures and Harris rider history warrant their own page | After June primary |
| **Climate & resilience** | Sustainable DC, Anacostia cleanup, flood risk in Bloomingdale / Bellevue. Not yet a 2026 ballot issue | 2027 |
| **Open data / OPM-type accountability** | DC has FOIA but no equivalent of federal IG. OAG Inspector General is opaque | When IG reform legislation moves |
| **Elections administration** | DCBOE, RCV implementation status (Initiative 83 regulations not finalized as of late 2025), poll worker shortages | Post-primary retro |
| **ANCs (deeper)** | Ships as explainer paragraph + link to oanc.dc.gov. Deeper: per-ANC pages with current commissioners and "great weight" letter archive | After Nov 2026 ANC elections |
| **Post-election RCV analysis** | Round-by-round transfer data, ward-level RCV patterns, exhausted ballot rate — historically significant for DC's first RCV primary | After June 16 certified results |

---

## Research context — what other US trackers do

Surveyed: top 10 US cities (NYC, LA, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, San Jose); 2026 swing states (PA, WI, MI, AZ, GA); RCV jurisdictions (NYC 2021+, Alaska 2022+, Maine 2020+); campaign finance trackers (NYC CFB, SF Ethics, LA Ethics, Philadelphia Board of Ethics).

**Highest-impact features across all surveyed trackers, ranked by voter reach:**
1. Address → personalized ballot lookup (VOTE411, NYC BOE, Chicago Votes) — maps to BL-02 / BL-25
2. Candidate comparison grid with standardized issue positions (Philadelphia Committee of Seventy, Chicago Sun-Times) — maps to BL-19
3. Campaign finance transparency at candidate level (NYC CFB "Follow the Money", SF Ethics dashboards) — maps to BL-18
4. RCV education + ballot simulator for first-RCV jurisdictions (NYC 2021 taught: 15% confusion rate without education) — maps to BL-16
5. Underreported race coverage — school board, shadow reps, ANC — maps to BL-17

**2026 national elections context:** 36 governor races, 34 Senate seats, all 435 House seats on Nov 3 ballot. Top swing-state issues (PA, MI, WI, AZ, GA): housing affordability, Medicaid / federal funding cuts, gubernatorial open races (Whitmer term-limited, PA/GA competitive). DC parallels: housing/rent, federal workforce cuts, SBOE accountability — validates keeping these as top issue priorities.

**RCV maturity benchmark:** NYC first RCV (June 2021): 88% of voters ranked multiple candidates; 15% post-election confusion. Alaska (Nov 2022): 99.9% ballot validity. Key lesson: animated explainer + sample ballot in every polling place = significantly lower confusion. DC should have both before June 16.

---

## Bench: 50+ "recent moves" not selected for v1

Researched but not promoted to a recent-moves block in v1. Pull from research transcripts when the relevant issue page expands. Examples:

- Mar 2025 OTR commercial property assessment ($464M projected loss)
- 2025 ABCA shutters 84+ unlicensed cannabis shops
- Nov 2025 HUD ADA findings against DCHA
- Apr 2024 Connecticut Avenue bike lane cancellation, then Council restoration
- 2025-05-12 PIT count: homelessness down 9% to 5,138; family homelessness −18.1%

---

## UAT-sourced improvements (added 2026-05-10)

Found during first UAT session. Cross-referenced with existing backlog to avoid duplication.

| ID | Item | Priority | Complexity | Notes |
|---|---|---|---|---|
| BL-UAT-01 | Mobile hamburger / drawer nav | P1 | S | All 9 nav items hidden at <1024px; users can't reach 7 of 9 routes on phone. Minimum viable: `<details>` toggle, no JS needed. See UAT-002 |
| BL-UAT-09 | Mobile nav drawer stays open after tapping a link — should collapse on navigation | P2 | S | `<details>` element doesn't auto-close when a child `<a>` is tapped; user lands on new page with nav still expanded. Fix: add a small click handler that removes the `open` attribute on any nav link click, or use `router` events if Next.js navigation doesn't trigger a full page reload |
| BL-UAT-02 | Fix Next.js dev-mode issue page crash | P1 | S | Upgrade to Next.js ≥14.3 or env-var-gate `output: export` for local dev. Blocks all dev-time testing of issue pages. See UAT-001 |
| BL-UAT-03 | Dynamic "X weeks until primary" headline | P1 | S | Replace hardcoded "Five weeks" in `src/app/page.tsx:29` with computed week diff from `PRIMARY_DATE`. Goes stale in days. See UAT-004 |
| BL-UAT-04 | Abbreviate "Nonpartisan" party badge | P2 | S | Show "NP" instead of full word in the tiny pill chip. Add `partyTone` cases for `"Nonpartisan"` and `"Statehood Green"`. See UAT-003 |
| BL-UAT-05 | Skip-to-content link | P2 | S | Add `<a href="#main-content">Skip to content</a>` as first body child; add `id="main-content"` to `<main>`. Keyboard + screen reader UX. See UAT-007 |
| BL-UAT-06 | Remove dead https guard in `path()` | P3 | S | Dead code in `src/lib/links.ts` — second `if` block is unreachable. Delete it. See UAT-005 |
| BL-UAT-07 | Format slug in IssueCard/IssueDetail kicker | P3 | S | Replace `issue.slug` in kicker with formatted label (replace hyphens, title-case). See UAT-006 |
| BL-UAT-08 | Document dev-mode workaround in CLAUDE.md | P1 | S | Add note: "Issue pages only work with `next build && npx serve out/` — `next dev` crashes on dynamic routes due to Next.js 14.2.x bug." |

---


## Editorial backlog (non-feature)

- **Media source database (BL-33):** Web-search for podcasts, YouTube channels/playlists, and local news outlets that have covered the DC 2026 election cycle. Seed a new `src/data/media.ts` file with the full list — one record per channel or outlet, with a `type` field (`"podcast" | "youtube" | "local-news" | "newsletter"`), a canonical URL, and a `coverageNote` (≤ 1 sentence on what they cover). This list is the pull source for the news/media sections on race pages (BL-32), candidate profiles, and the data-refresh skill. The file should grow over time — add new sources as they're discovered; never remove a source that has published election coverage. Examples to seed: DCist/WAMU, Washington City Paper, The DC Line, Kojo Nnamdi Show, The Politics Hour, relevant YouTube town-hall recordings, Ward-level civic org channels.

- **Media metadata enrichment (BL-34, deferred):** Once `media.ts` exists, add per-item metadata linking each episode or article to specific issues (by issue slug) and candidates (by candidate slug). Shape: `{ issueSlug?: string[]; candidateSlugs?: string[] }`. This enables filtered views on race pages and candidate profiles ("coverage of this candidate" / "coverage of housing issues"). Deferred until BL-33 is seeded and BL-32 race pages exist to consume it.

- **Questions to candidates refresh (all issue pages):** Review and update the "Questions to put to candidates" block in every `IssueDetail` page against current trending issues — RCV implementation, federal workforce cuts, rent freeze ballot initiative, FY27 budget gap, Sanctuary Values repeal. Questions should reflect what's actually contested in the 2026 primary cycle, not just structural/perennial issues. Each question must be answerable in a yes/no or short position statement; vague questions should be tightened or cut. Aim for 4–6 sharp questions per issue page. Cross-reference with `alerts.ts` recent moves to surface what's newly relevant.

- On `/elections/`, spell out "DCBOE" as "DC Board of Elections (DCBOE)" on first reference; subsequent uses of the abbreviation are fine. Same rule applies to any source label in `elections.ts` that currently reads just "DCBOE".
- Add a `last_verified` ISO date to every Stat in `src/data/issues.ts`. Surface stale stats (> 90 days) in a build-time warning.
- Track every URL we cite in `src/data/issues.ts` and run a build-time link checker (HEAD requests; can run in CI but not during user build).
- Style guide: "Mayor Bowser (D)" on first reference, "Bowser" thereafter; same pattern for all elected officials.
- Consider a `scripts/check-sources.ts` that runs at build and warns (not errors) when any source URL returns non-2xx. Protects editorial integrity without breaking the build.
