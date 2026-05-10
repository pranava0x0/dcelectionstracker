import Link from "next/link";
import type { Issue } from "@/data/issues";

type Props = { issue: Issue };

export function IssueCard({ issue }: Props): JSX.Element {
  const top = issue.stats[0];
  const isAlarm = top?.alarm === true;
  const stripe = isAlarm ? "card-stripe-red" : "card-stripe-black";

  return (
    <Link
      href={`/issues/${issue.slug}/`}
      className="card-link block"
    >
      <article className={`card ${stripe} flex h-full flex-col p-5`}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="kicker !text-fg">Issue</span>
          {top ? (
            <span
              className={
                "display text-3xl tabular-nums " +
                (isAlarm ? "text-primary" : "text-ink")
              }
            >
              {top.value}
            </span>
          ) : null}
        </div>
        <h3 className="display mt-4 text-xl text-ink">{issue.title}</h3>
        <p className="mt-2 text-[15px] leading-snug text-fg">{issue.oneLiner}</p>
        <div className="mt-auto pt-5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
          Read the brief <span aria-hidden>→</span>
        </div>
      </article>
    </Link>
  );
}
