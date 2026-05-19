# DC Elections Tracker — Issues

Bug log. Populated by UAT session 2026-05-10. All bugs closed 2026-05-10.
`/dc-data-refresh` run 2 (2026-05-10) shipped BL-28, BL-26, BL-23, BL-UAT-08 — no new issues filed.
UAT run 3 (2026-05-11): 3 new issues filed (UAT-013–015). All closed 2026-05-11. UAT-014 fix also covered the same bug in `Footer.tsx`; both consolidated into `src/lib/build-date.ts`.
`/dc-data-refresh` run 3 + UAT run 4 (2026-05-12, scheduled): no new bugs filed. Site clean on mobile (375), desktop (1280) across home / `/elections/` / `/officials/` / `/issues/ranked-choice/`. One passive accessibility tightening logged as BL-UAT-10 (hamburger 40×40 → 44×44).
Bug fix bundled with the Next 16 upgrade (2026-05-14): UAT-016 closed — mobile nav drawer auto-closes on link tap, addressing the long-standing BL-UAT-09 backlog item.
UAT run 5 (2026-05-17) — voter-persona walkthrough across 4 personas × 14 questions. 2 new issues filed (UAT-017, UAT-018). 5 improvement items added to backlog (BL-UAT-11 to BL-UAT-15).
UAT run 7 (2026-05-18, scheduled — evening pass) — desktop + mobile pass across home / `/elections/` / `/officials/` / `/issues/ranked-choice/`. 1 new issue filed (UAT-020); fixed in same run.
UAT run 8 (2026-05-19, scheduled morning pass) — paired with data-refresh run 8 (post-debate news for JLG/McDuffie/Goodweather; drop-box alert). Three-viewport sanity check at desktop / tablet / mobile across `/`, `/elections/`, `/elections/mayor/janeese-lewis-george/`, `/elections/mayor/kenyan-mcduffie/`, `/officials/`. Zero new bugs filed. Build date renders 2026-05-19 in hero + footer; hero h1 dynamic copy advanced to "Four weeks until the primary." (Math.round(28/7)=4). All 119 unit tests still pass.

| ID | Status | Title | Severity |
|---|---|---|---|
| UAT-020 | closed | Voting record matrix desktop header for Trayon White Sr. rendered as "Sr." | low |
| UAT-019 | closed | All three `AddressLookup` references to `dcboe.org/voters/where-to-vote` return 404 — DCBOE retired the URL | high |
| UAT-018 | closed | `/officials/` group sections render kicker spans, not semantic `<h2>` — 3 headings for 28 officials in 5 groups | low |
| UAT-017 | closed | Mayor race `oneLine` says "10 declared Democrats" but data file has 8 candidates | low |
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

## Resolved Issues (UAT run 7, 2026-05-18 evening)

### [UAT-020] Voting record matrix desktop header renders "Sr." for Trayon White Sr.
- **Severity**: low
- **Page/Section**: `/officials/` — `src/components/VotingRecordMatrix.tsx`
- **Discovered**: 2026-05-18 (scheduled UAT run 7, desktop pass)
- **Closed**: 2026-05-18
- **Status**: closed
- **Description**: The desktop ≥1024px voting-record matrix `<thead>` rendered `m.name.split(" ").pop()` for each council column. For "Trayon White Sr." this returned the suffix `"Sr."` instead of `"White"`, producing a nonsensical column header next to the (correct) "Felder" column. The mobile chip view already had a `shortName()` helper that strips `Sr.`/`Jr.`/`II`/`III`/`IV` suffixes (line 22) — the desktop table just wasn't calling it. Both Robert White (At-Large) and Trayon White Sr. (Ward 8) now collapse to "White" in the header, which is an ambiguity worth disambiguating with a first initial (see BL-UAT-16) but is no worse than the previous broken state, and `aria-label`/`title` on every cell already names the full member.
- **Steps to Reproduce**: Open `/officials/` at ≥1024px width. Inspect the council voting-record matrix `<thead>`. Last column showed "Sr."
- **Fix**: In `src/components/VotingRecordMatrix.tsx` line 131, swapped `{m.name.split(" ").pop()}` → `{shortName(m.name)}` to reuse the existing helper. Typecheck + 119 tests still pass.

---

## Resolved Issues (UAT run 5 follow-ons, 2026-05-17)

### [UAT-019] `AddressLookup` polling-place URL returns 404
- **Severity**: high
- **Page/Section**: `/elections/`, `/` (after BL-UAT-12) — `src/components/AddressLookup.tsx`
- **Discovered**: 2026-05-17 (while scoping BL-UAT-13)
- **Closed**: 2026-05-17
- **Status**: closed
- **Description**: All three references to `https://www.dcboe.org/voters/where-to-vote` in `AddressLookup.tsx` (one in `ResultCard`'s CTA button, one in `NotFoundCard`'s instructional copy, one in `ErrorCard`'s instructional copy) returned `404 Not Found`. DCBOE retired the URL — their canonical polling-place tool is now the ArcGIS-hosted Vote Center Locator linked from `dcboe.org`. Voters following any of the three flows hit a dead page on the most important external action.
- **Steps to Reproduce**: Open `/elections/`, submit any address through `AddressLookup`, click `Find your polling place at DCBOE ↗` — DCBOE returns 404.
- **Fix**: Centralized the URL in a `DCBOE_POLLING_PLACE_URL` const at the top of `AddressLookup.tsx`, pointing to `https://dcgis.maps.arcgis.com/apps/instant/nearby/index.html?appid=763576faa0b1470ca0559c377cf3b497` (the live ArcGIS Vote Center Locator). All three CTAs now reference the const. Updated visible CTA text to "DCBOE's Vote Center Locator" in the instructional copy, "Open DCBOE Vote Center Locator ↗" on the button, with an explanatory line acknowledging the tool will ask for the address again (the ArcGIS app is a map widget, not a query-parameter-driven form — BL-UAT-13 inline resolution stays open).

### [UAT-018] `/officials/` group sections render as kicker spans, not semantic `<h2>`
- **Severity**: low
- **Page/Section**: `/officials/` — `src/app/officials/page.tsx`
- **Discovered**: 2026-05-17 (voter-persona UAT, Persona 3 Q3.1 "Who is my Council member?")
- **Closed**: 2026-05-17
- **Status**: closed
- **Description**: The five group titles ("Executive", "DC Council — Chair and At-Large", "DC Council — Ward Members", "Federal Representation", "DC State Board of Education") rendered as styled kicker text, not as `<h2>` elements. `document.querySelectorAll('h1, h2, h3')` on `/officials/` returned only 3 elements (the page h1 + the voting-record matrix h2 + the ANC footnote h2) for a page that documents 28 officials in 5 groups. Screen readers couldn't jump between groups by heading.
- **Steps to Reproduce**: Open `/officials/` in dev mode. Run `document.querySelectorAll('h1, h2, h3').length` in the console — returned 3.
- **Fix**: In `src/app/officials/page.tsx`, changed each group title from `<span className="kicker">` to `<h2 className="kicker">`, preserving the visual treatment. Added `id={group.slug}` on each `<section>` (slugs: `executive`, `council-chair-at-large`, `council-wards`, `federal`, `sboe`) and `id={m.slug}` on each `<li>` for per-member deep-linking. `OfficialGroup` type gained a required `slug` field. Verified: `/officials/` now exposes 8 headings (h1 + 5 group h2 + 2 trailing h2). Paired with BL-UAT-11 (TOC chip strip).

### [UAT-017] Mayor race `oneLine` says "10 declared Democrats" but data file has 8
- **Severity**: low
- **Page/Section**: `/elections/`, `/elections/mayor/` — `src/data/elections.ts` `races2026[]` entry for `mayor`
- **Discovered**: 2026-05-17 (voter-persona UAT, Persona 2 Q2.1 "Who's running for Mayor?")
- **Closed**: 2026-05-17
- **Status**: closed
- **Description**: The `mayor` race `oneLine` read `"... 10 declared Democrats; profile page lists the full roster."` but `candidates2026` had 8 active candidates. `/elections/mayor/` rendered the contradiction inline ("10 declared Democrats" sub-headline followed by "8 declared candidates" h2).
- **Steps to Reproduce**: Navigate to `/elections/mayor/`. Noted the oneLine sub-headline said "10 declared Democrats" but the h2 immediately below read "8 declared candidates".
- **Fix**: Updated the oneLine to say "8 declared Democrats". Longer-term resilience fix (auto-derive the count from `candidatesForRace(slug).length`, or add a unit test that asserts every oneLine numeric count matches the live filter) tracked as BL-UAT-15.

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
