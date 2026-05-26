"use client";

// Thin client button that dispatches the open event for the CommandPalette.
// Lets the NavBar (a server component) host the trigger without forcing the
// whole nav client-side. The ⌘K keyboard shortcut also works globally —
// this is purely the visible affordance.
export function CommandPaletteTrigger(): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("dc-open-palette"))}
      aria-label="Open search palette"
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-sm border border-white/20 bg-transparent px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70 transition-colors hover:border-white/60 hover:text-white"
    >
      <span aria-hidden>⌘K</span>
      <span className="hidden sm:inline">Search</span>
    </button>
  );
}
