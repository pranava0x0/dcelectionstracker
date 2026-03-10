# BatterySite — Storage + Data Center Co-Location Finder

> **Generated:** 2026-03-09 | **Sector:** Energy / AI Infrastructure

---

## Problem Statement

Battery storage costs have dropped 2-3x in the last 2-3 years, and hybrid solar+storage projects have jumped from 12% to 20% of new installations. Simultaneously, AI data centers are driving unprecedented electricity demand — gigawatts of planned facilities need reliable power that the grid can't always deliver. Batteries can bridge this gap, but finding optimal sites requires layering grid congestion data, electricity pricing, land availability, transmission capacity, and data center demand maps. This analysis currently requires expensive consultants and weeks of manual research.

## Target Audience / User

- **Primary:** Battery storage developers and independent power producers scouting for project sites
- **Secondary:** Data center developers looking for co-located power solutions; utility-scale renewable developers adding storage
- **Tertiary:** Clean energy investors evaluating site-level economics; utility planners assessing storage needs

**User persona:** "Michael" — Director of Development at a battery storage company. He's evaluating 20+ potential sites across ERCOT and PJM, running spreadsheet models for each that combine grid data, land costs, and revenue projections. Each site analysis takes his team a week. He needs to screen sites faster and focus deep analysis on the top candidates.

## Vibe / Goals

- **Vibe:** Technical, map-driven, investment-grade. Feels like a real estate analytics platform (CoStar) for energy infrastructure.
- **Core goals:**
  1. Enable rapid site screening by overlaying grid, economic, and land data on a single map
  2. Score and rank potential sites based on configurable criteria (revenue potential, grid need, development feasibility)
  3. Co-location intelligence: identify where battery storage near data centers creates mutual value

## Aesthetic

- Map-centric with rich data layers that can be toggled on/off
- Professional, technical feel — engineering-adjacent
- Split-screen: map on one side, site detail panel on the other
- Muted colors for base layers, bright overlays for data (heat maps for pricing, icons for data centers)
- Inspiration: Google Earth Pro's layered analysis meets CoStar's property analytics

## UX Ideas

1. **Site screening map:** Interactive map with toggleable layers: grid congestion, LMP pricing heatmap, planned data centers, available land/parcels, transmission lines, substations
2. **Site scorecard:** Click any location → see a scored assessment across dimensions (grid need, revenue potential, land cost, permitting complexity, proximity to load centers)
3. **Revenue modeler:** Input battery specs (capacity, duration, charge/discharge rates) → see projected revenue from energy arbitrage, capacity markets, and ancillary services at that location
4. **Data center overlay:** Map of planned and operational data centers with power demand estimates, highlighting underserved areas
5. **Comparative analysis:** Side-by-side comparison of 2-5 candidate sites across all metrics
6. **Deal pipeline:** Save and track sites through stages (screening → LOI → development → construction)

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **Enverus (RatedPower)** | Solar/storage design optimization | Focuses on plant design, not site selection and market analysis |
| **Clean Power Research (PowerClerk)** | Interconnection and DER management | Utility-side tool, not developer-facing site screening |
| **REsurety** | Energy market analytics for renewables | Revenue analytics only; no integrated site screening with land/grid data |
| **Paces (land origination)** | Land data for energy projects | Land only; no grid, pricing, or data center demand layers |
| **Wood Mackenzie / S&P** | Comprehensive energy analytics | Expensive ($100K+); broad platform, not a site screening workflow |

**White space:** No tool combines grid analytics, energy market data, land data, and data center demand intelligence into a unified site screening workflow for storage developers.

## Data That Might Be Needed

- **LMP/pricing data:** ISO/RTO real-time and historical locational marginal prices (all publicly available)
- **Grid congestion:** ISO/RTO transmission congestion reports, binding constraints
- **Capacity market data:** PJM, MISO, NYISO capacity auction results and forward curves
- **Ancillary services:** Regulation, reserves, and frequency response market data by ISO
- **Data center locations:** Public filings, news reports, utility large-load interconnection requests
- **Land/parcel data:** County assessor GIS data, land listing aggregators
- **Transmission data:** EIA Form 860, OASIS transfer capability data, substation locations
- **Permitting data:** State/county zoning for energy storage, setback requirements
- **Battery cost data:** NREL ATB (Annual Technology Baseline), BloombergNEF battery price index

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with Mapbox GL JS (or Deck.gl for heavy data layers); WebGL for performance
- **Backend:** Python/FastAPI with NumPy/Pandas for financial modeling
- **Database:** PostgreSQL + PostGIS for spatial queries; time-series store for LMP data
- **Data pipeline:** Automated ISO data ingestion; weekly land data updates; quarterly capacity market updates

### Key Technical Components
1. **Multi-Layer GIS Engine:** Overlay grid, economic, land, and demand data on a single performant map with spatial indexing
2. **Site Scoring Algorithm:** Configurable weighted scoring across dimensions (grid need, revenue, land cost, permitting, load proximity) — user can adjust weights
3. **Revenue Model:** Battery dispatch optimization model that simulates arbitrage, capacity, and ancillary revenue at any grid node using historical LMP data
4. **Data Center Demand Model:** Map known and planned data centers, estimate power demand, identify grid capacity gaps
5. **Spatial Analysis:** Automated site identification based on user criteria (e.g., "find locations within 5 miles of a 230kV+ substation with LMP spread > $30/MWh")

### MVP Scope
- ERCOT and PJM coverage
- LMP heatmap + transmission line overlay
- Basic site scorecard with 5 key metrics
- Simple revenue estimate (energy arbitrage only)
- Data center location layer (manually curated)
- Save/compare up to 10 sites

### Growth Path
- All ISO/RTO coverage
- Full revenue model (capacity + ancillary)
- Automated land parcel identification
- Co-location matchmaking (connect storage developers with data center operators)
- API for integration with financial models
- Permitting timeline estimates by jurisdiction
