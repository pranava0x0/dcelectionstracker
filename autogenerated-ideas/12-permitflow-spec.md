# PermitFlow — Federal-State Infrastructure Permit Tracker

> **Generated:** 2026-03-09 | **Sector:** Infrastructure Permitting

---

## Problem Statement

Infrastructure permitting in the U.S. is a multi-agency, multi-jurisdictional maze. The Federal Permitting Improvement Steering Council just signed new MOUs with Idaho and Tennessee to coordinate federal-state reviews, and FERC is moving permits 30% faster — but project developers still struggle to track where their applications stand across multiple agencies. The Federal Permitting Dashboard exists but only covers FAST-41 projects, and most state-level permitting systems aren't integrated. For energy, transportation, and broadband projects, a single permit can involve 5-15 agencies with different timelines, review processes, and requirements.

## Target Audience / User

- **Primary:** Infrastructure project developers (energy, broadband, transportation) managing multi-agency permit processes
- **Secondary:** Environmental consultants preparing NEPA documents and permit applications
- **Tertiary:** Government affairs teams; law firms specializing in infrastructure permitting; investors doing due diligence on project timelines

**User persona:** "James" — project manager at a mid-size solar development firm. He's juggling 8 projects across 4 states, each requiring federal (NEPA, ESA, NHPA), state (environmental, land use), and local (zoning, building) permits. He tracks everything in a spreadsheet and routinely misses agency comment deadlines.

## Vibe / Goals

- **Vibe:** Authoritative, organized, calming. Turns permit chaos into a clear, navigable process.
- **Core goals:**
  1. Unified timeline view of all federal, state, and local permits for a project on a single dashboard
  2. Proactive deadline alerts so users never miss comment periods, submission windows, or agency milestones
  3. Historical data on actual permit durations to set realistic project timelines and identify bottleneck agencies

## Aesthetic

- Gantt-chart-centric design with agency-color-coded timelines
- Professional, government-adjacent feel — clean, trustworthy, no-frills
- Dark blue / slate gray palette with status indicator colors (green/yellow/red)
- Information-dense but well-organized with collapsible sections
- Inspiration: Monday.com's project tracking meets the Federal Permitting Dashboard's data

## UX Ideas

1. **Project setup wizard:** Select project type (solar, wind, transmission, broadband, highway) + location → auto-populate likely required permits and typical timelines
2. **Permit timeline board:** Gantt chart showing all permits with dependencies, deadlines, and current status per agency
3. **Deadline calendar:** Integrated calendar with all upcoming comment periods, submission deadlines, and hearing dates
4. **Agency tracker:** Per-agency view showing historical processing times, current backlogs, and contact information
5. **Document hub:** Central repository for all permit application documents, agency correspondence, and review comments
6. **Bottleneck analyzer:** Historical data showing which agencies/permits consistently cause delays, with mitigation strategies

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **Federal Permitting Dashboard (permitting.gov)** | Official FAST-41 tracking | Only covers federally-designated projects; no state/local integration |
| **Airtable/Monday.com** | Flexible project tracking | Generic — no permit-specific templates, no agency data, no auto-population |
| **ePermitHub (various states)** | State-level permit submission | Siloed per state; no cross-jurisdiction view |
| **OpenGov (Permitting)** | Municipal permit management | Government-side tool, not developer-facing; local permits only |
| **Smartsheet** | Enterprise project management | No permit-specific intelligence or agency timeline data |

**White space:** No tool provides a unified developer-facing view across federal, state, and local permits with historical timeline intelligence and proactive deadline management.

## Data That Might Be Needed

- **Federal Permitting Dashboard API:** FAST-41 project status, timelines, milestones
- **NEPA data:** EPA EIS database; CEQ guidance on categorical exclusions
- **FERC eLibrary:** Energy project filing status and dockets
- **State environmental agency portals:** CEQA (CA), SEPA (WA), state-specific EIS tracking
- **Corps of Engineers:** Section 404 permit data (wetlands)
- **FWS/NOAA:** ESA consultation timelines and outcomes
- **SHPO databases:** Section 106 historic preservation review data
- **Local zoning/building departments:** Municipal permit portals (varies widely)
- **Congressional Research Service:** Permitting reform legislation tracking

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with a robust Gantt chart library (e.g., DHTMLX Gantt or custom D3.js)
- **Backend:** Python/Django for complex data modeling and admin
- **Database:** PostgreSQL with timeline/interval data types; full-text search for documents
- **Data pipeline:** Scrapers for federal agency portals; state API integrations where available; manual data entry fallback

### Key Technical Components
1. **Permit Knowledge Graph:** Database of permit types by project type and jurisdiction, with typical timelines, dependencies, and requirements
2. **Agency Timeline Model:** Historical processing time distributions by agency, permit type, and project characteristics
3. **Deadline Engine:** Calendar system that auto-calculates deadlines from agency notice dates and regulatory timeframes
4. **Document Management:** File storage with version control, tagging by permit/agency, and OCR for agency correspondence
5. **Notification System:** Multi-channel alerts (email, SMS, in-app) for approaching deadlines, status changes, and new agency publications

### MVP Scope
- Solar and wind project types
- Federal permits only (NEPA, ESA, NHPA, Section 404)
- Manual permit entry with template auto-population
- Gantt chart timeline view
- Email deadline alerts
- 3 states (CA, TX, NY) with state-level permit templates

### Growth Path
- Full 50-state coverage with state permit templates
- Integration with e-filing portals
- AI-assisted NEPA document drafting
- Permit risk scoring and delay prediction
- Multi-project portfolio view for large developers
- Integration with project finance models
