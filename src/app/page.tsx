import Link from "next/link";
import { AddressLookup } from "@/components/AddressLookup";
import { Countdown } from "@/components/Countdown";
import { IssueCard } from "@/components/IssueCard";
import { LatestCard } from "@/components/LatestCard";
import { issues } from "@/data/issues";
import { alerts } from "@/data/alerts";
import { PRIMARY_DATE, GENERAL_DATE, importantDates } from "@/data/elections";
import { timeUntilPrimaryHeadline } from "@/lib/headline";
import { BUILD_DATE } from "@/lib/build-date";

export default function HomePage(): JSX.Element {
  const upcomingDates = importantDates
    .filter((d) => new Date(d.iso).getTime() >= Date.now() - 24 * 3600 * 1000)
    .slice(0, 4);
  const latest = alerts.slice(0, 3);
  const primaryHeadline = timeUntilPrimaryHeadline(PRIMARY_DATE);
  // Surface today's milestone (registration deadline, early-voting open/close,
  // Election Day) as a banner. Self-clearing: no match → null → nothing renders.
  const todayMilestone = importantDates.find((d) => d.iso === BUILD_DATE) ?? null;

  return (
    <>
      <section>
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:pb-14 sm:pt-12 lg:pt-16">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-fg">
            <span className="kicker">Washington, DC · 2026</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">
              Updated {BUILD_DATE}
            </span>
          </div>
          <h1 className="display-tight mt-4 max-w-5xl text-4xl text-ink sm:text-5xl md:text-6xl lg:text-7xl">
            {primaryHeadline}{" "}
            <span className="text-primary">
              Here&apos;s what just happened to your city.
            </span>
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-snug text-fg sm:mt-6 sm:text-lg lg:text-xl">
            The mayor&apos;s seat is open for the first time since 2014. The U.S. House
            Delegate seat is open for the first time in 35 years. Four Council seats are
            on the ballot, plus the Council Chair, the Attorney General, two at-large
            seats — and ranked-choice voting debuts in the primary. Every numeric claim
            below links to a primary source.
          </p>

          {todayMilestone ? (
            <aside
              aria-label="Today's election milestone"
              className="card card-stripe-red mt-6 flex flex-col gap-1 px-4 py-3 sm:mt-8 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="kicker shrink-0">
                Today ·{" "}
                <time className="text-fg" dateTime={todayMilestone.iso}>
                  {todayMilestone.iso}
                </time>
              </span>
              <p className="text-sm leading-snug text-fg">
                {todayMilestone.label}
                {todayMilestone.source ? (
                  <>
                    {" "}
                    <a
                      href={todayMilestone.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-wider text-muted hover:text-primary"
                    >
                      {todayMilestone.source.label} ↗
                    </a>
                  </>
                ) : null}
              </p>
            </aside>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="https://www.dcboe.org/voters/register-to-vote/register-update-voter-registration"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm bg-primary px-4 py-3 text-center font-mono text-xs font-bold uppercase tracking-wider text-primary-fg hover:opacity-90 sm:py-2"
            >
              Are you registered?
            </a>
            <a
              href="https://dcgis.maps.arcgis.com/apps/instant/nearby/index.html?appid=763576faa0b1470ca0559c377cf3b497"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-rule bg-paper px-4 py-3 text-center font-mono text-xs font-bold uppercase tracking-wider text-fg hover:bg-bg sm:py-2"
            >
              Where do I vote? ↗
            </a>
            <a
              href="https://www.dcboe.org/voters/casting-your-vote/mail-ballot-request"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-rule bg-paper px-4 py-3 text-center font-mono text-xs font-bold uppercase tracking-wider text-fg hover:bg-bg sm:py-2"
            >
              Request a mail ballot ↗
            </a>
            <Link
              href="/officials/"
              className="rounded-sm border border-rule bg-paper px-4 py-3 text-center font-mono text-xs font-bold uppercase tracking-wider text-fg hover:bg-bg sm:py-2"
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

          <hr className="mt-12 rule-thick" />
          <span className="kicker mt-3 inline-block">Lookup</span>
          <h2 className="display mt-1 text-2xl text-ink sm:text-3xl lg:text-4xl">
            What&apos;s on your ballot?
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] text-fg">
            Enter your DC address to see your ward, the races on your June 16 primary
            ballot, and how your current Council member has voted on tracked bills.
          </p>
          <AddressLookup />
        </div>
      </section>

      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <hr className="rule-thick" />
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
            <span className="kicker">Latest from DC</span>
            <Link
              href="/sources/"
              className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted hover:text-primary"
            >
              All recent moves →
            </Link>
          </div>
          <h2 className="display mt-1 text-2xl text-ink sm:text-3xl lg:text-4xl">
            Three things that just changed
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
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
              href="/sources/"
              className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted hover:text-primary"
            >
              All sources →
            </Link>
          </div>
          <h2 className="display mt-1 text-2xl text-ink sm:text-3xl lg:text-4xl">
            Seven issues on the 2026 ballot
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] text-fg">
            Each issue page has four hero stats, what&apos;s at stake, who decides, the
            recent moves, and the questions to put to candidates.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {issues.map((i) => (
              <IssueCard key={i.slug} issue={i} />
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
