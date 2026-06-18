# DC Elections Tracker — Issues

Bug log. Populated by UAT session 2026-05-10. All bugs closed 2026-05-10.
UAT run 29 (2026-06-18, post-primary day 2): zero new issues, zero regressions. Scheduled data-refresh run 29 paired — no post-primary candidate reactions/news yet (certified results expected June 21, budget second vote June 23). Static build verified at desktop/tablet/mobile across `/`, `/elections/`, `/officials/`, candidate profiles. All 144 tests pass. Build date footer auto-renders 2026-06-18. No UAT-NNN filed. BL-UAT-19/20/22/23/24/25 + UAT-022 remain open with the human owner.
`/dc-data-refresh` run 2 (2026-05-10) shipped BL-28, BL-26, BL-23, BL-UAT-08 — no new issues filed.
UAT run 3 (2026-05-11): 3 new issues filed (UAT-013–015). All closed 2026-05-11. UAT-014 fix also covered the same bug in `Footer.tsx`; both consolidated into `src/lib/build-date.ts`.
`/dc-data-refresh` run 3 + UAT run 4 (2026-05-12, scheduled): no new bugs filed. Site clean on mobile (375), desktop (1280) across home / `/elections/` / `/officials/` / `/issues/ranked-choice/`. One passive accessibility tightening logged as BL-UAT-10 (hamburger 40×40 → 44×44).
Bug fix bundled with the Next 16 upgrade (2026-05-14): UAT-016 closed — mobile nav drawer auto-closes on link tap, addressing the long-standing BL-UAT-09 backlog item.
UAT run 5 (2026-05-17) — voter-persona walkthrough across 4 personas × 14 questions. 2 new issues filed (UAT-017, UAT-018). 5 improvement items added to backlog (BL-UAT-11 to BL-UAT-15).
UAT run 7 (2026-05-18, scheduled — evening pass) — desktop + mobile pass across home / `/elections/` / `/officials/` / `/issues/ranked-choice/`. 1 new issue filed (UAT-020); fixed in same run.
UAT run 8 (2026-05-19, scheduled morning pass) — paired with data-refresh run 8 (post-debate news for JLG/McDuffie/Goodweather; drop-box alert). Three-viewport sanity check at desktop / tablet / mobile across `/`, `/elections/`, `/elections/mayor/janeese-lewis-george/`, `/elections/mayor/kenyan-mcduffie/`, `/officials/`. Zero new bugs filed. Build date renders 2026-05-19 in hero + footer; hero h1 dynamic copy advanced to "Four weeks until the primary." (Math.round(28/7)=4). All 119 unit tests still pass.
UAT run 9 (2026-05-20, scheduled morning pass) — paired with data-refresh run 9 (RAMW restaurant-association endorsement of McDuffie added to his news[] + theme; thin news day, last refresh <36h prior). Desktop + mobile pass across `/`, `/elections/`, `/elections/mayor/kenyan-mcduffie/`, `/officials/`, `/issues/ranked-choice/`. Zero new product bugs: no console errors, no horizontal overflow at 375px, no duplicate IDs; McDuffie's RAMW item renders on profile + comparison matrix. Documentation drift logged as BL-UAT-19 (CLAUDE.md NavBar description + both skill files reference the pre-repo-move subdir paths / Next 14.2.13 / old launch-config names). Build + typecheck + 119 tests pass.
UAT run 11 (2026-05-23, scheduled morning pass) — paired with data-refresh run 11 (thin ~2-day window: May 23 advance-registration-deadline alert + May 22 Axios delegate piece added to Robert White & Brooke Pinto news[]). Zero new product bugs. Live preview server couldn't bind (an unrelated stale `next dev` from another local project held port 3000); verified against the static `out/` export instead — homepage renders the new alert, both delegate profiles render the Axios item, hero/footer dates auto-render 2026-05-23. typecheck + 119 tests + static build (71 routes) clean. Filed BL-UAT-20 (launch-config port collision) — a tooling/env item, not a product defect, so no UAT-NNN issue opened.
UAT run 10 (2026-05-21, scheduled morning pass) — paired with data-refresh run 10 (first public poll of the RCV-era primary — City Cast / TrueDot, fielded May 12–17 — added to alerts, RCV recentMoves, and both mayoral candidates' news; both held cap=12). Desktop + mobile pass across `/`, `/elections/`, `/elections/mayor/kenyan-mcduffie/`, `/elections/mayor/janeese-lewis-george/`, `/issues/ranked-choice/`. Zero new product bugs: no console errors, no horizontal overflow at 375px, no duplicate IDs on `/` or `/elections/`; poll item renders on both profiles (older items correctly dropped to hold cap) and as the new RCV recentMove + top alert. Static build emits all 71 routes; typecheck + 119 tests pass. Also fixed the in-repo CLAUDE.md half of BL-UAT-19 (NavBar now described as a BL-47 server component); external skill-file drift remains with the human owner.
UAT run 12 (2026-05-24, scheduled morning pass) — paired with data-refresh run 12. **Source-integrity catch:** the working tree opened with an uncommitted, never-committed elections.ts diff from an abandoned earlier run-12 attempt that added candidate news items pointing at fabricated forum-recap URLs (gwu.edu/news/…, acludc.org/news/at-large-forum-2026, ward1democrats.org, adamsmorganonline.org/news/ward-1-forum-recap, capitalstonewalldemocrats.com, hillrag.com/2026/05/17/at-large-forum-st-coletta-recap, a dead youtube watch link). All six representative URLs were probed and returned 404 / connection-refused / cert errors. Stashed the whole diff (recoverable) and re-did the legitimate part cleanly: the GWU mayoral forum is real, its canonical URL is gwtoday.gwu.edu/gw-hosts-forum-2026-dc-mayoral-candidates (2026-05-21, verified), added to the 5 candidates who actually attended (Lewis George, Goodweather, Johnson, Orange, Sampath — not McDuffie). Filed UAT-021 (resolved same run) + BL-UAT-21 (add a URL-liveness guard so fabricated sources can't reach a commit). No other verifiable post-May-23 developments.
UAT run 13 (2026-05-24, scheduled evening pass — second same-day run after run 12 this morning) — paired with data-refresh run 13. Zero new product bugs. Two verified data changes: (1) parsed the April 30 DCBOE registration PDF, updating `electionStats` 476,066 → 478,797 (clears the runs-9–12 standing follow-up); (2) added 4 previously-untracked declared Democrats to the profiled council-at-large-bonds race (Dwight Davis, Dyana N.M. Forester, Fred Hill, Greg Jackson), sourced to the cited East of the River roundup, with their campaign URLs HEAD-checked live before commit (BL-UAT-21 behavior applied by hand). Verified against the static `out/` export (no live server, per BL-UAT-20): `/elections/` shows 478,797 + "10 declared Democrats", build now emits 75 routes (4 new profile pages), race page links all 10 profiles. typecheck + 119 tests + build clean. Filed BL-UAT-22 (enrich the 4 new candidates' news/positions) + BL-UAT-23 (reconcile Nate Fleming, in our data but absent from the EOTR roundup, against the DCBOE candidate PDF) — both backlog items, not product defects, so no UAT-NNN opened.
UAT run 21 (2026-06-03, scheduled 1-day-window pass, 13 days from primary) — paired with data-refresh run 21. **Zero new product bugs.** Thin June 2–3 window after the run-20 H.R. 8801 backfill. Two verified data additions and one date roll: (1) Washington Blade 2026-06-02 "JR.'s hosts meet & greet for mayoral candidate Janeese Lewis George" — Capital Stonewall Democrats + Queers for Janeese GOTV canvass on the night of June 1; added to JLG `news[]` at top, URL HEAD-checked HTTP 200. JLG cap held at 12 by dropping the 2026-05-14 WaPo "Ads target D.C. mayoral hopefuls on crime, utilities" item — beat coverage, not in JLG newsThemes.supportingUrls (the same article is still carried in McDuffie's news[], where it backs his media-spend coverage). (2) Washingtonian 2026-05-29 "Your Guide to Ranked Choice Voting in the DC Primaries" by Jenna Lee + Sydney Carroll — voter-facing how-to-rank guide; added as the new top entry in `src/app/issues/ranked-choice/page.tsx` recentMoves (URL HEAD 200). (3) Top alert advanced from "Early voting begins in 6 days" (dated 2026-06-02) to "Early voting begins in 5 days" (dated 2026-06-03), same source PDF. No WaPo editorial-board endorsement yet (search returned only opinion/news pieces, no formal endorsement editorial); will keep watching. No fresh non-JLG candidate news worth swapping into already-at-cap profiles in this 1-day window. Verified against the live preview (dc-watch-static on port 3000): homepage hero shows "Two weeks until the primary" countdown (Math.round(13/7)=2) and primary countdown 13 days; UPDATED stamp shows 2026-06-03; LatestCard renders the new 6/3 "5 days" alert at the top; JLG profile renders the new WaBlade JR's entry inside the Coverage disclosure and the dropped WaPo ads item is gone; `/issues/ranked-choice/` shows the new Washingtonian recentMove at the top; tablet (768) + mobile (375) checked, no horizontal overflow; zero console errors across `/`, `/elections/`, `/officials/`, `/elections/mayor/janeese-lewis-george/`, `/issues/ranked-choice/`. typecheck + 119 tests + static build (75 routes) all clean. BL-UAT-19/20/22/23/24/25 + UAT-022 remain open with the human owner.

UAT run 20 (2026-06-02, scheduled 1-day-window pass, 14 days from primary) — paired with data-refresh run 20. **Zero new product bugs.** Thin June 1–2 window after the run-19 DCNOW+mail-ballot pass. One verified backfill addition this run: H.R. 8801 (the DC ROADS Act), introduced by Rep. Scott Perry (R-PA) on 2026-05-13 and advanced by House Oversight on 2026-05-20 to amend the Home Rule Act and permanently bar DC from any congestion toll — a missed anti-Home Rule development from runs 12–19. Added as a new statehood-issue `recentMove` (top of the array) AND as a new top-of-array alert dated 2026-05-20, cited to govinfo.gov/app/details/BILLS-119hr8801ih (HTTP 200 from curl; Congress.gov returned 403 from curl per known bot-block, so govinfo is the primary citation; WJLA's 2026-05-25 follow-up "House panel advances bill to block future DC congestion pricing" also HTTP 200, logged in sources-log.md as cross-reference). The top early-voting alert was advanced from "Early voting begins in 7 days" (dated 2026-06-01) to "Early voting begins in 6 days" (dated 2026-06-02), same source PDF. No fresh candidate-level news in the June 1-2 window worth swapping into already-at-cap profiles — Barred in DC mayoral (5/27) and at-large (5/26) questionnaires noted but not added since both JLG and McDuffie are at cap=12 and the multi-candidate questionnaire format is better suited to a future voter-guides aggregator (filed BL-UAT-25). Verified against the live preview (dc-watch-static on port 3000): homepage hero shows "Two weeks until the primary" countdown (Math.round(14/7)=2); UPDATED stamp shows 2026-06-02; LatestCard renders the new "Early voting begins in 6 days" alert at the top, replacing the 6/1 "7 days" entry; new H.R. 8801 alert renders below the DC NOW / mail-ballot-deadline / Police Union / Mendelson / registration-deadline entries (date-grouped near the 5/20 City Cast poll alert); statehood issue page shows H.R. 8801 as the new top recentMove with date 2026-05-20 and the govinfo source link. typecheck + 119 tests + build (75 routes) all clean; zero console errors at desktop and mobile (375). BL-UAT-19/20/22/23/24 + new BL-UAT-25 + UAT-022 remain open with the human owner.

UAT run 19 (2026-06-01, scheduled 1-day-window pass, 15 days from primary) — paired with data-refresh run 19. **Zero new product bugs.** Three verified additions: (1) DC NOW (DC Chapter of the National Organization for Women) 2026-06-01 full slate endorsement — Lewis George/Schwalb/Mendelson/Owolewa/Silverman/Raj/Frumin/Parker/Allen — surfaced as a new June 1 alert AND added as a news[] entry to all 9 endorsed candidates; DCNOW pick threaded into the existing newsThemes for JLG, Owolewa, Raj, Parker, Allen with cross-validated supportingUrls. (2) Washington Blade Peter Rosenstein opinion 2026-05-28 formalizing the Patterson/Crawford cross-endorsement RCV strategy in the at-large special — added to both Crawford and Patterson news[]. (3) New June 1 alert noting today is the DCBOE deadline to request an out-of-DC mail ballot for voters away from the District during the primary. JLG news[] cap held at 12 by dropping the 4/29 WaPo OCF probe item (oldest entry, not in newsThemes.supportingUrls). Top alert bumped from "Early voting begins in 8 days" (5/31) to "Early voting begins in 7 days" (6/1). Fixed two test failures inline during run (Parker + Allen newsTheme headlines exceeded the 18-word ceiling after adding "DCNOW" — re-worded both to preserve the factual claim within the cap). Verified against the live preview (dc-watch-static on port 3000): homepage shows hero "Two weeks until the primary", three new June 1 alerts at the top of LatestCard (police-union + 5/31 early-voting alerts pushed below the 3-item LatestCard cut, but they remain in alerts.ts for sources and stay visible if/when newer items roll off), UPDATED 2026-06-01; JLG profile renders DCNOW news entry in Coverage disclosure with the women's-rights-endorsements theme detail updated; Owolewa, Raj, Frumin, Parker, Allen, Schwalb, Mendelson, Silverman profiles all render the DCNOW item; Crawford + Patterson profiles render the WaBlade dual-endorsement item; OCF probe correctly absent from JLG profile; zero console errors; typecheck + 119 tests + build (75 routes) all clean. BL-UAT-19/20/22/23/24 + UAT-022 remain open with the human owner.

UAT run 18 (2026-05-31, scheduled 3-day-window pass, 16 days from primary) — paired with data-refresh run 18. **Zero new product bugs.** Three days of closing-stretch news with five verified additions: (1) WaPo 2026-05-31 "The rise of Janeese Lewis George, who could be D.C.'s first democratic socialist mayor" added to JLG `news[]` as primary citation. (2) WaPo 2026-05-31 "In D.C. mayor's race, Kenyan R. McDuffie wants to offer 'more opportunities' for residents" added to McDuffie `news[]` (companion piece, same publication date). (3) Washington Examiner 2026-05-29 "DC Police Union hits Lewis George over pension-fund affordable-housing proposal" added to JLG `news[]` AND surfaced as a new alert at the top of alerts.ts (the police union called the proposal an "automatic disqualifier" on X after the May 18 Fox 5 debate). The WaPo opinion 2026-05-26 "play roulette with D.C. pensions" is the underlying piece that prompted the union response; documented in sources-log.md but not added to news[] to avoid double-citing the same beat. (4) Washington Examiner 2026-05-28 "Exclusive: Janeese Lewis George backs safe injection sites in DC for drug use" added to JLG `news[]` (surfaces a May 2025 DSA endorsement-questionnaire response). (5) Axios DC 2026-05-28 "D.C. mayoral candidates sharpen final messages" added to McDuffie `news[]` as the canonical "with under three weeks to go" closing-stretch framing. JLG cap held at 12 by dropping 5/21 GW Today forum (5 other candidates also carry it, not load-bearing for JLG's profile), 5/20 City Cast DC poll (poll headline is already in alerts.ts), and 5/14 WaPo Opinion schools-control piece (single-issue opinion, not in newsThemes.supportingUrls). McDuffie cap held at 12 by dropping the 5/12 Washington Blade GLAA-ratings piece (single-issue rating, not in newsThemes). newsThemes not edited this run — closing-stretch pension/safe-injection coverage hasn't yet hit the 14-day-mixed-outlet bar for a third theme; revisit next run if WaPo runs follow-up coverage. Top alert updated from "Early voting begins in 11 days" (set 5/28) to "Early voting begins in 8 days" with date 2026-05-31. Verified against the live preview (dc-watch-static on port 3000): homepage shows the new early-voting + police-union alerts at the top of LatestCard, hero countdown reads "Two weeks until the primary" (Math.round(16/7)=2), UPDATED stamp shows 2026-05-31; JLG profile renders all 3 new news entries inside the Coverage `<details>` (closed-by-default) and the dropped items are gone; McDuffie profile renders both new entries (WaPo 5/31 + Axios 5/28); zero console errors at desktop and mobile (375); typecheck + 119 tests + build (75 routes) all clean. BL-UAT-19/20/22/23/24 + UAT-022 remain open with the human owner.

UAT run 17 (2026-05-28, scheduled thin-window pass, 19 days from primary) — paired with data-refresh run 17. **Zero new product bugs.** Thin 1-day window after run 16: no fresh candidate-level news in the past 24 hours (51st's May 27 piece is a generic civics roundup). Three data additions this run, all back-fills of earlier-month items missed in prior runs: (1) WaPo 2026-04-29 OCF probe added to JLG `news[]` as the primary citation (corroborating Axios Apr 29, Washington City Paper Apr 27, TheDCLine May 1 all documented in sources-log.md). DC Office of Campaign Finance opened the probe Apr 24 on alleged coordination with Safe & Affordable DC IE-PAC + Unite Here Local 25 / SEIU 32BJ; campaign denies allegations. JLG cap held at 12 by dropping the Washington Blade May 14 "LGBTQ community must say NO" opinion (redundant with the other Blade May 14 endorsement) and the City Cast Apr 27 Charles Allen endorsement (already gestured to in newsThemes); the first newsTheme's supportingUrls and detail re-worded to drop the dead Allen URL. (2) WaPo 2026-05-14 "Ads target D.C. mayoral hopefuls on crime, utilities" added to both JLG and McDuffie `news[]` (load-bearing first-major-TV-buy story, missed in prior 3 runs); McDuffie cap held at 12 by dropping his May 18 Hoya debate piece (redundant with FOX 5 on the same event). (3) electionStats[2] upgraded with the concrete "55 mail-ballot drop boxes citywide" count + linked to the DCBOE Drop-Boxes-Reporting.pdf — **NOTE**: this edit lands in the data file but does NOT ship visible to users per the open UAT-022; left in place because BL-UAT-24 has not been resolved yet and the data is still factually current if/when the array is re-surfaced. Forward-looking alert added at the top of alerts.ts: "Early voting begins in 11 days — June 8 to 14 at every Vote Center, 8:30am–7pm, with same-day registration" sourced to the DCBOE 2026 Primary Calendar PDF. Verified against the live preview (dc-watch-static on port 3000): homepage shows the new early-voting alert above the May 25 Mendelson + past-tense May 26 deadline alerts + countdown "Three weeks" / "19 days" / UPDATED 2026-05-28; JLG profile renders both new news entries (WaPo ads piece + OCF probe) and the dropped items are gone; zero console errors across home + JLG profile + officials at desktop and mobile (375); typecheck + 119 tests + build (75 routes) all clean. BL-UAT-19/20/22/23/24 + UAT-022 remain open with the human owner.

UAT run 16 (2026-05-27, scheduled day-after-deadline pass, 20 days from primary) — paired with data-refresh run 16. **One real product bug found and filed: UAT-022 (orphan `electionStats` data).** PR #19's voter-first UX restructure (merged 2026-05-26 01:52 ET) slimmed `/elections/` by removing the `electionStats` block from the JSX, but the data array in `src/data/elections.ts` was left in place. Runs 13–15 each claimed to "verify the 478,797 reg stat preserved on `/elections/`" in this log — that verification was actually wrong from run 15 forward (the build that incorporated PR #19 was the first to drop the render); the prior runs were checking against pre-restructure output. Filed UAT-022 (data array referenced nowhere) + BL-UAT-24 (decide: re-surface the stat in a voter-relevant section, or delete the orphan array and update dc-data-refresh skill to stop maintaining it). Two verified data additions this run: (1) WJLA May 25 — Mendelson identifies ~$420M in potential FY27 funding (added as top alert + budget recentMove). (2) WaPo May 20 editorial + May 22 news + Jewish Insider May 18 — Janeese Lewis George attended Trayon White's 42nd birthday picnic and called him a past "mentor"; three items added to her `news[]` (dropped 3 non-load-bearing items to hold cap=12) and a second `newsThemes` entry added with the factual headline "Faces backlash after attending Trayon White's birthday picnic and calling the indicted councilmember a past 'mentor'". All supporting URLs cross-validated against `news[]`. Verified against the live preview (dc-watch-static on port 3000) and confirmed JLG profile renders both themes + all 3 new news pills; homepage shows the new $420M alert at the top + updated past-tense May 26 deadline alert + countdown "Three weeks" / "20 days"; build emits 75 routes; typecheck + 119 tests + build clean; zero console errors across 14 sampled paths. BL-UAT-19/20/22/23 + new BL-UAT-24 remain open with the human owner.
UAT run 15 (2026-05-26, scheduled morning pass — voter-registration-deadline day) — paired with data-refresh run 15. **Zero new product bugs.** Thin 1-day window after run 14's Memorial Day pass. Two verified additions this run: (1) Free DC's May 13 endorsement of Janeese Lewis George (mayor) + Robert White (delegate) — the page exists at freedcproject.org/news/our-2026-endorsements-guide (HEAD 200) and the endorsement was confirmed by webfetch on May 26; added as `news[]` items on both candidate profile pages (Lewis George kept at cap=12 by dropping the duplicate Hoya debate writeup that overlapped Fox 5 coverage; White grew from 5→6); newsThemes blurb extended on both. (2) Refreshed the homepage top alert for deadline-day awareness: new 2026-05-26 entry reading "Today is the advance voter-registration deadline; same-day registration is still available at every Vote Center through Election Day June 16." Verified against the static `out/` export (preferred unattended path per BL-UAT-20 — also started `dc-watch-static` cleanly via the new launch-config entry, no port collision this run): homepage hero shows the new alert + "Three weeks until the primary" (21 days, dynamic copy intact), 478,797 reg stat preserved, both profile pages render the Free DC entry, build emits 75 routes, no console errors, typecheck + 119 tests + build clean. No new backlog items needed — BL-UAT-19/20/22/23 doc-drift + follow-ups remain open with the human owner.
UAT run 14 (2026-05-25, scheduled Memorial Day pass) — paired with data-refresh run 14. **Zero new product bugs.** Thin holiday window: DCBOE offices closed, no fresh government releases, and runs 10–13 already captured the late-May beats (poll, May 18 debate, May 21 GWU forum, registration deadline, drop boxes). Mayoral / delegate / Ward 1 sweeps surfaced only already-captured or below-cap coverage — no fabricated-source temptation this run (BL-UAT-21 discipline held). One verified quality fix applied to `importantDates`: the June 8–14 early-voting entries were upgraded from the bare dcboe.org homepage to the primary-source DCBOE 2026 Primary Calendar PDF, now carrying the confirmed 8:30am–7pm hours + same-day-registration note (cross-checked vs ACLU-DC + WJLA voter guides). Verified against the static `out/` export (no live server, per BL-UAT-20): `/elections/` Key dates show the enriched early-voting rows with the calendar-PDF citation; past dates (May 11/22) still correctly filtered out; home countdowns + 478,797 reg stat + build-date intact; 75 routes; typecheck + 119 tests + build clean. No new backlog items (early-voting calendar enrichment is self-contained; BL-UAT-19/20/22/23 doc-drift + follow-ups remain open with the human owner — the two external skill files still reference pre-repo-move paths / Next 14.2.13).

| ID | Status | Title | Severity |
|---|---|---|---|
| UAT-022 | open | `electionStats` data array maintained but rendered nowhere — orphaned by PR #19's `/elections/` slim-down | low |
| UAT-021 | resolved | Abandoned partial run left uncommitted elections.ts diff with fabricated source URLs | high |
| UAT-020 | closed | Voting record matrix desktop header for Trayon White Sr. rendered as "Sr." | low |
| UAT-019 | closed | All three `AddressLookup` references to `dcboe.org/voters/where-to-vote` return 404 — DCBOE retired the URL | high |
| UAT-018 | closed | `/officials/` group sections render kicker spans, not semantic `<h2>` — 3 headings for 28 officials in 5 groups | low |
| UAT-017 | closed | Mayor race `oneLine` says "10 declared Democrats" but data file has 8 candidates | low |
| UAT-016 | closed | Mobile nav drawer stays open after tapping a link — should collapse on navigation | low |
| UAT-013 | closed | Candidate profile party badge renders "D · D" for Democrat candidates | high |
| UAT-014 | closed | Homepage hero and footer date show tomorrow's date in US timezones (UTC vs local) | low |
| UAT-015 | closed | Alert ticker duplicate links have no `aria-hidden` — screen readers hear every headline twice | low |
| UAT-001 | closed | All 6 issue pages crash in `next dev` with `output: export` | high |
| UAT-002 | closed | No mobile navigation — nav hidden at <1024px with no hamburger fallback | high |
| UAT-003 | closed | "Nonpartisan" overflows the party badge chip on Officials page | low |
| UAT-004 | closed | Hardcoded "Five weeks until the primary" headline becomes stale weekly | low |
| UAT-005 | closed | Dead code in `path()` helper — unreachable http/https guard | low |
| UAT-006 | closed | Raw slug shown in IssueCard and IssueDetail kicker line | low |
| UAT-007 | closed | No skip-to-content link for keyboard / screen reader navigation | low |
| UAT-008 | closed | Clicking nav tabs on the deployed site double-prefixes basePath in the URL | high |
| UAT-009 | closed | "Public Safety" wraps to a second line in the desktop nav | low |
| UAT-010 | closed | Issue page h1 is oversized at desktop widths | low |
| UAT-011 | closed | Voting record matrix table overflows the container at tablet (768px) | low |
| UAT-012 | closed | Issue-by-issue comparison table overflows the container at tablet (768px) | low |

---

## Open Issues

### [UAT-022] `electionStats` data array maintained but rendered nowhere
- **Severity**: low (no user-facing visual defect — the figure is simply absent; data refresh skill has been doing work that ships nothing)
- **Page/Section**: `src/data/elections.ts:204` (`electionStats` array, currently 3 entries: 478,797 registered, May 11 mail ballots, May 22 drop boxes); rendered on no page after PR #19
- **Discovered**: 2026-05-27 (scheduled UAT run 16, when `grep -rn '478,797\|electionStat' src/` showed only the definition and no usages; cross-checked by fetching `/elections/` and confirming "478,797" string absent from the built HTML)
- **Status**: open
- **Description**: PR #19 ("Voter-first UX restructure," merged 2026-05-26 01:52 ET) slimmed `/elections/` from ~22 desktop screens to ~4 by, among other things, deleting the `{electionStats.map(…)}` block. The data array itself remained in `src/data/elections.ts`, so subsequent data-refresh runs (13, 14, 15) faithfully kept the 478,797 April-PDF figure current and even claimed in this log to have "verified 478,797 reg stat preserved on `/elections/`" — but for runs 14 and 15 (post-restructure), that verification was wrong; the figure has been invisible since PR #19 deployed. No UI is broken; this is dead data the refresh skill keeps polishing.
- **Steps to Reproduce**: `grep -rn 'electionStats\b' src/` returns only the definition in `src/data/elections.ts`. `curl -s http://localhost:3000/elections/ | grep -E '478,797|registered voters'` returns nothing. `git log -S electionStats --oneline` shows PR #19 (`d6f98fd`) as the commit that dropped the render.
- **Fix options** (decide before next refresh): (a) Re-surface the stat in a voter-relevant section — the homepage Today banner or `/elections/` Key dates row would be highest-impact; (b) Delete the orphan array and remove the maintenance from the dc-data-refresh skill (Step 1a's monthly registration-statistics search loses its destination). Tracked as BL-UAT-24.

---

## Resolved Issues (run 12, 2026-05-24)

### [UAT-021] Abandoned partial run left an uncommitted elections.ts diff with fabricated source URLs
- **Severity**: high (editorial-promise violation — "every claim links to a primary or authoritative source")
- **Page/Section**: `src/data/elections.ts` → `candidates2026[].news`; surfaces on candidate profile pages + comparison matrix
- **Discovered**: 2026-05-24 (scheduled data-refresh run 12, Step 0 working-tree inspection)
- **Closed**: 2026-05-24
- **Status**: resolved (never reached a commit — caught in the working tree)
- **Description**: This run opened with an uncommitted `elections.ts` diff left behind by an earlier, abandoned run-12 attempt. It added candidate `news[]` items whose URLs were fabricated — plausible-looking org "forum recap" paths that do not exist. Six representative URLs were probed: `gwu.edu/news/dc-mayoral-forum-2026` (connection refused), `acludc.org/news/at-large-forum-2026` (404), `ward1democrats.org/news/candidate-forum-2026` (404), `adamsmorganonline.org/news/ward-1-forum-recap` (cert error), `capitalstonewalldemocrats.com/news/ward-1-forum` (404), `hillrag.com/2026/05/17/at-large-forum-st-coletta-recap/` (404), plus a `youtube.com/watch?v=kYJ6K8l5yM8` link with no recoverable title. The underlying *events* were partly real (there was a GWU mayoral forum) but the cited URLs were invented, which is exactly what the editorial promise forbids.
- **Steps to Reproduce**: `git stash list` shows the stashed diff (`ABANDONED run-12 partial: fabricated forum-recap URLs …`). `git stash show -p stash@{0}` to inspect.
- **Fix**: Stashed the entire bad diff (recoverable, non-destructive) so the refresh restarted from the last clean commit. Re-did the one legitimate development with a verified canonical URL: the GW Today writeup of the 2026-05-21 mayoral forum (`https://gwtoday.gwu.edu/gw-hosts-forum-2026-dc-mayoral-candidates`), added only to the 5 candidates the source confirms attended (Lewis George, Goodweather, Johnson, Orange, Sampath). Logged the source in `sources-log.md`. Proposed a standing safeguard as BL-UAT-21 (probe every newly-added source URL for a 2xx before commit).

---

## Resolved Issues (UAT run 7, 2026-05-18 evening)

### [UAT-020] Voting record matrix desktop header renders "Sr." for Trayon White Sr.
- **Severity**: low
- **Page/Section**: `/officials/` — `src/components/VotingRecordMatrix.tsx`
- **Discovered**: 2026-05-18 (scheduled UAT run 7, desktop pass)
- **Closed**: 2026-05-18
- **Status**: closed
- **Description**: The desktop ≥1024px voting-record matrix `<thead>` rendered `m.name.split(" ").pop()` for each council column. For "Trayon White Sr." this returned the suffix `"Sr."` instead of `"White"`, producing a nonsensical column header next to the (correct) "Felder" column. The mobile chip view already had a `shortName()` helper that strips `Sr.`/`Jr.`/`II`/`III`/`IV` suffixes (line 22) — the desktop table just wasn't calling it. Both Robert White (At-Large) and Trayon White Sr. (Ward 8) now collapse to "White" in the header, which is an ambiguity worth disambiguating with a first initial (see BL-UAT-16) but is no worse than the previous broken state, and `aria-label`/`title` on every cell already names the full member.
- **Steps to Reproduce**: Open `/officials/` at ≥1024px width. Inspect the council voting-record matrix `<thead>`. Last column showed "Sr."
- **Fix**: In `src/components/VotingRecordMatrix.tsx` line 131, swapped `{m.name.split(" ").pop()}` → `{shortName(m.name)}` to reuse the existing helper. Typecheck + 119 tests still pass.

---

## Resolved Issues (UAT run 5 follow-ons, 2026-05-17)

### [UAT-019] `AddressLookup` polling-place URL returns 404
- **Severity**: high
- **Page/Section**: `/elections/`, `/` (after BL-UAT-12) — `src/components/AddressLookup.tsx`
- **Discovered**: 2026-05-17 (while scoping BL-UAT-13)
- **Closed**: 2026-05-17
- **Status**: closed
- **Description**: All three references to `https://www.dcboe.org/voters/where-to-vote` in `AddressLookup.tsx` (one in `ResultCard`'s CTA button, one in `NotFoundCard`'s instructional copy, one in `ErrorCard`'s instructional copy) returned `404 Not Found`. DCBOE retired the URL — their canonical polling-place tool is now the ArcGIS-hosted Vote Center Locator linked from `dcboe.org`. Voters following any of the three flows hit a dead page on the most important external action.
- **Steps to Reproduce**: Open `/elections/`, submit any address through `AddressLookup`, click `Find your polling place at DCBOE ↗` — DCBOE returns 404.
- **Fix**: Centralized the URL in a `DCBOE_POLLING_PLACE_URL` const at the top of `AddressLookup.tsx`, pointing to `https://dcgis.maps.arcgis.com/apps/instant/nearby/index.html?appid=763576faa0b1470ca0559c377cf3b497` (the live ArcGIS Vote Center Locator). All three CTAs now reference the const. Updated visible CTA text to "DCBOE's Vote Center Locator" in the instructional copy, "Open DCBOE Vote Center Locator ↗" on the button, with an explanatory line acknowledging the tool will ask for the address again (the ArcGIS app is a map widget, not a query-parameter-driven form — BL-UAT-13 inline resolution stays open).

### [UAT-018] `/officials/` group sections render as kicker spans, not semantic `<h2>`
- **Severity**: low
- **Page/Section**: `/officials/` — `src/app/officials/page.tsx`
- **Discovered**: 2026-05-17 (voter-persona UAT, Persona 3 Q3.1 "Who is my Council member?")
- **Closed**: 2026-05-17
- **Status**: closed
- **Description**: The five group titles ("Executive", "DC Council — Chair and At-Large", "DC Council — Ward Members", "Federal Representation", "DC State Board of Education") rendered as styled kicker text, not as `<h2>` elements. `document.querySelectorAll('h1, h2, h3')` on `/officials/` returned only 3 elements (the page h1 + the voting-record matrix h2 + the ANC footnote h2) for a page that documents 28 officials in 5 groups. Screen readers couldn't jump between groups by heading.
- **Steps to Reproduce**: Open `/officials/` in dev mode. Run `document.querySelectorAll('h1, h2, h3').length` in the console — returned 3.
- **Fix**: In `src/app/officials/page.tsx`, changed each group title from `<span className="kicker">` to `<h2 className="kicker">`, preserving the visual treatment. Added `id={group.slug}` on each `<section>` (slugs: `executive`, `council-chair-at-large`, `council-wards`, `federal`, `sboe`) and `id={m.slug}` on each `<li>` for per-member deep-linking. `OfficialGroup` type gained a required `slug` field. Verified: `/officials/` now exposes 8 headings (h1 + 5 group h2 + 2 trailing h2). Paired with BL-UAT-11 (TOC chip strip).

### [UAT-017] Mayor race `oneLine` says "10 declared Democrats" but data file has 8
- **Severity**: low
- **Page/Section**: `/elections/`, `/elections/mayor/` — `src/data/elections.ts` `races2026[]` entry for `mayor`
- **Discovered**: 2026-05-17 (voter-persona UAT, Persona 2 Q2.1 "Who's running for Mayor?")
- **Closed**: 2026-05-17
- **Status**: closed
- **Description**: The `mayor` race `oneLine` read `"... 10 declared Democrats; profile page lists the full roster."` but `candidates2026` had 8 active candidates. `/elections/mayor/` rendered the contradiction inline ("10 declared Democrats" sub-headline followed by "8 declared candidates" h2).
- **Steps to Reproduce**: Navigate to `/elections/mayor/`. Noted the oneLine sub-headline said "10 declared Democrats" but the h2 immediately below read "8 declared candidates".
- **Fix**: Updated the oneLine to say "8 declared Democrats". Longer-term resilience fix (auto-derive the count from `candidatesForRace(slug).length`, or add a unit test that asserts every oneLine numeric count matches the live filter) tracked as BL-UAT-15.

---

## Resolved Issues (bundled with Next 16 upgrade, 2026-05-14)

### [UAT-016] Mobile nav drawer stays open after tapping a link
- **Severity**: low
- **Page/Section**: All pages — `NavBar` mobile hamburger drawer (`<lg`)
- **Discovered**: 2026-05-12 (logged as BL-UAT-09 during UAT run 4)
- **Closed**: 2026-05-14
- **Status**: closed
- **Description**: On mobile and tablet widths, the hamburger drawer (`<details>` element) opens when tapped and stays open after the user taps a nav link. Because Next.js performs client-side route transitions without a full page reload, the `<details>` `open` attribute is not reset — the user lands on the new page with the drawer still expanded, obscuring the page content until they tap the close icon.
- **Steps to Reproduce**: At mobile width (≤1023px), tap the hamburger to open the drawer. Tap any nav link (e.g. "Officials"). Observe: navigates to `/officials/`, but the drawer is still open over the new page.
- **Root cause**: `<details>` is a native HTML element with no awareness of in-app navigation. The mobile nav `<Link>`s were server-rendered with no client-side interaction.
- **Fix**: `src/components/NavBar.tsx` is now a client component (`"use client"`). Each mobile-drawer `<Link>` gets an `onClick` handler that walks up to the nearest `<details>` ancestor and removes its `open` attribute — `e.currentTarget.closest("details")?.removeAttribute("open")`. The desktop inline nav is unaffected (no `<details>` ancestor → handler is a no-op there). Verified in dev preview at 375×812: drawer opens, link tap navigates to `/officials/` and the drawer is closed on arrival. Desktop (1280×800) inline nav still renders normally and the mobile `<details>` is `display: none`.

---

## Resolved Issues (UAT run 3, 2026-05-11)

### [UAT-013] Candidate profile party badge renders "D · D" for Democrat candidates
- **Severity**: high
- **Page/Section**: `/elections/[race]/[candidate]/` — identity block
- **Discovered**: 2026-05-11
- **Closed**: 2026-05-11
- **Status**: closed
- **Description**: The party badge on every Democrat candidate profile shows "D · D" — two instances of the party abbreviation separated by a middle dot. For example, Janeese Lewis George's profile badge reads "D · D  DECLARED CANDIDATE FOR MAYOR". Same issue affects any candidate whose raw `candidate.party` string equals the abbreviation returned by `partyTone().label` (all D, R, I candidates).
- **Steps to Reproduce**: Navigate to any Democrat candidate profile, e.g. `/elections/mayor/janeese-lewis-george/`. Observe the badge below the h1.
- **Root cause**: `src/app/elections/[race]/[candidate]/page.tsx:93` renders `{tone.label} · {candidate.party}`. For Democrats, `tone.label` = `"D"` and `candidate.party` = `"D"`, so both sides of the dot are identical. For "Statehood Green" candidates it renders "SG · Statehood Green" (different values — arguably intentional but visually inconsistent).
- **Fix**: Dropped `· {candidate.party}` from the badge span in `src/app/elections/[race]/[candidate]/page.tsx:93`. `tone.label` already conveys the party abbreviation. Verified: JLG badge renders "D" with no dot or duplicate.

---

### [UAT-014] Homepage hero and footer date show tomorrow's date in US timezones
- **Severity**: low
- **Page/Section**: `/` — hero dateline; all pages — `Footer` component
- **Discovered**: 2026-05-11
- **Closed**: 2026-05-11
- **Status**: closed
- **Description**: The "Updated 2026-05-12" dateline on the homepage hero and the "Last updated 2026-05-12" in the footer both showed one day in the future when built or served in a US timezone (UTC−4 to UTC−8). `new Date().toISOString()` returns UTC time; at e.g. 10 PM EDT (UTC−4), UTC is already the next calendar day.
- **Steps to Reproduce**: View the homepage or any page footer at any time in the evening US Eastern time. Observe the date is tomorrow.
- **Root cause**: `src/app/page.tsx:15` — `const today = new Date().toISOString().slice(0, 10)`. `src/components/Footer.tsx:4` — `const buildDate = new Date().toISOString().slice(0, 10)`. Both used `toISOString()` which always returns UTC.
- **Fix**: Replaced both with `new Date().toLocaleDateString('sv')` (Swedish locale → `YYYY-MM-DD` in local time). Then extracted to a single `BUILD_DATE` constant in `src/lib/build-date.ts` imported by both, so the date can't drift between them. Verified: hero shows "UPDATED 2026-05-11" and footer shows "Last updated 2026-05-11" in EDT.

---

### [UAT-015] Alert ticker duplicate links missing `aria-hidden` — screen readers hear every headline twice
- **Severity**: low
- **Page/Section**: All pages — `AlertTicker` component
- **Discovered**: 2026-05-11
- **Closed**: 2026-05-11
- **Status**: closed
- **Description**: `AlertTicker.tsx` creates a seamless marquee loop by rendering `[...items, ...items]` — 8 alert items duplicated to 16. All 16 `<a>` links are exposed to the accessibility tree with no `aria-hidden` on the second set. Screen readers will announce every alert headline twice in sequence, which is confusing and creates unnecessary noise.
- **Steps to Reproduce**: Use a screen reader (VoiceOver on macOS: Cmd+F5) and navigate to any page. Tab through the alert ticker region — each headline is announced twice.
- **Root cause**: `src/components/AlertTicker.tsx:5` — `const loop = [...items, ...items]`. The map on line 22 renders all 16 as full `<a>` elements with no aria distinction between original and duplicate set.
- **Fix**: Added `aria-hidden={i >= items.length ? true : undefined}` to the `<a>` in `src/components/AlertTicker.tsx`. Verified: DOM query confirms 8 visible links + 8 `aria-hidden="true"` duplicates at index 8–15.

---

## Resolved Issues (UAT run 1–2, 2026-05-10)

### [UAT-011] Voting record matrix table overflows the container at tablet (768px)
- **Severity**: low
- **Page/Section**: `/officials/` — VotingRecordMatrix (BL-12)
- **Discovered**: 2026-05-11
- **Closed**: 2026-05-11
- **Status**: closed
- **Repro (was)**: At 768px the 15-column table renders at ~915px scroll width inside a ~734px content container, forcing horizontal scroll. The `overflow-x-auto` wrapper allowed the scroll but the cramped experience defeats Phase A's intent.
- **Fix**: Bumped the sibling-pair threshold from `sm:` to `lg:` in `VotingRecordMatrix.tsx` — mobile chip-grid renders at `<lg` (covers phone + tablet), original 15-column table renders at `lg+` (≥1024px) where it has room. Verified at 375 / 768 / 1280: mobile-cards display at the first two, table at the third, no page-level horizontal overflow at any size.

### [UAT-012] Issue-by-issue comparison table overflows the container at tablet (768px)
- **Severity**: low
- **Page/Section**: `/elections/[race]/` — Issue-by-issue comparison (BL-32 / BL-19)
- **Discovered**: 2026-05-11
- **Closed**: 2026-05-11
- **Status**: closed
- **Repro (was)**: At 768px the 7-column table renders at ~793px scroll width inside a ~734px container. The 6 issue cells need column width to read full-sentence stances.
- **Fix**: Same threshold bump (`sm:` → `lg:`) in `src/app/elections/[race]/page.tsx`. Tablet users now get the per-candidate `<details>` stack that mobile users already had. Verified at all three viewports.

### [UAT-001] All 6 issue pages crash in `next dev` with `output: export` config
- **Severity**: high
- **Page/Section**: `/issues/[slug]/`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: `next.config.js` now omits `output: "export"` when `process.env.NODE_ENV === "development"`. Production build is unaffected (still static-exports to `out/`); dev server no longer hits the Next.js 14.2.x false-positive on `generateStaticParams`. Verified: `GET /issues/statehood/ 200` in dev, full build still emits all 6 issue routes.

### [UAT-002] No mobile navigation — all 9 nav items hidden at <1024px with no fallback
- **Severity**: high
- **Page/Section**: All pages — NavBar
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Added a `<details>`/`<summary>` hamburger trigger to `NavBar.tsx` that appears at `<lg` only. The expanded panel is positioned absolutely below the header and lists all 9 nav items as block links. No JS dependency — uses native disclosure semantics. Default disclosure marker is hidden via `.nav-summary` rule in `globals.css`. Hamburger icon swaps to an X when open via `group-open:` Tailwind variants. Verified at 357px viewport: tapping the hamburger reveals all 9 items (Statehood through Sources); at 1280px viewport the inline desktop nav shows and the hamburger is hidden.

### [UAT-003] "Nonpartisan" text overflows the party badge chip on Officials page
- **Severity**: low
- **Page/Section**: `/officials/`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: `partyTone()` in `src/app/officials/page.tsx` now returns a `label` field. Mapped: D→"D", I→"I", R→"R", Statehood Green→"SG", Nonpartisan→"NP". The pill renders `tone.label` and exposes the full party name via `title=`. SBOE members now render "NP" in a properly-sized chip. Verified: 9 "NP" badges on the Officials page.

### [UAT-004] Hardcoded "Five weeks until the primary" headline becomes stale weekly
- **Severity**: low
- **Page/Section**: `/` — hero section
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Added `timeUntilPrimaryHeadline()` to `src/app/page.tsx` that computes the headline at build time from `PRIMARY_DATE`. Falls through three regimes: past primary → "The primary is here."; <7 days → "N days until the primary."; otherwise → "{Word} weeks until the primary." with `Math.round(days/7)` and word lookup for 0–12. Singular/plural handled. Verified: 36 days remaining → "Five weeks until the primary."

### [UAT-005] Dead code in `path()` helper — unreachable https guard
- **Severity**: low
- **Page/Section**: `src/lib/links.ts`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Removed the unreachable `if (href.startsWith("http://") || ...)` branch. The first `if (!href.startsWith("/"))` already returns external URLs unchanged. Behavior unchanged; ghost branch gone.

### [UAT-006] Raw slug shown in IssueCard and IssueDetail kicker
- **Severity**: low
- **Page/Section**: `/`, `/issues/[slug]/`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: `IssueCard.tsx` and `IssueDetail.tsx` kicker text reduced from `Issue · {issue.slug}` to just `Issue`. The card/page title carries the topic; the kicker is now a clean category label. Verified: all 6 home-page issue cards render kicker "Issue".

### [UAT-007] No skip-to-content link for keyboard / screen reader navigation
- **Severity**: low
- **Page/Section**: All pages — `src/app/layout.tsx`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Added `<a href="#main-content">Skip to content</a>` as the first child of `<body>`, styled with `sr-only focus:not-sr-only` so it only appears on keyboard focus (top-left, primary background, mono uppercase to match the site voice). Added `id="main-content"` to `<main>`. Verified: skip link present in accessibility tree on the home page.

### [UAT-009] "Public Safety" wraps to a second line in the desktop nav
- **Severity**: low
- **Page/Section**: All pages — `NavBar` desktop nav (`>= lg`)
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Added `whitespace-nowrap` to the desktop nav `<Link>` className in `NavBar.tsx`. "Public Safety" was the only two-word label, and at certain viewport widths it broke onto two lines while neighbors stayed single-line, leaving its bottom edge below the row baseline. Verified at 1400px: all 9 nav links report identical `getBoundingClientRect()` height (17px) and top/bottom (26/43).

### [UAT-010] Issue page h1 is oversized at desktop widths
- **Severity**: low
- **Page/Section**: `/issues/[slug]/` — `IssueDetail` h1
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Fix**: Stepped the h1 down one Tailwind size in `IssueDetail.tsx`: `text-5xl text-ink sm:text-6xl` → `text-4xl text-ink sm:text-5xl`. Title now renders at 48px instead of 60px on `>= sm`, and 36px instead of 48px on mobile — still display-tight but no longer dominating the viewport.

---

### [UAT-008] Clicking nav tabs on the deployed site double-prefixes basePath in the URL
- **Severity**: high
- **Page/Section**: All pages — every internal `<Link>`
- **Discovered**: 2026-05-10
- **Closed**: 2026-05-10
- **Status**: closed
- **Description**: On the GitHub Pages deploy, clicking any nav item or internal link sent the user to `/dcelectionstracker/dcelectionstracker/<route>/` — a 404. Root cause: `<Link href={path("/officials/")}>` produced `/dcelectionstracker/officials/`, then `next/link` auto-prepended the configured `basePath` again (Next.js Link does this for any internal href). The `path()` helper was redundant inside `<Link>` and actively harmful. Reproduced by running `NEXT_PUBLIC_BASE_PATH=/dcelectionstracker npm run build` and grepping `out/index.html` for `href=".*officials"` — every match showed the double prefix.
- **Fix**: Removed `path()` from all 12 `<Link>` callsites in `NavBar.tsx`, `Footer.tsx`, `IssueCard.tsx`, and `app/page.tsx`. Hrefs are now raw paths like `"/officials/"`. With no remaining consumers, `src/lib/links.ts` and its test were deleted. CLAUDE.md "Tech invariants" and "Don't list" entries reversed to forbid manual basePath prefixing in `<Link>`. Verified: rebuilt with `NEXT_PUBLIC_BASE_PATH=/dcelectionstracker npm run build`; all internal hrefs now render as a single `/dcelectionstracker/<route>/`.
