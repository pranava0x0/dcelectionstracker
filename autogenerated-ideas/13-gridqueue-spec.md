# GridQueue — Interconnection Queue Tracker

> **Generated:** 2026-03-09 | **Sector:** Energy / Grid Infrastructure

---

## Problem Statement

Grid interconnection is the critical bottleneck for the energy transition. 63.7% of renewable energy professionals cite grid saturation as the #1 barrier to progress. Gigawatts of planned renewable projects and data centers are stuck in interconnection queues that can take 4-7 years. Each ISO/RTO (MISO, PJM, CAISO, ERCOT, SPP, NYISO, ISO-NE) publishes queue data in different formats, on different schedules, with different levels of detail. Developers, investors, and utilities lack a unified view to compare queue positions, estimate wait times, identify less congested nodes, and track withdrawal patterns.

## Target Audience / User

- **Primary:** Renewable energy project developers (solar, wind, storage) scouting sites and tracking active applications
- **Secondary:** Clean energy investors and lenders performing due diligence on project timelines
- **Tertiary:** Utility planners assessing generation interconnection trends; data center developers looking for available grid capacity

**User persona:** "Sarah" — VP of Development at a mid-size solar developer with 15 projects in various queue stages across PJM and MISO. She manually downloads queue spreadsheets monthly, cross-references against her project list, and builds board presentations on queue progress. She needs faster answers on which nodes have shorter queues and where projects are dropping out.

## Vibe / Goals

- **Vibe:** Analytical, map-centric, power-sector fluent. Feels like a Bloomberg terminal built specifically for grid interconnection.
- **Core goals:**
  1. Unified, always-updated view of interconnection queues across all 7 major ISOs/RTOs
  2. Geographic visualization showing queue density, wait times, and available capacity by node/substation
  3. Trend analysis showing withdrawal rates, queue velocity, and capacity mix shifts to inform siting decisions

## Aesthetic

- Map-first design with the U.S. grid overlay as the primary interface
- Data-dense with layered information (click a node → see queue depth, projects, estimated timelines)
- Dark background with bright data overlays (similar to grid operator control rooms)
- Heavy use of charts: queue growth over time, capacity by fuel type, completion rates
- Inspiration: CAISO's OASIS interface modernized + Google Maps' layered data approach

## UX Ideas

1. **National queue map:** Interactive U.S. map showing queue depth by ISO/RTO region with drill-down to transmission zones and substations
2. **Queue explorer table:** Sortable, filterable table of all queued projects with status, capacity, fuel type, application date, and estimated study completion
3. **Node analyzer:** Select a point of interconnection → see current queue, historical completion rate, average wait time, and network upgrade cost trends
4. **Portfolio tracker:** Users tag their own projects → dashboard showing status updates, milestone alerts, and position changes
5. **Withdrawal tracker:** Track which projects are dropping out and why — capacity freed up, cost threshold exceeded, etc.
6. **Queue velocity metrics:** How fast is each ISO moving through studies? Which regions are accelerating/decelerating?

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **ISO/RTO queue portals** | Official, authoritative | Siloed, inconsistent formats, no analytics, no cross-ISO view |
| **Lawrence Berkeley Lab (LBNL) Queue Reports** | Excellent annual analysis | Annual only; no real-time tracking; research format, not operational tool |
| **LevelTen Energy** | PPA marketplace with market intel | Focused on offtake, not interconnection queue intelligence |
| **Enverus Power & Renewables** | Comprehensive energy data | Enterprise pricing ($100K+); broader than just queues |
| **S&P Global Market Intelligence** | Deep utility data | Expensive; interconnection is one small piece of a huge platform |

**White space:** No affordable, developer-facing tool provides real-time, cross-ISO interconnection queue tracking with geographic visualization and predictive analytics.

## Data That Might Be Needed

- **ISO/RTO queue data:** MISO, PJM, CAISO, ERCOT, SPP, NYISO, ISO-NE interconnection queue spreadsheets/portals (all publicly available, different formats)
- **Transmission maps:** ISO/RTO OASIS data; EIA Form 860 (generator/plant data)
- **Grid topology:** Substation locations, transmission line ratings, constraint data
- **Study reports:** Interconnection study results (system impact studies, facilities studies) where publicly posted
- **FERC filings:** Generator interconnection dockets, queue reform proceedings
- **LBNL data:** Historical queue analysis datasets
- **EIA data:** Form 860 (existing/planned generators), Form 861 (utility data)

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with Mapbox GL JS for grid mapping; D3.js for queue analytics charts
- **Backend:** Python/FastAPI with heavy data processing (pandas/polars for queue data ETL)
- **Database:** PostgreSQL with PostGIS for geographic queries; materialized views for cross-ISO aggregates
- **Data pipeline:** Automated scrapers for each ISO queue portal (weekly refresh); FERC eLibrary API for filing updates

### Key Technical Components
1. **Queue Data ETL:** Normalize 7 different ISO queue formats into a unified schema (project ID, capacity, fuel type, POI, status, dates, study phase)
2. **Geographic Engine:** Map queue projects to physical grid locations (substations, transmission lines) using ISO-provided POI data + EIA plant locations
3. **Queue Analytics:** Compute metrics like average wait time by ISO/region/fuel type, withdrawal rates, study completion velocity, network upgrade cost averages
4. **Prediction Model:** Estimate time-to-commercial-operation based on ISO, fuel type, capacity, queue position, and historical patterns
5. **Alert System:** Notify users of status changes on tracked projects, new queue entries in target areas, and withdrawal-freed capacity

### MVP Scope
- 3 ISOs: PJM, MISO, ERCOT (highest volume queues)
- Basic map view with queue density by transmission zone
- Filterable queue table with search
- Simple metrics: queue depth by fuel type, average wait time by ISO
- Email alerts for tracked projects

### Growth Path
- All 7 ISOs + non-ISO utilities
- Predictive queue completion models
- Network upgrade cost estimation
- Integration with land/site selection tools
- API for energy analytics platforms
- Curtailment and congestion data overlay
