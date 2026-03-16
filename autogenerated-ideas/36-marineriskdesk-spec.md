# MarineRiskDesk — Marine War Risk Intelligence Platform

> **Generated:** 2026-03-16 | **Sector:** Shipping / Insurance / Financial Risk

---

## Problem Statement

The Hormuz crisis of 2026 revealed a systemic vulnerability at the heart of global shipping: marine war risk insurance. When U.S. and Israeli forces struck Iran on February 28, the first system to buckle was not military but actuarial. Within 72 hours, the world's largest marine insurance mutuals — Gard, Skuld, North-Standard, the London P&I Club, Steamship Mutual, and others — issued notices cancelling war risk extensions for vessels entering the Persian Gulf. The cancellations came not from Lloyd's itself but from a cascading failure of P&I club reinsurance support — driven by Solvency II capital requirements and 26 months of accumulated war risk losses from the Red Sea disruption that preceded the Iran conflict.

The result: the Strait of Hormuz was effectively closed not by missiles but by the withdrawal of a piece of paper. Gulf war risk premiums rose **5x within days** of hostilities. Hull insurance rates in the Gulf rose **25–50%**. Approximately **1,000 vessels with a combined hull value exceeding $25 billion** were trapped in the Gulf region. A single large vessel loss — conservatively worth $200–300 million combining hull, cargo, and third-party liability — could exceed the entire war risk premium pool for the region. The capital buffer supporting marine war risk underwriting globally was at its **thinnest point in the modern era** when the crisis hit.

Marine underwriters, reinsurers, and shipowners are making pricing and transit decisions with inadequate data. The Joint War Committee (JWC) risk area designations — the primary public signal for war risk exposure — are updated irregularly and without transparency into the underlying methodology. Shipowners evaluating whether to transit the Hormuz approaches must navigate a fragmented landscape of P&I club bulletins, JWC notices, broker advisories, AIS data, and military intelligence releases, all without a unified risk assessment. Underwriters are pricing risk blind: claims exposure is concentrated, premium pools are thin, and there is no real-time market-wide view of coverage availability or aggregate exposure.

The U.S. Development Finance Corporation (DFC) has been proposed as a government insurance backstop for Hormuz transits, with Lloyd's stating it "stands ready to work with the U.S." — a development that could fundamentally reshape the market structure. MarineRiskDesk is the intelligence platform for professionals navigating this new, more dangerous and more complex marine war risk environment.

## Target Audience / User

- **Primary:** Marine insurance underwriters and war risk specialists at Lloyd's syndicates, P&I clubs, and reinsurers who need to track aggregate exposure, monitor JWC zone changes, and price individual risks against real-time incident data
- **Secondary:** Ship managers and shipowners (vessel operators with exposure in Gulf, Red Sea, Black Sea risk zones) evaluating whether and when to transit, on what insurance terms, and at what total voyage cost
- **Tertiary:** Energy traders and commodity buyers who incorporate maritime insurance costs into voyage economics and need a forward view of insurance availability to model shipping costs for Gulf-origin oil, LNG, and petrochemicals

**User persona:** "Andrew" — Senior War Risk Underwriter at a Lloyd's syndicate. He writes $40M/year in marine war risk premium, predominantly Gulf and Red Sea exposure. Since the Hormuz crisis began, he's fielding dozens of calls per day from brokers seeking individual voyage quotes. He's working from four browser tabs (UKMTO, VesselFinder, news aggregator, his syndicate's own loss run) to assess each risk. He has no systematic view of what his peers in the market are quoting, how aggregate industry exposure has shifted, or what the real probability of a specific transit zone violation is — making consistent, market-rational pricing essentially impossible.

## Vibe / Goals

- **Vibe:** Institutional, precise, Bloomberg-grade. Feels like a specialized Reuters Eikon for marine war risk — data-dense, market-aware, trusted by professionals.
- **Core goals:**
  1. Give marine underwriters a unified, real-time risk intelligence view across all active war risk zones to support rational, consistent pricing
  2. Help shipowners model the total cost of a specific transit decision — premium, incident probability, routing alternatives — before committing
  3. Track the evolving market structure for war risk coverage (JWC zones, reinsurance availability, government backstop programs) as the Hormuz crisis reshapes the industry

## Aesthetic

- Dark, terminal-like aesthetic — navy and dark grey with amber/gold alert accents
- Risk zone map as hero element — showing all active JWC/JWLA high-risk areas globally with color-coded severity
- Dense data tables for underwriters; voyage calculator for shipowners
- Desktop-only — this is serious professional tooling, not mobile-first
- Multi-panel layout: incident log | risk zone map | market signals | exposure tracker running simultaneously
- Inspiration: Bloomberg Terminal's BGOV/WSL function layout applied to marine war risk data

## UX Ideas

1. **Risk zone live map:** Interactive global map showing all JWC and JWLA high-risk areas color-coded by risk severity tier; click any zone → shows JWC designation history, effective dates, current estimated premium range, recent incidents within zone, and P&I club status (active coverage / restricted / suspended)
2. **Incident feed and severity logger:** Real-time feed from UKMTO, IMB, coalition/military press releases, OSINT — each incident tagged with: location (geocoded), vessel type, cargo type, attack type, damage level, flag, operator; feeds the map and incident severity trend lines
3. **War risk premium index:** Aggregated, anonymized market premium rate data for each risk zone (sourced from broker submissions, public market intelligence, IUMI publications) — shows 30-day trend, current range, and where the "market is clearing" vs. where it's fragmented or suspended
4. **Voyage risk calculator:** Shipowner/manager inputs vessel type, origin, destination, cargo, flag, and operator nationality → tool returns: estimated applicable premium range, current JWC zone exposure along route, incident probability score based on historical data and current tempo, and alternative routing comparison (Cape of Good Hope vs. Hormuz/Red Sea with comparative cost/risk)
5. **Reinsurance market pulse:** Tracks capacity signals from the reinsurance market — P&I club bulletins, Lloyd's market communications, government backstop announcements (DFC, ECAs) — synthesized into a "capacity availability index" for each zone; shows where market is open, restricted, or government-backstopped
6. **Vessel exposure portfolio tracker:** For underwriters: input portfolio of covered vessels/voyages → real-time aggregate PML (probable maximum loss) estimate based on current incident tempo, zone concentration, and hull value distribution; alerts when portfolio concentration in high-risk zones crosses user-defined thresholds

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **Lloyd's List Intelligence** | Deep maritime intelligence; incident tracking; war risk news | Expensive subscription; no real-time premium index; no voyage calculator; no portfolio exposure tracker |
| **Windward Maritime AI** | Best-in-class vessel intelligence; spoofing detection; government/defense grade | Not insurance-focused; no premium tracking; no P&I club market signals; no voyage cost calculator |
| **UKMTO (UK Maritime Trade Ops)** | Official incident reporting; widely trusted | Public, free, incident-only — no analysis, no market signals, no premium data |
| **JWC bulletins** | Official war risk zone designations | Irregular; no methodology transparency; no incident-level data; manual distribution |
| **Marsh / Willis / Aon broker services** | Professional war risk advice for clients | Client-specific; not a real-time platform; advice-based not data-driven |
| **Bloomberg WSL SHIPPING** | Comprehensive shipping intelligence | Requires terminal; not marine insurance-specific; no war risk premium index |

**White space:** No platform integrates real-time incident data, JWC zone tracking, war risk premium market signals, and voyage risk modeling in a single interface designed specifically for marine war risk underwriters and shipowners — the gap that the Hormuz crisis has made acutely visible.

## Data That Might Be Needed

- **UKMTO incident reports:** Maritime incident data from UK Maritime Trade Operations — public feed
- **IMB Piracy Reporting Centre:** Incident data for piracy and armed robbery — public (with free API)
- **JWC and JWLA advisories:** Joint War Committee risk area designations — public bulletins from Lloyd's Market Association
- **P&I club bulletins:** War risk coverage change notices — scraped from individual club websites (Gard, Skuld, North-Standard, etc.)
- **AIS vessel position data:** Real-time vessel tracking in risk zones — MarineTraffic/VesselFinder commercial API
- **IUMI statistics:** International Union of Marine Insurance — aggregate war risk premium data, published annually
- **Military/government press releases:** CENTCOM, coalition forces incident confirmations — public
- **Ship-to-shore crane and ECA data:** For cargo and vessel valuation inputs — IHS Markit/Clarksons commercial
- **OSINT aggregators:** Geolint, Bellingcat, maritime OSINT networks for unconfirmed incident tracking — curated manual sources
- **DFC/ECA backstop program terms:** For government insurance modeling — public (DFC press releases)

## High-Level Design / Implementation Ideas

### Architecture

- **Frontend:** Next.js with Mapbox GL JS for the risk zone map; multi-panel layout using resizable panels
- **Backend:** Python/FastAPI; incident ingestion pipeline; premium index calculation engine
- **Database:** PostgreSQL for incident log, zone history, and vessel data; TimescaleDB for premium time-series
- **Data pipeline:** Real-time or near-real-time ingestion of UKMTO/IMB feeds; daily scraping of P&I club bulletins; weekly JWC zone change monitoring; manual curation of government backstop developments

### Key Technical Components

1. **Incident Ingestor:** Parses UKMTO/IMB/CENTCOM releases using NLP; extracts location (geocoded), vessel attributes, attack type, damage; classifies severity (1–5 scale); feeds live incident map and severity trend
2. **JWC Zone Tracker:** Monitors Lloyd's Market Association for JWC advisory publications; parses zone boundary coordinates; maintains historical zone change log; triggers alerts on zone changes
3. **Premium Index Engine:** Aggregates war risk premium signals from public sources (IUMI stats, broker advisories, market reports); computes zone-level premium range index with 30-day trend; not a quoting system, but a market intelligence signal
4. **Voyage Risk Calculator:** Route decomposition (waypoints through risk zones using vessel routing APIs); applies zone-specific incident probability model (based on incident frequency/severity data) to calculate aggregate voyage risk score; maps to premium range
5. **Portfolio Exposure Aggregator:** For underwriters maintaining a portfolio; calculates aggregate exposure by zone, vessel type, and flag using user-input coverage data; computes portfolio PML under different loss scenarios

### MVP Scope

- Incident map with UKMTO + IMB feeds for Gulf, Red Sea, and Black Sea
- JWC zone map with current designations and historical change log
- Basic voyage risk calculator (Hormuz and Red Sea routes)
- P&I club status board (which clubs have restrictions/suspensions for which zones)
- Daily email digest of incidents and zone changes

### Growth Path

- Premium index with historical trend data and zone-level capacity availability indicator
- Portfolio exposure tracker for underwriters
- Integration with reinsurance market signals (broker advisories, treaty pricing)
- DFC/ECA government backstop program tracker
- API for shipbrokers and commodity trading desks to embed voyage risk cost calculations

---

## Changelog

| Date | Author | Summary |
|---|---|---|
| 2026-03-16 | Auto-generated | Initial spec created via trend-research-ideator skill (Run 4) |
