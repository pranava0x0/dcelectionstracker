import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DisclosureSection } from "@/components/DisclosureSection";
import { OfficialProfileTabs } from "@/components/OfficialProfileTabs";
import { SocialIconRow, type SocialLinks } from "@/components/SocialIconRow";
import { MemberVotingMiniRecord } from "@/components/VotingRecordMatrix";
import {
  COMPARABLE_ISSUES,
  ISSUE_COLUMN_TAGLINES,
  candidatesForRace,
  getCandidateBySlug,
  getRaceBySlug,
  type ComparableIssueSlug,
} from "@/data/elections";
import { getIssueBySlug } from "@/data/issues";
import { officials, getOfficialBySlug } from "@/data/officials";
import { partyTone } from "@/lib/party";
import type { JSX } from "react";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return officials.flatMap((g) => g.members.map((m) => ({ slug: m.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const official = getOfficialBySlug(slug);
  if (!official) return { title: "Official not found — DC Elections Tracker", description: "" };
  return {
    title: `${official.name} — ${official.role} — DC Elections Tracker`,
    description: `${official.name}, ${official.role}, term ending ${official.termEnds}. DC Elections Tracker voter reference.`,
  };
}

function issueTitle(slug: ComparableIssueSlug): string {
  return getIssueBySlug(slug)?.title ?? slug;
}

// Council group names used to decide whether to render the voting record.
const COUNCIL_ROLES = new Set([
  "DC Council — Chair and At-Large",
  "DC Council — Ward Members",
]);

function isCouncilMember(officialSlug: string): boolean {
  return officials.some(
    (g) => COUNCIL_ROLES.has(g.group) && g.members.some((m) => m.slug === officialSlug),
  );
}

export default async function OfficialProfilePage({ params }: { params: Promise<Params> }): Promise<JSX.Element> {
  const { slug } = await params;
  const official = getOfficialBySlug(slug);
  if (!official) notFound();

  const candidate = official.candidateSlug
    ? getCandidateBySlug(official.candidateSlug)
    : undefined;

  const race = candidate ? getRaceBySlug(candidate.raceSlug) : undefined;
  const tone = partyTone(official.party);
  const councilMember = isCouncilMember(slug);

  // Header icon row: pull from candidate record if available, fall back to official source.
  const headerLinks: SocialLinks = candidate
    ? {
        websiteUrl: candidate.websiteUrl,
        governmentSiteUrl: candidate.governmentSiteUrl ?? official.source.url,
        twitterUrl: candidate.twitterUrl,
        linkedinUrl: candidate.linkedinUrl,
        instagramUrl: candidate.instagramUrl,
        facebookUrl: candidate.facebookUrl,
      }
    : { governmentSiteUrl: official.source.url };

  // "In office" tab body — official role details + voting record.
  const currentRoleContent = (
    <div className="space-y-6">
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">Role</dt>
          <dd className="mt-0.5 text-base text-ink">{official.role}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">Term ends</dt>
          <dd className="mt-0.5 font-mono text-sm text-fg">{official.termEnds}</dd>
        </div>
        {official.ward ? (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">Ward</dt>
            <dd className="mt-0.5 text-base text-fg">{official.ward}</dd>
          </div>
        ) : null}
      </dl>

      {official.notes ? (
        <p className="max-w-3xl text-base leading-relaxed text-fg sm:text-[17px]">
          {official.notes}
        </p>
      ) : null}

      {official.bio ? (
        <p className="max-w-3xl text-base leading-relaxed text-fg sm:text-[17px]">
          {official.bio}
        </p>
      ) : null}

      {councilMember ? (
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
            Voting record — tracked bills
          </p>
          <MemberVotingMiniRecord memberSlug={slug} />
        </div>
      ) : null}

      <a
        href={official.source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:opacity-80"
      >
        {official.source.label} ↗
      </a>
    </div>
  );

  // Build campaign tab only if we have a candidate record.
  let campaignContent: React.ReactNode = null;
  if (candidate && race) {
    const statedIssues = COMPARABLE_ISSUES.filter((s) => candidate.positions?.[s]);
    const unstatedIssues = COMPARABLE_ISSUES.filter((s) => !candidate.positions?.[s]);
    const sameRace = candidatesForRace(race.slug);

    const candidateTone = partyTone(candidate.party);

    campaignContent = (
      <div className="space-y-0">
        {/* Link strip */}
        {(candidate.websiteUrl || candidate.governmentSiteUrl || candidate.twitterUrl || candidate.instagramUrl || candidate.facebookUrl || candidate.linkedinUrl) ? (
          <div className="flex flex-wrap gap-2 pb-6">
            {candidate.websiteUrl ? (
              <a href={candidate.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-sm border border-rule bg-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-fg hover:border-primary hover:text-primary">
                Website <span aria-hidden>↗</span>
              </a>
            ) : null}
            {candidate.governmentSiteUrl ? (
              <a href={candidate.governmentSiteUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-sm border border-rule bg-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-fg hover:border-primary hover:text-primary">
                Official site <span aria-hidden>↗</span>
              </a>
            ) : null}
            {candidate.twitterUrl ? (
              <a href={candidate.twitterUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-sm border border-rule bg-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-fg hover:border-primary hover:text-primary">
                X / Twitter <span aria-hidden>↗</span>
              </a>
            ) : null}
            {candidate.instagramUrl ? (
              <a href={candidate.instagramUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-sm border border-rule bg-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-fg hover:border-primary hover:text-primary">
                Instagram <span aria-hidden>↗</span>
              </a>
            ) : null}
            {candidate.facebookUrl ? (
              <a href={candidate.facebookUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-sm border border-rule bg-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-fg hover:border-primary hover:text-primary">
                Facebook <span aria-hidden>↗</span>
              </a>
            ) : null}
          </div>
        ) : null}

        {/* Party + filing status */}
        <div className="flex flex-wrap items-baseline gap-3 pb-6">
          <span className={
            "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider " +
            candidateTone.pill
          }>
            {candidateTone.label}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {candidate.incumbent ? "Incumbent · " : ""}
            {candidate.filingStatus} candidate for {race.office}
          </span>
        </div>

        {candidate.notes ? (
          <p className="max-w-3xl pb-6 text-base leading-relaxed text-fg sm:text-[17px]">
            {candidate.notes}
          </p>
        ) : null}

        {/* News themes */}
        {candidate.newsThemes && candidate.newsThemes.length > 0 ? (
          <section className="pb-8 sm:pb-10">
            <span className="kicker">What&apos;s happening</span>
            <h2 className="display mt-1 text-xl text-ink sm:text-2xl">
              What we&apos;re tracking right now
            </h2>
            <ul className="mt-5 space-y-5">
              {candidate.newsThemes.map((theme) => {
                const supporting = theme.supportingUrls
                  .map((url) => candidate.news?.find((n) => n.url === url))
                  .filter((n): n is NonNullable<typeof n> => Boolean(n))
                  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
                return (
                  <li key={theme.headline} className="border-l-2 border-primary pl-4 sm:pl-5">
                    <h3 className="display text-base text-ink sm:text-lg">{theme.headline}</h3>
                    {theme.detail ? (
                      <p className="mt-2 text-[15px] leading-snug text-fg">{theme.detail}</p>
                    ) : null}
                    {supporting.length > 0 ? (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {supporting.map((n) => (
                          <li key={n.url}>
                            <a href={n.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-baseline gap-1.5 rounded-sm border border-rule bg-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-fg hover:border-primary hover:text-primary">
                              <span className="text-primary">{n.date}</span>
                              <span>{n.outlet}</span>
                              {n.kind === "social" ? <span className="text-muted">· social</span> : null}
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

        {/* Positions */}
        <DisclosureSection
          kicker="Positions"
          title="Where they stand"
          meta={`${statedIssues.length} of ${COMPARABLE_ISSUES.length} stated`}
          defaultOpen={statedIssues.length > 0}
        >
          {statedIssues.length === 0 ? (
            <p className="max-w-3xl text-base italic leading-relaxed text-subtle sm:text-[17px]">
              No positions stated yet on tracked issues.
            </p>
          ) : (
            <>
              <ul className="space-y-4">
                {statedIssues.map((s) => {
                  const pos = candidate.positions?.[s];
                  if (!pos) return null;
                  return (
                    <li key={s} className="border-l-2 border-primary pl-4 sm:pl-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <Link href={`/issues/${s}/`}
                          className="display text-base text-ink hover:text-primary sm:text-lg">
                          {issueTitle(s as ComparableIssueSlug)}
                        </Link>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
                          {ISSUE_COLUMN_TAGLINES[s as ComparableIssueSlug]}
                        </span>
                      </div>
                      <p className="mt-2 text-base leading-relaxed text-fg sm:text-[17px]">
                        {pos.stance}{" "}
                        <a href={pos.sourceUrl} target="_blank" rel="noopener noreferrer"
                          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted hover:text-primary">
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
                  {unstatedIssues.map((s, i) => (
                    <span key={s}>
                      {i > 0 ? ", " : ""}
                      <Link href={`/issues/${s}/`} className="text-muted hover:text-primary">
                        {issueTitle(s as ComparableIssueSlug)}
                      </Link>
                    </span>
                  ))}
                  .
                </p>
              ) : null}
            </>
          )}
        </DisclosureSection>

        {/* Recent press & social */}
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
                  <li key={`${n.date}-${n.url}`}
                    className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4">
                    <div className="flex items-baseline gap-2 sm:w-28">
                      <time className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary" dateTime={n.date}>
                        {n.date}
                      </time>
                      {n.kind === "social" ? (
                        <span className="rounded-sm bg-ink px-1 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                          Social
                        </span>
                      ) : null}
                    </div>
                    <a href={n.url} target="_blank" rel="noopener noreferrer"
                      className="text-[15px] leading-snug text-fg hover:text-primary sm:flex-1">
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

        {/* Other candidates in this race */}
        {sameRace.filter((c) => c.slug !== candidate.slug).length > 0 ? (
          <div className="mt-8 border-t border-rule pt-6">
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
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      {/* Breadcrumb */}
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
        <Link href="/officials/" className="hover:text-primary">
          Officials
        </Link>{" "}
        <span aria-hidden>›</span> {official.name}
      </p>

      {/* Header */}
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <h1 className="display-tight text-3xl text-ink sm:text-4xl lg:text-5xl">
          {official.name}
        </h1>
        <SocialIconRow links={headerLinks} name={official.name} />
      </div>

      {/* Party pill + role */}
      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <span className={
          "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider " +
          tone.pill
        }>
          {tone.label}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          {official.role}
          {official.ward ? ` · Ward ${official.ward}` : ""}
          {" · "}Term ends {official.termEnds}
        </span>
      </div>

      {/* Tabs (official+candidate) or single-mode (official only) */}
      {candidate && race ? (
        <OfficialProfileTabs
          campaignLabel={`2026 — ${race.office}`}
          currentRoleContent={currentRoleContent}
          campaignContent={campaignContent}
        />
      ) : (
        <>
          <hr className="mt-6 rule-thick sm:mt-8" />
          <div className="mt-8">{currentRoleContent}</div>
        </>
      )}

      {/* Back link */}
      <footer className="mt-12 border-t border-rule pt-6">
        <Link
          href="/officials/"
          className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:opacity-80"
        >
          ← Back to all officials
        </Link>
      </footer>
    </article>
  );
}
