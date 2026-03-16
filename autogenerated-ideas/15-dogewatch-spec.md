# DOGEWatch — Federal Spending Cuts Tracker

> **Generated:** 2026-03-09 | **Sector:** Government Data / Transparency
> **Last refreshed:** 2026-03-11 | **Reason:** OMB apportionments database removed from public access (lawsuit filed); federal workforce down 12% with 270K+ exits; CAP district-level tool now live; new Boston Globe analysis quantifies full scale
> **Last refreshed:** 2026-03-15 | **Reason:** Iran war exposes DOGE cuts hampering emergency response (CNN March 10 — preparedness, terror monitoring, cyber defense all weakened); DOGE.gov now claims 2,334 contract terminations + 3,489 grant terminations = $18B claimed; independent analysis estimates cuts cost $135B net; IEA releasing 400M barrel oil reserve (first major reserve release since 2022, partly a consequence of energy security gaps DOGE created); former GAO head says DOGE "needs to be much more transparent"

---

## Problem Statement

Since this spec was first written, the federal transparency situation has materially worsened — and the stakes have grown dramatically.

**OMB apportionments database removed:** In March 2026, Russell Vought removed the OMB apportionments database from the public OMB website. This database was the only public source showing whether executive branch agencies are actually releasing congressionally appropriated funds — a critical check on impoundment. The GAO wrote in disagreement; the Protect Democracy Project filed a lawsuit to restore access. This removal represents a new tier of transparency loss beyond programs merely being cut.

**Federal workforce down 12%:** As of January 2026, the U.S. government's civilian workforce has shrunk by 12% since September 2024. More than 270,000 workers have left federal employment. The Boston Globe quantified the full scale using OPM data. Key agencies: Treasury -24%, HHS -20%, IRS -25% (with a predicted $500B in lost tax revenue per the IRS watchdog). The Department of Energy lost ~2,000 staff including critical nuclear security roles.

**DOGE tracking landscape evolving:** The Center for American Progress launched a district-level DOGE cuts tool, showing which congressional districts lost what programs. This is powerful but a one-time snapshot. CLASP's tracker covers safety-net programs but not the full spending universe. AllSides aggregates news but doesn't do data analysis. DOGE.gov itself continues to be marked by unannounced edits, retroactive changes, and disputed math — making it actively unreliable.

**National security consequences now documented:** A March 10, 2026 CNN investigation documented that DOGE cuts have materially hampered the U.S. government's ability to respond to the Iran war: emergency preparedness degraded, terror threat monitoring gaps, cyber-attack defenses weakened, public diplomacy into Iran disrupted, and American citizens stranded abroad longer. The cuts that were made before the war — to agencies declared "unneeded" — proved consequential when crises arrived. The independent estimate of net DOGE costs has reached $135B (a separate analysis from DOGE's claimed $18B in savings), reflecting the gap between claimed efficiency and actual program costs.

**The core problem** remains — and is now higher stakes: no independent, comprehensive, continuously-updated tool reconciles DOGE's claimed savings against actual Treasury/USAspending data, shows local community impact with congressional district granularity, tracks data disappearances (including the OMB apportionments removal), and monitors the legal challenge landscape that is actively reversing some cuts. The Iran war context makes DOGEWatch's national security cost-tracking module newly critical.

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
- **Treasury data:** Daily Treasury Statement, Monthly Treasury Statement for actual spending flows
- **OMB budget data:** President's budget, continuing resolutions; reconstruct apportionment data from secondary sources (see OMBLens spec #25 for dedicated approach)
- **OPM workforce data:** Monthly federal employment by agency and occupation (publishes with 1-2 month lag)
- **DOGE.gov:** Claimed savings (scraped, since no official API; version-tracked to catch unannounced edits)
- **CLASP/CAP data:** Existing tracker data as baseline; supplement with CAP's congressional district breakdown
- **Wayback Machine API:** Internet Archive for tracking government website changes and reconstructing removed databases
- **Census data:** Population by geography for per-capita impact calculations; ACS for community demographics
- **Federal program databases:** SAM.gov, CFDA (Catalog of Federal Domestic Assistance) for program descriptions
- **Congressional Research Service:** Budget analysis and program descriptions
- **Court filings:** PACER for DOGE-related litigation (AFL-CIO CDL case, Protect Democracy OMB suit, etc.)
- **IRS Revenue data:** Treasury tax receipts to quantify IRS staffing cut revenue impact

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
- County and congressional district drill-down (building on CAP's district-level model)
- Real-time data update pipeline
- OMB apportionment reconstructor: use secondary sources to model what apportionment data would have shown (or partner with OMBLens #25)
- Court case tracker with outcome impacts — when courts order rehires or reinstatement, show the reversal in the data
- Federal revenue impact model: project tax revenue loss from IRS cuts, customs revenue impact from DOGE enforcement reductions
- API for researchers and journalists
- Community-sourced tips on data disappearances
- Historical comparison with previous administration spending
