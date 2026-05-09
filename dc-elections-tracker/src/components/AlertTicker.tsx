import { alerts } from "@/data/alerts";

export function AlertTicker(): JSX.Element {
  const items = alerts.slice(0, 8);
  const loop = [...items, ...items];

  return (
    <div
      role="region"
      aria-label="Recent moves affecting DC voters"
      className="border-b border-rule bg-paper"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-0 overflow-hidden px-4">
        <span className="shrink-0 bg-primary px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-fg">
          Live
        </span>
        <span className="shrink-0 border-y border-r border-rule px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-fg">
          Recent moves
        </span>
        <div className="relative w-full overflow-hidden py-1.5 pl-3">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-sm">
            {loop.map((a, i) => (
              <a
                key={`${a.date}-${i}`}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg transition-colors hover:text-primary"
              >
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-subtle">
                  {a.date}
                </span>
                <span className="mx-2 text-subtle">·</span>
                <span className="font-medium">{a.headline}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
