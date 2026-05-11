import Link from "next/link";

const navItems = [
  { href: "/issues/statehood/", label: "Statehood" },
  { href: "/issues/public-safety/", label: "Public Safety" },
  { href: "/issues/housing/", label: "Housing" },
  { href: "/issues/budget/", label: "Budget" },
  { href: "/issues/transportation/", label: "Transit" },
  { href: "/issues/schools/", label: "Schools" },
  { href: "/officials/", label: "Officials" },
  { href: "/elections/", label: "Elections" },
  { href: "/sources/", label: "Sources" },
];

export function NavBar(): JSX.Element {
  return (
    <header className="sticky top-0 z-30 bg-ink text-white">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-primary animate-pulseDot"
          />
          <span className="display whitespace-nowrap text-sm font-extrabold tracking-tight text-white sm:text-base">
            DC ELECTIONS TRACKER
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://www.dcboe.org/voters/register-to-vote"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden whitespace-nowrap rounded-sm bg-primary px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary-fg transition-opacity hover:opacity-90 sm:inline-block"
          >
            Are you registered?
          </a>
          <a
            href="https://www.dcboe.org/voters/register-to-vote"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-sm bg-primary px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-fg transition-opacity hover:opacity-90 sm:hidden"
            aria-label="Are you registered to vote?"
          >
            Register
          </a>
          <details className="group lg:hidden">
            <summary
              className="nav-summary inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-white/20 hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M2 4h12M2 8h12M2 12h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  className="group-open:hidden"
                />
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  className="hidden group-open:block"
                />
              </svg>
            </summary>
            <nav
              className="absolute inset-x-0 top-full max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-white/10 bg-ink"
              aria-label="Primary mobile"
            >
              <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-px bg-white/5 px-2 py-2 sm:grid-cols-2">
                {navItems.map((item) => (
                  <li key={item.href} className="bg-ink">
                    <Link
                      href={item.href}
                      className="block px-3 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white/80 hover:bg-white/5 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
      <div className="h-px w-full bg-primary" aria-hidden />
    </header>
  );
}
