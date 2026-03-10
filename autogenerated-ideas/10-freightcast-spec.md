# FreightCast — Predictive Freight Rate Dashboard

> **Generated:** 2026-03-09 | **Sector:** Shipping / Logistics

---

## Problem Statement

The freight market is tightening — truckload contract rates are up mid-single digits, spot rates are running mid-teens above prior-year levels, and Q2 pricing is being negotiated on the firmest cost floor since 2022. Small and mid-sized shippers lack the rate intelligence tools that large 3PLs and enterprise shippers use. They're negotiating blind, accepting quoted rates without knowing if they're above or below market, and missing windows to lock in favorable contract rates.

## Target Audience / User

- **Primary:** Small-to-mid shippers (e-commerce, manufacturers, distributors) shipping 10-500 loads/month
- **Secondary:** Small freight brokers looking for rate benchmarking; logistics managers at mid-market companies
- **Tertiary:** Supply chain consultants advising SMB clients

**User persona:** "David" — logistics manager at a regional food distributor. Ships 80 truckloads/month, mostly in the Southeast. Renews carrier contracts quarterly but has no good data on whether his rates are competitive or when to shift between spot and contract.

## Vibe / Goals

- **Vibe:** Sharp, analytical, real-time. Feels like a stock ticker for freight — constantly updating, pattern-revealing.
- **Core goals:**
  1. Give small shippers the same rate intelligence that enterprise logistics teams have
  2. Predict rate trends 30-90 days out so users can time contract negotiations and spot purchases
  3. Benchmark user's current rates against market averages by lane, mode, and equipment type

## Aesthetic

- Dark mode default (dashboard-heavy, data-dense — easier on eyes for daily monitoring)
- Financial charting aesthetic — candlestick-style rate charts, heat maps for regional pricing
- Minimal chrome, maximum data density
- Responsive but desktop-optimized
- Inspiration: TradingView meets project44's visibility dashboard

## UX Ideas

1. **Lane watchlist:** Users add their top shipping lanes → see real-time spot rates, contract benchmarks, and 30/60/90-day forecasts
2. **Rate comparison tool:** Input a quoted rate for a lane → see how it compares to market (percentile ranking)
3. **Timing advisor:** "Lock or wait" recommendation based on rate trend forecasting for each lane
4. **Market pulse page:** National and regional freight market overview with key metrics (tender rejections, capacity utilization, fuel prices)
5. **Alert system:** Price threshold alerts ("Notify me when Chicago→Atlanta TL spot drops below $2.50/mi")

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **DAT Freight & Analytics** | Largest rate database | Expensive; enterprise-oriented; raw data, not predictive |
| **Freightos / WebCargo** | Ocean/air rate comparison | Focused on international, not domestic trucking |
| **Greenscreens.ai** | Rate prediction for brokers | Built for broker pricing, not shipper intelligence |
| **Convoy / Uber Freight** | Dynamic pricing | You get their rates, not market intelligence |
| **Truckstop (formerly ITS)** | Load board with rate data | Tool for carriers, not shipper-friendly analytics |

**White space:** No affordable, shipper-focused tool combines rate benchmarking, predictive forecasting, and actionable timing recommendations for SMB shippers.

## Data That Might Be Needed

- **Rate data:** DAT, Truckstop, or Freightos APIs (or aggregated public data); USDA agricultural freight rates
- **Market indicators:** OTRI (Outbound Tender Rejection Index) from FreightWaves SONAR; Cass Freight Index
- **Fuel prices:** EIA weekly diesel price reports
- **Economic indicators:** Consumer Confidence Index, PMI, retail sales (freight demand proxies)
- **Capacity metrics:** FMCSA carrier authority data (new entrants/exits); CDL issuance trends
- **Seasonal patterns:** Historical rate data by lane for seasonal modeling

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with D3.js/Recharts for financial-grade charting
- **Backend:** Python/FastAPI; time-series forecasting service
- **Database:** TimescaleDB (PostgreSQL extension) for time-series rate data; Redis for real-time caching
- **ML pipeline:** Prophet or NeuralProphet for rate forecasting; trained on lane-level historical data

### Key Technical Components
1. **Rate Aggregation Engine:** Ingest rates from multiple sources, normalize by lane/mode/equipment, store as time series
2. **Forecasting Model:** Per-lane rate predictions using time-series models with exogenous variables (fuel, capacity, seasonal patterns)
3. **Benchmarking Engine:** Percentile ranking of any quoted rate against the relevant lane's distribution
4. **Alert System:** User-defined price thresholds with email/SMS/push notifications

### MVP Scope
- 50 most popular domestic truckload lanes
- Spot rate tracking with 30-day forecasts
- Rate comparison tool (input a quote, see percentile)
- Weekly market pulse email digest
- Free tier with limited lanes; paid tier for full access

### Growth Path
- LTL and intermodal mode coverage
- Integration with TMS systems
- Lane-specific capacity tightness indicators
- Community benchmarks (anonymized user rate submissions)
