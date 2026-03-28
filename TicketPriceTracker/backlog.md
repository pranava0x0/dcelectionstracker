# TicketPriceTracker — Product Backlog

> Prioritized by implementation order (dependencies first) and impact vs. effort.
> Competitive context: existing tools (TicketData, Event-Spy, SeatGeek, TickPick) cover basic price viewing but miss: unified history, mobile alerts, arbitrage detection, buy/wait AI, and Discord/fan community integrations.

---

## Priority 1 — Foundation (Do First)

### 1. SQLite Price History Store
**Goal:** Persist every scrape run to a local database instead of appending to a flat markdown file.
**Why:** Everything downstream (charts, alerts, buy/wait ML, trend analysis) depends on structured historical data. Currently `ticket_prices.md` is append-only markdown — unqueryable.
**Implementation:**
- Schema: `events(id, name, venue, date)`, `scrapes(id, event_id, scraped_at)`, `listings(id, scrape_id, platform, price, section, row, qty, fee_policy)`
- Deduplication: unique key on `(scrape_id, platform, section, row, price)` — `INSERT OR IGNORE`
- Backfill: parse existing `ticket_prices.md` entries into DB on first run
- Tool: Python `sqlite3` stdlib, Pydantic for row validation

**Frameworks:** Python + SQLite + Pydantic
**Complexity:** Low-Medium (1–2 days)
**Uniqueness vs. competition:** Foundational — required before any differentiation is possible.

---

### 2. Automated Scheduler (Cron / Interval Polling)
**Goal:** Run scrapes on a configurable interval (e.g., every 15 min) automatically without manual invocation.
**Why:** Price data is only useful if it's continuous. Currently requires manual runs.
**Implementation:**
- `schedule` Python library or a cron job calling `python scraper.py --event <id>`
- Configurable per-event polling interval in a `config.yaml`
- Log each run to `logs/scrape_YYYY-MM-DD.log`
- Graceful shutdown on `SIGTERM`; skip run if previous still in flight

**Frameworks:** Python `schedule` or system cron + `logging`
**Complexity:** Low (half a day)
**Uniqueness:** Table stakes. Distill.io and Visualping do this generically; this is ticketing-native.

---

### 3. SeatGeek Scraper Fix + Robust Anti-Block Layer
**Goal:** Fix the SeatGeek scraper (currently returns "site may have blocked scraping") and add shared resilience across all scrapers.
**Why:** SeatGeek is one of the best-value platforms — missing it distorts comparisons. Also Gametime showed a $29 price that was clearly a data error; validation is needed.
**Implementation:**
- Rotate User-Agent strings per request
- Playwright-based headless browser fallback for JS-heavy pages (SeatGeek, StubHub)
- Price sanity validation: flag any price > 5× median or < $10 for events where floor is known to be $50+
- Per-platform retry with exponential backoff on 429/503
- Log all block events to `issues.md`

**Frameworks:** Playwright (Python), `fake-useragent`, `tenacity`
**Complexity:** Medium (1–2 days)
**UX note:** Anomalous prices (the $29 Gametime listing) should be flagged with a ⚠️ in output, not silently included as "best deal."

---

### 4. Multi-Event Config + CLI
**Goal:** Track multiple events simultaneously via a config file, not hardcoded strings.
**Why:** Current tool appears to be hardcoded for one NCAA game. Generalizing unlocks all downstream value.
**Implementation:**
- `events.yaml`: list of events with `name`, `venue`, `date`, `urls` per platform, `qty`, `poll_interval_min`
- CLI: `python tracker.py add-event`, `python tracker.py list`, `python tracker.py run --event <id>`, `python tracker.py report --event <id>`
- Validate URLs at add-time; warn if platform URL pattern is unrecognized

**Frameworks:** Python `click` or `argparse`, PyYAML
**Complexity:** Low-Medium (1 day)
**Uniqueness:** Event-Spy supports multiple events on a freemium model — this is the same baseline.

---

## Priority 2 — Core Value (Do Next)

### 5. Price History Charts (Terminal + HTML)
**Goal:** Visualize how the cheapest price per platform has changed over time for a given event.
**Why:** The single most-requested missing feature across ticket tracking tools — "has the price been going up or down?" This is the key consumer question. TicketData built their whole brand on this.
**Implementation:**
- Query DB for cheapest price per platform per scrape timestamp
- Terminal: `rich` or `plotext` sparkline in the CLI report
- HTML: Jinja2 template + Chart.js line chart, one line per platform, x-axis = time, y-axis = price
- Export: `python tracker.py report --event <id> --format html > report.html`
- Highlight the all-time low with a marker

**Frameworks:** Python + Jinja2 + Chart.js (static HTML, no server needed)
**Complexity:** Medium (1–2 days)
**UX Design:**
- Clean dark-mode dashboard aesthetic (Tailwind CSS)
- Color-coded lines per platform (consistent across reports)
- Hover tooltips: "Section 423, Row Q — $286"
- Mobile-first responsive layout

**Uniqueness vs. competition:** TickPick has a mini price history graph. TicketData has section-level trends. This project can match that for any event on any platform without being a marketplace.

---

### 6. Price Alerts (Email + SMS)
**Goal:** Notify the user when a price drops below a user-set threshold on any platform.
**Why:** The core "I don't want to keep checking" use case. Every major platform has this but only for their own inventory.
**Implementation:**
- Alert config in `events.yaml`: `alert_below: 280` per event
- On each scrape, compare cheapest across all platforms to threshold
- Email: `smtplib` with Gmail App Password or SendGrid free tier
- SMS: Twilio free trial ($15 credit) or `ntfy.sh` (free, no account needed for basic push)
- Deduplication: don't re-alert for same price point within 1 hour
- Alert body: "Vivid Seats — Section 423, Row Q: $271/ea. View: [url]"

**Frameworks:** Python `smtplib` / Twilio SDK / ntfy.sh HTTP API
**Complexity:** Low-Medium (1 day)
**UX Design:** Plain-text email with a single CTA button. SMS keeps it to 2 lines max.
**Uniqueness:** Cross-platform alerts in a single message — no competitor does this. SeatGeek alerts only for SeatGeek inventory; StubHub alerts only for StubHub.

---

### 7. Cross-Platform Arbitrage Detector
**Goal:** Identify when the same seat section is significantly cheaper on one platform vs. another.
**Why:** The data already shows this — Section 417H was $291 on Vivid Seats and $363 on Gametime in the same scrape. Users don't know to look for this.
**Implementation:**
- Group listings by `(section, approx_row)` across platforms in the same scrape
- Flag any pair where price delta > 15% and both have qty ≥ requested
- Surface in report: "⚡ Arbitrage: Section 417, Row H — $291 on Vivid Seats vs. $363 on Gametime (25% cheaper)"
- Include in alert email if threshold is met

**Frameworks:** Pure Python, pandas for grouping (or raw SQL)
**Complexity:** Low (half a day, given DB is in place)
**Uniqueness:** No existing consumer tool does real-time cross-platform arbitrage detection. This is a genuine gap in the market.

---

### 8. StubHub Multi-Session Detector
**Goal:** Automatically detect when a platform is listing "all sessions" tickets vs. single-game tickets and flag/exclude them.
**Why:** The StubHub listings currently get flagged manually in notes ("NOTE: All Sessions (3/27 & 3/29)"). This corrupts the cheapest-price comparison — $287 for two games is not cheaper than $308 for one.
**Implementation:**
- Parse listing description/title for keywords: "all sessions", "session 1 & 2", "package"
- Flag such listings with `is_multi_session: true` in DB
- Exclude from default cheapest-price ranking; show in a separate "Package Deals" section
- Infer per-session equivalent price where possible (divide by session count)

**Frameworks:** Python regex + heuristics
**Complexity:** Low (a few hours)
**Uniqueness:** Subtle but important data quality fix no other consumer tracker addresses.

---

## Priority 3 — Differentiation (Competitive Edge)

### 9. Buy-Now vs. Wait Recommendation Engine
**Goal:** Based on price trend, days until event, and supply signals, give a confidence-gated "Buy now" or "Wait — prices trending down" recommendation.
**Why:** This is the Hopper/Google Flights "Tip" feature. TicketData is building toward this but gates it on high confidence. No consumer tool has this for cross-platform resale tickets. It's the highest-value thing a tracker can add.
**Implementation:**
- Features: price delta over last N scrapes, days until event, supply count (# listings), price volatility
- Simple heuristic v1: if price dropped >5% over last 3 scrapes and event >3 days away → "Wait"
- v2: linear regression on price vs. time for each platform; slope determines recommendation
- v3: train a classifier on historical data from similar past events (needs data accumulation first)
- Confidence gate: only show recommendation when signal strength exceeds threshold; otherwise show "Insufficient data"
- Output: "📉 Wait — prices have dropped 8% over the last 2 hours. Avg drop rate: $4/hr. Event in 18 hours."

**Frameworks:** Python `scikit-learn` (v2+), `numpy`; v1 is pure Python
**Complexity:** Medium (v1: 1 day; v2: 2–3 days; v3: requires 2+ weeks of data)
**UX Design:** Single prominent recommendation card at top of report. Color-coded: green = Buy, yellow = Wait, gray = Insufficient data.
**Uniqueness:** Hopper proved this model builds habit and trust. No event ticket tracker has a consumer-facing equivalent. This would be the flagship differentiator.

---

### 10. Artist / Tour Date Tracker + Price Alert Integration
**Goal:** Monitor Songkick or Bandsintown for new show announcements for followed artists, then automatically create a price tracking job when tickets go on sale.
**Why:** Fans currently use Songkick/Bandsintown for announcements AND a separate tool for prices — two disconnected workflows. No product unifies them. This closes the discovery-to-purchase loop.
**Implementation:**
- Songkick API (free, no auth for basic concert search) or scrape Bandsintown
- User configures followed artists in `artists.yaml`
- Cron checks daily for new events matching followed artists
- When a new event is found: auto-create an entry in `events.yaml` and begin polling
- Send a "New show announced!" alert with initial price snapshot

**Frameworks:** Songkick API (JSON), Python `requests`
**Complexity:** Medium (2 days)
**Uniqueness:** No existing ticket tracker auto-creates price tracking jobs from tour announcements. Event-Spy requires manual URL entry per event.

---

### 11. Web Dashboard (Read-Only, Static HTML)
**Goal:** A browser-viewable dashboard showing all tracked events, current best prices, price charts, and buy/wait recommendations.
**Why:** Markdown reports are developer-friendly but not user-friendly. A web UI expands the audience and makes the tool shareable.
**Implementation:**
- Static site generator: Jinja2 templates rendered at scrape time → HTML files
- Pages: index (all events, current best price, trend arrow), event detail (price chart, arbitrage alerts, buy/wait rec, full platform comparison table)
- No server required — works from file:// or any static host (GitHub Pages, Netlify free tier)
- Auto-regenerate HTML after each scrape run

**Frameworks:** Python Jinja2 + Tailwind CSS + Chart.js
**Complexity:** Medium (2–3 days)
**UX Design:**
- Dark mode by default (sports/events aesthetic)
- Card layout: one card per tracked event, sorted by "event happens soonest"
- Each card: event name, venue, date, cheapest price with platform badge, trend indicator (↓↑→), last updated timestamp
- Event detail page: full-width price chart, platform comparison table with color-coded price cells (green = cheapest, red = most expensive), arbitrage alert banner if applicable
- Mobile-first — designed for checking on your phone while deciding whether to buy

**Uniqueness:** TicketData has a polished web UI. This can match the UX quality but scope to personally tracked events only.

---

### 12. Discord / Slack Alert Integration
**Goal:** Send price drop alerts and buy/wait recommendations to a Discord channel or Slack workspace.
**Why:** Power users and fan groups coordinate on Discord. Distill.io users already route page-change alerts there as a workaround. A native Discord integration serves fan communities directly.
**Implementation:**
- Discord: webhook URL in config → `POST` JSON with embed: platform, price, section, row, delta, direct link
- Slack: Incoming Webhook → Block Kit message
- Both are free, no SDK needed — pure HTTP POST
- Alert format: rich embed with platform logo color coding, price trend, CTA button to buy

**Frameworks:** Python `requests` (pure HTTP, no SDK needed)
**Complexity:** Low (a few hours per integration, given alert system is already built)
**UX Design:** Discord embed with colored left border (green = price drop, yellow = buy/wait rec, red = price spike). Slack Block Kit with button linking to listing.
**Uniqueness:** No native Discord integration exists in any ticket tracker. Distill.io users hack this together manually. A polished native integration is a genuine differentiator for fan community use cases.

---

### 13. Price Freeze Simulation ("Should I Lock In?")
**Goal:** Help users decide whether to commit now by simulating what happens if prices continue their current trend.
**Why:** Hopper's Price Freeze feature is highly valued — users pay $5–15 to lock in a flight price while deciding. The simulation equivalent for events would be: "If you wait 4 hours and prices keep dropping at this rate, you'd save $22. If they reverse, you'd pay $31 more."
**Implementation:**
- Extrapolate current price trend (linear regression slope) forward N hours
- Show projected price range at purchase decision time
- Surface expected savings vs. risk (volatility metric)
- Not a financial product — purely informational projection with clear uncertainty bounds

**Frameworks:** Python `numpy`
**Complexity:** Low-Medium (1 day, requires price history data from items above)
**UX Design:** A two-column "Save vs. Risk" card: left = "Expected saving if you wait X hours: $22", right = "If prices reverse: you'd pay $31 more than now."
**Uniqueness:** No ticket tracker has this. Hopper proved it converts well and builds trust.

---

## Priority 4 — Expansion (Future)

### 14. Mobile Push Notifications (ntfy.sh / Pushover)
**Goal:** Send instant push notifications to your phone without a native app.
**Why:** Email and SMS have latency. For high-demand events, seconds matter. ntfy.sh is free, open source, and works on iOS and Android.
**Implementation:**
- `ntfy.sh/<your-topic>` — one HTTP POST, received as push notification on phone
- No account required for basic use; self-hostable for privacy
- Configurable per alert type (price drop, new low, arbitrage, buy/wait flip)

**Frameworks:** Python `requests` + ntfy.sh
**Complexity:** Trivial (30 min once alert system is built)
**Uniqueness:** Gametime does push for last-minute deals. This brings push to any event, any platform.

---

### 15. SeatGeek API Integration (Replacing Scraper)
**Goal:** Use SeatGeek's official API instead of scraping for more reliable, richer data.
**Why:** SeatGeek's scraper is currently broken. Their API provides structured JSON including Deal Score, price history endpoints, and performer metadata — more data with less fragility.
**Implementation:**
- SeatGeek developer API (free tier available, requires registration)
- Endpoints: `/events`, `/listings` — JSON response with all-in prices
- Cache responses to disk by event ID + timestamp; never re-fetch within poll interval

**Frameworks:** Python `requests` + SeatGeek API
**Complexity:** Low-Medium (1 day)
**Uniqueness:** API data is more reliable and richer than scraped data. Deal Score can inform buy/wait recommendations.

---

### 16. Historical Event Benchmarking ("Is This Price Normal?")
**Goal:** Compare current prices for an event to similar past events at the same venue or by the same team/artist.
**Why:** Fans have no baseline. "Is $291 for an NCAA East Regional game expensive?" requires context. SeatData.io does this for industry professionals — no consumer equivalent exists.
**Implementation:**
- Store completed events in DB (after event date passes, archive final price snapshot)
- Tag events by category (NCAA tournament, NBA, NFL, concert genre)
- On new events, query historical events of same type/venue → compute median, p25, p75
- Surface: "Similar NCAA tournament games at this venue historically averaged $190–$340. Current price of $291 is within normal range."

**Frameworks:** Python + SQLite aggregate queries
**Complexity:** Medium (requires historical data accumulation; build later)
**Uniqueness:** TicketData is building this. No consumer tool has it yet. Requires data over time to be valuable.

---

### 17. Fan Community Shareable Reports
**Goal:** Generate a shareable link or image (PNG/PDF) of the current price comparison that can be posted to Reddit, Discord, or group chats.
**Why:** Fans share ticket price info in communities constantly — manually screenshotting. A one-click share artifact removes friction.
**Implementation:**
- Render the HTML report to PNG using `playwright` screenshot or `weasyprint` for PDF
- Optionally host on a free static service (GitHub Pages, Cloudflare Pages) with a short URL
- Include a "Generated by TicketPriceTracker" attribution footer

**Frameworks:** Playwright (screenshot) or WeasyPrint (PDF)
**Complexity:** Low-Medium (1 day)
**UX Design:** Clean, single-page PNG optimized for Discord/Reddit embed width (1200×630px OG image format).
**Uniqueness:** No tracker generates shareable community artifacts. This is a viral growth mechanic.

---

### 18. International Platform Support (Viagogo, DICE, AXS)
**Goal:** Add scrapers/API integrations for non-US platforms.
**Why:** US-centric tools miss a large market. Major international events (Premier League, F1, Glastonbury) have no cross-platform tracker equivalent.
**Implementation:**
- Viagogo: part of TicketsData.com API (already covers this)
- DICE: scraper (no public API; tickets are non-transferable so prices are face value only)
- AXS: scraper for US/UK events

**Frameworks:** Playwright for JS-heavy pages
**Complexity:** Medium per platform
**Uniqueness:** Near-zero competition for international event price tracking with this depth.

---

## Issues to Track

See `issues.md` for known scraper bugs, anomalous price detections, and blocked platform logs.

---

*Last updated: 2026-03-27*
