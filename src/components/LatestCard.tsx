import type { Alert } from "@/data/alerts";

export function LatestCard({ alert }: { alert: Alert }): JSX.Element {
  return (
    <a
      href={alert.href}
      target="_blank"
      rel="noopener noreferrer"
      className="card-link block h-full"
    >
      <article className="card card-stripe-red flex h-full flex-col p-4">
        <time
          className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary"
          dateTime={alert.date}
        >
          {alert.date}
        </time>
        <h3 className="display mt-2 text-base leading-snug text-ink">
          {alert.headline}
        </h3>
        <span className="mt-auto pt-4 font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
          Read source ↗
        </span>
      </article>
    </a>
  );
}
