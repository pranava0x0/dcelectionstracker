# DC Elections Tracker — Issues

Bug log. Populated by UAT session 2026-05-10. All bugs closed 2026-05-10.

| ID | Status | Title | Severity |
|---|---|---|---|
| UAT-001 | closed | All 6 issue pages crash in `next dev` with `output: export` | high |
| UAT-002 | closed | No mobile navigation — nav hidden at <1024px with no hamburger fallback | high |
| UAT-003 | closed | "Nonpartisan" overflows the party badge chip on Officials page | low |
| UAT-004 | closed | Hardcoded "Five weeks until the primary" headline becomes stale weekly | low |
| UAT-005 | closed | Dead code in `path()` helper — unreachable http/https guard | low |
| UAT-006 | closed | Raw slug shown in IssueCard and IssueDetail kicker line | low |
| UAT-007 | closed | No skip-to-content link for keyboard / screen reader navigation | low |
| UAT-008 | closed | Clicking nav tabs on the deployed site double-prefixes basePath in the URL | high |

---

## Open Issues

_(none)_

---

## Resolved Issues

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

### [UAT-008] Clicking nav tabs on the deployed site double-prefixes basePath in the URL
- **Severity**: high
- **Page/Section**: All pages — every internal `<Link>`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Description**: On the GitHub Pages deploy, clicking any nav item or internal link sent the user to `/dcelectionstracker/dcelectionstracker/<route>/` — a 404. Root cause: `<Link href={path("/officials/")}>` produced `/dcelectionstracker/officials/`, then `next/link` auto-prepended the configured `basePath` again (Next.js Link does this for any internal href). The `path()` helper was redundant inside `<Link>` and actively harmful. Reproduced by running `NEXT_PUBLIC_BASE_PATH=/dcelectionstracker npm run build` and grepping `out/index.html` for `href=".*officials"` — every match showed the double prefix.
- **Fix**: Removed `path()` from all 12 `<Link>` callsites in `NavBar.tsx`, `Footer.tsx`, `IssueCard.tsx`, and `app/page.tsx`. Hrefs are now raw paths like `"/officials/"`. With no remaining consumers, `src/lib/links.ts` and its test were deleted. CLAUDE.md "Tech invariants" and "Don't list" entries reversed to forbid manual basePath prefixing in `<Link>`. Verified: rebuilt with `NEXT_PUBLIC_BASE_PATH=/dcelectionstracker npm run build`; all internal hrefs now render as a single `/dcelectionstracker/<route>/`.
