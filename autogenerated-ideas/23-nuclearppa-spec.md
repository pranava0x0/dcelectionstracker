# NuclearPPA — Nuclear Power Procurement Intelligence for Data Centers

> **Generated:** 2026-03-11 | **Sector:** Energy / Nuclear / Data Centers

---

## Problem Statement

The AI energy crisis has triggered an unprecedented corporate nuclear power rush. FERC projects U.S. data center electricity demand will reach 35 GW by 2030 (up from 19 GW in 2023), and tech companies are committing over $1 trillion in energy-related capital in 2025-2026 alone. The grid cannot absorb this demand fast enough — so hyperscalers are going directly to nuclear generators.

The deal flow is staggering and accelerating: Microsoft signed a 20-year deal with Constellation Energy to restart Three Mile Island; Meta locked up a 20-year, 1.1 GW deal with Constellation; Amazon contracted 960 MW from Talen Energy's Susquehanna nuclear plant; Google and Kairos Power (in partnership with TVA) have a pathway to 500 MW of SMR output by 2035; Equinix signed for 500 MW from Oklo's Aurora Powerhouses. BloombergNEF expects 15 reactors to come online in 2026 alone, adding ~12 GW of capacity.

Simultaneously, the small modular reactor (SMR) pipeline is expanding rapidly: Amazon/Energy Northwest are developing 4 SMRs (320 MW initial), Amazon/Dominion are exploring a 300 MW Virginia SMR site, China's Linglong One (the world's first commercial onshore SMR) is entering service in early 2026, and NRC licensing reform (triggered by 4 Trump EOs) aims to create a faster pathway for factory-built modular reactors.

The problem is that this market is opaque and fast-moving. Corporate energy buyers — beyond the handful of hyperscalers — don't know what nuclear PPA opportunities exist, what deals have been signed, what the SMR pipeline timeline looks like, or how to evaluate nuclear power as part of their procurement strategy. Utilities and nuclear plant operators don't have a structured way to reach corporate buyers. And investors tracking the nuclear renaissance have no aggregated deal flow database.

There is no comprehensive, deal-level intelligence platform tracking the corporate nuclear PPA market.

## Target Audience / User

- **Primary:** Corporate energy procurement directors and sustainability officers at large companies (beyond Big Tech) looking for firm, 24/7 carbon-free power — data center operators, industrial manufacturers, large commercial tenants
- **Secondary:** Energy investors and analysts tracking nuclear's role in the AI power landscape; nuclear plant operators seeking corporate off-take deals; SMR developers seeking anchor customers
- **Tertiary:** Utilities and IPPs modeling their nuclear generation value in the evolving PPA market; policy analysts tracking nuclear's competitiveness

**User persona:** "Kevin" — Head of Energy at a colocation data center operator with 500 MW of capacity across 12 sites. He has RE100 commitments and is under pressure from corporate clients to deliver clean power. Renewables alone won't get him to 24/7 carbon-free power at the scale he needs. He's hearing that nuclear PPAs are possible but has no way to understand what's available, how pricing works, or which SMR projects are realistic vs. speculative. He needs an intelligence platform, not a Google search.

## Vibe / Goals

- **Vibe:** Investment-grade, market-making. Feels like Preqin or PitchBook for nuclear energy deals — comprehensive deal database meets market intelligence.
- **Core goals:**
  1. Provide the first comprehensive, continuously-updated database of corporate nuclear PPA deals (announced and estimated terms)
  2. Track the SMR project pipeline with realistic timeline assessments and NRC licensing status
  3. Help corporate energy buyers understand the nuclear procurement landscape and identify potential deal opportunities

## Aesthetic

- Professional, finance-adjacent aesthetic — clean dark navy with gold/yellow accents (reliability, premium)
- Deal database as the core product: sortable table with buyer, seller, capacity (MW), term (years), price ($/MWh where disclosed), technology type (existing plant / restart / SMR), and status
- SMR project map as the secondary hero — geographic map of all active SMR projects with NRC status overlaid
- Dense but readable data tables; minimal decoration
- Desktop-first; PDF export for deal memos and investment committee packages
- Inspiration: Bloomberg Energy Finance deal tracker meets NRC's reactor status map

## UX Ideas

1. **PPA deal database:** Sortable, filterable table of all announced corporate nuclear PPAs — buyer, seller/plant, capacity (MW), term length, price ($/MWh where disclosed), region, technology type (existing / restart / SMR), and deal status (announced / executed / in-service). Click any deal for full detail panel with transaction timeline and news sourcing.
2. **SMR pipeline tracker:** World map of all active SMR projects with developer name, technology type (Kairos Fluoride Salt Reactor, Oklo Aurora, NuScale VOYGR, etc.), capacity (MW), NRC license stage, expected commercial date, and anchor customer (if known). Color-coded by development stage (concept / NRC application / construction / operational).
3. **NRC regulatory monitor:** Track NRC licensing dockets for SMR applicants — application submitted, review stage, hearing schedule, license issuance, construction permit, operating license. Plain-English status summaries with estimated timelines.
4. **Market pricing tracker:** Where PPA pricing is disclosed or estimated, track price trends for nuclear power contracts over time. Show comparison to spot electricity prices and renewable PPA benchmarks.
5. **Opportunity finder:** Corporate buyers input parameters (region, capacity MW, preferred technology, term length, delivery timeline needed) → see which plants or SMR projects could plausibly match. Introduces buyers to sellers through the platform.
6. **Executive order impact tracker:** Track Trump's 4 nuclear EOs and their implementation status — which licensing reforms are in effect, what NRC rule changes are proposed, how they affect SMR timelines.

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **Bloomberg NEF** | Best nuclear market analytics | $25K+/yr; broad; no deal-level database or buyer-seller matching |
| **Wood Mackenzie** | Comprehensive energy market data | Expensive; focused on generation economics, not corporate procurement |
| **NRC ADAMS** | Official nuclear licensing documents | Raw regulatory docs; no synthesis, deal tracking, or market context |
| **NEI (Nuclear Energy Institute)** | Industry advocacy and data | Trade association reports; not a deal database or buyer intelligence tool |
| **S&P Global (SNL Energy)** | Power plant and PPA data | Broad market focus; limited nuclear PPA specificity; very expensive |

**White space:** No platform aggregates corporate nuclear PPA deals, SMR project timelines, and NRC licensing status into a single buyer-oriented intelligence product accessible below the $25K Bloomberg NEF threshold.

## Data That Might Be Needed

- **NRC licensing data:** NRC ADAMS (Agencywide Documents Access and Management System) — free, full text of all NRC filings; NRC reactor status weekly report
- **Press releases and news:** SEC filings (8-K for material contracts), company press releases, and trade media (Power Magazine, Nuclear Engineering International, Utility Dive) for PPA announcement data
- **EIA plant data:** EIA Form 860 for nuclear plant capacity, operational status, and ownership
- **PPA price data:** Where disclosed in utility rate cases, state PUC filings, or SEC filings; Energy Information Administration survey data; industry reports from NEI
- **SMR developer data:** Company websites, investor presentations, DOE loan guarantee applications, and NRC pre-application engagement records
- **DOE data:** Loan Programs Office database for nuclear project support; Advanced Reactor Demonstration Program (ARDP) grants
- **FERC data:** FERC Form 1 for utility nuclear capacity; FERC interconnection requests for new nuclear projects
- **Carbon market data:** Voluntary carbon market pricing and clean energy certificate (CEC) prices for comparison with nuclear PPA economics
- **Trump EO tracking:** Federal Register for nuclear-related executive orders and implementing rulemakings

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js; data-dense deal table with MapboxGL for SMR pipeline map
- **Backend:** Python/FastAPI; deal ingestion pipeline with NLP entity extraction from press releases and SEC filings
- **Database:** PostgreSQL for deal and project data; Elasticsearch for full-text search of NRC and regulatory documents
- **Data pipeline:** Daily news monitoring + SEC EDGAR filings scraping; weekly NRC licensing status pulls; quarterly EIA data updates

### Key Technical Components
1. **Deal Ingestion Engine:** NLP pipeline that extracts buyer, seller, capacity, term, and price from press releases and SEC filings; human editorial review for verification; structured deal database
2. **SMR Pipeline Database:** Structured project records with developer, technology, capacity, location, NRC status, timeline, and customer — maintained with automated NRC ADAMS monitoring for licensing milestones
3. **NRC Regulatory Intelligence:** Parses NRC ADAMS for relevant dockets (SMR license applications, design certifications, COL applications); auto-generates plain-English status summaries
4. **Opportunity Matching Engine:** Rule-based matching of buyer parameters (region, MW, timeline, technology preference) against available plant capacity and SMR project availability windows
5. **Market Pricing Index:** Aggregates disclosed PPA prices from public sources; maintains reference price series by technology and region with confidence intervals based on disclosure completeness

### MVP Scope
- 25 announced corporate nuclear PPAs with full deal details
- 15 SMR projects tracked with NRC status and timeline
- Basic filtering by region, technology, and deal size
- NRC licensing status for top 5 advanced reactor applicants
- Weekly email digest of new deal announcements and regulatory milestones
- Free tier with summary data; paid tier for full deal database access

### Growth Path
- Automated NLP deal extraction from SEC filings and press releases (reducing manual curation)
- Buyer-seller introduction service (premium tier)
- Financial modeling module: NPV comparison of nuclear PPA vs. renewable + storage vs. self-generation at user's specific locations
- SMR technology comparison matrix (cost, timeline, risk, regulatory status by developer)
- International coverage: Canadian SMR projects, UK, France, Japan
- API for energy consultants and financial advisors integrating nuclear data into client reports
