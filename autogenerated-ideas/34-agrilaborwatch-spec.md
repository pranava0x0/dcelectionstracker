# AgriLaborWatch — Agricultural Labor Market Intelligence Platform

> **Generated:** 2026-03-16 | **Sector:** Agriculture / Supply Chain / Immigration Policy

---

## Problem Statement

Seventy percent of U.S. farmworkers are immigrants, of which roughly 40% are undocumented. As of 2026, heightened immigration enforcement has created a crisis throughout the agricultural supply chain. The numbers are stark: the agricultural sector lost **155,000 workers between March and July 2025** — compared to a 2.2% increase in the same period the year before. In labor-intensive crops like fruits and vegetables, nearly **20% of farms** reported enforcement-caused worker shortages according to a California Farm Bureau / Michigan State University survey. The 2026 harvest season is now at acute risk, with former agriculture secretaries warning Congress of "havoc" being wreaked on the food supply.

The Trump administration's response has been to expand and accelerate the H-2A agricultural guest worker visa program while simultaneously lowering its cost: in late 2025, the Department of Labor adjusted how H-2A adverse effect wage rates are calculated, lowering hourly wages by **$1–7/hour** depending on the state and allowing housing to be counted as part of compensation. But the H-2A program is widely acknowledged as complex, expensive, and slow — and uptake among farms that haven't previously used it is low.

Food buyers, ag commodity traders, retailers, and agricultural lenders have no systematic way to track where labor shortages are concentrated, which crops and regions are at greatest harvest risk, how enforcement activity is trending, or what the downstream food price implications are likely to be. USDA crop progress reports track field conditions but not labor availability. Commodity price forecasts don't incorporate labor risk as a systematic input. The result: supply chain surprises that move food prices in ways that sophisticated buyers and traders should be able to anticipate.

## Target Audience / User

- **Primary:** Agricultural commodity traders, food procurement directors at retailers and food processors ($500M+ revenue), and ag-focused hedge funds who want to incorporate labor market signals into supply/price forecasting for at-risk commodities (strawberries, lettuce, dairy, tree nuts, citrus)
- **Secondary:** Farm operators making 2026 planting/harvest decisions — whether to plant a full crop knowing labor may be scarce, or to shift to less labor-intensive varieties or mechanizable operations
- **Tertiary:** Agricultural lenders (FCS, commercial banks) and crop insurance underwriters assessing farm-level risk from labor shortfalls; food safety and supply chain researchers

**User persona:** "Marcus" — Head of Fresh Produce Procurement at a 200-store regional grocery chain. He buys $80M/year in fresh produce from California, Florida, and Georgia farms. In summer 2025, two of his major strawberry suppliers called to say they couldn't fulfill contracts because they couldn't harvest. He had no warning. Now for 2026 he wants a data-driven signal on which crops and which growing regions are facing acute labor risk so he can start building contingency supplier relationships before the problem materializes.

## Vibe / Goals

- **Vibe:** Intelligence-grade, agricultural-specific, actionable. Feels like Bloomberg Ag Intelligence meets a labor market dashboard — serious and data-forward.
- **Core goals:**
  1. Give food buyers and traders a regional map of agricultural labor availability and shortage risk by crop category and season
  2. Surface leading indicators of supply disruption (enforcement activity, workforce chilling effects, H-2A filing trends) before they show up in prices
  3. Help farm operators benchmark their labor sourcing strategy against regional peers and H-2A adoption rates

## Aesthetic

- Earth tones with data visualization accents (greens, golds, terra cotta) — feels agricultural but professional
- Map-centric design showing county-level or regional labor risk overlaid on crop production areas
- Desktop-primary (commodity traders and procurement teams at desks)
- Data table/chart-heavy for trend analysis; not consumer-friendly
- Seasonal alerts prominent — labor risk is highly seasonal, so the UI should reflect the harvest calendar
- Inspiration: DTN/Progressive Farmer's data portal crossed with USDA NASS's interactive crop maps

## UX Ideas

1. **Labor risk heat map:** County-level choropleth overlaid on USDA crop production area data — shows composite labor risk score by region, weighted by crop labor intensity, enforcement activity concentration, and H-2A adoption rate; user can filter by crop type (citrus, berries, leafy greens, dairy, tree nuts)
2. **Enforcement activity tracker:** Aggregates ICE worksite enforcement actions (from ICE press releases, PACER court records, news feeds) and maps them geographically; shows trend (accelerating/decelerating) by region and sector; distinguishes farm raids from meatpacking/processing raids
3. **H-2A pipeline tracker:** Tracks H-2A job order filings from OFLC (DOL's Office of Foreign Labor Certification, which publishes all H-2A applications publicly) — shows where applications are being filed, for which crops, and at what volumes, vs. prior year; indicates where farms are actively scrambling to replace labor
4. **Commodity supply-risk index:** For 15 key labor-intensive commodities, shows a composite supply risk score incorporating: regional labor risk, crop progress, weather, H-2A pipeline; updated weekly; exportable for integration into trader models
5. **Harvest calendar risk timeline:** Shows the harvest windows for major crops by region, overlaid with the current labor availability projections — gives a forward view of which weeks and which regions are most exposed in the next 6 months
6. **Scenario simulator:** User inputs a commodity, region, and enforcement intensity scenario → model shows projected labor shortage %, unharvested % of crop, and price impact range based on historical elasticities

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **USDA NASS Crop Progress** | Free; authoritative; weekly crop condition data | Does not track labor availability; no enforcement data |
| **DTN/Progressive Farmer** | Comprehensive ag market intelligence | Focused on commodity prices/weather; no labor market intelligence layer |
| **USDA ERS (Economic Research Service)** | Deep ag economics research | Academic publication cadence; not a real-time intelligence tool |
| **Immigration news aggregators** | Track enforcement news | Not ag-specific; no crop impact analysis; no geographic mapping |
| **OFLC H-2A disclosure data** | Official H-2A filing data (public quarterly) | Raw data dump; no visualization, no trend analysis, no integration with crop risk |

**White space:** No tool integrates immigration enforcement signals, H-2A program trends, and crop-specific labor availability into a forward-looking supply risk intelligence product for food buyers and commodity traders.

## Data That Might Be Needed

- **ICE worksite enforcement press releases:** Public, from ICE newsroom — structured parsing needed
- **OFLC H-2A job order database:** All filed H-2A applications with employer, crop, county, start date, worker count — public quarterly disclosure, free download
- **USDA NASS crop production and progress reports:** Weekly and annual crop data by county/state — free API
- **USDA LAUS / BLS Quarterly Census of Employment and Wages:** Agricultural employment by state/county — free, quarterly lag
- **PACER court records:** ICE immigration enforcement court filings for worksite cases — public but requires PACER access
- **California Farm Bureau / MSU labor shortage surveys:** Methodology for baseline benchmarking — academic/association access
- **USDA ERS farm labor data:** Wage rates, worker counts, H-2A trends — free, annual
- **NOAA weather data:** For harvest timing adjustments — free API
- **CME commodity futures:** For price impact modeling — delayed free / real-time paid
- **CLASP / advocacy trackers:** Enforcement incident tracking databases — some public

## High-Level Design / Implementation Ideas

### Architecture

- **Frontend:** Next.js with Mapbox GL JS for the labor risk heat map; React for commodity dashboards
- **Backend:** Python/FastAPI; weekly data pipeline orchestration
- **Database:** PostgreSQL for labor risk scores, enforcement events, H-2A filings; TimescaleDB for time-series commodity and enforcement trends
- **Data pipeline:** Weekly automated ingestion of USDA NASS, OFLC H-2A disclosures; daily scraping of ICE enforcement press releases; NLP classification of enforcement incidents by sector/region

### Key Technical Components

1. **Enforcement Event Extractor:** NLP pipeline (spaCy / LLM-assisted) that parses ICE press releases and news articles, extracts: location, sector, number of arrests, employer type; geocodes to county level; classifies as ag vs. non-ag worksite
2. **H-2A Trend Analyzer:** Ingests OFLC quarterly H-2A disclosure data; computes YoY filing trends by county, crop type, and employer; generates leading-indicator "H-2A scramble score" (high filings = farms are replacing undocumented labor at scale)
3. **Labor Risk Scorer:** Combines enforcement activity, H-2A pipeline, USDA employment data, and crop labor intensity weights into a 0–100 risk score per county-crop combination; updated weekly
4. **Commodity Supply-Risk Engine:** Maps county-level labor risk to commodity production weights (from USDA NASS); produces a commodity-level supply risk index with confidence intervals
5. **Harvest Calendar Overlay:** USDA historical harvest date data by crop/region → generates a forward calendar of when each crop faces peak labor demand, used to time-weight labor risk scores seasonally

### MVP Scope

- H-2A pipeline tracker with year-over-year comparison for top 10 labor-intensive crops
- Enforcement event map (ICE press releases geocoded, ag sector filter)
- Labor risk score for top 5 states (CA, FL, WA, GA, TX) × top 5 crops
- Weekly email digest: top 5 labor risk developments by region
- Commodity supply risk summary for major buyers

### Growth Path

- Expand to all 50 states and 20+ crops
- Historical modeling to back-test labor risk scores against price moves
- API for commodity trading platforms to embed labor risk signals
- Integration with USDA crop insurance data for farm-level risk modeling
- Consumer-facing food price early warning indicator (partnered with media)

---

## Changelog

| Date | Author | Summary |
|---|---|---|
| 2026-03-16 | Auto-generated | Initial spec created via trend-research-ideator skill (Run 4) |
