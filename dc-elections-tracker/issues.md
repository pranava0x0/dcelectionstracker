# DC Elections Tracker — Issues

Bug log. Populated by UAT session 2026-05-10.

| ID | Status | Title | Severity |
|---|---|---|---|
| UAT-001 | open | All 6 issue pages crash in `next dev` with `output: export` | high |
| UAT-002 | open | No mobile navigation — nav hidden at <1024px with no hamburger fallback | high |
| UAT-003 | open | "Nonpartisan" overflows the party badge chip on Officials page | low |
| UAT-004 | open | Hardcoded "Five weeks until the primary" headline becomes stale weekly | low |
| UAT-005 | open | Dead code in `path()` helper — unreachable http/https guard | low |
| UAT-006 | open | Raw slug shown in IssueCard and IssueDetail kicker line | low |
| UAT-007 | open | No skip-to-content link for keyboard / screen reader navigation | low |

---

## Open Issues

### [UAT-001] All 6 issue pages crash in `next dev` with `output: export` config
- **Severity**: high
- **Page/Section**: `/issues/statehood/`, `/issues/public-safety/`, `/issues/housing/`, `/issues/budget/`, `/issues/transportation/`, `/issues/schools/`
- **Discovered**: 2026-05-10
- **Status**: open
- **Description**: When running `next dev`, navigating to any issue page returns a black screen with Next.js error overlay: _"Page '/issues/[slug]/page' is missing exported function generateStaticParams(), which is required with 'output: export' config."_ The function `generateStaticParams` IS present and correctly exported in `src/app/issues/[slug]/page.tsx`. This is a Next.js 14.2.x dev-server bug — it incorrectly enforces the `generateStaticParams` check for dynamic routes when `output: "export"` is set, even when the function exists. The production static build (`next build`) is unaffected and should work correctly.
- **Steps to Reproduce**:
  1. `npm run dev` in `dc-elections-tracker/`
  2. Open `http://localhost:3000`
  3. Click any issue card (Statehood, Public Safety, etc.)
  4. Page goes black; server logs show the missing-generateStaticParams error
- **Workaround**: Test issue pages via `npm run build && npx serve out/` rather than `next dev`
- **Fix**: Upgrade Next.js to a version that fixes this dev-mode bug (check 14.3.x or 15.x release notes), or temporarily remove `output: "export"` from `next.config.js` only during local dev (use an env var).

---

### [UAT-002] No mobile navigation — all 9 nav items hidden at <1024px with no fallback
- **Severity**: high
- **Page/Section**: All pages — NavBar
- **Discovered**: 2026-05-10
- **Status**: open
- **Description**: `NavBar.tsx` applies `hidden lg:flex` to the nav items list, which hides all 9 nav items (Statehood, Public Safety, Housing, Budget, Transit, Schools, Officials, Elections, Sources) at any viewport below 1024px. There is no hamburger button, drawer, or any alternative navigation. On mobile/tablet, users can only reach `/elections/` and `/officials/` via the two hero CTA buttons on the homepage. Every other section — including all 6 issue pages and Sources — is completely unreachable on mobile.
- **Steps to Reproduce**:
  1. Open the site at 375px or 768px viewport width
  2. Observe the nav bar — only the logo and "ARE YOU REGISTERED?" button are visible
  3. Try to navigate to any page not linked from the homepage hero
- **Fix**: Add a hamburger button visible at `< lg` that toggles a full-screen or drawer nav. Minimum viable: a `<details>`/`<summary>` toggle with no JS dependency, since the site is otherwise static.

---

### [UAT-003] "Nonpartisan" text overflows the party badge chip on Officials page
- **Severity**: low
- **Page/Section**: `/officials/` — DC State Board of Education section
- **Discovered**: 2026-05-10
- **Status**: open
- **Description**: The party badge chip in official cards (`partyTone()` in `src/app/officials/page.tsx`) is sized for 1–2 character codes ("D", "I", "R") with `h-5 min-w-[20px]`. The `partyTone()` function has no case for `"Nonpartisan"` or `"Statehood Green"` (both defined in the `Party` type in `officials.ts`), so it falls through to the default `bg-muted text-white` style. All 9 SBOE members render "Nonpartisan" (11 chars) full-width in the chip, making it visually oversized and inconsistent with the other party badges.
- **Steps to Reproduce**:
  1. Navigate to `/officials/`
  2. Scroll to the "DC State Board of Education" section
  3. Observe the party badge — shows full word "Nonpartisan" in an oversized gray pill
- **Fix**: Add cases to `partyTone()` for `"Nonpartisan"` (display as "NP") and `"Statehood Green"` (display as "SG" or "G"). Update `party` field display text separately from the pill value, or abbreviate in the render.

---

### [UAT-004] Hardcoded "Five weeks until the primary" headline becomes stale weekly
- **Severity**: low
- **Page/Section**: `/` — hero section
- **Discovered**: 2026-05-10
- **Status**: open
- **Description**: The homepage h1 contains the static string `"Five weeks until the primary."` (`src/app/page.tsx:29`). As of 2026-05-10 this is ~accurate (primary is 37 days away), but the string will be wrong by May 17 (4 weeks), and increasingly so each week. The `Countdown` component correctly shows the live day count beneath, making the static headline feel inconsistent. A build-time computed string (or removing the time reference entirely) would avoid silent staleness.
- **Fix**: Compute weeks dynamically at build time from `PRIMARY_DATE`. Example: `Math.ceil(diffDays / 7)` weeks. Or replace with a timeless framing: "The 2026 primary is June 16. Here's what just changed in your city."

---

### [UAT-005] Dead code in `path()` helper — unreachable https guard
- **Severity**: low
- **Page/Section**: `src/lib/links.ts`
- **Discovered**: 2026-05-10
- **Status**: open
- **Description**: The `path()` function has an unreachable guard:
  ```ts
  if (!href.startsWith("/")) return href;          // catches all non-slash strings
  if (href.startsWith("http://") || ...) return href; // UNREACHABLE — already caught above
  ```
  Any `href` that starts with `http://` or `https://` will never reach the second check because `"http://..."` does not start with `"/"`, so it returns on the first check. The second `if` is dead code.
- **Fix**: Remove the dead second guard. The function is correct in behavior — just has a confusing ghost branch.

---

### [UAT-006] Raw slug shown in IssueCard and IssueDetail kicker
- **Severity**: low
- **Page/Section**: `/` (IssueCards), `/issues/[slug]/` (IssueDetail)
- **Discovered**: 2026-05-10
- **Status**: open
- **Description**: Both `IssueCard.tsx:19` and `IssueDetail.tsx:51` render `Issue · {issue.slug}` as the kicker. This produces strings like "Issue · public-safety" and "Issue · transportation" — hyphenated lowercase raw slugs rather than proper labels. The `issue.title` is already available on the object.
- **Fix**: Replace `issue.slug` with the formatted slug (e.g. `issue.slug.replace(/-/g, ' ')` with title-case) or use a new `issue.shortTitle` field, or just remove the slug from the kicker entirely (the page title makes the topic obvious).

---

### [UAT-007] No skip-to-content link for keyboard / screen reader navigation
- **Severity**: low
- **Page/Section**: All pages — `src/app/layout.tsx`
- **Discovered**: 2026-05-10
- **Status**: open
- **Description**: The layout has no skip navigation link. Keyboard users must tab through the entire sticky NavBar (10 links) and AlertTicker (8–16 links, duplicated for the loop) before reaching main content on every page. The `<main>` element exists but has no `id` to link to.
- **Fix**: Add `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to content</a>` as the first child of `<body>`, and `id="main-content"` to the `<main>` element.

---

## Resolved Issues

_(none yet)_
