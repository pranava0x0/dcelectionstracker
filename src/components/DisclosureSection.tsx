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
        {/* On mobile the title takes the full width and the meta+arrow drop to
            their own row below (otherwise the meta's shrink-0 eats horizontal
            room and forces big display titles to wrap to short stacks). On sm+
            we restore the side-by-side row. */}
        <summary className="cursor-pointer pt-3 list-none [&::-webkit-details-marker]:hidden">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1">
              <span className="kicker">{kicker}</span>
              <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">{title}</h2>
            </div>
            <div className="flex items-baseline justify-end gap-3 sm:shrink-0 sm:self-center">
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
          </div>
        </summary>
        <div className="mt-4">{children}</div>
      </details>
    </section>
  );
}
