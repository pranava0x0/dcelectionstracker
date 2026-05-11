import type { Metadata } from "next";
import { MemberVotingMiniRecord, VotingRecordMatrix } from "@/components/VotingRecordMatrix";
import { officials } from "@/data/officials";
import { partyTone } from "@/lib/party";

export const metadata: Metadata = {
  title: "DC officials — DC Elections Tracker",
  description:
    "Every elected official in DC government — Mayor, AG, Council, Delegate, shadow representatives, State Board of Education — with party label and term-end date.",
};

export default function OfficialsPage(): JSX.Element {
  return (
    <article className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <p className="kicker">Reference</p>
      <h1 className="display-tight mt-3 text-4xl text-ink sm:text-5xl lg:text-6xl">
        Who currently holds office in DC
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-snug text-fg sm:text-[17px]">
        Mayor, Attorney General, all 13 Council members, the U.S. House Delegate, three
        statehood-advocacy &quot;shadow&quot; representatives, and the nine-member State
        Board of Education. Party labels and term-end dates are drawn from{" "}
        <a
          className="border-b border-primary text-primary hover:opacity-80"
          href="https://dccouncil.gov/councilmembers/"
          target="_blank"
          rel="noopener noreferrer"
        >
          dccouncil.gov
        </a>
        ,{" "}
        <a
          className="border-b border-primary text-primary hover:opacity-80"
          href="https://mayor.dc.gov/"
          target="_blank"
          rel="noopener noreferrer"
        >
          mayor.dc.gov
        </a>
        ,{" "}
        <a
          className="border-b border-primary text-primary hover:opacity-80"
          href="https://oag.dc.gov/"
          target="_blank"
          rel="noopener noreferrer"
        >
          oag.dc.gov
        </a>
        , and{" "}
        <a
          className="border-b border-primary text-primary hover:opacity-80"
          href="https://sboe.dc.gov/page/board-biographies"
          target="_blank"
          rel="noopener noreferrer"
        >
          sboe.dc.gov
        </a>
        .
      </p>

      {officials.map((group) => (
        <section key={group.group} className="mt-10 sm:mt-12">
          <hr className="rule-thick" />
          <span className="kicker mt-3 inline-block">{group.group}</span>
          <p className="mt-1 max-w-3xl text-sm text-fg">{group.blurb}</p>

          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.members.map((m) => {
              const tone = partyTone(m.party);
              return (
                <li
                  key={`${group.group}-${m.name}`}
                  className="card card-hover overflow-hidden"
                >
                  <div className={`h-1 ${tone.stripe}`} />
                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="display text-lg text-ink">{m.name}</span>
                      <span
                        className={
                          "inline-flex h-5 min-w-[20px] items-center justify-center rounded-sm px-1.5 font-mono text-[10px] font-bold uppercase tracking-wider " +
                          tone.pill
                        }
                        title={m.party}
                      >
                        {tone.label}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                      {m.role}
                    </div>
                    <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-subtle">
                      Term ends {m.termEnds}
                    </div>

                    {/* Mobile (< sm): notes + source link collapse behind a "Background ↓" toggle. */}
                    <details className="group mt-3 sm:hidden">
                      <summary className="flex cursor-pointer items-baseline justify-between gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-muted hover:text-primary">
                        <span>{m.notes ? "Background" : "Source"}</span>
                        <span aria-hidden className="transition-transform group-open:rotate-180">↓</span>
                      </summary>
                      {m.notes ? (
                        <p className="mt-2 text-sm leading-snug text-fg">{m.notes}</p>
                      ) : null}
                      <a
                        href={m.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-primary hover:opacity-80"
                      >
                        {m.source.label} ↗
                      </a>
                    </details>

                    {/* Tablet & desktop (>= sm): notes + source always visible. */}
                    <div className="hidden sm:block">
                      {m.notes ? (
                        <p className="mt-3 text-sm leading-snug text-fg">{m.notes}</p>
                      ) : null}
                      <a
                        href={m.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block font-mono text-[10px] font-bold uppercase tracking-wider text-primary hover:opacity-80"
                      >
                        {m.source.label} ↗
                      </a>
                    </div>

                    <MemberVotingMiniRecord memberSlug={m.slug} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="mt-10 sm:mt-14">
        <hr className="rule-thick" />
        <span className="kicker mt-3 inline-block">Records</span>
        <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">
          Council voting record on tracked bills
        </h2>
        <VotingRecordMatrix />
      </section>

      <aside className="card card-stripe-red mt-10 p-4 sm:mt-14 sm:p-5">
        <span className="kicker">Footnote</span>
        <h2 className="display mt-1 text-lg text-ink sm:text-xl">
          A note on Advisory Neighborhood Commissions
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-fg">
          DC also has 46 Advisory Neighborhood Commissions, with about 345 unpaid
          commissioners elected to two-year terms. DC agencies are required to give{" "}
          <em>great weight</em> to ANC recommendations on liquor licenses, zoning,
          historic preservation, and traffic. All ANC seats are on the November 3, 2026
          ballot. ANC commissioners are not listed individually on this site in v1 —
          see{" "}
          <a
            className="border-b border-primary text-primary hover:opacity-80"
            href="https://oanc.dc.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            oanc.dc.gov
          </a>{" "}
          for the directory.
        </p>
      </aside>
    </article>
  );
}
