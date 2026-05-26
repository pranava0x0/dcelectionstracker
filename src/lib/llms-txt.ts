import { issues, type Issue } from "@/data/issues";
import {
  candidatesForRace,
  getRaceBySlug,
  importantDates,
  PROFILED_RACE_SLUGS,
  races2026,
  RACE_STATUS_LABEL,
  type Candidate,
  type Race,
} from "@/data/elections";
import { officials } from "@/data/officials";

// llms.txt convention: https://llmstxt.org/
// Two files generated at build time:
//   - /llms.txt       — short index, ~10KB, sectioned link list with one-line blurbs
//   - /llms-full.txt  — long markdown with full content (stats, stakes, positions)
// Both are written to public/ by scripts/build-llms.mjs so they ship as
// plain static files under the GitHub Pages basePath.

export function generateLLMsTxt(baseUrl: string): string {
  const lines: string[] = [];
  const u = (path: string): string => `${baseUrl}${path}`;

  lines.push("# DC Elections Tracker");
  lines.push("");
  lines.push(
    "> Independent, sourced, opinionated voter brief for Washington, DC residents covering the 2026 election cycle. Tracks 12 races, ~40 candidates, 7 issues, current officials, and voting records. Every numeric claim links to a primary source.",
  );
  lines.push("");
  lines.push(
    "The site is non-partisan but not neutral. It takes positions about transparency, accountability, and who pays. It does not take positions about parties or candidates. The DC primary is June 16, 2026 — the first to use ranked-choice voting. The general election is November 3, 2026.",
  );
  lines.push("");

  lines.push("## Voter tools");
  lines.push("");
  lines.push(`- [Home](${u("/")}): Live countdown, today's deadline (if any), three latest moves, and seven-issue brief.`);
  lines.push(`- [What's on your ballot — address lookup](${u("/elections/#lookup")}): Enter a DC street address to see your ward, ANC, single-member district, the races on your primary ballot, and how your council member has voted on tracked bills.`);
  lines.push(`- [Compare candidates side-by-side](${u("/elections/compare/")}): Mayor, At-Large (Bonds seat), and Ward 1 candidates on the seven tracked issues. Every stance sourced.`);
  lines.push("");

  lines.push("## 2026 races");
  lines.push("");
  for (const r of races2026) {
    const path = PROFILED_RACE_SLUGS.includes(r.slug)
      ? `/elections/${r.slug}/`
      : `/elections/#races`;
    lines.push(`- [${r.office} (${RACE_STATUS_LABEL[r.status]})](${u(path)}): ${r.oneLine}`);
  }
  lines.push("");

  lines.push("## Candidates (profiled races)");
  lines.push("");
  for (const slug of PROFILED_RACE_SLUGS) {
    const race = getRaceBySlug(slug);
    if (!race) continue;
    for (const c of candidatesForRace(slug)) {
      const tag = c.incumbent ? "incumbent" : c.filingStatus;
      const desc = c.notes ?? `${tag} candidate for ${race.office}.`;
      lines.push(`- [${c.name} — ${race.office}](${u(`/elections/${slug}/${c.slug}/`)}): ${desc}`);
    }
  }
  lines.push("");

  lines.push("## Issues");
  lines.push("");
  for (const i of issues) {
    lines.push(`- [${i.title}](${u(`/issues/${i.slug}/`)}): ${i.oneLiner}`);
  }
  lines.push("");

  lines.push("## Officials currently in office");
  lines.push("");
  lines.push(`- [Officials directory](${u("/officials/")}): Mayor, Attorney General, all 13 Council members, U.S. House Delegate, three shadow representatives, and the nine-member State Board of Education.`);
  for (const group of officials) {
    for (const m of group.members) {
      lines.push(`- [${m.name} (${m.role})](${u(`/officials/#${m.slug}`)}): ${m.party} · term ends ${m.termEnds}.`);
    }
  }
  lines.push("");

  lines.push("## Key dates");
  lines.push("");
  for (const d of importantDates) {
    lines.push(`- ${d.iso}: ${d.label}`);
  }
  lines.push("");

  lines.push("## Reference");
  lines.push("");
  lines.push(`- [About this site](${u("/about/")}): Editorial standard, voice rules, and sourcing principles.`);
  lines.push(`- [Every source cited](${u("/sources/")}): Deduplicated list of every URL referenced on the site, grouped by organization (DC government, federal, statistical, regional, press).`);
  lines.push(`- [Full long-form content (llms-full.txt)](${u("/llms-full.txt")}): Full issue text, candidate positions, and voting records as plain markdown for ingestion.`);
  lines.push("");

  return lines.join("\n");
}

function renderIssue(issue: Issue, baseUrl: string): string[] {
  const lines: string[] = [];
  lines.push(`## ${issue.title}`);
  lines.push("");
  lines.push(`URL: ${baseUrl}/issues/${issue.slug}/`);
  lines.push("");
  lines.push(`> ${issue.oneLiner}`);
  lines.push("");
  if (issue.hero) {
    lines.push(issue.hero);
    lines.push("");
  }
  if (issue.quickTake && issue.quickTake.length > 0) {
    lines.push("### Quick take");
    lines.push("");
    for (const bullet of issue.quickTake) lines.push(`- ${bullet}`);
    lines.push("");
  }
  if (issue.stats.length > 0) {
    lines.push("### Stats");
    lines.push("");
    for (const s of issue.stats) {
      const src = s.source ? ` [${s.source.label}](${s.source.url})` : "";
      lines.push(`- **${s.value}** — ${s.label}${src}`);
    }
    lines.push("");
  }
  if (issue.whatsAtStake.length > 0) {
    lines.push("### What's at stake");
    lines.push("");
    for (const stake of issue.whatsAtStake) {
      lines.push(`- **${stake.headline}** — ${stake.detail}`);
    }
    lines.push("");
  }
  if (issue.whoDecides.length > 0) {
    lines.push("### Who decides");
    lines.push("");
    for (const d of issue.whoDecides) {
      lines.push(`- ${d.name} — ${d.role}`);
    }
    lines.push("");
  }
  if (issue.recentMoves.length > 0) {
    lines.push("### Recent moves");
    lines.push("");
    for (const m of issue.recentMoves) {
      lines.push(`- ${m.date}: ${m.headline} [${m.source.label}](${m.source.url})`);
    }
    lines.push("");
  }
  if (issue.voterQuestions.length > 0) {
    lines.push("### Questions to put to candidates");
    lines.push("");
    for (const q of issue.voterQuestions) lines.push(`- ${q}`);
    lines.push("");
  }
  if (issue.liveSources.length > 0) {
    lines.push("### Live sources");
    lines.push("");
    for (const s of issue.liveSources) {
      lines.push(`- [${s.label}](${s.url})`);
    }
    lines.push("");
  }
  return lines;
}

function renderRace(race: Race, baseUrl: string): string[] {
  const lines: string[] = [];
  lines.push(`## ${race.office}`);
  lines.push("");
  const path = PROFILED_RACE_SLUGS.includes(race.slug)
    ? `/elections/${race.slug}/`
    : `/elections/#races`;
  lines.push(`URL: ${baseUrl}${path}`);
  lines.push("");
  lines.push(`Status: ${RACE_STATUS_LABEL[race.status]}`);
  lines.push("");
  lines.push(race.oneLine);
  lines.push("");
  const candidates = candidatesForRace(race.slug);
  if (candidates.length > 0) {
    lines.push(`### Declared candidates (${candidates.length})`);
    lines.push("");
    for (const c of candidates) {
      lines.push(...renderCandidate(c, race, baseUrl));
    }
  }
  return lines;
}

function renderCandidate(c: Candidate, race: Race, baseUrl: string): string[] {
  const lines: string[] = [];
  const isProfiled = PROFILED_RACE_SLUGS.includes(race.slug);
  const heading = isProfiled
    ? `[${c.name}](${baseUrl}/elections/${race.slug}/${c.slug}/)`
    : c.name;
  const tags = [c.party, c.incumbent ? "incumbent" : null, c.filingStatus]
    .filter(Boolean)
    .join(" · ");
  lines.push(`#### ${heading}`);
  lines.push(`*${tags}*`);
  lines.push("");
  if (c.notes) {
    lines.push(c.notes);
    lines.push("");
  }
  if (c.bio) {
    lines.push(c.bio);
    lines.push("");
  }
  if (c.positions) {
    const stated = Object.entries(c.positions).filter(([, p]) => p);
    if (stated.length > 0) {
      lines.push("Positions:");
      for (const [issueSlug, pos] of stated) {
        if (!pos) continue;
        lines.push(`- **${issueSlug}**: ${pos.stance} [${pos.sourceLabel}](${pos.sourceUrl})`);
      }
      lines.push("");
    }
  }
  return lines;
}

export function generateLLMsFullTxt(baseUrl: string): string {
  const lines: string[] = [];

  lines.push("# DC Elections Tracker — full content");
  lines.push("");
  lines.push(
    "> Long-form export for LLM ingestion. Includes every issue page, every race overview, every profiled candidate's stated positions, and the key-dates calendar. For the short index, see /llms.txt.",
  );
  lines.push("");

  lines.push("# Issues");
  lines.push("");
  for (const issue of issues) {
    lines.push(...renderIssue(issue, baseUrl));
  }

  lines.push("# Races");
  lines.push("");
  for (const race of races2026) {
    lines.push(...renderRace(race, baseUrl));
  }

  lines.push("# Officials");
  lines.push("");
  for (const group of officials) {
    lines.push(`## ${group.group}`);
    lines.push("");
    lines.push(group.blurb);
    lines.push("");
    for (const m of group.members) {
      lines.push(`- **${m.name}** — ${m.role}, ${m.party}, term ends ${m.termEnds}.${m.notes ? " " + m.notes : ""} Source: [${m.source.label}](${m.source.url})`);
    }
    lines.push("");
  }

  lines.push("# Key dates");
  lines.push("");
  for (const d of importantDates) {
    const src = d.source ? ` [${d.source.label}](${d.source.url})` : "";
    lines.push(`- ${d.iso}: ${d.label}${src}`);
  }
  lines.push("");

  return lines.join("\n");
}
