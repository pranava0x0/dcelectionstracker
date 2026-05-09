import Link from "next/link";
import { path } from "@/lib/links";

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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href={path("/")} className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-primary animate-pulseDot"
          />
          <span className="display text-base font-extrabold tracking-tight text-white">
            DC ELECTIONS TRACKER
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={path(item.href)}
              className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href={path("/elections/")}
          className="rounded-sm bg-primary px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary-fg transition-opacity hover:opacity-90"
        >
          Are you registered?
        </Link>
      </div>
      <div className="h-px w-full bg-primary" aria-hidden />
    </header>
  );
}
