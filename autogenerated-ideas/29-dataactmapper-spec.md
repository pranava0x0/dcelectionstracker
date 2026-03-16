# DataActMapper — Off-Grid Data Center Power & Compliance Navigator

> **Generated:** 2026-03-15 | **Sector:** Energy / AI Infrastructure / Regulatory Compliance

---

## Problem Statement

The data center industry faces an existential bottleneck: interconnection queue timelines now stretch to 5–10 years in prime markets like Virginia, while AI infrastructure deployment demands 12–18 month build times. In Northern Virginia — the world's data center capital — new interconnection requests have exploded 700% in two years, and Dominion Energy is managing a queue that has ballooned to billions of watts of pending requests.

The response has been a tectonic shift toward off-grid and hybrid power. The **DATA Act** (Data Center Advance Technology and Architecture Act), now moving through Congress, creates a new regulatory category — **Critical & Resilient Energy Utilities (CREUs)** — that grants fully isolated power systems serving data centers exemptions from the Public Utility Regulatory Policies Act (PURPA) and the Public Utility Holding Company Act (PUHCA). This dramatically changes the legal landscape for on-site gas turbines, small modular reactors, microgrids, and other captive power configurations that data center developers have been deploying.

Simultaneously, on October 23, 2025, DOE instructed FERC to initiate rulemaking to "rapidly accelerate the interconnection of large loads" — with a deadline of **April 30, 2026** — enabling co-located load and generation interconnection requests filed directly to FERC. This creates a new pathway that didn't exist six months ago.

Behind-the-meter deployments reduce time-to-power from a 5–10-year grid queue to **18–36 months**. More than **35 GW** of self-generated data center power is projected by Boston Consulting Group by 2030. The market is moving from "connect to the grid" to "build your own power" — and the regulatory, siting, and compliance complexity of that transition is enormous.

Data center developers, energy companies building captive power for hyperscalers, and investors backing these projects need to navigate: CREU classification criteria, state PUC jurisdiction questions, PURPA/PUHCA exemption eligibility, FERC's new co-located interconnection rulemaking, state-by-state behind-the-meter regulations, and transmission tariff implications. Currently this requires an army of energy lawyers billing $800+/hour. DataActMapper distills this into a structured, self-service intelligence tool.

## Target Audience / User

- **Primary:** Development leads and energy strategy teams at hyperscalers and large colocation providers (Amazon, Microsoft, Google, Meta, Equinix, Digital Realty) evaluating off-grid and hybrid power configurations
- **Secondary:** Independent power producers and energy companies building captive power solutions for data center clients (natural gas, nuclear, solar + storage microgrid developers)
- **Tertiary:** Energy lawyers and consultants who advise data center clients and want a research platform; state PUCs and utility commissions trying to understand their jurisdiction over CREU configurations

**User persona:** "Priya" — Director of Energy Strategy at a 2 GW colocation company with campuses in Northern Virginia, Phoenix, and Dallas. She's evaluating three off-grid configurations for a new 200 MW campus in Manassas, VA: (1) on-site gas turbines as primary with grid backup, (2) solar+storage microgrid, and (3) a long-term SMR PPA. She needs to understand: Does each configuration qualify as a CREU? What are the PURPA implications? Which state regulatory bodies have jurisdiction? What's FERC's new co-located interconnection pathway? She's currently paying $400K/year in legal fees to get these questions answered piecemeal.

## Vibe / Goals

- **Vibe:** Regulatory precision meets developer velocity. Feels like a Bloomberg Law compliance tool designed specifically for energy infrastructure developers — authoritative but actionable.
- **Core goals:**
  1. Enable data center developers to rapidly evaluate whether a proposed power configuration qualifies for CREU/DATA Act benefits
  2. Map state-by-state regulatory treatment of off-grid data center power configurations (PURPA applicability, net metering, interconnection standards)
  3. Track FERC's April 30, 2026 large-load interconnection rulemaking and its implications for co-located deployments

## Aesthetic

- Professional, dense, regulatory-grade — white with blue/gray
- Regulatory text alongside plain-English summaries (two-pane layout)
- U.S. map with state-level regulatory status color-coding
- Configuration comparison table as a core UX element
- Minimal decoration — this is a professional research tool
- Inspiration: Westlaw's regulatory library meets a modern SaaS compliance dashboard

## UX Ideas

1. **CREU qualification checker:** Input proposed power configuration (technology type, capacity, isolation level, utility grid relationship) → tool evaluates whether it meets DATA Act CREU criteria, with a plain-English verdict and the specific regulatory text triggering each finding
2. **State regulatory map:** Interactive U.S. map showing each state's treatment of large, privately-owned on-site generation for data centers — PURPA QF applicability, net metering limits, behind-the-meter rules, and utility tariff treatment
3. **Configuration comparator:** Side-by-side analysis of up to 4 power configurations (e.g., gas turbine vs. solar+storage vs. SMR PPA) across 12 regulatory and financial dimensions: CREU eligibility, PURPA applicability, PUHCA holding company risk, grid backup cost, deployment timeline, capex estimate
4. **FERC rulemaking tracker:** Dedicated page tracking the status of FERC's large-load co-located interconnection rulemaking (April 30, 2026 deadline); docket filings, key dates, and "what it means for your project" summaries
5. **Precedent library:** Curated collection of relevant FERC orders, state PUC decisions, and legal precedents on off-grid data center power — searchable and tagged by configuration type and state
6. **Expert connection:** Matchmaking to pre-vetted energy lawyers and consultants when issues exceed the tool's scope (referral-based revenue model)

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **Westlaw / LexisNexis** | Comprehensive legal research | Not structured for data center power configurations; $10K+/year; not actionable |
| **Wood Mackenzie** | Energy market intelligence | Macro analysis; not a compliance/qualification tool for specific configurations |
| **Latham & Watkins / Stoel Rives** | Deep energy law expertise | Human advisory services, $800+/hour; not a scalable self-service product |
| **FERC eLibrary** | Official docket filings | Raw regulatory documents; no analysis, comparison, or workflow |
| **RMI / NRDC resources** | Clean energy policy analysis | Advocacy-oriented; not compliance-grade for specific configuration qualification |

**White space:** No self-service tool helps data center developers evaluate off-grid power configuration compliance across the DATA Act, PURPA/PUHCA, FERC rulemaking, and state-by-state regulations — a gap that currently costs millions in legal fees annually.

## Data That Might Be Needed

- **DATA Act legislative text:** Public; Congressional record and bill tracking (Congress.gov)
- **PURPA and PUHCA statute text:** Public; 16 U.S.C. §824a-3 (PURPA), 15 U.S.C. §79 et seq. (PUHCA)
- **FERC NOPR and Order text:** FERC eLibrary (free); specifically the October 2025 large-load rulemaking docket
- **State PUC interconnection tariffs:** 50 state public utility commission databases; combination of web scraping and manual research (~50 state tariff PDFs)
- **State net metering rules:** DSIRE database (NC State; free API); covers solar/storage net metering by state
- **FERC Form 556 data:** QF qualifying status filings (PURPA eligibility); public at FERC
- **State behind-the-meter regulations:** DSIRE + state PUC databases; variable public availability
- **SMR/nuclear PPA precedents:** NRC licensing database, FERC dockets, press releases from Equinox/Oklo, Google/Kairos, Constellation deals
- **Gas turbine interconnection data:** RTO/ISO tariff filings for behind-the-meter large load; FERC eLibrary
- **Energy law firm publications:** Latham, Stoel Rives, Baker Botts publish free client alerts on regulatory changes; useful for secondary research

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js; regulatory document viewer; Mapbox GL for state regulatory map; comparison table components
- **Backend:** Python/FastAPI; document processing for regulatory text (PDFs → structured JSON)
- **Database:** PostgreSQL; regulatory documents and summaries; user configuration analyses; state regulatory matrix
- **LLM layer:** Claude API for plain-English summaries of regulatory text, CREU qualification determinations, and Q&A on specific configurations
- **Key integrations:** FERC eLibrary API, Congress.gov API, DSIRE database API (NC State), regulations.gov API

### Key Technical Components
1. **CREU qualification engine:** Rule-based decision tree + LLM explainer; maps configuration parameters to DATA Act CREU criteria; produces eligibility determination with citations
2. **State regulatory matrix:** Structured database of 50 states × 12 regulatory dimensions; maintained via combination of automated monitoring + human review; updated quarterly
3. **FERC rulemaking tracker:** Daily polling of FERC eLibrary for docket activity; extracts key dates and filings; LLM-generated impact summaries
4. **Configuration comparator:** Template-driven side-by-side comparison generator; inputs normalize to standardized taxonomy; output rendered as interactive table with expandable detail
5. **Precedent library:** Tagged document store with semantic search; Claude-powered Q&A over regulatory documents ("find cases where behind-the-meter gas turbines were deemed PURPA-exempt in PJM territory")

### MVP Scope
- CREU qualification checker (DATA Act criteria only; 6 configuration archetypes)
- State regulatory map (priority states: VA, TX, AZ, GA, OH, NJ, IL — 7 states covering 70% of data center MW pipeline)
- FERC rulemaking tracker (live page tracking April 30 deadline and subsequent docket activity)
- Configuration comparator (gas turbine vs. solar+storage vs. grid-connected, 3 configurations, 8 dimensions)
- Free with account; usage-gated for full configuration analysis (leads for expert referral)

### Growth Path
- Expand state coverage to all 50 states
- Add SMR-specific compliance module (NRC licensing + PURPA implications)
- Build procurement navigator: when CREU qualifies, help users find vendors and structure PPAs
- API for energy law firms to white-label for client portals
- Integrate with permitting data (PermitFlow, Army Corps NWP checker) for full siting workflow
- Expand beyond data centers to other large industrial loads (electrolyzers, semiconductor fabs)
