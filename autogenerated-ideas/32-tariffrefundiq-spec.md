# TariffRefundIQ — IEEPA Tariff Refund Claim Assistant

> **Generated:** 2026-03-16 | **Sector:** Shipping / Trade Policy / Legal

---

## Problem Statement

In February 2026, the U.S. Supreme Court ruled in *Learning Resources, Inc. v. Trump* that President Trump's use of IEEPA emergency powers to impose the sweeping "Liberation Day" tariffs of April 2025 was unconstitutional. The government estimates it collected **$166 billion** in IEEPA tariffs from **more than 330,000 businesses** between April 2025 and the ruling's effective date. U.S. Customs and Border Protection (CBP) is now building a refund processing system — but the path to actually recovering those funds is not automatic. Businesses must file **CBP protests** within the applicable statute of limitations, navigate complex documentation requirements, and track their claims through an agency system that is simultaneously managing unprecedented refund volume.

The problem is acute for small and mid-sized importers. Large enterprises have dedicated customs counsel, in-house compliance teams, and relationships with major customs brokers who can file protests at scale. SMBs — which make up the vast majority of the 330,000 affected businesses — typically lack these resources. Many don't know the claims process exists, don't know the filing deadline, and have not organized their entry records in a way that enables filing. Meanwhile, customs brokers are overwhelmed: one filing window, hundreds of clients, each with potentially dozens of entries.

There is no self-service tool that: (1) helps importers estimate how much they overpaid in IEEPA tariffs, (2) walks them through the CBP protest process, (3) generates the required documentation, and (4) tracks the status of submitted claims. CBP's ACE portal requires a licensed customs broker or importer of record credentials to access. The clock is ticking — CBP protests generally must be filed within 180 days of liquidation of the entry, meaning some April/May 2025 entries may already be approaching the deadline.

## Target Audience / User

- **Primary:** Small-to-mid importers (1–100 employees) who paid IEEPA tariffs between April 2025 and February 2026 and want to recover their overpayments — especially those without dedicated customs counsel
- **Secondary:** Customs brokers managing refund claims for multiple shipper clients; they need efficiency tools to process claims at scale across many client entries
- **Tertiary:** E-commerce businesses and direct-to-consumer brands that imported from China or other affected countries during the tariff window; many of these businesses have high-volume entry counts and potentially large aggregate refund claims

**User persona:** "Kevin" — founder of a 25-person sporting goods business that imports from Vietnam and China. He paid roughly $340,000 in IEEPA tariffs between May and December 2025 before his customs broker mentioned the SCOTUS ruling. He knows he might be owed money but has no idea how to file a protest, doesn't know which entries are eligible, and can't afford a trade attorney to handle it. He's looking for something like TurboTax for tariff refunds: a guided wizard that takes his entry data, calculates his refund, and generates the paperwork.

## Vibe / Goals

- **Vibe:** Trustworthy, precise, reassuring. Feels like TurboTax meets a customs broker portal — guided, step-by-step, demystifying a scary government process.
- **Core goals:**
  1. Help importers estimate their IEEPA tariff overpayment across all affected entry periods
  2. Generate correctly formatted CBP protest documents with the right legal basis and supporting evidence
  3. Track claim status from submission through refund issuance, with deadline alerts

## Aesthetic

- Clean, warm white interface — reassuring, not intimidating
- Wizard-style progress flows for each claim (breadcrumb navigation: "Estimate → Document → File → Track")
- Dollar amount hero stat front and center: "Estimated refund: $47,230"
- Mobile-responsive for business owners checking status on the go
- Desktop-primary for the document generation and filing steps
- Inspiration: TurboTax's guided interview style + Pilot.com's clean SaaS bookkeeping aesthetic

## UX Ideas

1. **Refund estimator wizard:** User inputs HTS codes, country of origin, entry dates (April 2, 2025 onward), and dutiable value per shipment → tool calculates total IEEPA tariff paid, cross-referenced against the IEEPA rates that were applied; shows estimated refundable amount broken down by entry
2. **Entry importer:** Users can upload CBP entry summaries (Form 7501), CBP-generated entry history exports, or CSV exports from their customs broker's system → auto-populates claim data, identifies IEEPA-affected entries vs. Section 301/232 entries that remain valid
3. **CBP protest generator:** For each eligible entry, generates a pre-filled protest document (CBP Form 19) with the correct legal basis (*Learning Resources v. Trump*, constitutional grounds), supporting documentation checklist, and importer signature blocks
4. **Deadline tracker:** Shows for each entry the liquidation date and the 180-day protest window deadline; red/yellow/green urgency indicators; email reminders 30, 14, and 3 days before deadlines
5. **Claim status dashboard:** After filing, users log protest submission confirmation numbers; tool tracks status via CBP's public protest status lookup or manual updates; shows aggregate expected refund across all pending protests
6. **Customs broker connect:** Optional: submit your refund estimation report to a partnered licensed customs broker who will file on your behalf for a contingency fee (useful for high-volume importers or those who can't file as their own IOR)

## Competing / Existing Products

| Product | Strengths | Gaps |
|---|---|---|
| **CBP ACE Portal** | Official filing system; authoritative | Requires IOR credentials or licensed broker; no guided workflow; no estimation tool |
| **Trade attorneys (firms)** | Expert guidance on complex cases | Expensive ($500-800/hr); not accessible to SMBs; no self-service |
| **Customs brokers** | Can file protests on client behalf | Overwhelmed with claims volume; no self-service tool; manual process per client |
| **Flexport / Shipbob** | Have customer relationships and entry data | Not focused on protest filing; no refund tracking product |
| **TradeMark's TradeHarbor** | Customs management for importers | Compliance/classification focused; no protest/refund workflow |

**White space:** No self-service tool walks SMB importers through IEEPA refund estimation, protest documentation, and claim tracking — leaving the 330,000 affected businesses to navigate a complex government process alone.

## Data That Might Be Needed

- **CBP IEEPA tariff rate schedules:** Historical rates applied April 2025 – Feb 2026 by HTS/country of origin — public record from USTR/Federal Register
- **CBP ACE entry data:** Importers can request their own entry history via ACE; tool imports this export
- **CBP protest regulations (19 CFR Part 174):** Rules governing protest filing timelines and requirements — public
- **SCOTUS ruling (Learning Resources v. Trump):** Full text of ruling as legal basis citation — public
- **CBP protest status lookup:** CBP's public protest tracking by protest number — public
- **HTS code database (USITC):** For classifying entries and mapping to IEEPA-affected codes — public API
- **Federal Register historical:** IEEPA tariff rate tables and modification notices — public
- **CBP Form 19 template:** Official protest form with required fields — public (CBP.gov)

## High-Level Design / Implementation Ideas

### Architecture

- **Frontend:** Next.js with React; wizard-style flows using multi-step form libraries (React Hook Form + Zod validation)
- **Backend:** Python/FastAPI; tariff calculation engine, document rendering, deadline management
- **Database:** PostgreSQL for user accounts, entries, protests, and deadline tracking
- **Document generation:** PDF generation via Puppeteer or WeasyPrint for CBP Form 19; pre-filled from structured data
- **File handling:** S3-compatible storage for uploaded CBP entry documents; parsing via tabular data extraction

### Key Technical Components

1. **IEEPA Entry Classifier:** Given an entry's HTS code, origin country, and date, determines if it was subject to IEEPA tariffs (vs. Section 301/232 which remain valid); calculates the IEEPA-specific rate applied
2. **Entry Document Parser:** Accepts CBP 7501 entry summary PDFs or CSV broker exports; extracts entry number, liquidation date, HTS codes, dutiable value, and duties paid; identifies IEEPA vs. non-IEEPA duty components
3. **Protest Document Builder:** Templated document renderer that produces CBP Form 19 protests with correct legal citations, entry data pre-filled, and attachments checklist
4. **Deadline Engine:** Calculates 180-day protest window from each entry's liquidation date; maintains urgency queue; triggers email/SMS reminders at configurable intervals
5. **Customs Broker API:** Partner integration allowing licensed brokers to receive structured protest packages from the platform for filing via ACE; splits economics (platform earns referral fee on contingency)

### MVP Scope

- Manual entry input (HTS code, origin, date, dutiable value) → IEEPA refund estimate
- Deadline calculator for the top 20 affected entry windows (April–August 2025 entries most urgent)
- CBP Form 19 protest PDF generator with correct legal basis
- Email deadline reminders
- Simple status dashboard to track protest submissions

### Growth Path

- CSV/PDF upload of CBP entry summaries for bulk entry import
- ACE portal integration (if CBP enables third-party read access for importers)
- Customs broker marketplace (contingency-fee referrals for filing)
- Expand to Section 301 exclusion claims (separate but related refund opportunity)
- Alert system for future tariff legal challenges (USMCA, Section 232 steel exclusions)

---

## Changelog

| Date | Author | Summary |
|---|---|---|
| 2026-03-16 | Auto-generated | Initial spec created via trend-research-ideator skill (Run 4) |
