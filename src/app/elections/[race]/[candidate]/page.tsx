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

// Filings-only links for the "About this candidate" disclosure. Campaign-site
// + government-site + social URLs render as icon shortcuts next to the
// candidate name (see SocialIconRow), so they're intentionally excluded here.
function filingLinksFor(candidate: ReturnType<typeof getCandidateBySlug>): LinkEntry[] {
  if (!candidate) return [];
  const links: LinkEntry[] = [];
  if (candidate.ocfUrl) links.push({ label: "DC OCF — campaign finance", url: candidate.ocfUrl });
  if (candidate.dcboeUrl) links.push({ label: "DCBOE filing", url: candidate.dcboeUrl });
  // Always include the announcement source as the last link.
  links.push({ label: candidate.source.label, url: candidate.source.url });
  return links;
}

export default async function CandidateProfilePage({ params }: { params: Promise<Params> }): Promise<JSX.Element> {
  const { race: raceSlug, candidate: candidateSlug } = await params;
  const candidate = getCandidateBySlug(candidateSlug);
  const race = getRaceBySlug(raceSlug);
  if (!candidate || !race || candidate.raceSlug !== race.slug) notFound();

  const tone = partyTone(candidate.party);
  const sameRace = candidatesForRace(race.slug);
  const filingLinks = filingLinksFor(candidate);
  const statedIssues = COMPARABLE_ISSUES.filter((slug) => candidate.positions?.[slug]);
  const unstatedIssues = COMPARABLE_ISSUES.filter((slug) => !candidate.positions?.[slug]);
  const aboutMetaParts: string[] = [];
  if (candidate.bio) aboutMetaParts.push("Bio");
  aboutMetaParts.push(`${filingLinks.length} ${filingLinks.length === 1 ? "filing" : "filings"}`);
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

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <h1 className="display-tight text-3xl text-ink sm:text-4xl lg:text-5xl">
          {candidate.name}
        </h1>
        <SocialIconRow candidate={candidate} />
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-3">
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
          {candidate.filingStatus} candidate for {race.office}
        </span>
      </div>
      {candidate.notes ? (
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-fg sm:text-[17px]">{candidate.notes}</p>
      ) : null}

      <hr className="mt-6 rule-thick sm:mt-8" />

      {candidate.newsThemes && candidate.newsThemes.length > 0 ? (
        <section className="mt-8 sm:mt-10">
          <span className="kicker">What&apos;s happening</span>
          <h2 className="display mt-1 text-xl text-ink sm:text-2xl">
            What we&apos;re tracking right now
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-fg">
            Themes the data-refresh skill identified across the last 60 days of
            local press and the candidate&apos;s own posts. Every theme links to
            the receipts.
          </p>
          <ul className="mt-5 space-y-5">
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
                  <h3 className="display text-base text-ink sm:text-lg">
                    {theme.headline}
                  </h3>
                  {theme.detail ? (
                    <p className="mt-2 text-[15px] leading-snug text-fg">
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
          <hr className="mt-8 rule-thick sm:mt-10" />
        </section>
      ) : null}

      {/* Positions — disclosure. Default open when ≥1 stance is on file (decision-relevant).
          Header meta shows the stated count, and the body lists ONLY the stated stances
          plus a single muted line naming the unstated issues. The 5-rows-of-"No position
          stated" wall on sparse candidates was 650+px of noise — gone. */}
      <DisclosureSection
        kicker="Positions"
        title="Where they stand"
        meta={`${statedIssues.length} of ${COMPARABLE_ISSUES.length} stated`}
        defaultOpen={statedIssues.length > 0}
      >
        {statedIssues.length === 0 ? (
          <p className="max-w-3xl text-base italic leading-relaxed text-subtle sm:text-[17px]">
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
                        className="display text-base text-ink hover:text-primary sm:text-lg"
                      >
                        {issueTitle(slug)}
                      </Link>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
                        {ISSUE_COLUMN_TAGLINES[slug]}
                      </span>
                    </div>
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

      {/* Recent press & social — disclosure. Default open when there's anything to show. */}
      {candidate.news && candidate.news.length > 0 ? (
        <DisclosureSection
          kicker="Coverage"
          title="Recent press & social"
          meta={`${candidate.news.length} ${candidate.news.length === 1 ? "item" : "items"} · last 60 days`}
          defaultOpen
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

      {/* About — disclosure. Combines Bio + Links & filings (both reference material,
          low-priority next to themes/positions/press). Default closed at all viewports. */}
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
        <ul
          className={
            "grid grid-cols-1 gap-2 sm:grid-cols-2" + (candidate.bio ? " mt-5" : "")
          }
        >
          {filingLinks.map((l) => (
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
      </DisclosureSection>

      {/* Footer strip — other candidates in this race + a back link. Compact, no h2. */}
      <footer className="mt-10 border-t border-rule pt-6 sm:mt-14">
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
