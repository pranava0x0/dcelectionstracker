"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchItem } from "@/lib/search-index";

const KIND_TONE: Record<SearchItem["kind"], string> = {
  Race: "text-primary",
  Candidate: "text-ink",
  Issue: "text-ink",
  Official: "text-fg",
};

const MAX_RESULTS = 30;

// ⌘K / Ctrl-K palette to jump anywhere in 2 keystrokes. Pure client-side —
// the index is built once at module load (passed in via props) and filtered
// in memory as the user types. No fetch, no localStorage, no tracking.
//
// The trigger button (CommandPaletteTrigger) and this component communicate
// via a custom window event ("dc-open-palette") so the trigger can live in
// the server-rendered NavBar without forcing the whole nav to be a client
// component. The keyboard shortcut works globally regardless of the trigger.
export function CommandPalette({ items }: { items: SearchItem[] }): JSX.Element | null {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      const cmdK = (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");
      if (cmdK) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    }
    function onOpenEvent(): void {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("dc-open-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("dc-open-palette", onOpenEvent);
    };
  }, [open]);

  // Reset query + active row when opening.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // Focus next tick so the input is in the DOM.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, MAX_RESULTS);
    const scored = items
      .map((item) => {
        const label = item.label.toLowerCase();
        const hint = item.hint?.toLowerCase() ?? "";
        const kind = item.kind.toLowerCase();
        // Cheap relevance scoring: label prefix > label substring > hint > kind.
        let score = 0;
        if (label.startsWith(q)) score += 100;
        else if (label.includes(q)) score += 50;
        if (hint.includes(q)) score += 10;
        if (kind.includes(q)) score += 5;
        return { item, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS);
    return scored.map((s) => s.item);
  }, [items, query]);

  // Keep the active index in range as the filtered list changes.
  useEffect(() => {
    if (active >= filtered.length) setActive(Math.max(0, filtered.length - 1));
  }, [filtered.length, active]);

  // Scroll the active row into view when the user arrows down past the fold.
  // Must run before the early return below to keep hook order stable across
  // open/closed renders.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const node = listRef.current.children[active] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!open) return null;

  function go(item: SearchItem): void {
    setOpen(false);
    window.location.href = item.href;
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[active];
      if (item) go(item);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-20 sm:pt-24"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-sm border border-rule bg-paper shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <span
            aria-hidden
            className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted"
          >
            ⌘K
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Search races, candidates, issues, officials…"
            aria-label="Search query"
            className="w-full bg-transparent py-3 text-base text-ink outline-none placeholder:text-subtle"
          />
        </div>
        {filtered.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted">
            Nothing matches &ldquo;{query}&rdquo;. Try a partial name or one of:
            <span className="ml-1 font-mono text-[11px] uppercase tracking-wider text-fg">
              mayor · delegate · ward 1 · housing
            </span>
          </p>
        ) : (
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Search results"
            className="max-h-96 overflow-y-auto"
          >
            {filtered.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    role="option"
                    aria-selected={isActive}
                    className={
                      "flex items-baseline justify-between gap-3 px-4 py-2 text-sm " +
                      (isActive ? "bg-bg" : "hover:bg-bg")
                    }
                    onMouseEnter={() => setActive(i)}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item);
                    }}
                  >
                    <span className="flex min-w-0 flex-1 items-baseline gap-2">
                      <span className={KIND_TONE[item.kind] + " truncate"}>
                        {item.label}
                      </span>
                      {item.hint ? (
                        <span className="truncate text-xs text-subtle">
                          {item.hint}
                        </span>
                      ) : null}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                      {item.kind}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex items-center justify-between border-t border-rule bg-bg px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted">
          <span>
            <kbd className="font-mono">↑ ↓</kbd> navigate ·{" "}
            <kbd className="font-mono">↵</kbd> open ·{" "}
            <kbd className="font-mono">esc</kbd> close
          </span>
          <span>{filtered.length} of {items.length}</span>
        </div>
      </div>
    </div>
  );
}
