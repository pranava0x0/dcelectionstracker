# TariffShock — Tariff Impact Simulator

> **Generated:** 2026-03-09 | **Sector:** Shipping / Trade Policy

---

## Problem Statement

U.S. trade policy is in flux — the Supreme Court invalidated broad emergency tariffs, new blanket import surcharges (starting at 10%) were enacted under alternative trade acts, and nearshoring to Mexico is accelerating. Small and mid-sized importers are blindsided by cost changes and lack the tools large enterprises use to model tariff scenarios. Most are relying on spreadsheets, customs brokers' ad-hoc advice, or learning about cost changes only when goods arrive.

## Target Audience / User

- **Primary:** Small-to-mid importers (1-50 employees) bringing goods from China, Southeast Asia, and India
- **Secondary:** E-commerce brands sourcing products internationally; customs brokers advising multiple clients
- **Tertiary:** Nearshoring consultants; supply chain analysts at mid-market companies

**User persona:** "Maria" — runs a 15-person consumer goods company importing from Shenzhen. She checks tariff updates manually, has been stung by surprise surcharges twice this year, and wants to evaluate whether shifting some sourcing to Mexico or Vietnam would save money.

## Vibe / Goals

- **Vibe:** Confident, data-driven, approachable. Feels like a Bloomberg terminal for trade costs, but accessible to non-experts.
- **Core goals:**
  1. Let users instantly model the cost impact of current and proposed tariffs on their specific product mix
  2. Surface alternative sourcing scenarios (nearshoring, supplier diversification) with cost comparisons
  3. Alert users proactively when policy changes affect their product categories (HTS codes)

## Aesthetic

- Clean, dashboard-first design with data visualizations front and center
- Light color scheme with accent colors for alerts (red for cost increases, green for savings opportunities)
- Card-based layout for scenario comparisons
- Mobile-responsive but desktop-primary (users are at their desks when making sourcing decisions)
- Inspiration: Carta's cap table interface meets Flexport's shipment tracking UI

## UX Ideas

1. **Onboarding wizard:** User enters their top 5-10 HTS codes, origin countries, and typical shipment volumes → instant cost dashboard
2. **Scenario builder:** Side-by-side comparison of "current state" vs. "what if" tariff scenarios (e.g., "What if surcharges go to 25%?")
3. **Nearshoring calculator:** Input a product → see cost comparison across China, Vietnam, Mexico, India with tariff, shipping, and lead time factored in
4. **Policy alert feed:** Real-time feed of tariff changes, USTR announcements, and court decisions filtered to user's HTS codes
5. **Savings opportunity cards:** Proactive notifications like "Switching SKU X sourcing to Vietnam would save $12K/year at current rates"

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **Flexport** | Full logistics platform, tariff lookup | Enterprise-focused; not a scenario modeler |
| **Customs Info (Descartes)** | Deep HTS database | Lookup tool only, no modeling or alerting |
| **Import Genius** | Trade data analytics | Focused on competitor intelligence, not cost modeling |
| **TariffTel** | HS code classification | Classification only, no impact simulation |
| **DIY spreadsheets** | Free, customizable | Error-prone, no real-time updates, no alerts |

**White space:** No tool combines real-time tariff tracking, scenario modeling, and nearshoring cost comparison in one place for SMBs.

## Data That Might Be Needed

- **U.S. International Trade Commission (USITC):** Harmonized Tariff Schedule (HTS) database, duty rates
- **USTR announcements:** Tariff modifications, exclusion lists, trade actions
- **CBP (Customs and Border Protection):** Surcharge rates, enforcement actions
- **Freight rate data:** Freightos Baltic Index, ocean/air rate APIs
- **Country-level cost data:** Manufacturing cost indices (BCG, Deloitte), labor rates, lead times
- **Court decisions:** Trade-related rulings (SCOTUS, Court of International Trade)
- **News APIs:** Trade policy news from Reuters, Bloomberg, POLITICO

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with React, deployed on Vercel
- **Backend:** Python/FastAPI for tariff calculation engine
- **Database:** PostgreSQL for user data + product catalogs; Redis for rate caching
- **Data pipeline:** Scheduled scrapers for USITC/USTR updates; webhook integration for news APIs

### Key Technical Components
1. **HTS Code Engine:** Fuzzy-match product descriptions to HTS codes; calculate applicable duties, surcharges, and fees
2. **Scenario Engine:** Parameterized model that takes (origin, HTS, volume, weight) → total landed cost under different tariff regimes
3. **Alert System:** Watch user's HTS codes against a feed of policy changes; push notifications via email/SMS/in-app
4. **Nearshoring Model:** Pre-built cost models for top 10 sourcing countries with manufacturing, shipping, and duty costs

### MVP Scope
- HTS code lookup + duty rate calculator
- Single scenario comparison (current vs. one alternative)
- Email alerts for changes to user's tracked HTS codes
- 3 origin countries (China, Vietnam, Mexico)

### Growth Path
- Multi-scenario comparison with exportable reports
- Integration with customs brokers' systems
- Historical tariff trend analysis
- Community-sourced landed cost benchmarks
