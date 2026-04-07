# Backlog — Days Since Last Blunder

> Ideas, enhancements, and spin-off tracker concepts. Prioritized by complexity and audience size.

---

## Feature Enhancements (This Repo)

| Priority | Item | Notes |
|----------|------|-------|
| High | **Add source URLs to each blunder** | Each blunder entry should include a `source` URL linking to the news article or press release. Required for credibility. |
| High | **Shareable blunder permalinks** | `?blunder=2` in URL highlights that row and pre-fills OG meta for sharing a specific blunder |
| Medium | **Streak counter** — record longest days-since streak | Show "Longest streak ever: X days (broken on [date])" in the hero section |
| Medium | **Auto-update via GitHub Actions** | Nightly CI job that pushes a `data.json` file; page reads it on load. Keeps data fresh without redeploy. |
| Medium | **Severity filter** — filter table to severity ≥ N | Dropdown or pill buttons above the table |
| Medium | **Responsible party filter** — filter by person/dept | Useful once the blunder log grows beyond ~10 entries |
| Low | **Dark/light mode toggle** | Already dark; add light mode for accessibility |
| Low | **Confetti animation on day 0** — if the count resets | Easter egg: confetti when days-since === 0 |
| Low | **"Blunder of the Day" OG image** | Daily-generated social card via Cloudflare Workers + Canvas API |
| Low | **Export blunders as CSV** | Button in the table section |

---

## New Tracker Ideas — Spin-offs

Ranked by: **Virality × Audience Size ÷ Build Complexity**

### Tier 1 — Ship These First (small build, large audience)

| Priority | Concept | Domain Idea | Audience |
|----------|---------|-------------|---------|
| **High** | **Days Since Last Knicks Drama** | dayssincelastknicksembarrassment.com | NYC media, NBA Twitter, Garden faithful — Knicks fans are loud online |
| **High** | **Days Since Last Boeing Incident** | dayssincelastboeingincident.com | Aviation safety community, nervous flyers, aerospace press. Easy data: NTSB public filings. |
| **High** | **Days Since Last Congressional Ethics Violation** | dayssincelastcongress.com | Bipartisan — resets regardless of party. Civic tech / IndieHacker crowd. |
| **High** | **Days Since Last Major Data Breach** | dayssincelastdatabreach.com | Genuinely everyone. HaveIBeenPwned already tracks this — the data source is easy. |

### Tier 2 — Strong Niches (medium effort, devoted audiences)

| Priority | Concept | Domain Idea | Audience |
|----------|---------|-------------|---------|
| **Medium** | **Days Since Last Lions Heartbreak** | dayssincelastlionsheartbreak.com | Michigan NFL fans, detroitsports Twitter, masochists |
| **Medium** | **Days Since Last Browns QB Disaster** | dayssincelastbrownsdisaster.com | Cleveland fans + NFL historians. Secondary stat: "34 QBs since 1999" |
| **Medium** | **Days Since Last Raiders Coaching Change** | dayssincelastraidersdrama.com | Vegas locals + longtime Raiders fans + NFL GMs who enjoy chaos |
| **Medium** | **Days Since Last Meta Privacy Scandal** | dayssincelastmetascandal.com | Privacy advocates, tech journalists, parents, EU regulators |
| **Medium** | **Days Since Last Crypto Exchange Collapse** | dayssincelastcryptocollapse.com | Crypto skeptics, financial journalists, retail investors who survived |
| **Medium** | **Days Since Last OpenAI Leadership Crisis** | dayssincelastopenaidrama.com | AI researchers, tech press, startup founders |
| **Medium** | **Days Since Last Fast Food Price Hike** | dayssincelastfastfoodpricehike.com | Budget consumers, food journalists, inflation-watchers. Running % delta from 2019 baseline as secondary stat. |

### Tier 3 — Fun But More Research-Heavy

| Priority | Concept | Domain Idea | Notes |
|----------|---------|-------------|-------|
| **Low** | **Days Since Last Kanye Controversy** | dayssincelastye.com | Counter rarely exceeds 30. Easy data but moves fast. |
| **Low** | **Days Since Last Amazon Warehouse Injury Report** | dayssincelastAmazonincident.com | OSHA data is public. Good for labor advocacy angle. |
| **Low** | **Days Since Last Music Festival Disaster** | dayssincelastfestivaldisaster.com | All-time disaster leaderboard as a secondary feature |
| **Low** | **Days Since Last Supreme Court Ethics Lapse** | dayssincelastscotusethics.com | ProPublica as primary data source. Legal/civic audience. |
| **Low** | **Days Since Last Video Game Studio Closure** | dayssincelastgamingstudio.com | Gaming community. 2024-2026 has abundant data. |
| **Low** | **Days Since Last Commanders Embarrassment** | dayssincelastCommandersDrama.com | D.C. sports fans + NFL media. Rich back-catalog of incidents. |

### Single-Serving Joke Sites (< 1 day to build, novelty value)

| Concept | Domain | Format |
|---------|--------|--------|
| **Is Duke Winning?** | isdukewinning.com | Live score lookup. "Yes" / "No" / "Not playing" |
| **Is X Down?** | isxdown.today | Simple uptime ping to twitter.com. "Yes" / "Apparently not" |
| **Has Elon Tweeted in the Last Hour?** | haselontweetedyet.com | X API check. Refreshes every 60s. |
| **Did the Cubs Trade Anyone Today?** | didthecubstradeanyonetoday.com | ESPN trade wire RSS check |
| **Is Congress in Recess?** | iscongressinrecess.com | Congress.gov API / calendar scrape |
| **Has the Fed Raised Rates Yet?** | hasfedraisedratesyet.com | Single yes/no with next meeting date |

---

## Template / Infrastructure Ideas

| Priority | Item | Notes |
|----------|------|-------|
| **High** | **Shared codebase template** | One repo, multiple trackers via `config.json` (team name, colors, blunders array). Ship 10 spin-offs from one build. |
| **Medium** | **Auto-submit to Hacker News / ProductHunt** | Tracker for when to submit — Saturday afternoons, not Monday mornings |
| **Low** | **Tracker directory landing page** | blunders.lol — lists all active tracker sites with live counters |
