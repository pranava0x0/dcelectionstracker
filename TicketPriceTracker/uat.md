# UAT Baseline — TicketPriceTracker

_Created: 2026-03-28_
_Last run: 2026-03-28 (run #3 — post-fix verification)_

## Project Info
- **Stack**: React Native Expo (TypeScript) + Python FastAPI + SQLite
- **Dev server**: `npx expo start --web` → http://localhost:8081, API on configurable port (default 8000, use 8002 if 8000 is in use)
- **Entry point**: mobile/App.tsx
- **Key routes**: Dashboard (home), PlatformDetail, PriceHistory, AddEvent

## Critical Flows (run every time)

1. **Dashboard loads with event picker**: Open app → event picker pills visible at top → first event auto-selected → price data loads with platforms sorted by cheapest price
2. **Event switching**: Click second pill → header updates to new event name → countdown updates immediately → price cards reload with new event's data → best price banner updates
3. **Countdown for TBD events**: Events with "@ TBD" time show formatted date (e.g. "Sun, Mar 29") — never "LIVE NOW"
4. **Platform detail drill-down**: Click a platform card → navigates to PlatformDetail → shows 10 listings sorted by price → Back button returns to dashboard with state preserved
5. **Price history chart**: Click "VIEW PRICE HISTORY" → chart loads with line data, IQR outlier clamping, multi-platform legend
6. **Add Event navigation**: Click "+" pill → Add Event screen opens → search bar with placeholder → back arrow returns to dashboard
7. **Add Event error clearing**: Search with no API key → error banner appears → clear input + Search → error banner clears

## Sections & Last Tested

| Section | Last Tested | Notes |
|---------|-------------|-------|
| Event Picker | 2026-03-28 | Fixed — pills wider (maxWidth 260), truncation at 35 chars. Dates show "Mar 29" not "Sunday, Ma" |
| Event Header / Countdown | 2026-03-28 | Fixed — TBD events show "Sun, Mar 29", past events show "LIVE NOW", immediate update on switch |
| Best Price Banner | 2026-03-28 | Stable — shows correct cheapest platform and price |
| Platform Cards | 2026-03-28 | Stable — sorted correctly, all 5-6 platforms displayed |
| Platform Detail | 2026-03-28 | Stable — listings load, back nav works |
| Add Event Screen | 2026-03-28 | Fixed — error clears when searching empty query |
| Price History Chart | 2026-03-28 | Stable — line chart renders, IQR outlier clamping works, legend correct |
| Pull to Refresh | 2026-03-28 | Stable on web |

## Known Stable Areas
- Best price banner rendering
- Platform card sorting and display
- Platform detail listing view (10 listings, price-sorted, cheapest highlighted)
- Navigation between all screens (state preserved on back nav)
- Pull-to-refresh on dashboard
- Event switching (data reloads correctly, countdown updates immediately, no flash)
- Price history chart (line chart, IQR outlier clamping, multi-platform legend)
- Event picker pills (wider, better truncation, correct date formatting)
- Countdown logic for TBD and freeform dates
- Add Event error state management
- Console: no runtime errors (only Expo `pointerEvents` deprecation warning)

## Known Flaky / Unstable Areas
- None currently — all UAT issues except UAT-005 (backend price validator) have been resolved

## Exploration Notes
- Expo web doesn't respond to browser viewport resize (React Native fixed layout) — mobile testing requires Expo Go on a real device or simulator
- No console errors observed during testing (only Expo deprecation warnings for `props.pointerEvents`)
- The app handles the "no scrape data" state gracefully (shows error message with retry hint)
- Event selection state persists across navigation to PlatformDetail and AddEvent screens
- Price history chart with 1 data point (NCAA event) renders cleanly — no crash on sparse data
- Price history chart with 8 data points (Duke event) shows clear multi-platform trend lines with IQR-clamped outlier at $1784
- StubHub consistently most expensive across both events ($544 Duke, $563 NCAA) — worth flagging to users?
- Port conflict: another app (KeepInTouch) was running on 8000 during this test — had to use 8001. `start.sh` doesn't detect this. Consider adding port conflict detection.
