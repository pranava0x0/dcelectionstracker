import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { IssueCard } from "@/components/IssueCard";
import { LatestCard } from "@/components/LatestCard";
import { issues } from "@/data/issues";
import { alerts } from "@/data/alerts";
import { PRIMARY_DATE, GENERAL_DATE, importantDates } from "@/data/elections";
import { path } from "@/lib/links";

const NUM_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
];

function timeUntilPrimaryHeadline(targetIso: string): string {
  const ms = new Date(targetIso).getTime() - Date.now();
  if (ms <= 0) return "The primary is here.";
  const days = Math.ceil(ms / (24 * 3600 * 1000));
  if (days < 7) return days === 1 ? "One day until the primary." : `${days} days until the primary.`;
  const weeks = Math.round(days / 7);
  const word = NUM_WORDS[weeks] ?? `${weeks}`;
  return `${word} ${weeks === 1 ? "week" : "weeks"} until the primary.`;
}

export default function HomePage(): JSX.Element {
  const upcomingDates = importantDates
    .filter((d) => new Date(d.iso).getTime() >= Date.now() - 24 * 3600 * 1000)
    .slice(0, 4);

  const today = new Date().toISOString().slice(0, 10);
  const latest = alerts.slice(0, 3);
  const primaryHeadline = timeUntilPrimaryHeadline(PRIMARY_DATE);

  return (
    <>
      <section>
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:pt-16">
          <div className="flex items-center gap-3 text-fg">
            <span className="kicker">Washington, DC · 2026</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">
              Updated {today}
            </span>
          </div>
          <h1 className="display-tight mt-4 max-w-5xl text-5xl text-ink sm:text-7xl">
            {primaryHeadline}{" "}
            <span className="text-primary">
              Here&apos;s what just happened to your city.
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-snug text-fg sm:text-xl">
            The mayor&apos;s seat is open for the first time since 2014. The U.S. House
            Delegate seat is open for the first time in 35 years. Four Council seats are
            on the ballot, plus the Council Chair, the Attorney General, two at-large
            seats — and ranked-choice voting debuts in the primary. Every numeric claim
            below links to a primary source.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={path("/elections/")}
              className="rounded-sm bg-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary-fg hover:opacity-90"
            >
              Are you registered?
            </Link>
            <Link
              href={path("/officials/")}
              className="rounded-sm border border-rule bg-paper px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-fg hover:bg-bg"
            >
              Who currently holds office →
            </Link>
          </div>

          <hr className="mt-12 rule-thick" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Countdown targetIso={PRIMARY_DATE} label="Until DC primary" />
            <Countdown targetIso={GENERAL_DATE} label="Until DC general" />
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {upcomingDates.map((d) => (
              <li key={d.iso} className="card flex items-baseline gap-3 px-4 py-3">
                <time
                  className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary"
                  dateTime={d.iso}
                >
                  {d.iso}
                </time>
                <span className="text-sm text-fg">{d.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <hr className="rule-thick" />
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
            <span className="kicker">Latest from DC</span>
            <Link
              href={path("/sources/")}
              className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted hover:text-primary"
            >
              All recent moves →
            </Link>
          </div>
          <h2 className="display mt-1 text-3xl text-ink sm:text-4xl">
            Three things that just changed
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {latest.map((a) => (
              <LatestCard key={`${a.date}-${a.headline}`} alert={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-6">
          <hr className="rule-thick" />
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
            <span className="kicker">The 2026 brief</span>
            <Link
              href={path("/sources/")}
              className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted hover:text-primary"
            >
              All sources →
            </Link>
          </div>
          <h2 className="display mt-1 text-3xl text-ink sm:text-4xl">
            Six issues on the 2026 ballot
          </h2>
          <p className="mt-2 max-w-3xl text-[15px] text-fg">
            Each issue page has four hero stats, what&apos;s at stake, who decides, the
            recent moves, and the questions to put to candidates.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {issues.map((i) => (
              <IssueCard key={i.slug} issue={i} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <hr className="rule-thick" />
          <span className="kicker mt-3 inline-block">Editorial standard</span>
          <h2 className="display mt-1 text-3xl text-ink">Where this site stands</h2>
          <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-fg">
            Independent. Non-partisan, but not neutral about transparency,
            accountability, and who pays. Every numeric claim links to a primary or
            authoritative source — DC Council, OCFO, MPD, OSSE, DCBOE, congress.gov,
            courts.gov, WMATA, BLS, Census. Officials are listed by ward and party
            label. Voting records, when added, are factual records, not endorsements.
            Bugs and missing facts go in{" "}
            <a
              href="https://github.com/pranava0x0/dcelectionstracker/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-primary text-primary hover:opacity-80"
            >
              the public issue tracker
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
