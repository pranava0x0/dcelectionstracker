import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  COMPARABLE_ISSUES,
  ISSUE_COLUMN_TAGLINES,
  PROFILED_RACE_SLUGS,
  candidatesForRace,
  getCandidateBySlug,
  getRaceBySlug,
  type ComparableIssueSlug,
} from "@/data/elections";
import { getIssueBySlug } from "@/data/issues";
import { partyTone } from "@/lib/party";

type Params = { race: string; candidate: string };

export async function generateStaticParams(): Promise<Params[]> {
  return PROFILED_RACE_SLUGS.flatMap((race) =>
    candidatesForRace(race).map((c) => ({ race, candidate: c.slug })),
  );
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: Params }): Metadata {
  const c = getCandidateBySlug(params.candidate);
  const race = getRaceBySlug(params.race);
  if (!c || !race || c.raceSlug !== race.slug) {
    return { title: "Candidate not found — DC Elections Tracker", description: "" };
  }
  return {
    title: `${c.name} — ${race.office} — DC Elections Tracker`,
    description: `Declared candidate for ${race.office} on the June 16, 2026 DC primary ballot.`,
  };
}

function issueTitle(slug: ComparableIssueSlug): string {
  return getIssueBySlug(slug)?.title ?? slug;
}

type LinkEntry = { label: string; url: string };

function externalLinksFor(candidate: ReturnType<typeof getCandidateBySlug>): LinkEntry[] {
  if (!candidate) return [];
  const links: LinkEntry[] = [];
  if (candidate.websiteUrl) links.push({ label: "Campaign site", url: candidate.websiteUrl });
  if (candidate.ocfUrl) links.push({ label: "DC OCF — campaign finance", url: candidate.ocfUrl });
  if (candidate.dcboeUrl) links.push({ label: "DCBOE filing", url: candidate.dcboeUrl });
  // Always include the announcement source as the last link.
  links.push({ label: candidate.source.label, url: candidate.source.url });
  return links;
}

export default function CandidateProfilePage({ params }: { params: Params }): JSX.Element {
  const candidate = getCandidateBySlug(params.candidate);
  const race = getRaceBySlug(params.race);
  if (!candidate || !race || candidate.raceSlug !== race.slug) notFound();

  const tone = partyTone(candidate.party);
  const sameRace = candidatesForRace(race.slug);
  const links = externalLinksFor(candidate);
  const statedIssues = COMPARABLE_ISSUES.filter((slug) => candidate.positions?.[slug]);

  return (
    <article className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
        <Link href="/elections/" className="hover:text-primary">
          2026 races
        </Link>{" "}
        <span aria-hidden>›</span>{" "}
        <Link href={`/elections/${race.slug}/`} className="hover:text-primary">
          {race.office}
        </Link>{" "}
        <span aria-hidden>›</span> {candidate.name}
      </p>

      <h1 className="display-tight mt-3 text-3xl text-ink sm:text-4xl lg:text-5xl">
        {candidate.name}
      </h1>
      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <span
          className={
            "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider " +
            tone.pill
          }
        >
          {tone.label} · {candidate.party}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          {candidate.incumbent ? "Incumbent · " : ""}
          {candidate.filingStatus} candidate for {race.office}
        </span>
      </div>
      {candidate.notes ? (
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-fg sm:text-[17px]">{candidate.notes}</p>
      ) : null}

      <hr className="mt-6 rule-thick sm:mt-8" />

      <section className="mt-8 sm:mt-10">
        <span className="kicker">Find them online</span>
        <h2 className="display mt-1 text-xl text-ink sm:text-2xl">Links &amp; filings</h2>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {links.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover block px-4 py-3 text-sm text-fg hover:text-primary"
              >
                {l.label} <span aria-hidden className="text-subtle">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {candidate.bio ? (
        <section className="mt-8 sm:mt-12 lg:mt-14">
          <hr className="rule-thick" />
          <span className="kicker mt-3 inline-block">Bio</span>
          <h2 className="display mt-1 text-xl text-ink sm:text-2xl">Background</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-fg sm:text-[17px]">
            {candidate.bio}
          </p>
        </section>
      ) : null}

      <section className="mt-8 sm:mt-12 lg:mt-14">
        <hr className="rule-thick" />
        <span className="kicker mt-3 inline-block">Positions</span>
        <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">
          Stated positions on the site&apos;s six issue pages
        </h2>
        {statedIssues.length === 0 ? (
          <p className="mt-4 max-w-3xl text-base italic leading-relaxed text-subtle sm:text-[17px]">
            No positions stated yet on tracked issues. The data-refresh skill will populate
            this section as the candidate publishes a platform or speaks at forums.
          </p>
        ) : null}
        <ul className="mt-5 space-y-4">
          {COMPARABLE_ISSUES.map((slug) => {
            const pos = candidate.positions?.[slug];
            return (
              <li key={slug} className="border-l-2 border-rule pl-4 sm:pl-5">
                <div className="flex items-baseline justify-between gap-3">
                  <Link
                    href={`/issues/${slug}/`}
                    className="display text-base text-ink hover:text-primary sm:text-lg"
                  >
                    {issueTitle(slug)}
                  </Link>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
                    {ISSUE_COLUMN_TAGLINES[slug]}
                  </span>
                </div>
                {pos ? (
                  <p className="mt-2 text-base leading-relaxed text-fg sm:text-[17px]">
                    {pos.stance}{" "}
                    <a
                      href={pos.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted hover:text-primary"
                    >
                      [{pos.sourceLabel} ↗]
                    </a>
                  </p>
                ) : (
                  <p className="mt-2 text-sm italic leading-relaxed text-subtle">
                    No position stated
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8 sm:mt-12 lg:mt-14">
        <hr className="rule-thick" />
        <span className="kicker mt-3 inline-block">Race</span>
        <h2 className="display mt-1 text-xl text-ink sm:text-2xl">
          Other candidates for {race.office}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {sameRace
            .filter((c) => c.slug !== candidate.slug)
            .map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/elections/${race.slug}/${c.slug}/`}
                  className="inline-flex items-center gap-2 rounded-sm border border-rule bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-fg hover:border-primary hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
        </ul>
        <div className="mt-5">
          <Link
            href={`/elections/${race.slug}/`}
            className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:opacity-80"
          >
            ← Back to {race.office} race overview
          </Link>
        </div>
      </section>
    </article>
  );
}
