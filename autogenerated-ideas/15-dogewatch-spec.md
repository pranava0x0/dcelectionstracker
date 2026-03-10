# DOGEWatch — Federal Spending Cuts Tracker

> **Generated:** 2026-03-09 | **Sector:** Government Data / Transparency

---

## Problem Statement

DOGE has claimed hundreds of billions in savings, but independent analyses dispute these figures — estimates range from $21.7 billion in net costs to $135 billion in taxpayer losses from IRS cuts alone. Data has been removed from government websites, the DOGE website has had unannounced edits and math errors, and budget experts still don't know how much was actually cut or where unused funds went. Organizations like CLASP and the Center for American Progress have built trackers, but they're narrow in scope. There's no comprehensive, independent tool that reconciles claims against actual budget data and shows local community impact.

## Target Audience / User

- **Primary:** Journalists and investigative reporters covering federal spending and DOGE
- **Secondary:** Policy researchers and think tank analysts; state/local government officials assessing impact on their communities
- **Tertiary:** Congressional staff; advocacy organizations; engaged citizens tracking government accountability

**User persona:** "Rachel" — a reporter at a regional newspaper covering how federal cuts are affecting her state. She needs to quickly find which programs were cut in her area, cross-reference DOGE's claims with actual budget data, and produce data-driven stories. She currently cross-references multiple sources manually.

## Vibe / Goals

- **Vibe:** Nonpartisan, evidence-based, rigorous. The "Snopes of federal spending cuts."
- **Core goals:**
  1. Reconcile DOGE's claimed savings against official budget data (USAspending, Treasury, OMB)
  2. Break down cuts by geography (state, county, congressional district) to show local impact
  3. Track which government datasets/portals have gone offline or been modified

## Aesthetic

- Clean, editorial design — feels like a data journalism site (ProPublica, The Markup)
- White background with bold typography and clear data visualizations
- U.S. map with drill-down as the hero element
- Red/blue color palette avoided — use purple/teal/orange for nonpartisan feel
- Embeddable charts and graphics for journalists
- Inspiration: ProPublica's "Dollars for Docs" meets USAspending's data explorer

## UX Ideas

1. **Claims vs. reality dashboard:** Side-by-side view of DOGE's stated savings vs. verified budget changes from official sources, with a running "discrepancy tracker"
2. **Local impact map:** Drill from national → state → county → congressional district to see affected programs, dollar amounts, and impacted populations
3. **Program tracker:** Searchable directory of affected federal programs with status (cut, reduced, paused, eliminated), budget changes, and affected populations
4. **Data disappearance monitor:** Track which government websites, datasets, and pages have been modified or taken offline (via Wayback Machine integration + custom monitoring)
5. **Timeline view:** Chronological feed of cuts, announcements, court challenges, and reversals
6. **Embeddable widgets:** Journalists can embed specific charts, maps, or data points directly into their articles

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **CLASP DOGE Tracker** | Interactive data on program reductions | Focused on specific programs (safety net); limited geographic drill-down |
| **CAP DOGE Cuts by District** | Geographic breakdown | One-time analysis; not continuously updated; limited program coverage |
| **AllSides DOGE Tracker** | Balanced media perspective | News aggregation, not data analysis |
| **USAspending.gov** | Official spending data | Raw data; no DOGE-specific reconciliation; complex to navigate |
| **DOGE.gov/savings** | Official claims | Self-reported; disputed figures; covers only ~30% of claimed savings |

**White space:** No comprehensive, independent, continuously-updated tool reconciles DOGE claims against actual data with geographic drill-down and data disappearance tracking.

## Data That Might Be Needed

- **USAspending.gov API:** Federal awards, contracts, grants, and loans by agency, program, and geography
- **Treasury data:** Daily Treasury Statement, Monthly Treasury Statement for actual spending
- **OMB budget data:** President's budget, continuing resolutions, apportionment data
- **DOGE.gov:** Claimed savings (scraped, since no official API)
- **CLASP/CAP data:** Existing tracker data as baseline
- **Wayback Machine API:** Internet Archive for tracking government website changes
- **Census data:** Population by geography for per-capita impact calculations
- **Federal program databases:** CFDA (Catalog of Federal Domestic Assistance) for program descriptions
- **Congressional Research Service:** Budget analysis and program descriptions
- **Court filings:** PACER for DOGE-related litigation

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with Mapbox for geographic visualization; Recharts for data viz
- **Backend:** Python/FastAPI for data reconciliation engine
- **Database:** PostgreSQL for structured budget data; Elasticsearch for full-text search across programs and documents
- **Data pipeline:** Daily USAspending API pulls; weekly DOGE.gov scrapes; Wayback Machine integration for change detection

### Key Technical Components
1. **Reconciliation Engine:** Match DOGE claimed savings categories to specific budget line items in USAspending/Treasury data; compute verified vs. claimed savings
2. **Geographic Allocator:** Distribute federal program spending to geographic units using award data (grants → recipient location; contracts → place of performance)
3. **Change Detector:** Monitor government websites and data portals for modifications, removals, and additions; store snapshots and diffs
4. **Program Database:** Comprehensive catalog of affected federal programs with descriptions, budgets, and beneficiary data
5. **Embed System:** Generate shareable, embeddable chart/map widgets with auto-updating data

### MVP Scope
- Top 50 affected federal programs with budget data
- National + state-level geographic breakdown
- DOGE claims vs. USAspending data for the top programs
- Basic data disappearance tracker (10 key government sites)
- Weekly data update cadence

### Growth Path
- County and congressional district drill-down
- Real-time data update pipeline
- Court case tracker with outcome impacts
- API for researchers and journalists
- Community-sourced tips on data disappearances
- Historical comparison with previous administration spending
