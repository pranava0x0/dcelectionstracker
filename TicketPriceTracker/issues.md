# Issues Log

_Last updated: 2026-03-28 (post-fix)_

---

## Open Issues

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

### [UAT-001] Event picker pill text truncated too aggressively
- **Severity**: high
- **Discovered**: 2026-03-28 | **Resolved**: 2026-03-28
- **Status**: resolved
- **Description**: Pill `maxWidth: 200` and `shortName()` truncating at 27 chars made event names unreadable.
- **Fix**: Increased `maxWidth` to 260, raised truncation threshold to 35 chars (32 + "..."). Extracted `shortName()` to `mobile/src/utils/dateUtils.ts`.

### [UAT-002] Countdown shows raw event_date string for non-ISO dates
- **Severity**: high
- **Discovered**: 2026-03-28 | **Resolved**: 2026-03-28
- **Status**: resolved
- **Description**: Freeform dates like "Sunday, March 29, 2026 @ TBD" were returned as-is when parsing failed. Also showed "LIVE NOW" incorrectly (see UAT-006).
- **Fix**: Extracted date cleaning into `cleanEventDate()` in `dateUtils.ts`. Strips day-of-week prefix and "@ TBD". TBD dates now show a formatted date string instead of a countdown. Added immediate `setCountdown` call in `useEffect` to fix stale state on event switch.

### [UAT-003] Add Event search error persists after clearing input
- **Severity**: low
- **Discovered**: 2026-03-28 | **Resolved**: 2026-03-28
- **Status**: resolved
- **Description**: Error banner persisted after clearing search input because `handleSearch` early-returned on empty query without clearing error state.
- **Fix**: Wired up existing `clear()` function from `useEventSearch` hook in the `else` branch of `handleSearch` in `AddEventScreen.tsx`.

### [UAT-004] Event picker date shows "Sunday, Ma" for unparseable dates
- **Severity**: low
- **Discovered**: 2026-03-28 | **Resolved**: 2026-03-28
- **Status**: resolved
- **Description**: `formatShortDate()` fallback `dateStr.slice(0, 10)` produced meaningless truncations for freeform date strings.
- **Fix**: Rewrote `formatShortDate()` in `dateUtils.ts` — strips day-of-week and "@ TBD" before parsing, then falls back to regex extraction of "Month Day" pattern. Now correctly shows "Mar 29" for "Sunday, March 29, 2026 @ TBD".

### [UAT-006] Countdown shows "LIVE NOW" for future event with TBD time
- **Severity**: high
- **Discovered**: 2026-03-28 | **Resolved**: 2026-03-28
- **Status**: resolved
- **Description**: "Sunday, March 29, 2026 @ TBD" parsed as midnight UTC March 29, which was in the past in US timezones → showed "LIVE NOW" one day early.
- **Fix**: `getCountdown()` now detects TBD times via `cleanEventDate()` and returns a formatted date string instead of computing a countdown. Never shows "LIVE NOW" for TBD events.

### [DATA-001] Gametime $29 anomalous listing in database
- **Date**: 2026-03-28
- **Area**: Database / data quality
- **Description**: Gametime scraper returned $29 for Section 423 Row L. Clearly erroneous — manually deleted (listing id=70, scrape_id=5).
- **Root cause**: Price validator min threshold ($20) too low for this event's price range.
- **Status**: Fixed (data deleted). Validator improvement tracked in UAT-005.
