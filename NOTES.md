# DC Elections Tracker — Build notes

## What this is

Independent voter-accountability site for Washington, DC. Static export — Next.js 16 App Router (React 19), TypeScript strict, Tailwind 3, no server runtime, no tracking.

## Live at

GitHub Pages: `https://pranava0x0.github.io/dcelectionstracker/`

Repo: `https://github.com/pranava0x0/dcelectionstracker`

## What shipped in v1

- Six issue pages, each with four sourced hero stats, "What's at stake," "Who decides," a "Recent moves" timeline, voter questions, and a list of live primary sources:
  - **Statehood & Federal Pressure** (Sec. 740, EO 14252, tax disapproval, Norton retirement)
  - **Public Safety & Justice** (MPD staffing, crime trend, Secure DC / Peace DC, USAO under Pirro)
  - **Housing & Evictions** (RENTAL Act, IZ, HPAP, HCVP, DCHA HUD recovery, downtown HID)
  - **Budget, Taxes & Federal Workforce** (FY26, OCFO Feb 2026 revision, RIFs, office vacancy)
  - **Transportation** (WMATA cliff, Vision Zero, USDOT camera ban threat, bus/bike lanes)
  - **Schools** (DCPS / charter split, Ferebee, OSSE, MCAP gains, Ward 3–8 gap, federal funding freeze)
- `/officials/` — Mayor, AG, all 13 Council members, the Delegate, three shadow representatives, and the 9-member State Board of Education with party label and term-end date.
- `/elections/` — countdowns to the June 16, 2026 primary and Nov 3, 2026 general; the key-dates calendar; all twelve 2026 races.
- `/sources/` — every cited URL deduplicated and grouped by issue.
- Marquee alert ticker, election-day countdowns (client-side `useEffect`, updates every minute), GitHub Pages deploy workflow.

## Design

Editorial newsroom feel inspired by FiveThirtyEight: cream paper, near-black ink, signature red as the lone accent, condensed sans-serif display via weight + tracking (no web fonts), monospace for stats and dates. Black 3px rules separate every section. Stat tiles sit on a black hairline grid with 2px black tops (red for `alarm: true`).

See [design.md](./design.md).

## Tech invariants

- Next.js 16, `output: "export"`, `trailingSlash: true`. Turbopack is the default dev + build bundler.
- Internal navigation uses raw paths in `<Link>` (e.g. `<Link href="/officials/">`); Next.js auto-prepends the basePath. No manual prefixing — see CLAUDE.md "Don't list."
- `basePath` is read from `NEXT_PUBLIC_BASE_PATH`. The deploy workflow sets it to `/dcelectionstracker`.
- TypeScript strict. No `any`.
- Single source of truth for issue content: [src/data/issues.ts](./src/data/issues.ts). All six issue pages render from one shared `IssueDetail` component.

See [CLAUDE.md](./CLAUDE.md).

## How to deploy

Pushes to `main` build and publish via [.github/workflows/deploy.yml](../.github/workflows/deploy.yml). GitHub Pages source is "GitHub Actions."

## Local

```
npm install
npm run dev      # http://localhost:3000 — serves every route including dynamic
npm run build    # static export to ./out/
```

Next 16's dev server handles `output: "export"` + dynamic routes without the workaround that was needed under 14.2.x, so `npm run dev` is the canonical local-review path.

## Backlog

See [backlog.md](./backlog.md). Highest priority for v2: per-councilmember voting record on flagship bills, address-based ward + ANC lookup, declared candidate list with FEC/OCF filing links, federal RIF tracker.
