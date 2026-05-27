import type { Metadata } from "next";
import Link from "next/link";
import { MemberVotingMiniRecord, VotingRecordMatrix } from "@/components/VotingRecordMatrix";
import { officials } from "@/data/officials";
import { partyTone } from "@/lib/party";

export const metadata: Metadata = {
  title: "DC officials — DC Elections Tracker",
  description:
    "Every elected official in DC government — Mayor, AG, Council, Delegate, shadow representatives, State Board of Education — with party label and term-end date.",
};

// Short chip labels for the always-visible TOC under the page hero. The page is
// long (~20k px) and screen readers need group <h2> anchors to be findable —
// see UAT-018 / BL-UAT-11. The full group title still renders inside each section.
const TOC_CHIPS: Record<string, string> = {
  executive: "Executive",
  "council-chair-at-large": "Chair + At-Large",
  "council-wards": "Wards", // not directly rendered as one chip — exploded into W1..W8 below
  federal: "Federal",
  sboe: "State Board",
};

// Build per-ward chip list from the council-wards group. Each chip anchors to the
// individual member's card (id={m.slug}), not the group h2, so a voter clicks
// "W1" and lands directly on their council member's card — no second scroll.
function buildWardChips(): { ward: string; slug: string }[] {
  const wards = officials.find((g) => g.slug === "council-wards");
  if (!wards) return [];
  return wards.members
    .filter((m) => m.ward)
    .sort((a, b) => Number(a.ward) - Number(b.ward))
    .map((m) => ({ ward: m.ward as string, slug: m.slug }));
}

export default function OfficialsPage(): JSX.Element {
  return (
    <article className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <p className="kicker">Reference</p>
      <h1 className="display-tight mt-3 text-3xl text-ink sm:text-5xl lg:text-6xl">
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

      <nav
        aria-label="Jump to officials group or ward"
        className="-mx-4 mt-6 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max items-center gap-2 pb-1">
          {officials.map((group) => {
            // For the wards group, explode into per-ward chips. Voter clicks W3 →
            // lands directly on their council member's card, no second scroll.
            if (group.slug === "council-wards") {
              return (
                <li key={group.slug} className="flex items-center gap-2">
                  <span className="ml-1 mr-0.5 hidden font-mono text-[10px] font-bold uppercase tracking-wider text-muted sm:inline">
                    Wards
                  </span>
                  {buildWardChips().map(({ ward, slug }) => (
                    <a
                      key={ward}
                      href={`#${slug}`}
                      className="inline-flex h-10 shrink-0 items-center rounded-sm border border-rule bg-paper px-3 font-mono text-[11px] font-bold uppercase tracking-wider text-fg hover:border-primary hover:text-primary"
                      aria-label={`Jump to Ward ${ward} council member`}
                    >
                      W{ward}
                    </a>
                  ))}
                </li>
              );
            }
            return (
              <li key={group.slug}>
                <a
                  href={`#${group.slug}`}
                  className="inline-flex h-10 shrink-0 items-center rounded-sm border border-rule bg-paper px-3 font-mono text-[11px] font-bold uppercase tracking-wider text-fg hover:border-primary hover:text-primary"
                >
                  {TOC_CHIPS[group.slug] ?? group.group}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {officials.map((group) => (
        <section key={group.group} className="mt-8 scroll-mt-16 sm:mt-12 lg:mt-14" id={group.slug}>
          <hr className="rule-thick" />
          <h2 className="kicker mt-3 inline-block">{group.group}</h2>
          <p className="mt-1 max-w-3xl text-sm text-fg">{group.blurb}</p>

          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.members.map((m) => {
              const tone = partyTone(m.party);
              return (
                <li
                  key={`${group.group}-${m.name}`}
                  id={m.slug}
                  className="card card-hover scroll-mt-16 overflow-hidden"
                >
                  <div className={`h-1 ${tone.stripe}`} />
                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <Link
                        href={`/officials/${m.slug}/`}
                        className="display text-lg text-ink hover:text-primary"
                      >
                        {m.name}
                      </Link>
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
                        className="mt-2 inline-block py-1 font-mono text-xs font-bold uppercase tracking-wider text-primary hover:opacity-80"
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
                        className="mt-3 inline-block py-1 font-mono text-xs font-bold uppercase tracking-wider text-primary hover:opacity-80"
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

      <section className="mt-8 sm:mt-12 lg:mt-14">
        <hr className="rule-thick" />
        <span className="kicker mt-3 inline-block">Records</span>
        <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">
          Council voting record on tracked bills
        </h2>
        <VotingRecordMatrix />
      </section>

      <aside className="card card-stripe-red mt-8 p-4 sm:mt-12 sm:p-5 lg:mt-14">
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
