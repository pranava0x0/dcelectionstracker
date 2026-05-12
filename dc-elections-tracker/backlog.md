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
| ✅ BL-35 | Fix "Are you registered?" CTA — shipped v1 2026-05-10. Header + hero CTAs link to DCBOE registration in a new tab. (Renumbered from BL-27; commit history references the old number.) | S | S | ★★★ | Highest-visibility CTA on every page; was misdirecting voters to an internal page. |
| ✅ BL-16 | RCV explainer page + interactive ballot simulator — shipped v1 2026-05-10 at /issues/ranked-choice/. Pure IRV + click-to-rank simulator + 6th issue card on the homepage. | M | M | ★★★ | DC's first-ever ranked-choice primary; DCBOE has no public education campaign; every voter needs this |
| ✅ BL-03 | Declared 2026 candidate list — shipped v1 2026-05-10. Per-race rosters of 38 candidates with OCF/DCBOE filing links and party badges, expand-on-click `<details>` under each race card. (Extends BL-26 inline names into structured cards.) | S | S | ★★★ | Primary is weeks away; no other static non-partisan source aggregates all races in one place |
| ✅ BL-32 | Per-seat race pages + candidate profile cards — shipped v1 2026-05-10 for 4 open seats (mayor, council-at-large-bonds, council-ward-1, us-house-delegate) = 4 race pages + 24 profiles. | XL | XL | ★★★ | Core voter-decision tool; no static non-partisan DC source does this at seat level; see full spec below |
| BL-27 | Delegate race explainer — what the Delegate can/can't do + doxxing controversy context | M | M | ★★ | Most contentious race on the ballot; 5 declared; doxxing scandal happened; no context on site |
| BL-12 | "Who voted how" matrix — Council × major bills (Secure DC, Peace DC, RENTAL Act, FY26 budget, Sanctuary repeal pause), with ward labels | M | M | ★★ | Most-cited missing feature in civic tracker feedback nationally (Chicago Sun-Times model) |
| BL-01 | Per-councilmember voting record on flagship bills — individual pages or inline table in IssueDetail | M | M | ★★ | Same underlying data as BL-12; both can ship together once the voting-record data type is built |
| BL-19 | Candidate comparison matrix — Mayor race + Ward 1/3/5/6 + At-Large, one row per issue (housing, policing, federal workers, schools, budget) | M | M | ★★ | Open mayoral race (first since 2014); voters need side-by-side; Philadelphia Committee of Seventy model |
| BL-04 | Candidate questionnaire snapshot — one row per declared candidate × 5 yes/no policy questions | M | M | ★ | Ballotpedia has thin DC coverage; standardized Q&A differentiates from WaPo narrative coverage |
| BL-02 | Address-based ward + ANC lookup — paste address → ward, ANC, SMD, polling place | L | L | ★★ | Highest-traffic feature on comparable civic sites (Chicago Votes, VOTE411, NYC Board of Elections) |
| BL-36 | Collapse 6 individual issue links in primary nav → single "Issues" item | M | M | ★★ | Subsumed by BL-47 (full nav restructure); ship BL-47 instead. |
| BL-44 | Endorsements section on candidate profile pages | S | S | ★★ | Major DC endorsers (WaPo, DC for Democracy, WTU, ward Dem clubs, SEIU 32BJ) roll in 4–6 weeks before the primary — peak relevance is now. With DC's first RCV election, cross-endorsement rankings (Candidate X recommending Candidate Y as their #2) are the primary signal voters use for ranks 2–5; GGWash already publishes these for the mayor race. Add `endorsements?` array to `Candidate` and render a grouped badge list on each profile page. Can ship independently of BL-20 (site-wide endorsement index). |
| BL-45 | Candidate forums + voter guide links on race/seat pages — plus data-refresh skill update | M | M | ★★ | Forums and published voter guides (LWV, DC for Democracy, ward clubs, WAMU/DCist) are how voters compare candidates head-to-head. Data refresh skill must actively check for new forums and guides in the 6 weeks before June 16. See spec below. |
| ✅ BL-46 | Rethink race status labels — shipped v1 2026-05-12. `Race.status` machine value renamed to `"includes-incumbent"`. Race-card pill renders `RACE_STATUS_LABEL[status]` ("Open seat" / "Incumbent running" / "Special election"). Race pages print "Current officeholder: [Name] ([Party]) — also declared in this race" below H1 when the incumbent is running. | S | S | ★ | Removed the language that implied the seat belonged to its current holder; surfaced incumbency as a factual property of the candidate instead. |
| BL-47 | IMPORTANT — Restructure primary nav into two tabs: Issues + Elections | L | L | ★★★ | Current nav has 9 flat items — 6 issue pages sit alongside Officials, Elections, and Sources at equal weight. Collapse to Issues → `/issues/` index and Elections → `/elections/` hub (which absorbs Officials as a prominent section). Nav becomes 2 items; Sources moves to footer. DesignRush 2024 election tracker audit weights navigation at 25% of total UX quality score — the single highest-leverage structural change on the site. Supersedes BL-36. See spec below. |
| ✅ BL-37 | Remove AlertTicker marquee — shipped v1 2026-05-12. Component file, layout render, Tailwind `marquee` keyframe/animation, and globals.css `prefers-reduced-motion` reference all deleted. LatestCard remains the single render of `alerts.ts`. | S | S | ★★ | Removed double-render of the same alerts data; eliminated dated marquee UI pattern. |
| ✅ BL-52 | RCV simulator: truncation-nudge prompt — shipped v1 2026-05-12. Inline dismissable callout (`role="status"`) appears after Tabulate when only 1 candidate is ranked: "You ranked 1 candidate — you can rank up to 5. Your vote transfers to your next choice if your first pick is eliminated." Does not block tabulation. Resets on Reset. | S | S | ★★ | Closes the most-cited first-RCV behavior gap (truncation) inline at the moment voters see results. |
| BL-53 | Homepage hero: elevate address-lookup CTA above fold | M | M | ★★★ | Every major voter guide (VOTE411, BallotReady, Ballotpedia, Ward3Vote.com) leads with address entry — table stakes for voter-decision tools. Currently `AddressLookup` is buried in `/elections/` behind 3 scroll depths. With 5 weeks to the June primary, the homepage hero should answer "what's on my ballot?" not "how many days until the election." See spec below. |

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

**v1 ships with click-to-rank.** Deferred interaction variants worth A/B-ing post-primary: (b) per-row `<select>` dropdowns 1–5/skip (max accessibility; least visceral), (c) HTML5 drag-to-reorder into a ranking column (most NYC-like; touch-flaky, no library available because of dep rule). The pure `runIRV` function in `src/lib/rcv.ts` is interaction-agnostic so either alternative is a `RcvSimulator.tsx`-only swap.
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

**v1 ships with (b) expand-on-click `<details>` under each race card** (collapsed by default, native disclosure, no JS). Deferred render alternatives worth A/B-ing post-primary:
- **(a) Always-inline candidate lists** under each race card — most discoverable, but makes the page much taller. Worth testing post-primary if voter feedback shows the disclosure is being missed.
- **(c) Separate `/elections/candidates/` route** — one page, all candidates grouped by race. Cleaner separation; defeats the side-by-side-with-race-context value of the current layout. Could be paired with BL-32 per-seat pages once those exist.

Candidate data shape is now in `src/data/elections.ts` (`Candidate` type with `raceSlug` foreign key + `candidatesForRace()` helper); switching renders is a `/elections/page.tsx`-only swap.

**Scope:** Mayor · Council Chair · At-Large (Bonds seat + special) · Wards 1/3/5/6 · Attorney General · US House Delegate · Shadow Senator (Strauss seat) · Shadow Representative · SBOE Wards 2/4/7/8 + At-Large.

**Sources:** DC OCF (ocf.dc.gov — search by office) · DCBOE candidate filing portal · Washington Post / DCist candidate announcements (secondary, to fill gaps before OCF records update).

---

#### BL-12 + BL-01 · Voting Record Matrix + Per-Member Record

**v1 shipped (2026-05-10)** — inline on `/officials/` (BL-12 matrix as a 3-bill × 13-member table at the bottom of the page; BL-01 per-member `<details>` mini-record on each council card). Uses a new `src/data/votes.ts` keyed by `Official.slug` (refactor: added `slug` field to every Official). 3 fully-sourced bills shipped: Secure DC Omnibus (B25-0345, 2024-03-05), Peace DC Omnibus (B26-0187, 2025-07-01), RENTAL Act (B26-0164, 2025-09-17). Sets correct `not-in-office` markers for Crawford (Jan 2026 appointment), Felder (post-May 2024 special), and Trayon White (Feb–Aug 2025 expulsion gap).

**Backlogged v2 additions:**
- **FY2026 Budget (B26-0265)** — final reading 2025-07-28 passed 10-2, but the 2 named no-voters were not surfaced in basic web search. Requires deeper LIMS-page or roll-call sheet fetch by the data-refresh skill.
- **Sanctuary Values Repeal pause** — committee-only action on 2025-06-24. Not a Council-wide vote. UX needs to handle committee-only votes (most members would be `not-in-office`-equivalent — needs a distinct `not-on-committee` value or rendering treatment) before this can be added cleanly.
- **Sticky first column + mobile-transpose layout** for the matrix at narrow viewports. v1 ships with horizontal-scroll on mobile; sticky bill column would let voters keep the bill name visible as they scroll across members. Mobile-transpose (members as rows) is the spec's preferred fallback.
- **Per-member dedicated `/officials/[slug]/` pages** (alternative to the inline `<details>` mini-record). Would enable shareable per-member URLs and richer per-member context — useful for BL-32's per-seat race pages to cross-link to.

**Data shape (v1 implementation):** see `src/data/votes.ts`. The original spec proposed `member: string` (name) join keys; v1 uses `memberSlug: string` FK to `Official.slug` instead — safer against name drift.

**Sources:** dccouncil.gov press releases (vote tally announcements) · code.dccouncil.gov (final law text for cross-check) · DC Council LIMS at `lims.dccouncil.gov` (JS-rendered, sometimes returns empty shell to WebFetch) · candidate-member campaign sites (often surface tally on first reading) · 51st / GGW / WaPo / WAMU for named no-voters.

---

#### BL-19 · Candidate Comparison Matrix

**Model:** Philadelphia Committee of Seventy candidate grid · NYC CFB voter guide · Chicago Sun-Times voter guide structured-data table.

**v1 shipped (2026-05-10)** — inline on `/elections/` (decision: keep on the elections hub rather than carve `/elections/compare/`). Three race blocks (`mayor`, `council-at-large-bonds`, `council-ward-1`), 6 issue accordions per race matching the site's substantive issue pages. Click-to-expand `<details>` reveals candidate position cards. Sparse fill — positions populated by the data-refresh skill as candidates publish platforms.

**Backlogged render alternatives** (post-primary A/B candidates):
- Per-candidate cards (Pattern C) at desktop instead of issue-accordions
- Pick-2-and-compare (Pattern E) with checkboxes — needs a client component
- Stance pills (support/oppose/mixed) alongside text — needs editorial guidance once forums and debates land

**Page:** Inline on `/elections/` (v1). Spec originally offered `/elections/compare/` as an alternative; kept inline so voters reading the race cards can compare positions in the same surface.

**Races to cover in v1:** Mayor · At-Large (Bonds open seat) · Ward 1 (open seat).

**Issue columns (6, mirroring the site's issue pages — excludes `ranked-choice` which is procedural):**
1. Statehood & Federal Pressure (DC autonomy, Home Rule, response to federal overrides)
2. Public Safety (Secure DC, civilian review, federalized MPD response)
3. Housing & Evictions (rent freeze ballot, TOPA reform, construction targets)
4. Budget (FY27 shortfall, federal workforce loss, tax decisions)
5. Transportation (camera enforcement, WMATA funding, traffic deaths)
6. Schools (DCPS vs. charters, OSSE oversight, federal K-12 funding)

**Data shape (v1 implementation — `Candidate.positions` extension, not a separate type):**
```ts
// In src/data/elections.ts:
export type ComparableIssueSlug = "statehood" | "public-safety" | "housing" | "budget" | "transportation" | "schools";
export type Position = { stance: string; sourceLabel: string; sourceUrl: string };

// Extended Candidate (from BL-03):
positions?: Partial<Record<ComparableIssueSlug, Position>>;
```
Missing position keys render as "No position stated" in the UI. The original spec's `CandidatePosition` table type was rejected in favor of this in-place extension — keeps positions on the same record per-candidate (BL-32 per-seat pages will use the same record), avoids name-based joins.

(Reference: the spec's original draft type included `candidate`/`race` join keys and required all 5 issue fields. v1 dropped that in favor of an optional partial map. Original sketch:)
```ts
// Original draft (NOT implemented):
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

**v1 shipped (2026-05-10)** — nested under `/elections/` (rather than top-level `/[race-slug]/` per the original spec) for namespace consistency. Routes: `/elections/[race]/page.tsx` + `/elections/[race]/[candidate]/page.tsx`, both with `generateStaticParams` + `dynamicParams = false`. 4 races profiled (the open seats with the most declared candidates and press coverage): `mayor`, `council-at-large-bonds`, `council-ward-1`, `us-house-delegate` — 24 candidate profiles total. Race pages render the existing candidate roster from BL-03, a positions matrix using BL-19 data, and an external-voter-guides section (DCBOE/OCF/Ballotpedia/Wikipedia). Candidate profiles render identity block + links row + optional bio + per-issue position list + breadcrumb back. `/elections/` candidate `<details>` lists now link candidate names to their profile when the race is profiled.

**Backlogged v2 additions** (deferred to data-refresh skill + later editorial passes):
- **Forums & events attended** — needs a new `CandidateForum` type + per-candidate `forumsAttended[]` list. Source: DC LWV, DC Democratic State Committee, ward Dem clubs, WAMU/DCist.
- **News & media** per candidate — curated list of recent coverage (factual citations only, no editorial summaries). Cross-reference with BL-33 (media source database) once that ships.
- **Social/government links** beyond `websiteUrl` — LinkedIn, Twitter/X, Instagram, Facebook, government site for incumbents. Schema is forward-compatible; just need to populate.
- **Candidate-provided photos** — optional `photoUrl?`. No scraped headshots per editorial rule.
- **Expanding profiled-race scope** — adding the remaining 8 races (Council Chair, AG, Wards 3/5/6, At-Large special, Shadow Senator/Rep) just requires populating `bio`/`positions` and adding their slugs to `PROFILED_RACE_SLUGS`. The route generation is already generic.

**Why (original):** Voters need a single place to evaluate every candidate for a specific seat — their positions, their record at public forums, recent news, and links to the tools that compare them. No static non-partisan DC source does this at the seat level today. This is the biggest feature gap between DC Elections Tracker and a full voter guide.

**Original route shape (kept for reference; not implemented as written):**
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

**v1 shipped (2026-05-10)** — `AddressLookup.tsx` inline on `/elections/` near the top, below the countdowns. Submit-on-button (no debounced typeahead) — one outbound fetch per submit, zero on page load. Output block shows: ward (with current councilmember link), ANC + SMD (with oanc.dc.gov link), "Races you'll vote on in 2026" derived from `ballotForWard(ward)`, the council member's voting record on the 3 BL-12 tracked bills, and a DCBOE polling-place link. Error states: "Address not found" (404-style card with DCBOE fallback link) and "Lookup service didn't respond" (network/CORS error card with same fallback). Both spell out "DC Board of Elections (DCBOE)" on first reference per the editorial style rule.

**Known limitation — CORS proxy dependency:**
- `citizenatlas.dc.gov` MAR API does NOT return CORS headers, so browsers block direct cross-origin fetches.
- v1 routes the request through **corsproxy.io** (a free public CORS proxy, no API key, no advertised rate limit). The request path is: user-browser → corsproxy.io → DC government → user-browser. Neither the proxy nor this site stores or logs addresses.
- The privacy note in the UI is honest about this routing.
- If corsproxy.io becomes unreliable or imposes a paywall, v2 upgrade path is a self-hosted Cloudflare Worker proxy (free tier covers our volume by orders of magnitude; ~30-minute build).
- This is the only feature on the site that does runtime client-side fetching; the editorial rule in CLAUDE.md was amended to explicitly allow user-triggered fetches (not load-time fetches).

**Backlogged v2 ideas:**
- Self-hosted Cloudflare Worker proxy (replace corsproxy.io dependency)
- Save the looked-up address to `localStorage` so it persists across visits — adds convenience but invites "what else are you storing" anxiety; needs editorial review first
- Show census tract / lat-lng / nearest Metro station (low voter value, more for power users)
- Print-friendly "my ballot plan" output
- Show the user's ANC commissioner directly (requires ANC commissioner roster — pairs with BL-05)
- BL-25 ("What's on my ballot" full personalization) — extends BL-02 with SMD-level race detail (needs candidate-per-SMD mapping)

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

#### BL-44 · Endorsements on Candidate Profile Pages

**Why urgent:** Endorsements from major DC organizations (Washington Post, DC for Democracy, Washington Teachers Union, SEIU 32BJ, ward Democratic clubs) are the top sorting signal for many low-information voters and arrive 4–6 weeks before the primary. Adding them to profile pages while they're still decision-relevant maximizes value.

**Data shape** (extend `Candidate` in `src/data/elections.ts`):
```ts
export type CandidateEndorsement = {
  endorser: string;                                                      // e.g. "Washington Post"
  endorserType: "newspaper" | "union" | "civic" | "elected" | "party";
  date: string;                                                          // ISO
  sourceUrl: string;
};

// Add to Candidate:
endorsements?: CandidateEndorsement[];
```

**Render:** On `/elections/[race]/[candidate]/`, add an "Endorsements" section below the bio. Group badges by type (newspaper → union → civic → elected → party). Each badge links to the endorsement source. If `endorsements` is absent or empty, omit the section entirely — no "No endorsements" placeholder. On `/elections/[race]/`, show a compact count or abbreviated badge row per candidate in the candidate grid.

**Key DC endorsers to seed (when they announce):** Washington Post editorial board · DC for Democracy · Washington Teachers Union (WTU) · SEIU 32BJ · DC Federation of Civic Associations · Ward 1/3/5/6 Democratic clubs · DC DSA · individual elected officials cross-endorsing.

**Relationship to BL-20:** BL-20 is a site-wide `/elections/endorsements/` index page and filterable table — larger scope, deferred to P2. BL-44 is the per-profile display; it can and should ship before BL-20. The same `CandidateEndorsement` type feeds both.

**Data refresh:** Check weekly in the 6 weeks before June 16 for new endorsements. Sources: endorsing org websites, DCist/WaPo coverage, candidate social media announcements.

---

#### BL-45 · Candidate Forums + Voter Guide Links on Race Pages

**Why urgent:** Forums are the primary venue where voters compare candidates directly. DC LWV, DC for Democracy, ward Democratic clubs, and WAMU/DCist host forums in the 6–8 weeks before the primary. Voter guides from these orgs are often the only structured comparison for down-ballot races. The data-refresh skill must actively watch for announcements.

**Data shape** (add to `src/data/elections.ts`):
```ts
export type CandidateForum = {
  id: string;                   // kebab-case, e.g. "lwv-mayor-2026-05-15"
  raceSlug: string;             // FK to Race.slug
  date: string;                 // ISO
  title: string;
  host: string;
  format: "in-person" | "virtual" | "hybrid";
  recordingUrl?: string;
  summaryUrl?: string;
  attendedSlugs: string[];      // FK to Candidate.slug — who attended; empty until confirmed
};

export type VoterGuide = {
  id: string;
  raceSlug: string | "all";     // "all" for citywide guides covering multiple races
  publisher: string;
  url: string;
  publishedDate?: string;       // ISO — may not be known until the guide drops
  note?: string;                // e.g. "Includes written questionnaire responses"
};
```

**Render:** On `/elections/[race]/`, add two sections below the candidate grid:
1. **Forums** — table: date, host, format, recording/summary links, attended-by chip per candidate. Sort by date. Missing `attendedSlugs` renders as "attendance TBD."
2. **Voter guides** — link list: publisher name, publication date if known, note.

These sections should be absent (not rendered as empty) until at least one forum or guide exists for the race.

**Data integrity:** Add tests in `elections.test.ts` — every `CandidateForum.raceSlug` references a real race; every `attendedSlug` references a real candidate; `date` is a valid ISO string.

**Data-refresh skill instructions:** In the 6 weeks before June 16, check weekly for new forums and voter guides from:
- DC League of Women Voters (lwvdc.org) — typically hosts mayoral + ward forums
- DC for Democracy (dcfordemocracy.org) — progressive endorsement + voter guide
- Ward Democratic clubs (Ward 1, 3, 5, 6 — most active)
- WAMU/DCist "The Politics Hour" and voter guide
- Greater Greater Washington primary coverage
- Ballotpedia DC pages (aggregates guides)
- VOTE411.org (LWV's national guide platform, sometimes includes DC)
- Candidate websites and social media (candidates announce forums they're attending)

When a guide drops, log the URL and date immediately — voter guides sometimes go offline after the election.

**Civic org tracker (Ward3Vote pattern):** Ward3Vote.com (ward3vote.com) — the closest local analog — lists 11 civic organizations alongside their forum histories and a civic-org-to-race mapping. Consider adding a `CivicOrg` type below the `VoterGuide` type:
```ts
export type CivicOrg = {
  id: string;
  name: string;
  url: string;
  coverageNote: string;            // ≤ 1 sentence: "Hosts mayoral + ward forums"
  raceSlugs: string[];             // races they typically cover
  forumIds: string[];              // FK to CandidateForum.id — forums they've hosted
};
```
Render on each race page as a "Who covers this race" row below the voter guides section. This surfaces orgs like DC LWV, GGWash, DC for Democracy, ward Dem clubs, and WAMU — giving voters a starting point even when guides haven't yet been published.

---

#### BL-46 · Rethink Race Status Labels — Replace "Incumbent" with Neutral Seat-Status Language

**Why:** The current `Race.status` field has three values: `"open"`, `"incumbent"`, and `"special"`. The `"incumbent"` label implies the race belongs to the current holder and can cause voters to skip evaluating challengers. Every race is contested; the site should convey factual seat context without implying a presumptive winner.

**Proposed change:**

| Current | Proposed | Meaning |
|---|---|---|
| `"open"` | `"open"` | No incumbent is running; the seat is fully uncontested by a prior holder |
| `"incumbent"` | `"includes-incumbent"` | The current officeholder is running, alongside challengers |
| `"special"` | `"special"` | Mid-term vacancy; special election rules apply |

The **race-level card** currently renders a colored pill (`open` = red, `incumbent` = black border, `special` = blue). New rendering:
- `"open"` → red pill "OPEN SEAT" (unchanged)
- `"includes-incumbent"` → black-border pill "INCUMBENT RUNNING" (factual, neutral — names the fact rather than implying dominance)
- `"special"` → blue pill "SPECIAL ELECTION" (unchanged)

On the **race page** (`/elections/[race]/`), add a one-line factual note below the race title when the incumbent is running: "Current officeholder: [Name] ([Party]) — also declared in this race." Link [Name] to their profile.

The per-candidate `incumbent: boolean` flag on `Candidate` is unaffected — it is the factual record of who holds the seat and is used separately in candidate lists.

**Scope:** `src/data/elections.ts` (update `Race.status` type union + seed values), `/elections/page.tsx` + `/elections/[race]/page.tsx` (update the pill render), `elections.test.ts` (update any status-value assertions).

---

#### BL-47 · Primary Nav Restructure: Issues Tab + Elections Tab

**Why:** The current 9-item flat nav — Statehood | Public Safety | Housing | Budget | Transit | Schools | Officials | Elections | Sources — makes the header read as a site map. Six of nine items are editorial content pages; utility pages (Officials, Elections) compete visually with content. For a voter landing on the site 5 weeks before the primary, the nav creates unnecessary scan cost.

**Proposed nav (2 items):**

| Item | Route | What it covers |
|---|---|---|
| Issues | `/issues/` (new index page) | IssueCard grid for all 7 issues + brief intro |
| Elections | `/elections/` (existing) | Countdowns, address lookup, races, candidates + prominent Officials link |

Sources moves to footer-only (already there). Officials stays at `/officials/` (no route change) but exits the primary nav; it becomes a prominently linked section within `/elections/`.

**Key decisions:**

1. **`/issues/` index page (new).** Reuses the existing `IssueCard` grid component already on the homepage. Copy: "Six issues on the 2026 DC ballot. Every stat links to a primary source." The homepage IssueCard section stays — it is content on the homepage, not navigation.

2. **Officials absorbed into Elections hub.** On `/elections/page.tsx`, add a "Who currently holds office" section near the top (after the address lookup) with a card linking to `/officials/`. This keeps the route intact while making it discoverable from the primary entry point voters already use.

3. **Sources demoted to footer.** Remove from the `navItems` array in `NavBar.tsx`. Footer already includes it; no user journey is broken.

4. **No route deletions.** All existing URLs remain valid. This is a nav-surface change only for most of it; the only new route is `/issues/`.

**Result:** Nav collapses from 9 items to 2. On mobile the hamburger drawer goes from 9 taps to 2. Issue pages remain at the same URLs — `/issues/statehood/` etc. — and are reached via the Issues index.

**Scope:**
- `NavBar.tsx` — remove 7 items from `navItems`, keep Issues + Elections
- `src/app/issues/page.tsx` — new index page (reuse `IssueCard` grid)
- `src/app/elections/page.tsx` — add Officials section link
- No data changes, no route deletions

**Supersedes:** BL-36 (Issues index page — that work is the `/issues/page.tsx` piece of this). Makes BL-26 (nav separator) irrelevant.

---

#### BL-53 · Homepage Hero: Elevate Address-Lookup CTA Above Fold

**Why:** Research across VOTE411, BallotReady, Ballotpedia, and the Ward3Vote.com DC-specific guide shows every high-performing voter tool leads with address entry — it is the #1 voter need ("what's on my ballot?"). The current homepage hero leads with a countdown timer and a registration CTA. The `AddressLookup` component is buried in `/elections/` behind 3 scroll depths. With 5 weeks to the June primary, the homepage should be a decision tool, not a news digest.

**Scope:** `src/app/page.tsx` only. No changes to `AddressLookup.tsx`, `elections.ts`, or the MAR API call.

**Proposed hero rearrangement:**

```
BEFORE (current):
  Countdown ("5 weeks until primary") + countdown clock
  "Are you registered?" CTA
  "Three things that changed" LatestCard
  Issue card grid (7 cards)

AFTER:
  Headline: "June 16 primary is 5 weeks away. Find what's on your ballot."
  AddressLookup component (the existing component, copy-imported from /elections/)
  Small secondary: "Or browse by race →" (links to /elections/)
  ——
  "Three things that changed" LatestCard (unchanged)
  Issue card grid (7 cards, unchanged)
  Countdown moved below fold or to LatestCard area as a subtle stat
```

**Design constraints:**
- The `AddressLookup` component is already a `"use client"` component — it can be used on the homepage without new infrastructure.
- The MAR API call is user-triggered (form submit), not load-time. No new fetching behavior.
- The countdown (`Countdown.tsx`) can be demoted to a stat inside the hero text or moved below the LatestCard — the "X days until primary" information remains but stops being the visual anchor.
- Keep the "Are you registered?" CTA — embed it as a secondary link below the address form ("Not registered yet? Register by May 26 →").

**v1 scope (P1):** Reorder homepage content + move `AddressLookup` to hero. The countdown moves below the fold. A full homepage redesign (new layout, new hierarchy, dark/light split) is deferred to post-primary.

---

## P2 — Ship before November 3, 2026 general

Sorted within tier by impact ÷ effort.

| ID | Feature | Complexity | Effort | Impact | Rationale |
|---|---|---|---|---|---|
| BL-17 | SBOE candidate guide — all candidates for the 4 ward seats on the Nov 3, 2026 general ballot (Wards 1, 3, 5, 6) | M | M | ★★ | WaPo and DCist barely cover SBOE; nonpartisan races appear only on the November ballot (not the June primary) so the page can't ship usefully until SBOE filings close (~August 2026). See spec below; moved from P1 to P2 after the 2026-05-10 scoping pass corrected the ward list and ballot context. |
| BL-08 | Federal RIF tracker — running counter of DC-resident federal employees affected by 2025–2026 RIFs, by agency | M | M | ★★ | Top voter issue; 72K DC-region federal job losses (BLS); differentiated from national trackers by DC-resident focus |
| BL-14 | Polling-place lookup by address (link to BL-02 once it ships; standalone fallback before then) | M | M | ★★ | DCBOE has a locator but it's opaque on mobile; surfacing it in DC Elections Tracker flow improves access |
| BL-18 | Campaign finance summary cards — per candidate: total raised, top 5 donors, industry breakdown | L | L | ★★ | NYC CFB and Philadelphia ArcGIS dashboards prove voters want this; OCF exports are public |
| BL-13 | Translate landing page + key dates to Spanish | M | M | ★ | Growing Spanish-speaking population; Ward 1/4/14th St. NW communities; immigration enforcement is a live issue |
| BL-20 | Endorsement tracker — newspapers, unions, civic orgs, elected officials by race | S | M | ★ | NYC and Chicago voter guides show endorsements are top sorting signal for low-info voters |
| BL-05 | ANC commissioner directory — all 46 ANCs, ~345 SMDs, sourced from oanc.dc.gov | M | L | ★ | Civic infrastructure that builds long-term authority; deferred because primary is ward-level |
| BL-37 | ~~Remove AlertTicker marquee~~ — promoted to P1 | — | — | — | Moved to P1 table. |
| BL-39 | Move candidate comparison matrix off the main `/elections/` scroll — link to it from race cards instead | S | S | ★ | The elections page has 7 sequential sections; the comparison matrix is near the bottom and rarely reached. Options: extract to `/elections/compare/` (a route the BL-19 spec explicitly considered but deferred), or collapse the matrix behind a `<details>` toggle. No data changes; pure render relocation. |
| BL-42 | Per-candidate news/coverage links — multiple sourced items per candidate | M | M | ★ | Each candidate profile should list recent coverage (DCist, WaPo, WAMU, City Paper) as a dated, sourced list. Add `news?: { date: string; outlet: string; headline: string; url: string }[]` to `Candidate`. Render on profile pages under a "Coverage" section. Editorial rule: factual citations only, no commentary. Deferred in BL-32 v1; this formalizes the data shape and render. Data refresh skill populates. |
| BL-43 | Fundraising numbers on candidate profiles — total raised, top donors, cash on hand | L | L | ★★ | DC OCF publishes committee-level contribution data. Pre-primary 10-day disclosure (June 6, 2026) is the high-value vintage. Add a `finance?` block to `Candidate`, populated by a Node script from OCF CSV exports. Renders as stat tiles on the profile page and a summary badge on the race page. Extends BL-18 (site-wide finance cards); both share the same OCF data pipeline. See BL-18 spec for the pipeline approach. |
| BL-48 | Mobile UX phase B — collapse-by-default for secondary content on mobile (responsive `<details>`) | M | M | ★★ | Follow-on to shipped Phase A (table → mobile stack). Wrap IssueDetail's "Who decides", "Questions to candidates", and "Live sources" in `<details>` that is closed at `<sm` and open at `sm+`. Same for officials cards (notes + source) and `/elections/` secondary sections (DCBOE administration, Key dates). Roughly halves page height on mobile without hiding anything on tablet/desktop. Adjacent to / can subsume BL-30 (collapsible officials groups) and BL-40 (FAQ collapse on issue pages). See spec below. |
| BL-49 | Mobile UX phase C — density + typography pass (mobile-only) | S | S | ★ | Follow-on to BL-48. Tighten card padding (`p-4 sm:p-5` → `p-3 sm:p-4 lg:p-5`), section gaps (`mt-10 sm:mt-14` → `mt-7 sm:mt-12 lg:mt-14`), and hero compression on mobile (`text-3xl` → `text-[28px]` on issue/race/officials/elections H1s; home stays `text-4xl`). Bump `text-[10px]/[11px]` source labels site-wide to `text-[12px]` with 44px tap-target padding. Subsumes BL-29 (stat tile source labels too small). |
| BL-50 | Mobile UX phase D — mobile-only "jump-to" chip strip on long pages | S | S | ★ | Horizontal-scroll anchor chips just under the hero on `/elections/` and `/issues/[slug]/`, hidden at `sm+`. Anchor links + `scroll-behavior: smooth`. No JS. Skip on home, officials, and candidate profile (shorter pages). Pairs with BL-48 collapsibles so voters can both jump and expand. |
| BL-51 | Mobile UX phase E — UAT + design.md update | S | S | · | Run `/dc-uat` at 375 / 640 / 1024 across `/`, `/elections/`, `/elections/mayor/`, a candidate profile, `/officials/`, `/issues/housing/`, `/issues/ranked-choice/`. Verify `prefers-reduced-motion` still pauses marquee + card-hover lift. Update `design.md` to document the new mobile patterns (table-to-stack, `<details>` open-at-`sm`, mobile chip strip) so the data-refresh skill respects them. |
| BL-54 | "Build your ballot" — RCV ranking tool for real DC candidates | L | L | ★★ | Voters need to think through ranks 2–5, not just their #1 choice. No DC guide currently addresses this. Add a per-race ranking interface using real candidate names from `elections.ts` (reuses the `runIRV` algorithm already in `src/lib/rcv.ts`). Outputs a shareable text summary — no backend needed. Mobile UX must follow Nearform RCV mobile research: always-visible rank controls on each candidate (not a drag zone), animation showing list reorder on rank change, candidate display order never shifts as a side-effect of another action. See spec below. |
| ✅ BL-55 | Issue page "quick take" — shipped v1 2026-05-12. `Issue.quickTake?: string[]` field (3 bullets, ≤ 25 words each, drawn from existing hero/stats) added to all 5 substantive issues. Rendered as an open `<details>` between JumpStrip and the hero graf, with a "Quick take" kicker + "What you need to know" heading. Open at every breakpoint, collapsible on mobile. New `issues.test.ts` enforces the 3-bullet invariant. | S | S | ★ | Surfaces the bite-snack-meal pattern at the top of long-form content so voters who don't scroll still get the substance. |
| BL-56 | Candidate questionnaire links — stopgap for sparse profiles | S | S | ★ | Candidate profile data is sparse (bios and positions for ~30% of candidates). Opportunity DC (opportunity-dc.org/2026-voter-guide) uses Google Drive PDF links as a zero-cost stopgap — candidates submit responses in their own format. Add `questionnaireUrl?: string` to `Candidate`. Render "Read full questionnaire →" below bio on profile pages. Verbatim candidate responses (the VOTE411 model) are more trustworthy than editorial summaries; this preserves that property with no editorial overhead. |
| BL-57 | OpenElections historical DC data — turnout context on race pages | L | L | ★ | OpenElections (github.com/openelections/openelections-data-dc) has standardized DC election result CSVs from 2000 onward, used by NYT and WSJ. Ward-level historical turnout and vote-share adds competitive context to race pages ("Ward 1 turnout was 45% in 2022; margin of victory was 12 points"). Pipeline: download OpenElections CSV → Node transform in `scripts/` → `public/data/historical-results.json` → render as a "Historical context" callout on `/elections/[race]/` pages. Free, no API key. |

---

### Specs — P2 items

#### BL-54 · "Build Your Ballot" — RCV Ranking Tool for Real DC Candidates

**Why:** The existing `RcvSimulator` teaches the IRV mechanism using fictional candidates. What voters need before the June 16 primary is help deciding their *actual* rankings for real races — especially ranks 2–5. No DC guide currently addresses the "who should be my #2?" question. The mayor race has 8 candidates; voters ranking only their top choice will have exhausted ballots if that candidate is eliminated early. GGWash addresses this partially via cross-endorsement publishing; this tool makes it interactive.

**Algorithm:** Reuses `runIRV()` from `src/lib/rcv.ts` — already tested and correct. This is a UI + data problem, not an algorithm problem.

**Page:** New section on `/elections/[race]/` for profiled races (mayor, council-at-large-bonds, council-ward-1) — below the candidate grid, above the comparison matrix. Labeled "Rank your choices." Not a separate route.

**Interaction model (based on Nearform mobile RCV UX research):**
- Each candidate card has always-visible "▲ Rank higher" / "▼ Rank lower" controls (not a separate drag zone — avoids up/down arrow confusion)
- Candidate display order (alphabetical) **never shifts** as a side-effect of ranking — the ranking number updates, but the list position stays fixed. This satisfies the ballot-UX constraint that candidate order cannot change as a side-effect of another action.
- A separate "Your ranking" section below the candidate list shows the chosen order as a numbered list that updates in real time.
- "See what happens if you vote this way" button runs `runIRV()` with the user's ballot against the full candidate list, showing a round-by-round result table (who's eliminated each round, where votes go).
- "Clear rankings" resets all ranks.

**Mobile constraints (from Nearform research):**
- Rank controls must be always visible — not hidden behind a menu
- Show explicit "Rank 1 / Rank 2 / Rank 3..." labels, not just numbers
- Use animation when the "Your ranking" list reorders — fade + slide so the voter sees the change, not just a number swap
- Tap target: 44px minimum for rank controls

**Data:** Uses existing `candidatesForRace()` from `elections.ts`. No new data type needed. The tool is purely client-side (`"use client"` component).

**New component:** `RcvBallotBuilder.tsx` — peer to `RcvSimulator.tsx` but uses real candidates. Optionally shareable as a text output: "My Ward 1 ballot: 1. Aparna Raj 2. Jackie Reyes Yanes 3. Rashida Brown" (navigator.clipboard, no server).

**Out of scope:** Saving rankings across sessions (would require localStorage — editorial review needed before touching persistence). Predicting who wins based on user's vote (the `RcvSimulator` already does a simplified version; for real candidates we'd need polling data we don't have).

---

#### BL-48 · Mobile UX phase B — collapse-by-default secondary content on mobile

**Why:** With Phase A shipped (the three horizontal-scroll tables now stack on mobile), the next biggest mobile pain is total page length. The `/issues/[slug]/` pages have 6 sections separated by 3px black rules; "Who decides", "Questions to candidates", and "Live sources" are tertiary content that doesn't need to be inline at the top on a 375px screen. `/officials/` cards show name + role + term-end + notes + source link + voting record always; on mobile the notes and source are noise on first scan. `/elections/` has a 5-card "DCBOE administration" stat block and an 8-row "Key dates" list that compete with the more important race cards below.

**Approach:** Use `<details>` consistently with a small CSS trick to be **closed at `<sm` and open at `sm+`**. Add to `globals.css`:

```css
@media (min-width: 640px) {
  details[data-sm-open] {
    /* open by default at sm and up; mobile keeps native closed default */
  }
  details[data-sm-open] > summary {
    /* still tappable to collapse if the user wants */
  }
}
```

And use a tiny inline script-free pattern: render `<details data-sm-open open>` on the server, and add CSS that closes it at `<sm` via `[hidden]` toggling on the content sibling. Simpler alternative: render two copies (one `<details>` at `sm:hidden`, one always-open block at `hidden sm:block`) — costs duplication but is JS-free and reuses the Phase A pattern.

**Scope (one PR):**
- `IssueDetail.tsx` — wrap "Who decides", "Questions to candidates", "Live sources" in responsive `<details>`
- `officials/page.tsx` — wrap each card's notes + source link in responsive `<details>`
- `elections/page.tsx` — wrap "DCBOE administration" stats and "Key dates" in responsive `<details>`

**Out of scope:** RcvSimulator (already short), AddressLookup result block (decision content), `/elections/[race]/[candidate]/` (linear narrative, fine).

---

#### BL-17 · SBOE Candidate Guide

**Why:** Four of nine SBOE seats are on the **November 3, 2026 general ballot** (Wards 1, 3, 5, 6). Their current holders' terms run Jan 2023 – Jan 2027. SBOE is the least-covered set of races in DC: Ballotpedia stubs, no WaPo profiles, no DCist beat. The DC SBOE sets academic standards, approves the DC Healthy Youth Act curriculum, oversees OSSE accountability, and has authority over public charter school authorization.

**Important correction (2026-05-10):** Original BL-17 description listed Wards 2/4/7/8 + At-Large on the June primary ballot. That was wrong on both counts:
- Those 5 seats were filled in November 2024 and run through 2029 — not on a 2026 ballot.
- SBOE is nonpartisan. Candidates appear only on the **November general election**, never the party primary.

The data-refresh skill should track the SBOE candidate filing window (typically closes August for the November ballot) and flag when challengers declare.

**Current incumbents (terms end Jan 2027 — i.e., on the 2026 ballot):**
- Ward 1 — Ben Williams (elected 2022)
- Ward 3 — Eric Goulet (elected 2022)
- Ward 5 — Robert Henderson (elected 2022)
- Ward 6 — Brandon Best (elected 2022)

**Data shape (reuses extended `Candidate` from BL-03):**
The `Candidate` type added in `src/data/elections.ts` already supports the fields BL-17 needs — add the following optional extensions when this item ships:
```ts
// Already present from BL-03: name, raceSlug, party, filingStatus, source, ocfUrl?, dcboeUrl?, websiteUrl?, notes?, incumbent?
// To add (optional, only populated for SBOE candidates in v1):
bio?: string;                   // ≤ 2 sentences
incumbentSince?: string;        // ISO year, e.g. "2023"
keyPositions?: {
  schoolFunding?: string;       // ≤ 1 sentence each
  charterExpansion?: string;
  schoolSafety?: string;
  teacherPay?: string;
};
questionnaire?: { q1: string; q2: string; q3: string; q4: string; q5: string };
```
The 5 sboe race slugs to add to `races2026[]`: `sboe-ward-1`, `sboe-ward-3`, `sboe-ward-5`, `sboe-ward-6` (4 wards; no at-large in 2026). Add a `category` field to `Race` (`"general" | "sboe"`) so the `/elections/` page can render the SBOE block separately from the citywide/council races.

**Page:** New `/sboe/` route (standalone, not nested under `/elections/`). Editorial note at top: "The DC State Board of Education sets academic standards and holds OSSE accountable. It does not run schools directly. SBOE races are nonpartisan and appear only on the November 3 general election ballot."

**UI:** Same IssueCard-style bordered grid (no rounded corners). One card per candidate with name, ward, bio line, and a 4-row mini-table for key positions. Where a candidate hasn't filed yet or hasn't responded to a questionnaire, render `Awaiting candidate response` in muted text — never infer positions.

**Sources:** sboe.dc.gov board biographies · DCBOE general election candidate filings (when published) · Ballotpedia (for prior election results) · DC Policy Center education research.

---

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
| BL-38 | Remove "Sources" from primary nav — it is already in the footer | S | S | · | Sources is a reference/audit page, not a primary voter destination. Moving it to footer-only frees a slot in the header and reduces nav cognitive load. No route changes; delete the nav entry in `NavBar.tsx` only. |
| BL-40 | Make voter FAQ section collapsible on issue pages (collapsed by default) | S | S | ★ | Each issue page has 7 sections; the FAQ is a deep-dive secondary resource. Wrapping it in a `<details>` element lets voters see the primary content (stats, what's at stake, who decides) without scrolling past a long Q&A list. Use `<details open>` at desktop if desired. `IssueDetail.tsx` only. |
| ✅ BL-41 | Move "Where this site stands" off homepage — shipped v1 2026-05-12. Section deleted from `src/app/page.tsx`; new `/about/` page absorbs the editorial standard, adds a "How we source" three-row block, and links out to `/sources/` and the public issue tracker. Footer gains an "About" link as the first item. Homepage still mentions sourcing inline via the hero paragraph. | S | S | · | Reclaimed prime homepage scroll real estate while preserving the trust signal on a dedicated route. |

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

**Web research conducted 2026-05-11.** Additional sources and DC-specific landscape added in this pass.

**Highest-impact features across all surveyed trackers, ranked by voter reach:**
1. Address → personalized ballot lookup (VOTE411, NYC BOE, Chicago Votes) — maps to BL-02 / BL-25 / BL-53
2. Candidate comparison grid with standardized issue positions (Philadelphia Committee of Seventy, Chicago Sun-Times) — maps to BL-19
3. Campaign finance transparency at candidate level (NYC CFB "Follow the Money", SF Ethics dashboards) — maps to BL-18
4. RCV education + ballot simulator for first-RCV jurisdictions (NYC 2021 taught: 15% confusion rate without education) — maps to BL-16
5. Underreported race coverage — school board, shadow reps, ANC — maps to BL-17

**2026 national elections context:** 36 governor races, 34 Senate seats, all 435 House seats on Nov 3 ballot. Top swing-state issues (PA, MI, WI, AZ, GA): housing affordability, Medicaid / federal funding cuts, gubernatorial open races (Whitmer term-limited, PA/GA competitive). DC parallels: housing/rent, federal workforce cuts, SBOE accountability — validates keeping these as top issue priorities.

**RCV maturity benchmark:** NYC first RCV (June 2021): 88% of voters ranked multiple candidates; 15% post-election confusion. Alaska (Nov 2022): 99.9% ballot validity. Key lesson: animated explainer + sample ballot in every polling place = significantly lower confusion. DC should have both before June 16.

**New findings from 2026-05-11 web research pass:**

*DC-specific landscape (active guides for the June 2026 primary):*
- **Ward3Vote.com** — the most structurally complete local guide: expandable race cards, "Jump to a Race" dropdown, civic org tracker (11 orgs), forum calendar with recording links, RCV video embed. Ward 3 only; DC Elections Tracker covers all wards.
- **Opportunity DC** (opportunity-dc.org/2026-voter-guide) — 5 races, endorsement labels, Google Drive PDF questionnaire links. The questionnaire-link stopgap pattern (BL-56).
- **BallotReady** (ballotready.org/elections/dc-primary-election) — address-personalized, email-gated. Lists 16 Delegate candidates. Requires email capture — the site avoids this friction.
- **GGWash** (ggwash.org/elections/2026) — endorses Lewis George (Mayor), Raj (Ward 1), Raymond (At-Large). Issues questionnaires on housing/transit/road pricing. Publishes full PDF responses. Endorses with explicit RCV cross-ranking suggestions.
- **Blue Voter Guide, Metro DC DSA, ACLU DC** — progressive-aligned endorsement aggregators.

*UX scoring criteria (DesignRush 2024 Election Tracker Ranking):*
- Data clarity and presentation: 30%
- User-friendly navigation: **25%** — validates BL-47 as highest-leverage structural change
- Mobile compatibility: 20%
- Visual/color accessibility: 15%
- W3C compliance: 10%
- Winner: Bloomberg (4.75/5) + Economist (4.75/5) for clean layout, dark mode, no paywall
- NYT weakness: paywall on state-level results — open access is a differentiator for this site

*RCV-specific research (New America + Nearform + Center for Civic Design):*
- Ranking truncation (using only rank #1) is the dominant behavior gap — not ballot errors
- Age is the #1 predictor of RCV confusion: 1% of 18–29 vs. ~5% of 65+ confused in NYC 2021
- Racial/socioeconomic comprehension gaps disappear after one election cycle
- Mobile RCV UI: always-visible rank controls (not drag-only), animation showing list reorder, no reorder as side-effect of another action (BL-54 spec)
- NYC spent $15M on voter education before 2021 RCV; DC's equivalent outreach is minimal

*Bite-snack-meal framework (EAC + Center for Civic Design):*
- "Bite": 1-sentence action or takeaway
- "Snack": 3-bullet summary + 2 stats — serves the 80% of visitors who don't read full pages
- "Meal": full issue briefing (what the site currently delivers for all visitors)
- BL-55 adds the "snack" layer to issue pages

*Open-source tools and data:*
- **OpenElections DC** (github.com/openelections/openelections-data-dc): standardized DC election result CSVs from 2000+, free, used by NYT/WSJ — maps to BL-57
- **RCVis** (rcvis.com): free, open-source round-by-round bar charts + Sankey diagrams. For November election-night, the round-by-round display pattern to follow
- **CivicPatterns** (civicpatterns.github.io): 5 patterns most relevant: Personalize It, As Simple As Possible, Harness Self Interest, Meet People Where They Are, Push Don't Pull

*WaPo 2024 technical decisions (for post-primary results pages):*
- "Hurdle metric": what % of remaining votes does the trailing candidate need to catch up — clearer than "% reporting"
- "Post Pulse" model: contextualizes early partial counts against expected final counts — prevents red/blue mirage
- Robotext: auto-generated narrative alongside tables for voters who can't read data visualizations without prose
- 30-second AP result update cadence via Dagster + Hasura + S3 JSON

*Trust signals that matter (Berkeley visualization bias study):*
- No annotations that push conclusions — data speaks, context is provided without framing
- Show uncertainty explicitly (error bands on polling averages, "X% reporting" context)
- Color reserved strictly for party affiliation — using orange for both "alarm stats" and "CTAs" creates confusion (see current design.md: `--primary` orange is dual-use; candidate for cleanup)
- Verbatim candidate quotes over editorial paraphrase — VOTE411 and GGWash both use this

---

## Bench: 50+ "recent moves" not selected for v1

Researched but not promoted to a recent-moves block in v1. Pull from research transcripts when the relevant issue page expands. Examples:

- Mar 2025 OTR commercial property assessment ($464M projected loss)
- 2025 ABCA shutters 84+ unlicensed cannabis shops
- Nov 2025 HUD ADA findings against DCHA
- Apr 2024 Connecticut Avenue bike lane cancellation, then Council restoration
- 2025-05-12 PIT count: homelessness down 9% to 5,138; family homelessness −18.1%

---

## Data-refresh run 3 — 2026-05-12

Findings applied this run:
- New alert: 2026-05-06 — DC Council 8–5 final approval of permanent youth curfew + extended curfew zones
- New `recentMoves` on `public-safety`: same curfew vote (final reading)
- RCV page (`/issues/ranked-choice/`): two new `recentMoves` (DCBOE sample-ballot training PDF; 2026-05-11 mail-ballots-going-out), "Your ballot" prose updated to link the sample-ballot PDF, `liveSources[]` gains DCBOE training PDF, `whatChanged[]` "still being finalized" tile rewritten now that the training PDF is public
- `sources-log.md` gained six entries across Government and Mayor 2026 (Council curfew final-approval release; DCBOE RCV training PDF; GGW JLG endorsement; HillRag, Georgetowner, GW Hatchet debate coverage; Georgetown/FOX 5 May 18 debate page)

New ideas surfaced (feed into existing items rather than new IDs):
- BL-44 (endorsements section) — concrete data ready: GGW endorses Janeese Lewis George (mayor); Working Families Party + cross-endorsements documented; council-member endorsements of JLG (R. White, Nadeau, Allen). Ready to seed `Candidate.endorsements?[]` per BL-44 spec.
- BL-45 (forums + voter guide links per race) — concrete data ready: May 2 (GW + Wash Informer), May 5 (Hill Center), May 7 (HillRag), May 18 (Georgetown/FOX 5). Each has a canonical recap URL; seed `Race.forums?[]` per BL-45 spec.

Pending / next-run candidates:
- DCBOE Monthly Voter Registration Statistics PDF for April 2026 not yet surfaced — Independent Voter Project shows 476,212 for April; confirm against DCBOE PDF before updating `electionStats`.
- Council vote tally for permanent curfew final reading (named no-voters in 8–5 vote) — surface and add as `BillVote` in `votes.ts`.

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
| BL-UAT-10 | Hamburger toggle is 40×40 (`h-10 w-10`); universal CLAUDE.md requires 44×44 minimum touch target | P3 | S | `src/components/NavBar.tsx:59` — `<summary>` for the mobile nav disclosure renders at 40×40 on iOS Safari. Bump to `h-11 w-11` (44px) to match Apple HIG / Android Material minimum. No functional bug; passive accessibility tightening. Found UAT run 4 (2026-05-12). |

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
