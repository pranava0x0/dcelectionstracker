import type { Metadata } from "next";
import Link from "next/link";
import { CandidateComparison } from "@/components/CandidateComparison";

export const metadata: Metadata = {
  title: "Compare candidates side-by-side — DC Elections Tracker",
  description:
    "Side-by-side candidate positions on housing, public safety, budget, schools, transportation, statehood, and ranked-choice voting. Every stance links to a primary source.",
};

export default function CandidateComparePage(): JSX.Element {
  return (
    <article className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <p className="kicker">2026 cycle · Compare</p>
      <h1 className="display-tight mt-3 text-3xl text-ink sm:text-5xl lg:text-6xl">
        Side-by-side candidate positions
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-snug text-fg sm:text-[17px]">
        Where the declared candidates stand on housing, public safety, budget,
        schools, transportation, statehood, and ranked-choice voting. Every
        stance is sourced — tap the small superscript next to each position to
        open the primary source. Blank cells mean the candidate has not stated
        a public position on that issue yet.
      </p>
      <p className="mt-3 text-sm text-muted">
        Three races are profiled here:{" "}
        <Link href="/elections/mayor/" className="text-primary hover:underline">
          Mayor
        </Link>
        ,{" "}
        <Link
          href="/elections/council-at-large-bonds/"
          className="text-primary hover:underline"
        >
          Council At-Large (Bonds seat)
        </Link>
        , and{" "}
        <Link
          href="/elections/council-ward-1/"
          className="text-primary hover:underline"
        >
          Council Ward 1
        </Link>
        . The full race list lives on the{" "}
        <Link href="/elections/" className="text-primary hover:underline">
          elections index
        </Link>
        .
      </p>

      <div className="mt-8">
        <CandidateComparison />
      </div>
    </article>
  );
}
