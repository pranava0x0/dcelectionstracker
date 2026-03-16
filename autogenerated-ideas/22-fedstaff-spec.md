# FedStaff — Federal Workforce Intelligence Dashboard

> **Generated:** 2026-03-11 | **Sector:** Government Data / Federal Workforce
> **Last refreshed:** 2026-03-15 | **Reason:** Brookings Institution published landmark regional analysis (March 12) showing 96% of DC-area job losses in 2025 came from federal layoffs; federal employment in DMV at lowest point since late 2001; VA unemployment rose to 3.5%, DC to 6.5%, MD to 4.2%; private sector also declined 0.28% YoY in DMV vs. +0.3% nationally

---

## Problem Statement

The U.S. federal civilian workforce has undergone what has been described as "the largest reduction in federal workforce in history." OPM data shows the workforce is down 12% since September 2024, with 270,000+ workers having exited federal employment in 2025. These reductions have not been uniform: Treasury is down 24%, HHS down 20%, IRS down 25% (with an IRS watchdog predicting $500+ billion in lost tax revenue as a direct consequence). The Department of Energy lost ~2,000 staff, including critical nuclear security roles. USAID, the Department of Education, and the National Foundation on Arts and Humanities lost outsized proportions of their staff. By contrast, DHS grew — immigration enforcement was specifically protected and expanded.

The transparency problem is severe: there is no single, regularly-updated, public tool that shows the real-time state of the federal workforce by agency, occupation type, and geography. OPM publishes employment data with a 1-2 month lag and in formats requiring expert analysis. The situation is made more complex by:

- **Legal reversals:** Courts have ordered rehires in specific cases (Judge Illston blocked a wave of 4,100 RIFs; other judges ordered reinstatement of specific employee groups). Some "fired" employees are technically still employed.
- **Multiple exit pathways:** Deferred resignations (~75,000 workers accepted buyouts), involuntary RIFs, probationary employee firings (later partially contested), attrition, and retirements — each with different legal and operational implications.
- **Contractor ripple effects:** Federal contractors that depended on agency staff as program managers, contracting officers, and technical reviewers are seeing their government-side counterparts disappear — causing project delays and contract terminations even without direct cuts.

**Brookings regional confirmation (March 12, 2026):** A landmark Brookings Institution analysis published March 12 found that roughly **96% of all job losses** in the DC region last year came from federal layoffs — 54,000 federal workers out of 56,000 total job losses. The D.C. metro's year-over-year job losses are "unprecedented for the nation's capital over the past 35 years." Federal employment in the region has fallen to **327,100** — the lowest since late 2001. Regional unemployment: DC at 6.5% (up from 5.3%), Virginia at 3.5% (up from 2.9%), Maryland at 4.2% (up from 3.1%). Private sector employment also declined 0.28% YoY vs. +0.3% nationally — showing federal workforce cuts are dragging down the private sector too.

Journalists, policy researchers, federal contractors, advocacy groups, and the workers themselves need a single, accurate, continuously updated source of truth for federal workforce changes — something that tells Rachel the reporter, James the federal contractor BD manager, and Ana the advocacy group director what's actually happening across government.

## Target Audience / User

- **Primary:** Journalists and investigative reporters covering the federal workforce story (the Boston Globe, Reuters, and NPR have all run major analyses; dozens of regional outlets covering local federal impacts)
- **Secondary:** Federal contractors and government services firms tracking which agencies have capacity to run programs, award contracts, and approve requests; policy researchers at think tanks
- **Tertiary:** Federal employees and job-seekers tracking which agencies are growing vs. shrinking; advocacy organizations tracking vulnerable program areas; congressional staff

**User persona:** "Daniel" — Business Development Director at a mid-sized federal IT contractor. His firm has 8 active contracts across DOE, USDA, and HHS. He's watched his government counterparts get fired, put on admin leave, or accept deferred resignation packages. He doesn't know which contracts are at risk because the contracting officer is gone, which agencies still have staff to run new procurement actions, or which agencies are growing (DHS) and might have new opportunities. He has no single tool to track this — he's piecing it together from news, LinkedIn, and conversations.

## Vibe / Goals

- **Vibe:** Nonpartisan, data-rigorous, investigative-grade. Feels like a Bloomberg Government for workforce data — objective, precise, sourced.
- **Core goals:**
  1. Provide a continuously updated, agency-by-agency federal workforce dashboard showing headcount trends, net change, and breakdown by exit type
  2. Track legal challenge outcomes that are reversing firings — show what the "effective headcount" is vs. the "nominally fired" count
  3. Identify which agencies have contractor-relevant capacity (contracting officers, program managers) still in place vs. hollowed out

## Aesthetic

- Clean, editorial/data journalism aesthetic — ProPublica or FiveThirtyEight quality data presentation
- Light background with rich bar charts, area charts, and dot plots for agency comparisons
- Agency comparison table as the hero element (sortable by cuts %, cuts #, legal challenges pending)
- Color palette: teal for current (post-cut) headcount; gray for pre-DOGE baseline; orange for "legally contested" category
- U.S. map for geographic distribution of federal workers (by duty station, not just agency HQ)
- Embeddable charts for journalists
- Inspiration: Bloomberg Government's data tables meet The Guardian's data journalism visual style

## UX Ideas

1. **Agency dashboard:** Sortable table of all major federal agencies with: pre-DOGE headcount (Sept 2024 baseline), current estimated headcount, % change, breakdown by exit type (deferred resignation / RIF / probationary / attrition), and legal challenge status
2. **Timeline view:** Agency-specific timelines showing each major workforce action (EO issued → deferred resignations → probationary firings → court stays → RIF waves) with headcount curve overlaid
3. **Legal challenge tracker:** For each major court case affecting workforce, show: case name, judge, relief sought, current status, and estimated employee population affected. When a stay or reinstatement order is issued, it updates the effective headcount estimate.
4. **Geographic impact map:** Federal workers by state and county (using OPM duty-station data), showing which communities have the highest concentration of affected federal employees — useful for understanding local economic impact
5. **Occupation breakdown:** Filter by federal job series (GS-0343 Management Analyst; GS-0301 Miscellaneous Admin; GS-1811 Criminal Investigator) to see which occupations have been cut most heavily
6. **Contractor capacity signal:** For agencies with significant procurement activity, show estimated contracting officer and program manager headcount remaining — a proxy for agency capacity to run new contracts (using FPDS contracting action data as a demand signal)

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **OPM FedScope** | Official, authoritative workforce data | 1-2 month lag; complex interface; no DOGE-specific tracking; no legal challenge status |
| **Partnership for Public Service** | Excellent analysis and reports | Reports, not real-time data; not a continuous tracking platform |
| **Boston Globe analysis** | Excellent one-time investigation | Newspaper article; not a living database; not actionable for contractors |
| **Newsweek DOGE layoff tracker** | News-based agency tracking | Lists of events, not structured data analysis |
| **Bloomberg Government** | Strong federal contracting data | $5,000+/yr; contracting focus, not workforce analytics |

**White space:** No tool combines continuously-updated OPM workforce data, legal challenge outcomes, contractor-relevant capacity signals, and geographic impact mapping in a single accessible platform.

## Data That Might Be Needed

- **OPM FedScope data:** Monthly federal employment by agency, grade, occupation series, and duty station (publishes with 1-2 month lag; free download)
- **OPM data.gov datasets:** Historical employment data for pre-DOGE baseline; FEVS (Federal Employee Viewpoint Survey) for workforce health signals
- **Court dockets:** PACER for workforce-related cases; Courtlistener (free alternative) for public dockets; ACLU case tracker for DOGE-related suits
- **Congressional testimony:** OMB, OPM, and agency inspector general testimony on workforce cuts (CRS reports, hearing transcripts)
- **News monitoring:** Reuters, AP, Washington Post, NPR federal workforce coverage for RIF announcements, court orders, and agency-specific developments
- **FPDS-NG:** Federal Procurement Data System for contracting action volume by agency (proxy for procurement capacity)
- **USAjobs.gov:** Federal job posting volume by agency (growing agencies post; shrinking agencies don't)
- **BLS QCEW data:** Quarterly Census of Employment and Wages for federal employment by county (tracks economic impact in federal-worker-heavy communities)
- **Inspector General reports:** Agency OIGs flagging workforce-related operational risks

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with Recharts for time-series visualization; Mapbox for geographic worker distribution map
- **Backend:** Python/FastAPI; data reconciliation engine combining OPM data with news-sourced events
- **Database:** PostgreSQL for structured workforce data; Elasticsearch for full-text search of legal documents and news
- **Data pipeline:** Monthly OPM FedScope downloads (auto-processed); daily news monitoring for workforce events; weekly court docket checks

### Key Technical Components
1. **Workforce Baseline + Trend Engine:** Maintains pre-DOGE (Sept 2024) baseline by agency/occupation/geography; ingests monthly OPM updates; computes net change, rate of change, and projections
2. **Legal Challenge Database:** Structured tracking of workforce-related court cases with case metadata, affected employee populations, and status that updates the "effective headcount" calculation when stays/reinstatements are ordered
3. **Exit Type Classifier:** Labels each workforce reduction event by type (deferred resignation / probationary RIF / involuntary RIF / voluntary attrition) using a combination of official announcements and news event tagging
4. **Contractor Capacity Signal:** Correlates FPDS contracting action volume with workforce headcount by agency; flags agencies where CO/PM headcount has dropped below a threshold likely to impair contracting capacity
5. **Embed System:** Generates shareable/embeddable chart widgets for journalists, automatically updating as new OPM data becomes available

### MVP Scope
- 25 largest agencies with headcount trend charts (Sept 2024 → present)
- 5 major legal cases tracked with status and affected population estimates
- National geographic map of federal workers by state
- Simple occupation breakdown for top 10 job series
- Weekly data cadence; email digest for major changes

### Growth Path
- All federal agencies and sub-agencies
- Real-time legal challenge status with push notifications
- Contractor capacity signal dashboard (targeted to GovCon BD teams)
- County-level geographic impact map with economic impact estimates (wage spending)
- API for researchers and policy organizations
- Embeddable agency-specific widgets for media outlets
- Historical archive for longitudinal research on federal workforce trends
