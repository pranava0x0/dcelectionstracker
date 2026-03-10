# LastMile IQ — Parcel Cost Optimizer

> **Generated:** 2026-03-09 | **Sector:** Shipping / E-Commerce

---

## Problem Statement

Last-mile delivery costs are surging — the TD Cowen/AFS Freight Index projects Q1 2026 ground parcel rates per package at 38.9% above the January 2018 baseline, a 5.4% year-over-year increase. FedEx and UPS continue layering surcharges (fuel, residential, dimensional weight, peak season) that are nearly impossible for small e-commerce sellers to model. Meanwhile, micro-fulfillment centers, regional carriers, and hybrid fleet options are emerging but hard to evaluate without sophisticated tools.

## Target Audience / User

- **Primary:** E-commerce brands doing 500-50,000 shipments/month (Shopify, Amazon FBA/FBM sellers)
- **Secondary:** 3PLs and fulfillment centers optimizing across carriers for their clients
- **Tertiary:** DTC brand operations managers; supply chain teams at mid-market retailers

**User persona:** "Priya" — runs a DTC skincare brand on Shopify, ships 3,000 packages/month. She's on a negotiated UPS rate but suspects she's overpaying on surcharges. She's heard about regional carriers but doesn't know how to evaluate them for her shipping profile.

## Vibe / Goals

- **Vibe:** Practical, savings-focused, empowering. Feels like a financial advisor for your shipping spend.
- **Core goals:**
  1. Show e-commerce sellers their true all-in cost per package across carriers (including hidden surcharges)
  2. Recommend optimal carrier mix based on destination zones, package dimensions, and delivery speed
  3. Identify savings opportunities through zone-skipping, regional carriers, and fulfillment location optimization

## Aesthetic

- Bright, clean interface with savings highlighted in green callout cards
- Before/after comparisons prominently displayed
- Simple tables and bar charts (not overly data-dense — users are brand operators, not analysts)
- Mobile-friendly for checking on the go
- Inspiration: ShipBob's dashboard meets Mint's savings insights

## UX Ideas

1. **Shipping profile import:** Connect Shopify/WooCommerce/Amazon → auto-analyze last 90 days of shipments with dimensions, weights, destinations
2. **True cost calculator:** Input a package → see all-in cost across FedEx, UPS, USPS, and regional carriers with every surcharge itemized
3. **Savings dashboard:** "You could save $X/month by switching these shipment types to [carrier]" with actionable recommendations
4. **Zone-skip advisor:** Map visualization showing where a second fulfillment location would reduce zone costs
5. **Surcharge decoder:** Plain-English explanations of every surcharge on user's invoices with trend graphs
6. **Rate negotiation prep:** Generate a data-backed report to take into carrier rate negotiations

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **ShipStation** | Multi-carrier rate shopping at checkout | Compares published rates; no surcharge analysis or savings recommendations |
| **Shippo** | Easy API for rate comparison | Transaction-focused; no spend analytics or optimization |
| **Sifted (now Reveel)** | Parcel audit and analytics | Enterprise-focused ($10K+/month shippers); expensive |
| **71lbs** | Parcel audit for refunds | Focused on refunds/auditing, not proactive optimization |
| **Pirate Ship** | Cheap USPS/UPS rates | Rate tool only; no analytics, no multi-carrier optimization |

**White space:** No affordable tool gives SMB e-commerce sellers surcharge-level visibility, multi-carrier optimization, and fulfillment location recommendations in one place.

## Data That Might Be Needed

- **Carrier rate APIs:** FedEx, UPS, USPS rate APIs; regional carrier rate sheets (OnTrac, LSO, Spee-Dee, etc.)
- **Surcharge schedules:** FedEx/UPS published surcharge tables (updated annually + mid-year)
- **E-commerce platform APIs:** Shopify, WooCommerce, Amazon SP-API for shipment history
- **Zone maps:** USPS zone charts; FedEx/UPS zone matrices by origin ZIP
- **Fulfillment center directories:** Locations of 3PL/fulfillment centers for zone-skip modeling
- **Package dimension data:** From user's shipment history or manual input

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with Shopify app integration (Shopify App Bridge)
- **Backend:** Node.js/Express or Python/FastAPI
- **Database:** PostgreSQL for shipment data; pre-computed surcharge lookup tables
- **Integrations:** Shopify, WooCommerce, Amazon SP-API; carrier rate APIs

### Key Technical Components
1. **Surcharge Calculator:** Model every surcharge type (fuel, residential, dimensional weight, delivery area, peak) per carrier per service level
2. **Optimization Engine:** Linear programming or heuristic model that assigns each shipment type to the cheapest carrier meeting delivery requirements
3. **Zone-Skip Simulator:** Given user's destination distribution, model the impact of adding a fulfillment location in a different region
4. **Shipment Analyzer:** Import historical shipments, categorize by characteristics, identify patterns and anomalies

### MVP Scope
- Shopify integration for shipment history import
- True cost calculator for FedEx, UPS, USPS (ground services)
- Top 3 savings recommendations based on shipment profile
- Monthly savings report email

### Growth Path
- Regional carrier rate integration
- Multi-origin fulfillment optimization
- Carrier rate negotiation tool with benchmarking data
- Real-time rate shopping widget for checkout
- Invoice audit and refund claim automation
