# Issues — Days Since Last Blunder

> Living audit trail. Log bugs when they occur or are discovered in UAT/tests. Update status when fixed.

**Format:** Date | Module | Description | Root Cause | Status

---

## Open Issues

*None currently open.*

---

## Fixed Issues

| # | Date | Module | Description | Root Cause | Fix | Commit |
|---|------|--------|-------------|------------|-----|--------|
| 1 | 2026-04-01 | `app.js` — `daysSince()` | Countdown displayed wrong value on days where local timezone pushed the blunder date forward by one day | **Code bug** — `new Date(dateStr)` without explicit midnight anchor parses dates as UTC midnight, causing off-by-one errors in negative UTC-offset timezones | Appended `T00:00:00` to all date strings before constructing `Date` objects | b7421c3 |
| 2 | 2026-04-01 | `app.js` — `formatDate()` | Dates rendered one day earlier than stored (e.g., "Apr 4" instead of "Apr 5") | **Code bug** — same UTC vs. local timezone issue as #1 | Same fix: `new Date(dateStr + "T00:00:00")` forces local-timezone interpretation | b7421c3 |
| 3 | 2026-04-01 | `style.css` — `.nav-logo` pill | Team name pill truncated on narrow mobile viewports (<340px) | **Code bug** — no `max-width` or overflow handling on nav flex container | Nav flex container gets `min-width: 0` on children, subtitle gets `overflow: hidden; text-overflow: ellipsis` | b7421c3 |
| 4 | 2026-04-01 | `index.html` — error state | Error state shown in hero persisted after successful data load on retry | **Code bug** — error div had no hide logic on successful render path | `init()` now explicitly sets `display: none` on error element before populating hero | b7421c3 |
| 5 | 2026-04-01 | `app.js` — hero | Hero section briefly showed stale data (previous blunder) before updating | **Code bug** — DOM updated inside async timeout without clearing first | Synchronous DOM clear before sort + render; no async needed for in-memory data | b7421c3 |

---

## Issue Log Guidelines

When logging a new issue:

```
| N | YYYY-MM-DD | module | one-line description | **Code bug** or **Test bug** — explanation | fix description | commit hash or "Open" |
```

**Root cause types:**
- **Code bug** — logic error in production code
- **Test bug** — test was wrong, production code was fine
- **Data bug** — bad entry in `BLUNDERS` array
- **Environment** — external dependency or browser quirk

**After fixing:** add commit hash, move row to Fixed section, and note whether a regression test was added.
