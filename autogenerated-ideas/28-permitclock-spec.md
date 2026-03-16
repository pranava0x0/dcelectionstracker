# PermitClock — Army Corps 2026 NWP Navigator & Transition Tracker

> **Generated:** 2026-03-15 | **Sector:** Infrastructure Permitting

---

## Problem Statement

On March 15, 2026, the U.S. Army Corps of Engineers' 2021 Nationwide Permits expired and were replaced by the 2026 NWPs — 56 reissued permits plus one new permit (NWP 59, for nature-based fish passage solutions) published January 8, 2026 in the Federal Register (91 FR 768). While the transition appears procedural, it creates significant compliance complexity for the ~500,000+ projects that rely on NWPs annually across construction, infrastructure, energy, and real estate development.

The transition creates three distinct urgent problems for project teams:

**1. Grandfathering determination:** Activities authorized under 2021 NWPs that commenced (or were under contract to commence) before March 14, 2026 have until March 14, 2027 to complete work under the prior authorization. But "commenced" is not a simple standard — it requires documented evidence of construction activity or a binding contract. Project managers need to quickly determine which of their projects are grandfathered, which need reauthorization under 2026 NWPs, and which may require an individual permit if they no longer qualify.

**2. Changed NWP terms:** The 2026 NWPs include notable modifications. NWP 39 (Commercial and Institutional Developments) now explicitly covers "artificial intelligence and machine learning facilities" and "pharmaceutical manufacturing facilities" — a significant expansion for data center developers. Several NWPs have modified acreage thresholds, preconditions, and reporting requirements. Projects that were designed around 2021 NWP terms may need to be re-evaluated.

**3. Future rulemaking input window:** The Army Corps opened a solicitation for public input on future NWP changes on March 16, 2026, with comments due May 15, 2026. Developers, environmental groups, and municipalities with strong opinions about NWP scope (particularly around wetlands, data centers, and climate-adaptive projects) have a narrow window to influence the next 5-year cycle.

The broader permitting context amplifies the stakes: the average federal permitting timeline is 4.5 years for major energy projects. Massachusetts just implemented a landmark single-consolidated-permit-in-one-year reform for clean energy. Bipartisan governors are pushing Congress for federal reform. NWPs are supposed to streamline permitting for "routine" projects — but only if project teams correctly navigate the transition.

## Target Audience / User

- **Primary:** Civil engineers, project managers, and environmental compliance staff at construction firms, developers, and utilities managing projects near waters of the U.S. (approximately 40,000+ NWP verifications processed annually by the Corps)
- **Secondary:** Environmental consultants and permitting specialists who advise clients on Section 404/Section 10 compliance; land use attorneys
- **Tertiary:** Data center developers specifically (NWP 39 expansion for AI/ML facilities); nature-based solution project developers (new NWP 59); state and local governments managing infrastructure projects in wetland-adjacent areas

**User persona:** "Kevin" — Environmental Compliance Manager at a regional infrastructure contractor. His firm has 14 active projects near waters of the U.S., spread across NWP 12 (utility lines), NWP 14 (linear transportation), and NWP 39 (commercial development). Three of these projects started before March 14 and may be grandfathered; two are in design and need to be re-evaluated under 2026 NWP terms; and one data center project just got a lot more interesting now that NWP 39 explicitly covers AI/ML facilities. He's managing all of this across spreadsheets and Army Corps district websites — a nightmare.

## Vibe / Goals

- **Vibe:** Precise, compliance-grade, trustworthy. Feels like a specialized legal research tool (Westlaw-adjacent) but designed for project managers, not lawyers.
- **Core goals:**
  1. Help project teams rapidly determine grandfathering status for in-progress projects
  2. Surface the specific changes in 2026 NWPs vs. 2021 NWPs relevant to a user's project type
  3. Track the public comment window and enable organized comment submission for industry stakeholders

## Aesthetic

- Clean, document-centric layout — white background, strong typography, regulatory-appropriate
- Project tracker view (Kanban or table) for managing multiple permits simultaneously
- Side-by-side comparison view for 2021 vs. 2026 NWP terms
- Color-coded compliance status indicators (green = grandfathered/compliant, yellow = action needed, red = may require individual permit)
- Minimal decoration — this is a professional compliance tool
- Inspiration: Westlaw's document view meets Linear's project management aesthetic

## UX Ideas

1. **NWP lookup & comparison:** Search any NWP by number or project type → see full 2026 text alongside 2021 text with changes highlighted in yellow; "what changed" plain-English summary
2. **Project grandfathering checker:** Input project start date, NWP used, Corps district → tool determines grandfathering eligibility and deadline, with a checklist of documentation needed to prove "commencement"
3. **Project portfolio tracker:** Dashboard of all active projects with their NWP status, grandfathering deadline (if applicable), and next required action
4. **NWP applicability wizard:** Answer 8-10 questions about project type, location, acreage, and activity → tool recommends which 2026 NWP(s) likely apply, with confidence level and "verify with your Corps district" flag
5. **Comment submission tracker:** Track the May 15, 2026 public comment deadline; template generator for common comment types; link to official Federal Register docket
6. **Corps district finder:** Map-based tool to find the responsible Army Corps district for any U.S. location, with current NWP implementation status and any district-specific conditions

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **Army Corps ePermitting (ORM2)** | Official permit application portal | Not a compliance navigator; no comparison, no portfolio tracking |
| **JD Supra / Bloomberg Law** | Legal analysis of NWP changes | Text-based; no workflow, no project tracking, expensive |
| **Wetlands Mapper (FWS/EPA)** | Wetland location identification | Geographic data only; no permit applicability or compliance workflow |
| **Permit.com / Roper** | General permitting platforms | Not specialized for Corps/Section 404 compliance; broad generalist tools |
| **Ecology & Environment (consulting)** | Deep NWP expertise | Human services (expensive); not a SaaS self-service tool |

**White space:** No SaaS tool helps project teams navigate the 2021→2026 NWP transition — identifying grandfathered projects, understanding changed terms, and tracking compliance deadlines — without hiring expensive environmental consultants for each question.

## Data That Might Be Needed

- **2026 NWP Federal Register text:** Public; Federal Register 91 FR 768 (January 8, 2026); Army Corps website
- **2021 NWP Federal Register text:** Public archive; for comparison/diff tool
- **Army Corps District boundaries:** Corps publishes GIS shapefiles; 38 districts covering CONUS + territories
- **District-specific NWP conditions:** Each Corps district can add regional conditions to NWPs; published on district websites (requires scraping/monitoring ~38 district sites)
- **Corps ePermitting (ORM2) public data:** Some permit verification records are public; useful for showing example verifications
- **National Wetlands Inventory:** USFWS NWI GIS layer (free); for map-based project location feature
- **Section 404 jurisdiction determinations:** Corps publishes some JDs publicly; Approved JDs are public records
- **Federal Register API (regulations.gov):** Track future NWP rulemaking; comment submission integration
- **State 401 certification status:** States can condition or deny 401 water quality certifications for NWPs; EPA and state agency data
- **EWA / Clean Water Act case law:** For attorney notes on grandfathering standards; secondary research

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js; document viewer with diff highlighting (using diff libraries); Mapbox GL for district/location maps
- **Backend:** Python/FastAPI; PDF parsing (PyPDF2 / pdfplumber) for Federal Register text processing
- **Database:** PostgreSQL; full NWP text and diff data stored as structured JSON; project portfolio per user
- **NLP layer:** spaCy or LLM (Claude API) for plain-English summaries of regulatory changes and applicability wizard responses
- **Key integrations:** USFWS National Wetlands Inventory API (ArcGIS REST), Federal Register API, Army Corps GIS district data

### Key Technical Components
1. **NWP diff engine:** Parse 2021 and 2026 NWP text from Federal Register PDFs; generate word-level diffs; store structured change records (section, change type, plain-English summary)
2. **Grandfathering decision tree:** Rule-based engine with 12 inputs (start date, NWP number, activity status, contract status) → produces eligibility determination with supporting regulatory citations
3. **District condition aggregator:** Scraper/monitoring for all 38 Corps district websites to track district-specific NWP conditions; alert when conditions change
4. **Applicability wizard:** LLM-assisted Q&A flow that maps project characteristics to NWP options; produces ranked recommendations with confidence scores
5. **Portfolio tracker:** User-owned project list with automated status computation from grandfathering checker; deadline reminders via email

### MVP Scope
- Full 2021 vs. 2026 NWP comparison with highlighted changes (all 57 NWPs)
- Grandfathering checker for the most common NWPs (12, 14, 39, 58)
- NWP applicability wizard (basic rule-based, not LLM for v1)
- Corps district finder with map
- Comment deadline tracker for May 15, 2026 window
- Free with account registration (build email list; convert to paid for team features)

### Growth Path
- Add individual permit tracking (when NWPs don't apply) and Section 408 alteration permits
- Integrate wetlands delineation data sources (NWI + state databases)
- State 401 certification tracker (per-state status for each NWP)
- Full LLM-powered applicability wizard with confidence calibration
- Compliance audit reports for project portfolios (exportable PDF for clients)
- Expand to NEPA categorical exclusion tracking (adjacent regulatory space, similar user base)
