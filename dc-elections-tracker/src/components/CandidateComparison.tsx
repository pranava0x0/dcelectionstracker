import Link from "next/link";
import {
  COMPARABLE_ISSUES,
  COMPARISON_RACE_SLUGS,
  ISSUE_COLUMN_TAGLINES,
  candidatesForRace,
  getRaceBySlug,
  type Candidate,
  type ComparableIssueSlug,
} from "@/data/elections";
import { getIssueBySlug } from "@/data/issues";
import { partyTone } from "@/lib/party";

function issueTitle(slug: ComparableIssueSlug): string {
  return getIssueBySlug(slug)?.title ?? slug;
}

function positionCount(candidates: Candidate[], slug: ComparableIssueSlug): number {
  return candidates.filter((c) => c.positions?.[slug]).length;
}

function CandidatePositionCard({
  candidate,
  slug,
}: {
  candidate: Candidate;
  slug: ComparableIssueSlug;
}): JSX.Element {
  const tone = partyTone(candidate.party);
  const position = candidate.positions?.[slug];
  return (
    <article className="flex h-full flex-col border-t-2 border-rule bg-paper p-4">
      <header className="flex items-baseline gap-2">
        <span
          className={
            "inline-block rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider " +
            tone.pill
          }
          title={candidate.party === "TBD" ? "Party not yet declared" : candidate.party}
        >
          {tone.label}
        </span>
        <h4 className="display text-base text-ink">{candidate.name}</h4>
        {candidate.incumbent ? (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
            incumbent
          </span>
        ) : null}
      </header>
      {position ? (
        <p className="mt-3 text-sm leading-snug text-fg">
          {position.stance}
          <a
            href={position.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 align-super font-mono text-[10px] font-bold text-primary hover:opacity-80"
            aria-label={`Source: ${position.sourceLabel}`}
            title={position.sourceLabel}
          >
            [src]
          </a>
        </p>
      ) : (
        <p className="mt-3 text-sm italic leading-snug text-subtle">No position stated</p>
      )}
    </article>
  );
}

function RaceCompareBlock({ raceSlug }: { raceSlug: string }): JSX.Element | null {
  const race = getRaceBySlug(raceSlug);
  if (!race) return null;
  const candidates = candidatesForRace(raceSlug);
  if (candidates.length === 0) return null;

  return (
    <section className="mt-8">
      <header>
        <h3 className="display text-xl text-ink sm:text-2xl">{race.office}</h3>
        <p className="mt-1 text-sm text-fg">
          {candidates.length} declared candidate{candidates.length === 1 ? "" : "s"} · tap an
          issue to compare positions
        </p>
      </header>
      <ul className="mt-4 grid grid-cols-1 gap-3">
        {COMPARABLE_ISSUES.map((slug) => {
          const populated = positionCount(candidates, slug);
          return (
            <li key={slug} className="border border-rule bg-paper">
              <details className="group">
                <summary className="flex cursor-pointer items-baseline justify-between gap-3 p-4 hover:bg-bg">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                    <span className="display text-base text-ink">{issueTitle(slug)}</span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                      {ISSUE_COLUMN_TAGLINES[slug]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-subtle">
                      {populated}/{candidates.length} stated
                    </span>
                    <span aria-hidden className="transition-transform group-open:rotate-180">
                      ↓
                    </span>
                  </div>
                </summary>
                <div className="border-t border-rule bg-bg p-3 sm:p-4">
                  <ul className="grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
                    {candidates.map((c) => (
                      <li key={`${slug}-${c.name}`}>
                        <CandidatePositionCard candidate={c} slug={slug} />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 text-right">
                    <Link
                      href={`/issues/${slug}/`}
                      className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted hover:text-primary"
                    >
                      Read the {issueTitle(slug).toLowerCase()} brief →
                    </Link>
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function CandidateComparison(): JSX.Element {
  return (
    <div className="mt-5">
      <p className="max-w-3xl text-sm text-fg sm:text-[15px]">
        Side-by-side candidate positions for three open races. Issues mirror the site&apos;s
        six issue pages — tap a header to read the full brief. Each position is{" "}
        <span className="font-semibold">sourced from the candidate&apos;s own words</span> —
        website, press release, debate quote, or candidate questionnaire. Where a candidate
        hasn&apos;t taken a public position, the cell reads &ldquo;No position stated&rdquo;
        — we don&apos;t infer.
      </p>
      {COMPARISON_RACE_SLUGS.map((slug) => (
        <RaceCompareBlock key={slug} raceSlug={slug} />
      ))}
    </div>
  );
}
