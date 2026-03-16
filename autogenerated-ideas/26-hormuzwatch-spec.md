# HormuzWatch — Strait of Hormuz Supply Chain Crisis Monitor

> **Generated:** 2026-03-15 | **Sector:** Shipping / Energy / Commodity Markets

---

## Problem Statement

On February 28, 2026, joint U.S.-Israeli strikes on Iran triggered the most significant maritime disruption since the COVID-era port crisis — and in some ways worse. The Strait of Hormuz, through which approximately 20% of global oil supply transits daily, is now effectively closed to most commercial traffic. Not through physical blockade, but through insurance withdrawal: Lloyd's war risk premiums surged to six-year highs (Gulf hull rates up 25-50%; war risk premiums up 5x within days of hostilities beginning), making transit economically unviable for most operators. Since March 1, at least 16 commercial vessels have been hit. Maersk and Hapag-Lloyd suspended Mideast routes. CMA CGM and Hapag-Lloyd announced embargoes on Persian Gulf ports (Jebel Ali, Khalifa, Dammam). Daily transits have collapsed from a historical average of 138 ships/day to no more than 5 ships/day — a 96% reduction confirmed by the United Kingdom Maritime Trade Operations (UKMTO) centre.

As of March 16, the crisis is deepening rather than abating. Iran's newly installed supreme leader, **Mojtaba Khamenei** — who succeeded his father Ayatollah Ali Khamenei following the February strikes — publicly confirmed that the Strait will remain closed. "The crucial Strait of Hormuz should remain closed," Khamenei said in a message read on state television, signaling that the new leadership has no intention of negotiating a rapid de-escalation. The IRGC spokesperson warned oil could reach **$200/barrel**: "Get ready for oil to be $200 a barrel, because the oil price depends on regional security, which you have destabilised." U.S. President Trump has called on China, Japan, France, and the UK to help form a coalition to reopen the strait; none have publicly committed to deploying their navies. Russia and the U.S. have begun preliminary discussions on stabilizing energy markets.

The oil market impact is severe and accelerating: Brent crude rose more than 40% since the war began, reaching **$104.63/barrel** as of March 16. Oxford Economics models a scenario where oil averages $140/barrel for two months as a "breaking point" that would push the eurozone, UK, and Japan into recession. The IEA announced an unprecedented 400 million barrel strategic reserve release — covering only ~4 days of global consumption, or ~20 days of typical Hormuz flows. Saudi Arabia and the UAE are diverting crude through alternative pipelines (Yanbu, Abu Dhabi Crude Oil Pipeline), but combined capacity covers only ~8 million of the ~20 million barrels/day normally transiting. The U.S. Development Finance Corporation (DFC) has been proposed as a government backstop for Hormuz transit insurance, with Lloyd's stating it "stands ready to work with the U.S." on a joint public-private insurance facility — a structural intervention that has no precedent in the modern marine insurance era.

The commodity cascade extends far beyond oil. One-third of global fertilizer trade transits the Strait — urea prices at the New Orleans hub have risen from $475/metric ton to $680/metric ton (+43%). Petrochemicals and plastics feedstocks: ~85% of Middle East polyethylene exports route through Hormuz. Implications for packaging, automotive components, and consumer goods are still playing out. QatarEnergy declared force majeure on LNG contracts on March 4, creating downstream disruption for utility and industrial buyers across Europe and Asia. Downstream effects on agriculture, manufacturing, and retail continue to materialize.

For supply chain managers, procurement directors, and commodity traders, there is no single source that maps real-time tanker traffic, war risk insurance levels, oil price and alternative-route pipeline capacity, AND downstream commodity price impacts all in one place. Bloomberg and Reuters have data but no unified operational view. FourKites and project44 track cargo but not geopolitical disruption signals. HormuzWatch fills this gap.

## Target Audience / User

- **Primary:** Supply chain directors and procurement managers at manufacturers, chemical companies, ag input distributors, and energy-intensive industries ($1B+ revenue)
- **Secondary:** Commodity traders and risk managers at trading desks tracking energy and ag inputs; logistics managers rerouting cargo through alternative lanes
- **Tertiary:** Journalists and policy analysts covering the conflict's economic impact; insurers and P&I clubs tracking claims exposure

**User persona:** "Sarah" — VP of Supply Chain at a mid-sized specialty chemicals manufacturer. 40% of her feedstocks are petrochemical derivatives with Middle East supply chains. As of March 1, she has 3 containers stranded at anchorage outside Jebel Ali and 2 shipments of ethylene feedstock with no confirmed routing. She's getting news from Bloomberg but can't see a clear operational picture of what's moving, what's stuck, and how to reroute. She needs a war room dashboard, not a news feed.

## Vibe / Goals

- **Vibe:** Mission-critical, operational, real-time. Feels like a Bloomberg Terminal crossed with a military situation room — decisive and fast.
- **Core goals:**
  1. Give supply chain professionals a unified, live operational view of Hormuz disruption across all commodity classes
  2. Quantify downstream commodity price impact to help buyers know what price increases to expect and when
  3. Track alternative routing capacity (Yanbu pipeline, Cape of Good Hope diversions, alternative suppliers) to identify workarounds

## Aesthetic

- Dark background, high-contrast data display — command center aesthetic
- Map of the Persian Gulf and Strait of Hormuz as the hero element, with live vessel position data overlay
- Color-coded alerts: red for blocked lanes, yellow for at-risk routes, green for confirmed alternates
- Commodity price mini-charts for oil, LNG, urea, polyethylene, steel embedded in the main view
- Mobile-responsive for crisis monitoring on the go
- Inspiration: Vessel Finder / MarineTraffic crossed with a Bloomberg Commodity Dashboard

## UX Ideas

*Original features:*

1. **Hormuz live map:** Real-time AIS vessel position data overlaid on the Strait and surrounding waters — shows vessels anchored, transiting, or diverted; color-coded by cargo type (tanker, container, LNG)
2. **Insurance pulse:** Live war risk insurance premium tracking from Lloyd's and key underwriters; displayed as a "Transit Viability Score" (0–100) that integrates premium levels with incident frequency
3. **Commodity cascade tracker:** Price impact dashboard for 12 key commodities that transit Hormuz — oil, LNG, LPG, urea, ammonia, polyethylene, methanol, steel, aluminum — showing current vs. 30-days-ago price with "Hormuz attribution" estimate; add helium and aluminum as semiconductor supply chain proxies (per Tom's Hardware / TechSoda coverage)
4. **Alternative route capacity:** Real-time utilization of Yanbu/Saudi East-West Pipeline, Abu Dhabi Crude Oil Pipeline, Cape of Good Hope diversions, and Bab el-Mandeb/Red Sea pass-through — with daily capacity and current throughput; note Saudi Petroline → SUMED pipeline route to Mediterranean
5. **Cargo exposure calculator:** User inputs their supply chain (country of origin, commodity type, carrier) → tool estimates disruption impact, ETA delay, and cost uplift
6. **Escalation/de-escalation timeline:** Curated diplomatic and military event feed with probability-weighted "strait reopening" scenarios (30/60/90-day estimates) with analyst price scenario bands (base/adverse/resolution)

*New features surfaced by competitive research (2026-03-16):*

7. **AIS blackout and spoofing detection layer:** Windward data reveals 44 GPS injection zones and 92 AIS denial areas active in the Gulf. Overlay these as a map layer; flag vessels whose AIS signal disappeared within the zone and reappeared elsewhere ("dark transit" detector). This is the single most-requested signal from X.com maritime analyst discourse — raw AIS counts are known lower bounds, not ground truth.
8. **Intraday crossing counter:** 30-minute rolling transit count by ship type (VLCC, Suezmax, MR tanker, container, LNG), mirroring what Bloomberg's `TRHBTKCD Index <GO>` provides but accessible without a terminal. This is what Michael McDonough built on March 13 and instantly went viral — clear unmet demand.
9. **Port operational status board:** Live status for Gulf ports with color-coded operational state: Jebel Ali (congested), Khalifa / APM Terminals Bahrain (suspended March 12–13), Salalah Oman (suspended March 11), Hamad Port Qatar (restricted), Dammam, Ras Laffan. Updated from carrier advisories and UKMTO notices.
10. **Carrier booking freeze tracker:** Which major carriers (Maersk, Hapag-Lloyd, CMA CGM, MSC, COSCO) have suspended or embargoed bookings to which ports, with dates and reinstatement conditions — sourced from carrier advisory pages.
11. **Force majeure tracker:** Log of official force majeure declarations affecting Hormuz commodities (QatarEnergy LNG force majeure declared March 4, 2026; track subsequent FM events from energy majors, chemical producers, and shipping companies).
12. **Country exposure dashboard:** Show which import-dependent countries face the greatest risk — Japan (87% fossil fuel import dependency, 1.6 mbpd through Hormuz), South Korea, India, China — with estimated GDP/trade deficit impact at $80, $100, $120/barrel oil. Useful for policy analysts and risk managers with Asian counterparty exposure.
13. **Mine threat overlay:** IRGC naval mine deployment began March 10 per US military intelligence. Overlay known/suspected mine-laying areas on the map as a distinct risk layer separate from AIS traffic. Source: UKMTO / JMIC incident reports.
14. **Semiconductor/tech supply chain impact panel:** Specialized view showing helium (from Ras Laffan, now under force majeure), aluminum, and LNG feedstocks as leading indicators for semiconductor fab disruption — a gap identified by Tom's Hardware and TechSoda coverage that no existing tracker addresses.

## Competing / Existing Products

*Updated 2026-03-16 with exhaustive web + X.com research.*

### Free Crisis Dashboards (Launched in Response to This Crisis)

| Product | URL | Strengths | Gaps |
|---|---|---|---|
| **Hormuz Strait Monitor** | hormuzstraitmonitor.com | Free; AI-powered analysis; AIS tracking; oil prices + insurance premiums; news aggregation; hourly updates | No commodity cascade analysis; no cargo exposure calculator; no alternative route capacity |
| **Hormuz Tracker** | hormuztracker.com | Free; continuous updates; carrier booking status per port; consumer impact estimates; AIS reliability warnings | No map; no commodity price tracking beyond oil; no alternative routing; no insurance premium detail |

Both are free, consumer-oriented dashboards. Neither covers fertilizer, petrochemicals, or multi-commodity cascades. Neither offers a cargo exposure calculator or actionable rerouting analysis. Both lack the depth needed by supply chain professionals making operational decisions.

### Enterprise Maritime Intelligence Platforms

| Product | Strengths | Gaps |
|---|---|---|
| **Windward Maritime AI** | Publishing daily Iran War Intelligence Dailies; Remote Sensing Intelligence (SAR/EO satellite + RF fusion); spoofing-proof vessel identity; dark fleet detection; detects 44 GPS injection zones + 92 AIS denial areas; mine threat tracking | Enterprise pricing (freemium but no public rates); government/defense tilt; no commodity cascade or supply chain exposure view |
| **Kpler** | Deep tanker chartering suite: tonnage lists, cargo lists, fixture data, voyage economics, freight analytics; confirmed 92% transit collapse data; stranded vessel counts (247 MR+ vessels = ~6% global DWT) | Energy/LNG-focused; expensive subscription; no fertilizer, petrochemical, or manufacturing supply chain coverage |
| **MarineTraffic / VesselFinder** | Real-time AIS vessel tracking; widely trusted baseline; predictive vessel schedules weeks out | Raw vessel data only; no commodity price, insurance, or disruption analysis layer |
| **Portcast** | Live spreadsheet of affected vessels; port congestion data; carrier advisory tracking | Spreadsheet format (not a live dashboard); no commodity prices or macro disruption view |
| **Apify Shipping Disruption Tracker** | Monitors 6 chokepoints (Hormuz, Red Sea, Suez, SCS, Panama, Black Sea); structured JSON output; commodity prices + risk scores; runs on schedule via Apify or on-demand via MCP | Developer tool, not a human-facing dashboard; no AIS vessel-level detail |

### Data/Terminal Products

| Product | Strengths | Gaps |
|---|---|---|
| **Bloomberg Terminal (WSL SHIPPING / TRHBTKCD)** | 30-minute intraday Hormuz crossing data by ship type; dedicated HORMUZ TRACKER publication; commodity prices, news | $25K+/year; fragmented across modules; requires terminal training; no unified operational view |
| **S&P Global Platts** | Commodity price benchmarks | Subscription required; data products, not crisis operational tools |
| **project44 / FourKites** | Individual cargo visibility and ETAs | Tracks individual shipments; no macro disruption analysis or commodity cascades |

### Observation from X.com Activity

Bloomberg economist Michael McDonough (@M_McDonough) launched an intraday Hormuz crossing tracker on March 13 (per X post), filling demand that Bloomberg Terminal users were expressing. Barry Ritholtz (@Ritholtz) and major financial media were sharing Bloomberg terminal codes (`TRHBTKCD Index <GO>`, `WSL SHIPPING<GO>`) as workarounds — confirming that even sophisticated Bloomberg users lacked a unified operational picture. This is the clearest market signal that the gap HormuzWatch targets is real and actively felt.

**White space confirmed:** No tool combines live AIS vessel data + AIS spoofing/blackout detection + war risk insurance signals + multi-commodity price cascades (oil, LNG, urea, polyethylene, fertilizer) + port operational status + carrier booking freezes + alternative routing capacity — in a single, affordable, non-Bloomberg operational dashboard for supply chain professionals.

## Data That Might Be Needed

- **AIS vessel position data:** MarineTraffic, VesselFinder, or direct AIS feed (commercial license ~$500-5K/month)
- **War risk insurance premiums:** Lloyd's market data, joint hull committee bulletins (some public, some subscription)
- **Oil benchmark prices:** EIA API (free), CME Group futures (delayed free / real-time paid), IEA reports
- **LNG and LPG prices:** ICIS, Platts (subscription), or proxied from Henry Hub + shipping spread
- **Fertilizer prices (urea, ammonia):** DTN/Progressive Farmer, CME urea futures, USDA AMS
- **Petrochemical prices:** ICIS Chemical Business (subscription), proxied from oil spread models
- **Pipeline capacity data:** Saudi Aramco/SABIC reports, S&P Global, government press releases
- **SCFI / Freightos ocean rates:** Freightos FBX Index (free), Xeneta, Baltic Exchange
- **News/diplomatic events:** GDELT, Reuters API, News API for escalation tracking
- **NOAA/military AIS exclusion zones:** USCG NAIS, AIS broadcast regions

## High-Level Design / Implementation Ideas

### Architecture
- **Frontend:** Next.js with Mapbox GL JS for interactive vessel map; React for dashboard components
- **Backend:** Python/FastAPI for data aggregation and API serving; Celery for scheduled data pulls
- **Database:** TimescaleDB (time-series commodity prices + vessel positions), PostgreSQL (reference data)
- **Data pipeline:** Airflow or Prefect for orchestrating multi-source feeds; Redis for real-time caching
- **Key integrations:** MarineTraffic AIS API, EIA API, Freightos FBX, GDELT news, CME futures feed

### Key Technical Components
1. **AIS ingestor:** Streaming or polling integration with commercial AIS provider; normalize vessel positions, cargo type, status into geo-indexed TimescaleDB
2. **Commodity price tracker:** Daily pulls from free APIs (EIA, CME delayed); compute rolling 30-day change and "Hormuz attribution" delta (current minus pre-crisis baseline)
3. **Insurance signal aggregator:** Scrape/subscribe to Lloyd's Joint War Committee bulletins and broker advisories; maintain a "war risk zone" layer with premium estimates
4. **Alternative route capacity model:** Maintain a simple capacity model for each alternative route (max throughput vs. current estimated throughput from available public data)
5. **Scenario engine:** Simple probabilistic model for strait reopening scenarios based on diplomatic event feed; produces ETA distributions for supply normalization

### MVP Scope
- Live vessel map for the Persian Gulf / Strait of Hormuz with AIS data
- Oil and urea price tracker with pre-crisis baseline comparison
- Alternative pipeline capacity summary (manually maintained for MVP; automated later)
- Escalation/de-escalation timeline (curated news feed with date/event/source)
- Cargo exposure calculator (simple form → cost impact estimate)
- Email alerts for key threshold breaches (oil >$110, urea >$750, transit viability below 20)

### Growth Path
- Expand to all global chokepoints (Suez/Red Sea, Bab el-Mandeb, Panama, Malacca)
- Add user-specific cargo tracking integration (connect to project44 or FourKites via webhook)
- Build forward market integration (CME oil futures term structure as disruption duration signal)
- Add insurance claim tracking (P&I club announcements)
- B2B API for logistics platforms to embed disruption data in their own systems
- Expand commodity coverage to include steel, aluminum, rare earths transiting adjacent lanes

---

## Changelog

| Date | Author | Summary |
|---|---|---|
| 2026-03-15 | Auto-generated | Initial spec created via trend-research-ideator skill |
| 2026-03-16 | Research update (web + X.com) | Expanded competitive landscape with 9 products (added HormuzStraitMonitor.com, HormuzTracker.com, Windward Maritime AI, Portcast, Apify tracker, Bloomberg HORMUZ TRACKER feature); added 8 new UX feature ideas surfaced by competitive research (AIS spoofing detection, intraday crossing counter, port status board, carrier booking freeze tracker, force majeure tracker, country exposure dashboard, mine threat overlay, semiconductor impact panel); updated white space analysis with X.com signal from Bloomberg economist's viral March 13 tracker launch |
| 2026-03-16 (run 4) | Trend refresh | Updated problem statement: new supreme leader Mojtaba Khamenei confirmed Hormuz closure; oil now $104.63/barrel (up 40%+ since Feb 28); daily transits at only 5 (vs. 138 historical); Iran threatening $200 oil; Trump coalition efforts getting muted response; DFC/Lloyd's joint insurance backstop proposed; Oxford Economics $140/barrel recession scenario; QatarEnergy LNG force majeure context |
