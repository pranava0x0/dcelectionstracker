import type { Issue, Stat } from "@/data/issues";
import { CollapsibleSection } from "./CollapsibleSection";
import { JumpStrip } from "./JumpStrip";

function StatTile({ stat }: { stat: Stat }): JSX.Element {
  const isAlarm = stat.alarm === true;
  return (
    <div
      className={
        "flex flex-col gap-2 border-t-2 bg-paper p-4 " +
        (isAlarm ? "border-primary" : "border-rule")
      }
    >
      <div
        className={
          "display text-3xl tabular-nums sm:text-4xl " +
          (isAlarm ? "text-primary" : "text-ink")
        }
      >
        {stat.value}
      </div>
      <div className="text-sm leading-snug text-fg">{stat.label}</div>
      {stat.source ? (
        <a
          href={stat.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-block py-1 font-mono text-xs font-semibold uppercase tracking-wider text-muted hover:text-primary"
        >
          {stat.source.label} <span aria-hidden>↗</span>
        </a>
      ) : null}
    </div>
  );
}

function SectionHead({
  kicker,
  title,
  id,
}: {
  kicker: string;
  title: string;
  id?: string;
}): JSX.Element {
  return (
    <header id={id} className="mt-8 sm:mt-12 lg:mt-14 scroll-mt-16">
      <hr className="rule-thick" />
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <span className="kicker">{kicker}</span>
      </div>
      <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">{title}</h2>
    </header>
  );
}

export function IssueDetail({ issue }: { issue: Issue }): JSX.Element {
  return (
    <article className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <p className="kicker">Issue</p>
      <h1 className="display-tight mt-3 text-3xl text-ink sm:text-4xl lg:text-5xl">
        {issue.title}
      </h1>
      <p className="mt-3 max-w-3xl text-lg font-medium leading-snug text-primary sm:mt-4 sm:text-xl">
        {issue.oneLiner}
      </p>
      <JumpStrip
        chips={[
          { href: "#stats", label: "Stats" },
          { href: "#stakes", label: "Stakes" },
          { href: "#timeline", label: "Timeline" },
        ]}
      />

      <hr className="mt-6 rule-thick sm:mt-8" />
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-fg sm:mt-6 sm:text-[17px]">
        {issue.hero}
      </p>

      <section
        id="stats"
        className="mt-8 grid scroll-mt-16 grid-cols-1 gap-px bg-rule sm:mt-10 sm:grid-cols-2 lg:grid-cols-4"
      >
        {issue.stats.map((s, i) => (
          <StatTile key={i} stat={s} />
        ))}
      </section>

      <SectionHead id="stakes" kicker="The fight" title="What's at stake" />
      <div className="mt-5 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {issue.whatsAtStake.map((s, i) => (
          <div key={i} className="bg-paper p-5">
            <h3 className="display text-lg text-ink">{s.headline}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg">{s.detail}</p>
          </div>
        ))}
      </div>

      <CollapsibleSection kicker="Power" title="Who decides">
        <ul className="mt-5 border-y border-rule bg-paper">
          {issue.whoDecides.map((d, i) => (
            <li
              key={i}
              className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="display text-base text-ink sm:w-1/3">{d.name}</span>
              <span className="text-sm leading-snug text-fg sm:flex-1">{d.role}</span>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      <SectionHead id="timeline" kicker="Timeline" title="Recent moves" />
      <ol className="mt-5 border-y border-rule bg-paper">
        {issue.recentMoves.map((m, i) => (
          <li
            key={i}
            className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <time
              className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary sm:w-24"
              dateTime={m.date}
            >
              {m.date}
            </time>
            <span className="text-[15px] text-fg sm:flex-1">{m.headline}</span>
            <a
              href={m.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-1 font-mono text-xs font-semibold uppercase tracking-wider text-muted hover:text-primary"
            >
              {m.source.label} ↗
            </a>
          </li>
        ))}
      </ol>

      <CollapsibleSection kicker="Ask" title="Questions to put to candidates">
        <ul className="mt-5 space-y-3 border-l-2 border-primary pl-4 sm:pl-5">
          {issue.voterQuestions.map((q, i) => (
            <li key={i} className="text-base leading-relaxed text-fg sm:text-[17px]">
              {q}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      <CollapsibleSection kicker="Reference" title="Live sources">
        <ul className="mt-5 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2">
          {issue.liveSources.map((s, i) => (
            <li key={i} className="bg-paper">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 text-sm text-fg hover:bg-bg hover:text-primary"
              >
                {s.label} <span aria-hidden className="text-subtle">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleSection>
    </article>
  );
}
