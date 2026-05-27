import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DisclosureSection } from "@/components/DisclosureSection";
import { SocialIconRow } from "@/components/SocialIconRow";
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

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { race: raceSlug, candidate: candidateSlug } = await params;
  const c = getCandidateBySlug(candidateSlug);
  const race = getRaceBySlug(raceSlug);
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

// Reference links for the "About this candidate" disclosure. Campaign site,
// government site, socials, OCF, and DCBOE all render in the top link row
// (see SocialIconRow), so only the announcement-source citation is here.
function referenceLinksFor(candidate: ReturnType<typeof getCandidateBySlug>): LinkEntry[] {
  if (!candidate) return [];
  return [{ label: candidate.source.label, url: candidate.source.url }];
}

export default async function CandidateProfilePage({ params }: { params: Promise<Params> }): Promise<JSX.Element> {
  const { race: raceSlug, candidate: candidateSlug } = await params;
  const candidate = getCandidateBySlug(candidateSlug);
  const race = getRaceBySlug(raceSlug);
  if (!candidate || !race || candidate.raceSlug !== race.slug) notFound();

  const tone = partyTone(candidate.party);
  const sameRace = candidatesForRace(race.slug);
  const referenceLinks = referenceLinksFor(candidate);
  const statedIssues = COMPARABLE_ISSUES.filter((slug) => candidate.positions?.[slug]);
  const unstatedIssues = COMPARABLE_ISSUES.filter((slug) => !candidate.positions?.[slug]);
  const aboutMetaParts: string[] = [];
  if (candidate.bio) aboutMetaParts.push("Bio");
  aboutMetaParts.push("Source");
  const aboutMeta = aboutMetaParts.join(" · ");

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
      {/* Metadata + links collapsed onto one row: party pill + concise filing
          status + web, gov, socials, OCF, DCBOE. Wraps at narrow widths.
          Office name is in the breadcrumb so we omit "for {office}" here. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-baseline gap-x-2">
          <span
            className={
              "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider " +
              tone.pill
            }
          >
            {tone.label}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {candidate.incumbent ? "Incumbent · " : ""}
            {candidate.filingStatus} candidate
          </span>
        </div>
        <SocialIconRow links={candidate} name={candidate.name} />
      </div>

      {candidate.notes ? (
        <p className="mt-2 max-w-3xl text-sm leading-snug text-fg">{candidate.notes}</p>
      ) : null}

      {candidate.newsThemes && candidate.newsThemes.length > 0 ? (
        <DisclosureSection
          kicker="What's happening"
          title="Recent themes"
          meta={`${candidate.newsThemes.length} ${candidate.newsThemes.length === 1 ? "theme" : "themes"} · last 60 days`}
        >
          <ul className="space-y-4">
            {candidate.newsThemes.map((theme) => {
              const supporting = theme.supportingUrls
                .map((url) => candidate.news?.find((n) => n.url === url))
                .filter((n): n is NonNullable<typeof n> => Boolean(n))
                .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
              return (
                <li
                  key={theme.headline}
                  className="border-l-2 border-primary pl-4 sm:pl-5"
                >
                  <h3 className="display text-base text-ink">
                    {theme.headline}
                  </h3>
                  {theme.detail ? (
                    <p className="mt-2 text-sm leading-snug text-fg">
                      {theme.detail}
                    </p>
                  ) : null}
                  {supporting.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {supporting.map((n) => (
                        <li key={n.url}>
                          <a
                            href={n.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-baseline gap-1.5 rounded-sm border border-rule bg-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-fg hover:border-primary hover:text-primary"
                          >
                            <span className="text-primary">{n.date}</span>
                            <span>{n.outlet}</span>
                            {n.kind === "social" ? (
                              <span className="text-muted">· social</span>
                            ) : null}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </DisclosureSection>
      ) : null}

      {/* Positions — default-collapsed DisclosureSection. Body text normalized to
          one size (text-sm) with leading-snug so the per-issue stance cards aren't
          competing with metadata at multiple sizes. */}
      <DisclosureSection
        kicker="Positions"
        title="Where they stand"
        meta={`${statedIssues.length} of ${COMPARABLE_ISSUES.length} stated`}
      >
        {statedIssues.length === 0 ? (
          <p className="max-w-3xl text-sm italic leading-snug text-subtle">
            No positions stated yet on tracked issues. The data-refresh skill will populate
            this section as the candidate publishes a platform or speaks at forums.
          </p>
        ) : (
          <>
            <ul className="space-y-4">
              {statedIssues.map((slug) => {
                const pos = candidate.positions?.[slug];
                if (!pos) return null;
                return (
                  <li key={slug} className="border-l-2 border-primary pl-4 sm:pl-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <Link
                        href={`/issues/${slug}/`}
                        className="display text-base text-ink hover:text-primary"
                      >
                        {issueTitle(slug)}
                      </Link>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">
                        {ISSUE_COLUMN_TAGLINES[slug]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-snug text-fg">
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
                  </li>
                );
              })}
            </ul>
            {unstatedIssues.length > 0 ? (
              <p className="mt-5 max-w-3xl text-sm italic leading-snug text-subtle">
                No stated position yet on:{" "}
                {unstatedIssues.map((slug, i) => (
                  <span key={slug}>
                    {i > 0 ? ", " : ""}
                    <Link href={`/issues/${slug}/`} className="text-muted hover:text-primary">
                      {issueTitle(slug)}
                    </Link>
                  </span>
                ))}
                .
              </p>
            ) : null}
          </>
        )}
      </DisclosureSection>

      {/* Recent press & social — disclosure, default closed (page-wide rule). */}
      {candidate.news && candidate.news.length > 0 ? (
        <DisclosureSection
          kicker="Coverage"
          title="Recent press & social"
          meta={`${candidate.news.length} ${candidate.news.length === 1 ? "item" : "items"} · last 60 days`}
        >
          <ol className="border-y border-rule bg-paper">
            {[...candidate.news]
              .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
              .map((n) => (
                <li
                  key={`${n.date}-${n.url}`}
                  className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <div className="flex items-baseline gap-2 sm:w-28">
                    <time
                      className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary"
                      dateTime={n.date}
                    >
                      {n.date}
                    </time>
                    {n.kind === "social" ? (
                      <span className="rounded-sm bg-ink px-1 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                        Social
                      </span>
                    ) : null}
                  </div>
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] leading-snug text-fg hover:text-primary sm:flex-1"
                  >
                    {n.headline}
                  </a>
                  <span className="inline-block py-1 font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                    {n.outlet} ↗
                  </span>
                </li>
              ))}
          </ol>
        </DisclosureSection>
      ) : null}

      {/* About — disclosure. Bio + announcement-source citation. OCF/DCBOE filings,
          campaign site, gov site, and socials all live in the top link row now. */}
      <DisclosureSection
        kicker="Reference"
        title="About this candidate"
        meta={aboutMeta}
      >
        {candidate.bio ? (
          <p className="max-w-3xl text-base leading-relaxed text-fg sm:text-[17px]">
            {candidate.bio}
          </p>
        ) : null}
        <ul className={"grid grid-cols-1 gap-2" + (candidate.bio ? " mt-5" : "")}>
          {referenceLinks.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover block px-4 py-3 text-sm text-fg hover:text-primary"
              >
                Announcement source · {l.label}{" "}
                <span aria-hidden className="text-subtle">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </DisclosureSection>

      {/* Footer strip — other candidates in this race + a back link. Compact, no h2. */}
      <footer className="mt-8 border-t border-rule pt-6 sm:mt-12 lg:mt-14">
        <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
          Other candidates for {race.office}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
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
        <Link
          href={`/elections/${race.slug}/`}
          className="mt-4 inline-block font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:opacity-80"
        >
          ← Back to {race.office} race overview
        </Link>
      </footer>
    </article>
  );
}
