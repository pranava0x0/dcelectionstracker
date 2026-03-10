# OpenData Sentinel — Government Data Portal Monitor

> **Generated:** 2026-03-09 | **Sector:** Government Data / Open Data

---

## Problem Statement

Government open data availability is shifting rapidly. Federal datasets are going offline, the Harvard Law School Library archived 17.9TB from data.gov as a preservation effort, and the push for AI-Ready (FAIR) data is creating new standards that most portals don't meet. Researchers, journalists, and civic developers depend on government datasets that can disappear without notice, change schema unexpectedly, or go stale. There's no systematic monitoring of the health and availability of the thousands of datasets across federal, state, and local portals.

## Target Audience / User

- **Primary:** Data journalists and researchers who depend on government datasets for their work
- **Secondary:** Civic tech developers building apps on government data APIs; open data advocates
- **Tertiary:** Government data officers wanting to benchmark their portal health; librarians and archivists preserving public data

**User persona:** "Alex" — a data journalist at a nonprofit newsroom. He relies on 30+ government datasets for ongoing investigations. Twice this year, datasets he depended on were quietly removed or had their schema changed, breaking his analysis pipeline. He needs to know immediately when a dataset he depends on changes or disappears.

## Vibe / Goals

- **Vibe:** Watchdog energy, quietly reliable. Feels like an uptime monitor (Pingdom/UptimeRobot) for public data.
- **Core goals:**
  1. Monitor availability, freshness, and schema stability of government datasets across portals
  2. Alert users immediately when a dataset they track goes offline, changes schema, or stops updating
  3. Provide a public health dashboard showing the state of government open data nationwide

## Aesthetic

- Status-page aesthetic — green/yellow/red indicators dominate
- Clean, minimal interface focused on status at a glance
- Dashboard-first with drill-down to individual datasets
- Monospace fonts for data field names and schema displays
- Inspiration: GitHub's status page meets Down Detector's simplicity meets Socrata's data portal

## UX Ideas

1. **Watchlist:** Users add datasets they depend on → see real-time status (available, degraded, offline, stale)
2. **Health dashboard:** Public view showing aggregate health metrics: % of datasets online, average freshness, portal uptime by agency
3. **Change feed:** Chronological log of all detected changes — schema modifications, new fields, removed fields, data format changes
4. **Freshness tracker:** For each dataset, shows last update date vs. stated update frequency; flags datasets that are overdue
5. **Archive links:** When a dataset goes offline, automatically provide links to cached/archived versions (Internet Archive, Harvard archive)
6. **Portal comparison:** Compare data portal health across agencies, states, or cities

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **Data.gov** | Central federal catalog | Catalog only; no monitoring, freshness tracking, or alerts |
| **Harvard/LIL data.gov Archive** | Preservation of federal data | Static archive; no real-time monitoring |
| **DataPortals.org** | Directory of portals worldwide | Directory only; no health monitoring |
| **datHere** | FAIR data tools, AI chatbots | Focused on data transformation, not monitoring/alerting |
| **Uptime Robot / Pingdom** | Website monitoring | Generic HTTP monitoring; no dataset-specific intelligence (schema, freshness, content) |

**White space:** No tool monitors government datasets at the dataset level (not just portal uptime) for availability, freshness, schema stability, and content changes.

## Data That Might Be Needed

- **Data.gov CKAN API:** Federal dataset catalog metadata (311K+ datasets)
- **Socrata APIs:** Platform powering many city/state data portals (standardized API)
- **ArcGIS Open Data APIs:** Geospatial data portals
- **DCAT-US metadata:** Standardized dataset metadata across portals
- **Internet Archive API:** Wayback Machine for dataset snapshots and historical versions
- **Individual portal APIs:** State and city-specific data portal APIs (varying standards)
- **HTTP monitoring:** Standard uptime/response time checks for dataset endpoints

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with a status-page style dashboard
- **Backend:** Python/FastAPI with async monitoring workers
- **Database:** PostgreSQL for dataset metadata and monitoring history; Redis for real-time status
- **Job scheduler:** Celery or APScheduler for periodic dataset checks
- **Storage:** S3 for dataset snapshots and schema archives

### Key Technical Components
1. **Dataset Monitor:** Periodic checks of dataset endpoints — HTTP status, response time, content type, row count, last-modified headers
2. **Schema Tracker:** Parse dataset schema (column names, types, counts) and detect changes between checks; store schema history
3. **Freshness Calculator:** Compare last dataset update timestamp against stated update frequency; flag overdue datasets
4. **Change Detector:** Content-level comparison (hash of first N rows, column value distributions) to detect data changes beyond metadata
5. **Alert System:** Configurable alerts per dataset (offline, schema change, stale, content change) via email, Slack, webhook
6. **Archive Connector:** When a dataset goes offline, auto-search Internet Archive and known mirrors for cached copies

### MVP Scope
- Monitor 1,000 most-accessed federal datasets on data.gov
- Basic health checks: availability, freshness, schema stability
- User watchlists with email alerts
- Public health dashboard
- Daily monitoring cadence

### Growth Path
- State and city portal coverage (Socrata-based portals first)
- Hourly monitoring for critical datasets
- Dataset content change detection
- API for programmatic access
- Browser extension for inline dataset health indicators
- Community-reported dataset issues
- FAIR compliance scoring
