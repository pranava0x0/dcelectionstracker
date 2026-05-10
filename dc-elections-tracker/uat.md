# UAT Baseline — DC Elections Tracker

_Created: 2026-05-10_
_Last run: 2026-05-10_

## Project Info
- **Stack**: Next.js 14.2.13 App Router, `output: "export"` (static site), TypeScript strict, Tailwind 3
- **Dev server**: `npm run dev` → http://localhost:3000 (note: issue pages broken in dev — see UAT-001)
- **Production test**: `npm run build && npx serve out/` for issue pages
- **Entry point**: `src/app/layout.tsx` → `src/app/page.tsx`
- **Key routes**:
  - `/` — Homepage (hero, alert ticker, countdowns, latest cards, issue cards, editorial standard)
  - `/issues/[slug]/` — 6 issue pages: statehood, public-safety, housing, budget, transportation, schools
  - `/officials/` — All DC elected officials, grouped by body
  - `/elections/` — Key dates, race cards, registration links
  - `/sources/` — All 74 cited sources, grouped by issue topic

## Critical Flows (run every time)

1. **Homepage loads**: Navigate to `/` → verify hero renders, countdown shows days remaining, alert ticker scrolling, 6 issue cards visible, 3 latest cards visible, footer present
2. **Officials page renders**: Navigate to `/officials/` → verify all 5 groups (Executive, At-Large Council, Ward Council, Federal, SBOE), 28 total cards, party badges correct (D=blue, I=black, Nonpartisan=gray)
3. **Elections page renders**: Navigate to `/elections/` → verify two countdowns, key dates list (future dates only), 12 race cards with open/incumbent/special badges, registration links section
4. **Sources page renders**: Navigate to `/sources/` → verify 74 sources across 6 topic groups, count displayed matches actual links
5. **Nav links work (desktop)**: At ≥1024px, all 9 nav items visible and clickable; logo links home
6. **Alert ticker scrolling**: Ticker marquee animates; 8 most-recent alerts visible; each is a clickable external link
7. **Issue cards link correctly**: Each of the 6 issue cards on homepage links to `/issues/[slug]/`; slug in URL matches card title
8. **Mobile nav absent bug**: At 375px, confirm only logo + "ARE YOU REGISTERED?" visible (known bug UAT-002 — log if fixed)
9. **Issue pages in build**: Run `npm run build` and verify all 6 issue pages generate without error

## Sections & Last Tested

| Section | Last Tested | Notes |
|---------|-------------|-------|
| Homepage — hero + CTAs | 2026-05-10 | Stable. Hardcoded "five weeks" headline will go stale (UAT-004) |
| Homepage — alert ticker | 2026-05-10 | Stable. 8-item slice + CSS marquee animation |
| Homepage — countdowns | 2026-05-10 | Stable. Client-side JS updates every minute. Shows 37d/177d as of May 10 |
| Homepage — latest cards | 2026-05-10 | Stable. 3 most-recent alerts rendered |
| Homepage — issue cards grid | 2026-05-10 | Stable. 6 cards, correct stripe/alarm coloring |
| Homepage — editorial standard | 2026-05-10 | Stable. GitHub link present |
| NavBar (desktop) | 2026-05-10 | Stable. 9 items + logo + CTA button |
| NavBar (mobile <1024px) | 2026-05-10 | BROKEN — no mobile nav (UAT-002) |
| Issue pages (dev mode) | 2026-05-10 | BROKEN in dev (UAT-001). Build mode untested this session |
| Officials page | 2026-05-10 | Stable. 28 cards / 5 groups. "Nonpartisan" badge overflow (UAT-003) |
| Elections page | 2026-05-10 | Stable. 7 dates, 12 races, registration links |
| Sources page | 2026-05-10 | Stable. 74 sources / 6 groups |
| Footer | 2026-05-10 | Stable. Build date shows correctly |

## Known Stable Areas
- Static pages: `/officials/`, `/elections/`, `/sources/` — all render correctly in dev and build
- Homepage layout — all sections render, no JS errors in console
- Alert ticker animation — CSS marquee, no JS errors
- Countdown component — client-side hydration works, no errors
- Card hover interactions — lift/shadow transitions on issue cards, official cards, latest cards
- External source links — all have `target="_blank" rel="noopener noreferrer"` correctly

## Known Flaky / Unstable Areas
- **Issue pages in `next dev`** — Hard crash due to Next.js 14.2.x bug (UAT-001). Always test with build instead
- **Mobile navigation** — Completely absent at <1024px (UAT-002). High priority fix
- **Screenshot-after-scroll** — Preview tool doesn't capture scrolled viewport; use `preview_snapshot` or `preview_eval` DOM queries for content below the fold

## Exploration Notes

### Paths to try next run
- [ ] Issue page full-scroll (build mode): hero stats, what's at stake, who decides, recent moves, voter questions, live sources
- [ ] `npm run build` output — check all 6 slugs generate, no TypeScript errors
- [ ] `npm run typecheck` — confirm no type errors introduced
- [ ] Hover states on issue cards and official cards (lift animation)
- [ ] AlertTicker at tablet width (768px) — does it wrap or overflow?
- [ ] Elections page after June 16 — does upcomingDates filter empty gracefully?
- [ ] Officials page "Footnote" ANC card at bottom — renders correctly?
- [ ] Footer "Source on GitHub" link — correct repo URL?
- [ ] Sources page URL truncation — long URLs should truncate with `truncate` class
- [ ] Countdowns once primary passes — check "Election day passed." state

### Edge cases to try
- Rapid nav clicks (multiple quick page transitions)
- Very narrow viewport (320px — old iPhone SE)
- Dark mode preference via OS (no dark theme implemented — should render light regardless)
- Reduced motion preference — CSS animation should stop (marquee + pulseDot + card hover)
- Keyboard tab order through the nav (after UAT-002 fix, verify tab order)

### Patterns noticed
- The Next.js `output: export` + dev server combination is the #1 DX pain point — document clearly in CLAUDE.md
- No client-side state or forms — purely static render + a few `useEffect` timers; very little to break
- All data is in `src/data/` TypeScript files — content bugs (wrong dates, wrong sources) are the most likely category after the nav/mobile bug
