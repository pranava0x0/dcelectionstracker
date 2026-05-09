import type { Metadata } from "next";
import { issues, type Source } from "@/data/issues";

export const metadata: Metadata = {
  title: "Sources — DC Elections Tracker",
  description:
    "Every URL cited on this site, deduplicated and grouped by topic. Primary sources are preferred.",
};

type Grouped = { topic: string; sources: Source[] };

function collectSources(): Grouped[] {
  return issues.map((issue) => {
    const seen = new Map<string, Source>();
    const add = (s?: Source): void => {
      if (!s) return;
      if (!seen.has(s.url)) seen.set(s.url, s);
    };
    issue.stats.forEach((s) => add(s.source));
    issue.recentMoves.forEach((m) => add(m.source));
    issue.liveSources.forEach((s) => add(s));
    return {
      topic: issue.title,
      sources: Array.from(seen.values()).sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
    };
  });
}

export default function SourcesPage(): JSX.Element {
  const grouped = collectSources();
  const total = grouped.reduce((sum, g) => sum + g.sources.length, 0);

  return (
    <article className="mx-auto max-w-5xl px-4 pb-20 pt-10">
      <p className="kicker">Reference</p>
      <h1 className="display-tight mt-3 text-5xl text-ink sm:text-6xl">
        Every source cited on this site
      </h1>
      <p className="mt-4 max-w-3xl text-[17px] leading-snug text-fg">
        Deduplicated by URL, grouped by issue.{" "}
        <span className="font-mono font-semibold text-ink">{total}</span> unique sources
        across {grouped.length} topics. Primary sources (DC Council, OCFO, MPD, OSSE,
        DCBOE, congress.gov, courts.gov, WMATA, BLS, Census) are preferred; secondary
        reporting is used only when it is the available record of an event.
      </p>

      {grouped.map((g) => (
        <section key={g.topic} className="mt-12">
          <hr className="rule-thick" />
          <span className="kicker mt-3 inline-block">{g.topic}</span>
          <ul className="mt-3 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2">
            {g.sources.map((s) => (
              <li key={s.url} className="bg-paper">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 text-sm hover:bg-bg"
                >
                  <div className="text-fg">{s.label}</div>
                  <div className="mt-1 truncate font-mono text-[11px] text-muted">
                    {s.url}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
