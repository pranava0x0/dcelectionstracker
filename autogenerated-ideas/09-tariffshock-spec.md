# TariffShock — Tariff Impact Simulator

> **Generated:** 2026-03-09 | **Sector:** Shipping / Trade Policy
> **Last refreshed:** 2026-03-16 | **Reason:** Supreme Court Feb 2026 IEEPA ruling changes tariff landscape significantly; $166B refund processing adds new user need

---

## Problem Statement

U.S. trade policy entered a new phase in February 2026 when the Supreme Court ruled in *Learning Resources, Inc. v. Trump* that the sweeping "Liberation Day" IEEPA tariffs — imposed April 2, 2025 — were unconstitutional. The government estimates it collected **$166 billion** in IEEPA tariffs from more than **330,000 businesses**, and U.S. Customs is now building a system to process refunds. But the tariff landscape is far from resolved: **Section 301 tariffs on China** (up to 25% base + additional layers), **Section 232 tariffs on steel and aluminum**, and **USMCA-compliant sourcing advantages** all remain intact. Businesses face a three-front complexity: (1) understanding what tariffs remain legal and applicable today, (2) determining whether and how to claim refunds on the unconstitutional IEEPA collections, and (3) modeling sourcing decisions against this still-shifting policy terrain.

Small and mid-sized importers — the 330,000 businesses most affected — are blindsided by this complexity. Many paid tariffs they may not owe, don't know how to file CBP protests, lack tracking for their refund status, and are still trying to understand their current duty obligations after the legal landscape shifted. Customs brokers are overwhelmed with refund inquiries and can't provide self-service tools. Enterprise importers have trade counsel; SMBs have spreadsheets and confusion. Meanwhile, nearshoring to Mexico accelerated dramatically (Mexico is now the top U.S. import source), creating a new set of USMCA compliance questions for companies that moved supply chains they may now want to re-evaluate.

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
6. **IEEPA Refund Estimator:** Input HTS codes, origin country, shipment dates (April 2025 – Feb 2026), and value → estimates how much unconstitutional IEEPA tariff was paid; generates pre-filled CBP protest form data and tracks submission/refund status

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

---

## Changelog

| Date | Author | Summary |
|---|---|---|
| 2026-03-09 | Auto-generated | Initial spec created via trend-research-ideator skill |
| 2026-03-16 | Trend refresh | Updated problem statement to reflect Feb 2026 SCOTUS ruling (*Learning Resources v. Trump*) invalidating IEEPA tariffs; added $166B refund context; 330K business claimants; Section 301/232 tariffs still intact; added IEEPA Refund Estimator as UX idea #6 |
