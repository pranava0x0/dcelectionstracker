# Data Refresh Automation Rules: Prevent News Item Drops

**Effective**: 2026-06-07 (commit f8d894d)  
**Status**: ACTIVE — All future data refreshes must follow these rules

---

## Core Principle

**NEVER silently drop news items due to a count cap.** The 12-item cap in runs 15-21 created data loss that violated the editorial mission ("every numeric claim links to a primary or authoritative source").

---

## Rules for All Data Refresh Runs

### Rule 1: No Hard Caps on News Arrays

❌ **Forbidden**:
```typescript
// This lost 6+ items per candidate in runs 15-21
news: [...].slice(0, 12)  // Hard cap at 12
```

✅ **Allowed**:
```typescript
// Store all verified items; UI limits display
news: [
  // All 17+ items for profiled candidates
  // All verified items for others
]
```

### Rule 2: News Item Addition is Append-Only

When new news items are found in a refresh run:
- ✅ **ADD** the item (merge with existing, dedupe by URL, re-sort by date)
- ❌ **DELETE** old items to maintain a count threshold
- ✅ **NOTE** if the array exceeds 20 items (but still include all)

**Example Log Entry**:
```
Run 25 (2026-06-14): Added 3 new items to Oye Owolewa.
  • 2026-06-14 | WAMU | "Owolewa GOTV blitz"
  • 2026-06-12 | Axios | "Owolewa's tech focus"
  • 2026-06-10 | GGWash | "Owolewa endorsement coalition"
News array now contains 12 items. [NOTE: No cap enforcement; array grows as news occurs]
```

### Rule 3: Maintain 60-Day Lookback by Content, Not Count

**What to keep**: All verified items from the past 60 days  
**What to drop**: Items older than 60 days (only if they're confirmed obsolete by time, not by count)

```typescript
const LOOKBACK_DAYS = 60;
const oldestAllowedDate = subDays(today, LOOKBACK_DAYS);
const recentItems = items.filter(n => parseISO(n.date) >= oldestAllowedDate);
```

### Rule 4: Sort Items in Descending Date Order

**Every news array must be sorted newest-first** so the UI can show "top 6" without reading comments.

```typescript
news: [
  { date: "2026-06-14", ... },  // Most recent
  { date: "2026-06-13", ... },
  { date: "2026-06-12", ... },
  // ... older items
]
```

**Test validation**: `elections.test.ts` includes "news items are sorted descending by date"

### Rule 5: Log Threshold Warnings (Not Enforcement)

If a candidate's news array exceeds 20 items, log a **warning** for manual review—but do NOT drop the items:

```typescript
if (candidate.news.length > 20) {
  console.warn(`⚠️ ${candidate.name} news array has ${candidate.news.length} items. 
    If UI shows top-6 only, consider: (a) verify all are within 60-day window, 
    (b) merge duplicate themes, (c) review with human editor if old items should persist.`);
}
```

---

## Tier-Specific Guidelines

### Tier A (Profiled Races)
- **Baseline expectation**: 6–20 items per candidate
- **Action if <5**: Likely incomplete coverage; expand search window
- **Action if >20**: Log warning; verify all items are relevant and within 60-day window

**Profiled races**: Mayor, At-Large Bonds, Ward 1, US House Delegate  
**Profiled candidates**: JLG, McDuffie, Raj, Owolewa, Pinto, White

### Tier B (Lower-Visibility Races)
- **Baseline expectation**: 2–12 items per candidate
- **Action if drop below prior run**: Log as data loss (flag for review)
- **Action if >15**: Log warning; verify 60-day lookback still applies

### Tier C (Special/Shadow Seats)
- **Baseline expectation**: 0–8 items per candidate
- **Action if >10**: Log warning; unclear if coverage exists or if old items should clear

---

## Quality Checks Before Commit

### Pre-Commit Validation (Required Every Run)

1. **No silent drops**
   ```bash
   # Compare news item counts to prior commit
   git show HEAD~1:src/data/elections.ts | grep -c "{ date:" > /tmp/before.txt
   git diff HEAD src/data/elections.ts | grep -c "{ date:" > /tmp/after.txt
   if [ $(cat /tmp/after.txt) -lt $(cat /tmp/before.txt) ]; then
     echo "ERROR: News items dropped silently. Investigate before commit."
     exit 1
   fi
   ```

2. **All news items sorted descending by date**
   - Run `npm test` — validates this with elections.test.ts

3. **Baseline thresholds maintained**
   - Total items: >= 150 (guards against wholesale data loss)
   - Profiled candidates: >= 56 (guards against reintroduced caps)

4. **No duplicate URLs**
   - Run `npm test` — validates this with elections.test.ts

---

## Post-Commit Monitoring

After each data-refresh commit, verify:

1. **Test suite passes**: `npm test` (all 128 tests, including new data-loss tests)
2. **Build succeeds**: `npm run build` (78 static routes)
3. **No console warnings**: Run `npm run dev` and check for URL/date anomalies

---

## If Data Loss is Detected

If a future refresh accidentally drops items (caught by tests failing):

1. **Stop the commit** — do NOT merge
2. **Inspect the git diff**: `git diff src/data/elections.ts`
3. **Identify what was dropped**: Compare news arrays across candidates
4. **Restore from git history**: `git show HEAD~1:src/data/elections.ts` for prior state
5. **Re-run the refresh**: Append new items instead of replacing the array
6. **Log the incident**: Add a comment to sources-log.md explaining what was lost and why

---

## Automation Checklist

Use this checklist before every data-refresh commit:

- [ ] No news items were dropped (test: elections.test.ts "maintains at least 150 total items")
- [ ] All news items sorted newest-first (test: "news items are sorted descending by date")
- [ ] No duplicate URLs (test: "no candidate news array has duplicate URLs")
- [ ] Profiled candidates >= 56 total items (test: "profiled candidates maintain at least 56")
- [ ] All URLs validate as http(s) (test: "every news item has an http(s) URL")
- [ ] All dates within valid range (test: "news date is <= today and >= 2026-01-01")
- [ ] newsThemes have >= 2 supporting URLs each (test: included in newsTheme validation)
- [ ] Build + tests clean: `npm test && npm run build`
- [ ] No console warnings about news array size or anomalies
- [ ] sources-log.md updated with new sources found this run

---

## Tools

### test Command
```bash
npm test
# Validates all data-integrity rules above
```

### Baseline Report
```bash
node -e "
const {candidates2026} = require('./src/data/elections.ts');
let total = 0, profiled = 0;
const PROFILED = ['janeese-lewis-george', 'kenyan-mcduffie', ...];
for (const c of candidates2026) {
  if (c.news?.length) {
    total += c.news.length;
    if (PROFILED.includes(c.slug)) profiled += c.news.length;
  }
}
console.log(\`Total: \${total}, Profiled: \${profiled}\`);
"
```

---

## Future Improvements (Post-Primary)

These automation rules can be enhanced post-election (after June 16, 2026):

1. **Automated news URL liveness checks** (periodic fetch to catch dead links)
2. **Automated newsTheme synthesis** (pattern detection across news items)
3. **Automated outlet diversity scoring** (flag if >50% from one source)
4. **Automated 60-day-old item archival** (move to history.ts, not delete)

For now: **manual discipline + test coverage = prevention**.

---

## References

- **Incident**: News cap in runs 15-21 caused 7+ items lost across 2 candidates (RESTORATION_AUDIT.md)
- **Test suite**: elections.test.ts "Data loss detection tests" (commit f8d894d)
- **UI handling**: Candidate profile shows top 6 items + "Show all" disclosure (commit 3db8eec)
- **Data baseline**: 152 total items (2026-06-07) to be maintained minimum
