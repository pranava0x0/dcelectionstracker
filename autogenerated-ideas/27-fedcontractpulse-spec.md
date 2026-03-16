# FedContractPulse — Post-FPDS Federal Contract Intelligence Platform

> **Generated:** 2026-03-15 | **Sector:** Government Data / Federal Procurement

---

## Problem Statement

On February 24, 2026, the General Services Administration completed a years-long migration: FPDS.gov was decommissioned, and all federal contract award data search moved to SAM.gov. The legacy FPDS ezSearch tool — the primary interface used by thousands of government contractors, BD teams, and researchers for over two decades — is gone. The new SAM.gov interface requires an account and has significantly different search and export capabilities.

This migration coincides with the most turbulent period in federal contracting in decades. DOGE has terminated 2,334 contracts totaling $8 billion in claimed savings as of March 2026. Agencies that once had dozens of contracting officers now have skeleton staffs — HHS is down 20% in headcount, Treasury down 24%, IRS down 25%. Program managers who approved task orders are gone. CORs (Contracting Officer Representatives) who managed active contracts have accepted deferred resignation packages. The result: contracts are stalling, task orders aren't issuing, and the award pipeline is deeply uncertain.

Meanwhile, a September 2025 GAO report flagged significant data quality problems: only 51% of agencies completed procurement data quality certifications, meaning a substantial portion of SAM.gov contract data is unreliable or incomplete. The FY2026 NDAA raised the certified cost/pricing data disclosure threshold from $2.5M to $10M — reducing transparency on a significant slice of defense contracts.

For the ~500,000 registered government contractors trying to navigate this environment — figuring out which agencies are still actively procuring, which contract vehicles are healthy, which competitors are winning, and where DOGE has created both opportunities (new efficiency contracts) and dead zones (gutted agencies) — there is no affordable, analysis-ready intelligence tool. GovWin and Bloomberg Government exist but cost $10K-$50K/year. FedContractPulse brings contract intelligence to the mid-market.

## Target Audience / User

- **Primary:** Business development directors and capture managers at small-to-mid federal contractors ($5M–$200M revenue range) tracking the shifting federal procurement landscape
- **Secondary:** Consulting firms, lobbyists, and policy advisors tracking which agencies are spending on what; researchers and journalists using procurement data for investigative analysis
- **Tertiary:** Small businesses new to federal contracting who need to understand market structure and entry points; subcontractor BD teams tracking prime award patterns

**User persona:** "James" — VP of Business Development at a 150-person federal IT services firm. His firm has 6 active BPA task orders across DOE and HHS. HHS is down 20% in headcount — three of his COR contacts have left. He wants to know: Which HHS programs are still active? Which contract vehicles are seeing new task orders? Are competitors winning work in the agencies where he's losing momentum? Who in DHS (growing) is issuing IT contracts? He currently cobbles this together from SAM.gov, beta.SAM.gov, and LinkedIn — spending 3 hours/day on manual research.

## Vibe / Goals

- **Vibe:** Intelligence-grade, BD-focused, action-oriented. Feels like a Bloomberg Government for the mid-market — powerful analysis without the enterprise price tag.
- **Core goals:**
  1. Surface where federal dollars are flowing (and not flowing) in near-real-time, with DOGE-era context
  2. Enable competitive intelligence: who's winning what, on which vehicles, at which agencies
  3. Help BD teams identify the healthiest contract vehicles and agencies for new pursuit

## Aesthetic

- Clean, professional — feels like a modern SaaS analytics dashboard
- Light mode default with good data density (not just cards — tables and charts)
- Agency-centric navigation (filter by NAICS, agency, vehicle, contractor)
- Timeline visualizations for award patterns and spending trends
- Inspiration: Bloomberg Government's award search meets Crunchbase's company intelligence format

## UX Ideas

1. **Agency health scorecard:** Each federal agency gets a real-time "procurement health" score based on award volume vs. historical baseline, headcount changes (from FedStaff data integration), and DOGE contract terminations — green/yellow/red at a glance
2. **Award feed:** Live stream of contract awards from SAM.gov, categorized by NAICS, agency, vehicle, and dollar value — with DOGE termination flags and competitor identification
3. **Competitor tracker:** Input a competitor's DUNS/UEI → see their recent awards, vehicles, agencies, and win patterns; get alerts on new awards
4. **Vehicle intelligence:** For any GWAC/IDIQ (SEWP V, OASIS+, CIO-SP4, etc.) — see current utilization rates, top awardees, agency draw-down patterns, and task order velocity
5. **BD pipeline builder:** Save agencies and vehicles of interest → FedContractPulse surfaces expiring contracts, recompete opportunities, and new solicitations matching your profile
6. **Data quality flagging:** Surfaces contracts where SAM.gov data quality is suspect (per GAO criteria), so BD teams don't build strategies on incomplete data

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **GovWin IQ (Deltek)** | Comprehensive opportunity pipeline, BD CRM | $15K–$40K/year; primarily large contractors; no DOGE-era context |
| **Bloomberg Government** | Best-in-class data journalism + awards | $25K+/year; enterprise only; no BD workflow integration |
| **USAspending.gov** | Free, authoritative spending data | Raw data; no analysis, alerts, competitive intelligence, or BD workflow |
| **SAM.gov** | Authoritative source (post-FPDS) | Search/export UX is poor; no analytics layer; no competitive intelligence |
| **Federal Compass** | GovCon market intelligence | Smaller player; less breadth; limited NAICS/vehicle analysis |

**White space:** No tool combines post-FPDS contract data with DOGE-era agency health scoring, competitive intelligence, and BD workflow at a price point accessible to mid-market contractors ($500–$2K/month).

## Data That Might Be Needed

- **SAM.gov Contract Awards API:** GSA's official replacement for FPDS ATOM feed; free with SAM.gov account; includes all federal awards above micro-purchase threshold
- **USAspending.gov API:** Free; provides award, subaward, and spending data with agency/program breakdown; higher-level aggregate than SAM.gov
- **FPDS historical archive:** Pre-February 2026 data; available via USAspending.gov bulk download
- **OPM headcount data:** Monthly federal employment by agency (2-month lag); FedStaff integration or direct OPM EHRI data
- **DOGE contract termination list:** DOGE.gov public data (with reliability caveats); cross-referenced with SAM.gov modifications
- **BETA.SAM.gov solicitations:** Active solicitations and pre-solicitations; feeds into opportunity pipeline feature
- **SEC/D&B DUNS to UEI mapping:** To enable competitor tracking; Dun & Bradstreet or SAM.gov entity data
- **Contract vehicle capacity data:** GWAC ceiling utilization from GSA and agency reports (partially public)
- **GAO bid protest database:** Track win/loss patterns for competitors; public at gao.gov/legal/bid-protests
- **News/press releases:** Agency procurement news for context (Govconwire, Federal News Network)

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js / React with recharts or D3 for visualizations; server-side rendering for SEO and fast initial loads
- **Backend:** Python/FastAPI; background jobs for daily SAM.gov API sync
- **Database:** PostgreSQL for entity/award data; Elasticsearch for full-text search of contract descriptions/titles
- **Data pipeline:** Daily batch pulls from SAM.gov Awards API + USAspending.gov; differential updates to minimize API quota usage
- **Authentication:** Clerk or Auth0; role-based access for team/org sharing of saved searches and pipelines

### Key Technical Components
1. **SAM.gov sync engine:** Daily incremental pull of new awards, modifications, and terminations via Contract Awards API; normalize to internal schema with DOGE-flag enrichment
2. **Agency health scorer:** Weighted model combining award volume delta (vs. 12-month average), OPM headcount change, DOGE termination count at the agency — produces 0-100 score
3. **Competitor intelligence module:** Entity resolution (UEI-based) to track award history, vehicle presence, and recent win patterns for any registered SAM.gov vendor
4. **Alert engine:** User-configured alerts on NAICS codes, agencies, vehicles, or specific competitors; email/Slack digest
5. **BD pipeline:** Kanban-style board for tracking opportunities from identification through proposal submission; links to USAspending/SAM.gov source records

### MVP Scope
- SAM.gov award feed with agency/NAICS/vehicle filters
- Agency health scorecard (5 key agencies to start; expandable)
- Basic competitor lookup (award history for any UEI)
- DOGE termination overlay on award data
- Simple alert system (email when new award in saved NAICS/agency combo)
- Free tier with limited lookups; paid tier with full data + alerts

### Growth Path
- Add BD pipeline CRM with task tracking, deadline reminders, and team collaboration
- Integrate beta.SAM.gov solicitations for opportunity pipeline (pre-award)
- Build vehicle-level utilization dashboards (SEWP V, OASIS+, CIO-SP4, STARS III)
- Add teaming partner discovery (find primes/subs winning in your target agencies)
- Government-wide trend analysis: sector spending shifts over time
- API product for BD software integrations (Salesforce GovCon, ProphetCRM)
