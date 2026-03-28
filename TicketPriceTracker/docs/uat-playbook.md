# TicketPriceTracker — UAT Playbook

> Semi-random user acceptance testing. Run common paths every session.
> Pick 3-4 random paths from the "less taken" sections each time.

---

## Setup

```bash
# Terminal 1: Start backend
./start-backend.sh

# Terminal 2: Start mobile
./start-mobile.sh

# Open Expo Go on phone or iOS Simulator
```

---

## Common Paths (Run Every Time)

### 1. Cold Start
- [ ] Launch app with API running
- [ ] Should show loading spinner briefly
- [ ] Dashboard populates with event info, best deal banner, platform cards
- [ ] No blank screens or "undefined" text

### 2. Pull to Refresh
- [ ] Pull down on dashboard
- [ ] Green spinner appears
- [ ] Prices update (or stay same if no new scrape)
- [ ] "Last refreshed" timestamp updates

### 3. Best Deal Highlight
- [ ] Cheapest platform has green accent border on its card
- [ ] Best Deal banner shows matching price and platform
- [ ] Hero price number is large, green, monospace

### 4. Platform Card Tap
- [ ] Tap any platform card
- [ ] Navigate to PlatformDetail screen
- [ ] Shows listing table with Section, Row, Qty, Price columns
- [ ] Prices are formatted correctly (no NaN, no missing decimals)

### 5. Back Navigation
- [ ] Tap back arrow from PlatformDetail
- [ ] Return to Dashboard
- [ ] Dashboard state preserved (no re-fetch, no blank screen)

### 6. Visual Check
- [ ] Dark background throughout (no white flashes)
- [ ] Platform colors are distinct and readable
- [ ] Text is legible on dark background
- [ ] Cards have subtle borders, not floating in void

---

## Semi-Random Paths (Pick 3-4 per session)

### 7. API Down
- [ ] Stop the backend (Ctrl+C on start-backend.sh)
- [ ] Open app (or pull to refresh if already open)
- [ ] Should show error state: "Unable to connect" or similar
- [ ] App does NOT crash
- [ ] Restart backend → pull to refresh → data returns

### 8. Empty Database
- [ ] Delete `prices.db`
- [ ] Restart backend (it creates empty DB)
- [ ] App shows "No data available" or similar empty state
- [ ] No crash, no undefined errors

### 9. Stale Data
- [ ] Don't run scraper for 1hr+
- [ ] Check "Updated X ago" text in BestDealBanner
- [ ] Should show actual time difference (e.g., "2h ago"), not "just now"

### 10. Rapid Pull-to-Refresh
- [ ] Pull to refresh 5 times rapidly
- [ ] No duplicate content, no crashes
- [ ] Spinner behaves correctly (shows once, not flickering)

### 11. Platform with No Listings
- [ ] Open SQLite DB, delete all listings for one platform
- [ ] Refresh app
- [ ] That platform should not appear in dashboard cards
- [ ] Other platforms still show correctly

### 12. Anomalous Price
- [ ] Insert a $5 listing into DB manually:
  ```sql
  INSERT INTO listings (scrape_id, platform, price, section, row, qty, fee_policy, is_anomaly)
  VALUES ((SELECT MAX(id) FROM scrapes), 'gametime', 5.0, '999', 'Z', '2', 'Included', 1);
  ```
- [ ] Refresh app
- [ ] $5 listing should NOT appear as "best deal" (is_anomaly=1)

### 13. Large Price Values
- [ ] Insert a $15,000 listing:
  ```sql
  INSERT INTO listings (scrape_id, platform, price, section, row, qty, fee_policy, is_anomaly)
  VALUES ((SELECT MAX(id) FROM scrapes), 'stubhub', 15000.0, '100', 'A', '2', 'Included', 0);
  ```
- [ ] Refresh app
- [ ] Price formats correctly: "$15,000" (not overflowing card)

### 14. Network Timeout
- [ ] In `api.py`, add `import time; time.sleep(15)` to the `/api/events/1/latest` endpoint
- [ ] Refresh app
- [ ] Should show timeout error after ~10s (hook has 10s timeout)
- [ ] Remove the sleep and test again

### 15. Landscape Rotation
- [ ] Rotate device/simulator to landscape
- [ ] Cards should still be readable
- [ ] No overlapping text or cut-off prices

### 16. Dark Mode System Toggle
- [ ] Toggle device dark/light mode in system settings
- [ ] App should stay dark (hardcoded dark theme)
- [ ] No jarring white flashes during toggle

---

## Backend-Specific UAT

### 17. Scraper Parallel Run
- [ ] Run: `python3 -m backend.scraper --dry-run`
- [ ] All 6 platforms attempted (check logs)
- [ ] No unhandled exceptions
- [ ] Results printed to stdout

### 18. Anti-Bot Resilience
- [ ] Run scraper 3x in succession with 30s gaps
- [ ] Check logs for 403/429 errors
- [ ] If blocked: note which platform in issues.md

### 19. Price Validation
- [ ] After a scrape run, query DB:
  ```sql
  SELECT * FROM listings WHERE is_anomaly = 1;
  ```
- [ ] Any anomalous prices should be flagged

### 20. API Response Schema
- [ ] Hit `http://localhost:8000/docs` (Swagger UI)
- [ ] Try each endpoint
- [ ] Verify response shapes match expected models
- [ ] 404 for non-existent event ID

---

## Reporting

After each UAT session, note:
- Date
- Which random paths were tested
- Any failures (screenshot + description)
- Add failures to `issues.md`
