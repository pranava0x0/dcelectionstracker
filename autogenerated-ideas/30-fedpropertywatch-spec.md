# FedPropertyWatch — Federal Real Estate Disposition & Community Impact Tracker

> **Generated:** 2026-03-15 | **Sector:** Government Data / Real Estate / Economic Development

---

## Problem Statement

The federal government is shedding office space at a pace not seen in generations — and the market intelligence gap is enormous. In FY2025, GSA disposed of 90 federal properties, eliminating 3 million square feet from the federal portfolio. An additional 45 properties are in "accelerated" disposal pipeline. The January 2026 USE IT Act requirement mandates that all agencies demonstrate at least a 60% building utilization rate — or produce plans to relocate — creating a new structural driver for disposals throughout 2026.

The scale: GSA manages approximately **8,600 owned or leased buildings** encompassing roughly **370 million square feet** of space. A September 2025 GAO assessment pegged the deferred maintenance backlog at **$50 billion** — with GSA receiving only $600 million annually to address it. The math suggests an 80% portfolio reduction would be needed just to break even on maintenance. Meanwhile, GSA's Public Buildings Service was targeted for a **63% reduction in headcount** — gutting the agency's capacity to manage the portfolio it still has.

DOGE's role: Early in 2025, DOGE pushed GSA to publish a list of 443 "non-core" properties targeted for sale — including Justice Department headquarters, federal courthouses, and agency HQ buildings in D.C. The list was subsequently pared down and then removed from GSA's website entirely, demonstrating the opacity of the process. As of early 2026, Senator Ernst's bill is pushing for property sales with exemptions from environmental and historic preservation reviews — accelerating but also complicating the disposition process.

This creates a fragmented but enormous market opportunity. For **commercial real estate investors**, these properties (often well-located, historically significant buildings) represent adaptive reuse opportunities — conversions to housing, hotels, mixed-use. For **local governments and economic development agencies**, federal building disposals reshape downtown office markets, tax base, and community character. For **nonprofits and community organizations**, certain GSA disposals can be made available for public benefit uses at below-market rates (per the McKinney-Vento Homeless Assistance Act). For **federal contractors**, the disposition of agency buildings reflects where agencies are consolidating — a signal for where to pursue work.

None of these audiences has a unified, analysis-ready intelligence platform tracking what's being disposed of, when, where, at what value, and with what reuse potential. GSA's disposal.gsa.gov is a raw listing, not an intelligence tool. FedPropertyWatch fills this gap.

## Target Audience / User

- **Primary:** Commercial real estate investors and developers evaluating adaptive reuse opportunities for federal building disposals — office-to-residential, hotel conversions, mixed-use redevelopment
- **Secondary:** Local government economic development agencies and city planners tracking federal building disposals in their jurisdiction and their impact on office vacancy, tax base, and workforce
- **Tertiary:** Nonprofits and social service organizations pursuing below-market McKinney-Vento acquisitions; federal contractors tracking agency consolidation as a BD signal; journalists and policy researchers covering the federal property story

**User persona:** "Marcus" — Principal at a DC-based real estate private equity firm specializing in adaptive reuse. He's been watching the federal building disposal story since early 2025. He knows there are opportunities but can't track them systematically: GSA's website lists some properties, news breaks about others, and the "non-core" lists appear and disappear. He needs a single feed of: what's coming to market, where it is, what agency is vacating, what the estimated valuation is, and what zoning/reuse conditions apply. He's currently spending 4 hours/week manually tracking GSA press releases and Federal Register notices.

## Vibe / Goals

- **Vibe:** Investment-grade, map-centric, intelligence-driven. Feels like CoStar or Reonomy for federal properties — authoritative data in a professional real estate analytics interface.
- **Core goals:**
  1. Aggregate all federal property disposal signals into a single, continuously-updated feed (GSA notices, Federal Register, Congressional testimony, news)
  2. Score each property for adaptive reuse potential based on location, building characteristics, zoning, and comparable transactions
  3. Surface community impact context (agency being vacated, workers displaced, local office market effect) for policy and BD users

## Aesthetic

- Map-centric with property detail panels — hybrid of CoStar and Redfin aesthetic
- Clean professional design; light mode; real estate data density
- Property cards with thumbnail images (street view), key metrics, and status badges
- Timeline view for understanding disposal pipeline and history
- Inspiration: CoStar's property analytics meets ProPublica's data journalism visual style

## UX Ideas

1. **Disposal pipeline map:** Interactive U.S. map showing all known federal properties in disposal pipeline; filterable by agency, size, status (listed/under evaluation/sold), location, and USE IT Act compliance trigger; click any property for full detail panel
2. **Property intelligence card:** For each property: address, GSA building number, owning agency, square footage, year built, historic status, current disposal stage, estimated value, any McKinney-Vento/public benefit screening requirement, and link to Federal Register notice
3. **Agency consolidation tracker:** For each federal agency, a view of their footprint change over time — buildings vacated, buildings retained, and where agency workers are being consolidated; useful for federal contractors as a BD signal
4. **Adaptive reuse score:** Algorithm-based scoring of reuse potential: zone type + surrounding uses + proximity to transit + building form factor + estimated conversion cost + comparable adaptive reuse comps in the market
5. **Community impact dashboard:** For each major disposal, shows: agency being vacated, approximate workers displaced, local office market context (vacancy rate trend for the submarket), and any community benefit proposals (housing, public benefit use)
6. **Alert system:** Get notified when new properties are listed in your target metros, when properties advance to new disposal stages, or when agency building vacations match your investment thesis

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **GSA disposal.gsa.gov** | Official listing source | Raw listings only; no analysis, scoring, pipeline tracking, or intelligence |
| **CoStar / LoopNet** | Comprehensive commercial RE database | Federal buildings listed inconsistently; no disposal pipeline or agency context |
| **Reonomy** | Property analytics and ownership data | General commercial RE; not specialized for federal disposals or reuse analysis |
| **Federal Register search** | Complete official disposal notices | Raw text; no aggregation, visualization, or intelligence layer |
| **Government Executive / Federal News Network** | News coverage of disposal story | Journalism, not investment intelligence; not comprehensive or database-driven |

**White space:** No platform aggregates federal building disposal signals into investment-grade intelligence with reuse scoring, community impact context, and agency consolidation signals — a gap that matters to real estate investors, local governments, and federal contractors simultaneously.

## Data That Might Be Needed

- **GSA disposal.gsa.gov listings:** Official GSA public portal; updated irregularly; requires monitoring and scraping
- **Federal Register notices:** GSA surplus property notices, public benefit screening notices (homeless assistance); FR API (regulations.gov)
- **Congressional testimony and reports:** Senate EPW and T&I committee hearings; GAO federal real property reports (free)
- **GSA building inventory (FRPP):** Federal Real Property Profile data; some published annually in summary form; full detail requires FOIA
- **FOIA-accessible property data:** GSA FRPP building records; OMB real property inventory; varying disclosure levels
- **Historic preservation status:** National Register of Historic Places database (NPS; free API); Section 106 review status for disposals
- **McKinney-Vento screening status:** HUD tracks public benefit screening for surplus federal property; partial public data
- **Zoning and parcel data:** Nationwide from Regrid or Parcl; county assessor databases (paid/free by jurisdiction)
- **Office market data:** CoStar API (paid; $10K+/year) or proxied from CBRE/JLL published reports (free, lagged)
- **Street view imagery:** Google Maps Static API or Mapbox; for property thumbnails
- **DOGE contract termination data:** Cross-referenced to identify agencies likely to reduce footprint

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js; Mapbox GL for property map; data-dense property cards and detail panels
- **Backend:** Python/FastAPI; scheduled scrapers for GSA, Federal Register, GAO; document processing
- **Database:** PostgreSQL + PostGIS (geospatial property queries); property lifecycle states tracked as events
- **Data pipeline:** Playwright/Scrapy for GSA disposal portal; Federal Register API for official notices; news monitoring for informal signals
- **Key integrations:** GSA disposal.gsa.gov, Federal Register API, NPS NRHP API, Regrid parcel data API, Google Maps Static API

### Key Technical Components
1. **GSA disposal monitor:** Scraper that checks disposal.gsa.gov and Federal Register daily for new property listings, stage changes, and public benefit screening notices; normalizes to internal property schema
2. **Property intelligence aggregator:** Matches GSA building IDs to parcel records, historic status, and market data; enriches each property record with reuse analysis inputs
3. **Adaptive reuse scorer:** Weighted model across 8 dimensions (transit proximity, zoning flexibility, building form, surrounding land uses, conversion cost estimate, comparable transactions, historic designation, market vacancy); produces 0-100 score with factor breakdown
4. **Agency footprint tracker:** Links property disposals to specific agencies; cross-references OPM headcount data and DOGE contract terminations for consolidation signal analysis
5. **Alert engine:** User-configured property alerts by metro, agency, building size, or reuse score threshold; daily email digest

### MVP Scope
- GSA disposal pipeline database (properties in active or accelerated disposal)
- Property map with filter by metro, agency, size, status
- Property detail card with all available public data
- Adaptive reuse score (simplified; 4 dimensions for v1)
- Weekly email digest of new listings in user-selected metros
- Free tier (map browse); paid tier (full data, alerts, reuse scoring)

### Growth Path
- FOIA pipeline for deeper GSA FRPP inventory data
- McKinney-Vento screening tracker with nonprofit self-service application guidance
- Federal contractor BD module: agency consolidation signals cross-referenced with contract award data
- Zoning change monitoring (when cities rezone federal surplus land for residential/mixed use)
- Investment comparables: track closed adaptive reuse transactions for federal properties
- Integrate with FedContractPulse for full federal footprint intelligence platform
