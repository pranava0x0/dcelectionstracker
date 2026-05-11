import Link from "next/link";

export function Footer(): JSX.Element {
  const buildDate = new Date().toISOString().slice(0, 10);
  return (
    <footer className="mt-16 bg-ink text-white sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="display text-xl font-extrabold tracking-tight sm:text-2xl">
          DC ELECTIONS TRACKER
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80">
          Every numeric claim links to a primary or authoritative source.
          Non-partisan, but not neutral about transparency, accountability, and who
          pays.
        </p>
        <hr className="mt-8 border-white/20" />
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-white/70 sm:gap-x-6">
          <Link href="/sources/" className="hover:text-primary">
            All sources
          </Link>
          <Link href="/officials/" className="hover:text-primary">
            Officials
          </Link>
          <Link href="/elections/" className="hover:text-primary">
            2026 elections
          </Link>
          <a
            href="https://github.com/pranava0x0/dcelectionstracker"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            Source on GitHub
          </a>
          <span className="basis-full text-white/50 sm:ml-auto sm:basis-auto">
            Last updated {buildDate}
          </span>
        </div>
      </div>
    </footer>
  );
}
