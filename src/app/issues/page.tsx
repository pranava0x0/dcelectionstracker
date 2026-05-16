import type { Metadata } from "next";
import Link from "next/link";
import { IssueCard } from "@/components/IssueCard";
import { issues } from "@/data/issues";

export const metadata: Metadata = {
  title: "Issues — DC Elections Tracker",
  description:
    "Seven issues on the 2026 DC ballot — statehood, public safety, housing, budget, transit, schools, and ranked-choice voting. Every numeric claim links to a primary source.",
};

export default function IssuesIndexPage(): JSX.Element {
  return (
    <article className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <p className="kicker">The 2026 brief</p>
      <h1 className="display-tight mt-3 text-3xl text-ink sm:text-5xl lg:text-6xl">
        {issues.length} issues on the 2026 DC ballot
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-snug text-fg sm:mt-6 sm:text-[17px]">
        Each brief opens with three quick facts, then four hero stats, what&apos;s at
        stake, who decides, the recent moves, and the questions to put to candidates.
        Every numeric claim links to a primary or authoritative source.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {issues.map((i) => (
          <IssueCard key={i.slug} issue={i} />
        ))}
      </div>

      <hr className="mt-12 rule-thick sm:mt-16" />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href="/elections/"
          className="rounded-sm bg-primary px-4 py-3 text-center font-mono text-xs font-bold uppercase tracking-wider text-primary-fg hover:opacity-90 sm:py-2"
        >
          See your ballot →
        </Link>
        <Link
          href="/sources/"
          className="rounded-sm border border-rule bg-paper px-4 py-3 text-center font-mono text-xs font-bold uppercase tracking-wider text-fg hover:bg-bg sm:py-2"
        >
          All sources
        </Link>
      </div>
    </article>
  );
}
