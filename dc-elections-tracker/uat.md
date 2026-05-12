# UAT Baseline — DC Elections Tracker

_Created: 2026-05-10_
_Last run: 2026-05-11 (UAT run 3 — 3 bugs filed and fixed)_

## Project Info
- **Stack**: Next.js 14.2.13 App Router, `output: "export"` (static site), TypeScript strict, Tailwind 3
- **Dev server**: `npm run dev` → http://localhost:3000 (UAT-001 resolved; dev now serves issue pages)
- **Production test**: `npm run build && npx serve out/` — preferred for any pass touching dynamic routes
- **Preview launch configs** (in worktree-root `.claude/launch.json`): `dc-elections-tracker-dev` and `dc-elections-tracker-static`
- **Entry point**: `src/app/layout.tsx` → `src/app/page.tsx`
- **Key routes**:
  - `/` — Homepage (hero, alert ticker, countdowns, latest cards, issue cards, editorial standard)
  - `/issues/[slug]/` — 6 issue pages: statehood, public-safety, housing, budget, transportation, schools
  - `/issues/ranked-choice/` — static RCV explainer + simulator (BL-16)
  - `/officials/` — all DC elected officials grouped by body + Council voting record matrix (BL-12)
  - `/elections/` — countdowns, address lookup (BL-02), DCBOE admin stats, key dates, race cards, candidate comparison, registration links
  - `/elections/[race]/` — 4 profiled race pages (BL-32): mayor, council-at-large-bonds, council-ward-1, us-house-delegate
  - `/elections/[race]/[candidate]/` — 24 candidate profile pages (BL-32) with Links & filings, Stated positions, optional Recent coverage (BL-42 schema)
  - `/sources/` — All 74 cited sources, grouped by issue topic

## Critical Flows (run every time, three viewports)

Run each at desktop (1280) **and** tablet (768) **and** mobile (375). The full skill spec is at `~/.claude/skills/dc-uat.md` (BF-NN ids). Tablet is the most fragile of the three — it sits between the sibling-pair `lg:` and `sm:` thresholds and any wide-table regression shows up here first (UAT-011, UAT-012 history).

1. **Homepage loads**: hero, alert ticker animating, 2 countdowns, 3 latest cards, 6 issue cards, footer
2. **Officials page**: 5 groups · 28 cards · party badges · Council voting record matrix
3. **Elections page**: 2 countdowns, address lookup, DCBOE admin stats, key dates, 12 race cards, candidate comparison, registration links
4. **Sources page**: 74 sources · 6 topic groups
5. **Desktop nav**: 9 items + logo + CTA at ≥1024px
6. **Mobile nav (hamburger)**: 9 items in disclosure panel at <1024px
7. **Issue cards link correctly** to `/issues/[slug]/`
8. **Build emits all routes**: `npm run build` produces 6 issue pages + 4 race pages + 24 candidate profiles
9. **No console errors** on any page
10. **Mobile sibling-pair tables (BF-14)**: voting matrix renders as 3 bill cards · race comparison as candidate `<details>` · RCV results as row strips
11. **Mobile collapsed-at-mobile sections (BF-15)**: IssueDetail's Who decides / Questions / Live sources collapse · officials notes/source collapse · `/elections/` DCBOE admin + Key dates collapse
12. **Mobile JumpStrip (BF-16)**: `/elections/` chips + `/issues/<slug>/` chips · smooth anchor scroll · `scroll-mt-16` clears NavBar · hidden at sm+
13. **Clickable race cards (BF-17)**: 4 profiled races have `<Link>` header + "SEE RACE PAGE →" · 8 non-profiled stay static
14. **Candidate profile enrichment (BF-18)**: Links & filings surfaces all populated URLs in order · Recent coverage section appears only when `news[]` populated

## Sections & Last Tested

| Section | Last Tested | Notes |
|---------|-------------|-------|
| Homepage — hero + CTAs | 2026-05-11 | Stable both viewports. Headline dynamic (BF-03 fix). Hero h1 = text-4xl at mobile (kept) |
| Homepage — alert ticker | 2026-05-11 | Stable. CSS marquee + prefers-reduced-motion guard. UAT-015 fixed: duplicate `<a>` links now `aria-hidden`. |
| Homepage — countdowns | 2026-05-11 | Stable both viewports. 35d / 175d as of 2026-05-11 |
| Homepage — latest cards | 2026-05-11 | Stable. 3 most-recent alerts rendered |
| Homepage — issue cards grid | 2026-05-11 | Stable. 6 cards with `p-4 sm:p-5` padding (Phase C) |
| Homepage — editorial standard | 2026-05-11 | Stable. GitHub issue tracker link present |
| NavBar (desktop) | 2026-05-11 | Stable. 9 items + logo + CTA |
| NavBar (mobile hamburger) | 2026-05-11 | Stable — UAT-002 resolved. Disclosure panel renders all 9 items at <1024px |
| Issue pages (dev + build) | 2026-05-11 | UAT-001 resolved. /issues/housing/ verified at both viewports |
| /issues/<slug>/ JumpStrip | 2026-05-11 | Mobile-only `Stats · Stakes · Timeline` chips render below hero |
| /issues/<slug>/ CollapsibleSections | 2026-05-11 | Mobile: "Who decides", "Questions", "Live sources" closed by default; desktop: inline |
| /issues/ranked-choice/ | 2026-05-11 | RCV simulator hydrates; 5 candidate buttons; mobile results render as row strips |
| Officials page (desktop) | 2026-05-11 | Stable. 28 cards. Voting record matrix as `<table>` |
| Officials page (mobile) | 2026-05-11 | Stable. 28 cards w/ `Background ↓` toggles. Voting matrix as 3 bill cards w/ chip wrap-grid |
| Elections page (desktop) | 2026-05-11 | Stable. 12 race cards (4 clickable, 8 static). Hero h1 = text-3xl at mobile (Phase C) |
| Elections page (mobile) | 2026-05-11 | Stable. JumpStrip (4 chips) below hero · DCBOE admin + Key dates collapsed · race cards behave per BF-17 |
| /elections/[race]/ (mayor) | 2026-05-11 | Desktop: 8 candidate cards + comparison `<table>`. Mobile: 8 candidate `<details>` |
| /elections/[race]/[candidate]/ (JLG) | 2026-05-11 | Badge renders "D" only (UAT-013 fixed). Links & filings shows Campaign site + Government site + announcement source. |
| Sources page | 2026-05-11 | Stable. 74 sources / 6 groups |
| Footer | 2026-05-11 | Stable. Build date shows correctly |

## Known Stable Areas
- Static pages: `/officials/`, `/elections/`, `/sources/` — render correctly in dev and build
- Homepage layout — all sections render, zero JS errors in console
- Alert ticker animation — CSS marquee, reduced-motion guard works
- Countdown component — client-side hydration, useEffect timer
- Card hover interactions — lift/shadow transitions on issue cards, official cards, latest cards
- External source links — all have `target="_blank" rel="noopener noreferrer"` correctly
- Mobile sibling-pair patterns (Phase A) — voting matrix, race comparison, RCV results
- Mobile `CollapsibleSection` (Phase B) — sibling-pair with `<details>` at <sm, inline at sm+
- Mobile JumpStrip (Phase D) — `sm:hidden` chip strip, smooth anchor scroll with reduced-motion guard
- Clickable race cards — 4 profiled races have `<Link>` header + "SEE RACE PAGE →" CTA
- Candidate profile schema (BL-32 follow-on) — Links & filings surfaces 9 URL kinds when populated

## Known Flaky / Unstable Areas
- **Screenshot-after-scroll** — Preview tool doesn't capture scrolled viewport; use `preview_snapshot` or `preview_eval` DOM queries for content below the fold
- **Anchor jumps via preview_click** — The smooth scroll-behavior CSS works in real browsers but `preview_click` on an `<a href="#section">` doesn't always reliably trigger the scroll animation in the test harness. Verify the URL hash changes; the visual scroll will happen for a real user.

## Exploration Notes

### Paths to try next run
- [ ] **Tablet viewport (768px)** — between mobile and desktop, edge case for sibling-pair pattern (does the mobile <details> stay hidden the moment we cross `sm:`?)
- [ ] **Keyboard tab order** on the new `<Link>`-wrapped race-card header + sibling `<details>` — do they share focus order cleanly?
- [ ] **`prefers-reduced-motion`** — verify smooth-scroll for JumpStrip anchors is disabled (instant jump instead of animated)
- [ ] **Candidate profile with `news[]` populated** — once the data-refresh skill seeds news, verify "Recent coverage" section renders newest-first with the correct date / outlet / headline layout
- [ ] **Mobile race-card click target size** — `<Link>` should be ≥ 44px tall; on phones it includes title + tagline + CTA so it's plenty, but verify
- [ ] **Mobile JumpStrip horizontal scroll** — when chip count > viewport width, does the strip scroll cleanly with momentum (no chrome scrollbar)?
- [ ] **Elections page after June 16** — `upcomingDates` filter shows zero items; Key dates `<details>` should still render gracefully (empty `<ul>`)
- [ ] **Countdowns once primary passes** — "Election day passed." state
- [ ] **Officials "Footnote" ANC card** at bottom of /officials/ — still renders correctly after the Phase B notes/source collapse change
- [ ] **Sources page** URL truncation on long URLs

### Edge cases to try
- Rapid nav clicks (multiple quick page transitions)
- Very narrow viewport (320px — old iPhone SE)
- Dark mode preference via OS (no dark theme implemented — should render light regardless)
- Reduced motion preference — CSS animation should stop (marquee + pulseDot + card hover)
- Keyboard tab order through the nav (after UAT-002 fix, verify tab order)

### Patterns noticed
- No client-side state or forms beyond two `"use client"` components (`RcvSimulator`, `AddressLookup`) — purely static render. Very little to break.
- All data is in `src/data/` TypeScript files — content bugs (wrong dates, wrong sources, stale slugs) are the most likely category after a UI regression.
- The sibling-pair pattern (mobile `<details>` next to desktop block) is now used in 5 places (3 tables, IssueDetail CollapsibleSection, officials cards). Always check both viewports — a regression on one side won't break the other.
- Source-attribution links use `text-xs` (12px) with `py-1` site-wide. Don't downgrade to `text-[10px]` / `text-[11px]` for tap targets (BL-29 / Phase C).
- Section spacing site-wide is `mt-8 sm:mt-12 lg:mt-14`. Don't reintroduce `mt-10 sm:mt-14` — it makes mobile too airy.

### Run history
- **2026-05-10** (first run) — found 10 issues across nav, dev mode, headline, etc. All closed by ship of /dc-data-refresh run 2 + Mobile UX Phase A.
- **2026-05-11** (mobile-overhaul verification, 5 min, two-viewport pass) — zero new issues. All 14 baseline flows pass at both 375 and 1280. Confirmed Phase A/B/C/D + candidate-enrichment + clickable race cards work end-to-end.
- **2026-05-11** (tablet pass, 768×1024) — found UAT-011 and UAT-012, both wide-table overflows at 768. Root cause: sibling-pair threshold `sm:` was too low for tables wider than ~640px. Fixed by bumping VotingRecordMatrix and `/elections/[race]/` comparison to `lg:` threshold. Verified at 375/768/1280: mobile cards on phone + tablet, full table on desktop, no page-level horizontal overflow at any viewport.
- **2026-05-11** (bug-fix pass) — found and fixed UAT-013 (badge "D · D" → "D" for all Democrat candidates; `page.tsx:93`), UAT-014 (hero dateline UTC off-by-one → `toLocaleDateString('sv')`; `page.tsx:15`), UAT-015 (alert ticker duplicate `<a>` links hidden from accessibility tree via `aria-hidden`; `AlertTicker.tsx`). All three verified in browser. Zero open issues.
