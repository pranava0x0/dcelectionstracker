# DESIGN.md — Days Since Last Blunder

> Design system for the Chicago Sky Blunder Tracker. Follows the awesome-design-md format.
> Reference: https://github.com/VoltAgent/awesome-design-md

---

## 1. Visual Theme & Atmosphere

The tracker aims for **dark arena energy** — the aesthetic of a scoreboard in a dimly lit stadium. Bold, legible, and unapologetic. The hero number should feel as large and confident as a jersey number on a Jumbotron.

Key characteristics:
- **Near-black background** with zero ambient light — pure `#000000`
- **Yellow as the hero accent** — the count is always in `--sky-yellow`, drawing the eye immediately
- **Blue as a supporting accent** — labels, headers, interactive states in `--sky-blue`
- **Glassmorphism nav** — sticky bar with `backdrop-filter: blur(20px)` and subtle blue border
- **Tabular numerics** — all dates and counts use `font-variant-numeric: tabular-nums` for visual alignment
- **Inter font** — chosen for its excellent legibility at large display sizes and tight letter-spacing

---

## 2. Color Palette & Roles

### CSS Variables

```css
:root {
  --sky-blue:        #418FDE;  /* Brand primary — labels, headers, focus rings */
  --sky-yellow:      #FFCD00;  /* Brand accent — hero number, severity dots */
  --sky-navy:        #041E42;  /* Deep brand color — rarely used directly */
  --sky-navy-light:  #0a2a52;  /* Secondary navy — hover states on dark surfaces */
  --text-primary:    #f5f5f7;  /* Main text — headings and body */
  --text-secondary:  rgba(245, 245, 247, 0.6); /* Muted text — dates, subtitles, meta */
  --bg:              #000000;  /* Page background */
  --surface:         rgba(65, 143, 222, 0.06); /* Table & card backgrounds */
  --border:          rgba(65, 143, 222, 0.12); /* All dividers and borders */
}
```

### Semantic Color Map

| Role | Token | Hex / Value |
|------|-------|-------------|
| Page background | `--bg` | `#000000` |
| Card / table surface | `--surface` | `rgba(65,143,222,0.06)` |
| Primary text | `--text-primary` | `#f5f5f7` |
| Secondary / muted text | `--text-secondary` | `rgba(245,245,247,0.6)` |
| Brand primary (labels, headers) | `--sky-blue` | `#418FDE` |
| Brand accent (hero number) | `--sky-yellow` | `#FFCD00` |
| All borders and dividers | `--border` | `rgba(65,143,222,0.12)` |
| Nav background | — | `rgba(0,0,0,0.8)` |
| Table row hover | — | `rgba(65,143,222,0.04)` |
| Hero glow | — | `rgba(255,205,0,0.15)` |

### Do Not Use
- Do not hardcode any hex values in CSS or JS. Always reference a `--token`.
- Do not add new colors without adding them as a CSS variable in `:root`.
- Do not use white (`#ffffff`) as a text color — `--text-primary` (`#f5f5f7`) is the approved off-white.

---

## 3. Typography Rules

**Font family:** `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`

Loaded from Google Fonts. System font fallbacks ensure no layout shift before load.

### Type Scale

| Role | Element | Size | Weight | Line Height | Letter Spacing | Notes |
|------|---------|------|--------|-------------|----------------|-------|
| Nav logo | `.nav-logo` | 15px | 800 | — | +0.08em | Uppercase implied by visual weight |
| Nav subtitle | `.nav-subtitle` | 13px | 400 | — | −0.01em | Muted secondary |
| Hero eyebrow | `.hero-label` | 14px | 600 | — | +0.12em | `text-transform: uppercase` |
| Hero number | `.hero-number` | clamp(96px, 20vw, 200px) | 900 | 1 | −0.04em | The focal point of the entire page |
| Hero description | `.hero-blunder` | 17px | 400 | 1.47 | −0.02em | Max-width 520px, centered |
| Section heading | `.section-title` | 28px | 700 | — | −0.02em | Left-aligned |
| Section subheading | `.section-subtitle` | 14px | 400 | — | — | Muted, below heading |
| Table header | `thead th` | 12px | 600 | — | +0.06em | `text-transform: uppercase`, `--sky-blue` |
| Table body | `tbody td` | 15px | 400 | 1.45 | −0.01em | |
| Date / meta cells | `td:nth-child(1,3)` | 14px | 400 | — | — | `tabular-nums`, `--text-secondary` |
| Footer | `.footer` | 12px | 400 | — | — | Centered, muted |

### Typography Principles

1. **Tight tracking at large sizes.** The hero number at 200px uses `−0.04em` letter-spacing. Without this, Inter looks loose and amateurish at display sizes.
2. **Upcase sparingly.** Only two elements are uppercased: the hero eyebrow label and table headers. Both pair uppercase with increased letter-spacing (+0.06–0.12em) — never uppercase without also opening the tracking.
3. **Weight 900 is reserved for the hero number only.** Weight 800 for the logo. Weight 700 for section headings. Everything else is 600 or below. This creates a clear visual hierarchy.
4. **Anti-aliasing is mandatory.** Always set `-webkit-font-smoothing: antialiased` on `html`. Without it, Inter looks heavy on macOS.
5. **Tabular numerics for all dates and counts.** Use `font-variant-numeric: tabular-nums` on any column that shows numbers so they align vertically.

---

## 4. Component Stylings

### Nav Bar

```css
.nav {
  position: sticky; top: 0; z-index: 10;
  display: flex; align-items: center; gap: 12px;
  padding: 14px 24px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--border);
}
```

States: always visible, always sticky. No mobile collapse — the nav is two text elements that fit on one line.

### Hero Number

```css
.hero-number {
  font-size: clamp(96px, 20vw, 200px);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--sky-yellow);
  text-shadow: 0 0 80px rgba(255, 205, 0, 0.15);
}
```

The `text-shadow` creates a subtle glow — intentionally dim (15% opacity at 80px blur). Do not increase it; it reads as a halo, not a glow, at the current setting.

### Table

```css
.table-wrapper {
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  overflow-x: auto;
}

thead th {
  padding: 14px 20px;
  color: var(--sky-blue);
  border-bottom: 1px solid var(--border);
}

tbody tr:hover {
  background: rgba(65, 143, 222, 0.04);
}
```

### Severity Dots

```css
.severity-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--sky-yellow);
  opacity: 0.25;       /* inactive */
}
.severity-dot.active {
  opacity: 1;          /* active */
}
```

Always render 5 dots. Active dots are full opacity yellow. Inactive dots are 25% opacity yellow (not grey — keeps the palette monochromatic).

---

## 5. Layout Principles

### Spacing Scale

Base unit: **4px**

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Dot gap in severity row |
| sm | 12px | Nav logo/subtitle gap |
| md | 14px | Table cell padding (vertical) |
| lg | 20px | Table cell padding (horizontal) |
| xl | 24px | Nav padding, page gutters |
| 2xl | 28px | Hero label → number gap |
| 3xl | 32px | Subtitle → table gap |
| 4xl | 60–80px | Hero vertical padding |

### Grid & Containers

- **Max-width:** `900px` on the table section. No max-width on the hero — it spans full viewport.
- **Page gutter:** `24px` on both sides (reduces to `16px` below 600px breakpoint)
- **Hero:** `align-items: center; justify-content: center; min-height: 70vh` — the number is always vertically centered in the top portion of the viewport

### Border Radius Scale

| Name | Value | Usage |
|------|-------|-------|
| pill | 9999px | Severity dots (full circle: 50%) |
| card | 12px | Table wrapper |
| — | — | No other border-radius used |

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Page | `background: #000000` | Base layer |
| Surface | `background: rgba(65,143,222,0.06)` + `border: 1px solid rgba(65,143,222,0.12)` | Table card |
| Nav | `background: rgba(0,0,0,0.8)` + `backdrop-filter: blur(20px)` | Sticky overlay |
| Hero glow | `text-shadow: 0 0 80px rgba(255,205,0,0.15)` | Hero number emphasis |
| Row hover | `background: rgba(65,143,222,0.04)` | Interactive feedback |

**Shadow philosophy:** This design uses luminance and tinting instead of traditional drop shadows. Blue-tinted surfaces (`rgba(65,143,222,0.06)`) on a black background create depth without introducing new colors. The only shadow is the hero text-glow — everything else is border + background opacity.

---

## 7. Do's and Don'ts

### Do
- Use `clamp()` for the hero number font-size. It must scale from 96px (mobile) to 200px (desktop) without breakpoints.
- Use `text-transform: uppercase` + `letter-spacing: +0.06em` together — never one without the other.
- Use `tabular-nums` on any column that contains dates or counts.
- Keep the hero section at `min-height: 70vh` — the number needs to breathe.
- Pair borders with `border-radius: 12px` on all card surfaces for visual softness against the hard black background.
- Always test new blunder entries with long description text (>150 chars) to ensure the table wraps cleanly.

### Don't
- Don't reduce the hero number below `clamp(96px, 20vw, 200px)`. It's the entire point of the page.
- Don't use `font-weight: bold` (700) on table body text — 400 only. Bolds compete with the hierarchy.
- Don't use color fills for row hover — only the approved `rgba(65,143,222,0.04)` tint.
- Don't introduce drop shadows on cards. The border + surface tint is the depth model.
- Don't use `#ffffff` (pure white) for text — always `--text-primary` (`#f5f5f7`).
- Don't add uppercase styling without also increasing `letter-spacing` to at least `+0.06em`.
- Don't use placeholder `alt=""` on any images added in the future.

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | ≤600px | Hero padding reduces (60px/40px), `.hero-blunder` drops to 15px, table cells reduce to 12px/14px padding, section padding reduces to 16px, section title drops to 22px |
| Desktop | >600px | Default styles apply |

### Touch Targets
- All interactive elements (future buttons, links) must be minimum **44×44px** tap area.
- Table rows are passive (no tap target) — if row clicks are added, the entire `<tr>` must be the tap target.

### Collapsing Strategy

| Component | Mobile behavior |
|-----------|----------------|
| Nav | Shrinks padding; both text elements stay on one line (short enough) |
| Hero | Reduces `min-height` to `55vh`; number scales via `clamp()` automatically |
| Table | Horizontal scroll via `overflow-x: auto` on `.table-wrapper` — never collapse columns |
| Footer | No change |

---

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:         #000000
Surface/card:       rgba(65,143,222,0.06)
Border:             rgba(65,143,222,0.12)
Text primary:       #f5f5f7
Text secondary:     rgba(245,245,247,0.6)
Brand blue (label): #418FDE
Brand yellow (hero):#FFCD00
```

### Example Component Prompts

**New badge/pill:**
> "Add a badge with `background: rgba(65,143,222,0.12)`, `color: #418FDE`, `border: 1px solid rgba(65,143,222,0.2)`, `border-radius: 9999px`, `padding: 3px 10px`, `font-size: 12px`, `font-weight: 600`, `letter-spacing: 0.04em`."

**New section heading:**
> "Use `font-size: 28px`, `font-weight: 700`, `letter-spacing: -0.02em`, `color: #f5f5f7`, with a subtitle at `font-size: 14px`, `color: rgba(245,245,247,0.6)`, spaced 6px below the heading."

**New stat card:**
> "Card with `background: rgba(65,143,222,0.06)`, `border: 1px solid rgba(65,143,222,0.12)`, `border-radius: 12px`, `padding: 24px`. Title in `--sky-blue` (#418FDE) at 12px 600 uppercase +0.06em. Value in `--sky-yellow` (#FFCD00) at 48px 900 −0.04em."

**Adding a new column to the blunder table:**
> "Match existing cell padding (16px 20px), font-size 15px, `color: var(--text-primary)`. If it's a date or number, add `font-variant-numeric: tabular-nums` and use `--text-secondary`. If it's a status badge, use the pill style above."

### Iteration Rules for AI Agents
1. Always read `style.css` before making any style change.
2. Never introduce a new hex color — extend the `:root` variable block instead.
3. When adding a new UI element, match the spacing scale (multiples of 4px).
4. Hero number font-size is off-limits — `clamp(96px, 20vw, 200px)` is fixed.
5. Run a visual check at 375px, 600px, and 1280px viewport widths after any CSS change.
