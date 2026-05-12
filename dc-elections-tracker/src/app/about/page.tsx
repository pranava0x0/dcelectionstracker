import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — DC Elections Tracker",
  description:
    "An independent, non-partisan voter brief for the District of Columbia. Every numeric claim links to a primary or authoritative source.",
};

export default function AboutPage(): JSX.Element {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <p className="kicker">Editorial standard</p>
      <h1 className="display-tight mt-3 text-3xl text-ink sm:text-4xl lg:text-5xl">
        Where this site stands
      </h1>
      <p className="mt-4 text-base leading-relaxed text-fg sm:mt-6 sm:text-[17px]">
        Independent. Non-partisan, but not neutral about transparency,
        accountability, and who pays. Every numeric claim links to a primary or
        authoritative source — DC Council, OCFO, MPD, OSSE, DCBOE, congress.gov,
        courts.gov, WMATA, BLS, Census. Officials are listed by ward and party
        label. Voting records, when added, are factual records, not endorsements.
      </p>

      <hr className="mt-10 rule-thick sm:mt-12" />
      <span className="kicker mt-3 inline-block">How we source</span>
      <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">
        Primary sources, plainly stated
      </h2>
      <ul className="mt-5 border-y border-rule bg-paper">
        <li className="flex flex-col gap-1 border-b border-border p-4 sm:flex-row sm:items-baseline sm:gap-6">
          <span className="display text-base text-ink sm:w-1/3">
            Primary sources preferred
          </span>
          <span className="text-sm leading-snug text-fg sm:flex-1">
            Government filings, court dockets, and statute text are cited before any
            secondary reporting. Secondary outlets are used when they are the only
            record of an event.
          </span>
        </li>
        <li className="flex flex-col gap-1 border-b border-border p-4 sm:flex-row sm:items-baseline sm:gap-6">
          <span className="display text-base text-ink sm:w-1/3">
            No claims without sources
          </span>
          <span className="text-sm leading-snug text-fg sm:flex-1">
            Every stat tile, recent-move row, and candidate position carries an
            outbound citation. Cells without a sourced position read &ldquo;No
            position stated&rdquo; — we do not infer.
          </span>
        </li>
        <li className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6">
          <span className="display text-base text-ink sm:w-1/3">
            Alarming where the facts are alarming
          </span>
          <span className="text-sm leading-snug text-fg sm:flex-1">
            &ldquo;Congress overrode DC&apos;s tax law for the first time in 50+
            years&rdquo; is a factual statement, not a polemic. &ldquo;X is
            corrupt&rdquo; without a source is not allowed.
          </span>
        </li>
      </ul>

      <hr className="mt-10 rule-thick sm:mt-12" />
      <span className="kicker mt-3 inline-block">Reference</span>
      <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">Read or contribute</h2>
      <p className="mt-4 text-base leading-relaxed text-fg sm:text-[17px]">
        Every URL cited on this site is gathered on{" "}
        <Link
          href="/sources/"
          className="border-b border-primary text-primary hover:opacity-80"
        >
          the sources page
        </Link>
        . Bugs and missing facts go in{" "}
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
    </article>
  );
}
