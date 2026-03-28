# Issues Log

_Last updated: 2026-03-28_

---

## Open Issues

### [UAT-001] Event picker pill text truncated too aggressively
- **Severity**: high
- **Page/Section**: Dashboard — EventPicker component
- **Discovered**: 2026-03-28
- **Status**: open
- **Description**: Event names in the horizontal pill selector are truncated to ~15 characters with "..." (e.g. "Ticket Prices: Duke vs S...", "NCAA East Regional - S..."). The pill `maxWidth: 200` is too narrow for meaningful event names. The date line is also truncated ("Sunday, Ma" instead of "Sunday, Mar 29"). Users cannot distinguish between events without reading the full name.
- **Steps to Reproduce**:
  1. Open dashboard with 2+ tracked events
  2. Observe pill labels — both names are cut off and hard to distinguish
- **Fix**: _(pending)_ — Increase `maxWidth` on pills or show a shorter derived name (e.g. team vs team + date). Consider showing just the short date in the pill and the full name in the header.

### [UAT-002] Countdown shows raw event_date string instead of computed countdown for non-ISO dates
- **Severity**: high
- **Page/Section**: Dashboard — EventHeader component
- **Discovered**: 2026-03-28
- **Status**: open
- **Description**: The Elite Eight event shows "STARTS IN Sunday, March 29, 2026 @ TBD" as raw text instead of a countdown like "STARTS IN 1d 12h". This is because `event_date` is stored as a human-readable string ("Sunday, March 29, 2026 @ TBD") which the `EventHeader` countdown logic cannot parse into a `Date` object. The Friday event correctly shows "LIVE NOW" because its date string happened to be parseable.
- **Steps to Reproduce**:
  1. Switch to the "NCAA East Regional - Session 2" event
  2. Observe the "STARTS IN" line — shows raw date string instead of countdown
- **Fix**: _(pending)_ — Either: (a) store `event_date` in ISO format (YYYY-MM-DDTHH:MM:SS) and display the human-readable version separately, or (b) make the countdown parser more robust with fallback formatting.

### [UAT-003] Add Event search error persists after clearing input
- **Severity**: low
- **Page/Section**: Add Event screen
- **Discovered**: 2026-03-28
- **Status**: open
- **Description**: After a failed search (e.g. "Search API key not configured"), the red error banner persists even after the user clears the search input and clicks Search again on an empty query. The error should be cleared when the user clears input or starts a new action. Currently the empty query check in `handleSearch` prevents the search call but doesn't clear the old error.
- **Steps to Reproduce**:
  1. Go to Add Event
  2. Type "yankees" and click Search (fails with API key error)
  3. Clear the search input
  4. Click Search again — error banner still visible
- **Fix**: _(pending)_ — Clear the error state in `handleSearch` before the early return, or clear it in `useEventSearch.clear()` when the input changes.

### [UAT-004] Event picker date uses formatShortDate on non-ISO date strings
- **Severity**: low
- **Page/Section**: Dashboard — EventPicker component
- **Discovered**: 2026-03-28
- **Status**: open
- **Description**: The `formatShortDate()` function in EventPicker tries to parse `event_date` with `new Date()`. For the Friday event stored as "Friday, March 27, 2026 @ 7:10 PM", `new Date()` can parse most of it but strips the day-of-week prefix. For the Sunday event stored as "Sunday, March 29, 2026 @ TBD", the "@ TBD" causes parsing to fail, falling back to `dateStr.slice(0, 10)` which shows "Sunday, Ma" — a meaningless truncation.
- **Steps to Reproduce**:
  1. Open dashboard
  2. Observe the second pill date — shows "Sunday, Ma" instead of a proper date
- **Fix**: _(pending)_ — Use ISO date format for `event_date` storage, or improve the fallback parser in `formatShortDate` to extract a date from freeform strings.

### [UAT-005] Price anomaly validator min threshold too low — $29 Gametime listing slipped through
- **Severity**: medium
- **Page/Section**: backend/scrapers/utils.py — `validate_prices()`
- **Discovered**: 2026-03-28
- **Status**: open (data fixed, validator not yet improved)
- **Description**: Gametime returned a $29 listing for Section 423 Row L (scrape_id=5, listing id=70) which passed the $20 minimum price validator. This price is clearly erroneous — surrounding listings for the same event were $250-$350. The listing was manually deleted from the database. The current validator only flags prices < $20 (absolute floor) and > 10x median (upper bound). There is no lower-bound relative check (e.g. < 0.2x median).
- **Steps to Reproduce**:
  1. Scrape an event where median price is ~$300
  2. If a platform returns a $29 listing, it passes the $20 floor check
- **Fix**: _(pending)_ — Add a median-relative lower bound to `validate_prices()`, e.g. flag anything < 0.2x median as anomalous. Alternatively, raise the absolute min_price to $30-$50 for typical sporting events, or make it configurable per event.

---

## Resolved Issues

### [DATA-001] Gametime $29 anomalous listing in database
- **Date**: 2026-03-28
- **Area**: Database / data quality
- **Description**: Gametime scraper returned $29 for Section 423 Row L. Clearly erroneous — manually deleted (listing id=70, scrape_id=5).
- **Root cause**: Price validator min threshold ($20) too low for this event's price range.
- **Status**: Fixed (data deleted). Validator improvement tracked in UAT-005.
