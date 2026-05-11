import type { Metadata } from "next";
import { CandidateComparison } from "@/components/CandidateComparison";
import { Countdown } from "@/components/Countdown";
import {
  PRIMARY_DATE,
  GENERAL_DATE,
  candidatesForRace,
  importantDates,
  races2026,
  registrationLinks,
} from "@/data/elections";
import { partyTone } from "@/lib/party";

export const metadata: Metadata = {
  title: "2026 elections — DC Elections Tracker",
  description:
    "DC primary June 16, 2026. General November 3, 2026. Mayor, Council Chair, AG, four Council seats, two at-large seats, U.S. House Delegate, plus all ANCs.",
};

function statusTag(status: "open" | "incumbent" | "special"): string {
  if (status === "open") return "bg-primary text-primary-fg";
  if (status === "special") return "bg-ink text-white";
  return "bg-bg text-fg border border-rule";
}

export default function ElectionsPage(): JSX.Element {
  const future = importantDates.filter(
    (d) => new Date(d.iso).getTime() >= Date.now() - 24 * 3600 * 1000
  );

  return (
    <article className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <p className="kicker">2026 cycle</p>
      <h1 className="display-tight mt-3 text-4xl text-ink sm:text-5xl lg:text-6xl">
        Every DC race on the ballot in 2026
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-snug text-fg sm:text-[17px]">
        DC primary:{" "}
        <span className="font-mono font-semibold text-ink">June 16, 2026</span>. General
        election:{" "}
        <span className="font-mono font-semibold text-ink">November 3, 2026</span>.
        Ranked-choice voting debuts in this primary under Initiative 83. All ~345
        Advisory Neighborhood Commission seats are on the November 3 ballot.
      </p>

      <hr className="mt-8 rule-thick" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Countdown targetIso={PRIMARY_DATE} label="Until DC primary" />
        <Countdown targetIso={GENERAL_DATE} label="Until DC general" />
      </div>

      <section className="mt-10 sm:mt-14">
        <hr className="rule-thick" />
        <span className="kicker mt-3 inline-block">Calendar</span>
        <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">Key dates</h2>
        <ul className="mt-5 border-y border-rule bg-paper">
          {future.map((d) => (
            <li
              key={d.iso}
              className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <time
                className="font-mono text-[12px] font-bold uppercase tracking-wider text-primary sm:w-28"
                dateTime={d.iso}
              >
                {d.iso}
              </time>
              <span className="text-[15px] text-fg sm:flex-1">{d.label}</span>
              {d.source ? (
                <a
                  href={d.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted hover:text-primary"
                >
                  {d.source.label} ↗
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 sm:mt-14">
        <hr className="rule-thick" />
        <span className="kicker mt-3 inline-block">Ballot</span>
        <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">Races</h2>
        <p className="mt-2 max-w-3xl text-sm text-fg">
          Twelve citywide and ward-level races, plus all ANC seats. Tap a race to see
          declared candidates as of {new Date().toISOString().slice(0, 10)}. The DCBOE
          primary candidate roster is the authoritative source — see{" "}
          <a
            className="border-b border-primary text-primary hover:opacity-80"
            href="https://www.dcboe.org/candidates"
            target="_blank"
            rel="noopener noreferrer"
          >
            dcboe.org/candidates
          </a>
          .
        </p>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {races2026.map((r) => {
            const stripe =
              r.status === "open"
                ? "card-stripe-red"
                : r.status === "special"
                  ? "card-stripe-blue"
                  : "card-stripe-black";
            const candidates = candidatesForRace(r.slug);
            const count = candidates.length;
            return (
              <li key={r.slug} className={`card ${stripe} self-start`}>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="display text-base text-ink">{r.office}</h3>
                    <span
                      className={
                        "rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider " +
                        statusTag(r.status)
                      }
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-snug text-fg">{r.oneLine}</p>

                  {count > 0 ? (
                    <details className="group mt-3 border-t border-rule pt-3">
                      <summary className="flex cursor-pointer items-center justify-between gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:opacity-80">
                        <span>
                          {count} declared candidate{count === 1 ? "" : "s"}
                        </span>
                        <span aria-hidden className="transition-transform group-open:rotate-180">
                          ↓
                        </span>
                      </summary>
                      <ul className="mt-3 space-y-2">
                        {candidates.map((c) => {
                          const tone = partyTone(c.party);
                          return (
                            <li
                              key={`${r.slug}-${c.name}`}
                              className="flex items-baseline gap-2 text-sm"
                            >
                              <span
                                className={
                                  "inline-block rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider " +
                                  tone.pill
                                }
                                title={c.party === "TBD" ? "Party not yet declared" : c.party}
                              >
                                {tone.label}
                              </span>
                              <span className="text-ink">{c.name}</span>
                              {c.incumbent ? (
                                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                                  incumbent
                                </span>
                              ) : null}
                              <a
                                href={c.source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto font-mono text-[10px] font-semibold uppercase tracking-wider text-muted hover:text-primary"
                                aria-label={`${c.name} source: ${c.source.label}`}
                              >
                                {c.source.label} ↗
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-subtle">
                        Source: declared per linked outlets. Confirm filing status at
                        dcboe.org/candidates.
                      </p>
                    </details>
                  ) : (
                    <p className="mt-3 border-t border-rule pt-3 font-mono text-[11px] uppercase tracking-wider text-subtle">
                      No declared candidates listed yet
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10 sm:mt-14">
        <hr className="rule-thick" />
        <span className="kicker mt-3 inline-block">Compare</span>
        <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">
          Side-by-side candidate positions
        </h2>
        <CandidateComparison />
      </section>

      <section className="mt-10 sm:mt-14">
        <hr className="rule-thick" />
        <span className="kicker mt-3 inline-block">Take action</span>
        <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">
          Register · check · request · find
        </h2>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {registrationLinks.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover block px-4 py-3 text-sm text-fg hover:text-primary"
              >
                {l.label} <span aria-hidden className="text-subtle">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
