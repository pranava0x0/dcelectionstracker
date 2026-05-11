# DC Elections Tracker — Design

Inspired by **original-era FiveThirtyEight** (Nate Silver / ESPN years, ~2014–2017): clean near-white background, near-black ink, signature **orange-red** as the lone editorial accent, **slab serif** for headlines, monospace for stats and dates, and a **floating-card** layout flow with subtle shadow and hover lift.

## Palette (HSL CSS variables)

| Token | Value | Use |
|---|---|---|
| `--bg` | `40 14% 97%` | Page background. Near-white with a faint warm tint. |
| `--paper` | `0 0% 100%` | Card / article surface. Pure white. |
| `--fg` | `0 0% 11%` | Body text. Rich black. |
| `--muted` | `0 0% 32%` | Secondary text. |
| `--subtle` | `0 0% 56%` | Captions, mono labels, tertiary text. |
| `--border` | `0 0% 86%` | Hairline gray for card borders, list dividers. |
| `--rule` | `0 0% 11%` | Black hairline for editorial dividers. |
| `--primary` | `15 88% 52%` | Orange-red — the original 538 accent. CTAs, alarm stats, kicker labels, the wordmark dot. |
| `--primary-fg` | `0 0% 100%` | White on orange-red. |
| `--accent-blue` | `210 65% 38%` | Reserved for Democratic party labels and "special" race tags. |
| `--good` | `145 55% 32%` | Reserved for explicit good-news callouts. |
| `--black` (`ink`) | `0 0% 11%` | Masthead band, footer, large display headings, party stripe for Independents. |

Light theme only. No theme switcher.

## Typography

We don't ship a web font. The slab-serif display feel comes from a system fallback chain:

```
font-family: "Roboto Slab", Rockwell, "Rockwell Std",
             Cambria, Georgia, "Times New Roman", serif;
```

- **Roboto Slab** is on most Android systems; falls back to Rockwell on Windows; Cambria/Georgia render the slab feel everywhere else.
- **`.display`** = weight 800, `letter-spacing: -0.01em`, `line-height: 1.06`.
- **`.display-tight`** = weight 900, `letter-spacing: -0.015em`, `line-height: 1.0`. Used for hero H1 and big stat values.
- **Body**: `-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, ...` — system sans.
- **Mono**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`. Used for stats, dates, kickers, source labels.

The `.kicker` utility — a small orange-red mono uppercase label with wide tracking (e.g., "WASHINGTON, DC · 2026") — sits above headlines as a section flag.

## Card system

Cards float on the cream/near-white page background. Apply `.card` for the base treatment:

- White (`--paper`) background
- 1px `--border` gray border, no rounded corners (editorial, not SaaS)
- Subtle 1px-deep shadow at rest
- On hover (`.card-link:hover .card` or `.card.card-hover:hover`): border darkens to `--rule`, a soft elevation shadow appears, and the card translates upward 2px

**Top-stripe accents** sit inside the card at the very top:

- `.card-stripe-red` — alarming or open-seat content
- `.card-stripe-black` — neutral content
- `.card-stripe-blue` — special elections, "special" status pills, Democratic party

Cards use **gap-based grids** (`gap-4` to `gap-5`), not flush hairline grids. The flush hairline-grid pattern is reserved for **dense data displays** inside `IssueDetail` (stat tiles, "Who decides" rows, recent-moves list) where the table-of-contents feel is wanted.

`prefers-reduced-motion: reduce` disables the hover translate-up.

## Components

- **NavBar** — black band, pulsing orange dot + wordmark, mono nav links in white/70, orange CTA pill.
- **AlertTicker** — white strip below masthead. Orange "LIVE" pill + boxed "Recent moves" + horizontal marquee.
- **Footer** — black band with white wordmark, links in mono uppercase, GitHub link.
- **IssueCard** — floating card with red or black top stripe, kicker, big stat number (orange if alarm), display title, body line, "Read the brief" mono CTA. Hover lifts the card.
- **LatestCard** — short floating card surfacing a single recent move. Date in orange mono, slab-serif headline, "Read source ↗" footer in mono. Used in the home-page "Latest from DC" row.
- **IssueDetail** — kicker, slab-serif headline, orange one-liner, hero graf. Then a flush hairline-bordered 4-up stat grid (data-table feel), followed by sectioned blocks divided by 3px black rules: What's at stake → Who decides → Recent moves → Questions to candidates → Live sources. **Source attribution links** inside stat tiles (e.g. "WTOP / OPM ↗") must be legible and tappable: minimum `text-xs` (12px), not `text-[10px]`. Minimum 44px tap target height on mobile (pad the link, not just the text).
- **Officials baseball cards** — small floating cards in a 3-up grid. 4px party-color stripe at top (blue for D, black for I, orange for R). Big slab-serif name, mono role, mono term-end, optional notes line, source link.
- **Race cards (`/elections/`)** — floating cards in a 2- or 3-up grid with a stripe by status (orange for OPEN, blue for SPECIAL, black for INCUMBENT) and a matching uppercase mono pill in the corner. Body line includes inline declared-candidate names sourced from the DCBOE filing list.
- **DCBOE administration tiles (`/elections/`)** — 3-up `card` grid: large `display-tight` value (registered-voter count or date label), short body, mono uppercase source link with ↗ glyph. Same component vocabulary as the issue stat grid — no new primitives.
- **Countdown** — floating card with orange top stripe, mono kicker, giant orange day count, small mono `Hh Mm` remainder.

## Visual rhythm of a page

Every page is broken into editorial sections separated by a 3px black rule. Below each rule is an orange-red kicker, a slab-serif H2, and the section content. This rhythm runs on every page:

```
[ thick black rule ]
KICKER (orange mono)
Section headline (slab serif)
Section body (cards or list)
```

## Accessibility

- Body text on near-white passes AAA. Orange-red on white passes AA at all body sizes and AAA at large display sizes.
- White on black passes AAA. The orange CTA pill (white on orange) passes AA.
- All interactive elements reachable by keyboard. `:focus-visible` outline in orange-red.
- Reduced-motion: the marquee, the wordmark dot pulse, and card-hover lift all pause.
- External links carry `rel="noopener noreferrer"`. Every external link is a citation.
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, one `<h1>` per page.

## Responsive breakpoints

Tailwind defaults. Three device classes, matched 1:1 with `src/lib/viewport.ts`:

| Class    | Width band       | Tailwind prefix |
|----------|------------------|-----------------|
| mobile   | `< 640px`        | (no prefix)     |
| tablet   | `640 – 1023px`   | `sm:`, `md:`    |
| desktop  | `>= 1024px`      | `lg:`           |

- **Hero h1** scales `text-3xl` (issue) / `text-4xl` (page) → `sm:text-4xl/5xl` → `md:text-6xl` (home only) → `lg:text-5xl/6xl/7xl`.
- **Issue cards** wrap 1 → `sm:` 2 → `lg:` 3.
- **Officials cards** wrap 1 → `sm:` 2 → `lg:` 3.
- **Stat tiles** in `IssueDetail` wrap 1 → `sm:` 2 → `lg:` 4.
- **What's at stake** wraps 1 → `sm:` 2 → `lg:` 3.
- **NavBar**: full inline nav at `lg`; below `lg`, a `<details>`-driven hamburger drawer with 40px tap target (Apple HIG minimum). On mobile (`< sm`) the CTA pill collapses from "Are you registered?" to "Register" and the wordmark drops from `text-base` to `text-sm` so it fits at 320px.
- **AlertTicker**: the "Recent moves" label hides below `sm`; the "LIVE" pill always shows.
- **Countdown**: day count `text-5xl` on mobile → `text-6xl` at `sm`.
- **Footer**: build line wraps to its own row below `sm` (`basis-full`); shares the row with nav links at `sm` and up.

Autodetection is pure CSS. A desktop browser dragged narrow, or a device rotated, reflows on the same media queries with no JavaScript involved.

## What we don't do

- No icon library. Arrows are unicode `→` and `↗`. The pulsing dot is a `<span>`, not an SVG.
- No web fonts. The slab-serif feel comes from a system fallback chain.
- No animation beyond the marquee, the masthead dot, and the card hover lift.
- No skeleton loaders, spinners, or progressive enhancement — static export means content renders with the document.
