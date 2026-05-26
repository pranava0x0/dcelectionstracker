type Chip = { href: string; label: string };

// Horizontal-scroll anchor strip rendered just under the hero on long pages.
// Visible at all viewports: long pages (issues, elections) are 4-6 screens
// even on desktop, and a desktop reader is just as well-served by a jump nav
// as a mobile reader. On mobile the chips horizontally scroll; at sm+ they
// wrap onto a second line if needed. Pure anchor links + scroll-behavior:smooth
// in globals.css (respects prefers-reduced-motion). No JS.
//
// The -mx-4 px-4 trick lets the strip's scroll viewport extend to the screen
// edge while the chips stay aligned with the surrounding body content on
// mobile. The inline [scrollbar-width:none] hides the scroll track on Firefox;
// the ::-webkit-scrollbar utility hides it on Safari/Chrome.
export function JumpStrip({ chips }: { chips: Chip[] }): JSX.Element {
  return (
    <nav
      aria-label="Jump to section"
      className="-mx-4 mt-6 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:overflow-visible sm:px-0"
    >
      <ul className="flex w-max gap-2 pb-1 sm:w-auto sm:flex-wrap">
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
