# FreightCast — Predictive Freight Rate Dashboard

> **Generated:** 2026-03-09 | **Sector:** Shipping / Logistics
> **Last refreshed:** 2026-03-11 | **Reason:** CDL crackdown creating trucking capacity shock; March-May ocean contract window is live now; updated Q1 rate data
> **Last refreshed:** 2026-03-15 | **Reason:** Strait of Hormuz effectively closed since Feb 28 (U.S.-Israeli strikes on Iran); oil above $100/barrel; Maersk and Hapag-Lloyd suspended Mideast routes; insurance withdrawal making Hormuz transit unviable; TL contract rates confirmed up mid-single digits first time in 4 years; post-Lunar New Year SCFI +6% followed by Transpacific rates dropping 13-14% as overcapacity persists

---

## Problem Statement

The freight market in Q1 2026 has two diverging stories unfolding simultaneously — and small shippers are caught in both without the tools to navigate either.

**Trucking capacity shock:** The FMCSA's non-domiciled CDL rule took effect March 16, 2026, limiting eligibility for commercial driver's licenses to foreign nationals holding H-2A, H-2B, or E-2 visas only. FMCSA found ~200K non-domiciled CDL holders in the system; approximately 194K are expected to lose eligibility over the next five years as their credentials expire (~40K/year). California cancelled 13,000 licenses on March 6 alone. Multiple lawsuits are challenging the rule, but capacity is already tightening in Texas, California, and New York — the states with the highest concentration of affected drivers. Shippers who rely on spot trucking in these corridors need real-time visibility into capacity tightness and legal-challenge status.

**Ocean contract window:** March through May is the annual ocean contract negotiation season for Transpacific eastbound trade lanes — the window when importers lock in rates for the year ahead. In 2026, shippers are negotiating from a favorable position: industry-wide overcapacity continues (3.7% more supply added in 2026), China import volumes are down 22.7% YoY as tariff diversification accelerates, and Drewry forecasts declining spot rates. Shippers who understand the market and negotiate strategically can lock in materially better rates. But most small shippers have no data; they accept the first quote their forwarder gives them.

**Hormuz crisis overlay (March 2026):** The U.S.-Israeli strikes on Iran on February 28 triggered a major new variable. The Strait of Hormuz is now effectively closed to most Western-flagged commercial traffic — not via physical blockade, but through insurance withdrawal (Lloyd's war risk premiums at six-year highs). Maersk and Hapag-Lloyd suspended Mideast routes; CMA CGM and Hapag-Lloyd embargoed Persian Gulf ports (Jebel Ali, Khalifa, Dammam). Oil broke $100/barrel for the first time since 2022. For shippers sourcing from the Middle East, UAE, and Gulf states, this is a crisis with no immediate routing alternative. The knock-on: any Suez-route normalization that was expected to flood the market with redeployed capacity is now uncertain, keeping Transpacific and North Europe rates more supported than overcapacity alone would suggest.

The combination creates a high-stakes, multi-variable intelligence gap: shippers need to know when to hold (wait for trucking capacity to stabilize as CDL litigation plays out) and when to move (lock ocean contracts before Hormuz risk reprices Transpacific demand), all while oil-driven cost increases ripple through fuel surcharges across every mode.

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
- **Market indicators:** OTRI (Outbound Tender Rejection Index) from FreightWaves SONAR; Cass Freight Index; ITS Logistics Port/Rail Ramp Freight Index (monthly)
- **Fuel prices:** EIA weekly diesel price reports
- **Economic indicators:** Consumer Confidence Index, PMI, retail sales (freight demand proxies)
- **CDL/capacity data:** FMCSA carrier authority data (new entrants/exits); FMCSA non-domiciled CDL cancellation notices (public records); state DMV actions
- **Legal challenge status:** Court dockets for AFL-CIO et al. v. FMCSA; Asian Law Caucus class action — scrape/monitor for stay orders and reversals
- **Ocean data:** Drewry WCI (World Container Index) weekly rates; Xeneta spot vs. contract spread data; carrier capacity deployment schedules
- **Seasonal patterns:** Historical rate data by lane for seasonal modeling; annual contract window calendar

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
- Integration with TMS systems (Flexport, project44, FourKites)
- Lane-specific capacity tightness indicators powered by CDL cancellation data
- Ocean contract negotiation module with carrier comparison and counter-offer templates
- Community benchmarks (anonymized user rate submissions)
- CDL legal challenge outcome model (probability-weighted capacity impact scenarios)
