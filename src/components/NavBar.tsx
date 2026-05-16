import Link from "next/link";
import { issues } from "@/data/issues";
import { PROFILED_RACE_SLUGS, getRaceBySlug } from "@/data/elections";

// BL-47 + nav popouts: Primary nav is just 2 items — Issues (index page
// for all 7 issue briefs) and Elections (the voter hub: lookup, officials,
// races, comparison). At sm+ each trigger reveals a CSS-only hover popout
// that lists the brief/race links underneath, so a mouse user never has to
// load the intermediate index page to jump straight to what they want.
// At mobile the popouts stay hidden (the stacked nav is too narrow), and
// the trigger Link still navigates to the index page on tap — so touch
// users get the BL-47 behavior unchanged.

const profiledRaces = PROFILED_RACE_SLUGS.map((slug) => {
  const race = getRaceBySlug(slug);
  if (!race) throw new Error(`PROFILED_RACE_SLUGS references unknown race: ${slug}`);
  return race;
});

const triggerClass =
  "block whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70 transition-colors hover:text-white sm:py-3 sm:text-xs";

// Popout panel: hidden on mobile entirely, shown at sm+ when the group is
// hovered OR has keyboard focus inside it. Positioned `top-full` so it
// abuts the trigger row (no hover gap), `mt-0` so the mouse can travel
// from trigger into popout without losing :hover.
const popoutClass =
  "hidden sm:group-hover:block sm:group-focus-within:block sm:absolute sm:left-0 sm:top-full sm:z-40 sm:border sm:border-rule sm:bg-paper sm:text-fg sm:shadow-xl";

const popoutItemClass =
  "block px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg transition-colors hover:bg-bg hover:text-primary";

const popoutKickerClass =
  "block px-4 pt-3 pb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted";

export function NavBar(): JSX.Element {
  return (
    <header className="sticky top-0 z-30 bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-5 sm:py-0">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 sm:py-3"
        >
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-primary animate-pulseDot"
          />
          <span className="display whitespace-nowrap text-sm font-extrabold tracking-tight text-white sm:text-base">
            DC ELECTIONS TRACKER
          </span>
        </Link>
        <nav
          className="flex items-center gap-4 sm:ml-auto sm:gap-5"
          aria-label="Primary"
        >
          <div className="group relative sm:py-0">
            <Link
              href="/issues/"
              className={triggerClass}
              aria-haspopup="true"
            >
              Issues
            </Link>
            <div className={popoutClass + " sm:w-72"} role="menu">
              <span className={popoutKickerClass}>The 2026 brief</span>
              {issues.map((issue) => (
                <Link
                  key={issue.slug}
                  href={`/issues/${issue.slug}/`}
                  className={popoutItemClass}
                  role="menuitem"
                >
                  {issue.title}
                </Link>
              ))}
              <Link
                href="/issues/"
                className={
                  popoutItemClass +
                  " border-t border-rule text-primary hover:text-primary"
                }
                role="menuitem"
              >
                All {issues.length} briefs →
              </Link>
            </div>
          </div>

          <div className="group relative sm:py-0">
            <Link
              href="/elections/"
              className={triggerClass}
              aria-haspopup="true"
            >
              Elections
            </Link>
            <div className={popoutClass + " sm:w-80"} role="menu">
              <span className={popoutKickerClass}>Who&apos;s in office</span>
              <Link
                href="/officials/"
                className={popoutItemClass}
                role="menuitem"
              >
                Officials directory
              </Link>
              <span className={popoutKickerClass}>Profiled races</span>
              {profiledRaces.map((race) => (
                <Link
                  key={race.slug}
                  href={`/elections/${race.slug}/`}
                  className={popoutItemClass}
                  role="menuitem"
                >
                  {race.office}
                </Link>
              ))}
              <Link
                href="/elections/#races"
                className={
                  popoutItemClass +
                  " border-t border-rule text-primary hover:text-primary"
                }
                role="menuitem"
              >
                All 12 races →
              </Link>
              <Link
                href="/elections/#lookup"
                className={popoutItemClass + " text-primary hover:text-primary"}
                role="menuitem"
              >
                What&apos;s on your ballot →
              </Link>
            </div>
          </div>

          <a
            href="https://www.dcboe.org/voters/register-to-vote"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto whitespace-nowrap rounded-sm bg-primary px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary-fg transition-opacity hover:opacity-90 sm:ml-0"
          >
            Are you registered?
          </a>
        </nav>
      </div>
      <div className="h-px w-full bg-primary" aria-hidden />
    </header>
  );
}
