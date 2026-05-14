import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  COMPARABLE_ISSUES,
  ISSUE_COLUMN_TAGLINES,
  PROFILED_RACE_SLUGS,
  RACE_STATUS_LABEL,
  candidatesForRace,
  externalToolsForRace,
  getRaceBySlug,
  type Candidate,
  type ComparableIssueSlug,
} from "@/data/elections";
import { getIssueBySlug } from "@/data/issues";
import { partyTone } from "@/lib/party";

type Params = { race: string };

export async function generateStaticParams(): Promise<Params[]> {
  return PROFILED_RACE_SLUGS.map((race) => ({ race }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { race: raceSlug } = await params;
  const race = getRaceBySlug(raceSlug);
  if (!race) return { title: "Race not found — DC Elections Tracker", description: "" };
  return {
    title: `${race.office} — 2026 DC primary — DC Elections Tracker`,
    description: race.oneLine,
  };
}

function issueTitle(slug: ComparableIssueSlug): string {
  return getIssueBySlug(slug)?.title ?? slug;
}

function PositionCell({ candidate, slug }: { candidate: Candidate; slug: ComparableIssueSlug }): JSX.Element {
  const position = candidate.positions?.[slug];
  if (!position) {
    return <p className="text-sm italic leading-snug text-subtle">No position stated</p>;
  }
  return (
    <p className="text-sm leading-snug text-fg">
      {position.stance}
      <a
        href={position.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 align-super font-mono text-[10px] font-bold text-primary hover:opacity-80"
        title={position.sourceLabel}
      >
        [src]
      </a>
    </p>
  );
}

export default async function RacePage({ params }: { params: Promise<Params> }): Promise<JSX.Element> {
  const { race: raceSlug } = await params;
  const race = getRaceBySlug(raceSlug);
  if (!race) notFound();
  const candidates = candidatesForRace(race.slug);
  const tools = externalToolsForRace(race.slug);
  // BL-46: surface the current officeholder as a factual note when they're in the race,
  // instead of relying on the race-level status pill to imply incumbency.
  const incumbent = candidates.find((c) => c.incumbent);

  return (
    <article className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
        <Link href="/elections/" className="hover:text-primary">
          2026 races
        </Link>{" "}
        <span aria-hidden>·</span> {RACE_STATUS_LABEL[race.status]}
      </p>
      <h1 className="display-tight mt-3 text-3xl text-ink sm:text-4xl lg:text-5xl">{race.office}</h1>
      {race.status === "includes-incumbent" && incumbent ? (
        <p className="mt-3 max-w-3xl text-sm text-fg sm:text-[15px]">
          Current officeholder:{" "}
          <Link
            href={`/elections/${race.slug}/${incumbent.slug}/`}
            className="text-ink underline decoration-rule decoration-2 underline-offset-4 hover:decoration-primary"
          >
            {incumbent.name}
          </Link>{" "}
          ({incumbent.party}) — also declared in this race.
        </p>
      ) : null}
      <p className="mt-3 max-w-3xl text-lg font-medium leading-snug text-primary sm:mt-4 sm:text-xl">
        {race.oneLine}
      </p>
      <hr className="mt-6 rule-thick sm:mt-8" />

      <section className="mt-8 sm:mt-10">
        <span className="kicker">Candidates</span>
        <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">
          {candidates.length} declared candidate{candidates.length === 1 ? "" : "s"}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-fg">
          Listed alphabetically. Tap a candidate to see their full profile, links to OCF /
          DCBOE filings, and stated positions on the site&apos;s six issue pages.
        </p>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((c) => {
            const tone = partyTone(c.party);
            return (
              <li key={c.slug}>
                <Link
                  href={`/elections/${race.slug}/${c.slug}/`}
                  className="card card-hover block h-full p-4"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="display text-base text-ink">{c.name}</span>
                    <span
                      className={
                        "inline-flex h-5 min-w-[20px] items-center justify-center rounded-sm px-1.5 font-mono text-[10px] font-bold uppercase tracking-wider " +
                        tone.pill
                      }
                      title={c.party}
                    >
                      {tone.label}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {c.incumbent ? "Incumbent · " : ""}
                    {c.filingStatus}
                  </div>
                  {c.notes ? <p className="mt-3 text-sm leading-snug text-fg">{c.notes}</p> : null}
                  <div className="mt-3 font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                    View profile <span aria-hidden>→</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8 sm:mt-12 lg:mt-14">
        <hr className="rule-thick" />
        <span className="kicker mt-3 inline-block">Positions</span>
        <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">Issue-by-issue comparison</h2>
        <p className="mt-2 max-w-3xl text-sm text-fg">
          One candidate per row, six issue columns mirroring the site&apos;s issue pages.
          Cells without a stated position read &ldquo;No position stated&rdquo; — we
          don&apos;t infer.
        </p>
        {/* Mobile + tablet (< lg): one <details> per candidate listing every
            issue position inside. The 7-column comparison table needs ≥1024px
            to display without horizontal scroll (UAT-012); at 768px it
            overflows the content container. */}
        <ul className="mt-5 space-y-3 lg:hidden">
          {candidates.map((c) => {
            const tone = partyTone(c.party);
            const statedCount = COMPARABLE_ISSUES.filter((slug) => c.positions?.[slug]).length;
            return (
              <li key={c.slug} className="border border-rule bg-paper">
                <details className="group">
                  <summary className="flex cursor-pointer items-baseline justify-between gap-3 p-3">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={
                          "inline-flex h-5 min-w-[20px] items-center justify-center rounded-sm px-1.5 font-mono text-[10px] font-bold uppercase tracking-wider " +
                          tone.pill
                        }
                      >
                        {tone.label}
                      </span>
                      <Link
                        href={`/elections/${race.slug}/${c.slug}/`}
                        className="display text-sm text-ink underline decoration-rule decoration-2 underline-offset-4"
                      >
                        {c.name}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-subtle">
                        {statedCount}/{COMPARABLE_ISSUES.length} stated
                      </span>
                      <span aria-hidden className="transition-transform group-open:rotate-180">
                        ↓
                      </span>
                    </div>
                  </summary>
                  <ul className="border-t border-rule">
                    {COMPARABLE_ISSUES.map((slug) => (
                      <li key={slug} className="border-b border-border p-4 last:border-b-0">
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/issues/${slug}/`}
                            className="display text-sm text-ink hover:text-primary"
                          >
                            {issueTitle(slug)}
                          </Link>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
                            {ISSUE_COLUMN_TAGLINES[slug]}
                          </span>
                        </div>
                        <div className="mt-2">
                          <PositionCell candidate={c} slug={slug} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>

        {/* Desktop (>= lg): original side-by-side comparison table. */}
        <div className="mt-5 hidden overflow-x-auto border border-rule lg:block">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-bg">
              <tr>
                <th
                  scope="col"
                  className="border-b border-rule px-3 py-3 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-subtle"
                >
                  Candidate
                </th>
                {COMPARABLE_ISSUES.map((slug) => (
                  <th
                    key={slug}
                    scope="col"
                    className="border-b border-l border-rule px-3 py-3 text-left align-top"
                  >
                    <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-subtle">
                      <Link href={`/issues/${slug}/`} className="hover:text-primary">
                        {issueTitle(slug)}
                      </Link>
                    </div>
                    <div className="mt-1 font-mono text-[10px] normal-case tracking-normal text-muted">
                      {ISSUE_COLUMN_TAGLINES[slug]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => {
                const tone = partyTone(c.party);
                return (
                  <tr key={c.slug} className="bg-paper">
                    <th
                      scope="row"
                      className="border-b border-rule px-3 py-3 text-left align-top"
                    >
                      <div className="flex items-baseline gap-2">
                        <span
                          className={
                            "inline-flex h-5 min-w-[20px] items-center justify-center rounded-sm px-1 font-mono text-[10px] font-bold uppercase tracking-wider " +
                            tone.pill
                          }
                        >
                          {tone.label}
                        </span>
                        <Link
                          href={`/elections/${race.slug}/${c.slug}/`}
                          className="display text-sm text-ink hover:text-primary"
                        >
                          {c.name}
                        </Link>
                      </div>
                    </th>
                    {COMPARABLE_ISSUES.map((slug) => (
                      <td
                        key={`${c.slug}-${slug}`}
                        className="border-b border-l border-rule px-3 py-3 align-top"
                      >
                        <PositionCell candidate={c} slug={slug} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 sm:mt-12 lg:mt-14">
        <hr className="rule-thick" />
        <span className="kicker mt-3 inline-block">Other tools</span>
        <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">External voter guides for this race</h2>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tools.map((t) => (
            <li key={t.url}>
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover block px-4 py-3"
              >
                <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                  {t.label} <span aria-hidden>↗</span>
                </div>
                <p className="mt-1 text-sm leading-snug text-fg">{t.blurb}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
