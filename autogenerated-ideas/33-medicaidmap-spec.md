# MedicaidMap — State Medicaid Budget Cut Impact Tracker

> **Generated:** 2026-03-16 | **Sector:** Government Data / Healthcare Policy

---

## Problem Statement

The One Big Beautiful Bill Act, signed into law in 2025, made historic cuts to federal Medicaid financing. According to a March 4, 2026 analysis, state Medicaid budgets will decline by a cumulative **$665 billion** over the next decade — with **7.6 million fewer enrollees by 2034**. The cuts compound on top of pre-existing state budget pressures from slowing revenue growth and rising costs. Nearly **two-thirds of states** expect a Medicaid budget shortfall in FY2026. Key policy changes cascading through state systems include: (1) the FMAP enhancement sunset on January 1, 2026, which eliminated the 90% federal match for Medicaid expansion states; (2) the October 2026 narrow of eligibility for certain non-U.S. citizens; (3) the December 2026 mandate for eligibility redeterminations every six months; and (4) a ban on new provider taxes that many states relied upon to fund their share of Medicaid costs.

States are responding unevenly. Some — like Colorado (dental cuts), North Carolina (anticipated eliminations), Montana and New Hampshire (new cost-sharing premiums) — have already begun cutting optional benefits like dental, behavioral health, and home- and community-based services. Others are holding for legislative sessions. Washington state faces a projected **$2.3 billion shortfall** in 2026 alone. Policy analysts, journalists, and healthcare advocates have no unified source that compares state-by-state budget impacts, enrollment projections, benefits being cut, and political response — forcing them to piece together information from 50 separate state legislative tracking systems.

For healthcare investors, hospital systems, and health plans, the state-by-state variation creates significant uncertainty about where to deploy capital, where to expect provider payment pressure, and which states will maintain optional benefits. For state policymakers, there is no cross-state benchmarking tool to understand how peer states are responding to identical federal pressures.

## Target Audience / User

- **Primary:** State Medicaid directors, budget analysts, and legislative staff navigating the 2026 state budget sessions — need to know what peer states are doing and how their decisions compare on coverage, spending, and enrollment projections
- **Secondary:** Healthcare policy researchers, journalists, and advocacy organizations (KFF, Commonwealth Fund, Pew) tracking the rollout of federal cuts across states; need aggregated, comparable data
- **Tertiary:** Healthcare investors (private equity, hospital systems, health plans) tracking enrollment shifts, optional benefit preservation, and provider payment rate trends by state — to inform capital allocation and market strategy

**User persona:** "Dr. Chen" — Director of Health Economics at a regional Medicaid-managed care plan operating in 6 states. She needs to know for each state: how much of the federal FMAP reduction has been absorbed vs. passed on to plans? Which optional benefits (dental, behavioral health, HCBS) are being cut? What's the enrollment trajectory over the next 24 months? She's currently tracking this manually across 6 state budget office websites and legislative tracking services — a 10-hour-per-week task she desperately wants automated.

## Vibe / Goals

- **Vibe:** Authoritative, policy-grade, data-dense. Feels like KFF's research portal with an interactive state map layer — trustworthy and complete.
- **Core goals:**
  1. Give a real-time, state-by-state view of Medicaid budget cuts, enrollment projections, and optional benefit status
  2. Surface how each state is responding to the federal cuts (cost-sharing, benefit cuts, eligibility changes) with date stamps and source citations
  3. Enable cross-state benchmarking so analysts and policymakers can see where their state stands relative to peers

## Aesthetic

- Clean, professional, academic-adjacent — white/light grey with healthcare blue accents
- Interactive U.S. choropleth map as the hero element, color-coded by funding cut severity or shortfall probability
- Dense data tables with state drill-down pages — this is a research tool, not a consumer app
- Desktop-primary; research is done on wide screens with multiple browser tabs
- Responsive for journalists and advocates checking states on mobile
- Inspiration: KFF State Health Facts portal meets Stateline's state news tracker

## UX Ideas

1. **State health fiscal map:** Interactive choropleth of all 50 states color-coded by: (a) projected FY2026 Medicaid shortfall probability, (b) FMAP reduction impact in dollars, (c) number of optional benefits cut, (d) enrollment decline projection — user can toggle which dimension drives the map coloring
2. **State profile pages:** Click any state → full page showing: federal funds received vs. projected vs. post-cut; enrollment trend (current, 1-year, 5-year projection); optional benefits status (dental, behavioral health, HCBS, vision — preserved/cut/at risk); latest legislative action with source link and date
3. **Cut impact timeline:** Calendar view showing when each federal policy change hits: Jan 1 (FMAP sunset), Oct 1 (eligibility narrowing), Dec 31 (6-month redeterminations) — overlaid with state legislative session schedules so users can track when state responses are expected
4. **Peer state comparison:** Select 2–5 states → side-by-side table comparing enrollment projections, per-capita spending, benefit cuts, federal funding changes, and political control (governor/legislature party)
5. **Provider impact tracker:** Aggregate data on rural hospital closures, Medicaid-dependent provider closures, and uncompensated care increases by state — linking Medicaid cuts to downstream access impacts
6. **Alert feed:** Subscribe to state-level alerts: when a state legislature passes a Medicaid budget, cuts a specific benefit, or receives new CMS guidance, get an email digest

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **KFF State Health Facts** | Deep Medicaid data; trusted; free | Static database updates; not real-time; no alert system; no cut-response tracking |
| **Stateline (Pew)** | State policy news coverage | Journalism, not a data tool; no structured comparison or download |
| **National Academy for State Health Policy** | Policy tracking per state | Slow to update; no data visualization; no investor-grade analytics |
| **Commonwealth Fund state scorecards** | Comparative state health data | Annual publications; not tracking real-time legislative responses |
| **Bloomberg Government** | Legislative tracking | Requires expensive subscription; general legislative, not Medicaid-specific |

**White space:** No tool combines real-time state-by-state Medicaid budget data, optional benefit tracking, enrollment projections, and legislative response monitoring in a single interactive platform.

## Data That Might Be Needed

- **CMS Medicaid enrollment and spending data:** CMS.gov state-level reports — public, quarterly updates
- **FMAP rates by state:** HHS/CMS published FMAP tables — public
- **State budget office publications:** State-specific budget proposals and final appropriations — public (50 state budget office websites)
- **State legislative databases:** LegiScan, OpenStates for bill tracking — freemium APIs
- **KFF Medicaid enrollment data:** Historical enrollment and projections — free data downloads
- **CMS waiver database (MACPro):** State Medicaid waivers affecting optional benefits — public
- **National Conference of State Legislatures:** Session schedules and budget action tracking — public
- **GAO/CBO Medicaid analysis:** Federal-level cost projections — public
- **Hospital closure/distress data:** CMS cost reports, Chartis Center for Rural Health — some free, some paid
- **OIG/CMS audit findings:** State compliance with federal Medicaid requirements — public

## High-Level Design / Implementation Ideas

### Architecture

- **Frontend:** Next.js with Mapbox GL JS for the choropleth map; React for state profile pages
- **Backend:** Python/FastAPI for data aggregation and API serving
- **Database:** PostgreSQL for state profiles, benefit status, enrollment projections, and legislative actions; TimescaleDB for enrollment time series
- **Data pipeline:** Weekly automated scrapes of CMS enrollment reports; manual curation for state legislative actions (curated by policy team or volunteer network); LegiScan API for legislative bill status

### Key Technical Components

1. **State Medicaid Profile Builder:** Aggregates per-state data from CMS, state budget offices, and KFF into a normalized state profile schema — enrollment, spending, FMAP, optional benefit status
2. **Federal Policy Calendar Engine:** Models which federal policy changes (FMAP sunset, eligibility changes, redetermination mandate) apply when for each state; generates per-state impact estimates using CBO scoring methodology
3. **Legislative Action Tracker:** LegiScan API integration to watch for Medicaid-tagged bills in all 50 states; manual review workflow for significance tagging; alert dispatcher
4. **Choropleth Map Engine:** Mapbox-based interactive map with multi-dimensional coloring; state click-through to profile pages
5. **Comparison Engine:** Dynamic side-by-side state comparison tables with configurable metrics and downloadable CSV/PDF exports

### MVP Scope

- State-level Medicaid budget cut estimates for all 50 states (using CBO/Kaiser methodology)
- Basic map with shortfall probability color coding
- 10 most-impacted state profiles (by absolute dollar cut)
- Optional benefit status tracking (dental, behavioral health, HCBS) for those 10 states
- Federal policy change timeline

### Growth Path

- All 50 state full profiles with real-time legislative tracking
- Provider impact layer (hospital closure risk, uncompensated care trends)
- Alert subscription system for state-specific updates
- Health plan / MCO revenue impact modeling (enrollment shifts × per-member-per-month rates)
- API for healthcare investors and policy research organizations

---

## Changelog

| Date | Author | Summary |
|---|---|---|
| 2026-03-16 | Auto-generated | Initial spec created via trend-research-ideator skill (Run 4) |
