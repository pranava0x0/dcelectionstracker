# DC Elections Tracker — Backlog

Active work in `issues.md`. Resolved items move to git history.

## Active backlog

| ID | Feature | Priority | Complexity | Size | Impact |
|---|---|---|---|---|---|
| BL-01 | Per-councilmember voting record on flagship bills (Secure DC, Peace DC, RENTAL Act, FY26 budget, Sanctuary repeal pause) | P1 | M | M | High — voters want a yes/no record before June 16 |
| BL-02 | Address-based ward + ANC lookup (paste an address → ward, ANC, SMD, polling place) | P1 | L | L | High — single highest-traffic feature on similar civic sites |
| BL-03 | Declared 2026 candidate list on /elections/, by race, alphabetical, with FEC/OCF filing links only — no commentary | P1 | S | M | High — the primary is in 5 weeks |
| BL-04 | Candidate questionnaire snapshot (one row per candidate × 5 yes/no questions) | P2 | M | M | Med |
| BL-05 | ANC commissioner directory (all 46 ANCs, ~345 SMDs) sourced from oanc.dc.gov | P2 | M | L | Med |
| BL-06 | WMATA service map embed (real-time service alerts, no third-party SDK — pull from WMATA RSS at build time) | P3 | M | M | Med |
| BL-07 | Eviction filings map by ward / building (sourced from DC Courts) | P3 | L | L | Med |
| BL-08 | Federal RIF tracker — running counter of DC-resident federal employees affected by 2025–2026 RIFs | P2 | M | M | High |
| BL-09 | Shadow Senator / Shadow Rep explainer mini-page with full powers-and-limits gloss | P3 | S | S | Low |
| BL-10 | Light search across all issue pages (client-side, build-time index) | P3 | M | S | Low |
| BL-11 | RSS / Atom feed of recent moves across all issues | P3 | S | S | Low |
| BL-12 | "Who voted how" matrix — Council × major bills, with party/ward labels | P1 | M | M | High |
| BL-13 | Translate landing page to Spanish (DC has growing Spanish-speaking population, immigration enforcement is a live issue) | P2 | M | M | Med |
| BL-14 | Polling-place lookup by address (DCBOE has the data; static-friendly precompute possible) | P2 | M | M | High |
| BL-15 | Recent-moves email digest (if we ever add backend; otherwise leave on backlog as "static export only") | P4 | L | L | Low |

Priority: P1 = ship within 30 days, P2 = ship in v2, P3 = nice-to-have, P4 = blocked.
Complexity: S = single component, M = multi-component, L = new data pipeline.

## Missing topic areas (v2 candidates)

| Topic | Why deferred from v1 | When to add |
|---|---|---|
| **Schools (deeper dive)** | Topic ships in v1 with shallow depth. Deeper lift: per-school report cards, MCAP by ward, OSSE accountability, charter authorizer fights, 2025–26 closure pipeline | Before SY26-27 starts — late summer 2026 |
| **Healthcare access** | Did not surface in research as a top voter issue, but DC Health, hospital closures (United Medical Center / Cedar Hill), and Medicaid PHE unwinding are real | If reader research surfaces demand |
| **Immigration enforcement** | Shipped as a section under Public Safety; deserves its own page given Sanctuary Values fight and EO 14252 | After June primary if reader signals interest |
| **Cannabis / I-71 marketplace** | Shipped as a section under Public Safety; deserves its own page given 84+ shop closures and Harris rider history | After June primary |
| **Climate & resilience** | Sustainable DC, Anacostia cleanup, flood risk in Bloomingdale / Bellevue. Not yet a 2026 ballot issue | 2027 |
| **Open data / OPM-type accountability** | DC has FOIA but no equivalent of federal IG. OAG Inspector General is opaque | When IG reform legislation moves |
| **Elections administration** | DCBOE, RCV (Initiative 83 debuts June 2026), poll worker shortages | Post-primary retro |
| **ANCs (deeper)** | Shipped as explainer paragraph + link to oanc.dc.gov. Deeper: per-ANC pages with current commissioners and "great weight" letter archive | After Nov 2026 ANC elections |

## Bench: 50+ "recent moves" not selected for v1

Researched but not promoted to a recent-moves block in v1. Pull from research transcripts when the relevant issue page expands. Examples:

- Mar 2025 OTR commercial property assessment ($464M projected loss)
- 2025 ABCA shutters 84+ unlicensed cannabis shops
- Nov 2025 HUD ADA findings against DCHA
- Apr 2024 Connecticut Avenue bike lane cancellation, then Council restoration
- 2025-05-12 PIT count: homelessness down 9% to 5,138; family homelessness −18.1%

## Editorial backlog (non-feature)

- Add a `last_verified` ISO date to every Stat in `src/data/issues.ts`. Surface stale stats (>90 days) in a build-time warning.
- Track every URL we cite in `src/data/issues.ts` and surface a build-time link checker (HEAD requests; can run in CI but not during user build).
- Style guide: "Mayor Bowser (D)" on first reference, "Bowser" thereafter; same pattern for all elected officials.
