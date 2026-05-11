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
- **`trailingSlash: true`** in `next.config.js`. Internal navigation uses `next/link` with raw paths (e.g. `<Link href="/officials/">`); Next.js auto-prepends the basePath. Do NOT manually prefix `<Link>` hrefs — that double-prepends and produces URLs like `/dcelectionstracker/dcelectionstracker/officials/` (see git history under "Fix double-prefixed basePath").
- **`basePath`** is set in `next.config.js` from `NEXT_PUBLIC_BASE_PATH`. Empty in dev; set in the GitHub Actions deploy workflow.
- **No tracking pixels, no third-party SDKs, no automatic client-side data fetching.** Static export only. The only client-side JavaScript that runs *on page load* is the `Countdown` component's `useEffect` (updates every minute) and the `AlertTicker` marquee (CSS animation). User-triggered fetches are allowed for explicit voter tools — currently the `AddressLookup` component (BL-02) on `/elections/` makes one cross-origin GET to DC's MAR API on form submit, routed through corsproxy.io because citizenatlas.dc.gov has no CORS headers. No data is fetched until the user clicks "Look up." If corsproxy.io becomes unreliable, the v2 path is a self-hosted Cloudflare Worker.
- **Single source of truth** for issue content: `src/data/issues.ts`. All five (six, in v1) issue pages render from one shared `IssueDetail` component.

## Don't list

- Don't change the visible product name. It is "DC Elections Tracker," everywhere.
- Don't pull in icon libraries, UI kits, animation libraries, fonts, or analytics — i.e. anything that ships to the browser. Visual gravitas comes from typography and restraint, not dependencies. This rule is about **runtime** weight; build/dev tooling (test runners, linters, type-checkers) is fine to add when warranted.
- Don't write claim-without-source content. If a fact lacks a primary source, either find one or omit the claim.
- Don't editorialize about candidates. Officials are listed by name, ward, party, term-end. Voting records (when added) are factual.
- Don't add server routes, API endpoints, or `getServerSideProps`. Static export only.
- Don't manually prepend `basePath` to `<Link>` hrefs (no `path()` helper, no string concat). Pass raw paths like `/issues/foo/`. Next.js handles the prefix.
- Don't widen the editorial scope without updating `backlog.md`.

## File map

```
src/
  app/
    layout.tsx                     # exports `viewport` (width=device-width, initial-scale=1)
    page.tsx                       # /
    issues/[slug]/page.tsx         # /issues/<slug>/ — 6 data-driven slugs
    issues/ranked-choice/page.tsx  # /issues/ranked-choice/ — static custom page (BL-16)
                                   # Content (stats, FAQ, recentMoves, sources) is inline;
                                   # the slug is excluded from allIssueSlugs() via STATIC_ROUTE_SLUGS.
    officials/page.tsx
    elections/page.tsx
    elections/[race]/page.tsx           # per-seat race page, generateStaticParams from
                                        # PROFILED_RACE_SLUGS (mayor, council-at-large-bonds,
                                        # council-ward-1, us-house-delegate). dynamicParams=false. (BL-32)
    elections/[race]/[candidate]/page.tsx # per-candidate profile, generateStaticParams from
                                        # candidatesForRace(race).map((c) => ({race, candidate: c.slug})).
                                        # dynamicParams=false. (BL-32)
    sources/page.tsx
    globals.css
  components/
    NavBar.tsx                     # desktop inline nav at lg, <details> hamburger below
    AlertTicker.tsx
    Footer.tsx
    IssueCard.tsx
    IssueDetail.tsx
    LatestCard.tsx
    Countdown.tsx
    RcvSimulator.tsx               # "use client" — only client-interactive component (BL-16)
    CandidateComparison.tsx        # side-by-side candidate positions per issue (BL-19)
    VotingRecordMatrix.tsx         # Council voting record matrix + per-member mini-record (BL-12 + BL-01)
    AddressLookup.tsx              # "use client" — DC address → ward/ANC/SMD/ballot via MAR API (BL-02)
                                   # User-triggered fetch through corsproxy.io. No load-time call.
  data/
    issues.ts                      # 6 issues + minimal ranked-choice entry for the homepage card
    officials.ts                   # Officials w/ slug FK target. councilMembers() + getOfficialBySlug() helpers.
    elections.ts                   # races2026[] + candidates2026[] linked by raceSlug (BL-03)
                                   # Candidate.slug (kebab-case, globally unique) + Candidate.bio? (BL-32)
                                   # Candidate.positions?: Partial<Record<ComparableIssueSlug, Position>>
                                   # COMPARABLE_ISSUES, COMPARISON_RACE_SLUGS, ISSUE_COLUMN_TAGLINES (BL-19)
                                   # PROFILED_RACE_SLUGS, ExternalTool, externalToolsForRace() (BL-32)
                                   # ballotForWard(ward) → race slugs + SBOE flag (BL-02)
                                   # electionStats — DCBOE registration counts (BL-23)
    votes.ts                       # billVotes[] — BillVote with memberSlug FK to Official (BL-12 + BL-01)
                                   # Helpers: votesForMember(slug). VOTE_LABEL / VOTE_DESCRIPTION maps.
    alerts.ts                      # marquee items
    elections.test.ts              # helpers + dataset-integrity + comparison tests, colocated
    votes.test.ts                  # vote data integrity, slug FK + tally invariants (BL-12)
  lib/
    party.ts                       # partyTone() — party label/color mapping
    headline.ts                    # build-time hero countdown copy
    viewport.ts                    # classifyViewport(width) — pure, Tailwind-aligned
    useViewport.ts                 # client hook (only when CSS can't express the branch)
    rcv.ts                         # IRV algorithm + BASE_ELECTORATE (BL-16)
    rcv-rankings.ts                # pure helpers for RcvSimulator's ranking state (BL-16)
    *.test.ts                      # vitest unit tests, colocated
```

## Responsive contract

Mobile-first, single source of breakpoints in `src/lib/viewport.ts` and matched 1:1 with the Tailwind utility prefixes used everywhere:

| Class      | Width band       | Tailwind prefix | Layout shape                                    |
|------------|------------------|-----------------|-------------------------------------------------|
| mobile     | `< 640px`        | (no prefix)     | Single column, condensed wordmark, short CTAs   |
| tablet     | `640 – 1023px`   | `sm:`, `md:`    | 2-up grids, full CTA labels, hamburger nav      |
| desktop    | `>= 1024px`      | `lg:`           | 3-up / 4-up grids, inline nav, largest hero     |

**Autodetection is the browser's job.** CSS media queries respond instantly to a desktop window being dragged narrower or to device rotation; no JS feature-detection or user-agent sniffing. Components express their layout in Tailwind responsive classes, and that's it.

If a component genuinely needs to know the device class in JS (rare — the only reason would be branching layout that can't be expressed in CSS), use `useViewport()` from `src/lib/useViewport.ts`. The pure `classifyViewport(width)` helper is what gets unit-tested; the hook is a thin SSR-safe wrapper that listens for `resize`. The 9-item NavBar uses pure CSS (`hidden lg:flex` + `<details> lg:hidden`) — there is no JS detection in production code today.

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

Unit tests live next to the modules they cover and run via [vitest](https://vitest.dev). Scope is intentionally narrow — only pure functions whose behavior is non-obvious or has documented edge cases, plus dataset-integrity checks where stale references would break the UI silently:

- `src/lib/party.test.ts` — `partyTone()` mapping for every documented party plus the unknown-fallback.
- `src/lib/headline.test.ts` — `timeUntilPrimaryHeadline()` across past, <7d, 1w, 5w (the launch headline), 8w, and >12w (numeric fallback) regimes.
- `src/lib/viewport.test.ts` — `classifyViewport()` across phone/tablet/desktop bands, exact breakpoint boundaries, the desktop-window-resized-narrow case, and non-finite fallbacks.
- `src/lib/rcv.test.ts` — `runIRV()` instant-runoff algorithm: first-round majority, lowest-candidate elimination + transfer, exhausted ballots, lowest-first-round-support tiebreaker, alphabetical-last tiebreaker, the documented base-electorate scenarios (B wins without user; user `[A,C,B]` flips to A on tiebreak).
- `src/lib/rcv-rankings.test.ts` — pure helpers for the RCV simulator's ranking state: `userBallotFromRankings()` (rank-order projection), `nextRank()` (gap-filling sequential rank), `withoutRank()` (renumber-on-removal), `userVoteJourney()` (trace a ballot through eliminated candidates round-by-round). Refactored out of `RcvSimulator.tsx` for testability.
- `src/data/elections.test.ts` — `getRaceBySlug()` and `candidatesForRace()` (alphabetical sort, withdrawn filter, unknown-slug fallback) plus dataset-integrity invariants: every `Candidate.raceSlug` references a real Race; every candidate has a sourced label + url; at most one incumbent per race; all Race slugs are unique. Also (BL-19) every `ComparableIssueSlug` has a tag-line, every populated `Position` cites a sourceLabel + http(s) sourceUrl + non-empty stance, position keys reference known issue slugs, and stances stay ≤ 30 words. Also (BL-32) every `Candidate.slug` is unique kebab-case; `PROFILED_RACE_SLUGS` references real races and each profiled race has ≥1 candidate; `getCandidateBySlug()` works; `externalToolsForRace()` returns ≥2 common tools per race with valid URLs. Catches silent data drift the data-refresh skill could introduce.
- `src/data/votes.test.ts` (BL-12 / BL-01) — every `Official.slug` is unique kebab-case; `getOfficialBySlug()` + `councilMembers()` return the expected shapes; every `BillVote.memberSlug` references a real Official; every bill records a vote for every current council member (no orphan rows in the matrix); no duplicate memberSlugs per bill; vote values are valid; vote dates are ISO; `votesForMember()` returns the right entries; the documented Secure DC and RENTAL Act tallies match the dataset (catches silent vote-data drift).
- `src/data/elections.test.ts` (BL-02) — `ballotForWard()` includes the citywide primary races for every ward, adds the council-ward race only for wards 1/3/5/6, sets `sboeOnGeneralBallot` correctly, and normalizes a "Ward N" prefix input.

Tests use a fixed `now` argument rather than `Date.now()` so they don't drift over time. Markup-level fixes (mobile nav, skip link, kicker text) are not unit-tested — those are verified by the build + manual UAT (`~/.claude/skills/dc-uat.md`). The RCV simulator's interactive behavior (click-to-rank, tabulate, reset) is not unit-tested in v1 — the IRV math and ranking helpers are covered above, and the UI wiring is verified by UAT BF-10. If we ever add React Testing Library, that's where component-render tests would go.
