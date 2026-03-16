# OMBLens — Federal Budget Apportionments Transparency Rebuilder

> **Generated:** 2026-03-11 | **Sector:** Government Data / Budget Transparency

---

## Problem Statement

In March 2026, Russell Vought, Director of the Office of Management and Budget, removed the federal apportionments database from OMB's public website. This was not a minor data update — it was the removal of the only public source showing whether executive branch agencies are actually releasing congressionally appropriated funds to be spent. The Government Accountability Office formally disagreed with the removal. The Protect Democracy Project filed a lawsuit, arguing the database was essential for public oversight. The case is pending.

Apportionments are the mechanism by which OMB controls the flow of money from Treasury to federal agencies. When Congress appropriates $10 billion for housing assistance, OMB apportions it — specifying how much agencies can spend and when. If OMB apportions less than appropriated (or withholds apportionments entirely), it is effectively impounding funds in defiance of congressional intent — an action that was ruled unconstitutional in the 1974 Impoundment Control Act. The apportionments database was the public's window into whether this was happening.

With the database gone, researchers, journalists, congressional staff, and oversight organizations have lost a critical signal. But the information doesn't vanish entirely — it can be partially reconstructed from secondary sources: USAspending.gov (actual outlays and obligations), the Daily Treasury Statement (actual spending by account), FPDS-NG (contract obligations), and agency budget justifications. The gap between what was appropriated and what actually flowed provides an indirect signal of possible impoundment or apportionment manipulation.

This is a different problem than DOGEWatch (#15 in this backlog), which tracks what's been cut. OMBLens focuses on a more fundamental question: **of the money Congress has appropriated that hasn't been formally cut, is it actually being released to agencies?** This is the budget plumbing layer that even most policy experts struggle to monitor without the apportionments database.

## Target Audience / User

- **Primary:** Budget policy researchers, fiscal watchdogs, and constitutional law scholars tracking potential impoundment (Bipartisan Policy Center, Committee for a Responsible Federal Budget, Protect Democracy, Brennan Center)
- **Secondary:** Investigative journalists covering the executive branch's use of spending power (Politico, Washington Post, ProPublica); congressional budget staff needing independent verification of OMB claims
- **Tertiary:** Federal contractors and nonprofits noticing delays in payments and obligated funds that should be flowing; state governments whose federal grant funds may be withheld

**User persona:** "Priya" — Senior Policy Analyst at a fiscal oversight nonprofit. She spent years using the OMB apportionments database to track whether agencies were receiving their full appropriated funds on schedule. She now has to manually pull Daily Treasury Statements and USAspending data and reconcile them by hand — work that previously took minutes now takes days. She needs a tool that reconstructs the apportionment signal from available secondary sources so she can continue her oversight work.

## Vibe / Goals

- **Vibe:** Rigorous, wonky, authoritative. The "budget nerd's Bloomberg Terminal" — built for people who know what a continuing resolution is and why apportionments matter.
- **Core goals:**
  1. Reconstruct as much of the lost apportionments data as possible from secondary sources (Treasury, USAspending, FPDS)
  2. Flag anomalies where appropriated funds appear to be flowing more slowly or less completely than historical patterns suggest they should
  3. Provide a structured, continuously-updated archive of the budget transparency landscape — what data is available, what's been removed, and what's been reconstructed

## Aesthetic

- Ultra-clean, wonky data journalism aesthetic — numbers-forward, minimal decoration
- Federal government color palette: dark blue, cream, and red — deliberately referencing official government documents to signal authority
- Primary view: appropriations vs. obligations comparison tables by agency and account
- Secondary: timeline of data availability (which OMB/Treasury data sources are up, which have been removed or degraded)
- Dense tables with export-to-CSV as a first-class feature (researchers need raw data, not just charts)
- Desktop-first; built for power users who will spend hours in it
- Inspiration: USAspending.gov's data explorer if it were actually easy to use, meets the Wayback Machine's archival mission

## UX Ideas

1. **Appropriations vs. obligations dashboard:** For each major federal account, show: (1) FY2026 enacted appropriation, (2) cumulative obligations to date (from USAspending), (3) expected obligations pace (based on historical patterns), (4) deviation flag if actual is below expected pace by >15%. This is the apportionment signal proxy.
2. **Daily Treasury Statement tracker:** Parse and visualize daily Treasury outlays by budget function and sub-function. Show daily spending pace vs. historical averages. Flag accounts where spending has slowed anomalously.
3. **Data availability status board:** A living dashboard showing the status of all major federal budget transparency data sources: OMB apportionments database (removed), USAspending API (operational), FPDS-NG (operational), Daily Treasury Statement (operational), Monthly Treasury Statement (operational), OMB MAX (access status), etc. — with dates of last known data and availability status.
4. **Reconstruction methodology docs:** For each reconstructed data series, show exactly how it's being estimated, what the limitations are, and what confidence level to attach. This is critical for the primary audience of researchers who will use this in published work.
5. **Anomaly alert feed:** Chronological feed of detected anomalies — accounts where spending pace has dropped significantly below historical pattern, new data removals detected, or court developments that affect data access.
6. **Historical archive:** Pre-removal OMB apportionment data (archived from Wayback Machine and other sources before the database was taken offline) — the most complete available reconstruction of what was there.

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **USAspending.gov** | Official federal spending data; strong API | Obligations and outlays only; no apportionment data; complex to navigate for pattern analysis |
| **OMBMax (internal)** | Has actual apportionment data | Not publicly accessible |
| **Wayback Machine** | Has archived some apportionment data | Point-in-time snapshots; no live reconstruction; hard to use for ongoing research |
| **Committee for a Responsible Federal Budget** | Excellent budget analysis | Periodic reports and commentary; not a data platform |
| **Congressional Budget Office** | Authoritative budget projections | Forward-looking projections; not a real-time spending tracker |

**White space:** No tool attempts to reconstruct the lost apportionments signal from available secondary sources, nor provides a unified status board for federal budget transparency data availability.

## Data That Might Be Needed

- **USAspending.gov API:** Federal obligations and outlays by agency, account, program activity, and object class (free, rich API)
- **Daily Treasury Statement (DTS):** Published each business day by Treasury; shows actual outlays and receipts by budget function — free PDF/CSV download
- **Monthly Treasury Statement (MTS):** More detailed monthly view of Treasury spending by account — free download from Treasury's Bureau of the Fiscal Service
- **Wayback Machine API:** For archived OMB apportionment data captured before database removal — Internet Archive has snapshots
- **FPDS-NG:** Federal contract obligations by agency and account — strong proxy for discretionary spending pace
- **OMB Budget Historical Tables:** Annual OMB publication with historical appropriations and outlay data by function
- **CRS Reports:** Congressional Research Service analyses of budget process and apportionment law — for context and methodological guidance
- **USAJobs and agency HR data:** Hiring actions as a proxy for agencies spending on personnel (a major portion of discretionary)
- **Court filings:** Protect Democracy Project v. OMB (PACER/Courtlistener) — track whether legal action restores database access
- **OMB.gov monitoring:** Automated monitoring for any restoration of removed data or new data removals

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js; heavy on data tables with sortable/filterable columns; minimal map usage
- **Backend:** Python/FastAPI; Treasury DTS parsing service (PDF-to-structured-data); USAspending API integration
- **Database:** PostgreSQL for budget time series; separate schema for data availability status; S3 for archived PDFs and Wayback Machine snapshots
- **Data pipeline:** Daily DTS download and parse; daily USAspending API pull; daily OMB website monitoring for data changes; monthly MTS processing

### Key Technical Components
1. **Treasury DTS Parser:** Automated daily download and parsing of the Daily Treasury Statement (PDF format); extracts outlays and receipts by budget function; normalizes to account-level data for comparison with historical
2. **Apportionment Proxy Engine:** Compares actual YTD obligations (from USAspending) against expected pace (modeled from prior-year patterns and enacted appropriation amounts); flags anomalies by account, agency, and program activity
3. **Data Availability Monitor:** Automated daily check of all major federal budget data sources (USAspending, DTS, MTS, OMB.gov pages, FPDS) for availability and content changes; triggers alert when a source goes offline or content is removed
4. **Historical Archive:** Structured database of pre-removal OMB apportionment data reconstructed from Wayback Machine snapshots; standardized schema for comparison with available current data
5. **Anomaly Alert System:** Threshold-based anomaly detection on spending pace deviations; email/RSS feed for researchers to subscribe to specific accounts or agencies

### MVP Scope
- 20 major federal budget accounts with appropriations vs. obligations tracker
- Daily Treasury Statement parser and visualizer (5 years of history for baseline)
- Data availability status board for 10 key federal budget data sources
- Basic historical archive of OMB apportionment snapshots from Wayback Machine
- Email alert for anomaly detections (subscribe by agency or budget function)
- Fully open/free — this is infrastructure for public oversight

### Growth Path
- All federal budget accounts and program activities
- FPDS integration for contract-level obligation corroboration
- Natural language query interface ("Has DOE's Office of Science received its full FY2026 appropriation?")
- API for researchers and journalists to build on
- Methodology publication and peer review (make the reconstruction methodology a citable resource)
- Potential legal data feed integration if Protect Democracy lawsuit restores access — auto-import restored data when available
- Collaboration with CBPP, Bipartisan Policy Center, and other fiscal oversight orgs for data validation
