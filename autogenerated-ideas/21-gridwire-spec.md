# GridWire — Transmission Reconductoring & Grid-Enhancing Technology Tracker

> **Generated:** 2026-03-11 | **Sector:** Energy / Grid Modernization

---

## Problem Statement

The U.S. electricity grid faces a fundamental paradox: demand is growing at the fastest rate since the 1960s (5.7% by 2030 per DOE projections), yet new high-voltage transmission construction has nearly stalled — only 322 miles of new high-voltage line were completed in 2024, against a projected need of ~5,000 miles annually. The average time to build a new transmission line exceeds a decade. FERC projects data center electricity demand alone will reach 35 GW by 2030, up from 19 GW in 2023, and that's before accounting for broader electrification.

The traditional response — build new transmission lines — is too slow. A faster, cheaper alternative exists: **reconductoring** existing transmission lines with advanced, high-performance conductors (HPCs) that can double capacity without new rights-of-way or lengthy permitting. Paired with grid-enhancing technologies (GETs) like dynamic line ratings, topology optimization, and advanced power flow controllers, reconductoring can unlock 10-40% more capacity from existing infrastructure in 1-3 years rather than 10+.

The economics are compelling: the REWIRE Act (S.3947), introduced March 2, 2026, by Senators McCormick and Welch — bipartisan legislation — projects that reconductoring could reduce grid costs by **$85 billion by 2035** and **$180 billion by 2050**. The bill would create a NEPA categorical exclusion (the primary permitting bottleneck) for projects within existing rights-of-way, direct FERC to improve return on equity for reconductoring projects, and fund regional collaboratives to identify high-impact opportunities.

The problem: there is no centralized, public-facing intelligence source tracking which utilities are deploying HPCs and GETs, what the REWIRE Act's legislative progress looks like, which grid segments have the highest reconductoring opportunity value, or how FERC's evolving incentive structure affects project economics. Transmission developers, renewable energy companies waiting for interconnection, utilities, and investors are all navigating this landscape blind.

## Target Audience / User

- **Primary:** Transmission developers and independent power producers evaluating reconductoring opportunities as an alternative to new-build transmission
- **Secondary:** Renewable energy developers blocked in interconnection queues — reconductoring nearby lines could unlock their access; utilities assessing grid modernization capex priorities
- **Tertiary:** Energy investors and analysts tracking the GET deployment market; state regulators and grid planners

**User persona:** "James" — VP of Development at a mid-sized transmission developer. He has 4 GW of renewable projects stuck in interconnection queues across PJM and MISO. He's heard that reconductoring specific transmission segments could create enough capacity headroom to unstick some of those projects, but he has no systematic way to identify which segments, verify the opportunity, or monitor the REWIRE Act's progress (which would significantly change project economics if the FERC return-on-equity incentive passes).

## Vibe / Goals

- **Vibe:** Technical, data-dense, utility-grade. Feels like an engineering intelligence platform — credible, authoritative, built for people who read FERC orders for breakfast.
- **Core goals:**
  1. Map the reconductoring opportunity landscape across U.S. transmission systems — where are the highest-value segments?
  2. Track real-world GET and reconductoring deployments to build a living inventory of what's actually being done
  3. Monitor REWIRE Act legislative progress and FERC regulatory developments to help developers model project economics under different policy scenarios

## Aesthetic

- Map-centric with transmission line overlays — similar to EIA's electricity map but focused on capacity constraints and upgrade opportunities
- Dark basemap with bright overlays: purple for congested/constrained segments, green for segments with known GETs or reconductoring projects underway
- Technical sidebar with FERC docket tracker and legislative progress timeline
- Dense data tables for comparing segments (length, voltage, current capacity, estimated new capacity, permitting status)
- Desktop-first (heavy data platform); PDF export for utility planning documents
- Inspiration: Transmission data platforms like eSett or OATI WebTrans, but with the UX clarity of Enverus

## UX Ideas

1. **Opportunity map:** Interactive U.S. transmission map overlaid with congestion data (binding constraint frequency), known reconductoring projects, and a "reconductoring potential" score for each major segment based on congestion revenue rights, LMP differentials, and interconnection queue volume
2. **REWIRE Act legislative tracker:** Dedicated panel tracking S.3947's progress (committee assignments, hearing schedule, amendment activity, floor prospects), with timeline to key votes and analysis of what each provision means for project economics
3. **FERC regulatory monitor:** Track FERC dockets related to reconductoring incentives (return on equity proposals, transmission planning rules), with plain-English summaries and effective-date alerts
4. **Deployment database:** Searchable database of confirmed GETs and reconductoring projects — which utilities are using dynamic line ratings (PPL Electric was first with PJM integration in 2022), topology optimization (Duke, AEP deployments), or advanced conductors — with capacity gains, timeline, and cost data where available
5. **Segment deep dive:** Click any transmission segment → see voltage class, ownership, current capacity, interconnection queue requests relying on it, binding constraint history, estimated reconductoring cost/benefit, and applicable FERC incentives
6. **Cost/benefit modeler:** Input a segment's parameters → see estimated reconductoring cost, new capacity gained, FERC return-on-equity incentive value (under current and REWIRE Act scenarios), and NPV comparison to new-build alternatives

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **S&P Global / Wood Mackenzie** | Comprehensive transmission market intelligence | $50K-$100K+ annually; broad; no dedicated GET/reconductoring focus |
| **ESRI/Utility network GIS tools** | Best-in-class GIS for utilities | Internal planning tools; not developer-facing; no GET-specific analytics |
| **FERC eLibrary** | All dockets and filings | Raw documents; no aggregation, synthesis, or project tracking |
| **GridLab / WATT Coalition reports** | Excellent GET policy research | Reports, not a data product; no real-time tracking |
| **RatedPower / Enverus** | Strong renewable/storage developer tools | Focused on generation, not transmission; no reconductoring workflow |

**White space:** No affordable, developer-facing tool aggregates reconductoring opportunity data, GET deployment tracking, REWIRE Act monitoring, and segment-level economics in a unified platform.

## Data That Might Be Needed

- **Transmission line data:** EIA Form 860 (transmission infrastructure); HIFLD (Homeland Infrastructure Foundation-Level Data) transmission line GIS layers (free)
- **Congestion data:** ISO/RTO binding constraint reports and congestion revenue rights data (PJM, MISO, CAISO, NYISO — all public); LMP nodal pricing data
- **Interconnection queue data:** All major ISO/RTO interconnection queues (publicly available); cross-reference against transmission segments for load-point identification
- **FERC dockets:** FERC eLibrary API for reconductoring-related dockets (incentive rate applications, transmission planning proceedings)
- **REWIRE Act tracking:** Congress.gov API for S.3947 status, committee assignments, and amendments
- **Utility filings:** State PUC filings for transmission upgrade projects; utility integrated resource plans (IRPs)
- **GET deployment news:** Automated news monitoring for reconductoring and GET deployment announcements from utilities (PPL, Duke, AEP, etc.)
- **Advanced conductor specs:** Public data from conductor manufacturers (3M, Southwire, CTC) on performance specs for HPC conductors
- **NREL/DOE research:** NREL's grid modernization research on GETs, including capacity gain estimates by technology

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with Mapbox GL JS; complex geometry rendering for transmission line layers
- **Backend:** Python/FastAPI; spatial analysis service for segment scoring
- **Database:** PostgreSQL + PostGIS for transmission line geometries and spatial joins; Elasticsearch for docket/document search
- **Data pipeline:** Monthly EIA 860 updates; daily ISO congestion data; real-time FERC docket monitoring via RSS; weekly legislative status checks via Congress.gov API

### Key Technical Components
1. **Transmission Segment Database:** GIS-indexed catalog of all major U.S. transmission segments with voltage, capacity, ownership, and congestion history
2. **Reconductoring Opportunity Scorer:** Composite scoring model incorporating congestion frequency (binding constraint $/MWh), interconnection queue demand on the segment, LMP differential, right-of-way reuse potential, and NEPA categorical exclusion eligibility under REWIRE Act
3. **Deployment Tracker:** Structured database of confirmed GETs and reconductoring projects with source links, utility name, technology type, capacity gain, and project status
4. **Legislative/Regulatory Intelligence Engine:** Monitors Congress.gov and FERC eLibrary for relevant developments; auto-generates plain-English summaries; updates economic model parameters (e.g., allowed ROE) when rule changes are finalized
5. **Cost/Benefit Calculator:** Per-segment NPV model for reconductoring vs. new-build, parameterized by FERC incentive scenarios and user-defined project cost assumptions

### MVP Scope
- PJM and MISO transmission networks (highest congestion, most active markets)
- Basic opportunity heat map (binding constraint frequency + interconnection queue density)
- REWIRE Act tracker (legislative milestones only, manually maintained)
- 25 confirmed GET/reconductoring deployments in database
- FERC docket search for reconductoring-related proceedings
- Free tier for map; paid tier for segment analytics and modeler

### Growth Path
- All ISO/RTO coverage (CAISO, SPP, ERCOT, NYISO, ISONE, SERC)
- Automated opportunity identification (flag segments meeting user-defined criteria)
- Developer portal: transmission developers can register projects and track from siting through FERC approval
- API for integration with interconnection queue management tools
- Dynamic line rating deployment tracker with real-time capacity data from participating utilities
- Comparative GET technology analysis (dynamic line ratings vs. topology optimization vs. advanced conductors vs. FACTS devices)
