# DC Elections Tracker — CLAUDE.md

A static, voter-accountability site for residents of Washington, DC. Static export, no server, no tracking.

## Editorial promise

1. **Every numeric claim links to a primary or authoritative source.** Council, OCFO, MPD, OSSE, DCBOE, congress.gov, courts.gov, WMATA, BLS, Census, GAO. Secondary reporting (NPR, WaPo, etc.) is acceptable when it is the only available record of a development; primary sources are preferred.
2. **Non-partisan, but not neutral.** We take positions about transparency, accountability, and who pays. We do not take positions about parties or candidates.
3. **Plain language.** No jargon without a one-line gloss. "Home Rule Act" is explained the first time it appears on every page.
4. **Officials are named with ward and party label.** Voting records, when added, are factual records — not endorsements.
5. **Alarming where the facts are alarming.** "Congress overrode DC's tax law for the first time in 50+ years" is a direct factual statement, not a polemic. "X is corrupt" without a source is not allowed.
6. **Wins are reported alongside losses.** Crime is down, traffic deaths are down — those are the same facts as "Congress federalized MPD" and "evictions hit a 7-year high." Both belong.

## Voice rules

- Headlines can be sharp. "5 weeks until the primary. Here's what just happened to your city." is fine. "Wake up, sheeple" is not.
- Use ISO dates (YYYY-MM-DD) in data files. Render in mono.
- Stats are nouns: a number followed by a label. The number is the headline.
- The `alarm: true` flag on a stat is reserved for facts where the underlying number genuinely warrants alarm (firsts in DC history, multi-decade lows/highs, structural revenue cuts).

## Tech invariants

- **Next.js 14 App Router** with `output: "export"` — static site, no server runtime.
- **TypeScript strict.** No `any`. No `// @ts-expect-error` without a comment.
- **Tailwind 3** with HSL CSS variables. Light editorial theme inspired by FiveThirtyEight.
- **`trailingSlash: true`** in `next.config.js`. All internal links use the `path()` helper from `src/lib/links.ts` so the basePath prefix is applied consistently.
- **`basePath`** is read from `NEXT_PUBLIC_BASE_PATH`. Empty in dev; set in the GitHub Actions deploy workflow.
- **No tracking pixels, no third-party SDKs, no client-side data fetching.** Static export only. The only client-side JavaScript is the `Countdown` component's `useEffect` (updates every minute) and the `AlertTicker` marquee (CSS animation).
- **Single source of truth** for issue content: `src/data/issues.ts`. All five (six, in v1) issue pages render from one shared `IssueDetail` component.

## Don't list

- Don't change the visible product name. It is "DC Elections Tracker," everywhere.
- Don't pull in icon libraries, UI kits, animation libraries, fonts, or analytics — i.e. anything that ships to the browser. Visual gravitas comes from typography and restraint, not dependencies. This rule is about **runtime** weight; build/dev tooling (test runners, linters, type-checkers) is fine to add when warranted.
- Don't write claim-without-source content. If a fact lacks a primary source, either find one or omit the claim.
- Don't editorialize about candidates. Officials are listed by name, ward, party, term-end. Voting records (when added) are factual.
- Don't add server routes, API endpoints, or `getServerSideProps`. Static export only.
- Don't break the link helper invariant — never hardcode `/issues/foo/` in a `<Link>`. Always use `path("/issues/foo/")`.
- Don't widen the editorial scope without updating `backlog.md`.

## File map

```
src/
  app/
    layout.tsx
    page.tsx                       # /
    issues/[slug]/page.tsx         # /issues/<slug>/
    officials/page.tsx
    elections/page.tsx
    sources/page.tsx
    globals.css
  components/
    NavBar.tsx
    AlertTicker.tsx
    Footer.tsx
    IssueCard.tsx
    IssueDetail.tsx
    Countdown.tsx
  data/
    issues.ts                      # single source of truth
    officials.ts
    elections.ts
    alerts.ts                      # marquee items
  lib/
    links.ts                       # path() helper
    party.ts                       # partyTone() — party label/color mapping
    headline.ts                    # build-time hero countdown copy
    *.test.ts                      # vitest unit tests, colocated
```

## Local dev

```
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out/
npm run typecheck  # tsc --noEmit
npm test           # vitest run — pure-function unit tests in src/lib/
```

`next.config.js` only sets `output: "export"` outside of development to dodge a Next.js 14.2.x dev-server false-positive on `generateStaticParams` for dynamic routes. Production builds (`next build`) still emit the static export to `out/` exactly as before.

GitHub Pages deploy is automatic on push to `main` via `.github/workflows/deploy.yml`. The workflow runs typecheck → test → build → upload, so a failing unit test blocks deploy. `NEXT_PUBLIC_BASE_PATH` is set in the workflow to match the GitHub Pages URL prefix.

## Tests

Unit tests live next to the modules they cover (`src/lib/*.test.ts`) and run via [vitest](https://vitest.dev). Scope is intentionally narrow — only pure functions whose behavior is non-obvious or has documented edge cases:

- `src/lib/links.test.ts` — `path()` and `isExternal()` across basePath-set and basePath-unset modes.
- `src/lib/party.test.ts` — `partyTone()` mapping for every documented party plus the unknown-fallback.
- `src/lib/headline.test.ts` — `timeUntilPrimaryHeadline()` across past, <7d, 1w, 5w (the launch headline), 8w, and >12w (numeric fallback) regimes.

Tests use a fixed `now` argument rather than `Date.now()` so they don't drift over time. Markup-level fixes (mobile nav, skip link, kicker text) are not unit-tested — those are verified by the build + manual UAT. If we ever add React Testing Library, that's where it would go.
