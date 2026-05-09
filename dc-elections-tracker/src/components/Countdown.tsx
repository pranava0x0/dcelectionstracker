"use client";

import { useEffect, useState } from "react";

type Props = {
  targetIso: string;
  label: string;
  compact?: boolean;
};

type Parts = { days: number; hours: number; minutes: number; passed: boolean };

function diffParts(targetIso: string): Parts {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const ms = target - now;
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, passed: true };
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms - days * day) / hour);
  const minutes = Math.floor((ms - days * day - hours * hour) / minute);
  return { days, hours, minutes, passed: false };
}

export function Countdown({ targetIso, label, compact }: Props): JSX.Element {
  const [parts, setParts] = useState<Parts>(() => diffParts(targetIso));

  useEffect(() => {
    const tick = (): void => setParts(diffParts(targetIso));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  if (compact) {
    return (
      <span
        className="font-mono text-sm"
        aria-label={`${label}: ${parts.passed ? "passed" : `${parts.days} days`}`}
      >
        {parts.passed ? (
          <span className="text-subtle">{label} · passed</span>
        ) : (
          <>
            <span className="font-bold text-primary">{parts.days}d</span>
            <span className="ml-1 text-muted">{parts.hours}h</span>
            <span className="ml-2 text-subtle">{label}</span>
          </>
        )}
      </span>
    );
  }

  return (
    <div
      className="card card-stripe-red p-5"
      aria-label={`${label} countdown`}
    >
      <div className="kicker !text-fg">{label}</div>
      {parts.passed ? (
        <div className="display mt-3 text-3xl text-subtle">Election day passed.</div>
      ) : (
        <div className="mt-3 flex items-baseline gap-3">
          <span className="display-tight text-6xl tabular-nums text-primary">
            {parts.days}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-fg">
            days
          </span>
          <span className="ml-2 font-mono text-xs tabular-nums text-muted">
            {parts.hours}h {parts.minutes}m
          </span>
        </div>
      )}
    </div>
  );
}
