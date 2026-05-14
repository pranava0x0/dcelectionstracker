# DC Elections Tracker — Issues

Bug log. Populated by UAT session 2026-05-10. All bugs closed 2026-05-10.
`/dc-data-refresh` run 2 (2026-05-10) shipped BL-28, BL-26, BL-23, BL-UAT-08 — no new issues filed.
UAT run 3 (2026-05-11): 3 new issues filed (UAT-013–015). All closed 2026-05-11. UAT-014 fix also covered the same bug in `Footer.tsx`; both consolidated into `src/lib/build-date.ts`.
`/dc-data-refresh` run 3 + UAT run 4 (2026-05-12, scheduled): no new bugs filed. Site clean on mobile (375), desktop (1280) across home / `/elections/` / `/officials/` / `/issues/ranked-choice/`. One passive accessibility tightening logged as BL-UAT-10 (hamburger 40×40 → 44×44).
Bug fix bundled with the Next 16 upgrade (2026-05-14): UAT-016 closed — mobile nav drawer auto-closes on link tap, addressing the long-standing BL-UAT-09 backlog item.

| ID | Status | Title | Severity |
|---|---|---|---|
| UAT-016 | closed | Mobile nav drawer stays open after tapping a link — should collapse on navigation | low |
| UAT-013 | closed | Candidate profile party badge renders "D · D" for Democrat candidates | high |
| UAT-014 | closed | Homepage hero and footer date show tomorrow's date in US timezones (UTC vs local) | low |
| UAT-015 | closed | Alert ticker duplicate links have no `aria-hidden` — screen readers hear every headline twice | low |
| UAT-001 | closed | All 6 issue pages crash in `next dev` with `output: export` | high |
| UAT-002 | closed | No mobile navigation — nav hidden at <1024px with no hamburger fallback | high |
| UAT-003 | closed | "Nonpartisan" overflows the party badge chip on Officials page | low |
| UAT-004 | closed | Hardcoded "Five weeks until the primary" headline becomes stale weekly | low |
| UAT-005 | closed | Dead code in `path()` helper — unreachable http/https guard | low |
| UAT-006 | closed | Raw slug shown in IssueCard and IssueDetail kicker line | low |
| UAT-007 | closed | No skip-to-content link for keyboard / screen reader navigation | low |
| UAT-008 | closed | Clicking nav tabs on the deployed site double-prefixes basePath in the URL | high |
| UAT-009 | closed | "Public Safety" wraps to a second line in the desktop nav | low |
| UAT-010 | closed | Issue page h1 is oversized at desktop widths | low |
| UAT-011 | closed | Voting record matrix table overflows the container at tablet (768px) | low |
| UAT-012 | closed | Issue-by-issue comparison table overflows the container at tablet (768px) | low |

---

## Open Issues

_No open issues._

---

## Resolved Issues (bundled with Next 16 upgrade, 2026-05-14)

### [UAT-016] Mobile nav drawer stays open after tapping a link
- **Severity**: low
- **Page/Section**: All pages — `NavBar` mobile hamburger drawer (`<lg`)
- **Discovered**: 2026-05-12 (logged as BL-UAT-09 during UAT run 4)
- **Closed**: 2026-05-14
- **Status**: closed
- **Description**: On mobile and tablet widths, the hamburger drawer (`<details>` element) opens when tapped and stays open after the user taps a nav link. Because Next.js performs client-side route transitions without a full page reload, the `<details>` `open` attribute is not reset — the user lands on the new page with the drawer still expanded, obscuring the page content until they tap the close icon.
- **Steps to Reproduce**: At mobile width (≤1023px), tap the hamburger to open the drawer. Tap any nav link (e.g. "Officials"). Observe: navigates to `/officials/`, but the drawer is still open over the new page.
- **Root cause**: `<details>` is a native HTML element with no awareness of in-app navigation. The mobile nav `<Link>`s were server-rendered with no client-side interaction.
- **Fix**: `src/components/NavBar.tsx` is now a client component (`"use client"`). Each mobile-drawer `<Link>` gets an `onClick` handler that walks up to the nearest `<details>` ancestor and removes its `open` attribute — `e.currentTarget.closest("details")?.removeAttribute("open")`. The desktop inline nav is unaffected (no `<details>` ancestor → handler is a no-op there). Verified in dev preview at 375×812: drawer opens, link tap navigates to `/officials/` and the drawer is closed on arrival. Desktop (1280×800) inline nav still renders normally and the mobile `<details>` is `display: none`.

---

## Resolved Issues (UAT run 3, 2026-05-11)

### [UAT-013] Candidate profile party badge renders "D · D" for Democrat candidates
- **Severity**: high
- **Page/Section**: `/elections/[race]/[candidate]/` — identity block
- **Discovered**: 2026-05-11
- **Closed**: 2026-05-11
- **Status**: closed
- **Description**: The party badge on every Democrat candidate profile shows "D · D" — two instances of the party abbreviation separated by a middle dot. For example, Janeese Lewis George's profile badge reads "D · D  DECLARED CANDIDATE FOR MAYOR". Same issue affects any candidate whose raw `candidate.party` string equals the abbreviation returned by `partyTone().label` (all D, R, I candidates).
- **Steps to Reproduce**: Navigate to any Democrat candidate profile, e.g. `/elections/mayor/janeese-lewis-george/`. Observe the badge below the h1.
- **Root cause**: `src/app/elections/[race]/[candidate]/page.tsx:93` renders `{tone.label} · {candidate.party}`. For Democrats, `tone.label` = `"D"` and `candidate.party` = `"D"`, so both sides of the dot are identical. For "Statehood Green" candidates it renders "SG · Statehood Green" (different values — arguably intentional but visually inconsistent).
- **Fix**: Dropped `· {candidate.party}` from the badge span in `src/app/elections/[race]/[candidate]/page.tsx:93`. `tone.label` already conveys the party abbreviation. Verified: JLG badge renders "D" with no dot or duplicate.

---

### [UAT-014] Homepage hero and footer date show tomorrow's date in US timezones
- **Severity**: low
- **Page/Section**: `/` — hero dateline; all pages — `Footer` component
- **Discovered**: 2026-05-11
- **Closed**: 2026-05-11
- **Status**: closed
- **Description**: The "Updated 2026-05-12" dateline on the homepage hero and the "Last updated 2026-05-12" in the footer both showed one day in the future when built or served in a US timezone (UTC−4 to UTC−8). `new Date().toISOString()` returns UTC time; at e.g. 10 PM EDT (UTC−4), UTC is already the next calendar day.
- **Steps to Reproduce**: View the homepage or any page footer at any time in the evening US Eastern time. Observe the date is tomorrow.
- **Root cause**: `src/app/page.tsx:15` — `const today = new Date().toISOString().slice(0, 10)`. `src/components/Footer.tsx:4` — `const buildDate = new Date().toISOString().slice(0, 10)`. Both used `toISOString()` which always returns UTC.
- **Fix**: Replaced both with `new Date().toLocaleDateString('sv')` (Swedish locale → `YYYY-MM-DD` in local time). Then extracted to a single `BUILD_DATE` constant in `src/lib/build-date.ts` imported by both, so the date can't drift between them. Verified: hero shows "UPDATED 2026-05-11" and footer shows "Last updated 2026-05-11" in EDT.

---

### [UAT-015] Alert ticker duplicate links missing `aria-hidden` — screen readers hear every headline twice
- **Severity**: low
- **Page/Section**: All pages — `AlertTicker` component
- **Discovered**: 2026-05-11
- **Closed**: 2026-05-11
- **Status**: closed
- **Description**: `AlertTicker.tsx` creates a seamless marquee loop by rendering `[...items, ...items]` — 8 alert items duplicated to 16. All 16 `<a>` links are exposed to the accessibility tree with no `aria-hidden` on the second set. Screen readers will announce every alert headline twice in sequence, which is confusing and creates unnecessary noise.
- **Steps to Reproduce**: Use a screen reader (VoiceOver on macOS: Cmd+F5) and navigate to any page. Tab through the alert ticker region — each headline is announced twice.
- **Root cause**: `src/components/AlertTicker.tsx:5` — `const loop = [...items, ...items]`. The map on line 22 renders all 16 as full `<a>` elements with no aria distinction between original and duplicate set.
- **Fix**: Added `aria-hidden={i >= items.length ? true : undefined}` to the `<a>` in `src/components/AlertTicker.tsx`. Verified: DOM query confirms 8 visible links + 8 `aria-hidden="true"` duplicates at index 8–15.

---

## Resolved Issues (UAT run 1–2, 2026-05-10)

### [UAT-011] Voting record matrix table overflows the container at tablet (768px)
- **Severity**: low
- **Page/Section**: `/officials/` — VotingRecordMatrix (BL-12)
- **Discovered**: 2026-05-11
- **Closed**: 2026-05-11
- **Status**: closed
- **Repro (was)**: At 768px the 15-column table renders at ~915px scroll width inside a ~734px content container, forcing horizontal scroll. The `overflow-x-auto` wrapper allowed the scroll but the cramped experience defeats Phase A's intent.
- **Fix**: Bumped the sibling-pair threshold from `sm:` to `lg:` in `VotingRecordMatrix.tsx` — mobile chip-grid renders at `<lg` (covers phone + tablet), original 15-column table renders at `lg+` (≥1024px) where it has room. Verified at 375 / 768 / 1280: mobile-cards display at the first two, table at the third, no page-level horizontal overflow at any size.

### [UAT-012] Issue-by-issue comparison table overflows the container at tablet (768px)
- **Severity**: low
- **Page/Section**: `/elections/[race]/` — Issue-by-issue comparison (BL-32 / BL-19)
- **Discovered**: 2026-05-11
- **Closed**: 2026-05-11
- **Status**: closed
- **Repro (was)**: At 768px the 7-column table renders at ~793px scroll width inside a ~734px container. The 6 issue cells need column width to read full-sentence stances.
- **Fix**: Same threshold bump (`sm:` → `lg:`) in `src/app/elections/[race]/page.tsx`. Tablet users now get the per-candidate `<details>` stack that mobile users already had. Verified at all three viewports.

### [UAT-001] All 6 issue pages crash in `next dev` with `output: export` config
- **Severity**: high
- **Page/Section**: `/issues/[slug]/`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: `next.config.js` now omits `output: "export"` when `process.env.NODE_ENV === "development"`. Production build is unaffected (still static-exports to `out/`); dev server no longer hits the Next.js 14.2.x false-positive on `generateStaticParams`. Verified: `GET /issues/statehood/ 200` in dev, full build still emits all 6 issue routes.

### [UAT-002] No mobile navigation — all 9 nav items hidden at <1024px with no fallback
- **Severity**: high
- **Page/Section**: All pages — NavBar
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Added a `<details>`/`<summary>` hamburger trigger to `NavBar.tsx` that appears at `<lg` only. The expanded panel is positioned absolutely below the header and lists all 9 nav items as block links. No JS dependency — uses native disclosure semantics. Default disclosure marker is hidden via `.nav-summary` rule in `globals.css`. Hamburger icon swaps to an X when open via `group-open:` Tailwind variants. Verified at 357px viewport: tapping the hamburger reveals all 9 items (Statehood through Sources); at 1280px viewport the inline desktop nav shows and the hamburger is hidden.

### [UAT-003] "Nonpartisan" text overflows the party badge chip on Officials page
- **Severity**: low
- **Page/Section**: `/officials/`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: `partyTone()` in `src/app/officials/page.tsx` now returns a `label` field. Mapped: D→"D", I→"I", R→"R", Statehood Green→"SG", Nonpartisan→"NP". The pill renders `tone.label` and exposes the full party name via `title=`. SBOE members now render "NP" in a properly-sized chip. Verified: 9 "NP" badges on the Officials page.

### [UAT-004] Hardcoded "Five weeks until the primary" headline becomes stale weekly
- **Severity**: low
- **Page/Section**: `/` — hero section
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Added `timeUntilPrimaryHeadline()` to `src/app/page.tsx` that computes the headline at build time from `PRIMARY_DATE`. Falls through three regimes: past primary → "The primary is here."; <7 days → "N days until the primary."; otherwise → "{Word} weeks until the primary." with `Math.round(days/7)` and word lookup for 0–12. Singular/plural handled. Verified: 36 days remaining → "Five weeks until the primary."

### [UAT-005] Dead code in `path()` helper — unreachable https guard
- **Severity**: low
- **Page/Section**: `src/lib/links.ts`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Removed the unreachable `if (href.startsWith("http://") || ...)` branch. The first `if (!href.startsWith("/"))` already returns external URLs unchanged. Behavior unchanged; ghost branch gone.

### [UAT-006] Raw slug shown in IssueCard and IssueDetail kicker
- **Severity**: low
- **Page/Section**: `/`, `/issues/[slug]/`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: `IssueCard.tsx` and `IssueDetail.tsx` kicker text reduced from `Issue · {issue.slug}` to just `Issue`. The card/page title carries the topic; the kicker is now a clean category label. Verified: all 6 home-page issue cards render kicker "Issue".

### [UAT-007] No skip-to-content link for keyboard / screen reader navigation
- **Severity**: low
- **Page/Section**: All pages — `src/app/layout.tsx`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Added `<a href="#main-content">Skip to content</a>` as the first child of `<body>`, styled with `sr-only focus:not-sr-only` so it only appears on keyboard focus (top-left, primary background, mono uppercase to match the site voice). Added `id="main-content"` to `<main>`. Verified: skip link present in accessibility tree on the home page.

### [UAT-009] "Public Safety" wraps to a second line in the desktop nav
- **Severity**: low
- **Page/Section**: All pages — `NavBar` desktop nav (`>= lg`)
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Added `whitespace-nowrap` to the desktop nav `<Link>` className in `NavBar.tsx`. "Public Safety" was the only two-word label, and at certain viewport widths it broke onto two lines while neighbors stayed single-line, leaving its bottom edge below the row baseline. Verified at 1400px: all 9 nav links report identical `getBoundingClientRect()` height (17px) and top/bottom (26/43).

### [UAT-010] Issue page h1 is oversized at desktop widths
- **Severity**: low
- **Page/Section**: `/issues/[slug]/` — `IssueDetail` h1
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Stepped the h1 down one Tailwind size in `IssueDetail.tsx`: `text-5xl text-ink sm:text-6xl` → `text-4xl text-ink sm:text-5xl`. Title now renders at 48px instead of 60px on `>= sm`, and 36px instead of 48px on mobile — still display-tight but no longer dominating the viewport.

---

### [UAT-008] Clicking nav tabs on the deployed site double-prefixes basePath in the URL
- **Severity**: high
- **Page/Section**: All pages — every internal `<Link>`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Description**: On the GitHub Pages deploy, clicking any nav item or internal link sent the user to `/dcelectionstracker/dcelectionstracker/<route>/` — a 404. Root cause: `<Link href={path("/officials/")}>` produced `/dcelectionstracker/officials/`, then `next/link` auto-prepended the configured `basePath` again (Next.js Link does this for any internal href). The `path()` helper was redundant inside `<Link>` and actively harmful. Reproduced by running `NEXT_PUBLIC_BASE_PATH=/dcelectionstracker npm run build` and grepping `out/index.html` for `href=".*officials"` — every match showed the double prefix.
- **Fix**: Removed `path()` from all 12 `<Link>` callsites in `NavBar.tsx`, `Footer.tsx`, `IssueCard.tsx`, and `app/page.tsx`. Hrefs are now raw paths like `"/officials/"`. With no remaining consumers, `src/lib/links.ts` and its test were deleted. CLAUDE.md "Tech invariants" and "Don't list" entries reversed to forbid manual basePath prefixing in `<Link>`. Verified: rebuilt with `NEXT_PUBLIC_BASE_PATH=/dcelectionstracker npm run build`; all internal hrefs now render as a single `/dcelectionstracker/<route>/`.
