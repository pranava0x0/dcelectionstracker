# UAT Baseline — DC Elections Tracker

_Created: 2026-05-10_
_Last run: 2026-05-24 evening (UAT run 13 — scheduled `daily-dcelection-refresh` evening pass; paired with data-refresh run 13, the second same-day pass after run 12 this morning. Zero new product bugs. Verified against the static `out/` export (preferred unattended path per BL-UAT-20 — no live server started, to avoid the port-3000 cross-project collision; this run's changes are pure server-rendered data with no interactive component touched). Two data changes confirmed in the rendered HTML: (1) `/elections/` now shows 478,797 active registered voters (Apr 30 DCBOE figure; old 476,066 gone); (2) the council-at-large-bonds roster grew 6 → 10 — added Dwight Davis, Dyana N.M. Forester, Fred Hill, Greg Jackson, their 4 profile pages generate (build now emits 75 routes, up from 71), the race page links all 10 profiles, and the oneLine reads "10 declared Democrats". typecheck + 119 tests + static build all clean. See run-13 log entry below.)_

## Project Info
- **Stack**: Next.js 16 App Router (React 19, Turbopack), `output: "export"` (static site), TypeScript strict, Tailwind 3
- **Dev server**: `npm run dev` → http://localhost:3000 — serves every route including dynamic
- **Production test**: `NEXT_PUBLIC_BASE_PATH=/dcelectionstracker npm run build` then serve `out/` if you want to exercise the deployed URL prefix
- **Preview launch configs** (in worktree-root `.claude/launch.json`): `dc-watch-dev`
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
5. **Primary nav (all viewports)**: 2 trigger links (Issues, Elections) + logo + "ARE YOU REGISTERED?" CTA. NavBar is a server component (no `use client`, no hamburger) after BL-47. At sm+ each trigger reveals a CSS-only hover popout; at mobile the popouts stay hidden and the trigger Link navigates to the index page on tap. (BF-05/BF-06 in `~/.claude/skills/dc-uat.md` still describe the old 9-item hamburger nav — stale, tracked as BL-UAT-17 / BL-UAT-19.)
6. **Nav popouts (sm+)**: hovering "Issues" lists the 6 brief links + "All briefs →"; hovering "Elections" lists Officials directory + 4 profiled races + "All 12 races →" + "What's on your ballot →"
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
| Homepage — hero + CTAs | 2026-05-20 | Stable both viewports. Headline dynamic; h1 = "Four weeks until the primary." No console errors, no overflow at 375px. |
| Homepage — alert ticker | 2026-05-23 | Stable (static-export check). New top alert (May 23 advance-registration-deadline reminder) renders; poll alert intact. |
| Homepage — countdowns | 2026-05-19 | Stable both viewports. 35d / 175d as of 2026-05-12 |
| Homepage — latest cards | 2026-05-19 | Stable. 3 most-recent alerts rendered |
| Homepage — issue cards grid | 2026-05-19 | Stable. 6 cards with `p-4 sm:p-5` padding (Phase C) |
| Homepage — editorial standard | 2026-05-19 | Stable. GitHub issue tracker link present |
| NavBar (all viewports) | 2026-05-20 | 2-item server-component nav (Issues, Elections) + logo + "ARE YOU REGISTERED?" CTA after BL-47. No hamburger. At 375px: nav is flex, no horizontal overflow, popout panels are `display:none`. |
| NavBar popouts (sm+) | 2026-05-20 | CSS-only hover/focus popouts under Issues (6 briefs) + Elections (officials + 4 races + lookup). Hidden at mobile. |
| Issue pages (dev + build) | 2026-05-19 | UAT-001 resolved. /issues/housing/ verified at both viewports |
| /issues/<slug>/ JumpStrip | 2026-05-19 | Mobile-only `Stats · Stakes · Timeline` chips render below hero |
| /issues/<slug>/ CollapsibleSections | 2026-05-19 | Mobile: "Who decides", "Questions", "Live sources" closed by default; desktop: inline |
| /issues/ranked-choice/ | 2026-05-19 | RCV simulator hydrates; 5 candidate buttons; mobile results render as row strips |
| Officials page (desktop) | 2026-05-19 | Stable. 28 cards. Voting record matrix as `<table>` |
| Officials page (mobile) | 2026-05-19 | Stable. 28 cards w/ `Background ↓` toggles. Voting matrix as 3 bill cards w/ chip wrap-grid |
| Elections page (desktop) | 2026-05-20 | Stable. No overflow, no duplicate IDs. McDuffie housing + statehood positions render in comparison matrix. |
| Elections page (mobile) | 2026-05-21 | Stable. No overflow at 375px · no duplicate IDs · race cards render |
| /elections/[race]/ (mayor) | 2026-05-19 | Desktop: 8 candidate cards + comparison `<table>`. Mobile: 8 candidate `<details>` |
| /elections/[race]/[candidate]/ (McDuffie, JLG) | 2026-05-21 | City Cast/TrueDot poll item renders at top of Coverage on both; older items dropped to hold cap=12; zero console errors. |
| /issues/ranked-choice/ recentMoves | 2026-05-21 | New poll move ("second-choice transfers could decide the race") renders at top of timeline. |
| Sources page | 2026-05-19 | Stable. 74 sources / 6 groups |
| Footer | 2026-05-19 | Stable. Build date shows 2026-05-19 |

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
- **2026-05-12** (mobile-overhaul verification, 5 min, two-viewport pass) — zero new issues. All 14 baseline flows pass at both 375 and 1280. Confirmed Phase A/B/C/D + candidate-enrichment + clickable race cards work end-to-end.
- **2026-05-12** (tablet pass, 768×1024) — found UAT-011 and UAT-012, both wide-table overflows at 768. Root cause: sibling-pair threshold `sm:` was too low for tables wider than ~640px. Fixed by bumping VotingRecordMatrix and `/elections/[race]/` comparison to `lg:` threshold. Verified at 375/768/1280: mobile cards on phone + tablet, full table on desktop, no page-level horizontal overflow at any viewport.
- **2026-05-12** (bug-fix pass) — found and fixed UAT-013 (badge "D · D" → "D" for all Democrat candidates; `page.tsx:93`), UAT-014 (hero dateline UTC off-by-one → `toLocaleDateString('sv')`; `page.tsx:15`), UAT-015 (alert ticker duplicate `<a>` links hidden from accessibility tree via `aria-hidden`; `AlertTicker.tsx`). All three verified in browser. Zero open issues.
- **2026-05-18** (scheduled run 6, three-viewport pass) — paired with data-refresh run 6. Data refresh added the May 18 Fox 5/Georgetown debate alert, a Mendelson-on-CFO-reserves recentMove on `/issues/budget/`, and a more specific Bowser FY27 framing ($469M cuts + $100M tax increases). Verified on `/`, `/officials/`, `/elections/`, `/elections/mayor/`, `/issues/budget/` at desktop (1280) / tablet (768) / mobile (375). Build date shows `2026-05-18` in hero + footer; zero console errors; no horizontal overflow at any viewport. `/officials/` page is now 5,014px tall at desktop (down from 20,218px in run 5) — confirms UAT-018 + BL-UAT-11 fixes shipped together. Mayor race shows "8 declared candidates" with no oneLine mismatch (BL-UAT-15 guard holds). Found 2 passive items: BL-UAT-16 (auto-expire stale alerts past event date) and BL-UAT-17 (the dc-uat skill doc still references the pre-BL-47 9-item nav + hamburger; BF-05/BF-06 need updating).
- **2026-05-19** (scheduled run 8, three-viewport sanity) — paired with data-refresh run 8 (May 18 Fox 5 + Hoya debate-recap items added to JLG/McDuffie/Goodweather news arrays; May 19 alert for the May 22 drop-box opening; alerts.ts also updated the May 18 entry from "tonight" to past tense with the analyst-called winner). Verified at desktop (1280) → tablet (768) → mobile (375) across `/`, `/elections/`, `/elections/mayor/janeese-lewis-george/`, `/elections/mayor/kenyan-mcduffie/`, `/officials/`. Zero new bugs. Hero kicker shows `UPDATED 2026-05-19` and dynamic h1 rolled forward to "Four weeks until the primary." (28 days). Candidate news arrays still at cap=12 sorted desc; JLG + McDuffie now lead with the two May 18 items. `/officials/` heading count = 8 at tablet; no horizontal overflow at any viewport; zero console errors. All 119 unit tests pass; typecheck clean.
- **2026-05-20** (scheduled run 9, desktop + mobile pass) — paired with data-refresh run 9. Thin news day (last refresh <36h prior): only one substantive item found, the May 18 RAMW restaurant-association endorsement of McDuffie (Axios), added to his `news[]` (dropped the lower-value May 12 Georgetowner profile to hold cap=12) and woven into theme-1 (`detail` + swapped one `supportingUrl`). No withdrawals / court rulings / new congressional votes found. Verified at desktop (1280) + mobile (375) across `/`, `/elections/`, `/elections/mayor/kenyan-mcduffie/`, `/officials/`, `/issues/ranked-choice/`: RAMW renders on the profile (themes block + collapsed coverage) and in the `/elections/` comparison matrix; "2 OF 6 STATED" positions; no console errors; no horizontal overflow at 375px; no duplicate IDs. All 119 unit tests pass; typecheck + static build clean. **Process note:** confirmed the NavBar is now a 2-item server-component popout nav (no hamburger) — corrected the stale Critical Flows 5/6 and NavBar rows in this file, and filed BL-UAT-19 for the remaining drift in CLAUDE.md + both `~/.claude/skills/` files (subdir paths, Next 14.2.13, `dc-watch-dev` launch config). **No tablet pass this run** (time budget) — carry forward.
- **2026-05-23** (scheduled run 11, static-export verification) — paired with data-refresh run 11. Thin ~2-day window (only ~36h since run 10). Two data changes: (1) a May 23 advance voter-registration-deadline alert (deadline May 26, same-day registration through Election Day June 16) at the top of `alerts.ts`; (2) the May 22 Axios delegate piece ("How DC's next delegate would handle Trump") added to both Robert White and Brooke Pinto `news[]` (both were under cap, no drops). No candidate filings/withdrawals, court rulings, congressional votes, or new debates in the May 21–23 window. **Live preview blocked:** the `dc-watch-dev` server couldn't bind — a stale `next dev` from another local project (DryDock, next-server v15.5.18, PID 96196) was holding port 3000, and the autoPort-assigned 60751 didn't take, so the browser got connection-refused. Did **not** kill the cross-project process (out of scope for this folder). Verified instead against the static `out/` build: homepage renders the new reg-deadline alert (poll alert intact at 3 marquee occurrences); `/elections/us-house-delegate/robert-white/` and `/brooke-pinto/` both render the Axios item; hero + footer dates auto-render `2026-05-23` from `BUILD_DATE` (9 occurrences on home). typecheck clean, 119 tests pass, static build emits all 71 routes. Filed BL-UAT-20 (launch-config should pin a project-specific port so scheduled UAT runs don't collide with other projects' dev servers on 3000). **No interactive pass** (RCV simulator / address lookup) this run — the live server was unavailable, but neither this run's data changes nor the affected components are interactive.
- **2026-05-21** (scheduled run 10, desktop + mobile pass) — paired with data-refresh run 10. One high-signal item: the first public poll of DC's RCV-era primary (City Cast / TrueDot, fielded May 12–17, 735 residents / 487 Dems — Lewis George 39% / McDuffie 34% first-choice, McDuffie ahead 27–15 on second choices). Added to `alerts.ts` (top, RCV-framed with both numbers), the RCV page `recentMoves[]` (neutral "second-choice transfers could decide the race" framing), and both mayoral candidates' `news[]` (City Cast item at top; JLG dropped the Feb 1 donor social post, McDuffie dropped the Apr 15 WTOP debate item — both theme-safe, cap held at 12). No candidate filings/withdrawals, court rulings, or congressional votes in the May 19–21 window. Verified via `fetch` + live DOM at desktop + mobile across `/`, `/elections/`, `/elections/mayor/kenyan-mcduffie/`, `/elections/mayor/janeese-lewis-george/`, `/issues/ranked-choice/`: poll renders in all four target locations; old items correctly dropped; zero console errors; no horizontal overflow at 375px on `/` + `/elections/`; no duplicate IDs. Static build emits all 71 routes; 119 tests + typecheck clean. Fixed the in-repo CLAUDE.md half of BL-UAT-19 (NavBar file-map entry + Tech-invariants line now describe the BL-47 server-component nav). **No tablet pass this run** (time budget) — carry forward.
- **2026-05-24** (scheduled run 13, static-export verification) — paired with data-refresh run 13, the **second same-day pass** after run 12 this morning, so an extremely thin (~hours) news window. Two verified data changes: (1) cleared the runs-9-through-12 standing follow-up by parsing the April 30, 2026 DCBOE registration PDF — `electionStats[0]` updated 476,066 (Feb 28) → 478,797 (Apr 30; 75.39% Democratic), sourced to the dated PDF; (2) caught a **roster gap in a profiled race** — the East of the River 2026-05-01 at-large roundup (already cited in our data) names 9 declared Democrats for the Bonds seat but only 6 were tracked, so added Dwight Davis, Dyana N.M. Forester, Fred Hill, and Greg Jackson (party D, declared, EOTR source, campaign sites HEAD-checked live — fredhill4dc.com 403/bot-block but resolves, treated reachable per BL-UAT-21) and bumped the race oneLine 6 → 10. Verified against the static `out/` build (no live server, per BL-UAT-20): `/elections/` renders 478,797 (476,066 gone) and "10 declared Democrats"; the 4 new profile pages generate (**build now emits 75 routes, up from 71**); `/elections/council-at-large-bonds/` links all 10 candidate profiles; the dyana-forester profile renders name + AFL-CIO note + campaign link. typecheck clean, 119 tests pass. Zero new product bugs. Filed BL-UAT-22 (enrich the 4 new at-large candidates with news/positions next run) and BL-UAT-23 (reconcile the Nate Fleming entry, which our data carries but the EOTR roundup omits, against the authoritative DCBOE candidate PDF). **No interactive pass** (RCV simulator / address lookup) — neither was touched this run. May 21 WAMU voter-guide + Daily Caller opinion items were found but skipped (guide/opinion, not per-candidate developments).
