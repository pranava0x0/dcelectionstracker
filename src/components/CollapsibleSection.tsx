import type { ReactNode } from "react";

type Props = {
  kicker: string;
  title: string;
  children: ReactNode;
};

// Editorial section that collapses at < sm and renders inline at sm+.
//
// Implementation: dual-render sibling pair — a mobile <details> and a
// tablet/desktop block. Children render twice in the JSX but only one
// branch is ever in the layout because of the responsive classes
// (`sm:hidden` / `hidden sm:block`).
//
// Why not single-render with a CSS override? A `<details>` element without
// the `open` attribute uses browser-internal layout tricks (akin to
// content-visibility) that CSS `display: block !important` on children
// cannot reliably restore — the children render but the <details> reports
// `height: 0`, breaking sibling stacking. The alternative (always-open
// `<details>`) regresses mobile UX (sections no longer collapse by default).
// The dual-render's cost is HTML weight only — screen readers respect the
// CSS `display: none` on the inactive branch, so a11y is unaffected.
export function CollapsibleSection({ kicker, title, children }: Props): JSX.Element {
  return (
    <section className="mt-8 sm:mt-12 lg:mt-14">
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
