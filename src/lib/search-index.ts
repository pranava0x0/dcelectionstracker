import { issues } from "@/data/issues";
import {
  candidatesForRace,
  getRaceBySlug,
  PROFILED_RACE_SLUGS,
  races2026,
} from "@/data/elections";
import { officials } from "@/data/officials";

export type SearchItem = {
  // Globally unique within the index — kind:slug.
  id: string;
  label: string;
  href: string;
  kind: "Race" | "Candidate" | "Issue" | "Official";
  // Extra haystack tokens not shown in the label (party, role, ward).
  hint?: string;
};

// Build the full client-side search index at compile time. Static data only
// — no fetch, no localStorage, no tracking. The palette renders this list
// once and filters in memory as the user types.
export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const r of races2026) {
    items.push({
      id: `race:${r.slug}`,
      label: r.office,
      href: PROFILED_RACE_SLUGS.includes(r.slug)
        ? `/elections/${r.slug}/`
        : `/elections/#races`,
      kind: "Race",
    });
  }

  for (const raceSlug of PROFILED_RACE_SLUGS) {
    const race = getRaceBySlug(raceSlug);
    if (!race) continue;
    for (const c of candidatesForRace(raceSlug)) {
      items.push({
        id: `candidate:${c.slug}`,
        label: c.name,
        href: `/elections/${raceSlug}/${c.slug}/`,
        kind: "Candidate",
        hint: `${race.office}${c.incumbent ? " · incumbent" : ""}`,
      });
    }
  }

  for (const i of issues) {
    items.push({
      id: `issue:${i.slug}`,
      label: i.title,
      href: `/issues/${i.slug}/`,
      kind: "Issue",
    });
  }

  for (const group of officials) {
    for (const m of group.members) {
      items.push({
        id: `official:${m.slug}`,
        label: m.name,
        href: `/officials/#${m.slug}`,
        kind: "Official",
        hint: m.role,
      });
    }
  }

  return items;
}
