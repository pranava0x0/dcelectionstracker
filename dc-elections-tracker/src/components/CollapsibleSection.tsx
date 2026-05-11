import type { ReactNode } from "react";

type Props = {
  kicker: string;
  title: string;
  children: ReactNode;
};

// Editorial section that collapses at < sm and renders inline at sm+.
// Implementation: sibling-pair pattern (same as the Phase A tables) — a mobile
// <details> and a tablet/desktop block. Children render twice in the JSX but
// only one branch is ever in the layout because of the responsive classes.
// This is JS-free and avoids fighting browser internals for [open] state.
export function CollapsibleSection({ kicker, title, children }: Props): JSX.Element {
  return (
    <section className="mt-10 sm:mt-14">
      <hr className="rule-thick" />

      {/* Mobile (< sm): collapsed by default. Summary carries the kicker + title. */}
      <details className="group sm:hidden">
        <summary className="flex cursor-pointer items-baseline justify-between gap-3 pt-3">
          <div>
            <span className="kicker">{kicker}</span>
            <h2 className="display mt-1 text-2xl text-ink">{title}</h2>
          </div>
          <span
            aria-hidden
            className="shrink-0 self-center font-mono text-xl leading-none text-muted transition-transform group-open:rotate-180"
          >
            ↓
          </span>
        </summary>
        <div>{children}</div>
      </details>

      {/* Tablet & desktop (>= sm): original always-visible layout. */}
      <div className="hidden sm:block">
        <span className="kicker mt-3 inline-block">{kicker}</span>
        <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}
