import Link from "next/link";

// BL-47: Primary nav collapsed from 9 flat items to 2 — Issues (index page
// listing every issue brief) and Elections (the voter hub: address lookup,
// races, candidate comparison, links to Officials). Sources moves to footer.
// With only 2 items the hamburger drawer is gone (no JS, no <details>); the
// nav sits inline next to the wordmark at sm+ and stacks below it on mobile,
// keeping the Register CTA reachable from every page at every width.
const navItems = [
  { href: "/issues/", label: "Issues" },
  { href: "/elections/", label: "Elections" },
];

export function NavBar(): JSX.Element {
  return (
    <header className="sticky top-0 z-30 bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-primary animate-pulseDot"
          />
          <span className="display whitespace-nowrap text-sm font-extrabold tracking-tight text-white sm:text-base">
            DC ELECTIONS TRACKER
          </span>
        </Link>
        <nav
          className="flex items-center gap-4 sm:ml-auto sm:gap-5"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70 transition-colors hover:text-white sm:text-xs"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.dcboe.org/voters/register-to-vote"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto whitespace-nowrap rounded-sm bg-primary px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary-fg transition-opacity hover:opacity-90 sm:ml-0"
          >
            Are you registered?
          </a>
        </nav>
      </div>
      <div className="h-px w-full bg-primary" aria-hidden />
    </header>
  );
}
