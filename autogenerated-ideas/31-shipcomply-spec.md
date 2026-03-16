# ShipComply — USTR Chinese Vessel Fee Compliance Navigator

> **Generated:** 2026-03-16 | **Sector:** Shipping / Trade Compliance

---

## Problem Statement

On October 14, 2025, the USTR's Section 301 action targeting Chinese maritime dominance took effect, imposing port-entry fees on Chinese-operated and Chinese-built vessels calling at U.S. ports. The fees are significant and escalating: as of **April 17, 2026**, fees will increase to **$80/net ton** for Chinese vessel operators (capped at 5 charges/year/vessel), and **$153/container discharged** for Chinese-built vessels operated by non-Chinese operators — rising to $195 (2027) and $250 (2028). For context, Cosco and OOCL combined face an estimated **$2.18 billion** in USTR port fees in 2026 alone. China retaliated with mirror fees: 640 yuan (~$88) per net ton on U.S.-linked vessels at Chinese ports starting April 17.

The compliance challenge is acute. Key terms — "Chinese-built," "Chinese-operated," and "Chinese-controlled" — are not defined in the statute, and USTR has not issued clarifying guidance on what minority ownership stakes trigger the "Chinese-controlled" classification. This ambiguity exposes freight forwarders, NVOCCs, and importers to fees, delays, and port-entry denials they didn't anticipate. A single misclassified voyage can trigger a $1M+ port entry fee. With 15% of U.S. port calls in 2024 made by Chinese-constructed vessels and 21% of Transpacific/Transatlantic TEU capacity on China-built tonnage, the scope is enormous.

Most importers and freight forwarders have no systematic way to know whether the carrier they're booking has a Chinese-built vessel on the relevant service, whether their booking will trigger a fee, or how to document vessel origin to avoid disputes at the port gate. Customs brokers are fielding frantic calls but lack a tool that aggregates vessel build history, operator ownership structure, fee calculations, and documentation requirements in one place.

## Target Audience / User

- **Primary:** Import compliance managers and logistics directors at mid-size importers shipping from Asia ($50M–$500M annual import spend), who book freight across multiple carriers and need to know their total USTR fee exposure before committing to a carrier
- **Secondary:** Freight forwarders and NVOCCs managing many shipper accounts; they need carrier-level fee status dashboards to advise clients and avoid surprise surcharges
- **Tertiary:** Customs brokers and trade attorneys advising clients on documentation requirements, fee disputes, and CBP protest filing for misclassified charges

**User persona:** "David" — Import Manager at a mid-size electronics distributor importing ~$80M/year from East Asia. He books with 5 different ocean carriers depending on rate and service. After the April 17 fee increase he realized one carrier's flagship Transpacific service runs on COSCO-built vessels — which triggers the $153/container fee on his shipper. He had no idea until a carrier surcharge notice arrived. He now needs a dashboard that tells him for each carrier/service: is this Chinese-built? What's the per-container fee? What documentation do I need? What's my total exposure this quarter?

## Vibe / Goals

- **Vibe:** Compliance-grade, trustworthy, institutional. Feels like Avalara for trade compliance or Descartes Customs Info — authoritative and accurate, not flashy.
- **Core goals:**
  1. Give importers and freight forwarders a clear, up-to-date view of USTR fee exposure by carrier and service
  2. Help users generate the documentation required to establish vessel origin and operator nationality, reducing dispute risk at ports
  3. Alert users when vessel assignments on booked services change (vessels rotate across services frequently)

## Aesthetic

- Clean, enterprise-grade UI — white/light grey with navy/blue accents
- Table-heavy layout with clear red/yellow/green fee status indicators per vessel/carrier
- Desktop-primary (compliance workflows happen at desks, often with customs broker systems open)
- No maps needed — this is a reference/compliance tool, not operational tracking
- Printable compliance documentation templates built into the UX
- Inspiration: Descartes Global Logistics Network meets SAP GTS compliance screens, but without the SAP complexity

## UX Ideas

1. **Carrier/service fee lookup:** Search by carrier name, service name, or routing (e.g., "MSC Pearl Express AEX service") → returns vessel roster for that service, build country for each vessel, operator nationality, applicable USTR fee tier, and per-container or per-NT estimated fee
2. **Exposure calculator:** Input booking details (carrier, service, TEU count, vessel name if known) → calculates estimated USTR fee exposure per shipment and per quarter; shows Chinese counterfee impact on return legs
3. **Vessel ownership tracer:** For any vessel IMO number, traces the ownership chain — beneficial owner, registered operator, shipbuilder (with country), build year — using Lloyd's Register and Equasis data to support documentation for fee disputes
4. **Document generator:** Pre-fill USTR Annex compliance documentation (vessel nationality certificates, build records) for customs submission; generate CBP protest template if incorrect fee was charged
5. **Service change alerts:** User subscribes to carrier services; when vessels rotate on/off a service (common, happens every few weeks), receives alert showing new vessel list and any fee status changes
6. **Carrier fee pass-through tracker:** Which carriers are passing USTR fees through as explicit surcharges (like BAF) vs. absorbing them? Aggregated from carrier tariff filings and industry press — helps procurement teams negotiate rate adjustments

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **Descartes Customs Info** | Deep HTS/duty rate database; widely used by customs brokers | No USTR maritime fee data; focuses on goods duties, not vessel fees |
| **Lloyd's Register / Equasis** | Vessel ownership and build records | Raw data lookup only; no fee calculation, no compliance workflow |
| **Maritime trade lawyers** | Deep expertise on ambiguous terms | Not a scalable, self-service tool; expensive for per-shipment decisions |
| **Carrier tariff filings (SAM.gov / FMC)** | Official surcharge information | Scattered; no aggregation; no exposure modeling |
| **Flexport / Freightos** | Freight booking platforms | Rate comparison only; no USTR fee breakdown or compliance documentation |

**White space:** No tool aggregates vessel build nationality + operator ownership + USTR fee calculation + documentation generation in a single compliance workflow for importers and freight forwarders.

## Data That Might Be Needed

- **Lloyd's Register of Ships:** Vessel build records, builder nationality, flag — commercial API, paid
- **Equasis:** Vessel ownership and management data — free public database
- **IHS Markit / Sea-web:** Comprehensive vessel data with ownership chains — paid license
- **FMC tariff database:** Carrier surcharge filings including USTR fee pass-through schedules — public
- **USTR FR notices and Annexes:** Official fee schedules and amendments — public (FR / regulations.gov)
- **USTR CBP guidance circulars:** Enforcement and documentation requirements — public
- **AIS vessel assignment data:** Which vessels are currently assigned to which services — MarineTraffic commercial API
- **China Ministry of Transport fee schedule:** For counterfee exposure on return legs — public (translated)
- **CBP protest process documentation:** For dispute resolution templates — CBP.gov public

## High-Level Design / Implementation Ideas

### Architecture

- **Frontend:** Next.js with TypeScript; table-heavy interface with React Query for real-time data
- **Backend:** Python/FastAPI; vessel lookup and fee calculation as microservices
- **Database:** PostgreSQL for vessel registry, fee schedules, user bookings, and alert subscriptions
- **Data pipeline:** Weekly batch ingestion of Lloyd's Register/Equasis updates; daily scrape of carrier surcharge pages; USTR Federal Register monitoring via Regulations.gov API
- **Key integrations:** Equasis public API, Lloyd's Register API (commercial), FMC eFiling system

### Key Technical Components

1. **Vessel Classification Engine:** Given IMO number, resolves build country and operator nationality using Lloyd's/Equasis chain; applies USTR fee tier logic with ambiguity flags for contested cases (partial Chinese ownership, shell company structures)
2. **Fee Calculator:** Parameterized fee model — takes vessel type, NT rating or TEU count, operator tier, and applicable date → returns per-voyage/per-container fee; updates automatically when USTR fee schedule changes
3. **Service-Vessel Mapper:** Maintains current vessel roster per carrier service by scraping carrier websites and voyage planning tools; triggers alerts when roster changes
4. **Document Generator:** Templated PDF/Word document builder for USTR compliance filings — pre-fills vessel build data, ownership chain, CBP protest forms
5. **Alert Engine:** User watchlist of carrier services → evaluates vessel change events → push/email notification with fee impact delta

### MVP Scope

- Vessel lookup (IMO number → fee classification + documentation)
- 20 major carrier service fee status tables (top Transpacific/Transatlantic services)
- Basic exposure calculator (TEU count + carrier service → quarterly fee estimate)
- USTR fee schedule reference (current + upcoming April 17 / 2027 / 2028 rates)
- Simple document checklist for CBP compliance

### Growth Path

- Booking system integrations (Flexport, Freightos, CargoWise) to auto-calculate fees at time of booking
- AI-powered ownership chain analysis for ambiguous Chinese-controlled vessel cases
- Historical fee audit tool (for businesses auditing charges from Oct 2025 onward)
- Expand to cover China's CMOT counterfees for U.S.-linked vessel operators exporting to China
- Customs broker white-label API for embedding in their existing client portals

---

## Changelog

| Date | Author | Summary |
|---|---|---|
| 2026-03-16 | Auto-generated | Initial spec created via trend-research-ideator skill (Run 4) |
