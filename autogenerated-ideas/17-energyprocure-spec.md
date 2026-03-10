# EnergyProcure — Corporate Renewable Procurement Navigator

> **Generated:** 2026-03-09 | **Sector:** Energy / Corporate Sustainability

---

## Problem Statement

Corporate energy procurement is increasingly complex. Policy reversals have reduced projected U.S. renewable capacity by 30%, IRA incentives are under political threat, and competition for grid connections is intensifying. Corporate buyers (driven by ESG commitments, cost savings, or both) need to navigate PPAs (power purchase agreements), REC markets, on-site generation, community solar, and emerging structures like virtual PPAs — all while accounting for shifting policy, grid availability, and carbon accounting rules. Most companies below Fortune 500 size lack dedicated energy procurement expertise.

## Target Audience / User

- **Primary:** Sustainability/facilities managers at mid-market companies (500-5,000 employees) with renewable procurement mandates
- **Secondary:** Commercial real estate operators managing energy across portfolios; corporate ESG teams reporting on Scope 2 emissions
- **Tertiary:** Energy brokers advising corporate clients; procurement consultants

**User persona:** "Lisa" — Sustainability Director at a regional hospital system with 12 facilities across 3 states. Her board set a 50% renewable electricity target by 2028. She's received PPA proposals from 4 different developers, has no idea how to compare them, doesn't understand the difference between physical and virtual PPAs, and is worried about policy risk to IRA tax credits her projects depend on.

## Vibe / Goals

- **Vibe:** Trusted advisor, educational yet actionable. Feels like a knowledgeable consultant available 24/7.
- **Core goals:**
  1. Help non-expert corporate buyers understand and compare renewable procurement options (PPAs, RECs, on-site, community solar)
  2. Model the financial impact of each option under different policy scenarios (IRA intact, IRA modified, IRA repealed)
  3. Match corporate buyers with appropriate procurement structures based on their location, load profile, and goals

## Aesthetic

- Clean, professional, calming — reduces the anxiety of complex procurement decisions
- Step-by-step wizard flows with progressive disclosure (don't overwhelm with complexity upfront)
- Comparison tables and scenario visualizations as the core interaction pattern
- Light blue/green palette (energy/sustainability without being heavy-handed)
- Inspiration: Lemonade's insurance simplification approach meets Rocky Mountain Institute's analytical depth

## UX Ideas

1. **Procurement pathway quiz:** Answer 10 questions about your company (size, location, load, goals, risk tolerance) → get recommended procurement options ranked by fit
2. **Option explainer:** Interactive guide explaining each procurement type (PPA, VPPA, REC, on-site, community solar) with plain-English pros/cons and when each makes sense
3. **PPA comparison tool:** Input multiple PPA proposals → see side-by-side financial analysis including price, escalators, tenor, basis risk, and policy scenarios
4. **Policy scenario modeler:** "What happens to my project economics if IRA credits are reduced by 50%?" with toggle-able policy assumptions
5. **Carbon accounting calculator:** Translate procurement choices into Scope 2 emissions reductions using both location-based and market-based methods
6. **RFP generator:** Auto-generate a procurement RFP based on company profile and preferences

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **LevelTen Energy** | PPA marketplace and analytics | Enterprise-focused; complex; no educational/guidance layer for non-experts |
| **Schneider Electric NEO Network** | Large PPA advisory platform | Consulting-model (expensive); not self-service |
| **Google Clean Energy Toolkit** | Procurement guidance | Google-specific learnings; not an operational tool |
| **US EPA Green Power Partnership** | Educational resources | Information only; no analysis tools or deal comparison |
| **3Degrees / Clearway** | REC procurement and advisory | Vendor-specific; not an independent comparison tool |

**White space:** No self-service tool helps mid-market companies (too small for big advisors, too complex for DIY) understand, compare, and execute renewable energy procurement.

## Data That Might Be Needed

- **Electricity rate data:** EIA Form 861 (utility rates by state); utility tariff databases
- **PPA market data:** LevelTen PPA Price Index (or comparable); recent PPA transaction data
- **REC pricing:** Green-e certified REC prices by region and vintage
- **IRA incentive data:** ITC/PTC rates, adders (domestic content, energy community, low-income), safe harbor rules
- **Grid emissions data:** EPA eGRID for location-based emission factors; real-time grid data for marginal emissions
- **Solar/wind resource data:** NREL NSRDB (solar); NREL Wind Toolkit
- **Utility programs:** Community solar availability, green tariff programs by utility
- **Corporate disclosure standards:** GHG Protocol Scope 2 guidance; SEC climate disclosure rules

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with wizard-style flows and interactive comparison tools
- **Backend:** Python/FastAPI with financial modeling engine
- **Database:** PostgreSQL for user profiles, proposals, and analysis results
- **Integrations:** EIA API for rate data; EPA eGRID for emissions; NREL APIs for resource data

### Key Technical Components
1. **Procurement Recommender:** Decision tree / scoring model that matches company profile to best-fit procurement options
2. **Financial Model Engine:** NPV/LCOE calculator for PPA proposals with policy scenario toggles (IRA full, partial, none)
3. **PPA Analyzer:** Parse PPA term sheets → extract key terms → generate standardized comparison metrics
4. **Carbon Calculator:** Compute Scope 2 emissions impact of each procurement option using GHG Protocol methodology
5. **Market Data Layer:** Aggregate REC prices, PPA benchmarks, and utility rates into a queryable dataset
6. **RFP Builder:** Template-based generator that produces procurement RFPs based on user inputs

### MVP Scope
- Procurement pathway quiz with recommendations
- PPA comparison tool (manual input of 2-3 proposals)
- Basic financial model with 3 policy scenarios
- Scope 2 emissions calculator
- Educational content library
- 10 states with the most active corporate renewable procurement

### Growth Path
- PPA marketplace integration (connect buyers and sellers)
- Automated PPA term sheet parsing (PDF → structured data)
- Community solar program directory and enrollment
- Portfolio-level procurement planning
- API for energy consultants to white-label
- International market expansion (EU, UK, Australia)
