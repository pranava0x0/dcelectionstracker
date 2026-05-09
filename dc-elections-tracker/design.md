# DC Elections Tracker — Design

Editorial newsroom feel inspired by FiveThirtyEight: cream paper, near-black ink, signature red as the only accent, condensed sans-serif display, monospace for data.

## Palette (HSL CSS variables)

| Token | Value | Use |
|---|---|---|
| `--bg` | `45 22% 95%` | Page background. Warm cream / off-white. |
| `--paper` | `0 0% 100%` | Card / article surface. Pure white. |
| `--fg` | `0 0% 9%` | Body text. Near-black. |
| `--muted` | `0 0% 35%` | Secondary text. |
| `--subtle` | `0 0% 58%` | Captions, mono labels, tertiary text. |
| `--border` | `0 0% 84%` | Hairline gray for table rows, list dividers. |
| `--rule` | `0 0% 9%` | Black hairline for editorial dividers (under section heads, between cards). |
| `--primary` | `358 86% 53%` | Signature red. CTAs, alarm stats, kicker labels, the wordmark dot. |
| `--primary-fg` | `0 0% 100%` | White on red. |
| `--good` | `145 55% 32%` | Reserved for explicit "good news" callouts. |
| `--black` (`ink`) | `0 0% 9%` | Masthead band, footer, large display headings. |

Light theme only. No theme switcher.

## Typography

We don't ship a web font. The editorial display feel is achieved with weight + tight tracking on the system sans stack.

- **Display** (`.display`, `.display-tight`): `"Helvetica Neue", "Arial Narrow", Arial, sans-serif`, `font-weight: 800–900`, `letter-spacing: -0.02em` to `-0.025em`. Used for H1–H3, hero numerals, big stats.
- **Body**: `-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, ...` — the system sans stack.
- **Mono**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`. Used for stats, dates, kickers, source labels.

The `.kicker` utility — a small red mono uppercase label with wide tracking (e.g., "WASHINGTON, DC · 2026") — sits above headlines as a section flag.

## Visual rules

- **Section breaks** are 3px black horizontal rules (`.rule-thick`). They separate every major editorial unit on every page.
- **Stat tiles, race cards, source cards** sit on a black hairline grid: a black `gap-px` parent with white children. This produces 538-style bordered grids without nested borders.
- **Cards do not have rounded corners.** This is editorial, not SaaS.
- **The masthead** is a black band with a white wordmark, a pulsing red dot before the wordmark, and a thin red 1px line below the band.
- **Stat tiles** have a 2px black top border (or 2px red top border when `alarm: true`). Big number is `display-tight` size 4xl–6xl. Source link sits at the bottom in red mono.
- **Marquee** has a red "LIVE" pill, then a boxed "RECENT MOVES" label, then the scrolling headlines on white. Date prefixes on each headline are red mono.

## Components

- **NavBar** — black band, pulsing red dot + wordmark, mono nav links in white/70, red CTA pill.
- **AlertTicker** — white strip below masthead. Red "LIVE" pill + boxed "Recent moves" + horizontal marquee.
- **Footer** — black band with white wordmark, links in mono uppercase, GitHub link.
- **IssueCard** — white card on the bordered grid; black 2px top, kicker, big number (red if alarm), display title, body line, "Read the brief" red mono CTA.
- **IssueDetail** — kicker, display headline, red oneLiner, hero graf, 4-up stat grid, then alternating sectioned blocks divided by 3px rules: What's at stake → Who decides → Recent moves → Questions to candidates → Live sources.
- **Countdown** — white card with kicker label, giant red day count, small mono `Hh Mm` remainder.

## Accessibility

- Text on cream/paper passes AA at all sizes; red on cream passes AA for body and large display use; white on black passes AAA.
- All interactive elements reachable by keyboard. `:focus-visible` outline in red.
- Reduced-motion: marquee and pulse-dot animations pause when `prefers-reduced-motion: reduce`.
- External links carry `rel="noopener noreferrer"`; `target="_blank"` is used because every external link is a citation.
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, one `<h1>` per page.

## Responsive breakpoints

Tailwind defaults. Single-column below `sm`; two-column issue cards at `md`; three-column at `lg`. Stat tiles wrap 1 → 2 → 4 columns.

## What we don't do

- No icon library. Arrows are unicode `→` and `↗`. The pulsing dot is a `<span>`, not an SVG.
- No web fonts. System stacks only.
- No animation beyond the marquee and the masthead dot.
- No skeleton loaders, spinners, or progressive enhancement — static export means content renders with the document.
