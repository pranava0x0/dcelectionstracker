type Chip = { href: string; label: string };

// Horizontal-scroll anchor strip rendered just under the hero on long pages.
// Mobile-only: hidden at sm+ where the page is short enough to scan without
// in-page navigation. Pure anchor links + scroll-behavior:smooth in globals.css
// (respects prefers-reduced-motion). No JS.
//
// The -mx-4 px-4 trick lets the strip's scroll viewport extend to the screen
// edge while the chips stay aligned with the surrounding body content. The
// inline [scrollbar-width:none] hides the scroll track on Firefox; the
// ::-webkit-scrollbar utility hides it on Safari/Chrome.
export function JumpStrip({ chips }: { chips: Chip[] }): JSX.Element {
  return (
    <nav
      aria-label="Jump to section"
      className="sm:hidden -mx-4 mt-6 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max gap-2 pb-1">
        {chips.map((c) => (
          <li key={c.href}>
            <a
              href={c.href}
              className="inline-flex h-10 shrink-0 items-center rounded-sm border border-rule bg-paper px-3 font-mono text-[11px] font-bold uppercase tracking-wider text-fg hover:border-primary hover:text-primary"
            >
              {c.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
