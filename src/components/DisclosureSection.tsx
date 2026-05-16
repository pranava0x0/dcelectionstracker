import type { ReactNode } from "react";

type Props = {
  kicker: string;
  title: string;
  /** Right-aligned status hint in the summary row, e.g. "1 of 6 stated" or "5 items". */
  meta?: string;
  /** When true, render with the native `open` attribute so the disclosure starts expanded. */
  defaultOpen?: boolean;
  children: ReactNode;
};

// Always-collapsible disclosure section used on the candidate profile page (BL-58).
// Sibling to CollapsibleSection, but collapses at every viewport — the profile page
// has too much per-candidate content to keep all of it inline. Default-open vs closed
// is a per-section editorial call (e.g. Positions opens when ≥1 stance is stated;
// About opens never).
//
// Pure CSS via <details>/<summary>; no client component needed.
export function DisclosureSection({
  kicker,
  title,
  meta,
  defaultOpen = false,
  children,
}: Props): JSX.Element {
  return (
    <section className="mt-8 sm:mt-12 lg:mt-14">
      <hr className="rule-thick" />
      <details className="group" {...(defaultOpen ? { open: true } : {})}>
        <summary className="flex cursor-pointer items-baseline justify-between gap-4 pt-3 list-none [&::-webkit-details-marker]:hidden">
          <div className="min-w-0 flex-1">
            <span className="kicker">{kicker}</span>
            <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">{title}</h2>
          </div>
          <div className="flex shrink-0 items-baseline gap-3 self-center">
            {meta ? (
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                {meta}
              </span>
            ) : null}
            <span
              aria-hidden
              className="font-mono text-xl leading-none text-muted transition-transform group-open:rotate-180"
            >
              ↓
            </span>
          </div>
        </summary>
        <div className="mt-4">{children}</div>
      </details>
    </section>
  );
}
