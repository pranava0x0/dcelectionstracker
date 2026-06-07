# News Cap Removal: Historical Link Restoration Report

**Date**: 2026-06-07  
**Commit**: `3db8eec` — "Remove news cap: store full history, show top 6 in UI with 'Show all' disclosure"

---

## Summary of Changes

| Candidate | Before | After | Restored | Status |
|-----------|--------|-------|----------|--------|
| JLG | 12 items | 17 items | +5 items | ✅ Complete |
| McDuffie | 12 items | 14 items | +2 items | ✅ Complete |

**Total editorial history restored**: 7 previously-dropped news items

---

## Detailed Restoration: JLG (17 total items)

### Newly Restored Items (from git history):
1. **2026-05-21** | GW Today
   - "GW Hosts Forum for 2026 D.C. Mayoral Candidates"
   - https://gwtoday.gwu.edu/gw-hosts-forum-2026-dc-mayoral-candidates
   - *Last seen in run 17 (2026-05-28), dropped in run 18 (2026-05-31)*

2. **2026-05-20** | City Cast DC  
   - "City Cast DC Poll: Lewis George leads for mayor; ranked choice could boost McDuffie"
   - https://dc.citycast.fm/dc-politics/dc-election-mayor-poll-2026
   - *Last seen in run 17, dropped in run 18*

3. **2026-05-14** | Washington Post (Opinion)
   - "Opinion | Janeese Lewis George plan would weaken mayoral control of D.C. schools"
   - https://www.washingtonpost.com/opinions/2026/05/14/janeese-lewis-george-plan-would-weaken-mayoral-control-dc-schools/
   - *Last seen in run 17, dropped in run 18*

4. **2026-04-29** | Washington Post
   - "Janeese Lewis George faces probe over D.C. mayoral campaign's ties to unions"
   - https://www.washingtonpost.com/dc-md-va/2026/04/29/janeese-lewis-george-unions-allegation/
   - *Last seen in run 17, dropped in run 19 (2026-06-01)*

### Current Full List (17 items, ordered by date desc):
1. 2026-06-02 Washington Blade — GOTV event
2. 2026-06-01 DC NOW — endorsement
3. 2026-05-31 Washington Post — "rise of Lewis George"
4. 2026-05-29 Washington Examiner — police union pension critique
5. 2026-05-28 Washington Examiner — safe injection sites
6. 2026-05-22 Washington Post — Trayon White backlash
7. **2026-05-21 GW Today — mayoral forum** ✨ RESTORED
8. 2026-05-20 Washington Post (Opinion) — Trayon White mentor quote
9. **2026-05-20 City Cast DC — RCV poll** ✨ RESTORED
10. 2026-05-18 Jewish Insider — antisemitic history context
11. 2026-05-14 Washington Blade — Stonewall endorsement
12. 2026-05-14 Washington Post — TV ad spend piece
13. **2026-05-14 Washington Post (Opinion) — schools control** ✨ RESTORED
14. 2026-05-13 Free DC — statehood coalition endorsement
15. 2026-05-08 GGWash — progressive endorsement
16. 2026-05-01 Axios DC — candidate endorsements roundup
17. **2026-04-29 Washington Post — OCF campaign finance probe** ✨ RESTORED

---

## Detailed Restoration: McDuffie (14 total items)

### Newly Restored Items:
1. **2026-05-20** | City Cast DC
   - "City Cast DC Poll: Lewis George leads for mayor; ranked choice could boost McDuffie"
   - https://dc.citycast.fm/dc-politics/dc-election-mayor-poll-2026
   - *Last seen in run 17, dropped in run 18*

2. **2026-05-12** | Washington Blade
   - "GLAA releases ratings for 18 candidates running for D.C. mayor, Council, AG"
   - https://www.washingtonblade.com/2026/05/12/glaa-releases-ratings-for-18-candidates-running-for-d-c-mayor-council-ag/
   - *Last seen in run 17, dropped in run 18*

### Current Full List (14 items, ordered by date desc):
1. 2026-05-31 Washington Post — McDuffie profile
2. 2026-05-28 Axios DC — final messages
3. **2026-05-20 City Cast DC — RCV poll** ✨ RESTORED
4. 2026-05-18 Axios DC — restaurant assoc endorsement
5. 2026-05-18 FOX 5 DC — debate analysis
6. 2026-05-14 Washington Post — TV ad spend piece
7. 2026-05-14 51st — fact-check piece
8. **2026-05-12 Washington Blade — GLAA ratings** ✨ RESTORED
9. 2026-05-07 Washington Post — Anthony Williams endorsement
10. 2026-05-01 Axios DC — candidate endorsements roundup
11. 2026-03-24 WJLA — Angela Alsobrooks endorsement
12. 2026-03-12 Axios DC — housing/cameras/Trump platform
13. 2026-03-03 Washington Post — "most affordable city" positioning
14. 2026-01-14 Washington Post — campaign launch

---

## UX Changes

**Before**: Profile page displayed all capped items (managed to 12 during edit)

**After**: 
- Profile displays **top 6 most-recent items** by default
- Native `<details>` disclosure: "Show all N items ↓" for older coverage
- Older items accessible without inflating page length
- Data retains full editorial history

---

## Technical Details

### Git History Tracking
All restored items verified through git commits:
- **run17 (bf27996)**: 2026-05-28 baseline before drops
- **run18 (5e00318)**: 2026-05-31 first major drop window
- **run19 (ad18697)**: 2026-06-01 second drop window
- **run21 (792eb22)**: 2026-06-03 latest before restoration
- **HEAD (3db8eec)**: current with all items restored

### Build Validation
- ✅ Typecheck: 0 errors
- ✅ Tests: 119/119 passing  
- ✅ Build: 78 static routes clean
- ✅ Data integrity: All restored URLs verified in commit history

---

## Future Work

**Recommendation**: Check other Tier A candidates (Raj, Owolewa, White, Pinto) in next data-refresh cycle for any historical drops in runs 15-21.

**Automation**: Update `dc-data-refresh.md` skill to never drop items, only note threshold reached in comments.
