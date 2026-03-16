# DMV Fed Footprint — DC/VA/MD Regional Federal Economic Intelligence

> **Generated:** 2026-03-11 | **Sector:** Government Data / DMV Regional
> **Last refreshed:** 2026-03-15 | **Reason:** BLS data confirms 72,000 federal job losses in DC region (DC -24K, MD -24.9K, VA -23.5K); Brookings March 12 report shows 96% of all DMV job losses are federal — "unprecedented in 35 years"; federal employment at lowest since late 2001; private sector declining 0.28% YoY; DC unemployment at 6.5%, MD 4.2%, VA 3.5%

---

## Problem Statement

The DC/Virginia/Maryland metropolitan area is one of the most federally-dependent regional economies in the world — and that dependency is undergoing the most disruptive restructuring in generations. The DMV has 270,000+ tech industry jobs, with federal contracting, defense technology, and data infrastructure as primary economic pillars. Northern Virginia alone is the global capital of data centers, hosting more than 70% of the world's internet traffic through its Ashburn corridor.

Three converging forces are reshaping the region's economy simultaneously:

**1. Federal workforce collapse — now quantified by BLS and Brookings:** The latest BLS data confirms the DMV region shed approximately **72,000 federal government jobs** — DC lost roughly 24,000 positions, Maryland 24,900, and Virginia 23,500. Federal employment in the region has fallen to **327,100** — the lowest since late 2001 (November 2025 figure). A landmark Brookings Institution analysis published March 12, 2026 found that **96% of all job losses** in the DC region last year were federal layoffs. This is "unprecedented for the nation's capital over the past 35 years." The private sector is now also declining: DMV private sector jobs fell 0.28% YoY vs. +0.3% nationally, confirming the federal economic shock is bleeding into the broader regional economy. Regional unemployment: DC at 6.5% (up from 5.3%), Maryland at 4.2% (up from 3.1%), Virginia at 3.5% (up from 2.9%). Treasury (-24%), HHS (-20%), and other major DMV-footprint agencies are understaffed, causing contracts to stall, task orders to halt, and invoices to go unpaid.

**2. Northern Virginia data center boom:** NoVA's data center buildout is accelerating faster than the grid can support. AI demand is driving unprecedented power requirements, and Dominion Energy is managing a complex queue of interconnection requests from data center developers. The DMV's tech ecosystem — Virginia Tech's new $1 billion Alexandria campus launching an advanced computing program, the Northern Virginia Tech Council, 16,000+ tech job postings in October 2024 alone — is booming even as the federal sector contracts.

**3. Regional data and workforce initiative:** DC, Virginia, and Maryland launched a groundbreaking tri-jurisdictional data initiative linking education and workforce outcomes (2025-2026 Phase 1). Maryland's Digital Government Summit 2026 is focused on AI, data governance, and digital service delivery. Virginia's Digital Equity Plan is submitted to NTIA. The region is building data infrastructure at the same time its federal data infrastructure is being dismantled.

There is no single intelligence platform that synthesizes these three forces for the DMV's business community, policymakers, economic developers, and employers — helping them understand which sectors are growing, which are contracting, and how to navigate the most volatile regional economic environment the area has seen in decades.

## Target Audience / User

- **Primary:** Government contractors and professional services firms in the DMV tracking federal contract opportunities, agency health, and business development strategy amid workforce cuts
- **Secondary:** Economic development officials in DC, Virginia, and Maryland (DC OCIO, VEDP, DHCD) tracking regional economic shifts; commercial real estate investors monitoring federal office demand vs. data center expansion
- **Tertiary:** Tech companies deciding where to expand in the DMV; journalists covering the regional economy; local elected officials understanding constituent impacts

**User persona:** "Michelle" — Partner at a DC-based management consulting firm specializing in federal health IT. Her firm has 12 contracts at HHS and CMS. With HHS down 20% in headcount, three of her contracts have had CORs (Contracting Officer Representatives) leave. She doesn't know which agencies are recovering, which are growing, which GS-15s still have contracting authority, or which new opportunities (maybe in DHS, which is growing?) she should be pursuing. She wants a single source of regional federal economic intelligence.

## Vibe / Goals

- **Vibe:** Regional, authoritative, actionable. Feels like a Bloomberg for the DMV economy — sophisticated, data-driven, locally relevant.
- **Core goals:**
  1. Track federal contract flows and agency procurement capacity in the DMV — where is money flowing and where is it stalled?
  2. Monitor the NoVA data center buildout — power demand, interconnection queue, new projects, employment growth
  3. Aggregate federal workforce changes in the region with local economic impact (employment, commercial real estate, retail)

## Aesthetic

- Professional editorial design with strong regional identity (DMV color palette: DC red, Virginia navy, Maryland gold)
- Dashboard-first with key regional metrics in a top row (federal contract volume, data center MW online, federal worker count, regional unemployment)
- Map-centric for geographic distribution (which counties are most exposed to federal cuts vs. data center growth)
- Embeddable charts for local news outlets covering the regional economy
- Clean tables for GovCon BD teams doing agency research
- Inspiration: Greater Washington Partnership's regional data reports, made interactive and updated continuously

## UX Ideas

1. **Regional economic dashboard:** Top-level view of 5 key metrics: (1) DMV federal contract obligations YTD vs. prior year, (2) NoVA data center capacity online/under construction (MW), (3) Federal worker headcount in region (duty-station data from OPM), (4) Regional tech job postings (from major job boards), (5) Commercial real estate vacancy rates near major federal agency campuses
2. **Agency procurement health tracker:** For the 15 largest federal agencies with DMV footprints — show current contracting officer and program manager headcount (derived from OPM + FPDS signals), active contract vehicle utilization, and trend direction. "Traffic light" status: green (operating normally), yellow (below-capacity), red (severely impaired)
3. **NoVA data center buildout map:** Interactive map of Northern Virginia data centers (operational and under construction), with capacity in MW, developer, announced power source (grid / renewable PPA / nuclear), estimated online date, and Dominion Energy interconnection queue position
4. **Federal contract flow analyzer:** FPDS-derived dashboard showing contract obligation volume by agency and contractor for the DMV region, with quarter-over-quarter trends. Filter by NAICS code, contract type, or agency.
5. **Workforce transition signals:** Track where displaced federal workers are going (LinkedIn data, USAJobs posting spikes in certain sectors) and what DMV employers are absorbing federal talent (defense contractors, cyber firms, consulting firms)
6. **Tri-state initiative tracker:** Monitor DC, Virginia, and Maryland government tech initiatives — the regional workforce data initiative, Maryland Digital Government Summit outcomes, Virginia Digital Equity Plan NTIA submissions, DC OCIO projects

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **Greater Washington Partnership** | Regional economic reports | Periodic reports; not a living data platform |
| **Bloomberg Government** | Federal contracting data | National focus; not DMV-specific; expensive ($5K+) |
| **FPDS.gov** | Raw federal contracting data | Extremely complex to use; no regional synthesis or visualization |
| **CoStar** | Commercial real estate data | CRE focused; no federal workforce or data center integration |
| **Washington Business Journal** | DMV business coverage | News, not data; no structured analytics |

**White space:** No platform synthesizes federal contract flows, federal workforce health, data center buildout, and regional economic signals specifically for the DMV's unique federal-dependent economy amid unprecedented restructuring.

## Data That Might Be Needed

- **FPDS-NG:** Federal Procurement Data System for contract obligations by agency, vendor, and place of performance (filtered to DMV counties)
- **OPM FedScope:** Federal employee duty-station data for DC, VA, MD counties
- **USAJOBS.gov:** Job posting volume by agency and location (proxy for agency capacity and growth)
- **Dominion Energy / Dominion Virginia Power:** Public filings on interconnection queue and data center load growth; Virginia State Corporation Commission rate cases
- **Virginia DHCD / VEDP data:** Virginia Economic Development Partnership project announcements; major employer data
- **DC OCIO / Mayor's office:** DC technology and economic development announcements
- **Maryland Department of Commerce:** Major employer announcements and economic development data
- **Ashburn/NoVA data center news:** Data Center Dynamics, Structure Research, CBRE data center market reports for NoVA capacity data
- **CoStar/CBRE commercial real estate:** Office vacancy rates near major federal campuses (Pentagon City, Rosslyn, Bethesda, Suitland)
- **BLS QCEW:** Quarterly employment by industry and county for DMV jurisdictions
- **LinkedIn data partnerships:** Workforce transition patterns (available via LinkedIn Economic Graph research program)
- **Regional news monitoring:** Washington Post, Washington Business Journal, Virginia Business, Maryland Reporter for major announcements

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with Mapbox GL JS for the DMV-focused map; Recharts for time-series dashboards
- **Backend:** Python/FastAPI; geographic filtering layer for DMV-specific FPDS/OPM data pulls
- **Database:** PostgreSQL with PostGIS for spatial queries; separate schema for regional economic indicators
- **Data pipeline:** Quarterly FPDS-NG bulk downloads (filtered to DMV place of performance); monthly OPM duty-station updates; weekly news monitoring for data center and economic announcements

### Key Technical Components
1. **DMV Federal Contract Engine:** Pulls FPDS data for contracts with place-of-performance in DC/VA/MD; aggregates by agency, vendor, NAICS code, and quarter; computes YoY trends and flags anomalies (sharp drops = capacity signal)
2. **Agency Procurement Health Model:** Combines OPM headcount data (COs and program managers specifically, using occupation series) with FPDS contracting action volume; flags agencies where headcount-to-action ratios have degraded
3. **NoVA Data Center Registry:** Manually curated + news-monitored database of data center projects with spatial coordinates, capacity, developer, power status, and Dominion queue position
4. **Regional Economic Aggregator:** Pulls BLS, DHCD, and other economic indicators for DMV jurisdictions; maintains a regional "economic health index" combining federal and private sector signals
5. **Workforce Transition Tracker:** Monitors USAJOBS postings by agency and location; tracks LinkedIn data (via partnership) or proxy indicators for where federal talent is flowing in the DMV

### MVP Scope
- 15 major DMV agencies with procurement health traffic lights
- NoVA data center map with 30 major facilities
- FPDS contract flow dashboard for DMV (top 50 contractors by agency)
- Federal worker duty-station map for DC/VA/MD
- Weekly email digest for GovCon BD teams
- Free public tier; paid tier for agency-specific analytics

### Growth Path
- Real-time FPDS data (upgrade to FPDS API vs. bulk downloads)
- Agency-specific BD intelligence reports (monthly, automated)
- NoVA data center availability alerts (new projects announced, power status changes)
- Workforce transition analytics (where federal workers are landing, which DMV employers are absorbing them)
- Commercial real estate integration (office vacancy near federal campuses)
- API for regional economic development organizations and research institutions
