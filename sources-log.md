# DC Elections Tracker — Sources Log

All sources ever referenced or discovered during data refresh runs.
Kept for auditing, future research, and editorial accountability.
Newest entries at top within each section.

_Last updated: 2026-05-28 (run 17 — scheduled thin-window pass, 19 days from primary. **Three verified additions this run, all cleanups of earlier-month items that were missed:** (1) WaPo, 2026-04-29 — "Janeese Lewis George faces probe over D.C. mayoral campaign's ties to unions" (with corroborating Axios Apr 29, Washington City Paper Apr 27, and TheDCLine/jonetta May 1 — all four URLs documented in this log, only the WaPo piece added to JLG's news[] as the primary-source citation). The DC Office of Campaign Finance opened the probe on Apr 24 after a six-page complaint from Kevin Sobkoviak alleging coordination between JLG's campaign and the Safe & Affordable DC IE-PAC plus Unite Here Local 25 / SEIU 32BJ; campaign denies the allegations. Net JLG news[] held at 12 by dropping the Washington Blade May 14 "LGBTQ community must say NO" opinion (redundant with the other Blade May 14 endorsement entry already present) and the City Cast Apr 27 Charles Allen endorsement (already gestured to in newsThemes detail). The first newsTheme's supportingUrls was trimmed to drop the dead Charles Allen URL and the theme detail re-worded to drop the "council-colleague" hook so it still parses as load-bearing. (2) WaPo, 2026-05-14 — "Ads target D.C. mayoral hopefuls on crime, utilities ahead of June primary" — added to both JLG and McDuffie news[] (load-bearing first-major-TV-buy story, missed in prior 3 runs). McDuffie cap held at 12 by dropping the May 18 Hoya piece (redundant with FOX 5 on the same May 18 event). (3) DCBOE, drop-boxes reporting page — the electionStats "May 22 — Drop boxes open citywide" entry was upgraded with the concrete count "55 mail-ballot drop boxes citywide" and re-linked to dcboe.org/dcboe/media/PDFFiles/Drop-Boxes-Reporting.pdf (more durable URL than the bare homepage). Forward-looking alert added at the top of alerts.ts: "Early voting begins in 11 days — June 8 to 14 at every Vote Center, 8:30am–7pm, with same-day registration" (sourced to the DCBOE 2026 Primary Calendar PDF; the prior May 26 deadline reminder kept as a now-past-tense item). Sweep also covered: WaPo mayoral editorial endorsement (still none through May 28 — Tracker remains in standing follow-up); GW Hatchet May 26 forum-recap (HTTP 403 from WebFetch, treated as a likely re-write of the May 21 GW Today forum already in JLG/Goodweather/Johnson/Orange/Sampath news[], skipped pending clean access); fresh May 27 + May 28 candidate news (51st's May 27 piece is a generic civics roundup, no candidate-level news in the past 24 hours); WaPo May 14 schools-control opinion already in JLG's news[] from prior runs.)_

_Prior — run 16 (2026-05-27 — scheduled day-after-deadline pass, 20 days from primary. **Two verified developments added:** (1) WJLA, May 25, 2026 — DC Council Chair Phil Mendelson identified ~$420M in potential FY27 funding sources (reserves + tax-code changes) to soften ~$1B in proposed cuts; added as a new top alert (above the now-stale May 26 deadline reminder, which was updated to past-tense) and as a budget `recentMove` dated 2026-05-25 (kept the prior May 15 ANC-briefing item that captured the narrower $160M reserves figure). (2) WaPo May 20 editorial + May 22 news desk + Jewish Insider May 18 — Janeese Lewis George attended Trayon White's 42nd birthday picnic in Ward 8 and described the indicted Ward 8 councilmember as a past "mentor" she relied on after joining Council; she voted for his 2025 expulsion. Added all three URLs to her profile's `news[]` (dropped the older Georgetowner profile, WaBlade GLAA-ratings collective piece, and FOX 5 debate piece — all non-load-bearing, none referenced by `newsThemes.supportingUrls`; net cap held at 12). Added a second `newsThemes` entry for Lewis George with the factual wording "Faces backlash after attending Trayon White's birthday picnic and calling the indicted councilmember a past 'mentor'" — supporting URLs all cross-validated against the news[] array.)_

_Prior — run 15 (2026-05-26 — scheduled voter-registration-deadline-day pass, the day after Memorial Day. **Thin 1-day window; one verified development found and added:** Free DC's 2026 endorsements guide, dated May 13, 2026, endorses Janeese Lewis George for Mayor and Robert White for Delegate. The guide page at freedcproject.org/news/our-2026-endorsements-guide HEAD-checks 200 and was confirmed by webfetch; the standing endorsements directory at freedcproject.org/endorsements also reads 200. Both endorsements added as `news[]` items to the two candidate profile pages (Lewis George held at the 12-item cap by dropping the duplicate Hoya debate writeup that already overlapped Fox 5's analyst-panel coverage; White grew 5→6). Lewis George's "progressive endorsement coalition" newsThemes entry and Robert White's "CBC-/labor-/resistance lane" entry were both extended to name Free DC and add the URL. Also refreshed the top alert: the prior May 23 forward-looking deadline reminder was retained, and a new May 26 deadline-day alert was added reading "Today is the advance voter-registration deadline; same-day registration is still available at every Vote Center through Election Day June 16." Sweep also covered: Washington Post mayoral editorial endorsement (none yet — none found through May 26); fresh DCist/Axios/WaPo/51st coverage May 24–26 (the Memorial Day weekend produced no candidate-level news beyond the Mayor's office Saturday-Sunday calendar release, which is not campaign content); voter turnout / mail-ballot return numbers (DCBOE has not yet published interim returns); council ward 3/5/6 races (no new May 24–26 developments). One launch-config addition this run: added `dc-watch-static` entry to `.claude/launch.json` (`npx serve -l 3000 out`) so unattended runs can start a preview on the static export without colliding with stray dev servers — partial mitigation for BL-UAT-20.)_

_Prior — run 14 (2026-05-25 — scheduled Memorial Day pass. **Thin holiday window, no new datable developments:** DCBOE offices closed for the holiday (no fresh releases); the major late-May beats — the City Cast/TrueDot poll (fielded May 12–17), the May 18 Georgetown/Fox 5 debate, the May 21 GWU forum, the May 26 advance-registration deadline, and the May 22 drop-box opening — are all already on the site from runs 10–13. Sweeps of the mayoral, delegate (White/Pinto/Zalesne), and Ward 1 (Brown/Raj/Lynch) races surfaced only pre-May-22 coverage already captured or below the news cap. One verified quality fix applied: the `importantDates` early-voting entries (June 8–14) were upgraded from the bare dcboe.org homepage to the primary-source DCBOE 2026 Primary Calendar PDF and now carry the confirmed 8:30am–7pm hours + same-day-registration note (cross-checked vs ACLU-DC and WJLA voter guides). Confirmed early voting June 8–14 is already in `importantDates`, so no redundant `electionStat` was added.)_

_Prior — run 13 (2026-05-24 — scheduled evening pass, paired with the morning run 12. **Two verified updates this thin same-day window:** (1) cleared the long-standing follow-up by parsing the April 30, 2026 DCBOE registration PDF — 478,797 total registered (75.39% Democratic), now in electionStats, replacing the Feb 28 figure of 476,066; (2) caught a roster gap in the profiled council-at-large-bonds race — the East of the River 2026-05-01 roundup names 9 declared Democrats but only 6 were tracked, so added Dwight Davis, Dyana N.M. Forester, Fred Hill, and Greg Jackson (all four campaign sites HEAD-checked live; fredhill4dc.com returns 403/bot-block but resolves, treated as reachable per BL-UAT-21) and bumped the race oneLine count 6 → 10. No other verifiable post-May-23 developments; the May 21 WAMU/Daily Caller items are voter-guide/opinion and were skipped.)_

_Prior — run 12 (2026-05-24 morning). **Source-integrity cleanup:** an abandoned partial run-12 left uncommitted, unverified news items in elections.ts with fabricated forum-recap URLs (gwu.edu/news/…, acludc.org/news/at-large-forum-2026, ward1democrats.org, adamsmorganonline.org, capitalstonewalldemocrats.com, a dead youtube link) — all six confirmed 404/refused and stashed/discarded; logged as ISSUE in issues.md. Re-did the work cleanly: the GWU mayoral forum is REAL but its canonical URL is gwtoday.gwu.edu/gw-hosts-forum-2026-dc-mayoral-candidates (2026-05-21, verified) — added to the 5 candidates who actually attended (Lewis George, Goodweather, Johnson, Orange, Sampath; NOT McDuffie, who the fabricated version wrongly tagged). Trimmed Lewis George's duplicated May 2 WTOP roundup to hold the 12-item cap. No other verifiable post-May-23 developments. Standing follow-up from run 9/10/11: April 2026 DCBOE registration-statistics PDF still unparsed — electionStats holds the Feb 28 figure (476,066).)_

---

## Government & Official

- [ongoing] DCBOE — Mail-Ballot Drop Boxes reporting page (canonical 55-drop-box list, May 22 to June 16 at 8pm; now sourced from electionStats in run 17) — https://dcboe.org/dcboe/media/PDFFiles/Drop-Boxes-Reporting.pdf
- [2026-05-25] WJLA — DC Council leader identifies $420M in potential funding amid budget battle (Chair Mendelson's combined reserves + tax-code-realignment proposal to soften ~$1B in FY27 cuts; new top alert + budget recentMove this run) — https://wjla.com/news/local/washington-dc-budget-phil-mendelson-cuts-millions-potential-funding-crisis-spending-city-services-education-housing-economic-uncertainty-federal-workers-dmv-taxes-tax-code-changes
- [2026-05-13] Free DC — 2026 Endorsements Guide (formally endorses Janeese Lewis George for Mayor and Robert White for Delegate; their resistance/statehood-coalition pick — added to both candidate profiles' news[] this run) — https://freedcproject.org/news/our-2026-endorsements-guide
- [2026-05-13] Free DC — Endorsements directory landing page (canonical entry point listing both 2026 endorsed candidates) — https://freedcproject.org/endorsements
- [2026-05-18] DCBOE — 2026 Elections page (per-ward sample ballots for Wards 1–8 × Democratic / Republican / DC Statehood Green now published) — https://www.dcboe.org/elections/2026-elections
- [2026-04-30] DCBOE — April 2026 voter registration statistics PDF (parsed run 13: 478,797 total registered citywide — DEM 360,953 / 75.39%, REP 24,533, STG 4,558, N-P 85,819, OTH 2,934; now feeds electionStats, replacing the Feb 28 figure of 476,066) — https://www.dcboe.org/getmedia/3c291ec7-9318-4365-a423-81a08b408e3a/Data-Statistics-Report-4_2026.pdf
- [2026-05-18] Georgetown University — Fox 5 / GU Politics May 18 mayoral primary debate announcement (Goodweather, Lewis George, McDuffie qualified) — https://www.georgetown.edu/news/georgetown-fox-5-dc-2026-debate-democratic-mayoral-primary/
- [2026-05-15] GW Hatchet — Mendelson briefs ANC: ~$160M in CFO reserves blocked by tax-decoupling override, signals fight to spend — https://gwhatchet.com/2026/04/18/dc-council-chair-briefs-anc-on-proposed-fy2027-city-budget-detailing-widespread-cuts/
- [2026-05-17] DC State Board of Education — Board Biographies (authoritative ward-by-ward term-end years; used to correct 6 of 9 SBOE entries in officials.ts) — https://sboe.dc.gov/page/board-biographies
- [2026-05-10] DC Council Budget Office — FY27 first vote expected June 9, budget hearings through May 12 — https://51st.news/dc-budget-2026-first-vote/
- [2026-04-10] Mayor's office — FY27 "Grow DC" budget proposal: $1.1B deficit, ~$500M cuts — https://mayor.dc.gov/release/mayor-bowser-presents_fy27_budget-builds-more-decade-growth_and-creates_new-opportunities
- [2026-04-01] More Affordable DC / DCBOE — Initiative 88 rent freeze approved as proper subject matter — https://moreaffordabledc.org/2026/04/01/press-release-dcboe-makes-proper-subject-matter-determination/
- [2026-05-01] USAO-DC — Violent crime in DC hits 30-year low announcement — https://www.justice.gov/usao-dc/pr/violent-crime-dc-hits-30-year-low
- [2026-05-06] DC Council — Final approval of permanent curfew + extended curfew zones (8–5) — https://dccouncil.gov/council-provides-final-approval-to-modified-curfew-including-permanent-option-of-temporary-expanded-curfew-zones/
- [2026-05-01] DCBOE — 2026 Primary RCV sample-ballot training (PDF) — https://www.dcboe.org/getmedia/83194dbd-8b45-423c-b342-dd76609f67c1/2026-Primary-RCV-Training-26-1-9-14-5-30.pdf
- [2026-03-19] Congress.gov — H.R. 5525, Stop DC CAMERA Act (passed House Oversight Committee 21-19) — https://www.congress.gov/bill/119th-congress/house-bill/5525/text
- [2026-01-27] Congress.gov — H.R. 5183, DC Home Rule Improvement Act of 2025 (reported from committee) — https://www.congress.gov/bill/119th-congress/house-bill/5183
- [2026-01-06] Mayor's office — Jeffrey Carroll sworn in as MPD Interim Chief — https://mayor.dc.gov/release/mayor-bowser-announces-jeffery-carroll-interim-chief-police
- [2025-09-17] DC Council / Commanders — Final 11-2 vote on $3.8B Commanders/RFK stadium deal — https://www.commanders.com/news/d-c-council-gives-final-approval-for-rfk-stadium-project
- [2026-05-11] DCBOE 2026 Primary Election Calendar (v08072025) — https://dcboe.org/getmedia/3a7e75bc-4a1b-4aa6-9fc3-f30163beb2b5/2026-Primary-Election-Calendar-Version-08072025.pdf
- [2026-02-02] DCBOE — 2026 Democratic Primary Candidates (official filing list as of Feb 2, 2026) — https://www.dcboe.org/getmedia/7f585e7c-887c-42c5-988f-9a9c59ba9020/2026-PRIMARY-CANDIDATES-02022026.pdf
- [2026-02-18] Congress.gov — PL 119-78 (H.J.Res.142), first DC tax law overridden by Congress — https://www.congress.gov/bill/119th-congress/house-joint-resolution/142/text
- [2026-02-27] OCFO February 2026 Revenue Estimates — $342M/yr forecast cut — https://cfo.dc.gov/release/ocfo-releases-february-2026-revenue-estimates
- [2026-02-12] DC Council — Tax decoupling bill, Senate 49–47 override vote — https://dccouncil.gov/council-separates-elements-of-district-tax-code-from-the-federal-to-fund-family-tax-savings-and-youth-tax-credit-reinstates-temporary-juvenile-curfew/
- [2025-12-17] DC Circuit — Court ruling allowing National Guard deployment to continue — https://www.npr.org/2025/12/17/nx-s1-5647680/federal-court-says-troops-can-stay-in-d-c-and-hints-at-prolonged-deployment
- [2025-09-10] CNN — §740 invocation lapses (Congress did not extend) — https://www.cnn.com/2025/09/10/politics/dc-police-takeover-end-trump-bowser
- [2025-08-11] NPR — Trump invokes Home Rule §740, first time in DC history — https://www.npr.org/2025/08/12/nx-s1-5498728/trump-washington-dc-police-takeover
- [2025-08-11] Washington Post — Trump National Guard DC crime crackdown — https://www.washingtonpost.com/politics/2025/08/11/trump-national-guard-dc-crime-crackdown/
- [ongoing] ACLU-DC — DC Home Rule explainer — https://www.acludc.org/news/dc-home-rule-what-it-how-it-works-and-why-it-matters/
- [2026-02-28] DCBOE Monthly Voter Registration Statistics — 476,066 active registered voters in DC — https://www.dcboe.org/data,-maps,-forms/voter-registration-statistics
- [ongoing] DCBOE — Voter registration portal — https://www.dcboe.org/voters/register-to-vote
- [ongoing] DCBOE — Ranked-choice voting (Initiative 83) — https://www.dcboe.org/elections/ranked-choice-voting
- [ongoing] DCBOE — Homepage — https://dcboe.org/

---

## Candidate & Campaign

### Mayor 2026
- [2026-05-14] Washington Post — Ads target D.C. mayoral hopefuls on crime, utilities ahead of June primary (first major TV-ad buys from JLG and McDuffie; added to both candidates' news[] in run 17) — https://www.washingtonpost.com/dc-md-va/2026/05/14/ads-target-dc-mayoral-hopefuls-crime-utilities-ahead-june-primary/
- [2026-05-01] TheDCLine.org — Jonetta Rose Barras: Has Janeese Lewis George's mayoral campaign violated DC election finance laws? (third corroborating source for the Apr 27 OCF investigation; not added to news[] — kept here for audit only) — https://thedcline.org/2026/05/01/jonetta-rose-barras-has-janeese-lewis-georges-mayoral-campaign-violated-dc-election-finance-laws/
- [2026-04-29] Washington Post — Janeese Lewis George faces probe over D.C. mayoral campaign's ties to unions (DC Office of Campaign Finance opened a probe Apr 24 on alleged coordination between JLG's campaign and the Safe & Affordable DC IE-PAC + Unite Here Local 25 / SEIU 32BJ; added to JLG news[] in run 17 as the primary citation) — https://www.washingtonpost.com/dc-md-va/2026/04/29/janeese-lewis-george-unions-allegation/
- [2026-04-29] Axios DC — Janeese Lewis George campaign investigation targets union alliance (corroborating same-day report; not added to news[] — kept here for audit only) — https://www.axios.com/local/washington-dc/2026/04/29/janeese-lewis-george-mayoral-campaign-investigation
- [2026-04-27] Washington City Paper — Janeese Lewis George Mayoral Campaign Draws Complaint Alleging Coordination With Union (original complaint detail: filed by Kevin Sobkoviak, 6 pages, OCF General Counsel William O. SanFord notified parties) — https://washingtoncitypaper.com/article/784826/janeese-lewis-george-complaint-union-pac/
- [2026-05-22] Washington Post — In D.C. mayoral race, praise for indicted lawmaker prompts careful tiptoeing (news-desk follow-up to the May 20 editorial; added to JLG news[] + supports the new "Trayon White birthday" newsThemes entry in run 16) — https://www.washingtonpost.com/dc-md-va/2026/05/22/dc-mayoral-race-praise-indicted-lawmaker-prompts-careful-tiptoeing/
- [2026-05-20] Washington Post (Opinion) — In D.C. mayor's race, Janeese Lewis George calls Trayon White her 'mentor' (originally discovered run 11 but not added; reconsidered in run 16 once the May 22 news-desk article + Jewish Insider piece made it a verifiable theme with ≥3 supporting URLs — now added to JLG news[] and as the second newsTheme) — https://www.washingtonpost.com/opinions/2026/05/20/dc-mayor-race-janeese-lewis-george-calls-trayon-white-her-mentor/
- [2026-05-18] Jewish Insider — D.C. mayoral contender Janeese Lewis George campaigns with embattled councilman with antisemitic history (third supporting URL for the Trayon White theme; webfetched May 27 — page metadata confirms May 18, 2026 publication) — https://jewishinsider.com/2026/05/janeese-lewis-george-campaign-trayon-white-antisemitic-history/
- [2026-05-20] City Cast DC — TrueDot poll (first public citywide poll; fielded May 12–17, 735 residents / 487 Dems): Lewis George 39% / McDuffie 34% first-choice, McDuffie leads second-choice 27–15 — https://dc.citycast.fm/dc-politics/dc-election-mayor-poll-2026
- [2026-05-20] WJLA — Poll: Lewis George leads DC mayoral race, but ranked-choice voting could help McDuffie — https://wjla.com/news/elections/dc-mayoral-lewis-george-mcduffie-mayor-ranked-choice-primary-washington-election-city-cast-candidates-norton-special-ballot-voters
- [2026-05-20] Washington Examiner — Lewis George holds lead over McDuffie in DC mayor race: Poll — https://www.washingtonexaminer.com/news/campaigns/state/4576224/janeese-lewis-george-lead-kenyan-mcduffie-dc-mayor-race/
- [2026-05-20] FOX 5 DC — New poll shows tight race in DC mayoral primary with Lewis George leading McDuffie — https://www.fox5dc.com/election/new-poll-shows-tight-race-dc-mayoral-primary-lewis-george-leading-mcduffie
- [2026-05-18] Axios DC — DC restaurant association (RAMW) backs Kenyan McDuffie; slate also endorses Pinto (Delegate), Schwalb (AG), Mendelson (Chair) — https://www.axios.com/local/washington-dc/2026/05/18/dc-mayor-race-endorsements-restaurants-ramw
- [2026-05-19] Washington Times — DC mayoral candidates take aim at each other in combative second debate (May 18 Georgetown debate recap) — https://www.washingtontimes.com/news/2026/may/19/dc-mayoral-candidates-take-aim-combative-second-debate/
- [2026-05-18] FOX 5 DC — Who won the DC mayoral debate? Analysts weigh in (post-debate recap from May 18 Fox 5 / Georgetown debate) — https://www.fox5dc.com/news/who-won-dc-mayoral-debate-analysts-weigh
- [2026-05-18] The Hoya — DC Mayoral Candidates Debate Affordability, Federal Intervention (Georgetown campus paper recap of May 18 debate) — https://thehoya.com/news/dc-mayoral-candidates-debate-affordability-federal-intervention/
- [2026-05-14] 51st — Mayoral race fact-check: JLG "defund" attack, McDuffie sports betting app claim — https://51st.news/dc-mayoral-race-fact-check/
- [2026-05-12] The Georgetowner — Mayor Race 2026 Candidate Tracker — https://georgetowner.com/articles/2026/05/12/dc-mayor-race-2026-candidate-tracker/
- [2026-05-10] 51st — The state of the 2026 D.C. election (so far) — https://51st.news/2026-dc-election-mayor-ward-1/
- [2026-05-07] Washington Post — Anthony Williams endorses Kenyan McDuffie — https://www.washingtonpost.com/dc-md-va/2026/05/07/anthony-williams-endorses-kenyan-mcduffie-dc-mayor/
- [2026-04-27] City Cast DC — Charles Allen endorses Janeese Lewis George — https://dc.citycast.fm/dc-politics/charles-allen-endorses-janeese-lewis-george
- [2026-03-24] WJLA — Maryland Sen. Alsobrooks endorses Kenyan McDuffie — https://wjla.com/news/local/kenyan-mcduffie-angela-alsobrooks-endorsement-mayor-senator-maryland-prince-georges-washingtonian-election-campaign-race-home-rule-politics
- [2026-05-18] Georgetown / FOX 5 — Upcoming televised mayoral debate (May 18, 2026) — https://www.georgetown.edu/news/georgetown-fox-5-dc-2026-debate-democratic-mayoral-primary/
- [2026-05-07] HillRag — Mayoral Candidates Clash Over Utility Costs & Public Safety — https://www.hillrag.com/2026/05/07/mayoral-candidates-clash-over-utility-costs-public-safety-solutions/
- [2026-05-05] GW Hatchet — Democratic mayoral / delegate candidates debate DC issues — https://gwhatchet.com/2026/05/05/democratic-mayoral-delegate-candidates-debate-dc-issues-in-double-header-event/
- [2026-05-04] Georgetowner — 2026 Mayoral Forums & Debates guide — https://georgetowner.com/articles/2026/05/04/d-c-election-2026-the-georgetowners-guide-to-mayoral-forums-debates/
- [2026-05-01] GGWash — Endorsement: Janeese Lewis George for DC Mayor — https://ggwash.org/view/102464/ggwash-endorses-janeese-lewis-george-for-dc-mayor
- [2026-05-08] The DC Line — Jonetta Rose Barras: Who among DC's mayoral candidates can help the city? — https://thedcline.org/2026/05/08/jonetta-rose-barras-who-among-dcs-mayoral-candidates-can-help-the-city-fulfill-its-potential-part-2/
- [2026-05-01] Axios DC — Endorsements for Janeese Lewis George and Kenyan McDuffie — https://www.axios.com/local/washington-dc/2026/05/01/dc-mayor-race-janeese-lewis-george-kenyan-mcduffie
- [2026-04-ongoing] WTOP — Mayoral debate coverage — https://wtop.com/dc/2026/04/kenyan-mcduffie-and-janeese-lewis-george-go-toe-to-toe-in-dc-mayoral-debate/
- [2026-03-08] Washington Post — Lewis George vs. McDuffie distinct styles — https://www.washingtonpost.com/dc-md-va/2026/03/08/dc-mayors-race-mcduffie-lewis-george-styles/
- [2026-03-03] Washington Post — McDuffie aims to make DC "most affordable" — https://www.washingtonpost.com/dc-md-va/2026/03/03/dc-mayoral-election-mcduffie/
- [ongoing] Fox 5 DC — Full mayoral candidate list — https://www.fox5dc.com/news/candidates-running-dc-mayor-june-primary-election-2026
- [ongoing] Wikipedia — 2026 Washington DC mayoral election — https://en.wikipedia.org/wiki/2026_Washington,_D.C.,_mayoral_election

### U.S. House Delegate 2026
- [2026-05-22] Axios DC — How DC's next delegate would handle Trump (Robert White vs. Brooke Pinto on federal pressure; added to both candidates' news[]) — https://www.axios.com/local/washington-dc/2026/05/22/delegate-election-robert-white-brooke-pinto
- [2026-ongoing] NOTUS — Delegate candidate fundraising race — https://www.notus.org/money/dc-delegate-candidates-election-2026-brooke-pinto-robert-white-kinney-zalesne
- [2026-ongoing] NOTUS — Pinto-White doxxing controversy — https://www.notus.org/money/dc-delegate-brooke-pinto-robert-white-kinney-zalesne
- [2026-04-30] HillRag — Who is running for Delegate — https://www.hillrag.com/2026/04/30/who-is-running-for-nomination-as-dc-delegate-in-the-democratic-primary/
- [ongoing] Wikipedia — 2026 DC Delegate election — https://en.wikipedia.org/wiki/2026_United_States_House_of_Representatives_election_in_the_District_of_Columbia

### DC Council At-Large (Bonds seat) 2026
- [2026-05-10] 51st — Meet the candidates for an At-Large seat on the DC Council — https://51st.news/at-large-candidates-dc-council-anita-bonds/
- [2026-02-26] WAMU — Ranked choice voting could make at-large race DC's most unpredictable — https://wamu.org/story/26/02/26/ranked-choice-voting-could-make-race-for-anita-bonds-at-large-seat-d-c-s-most-unpredictable/
- [ongoing] Lisa Raymond campaign — https://lisaraymondfordc.com/
- [2026-05-01] East of the River — Who is running for At-Large Councilmember — https://eastoftheriverdcnews.com/2026/05/01/who-is-running-for-the-democratic-nomination-for-at-large-councilmember/
- [ongoing] vote4oye.com — Oye Owolewa campaign — https://www.vote4oye.com/
- [ongoing] Sierra Club DC — endorsements — https://www.sierraclub.org/dc/sierra-club-endorses-oye-owolewa-and-elissa-silverman-dc-council-large-rashida-brown-and-aparna-raj
- [ongoing] Dwight Davis campaign (added run 13; educator / DCPS community leader) — https://www.dwight4dccouncil.com/
- [ongoing] Dyana N.M. Forester campaign (added run 13; past president, Metro Washington Council AFL-CIO) — https://www.dyanafordc.com/
- [ongoing] Fred Hill campaign (added run 13; small-business owner, ex-chair DC Board of Zoning Adjustment) — https://www.fredhill4dc.com/
- [ongoing] Greg Jackson campaign (added run 13; gun-violence-prevention advocate) — https://www.jacksonfordc.com/

### DC Council Ward 1 2026
- [2026-03-29] Greater Greater Washington — Ward 1 primary poll (Raj 42%, Brown 25%, Deramo 16%) — https://ggwash.org/view/103003/we-polled-ward-1-on-dc-council-primary-race
- [2026-04-01] Greater Greater Washington — 2026 DC Council endorsements (Raj W1, Raymond At-Large, Parker W5, Allen W6) — https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements
- [2026-05-10] 51st — State of the 2026 DC election: Ward 1 + mayor overview — https://51st.news/2026-dc-election-mayor-ward-1/
- [2026-ongoing] 51st.news — Ward 1 candidate profiles — https://51st.news/ward-1-dc-council-primary-election-candidates-2026/
- [2026-ongoing] Washington Blade — Brian Footer candidacy announcement — https://www.washingtonblade.com/2025/07/10/brian-footer-announces-candidacy-ward-1-dc-council/
- [ongoing] Greater Greater Washington — Ward 1 poll — https://ggwash.org/view/103003/we-polled-ward-1-on-dc-council-primary-race

### DC Council Ward 6 2026
- [2026-05-08] HillRag — Ward 6 race: a study in contrasts — https://www.hillrag.com/2026/05/08/the-ward-6-council-race-a-study-in-contrasts/
- [2026-04-30] HillRag — Who is running for Ward 6 Council — https://www.hillrag.com/2026/04/30/who-is-running-for-ward-6-council/

### Council Ward 5 2026
- [2026-ongoing] Wikipedia — 2026 DC Council elections (Ward 5 candidates incl. Carmichael challenger) — https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election

### Shadow Senator / Shadow Representative 2026
- [2026-ongoing] Ballotpedia — 2026 DC Shadow Senator (Strauss vs. Batchelor vs. Winfield-Dean) — https://ballotpedia.org/United_States_Senate_election_in_the_District_of_Columbia,_2026
- [2026-ongoing] Wikipedia — 2026 DC Shadow Representative (Garcia) — https://en.wikipedia.org/wiki/2026_United_States_Shadow_Representative_election_in_the_District_of_Columbia

### Attorney General 2026
- [2026-ongoing] Wikipedia — 2026 DC Attorney General election (Schwalb vs. Szymkowicz) — https://en.wikipedia.org/wiki/2026_District_of_Columbia_Attorney_General_election

### Council Chair 2026
- [ongoing] Mendelson for Chairman 2026 — campaign site (backs Mendelson "running for re-election" note in officials.ts) — https://mendelson2026.com
- [2026-04-20] Georgetowner — Jack Evans withdraws from D.C. Council Chair race after DCBOE rejection — https://georgetowner.com/articles/2026/04/20/evans-withdraws-from-d-c-council-chair-race/
- [2026-01-28] HillRag — Evans Announces Run for DC Council Chair — https://www.hillrag.com/2026/01/28/evans-announces-run-for-dc-council-chair/
- [2026-01-27] Washington Post — Jack Evans, who resigned from D.C. Council, to run for chairman — https://www.washingtonpost.com/dc-md-va/2026/01/27/jack-evans-dc-council-chairman/

### Ward 8 (Trayon White)
- [2026-02-15] Washington Times — Trayon White bribery trial pushed back to Sept 14, 2026 (backs trial-date addition in officials.ts) — https://www.washingtontimes.com/news/2026/feb/15/dc-council-member-trayon-white-bribery-trial-pushed-back-september/
- [2026-02-ongoing] WUSA9 — Bribery trial pushed back after White hires new legal team — https://www.wusa9.com/article/news/crime/councilmember-trayon-white-federal-bribery-trial-pushed-back-after-he-hires-new-legal-team/65-71db07f6-7214-4203-a7db-4018a28f3e75

### Council At-Large special (McDuffie seat)
- [2026-04-30] HillRag — Who is running in the At-Large special election — https://www.hillrag.com/2026/04/30/who-is-running-in-the-at-large-special-election/

### All races overview
- [2026-ongoing] Greater Greater Washington — 2026 elections hub — https://ggwash.org/elections/2026
- [2026-ongoing] Greater Greater Washington — DC Council Democratic primary endorsements — https://ggwash.org/view/103101/our-2026-dc-council-democratic-primary-endorsements
- [2026-ongoing] Wikipedia — 2026 Council of DC election — https://en.wikipedia.org/wiki/2026_Council_of_the_District_of_Columbia_election
- [2026-ongoing] ArentFox Schiff — DC 2026 election overview — https://www.afslaw.com/perspectives/alerts/district-columbia-2026-election-overview

### Prior announcements (already in data files)
- [2026-01-26] Eleanor Holmes Norton — ends 2026 reelection bid after 18 terms — https://www.npr.org/2026/01/26/g-s1-107327/eleanor-holmes-norton-ending-reelection-campaign
- [2025-11-25] Mayor Muriel Bowser — announces will not seek fourth term — https://www.washingtonpost.com/dc-md-va/2025/11/25/bowser-dc-mayor-reelection/

---

## Local News

- [2026-05-21] GW Today (George Washington University) — "GW Hosts Forum for 2026 D.C. Mayoral Candidates" (Lewis George, Goodweather, Johnson, Orange, Sampath at Jack Morton Auditorium; moderated by Steven Roberts) — https://gwtoday.gwu.edu/gw-hosts-forum-2026-dc-mayoral-candidates
- [2026-03-19] Washingtonian — Stop DC CAMERA Act passes House committee 21-19 — https://washingtonian.com/2026/03/19/dc-traffic-camera-ban-passes-a-committee-vote-in-the-house/
- [2026-03-19] DC News Now — House committee advances bill to ban DC traffic cameras — https://www.dcnewsnow.com/news/local-news/washington-dc/house-committee-advances-bill-to-ban-dc-traffic-cameras-restrictions-on-right-turns/
- [2026-03-19] WTOP — House panel gives green light to bill to eliminate DC cameras — https://wtop.com/liveblog-today-on-the-hill/2026/03/house-panel-gives-green-light-to-bill-to-eliminate-dc-traffic-cameras/
- [2026-ongoing] New America — DC eviction filings June 2025 through February 2026 — https://www.newamerica.org/insights/an-update-on-dc-evictions-june-2025-through-february-2026/
- [2026-01-15] Planetizen/USDOT — USDOT formally proposes banning DC automated traffic cameras — https://www.planetizen.com/news/2026/01/136708-usdot-formally-moves-ban-dc-traffic-cameras
- [2025-12-18] HillRag — Jeffrey Carroll appointed MPD Interim Chief — https://www.hillrag.com/2025/12/18/jeffrey-carroll-appointed-mpd-interim-chief/
- [2026-05-08] The DC Line — Mayoral candidate analysis — https://thedcline.org/
- [ongoing] 51st.news — DC political news — https://51st.news/
- [ongoing] HillRag — Capitol Hill/Ward 6 news — https://www.hillrag.com/
- [ongoing] East of the River DC News — https://eastoftheriverdcnews.com/
- [ongoing] WJLA — Local DC political coverage — https://wjla.com/
- [ongoing] DCist — https://dcist.com/
- [ongoing] WAMU 88.5 — https://wamu.org/
- [ongoing] Washington City Paper — https://washingtoncitypaper.com/
- [ongoing] The DC Line — https://thedcline.org/

---

## Federal & National

- [2026-02-18] Congress.gov — 119th Congress H.J.Res.142 full text — https://www.congress.gov/bill/119th-congress/house-joint-resolution/142/text
- [ongoing] Congress.gov — 119th Congress search — https://www.congress.gov/search?q=%7B%22congress%22%3A%22119%22%2C%22source%22%3A%22legislation%22%7D

---

## Reference & Background

- [2026-05-25] ACLU-DC — How to Vote in the June 2026 DC Primary Election (confirms early voting June 8–14, 8:30am–7pm; same-day registration; mail/drop-box deadlines) — https://www.acludc.org/how-to-vote-in-the-june-2026-dc-primary-election/
- [2026-05-25] WJLA — 2026 Election Guide: everything DC voters need to know ahead of the two June 16 elections — https://wjla.com/news/elections/dc-june-primary-special-election-deadlines-ranked-choice-voting-mail-ballots-candidates-mayoral-at-large-council-attorney-general
- [ongoing] ACLU-DC Home Rule explainer — https://www.acludc.org/news/dc-home-rule-what-it-how-it-works-and-why-it-matters/
- [ongoing] UCSB Presidency Project — https://www.presidency.ucsb.edu/
- [ongoing] DCBOE — find polling place — https://www.dcboe.org/voters/where-to-vote/voting-locations-on-election-day
- [ongoing] DCBOE — mail-in ballot request — https://www.dcboe.org/voters/in-person-mail-in-voting/by-mail
- [ongoing] DCBOE — check voter registration — https://www.dcboe.org/voters/register-to-vote/check-voter-registration-status

---

## Archive (sources removed from site but preserved here)

_Sources that appeared in earlier data file versions but have since been superseded or removed._

_(none yet)_
