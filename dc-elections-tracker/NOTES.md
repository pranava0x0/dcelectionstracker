# DC Elections Tracker — Build notes

## What this is

Independent voter-accountability site for Washington, DC. Static export — Next.js 14 App Router, TypeScript strict, Tailwind 3, no server runtime, no tracking.

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

- Next.js 14, `output: "export"`, `trailingSlash: true`.
- All internal links go through `path()` in [src/lib/links.ts](./src/lib/links.ts) so the basePath prefix is applied consistently.
- `basePath` is read from `NEXT_PUBLIC_BASE_PATH`. The deploy workflow sets it to `/dcelectionstracker`.
- TypeScript strict. No `any`.
- Single source of truth for issue content: [src/data/issues.ts](./src/data/issues.ts). All six issue pages render from one shared `IssueDetail` component.

See [CLAUDE.md](./CLAUDE.md).

## How to deploy

Pushes to `main` build and publish via [.github/workflows/deploy.yml](../.github/workflows/deploy.yml). GitHub Pages source is "GitHub Actions."

## Local

```
cd dc-elections-tracker
npm install
npm run build
npx serve out -l 3000
```

`npm run dev` is supported on the home and static pages, but Next 14's dev server intermittently fails dynamic routes under `output: "export"` — for visual review, use `npm run build && npx serve out` to mirror prod.

## Backlog

See [backlog.md](./backlog.md). Highest priority for v2: per-councilmember voting record on flagship bills, address-based ward + ANC lookup, declared candidate list with FEC/OCF filing links, federal RIF tracker.
