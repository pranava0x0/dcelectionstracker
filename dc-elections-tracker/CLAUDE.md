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
- Don't pull in icon libraries, UI kits, animation libraries, fonts, or analytics. Visual gravitas comes from typography and restraint, not dependencies.
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
```

## Local dev

```
npm install
npm run dev   # http://localhost:3000
npm run build # static export to ./out/
```

**Known dev-mode limitation (UAT-001):** `next dev` crashes on all 6 issue pages (`/issues/[slug]/`) with _"missing generateStaticParams"_ — a Next.js 14.2.x bug with `output: export`. The function exists; the dev server incorrectly rejects it. Static pages (`/`, `/officials/`, `/elections/`, `/sources/`) work fine in dev.

To test issue pages locally:
```
npm run build && npx serve out/   # serves the static export on port 3000
```

GitHub Pages deploy is automatic on push to `main` via `.github/workflows/deploy.yml`. The workflow sets `NEXT_PUBLIC_BASE_PATH` to match the GitHub Pages URL prefix.
