import type { Metadata } from "next";
import { RcvSimulator } from "@/components/RcvSimulator";

export const metadata: Metadata = {
  title: "Ranked-choice voting — DC Elections Tracker",
  description:
    "How DC's first ranked-choice primary works on June 16, 2026. Stats, a plain-language walkthrough, and an interactive ballot simulator.",
};

type Stat = { value: string; label: string; source?: { label: string; url: string }; alarm?: boolean };

const stats: Stat[] = [
  {
    value: "1st",
    label: "ranked-choice primary in DC history (June 16, 2026)",
    alarm: true,
    source: { label: "DCBOE — Ranked-Choice Voting", url: "https://www.dcboe.org/elections/ranked-choice-voting" },
  },
  {
    value: "74%",
    label: "of DC voters approved Initiative 83 (November 2024)",
    source: {
      label: "DCBOE — General Election Results 2024",
      url: "https://electionresults.dcboe.org/election_results/2024-General-Election",
    },
  },
  {
    value: "5",
    label: "maximum number of candidates a voter may rank in each race",
    source: {
      label: "DC Law 25-295 (Initiative 83 codified)",
      url: "https://code.dccouncil.gov/us/dc/council/laws/25-295",
    },
  },
  {
    value: "8–4",
    label: "Council vote (July 2025) to fund RCV implementation; open-primary provisions left unfunded",
    source: {
      label: "DC Council — FY26 budget",
      url: "https://dccouncil.gov/dc-council-passes-fy26-budget/",
    },
  },
];

type Stake = { headline: string; detail: string };

const whatChanged: Stake[] = [
  {
    headline: "Initiative 83 passed with 74% approval",
    detail:
      "Voters approved RCV at the November 2024 general election. The measure became DC Law 25-295 and applies to all races in the District's party primaries — Mayor, Council, At-Large, Attorney General, Delegate, and SBOE.",
  },
  {
    headline: "Council funded RCV, not open primaries",
    detail:
      "The Council voted 8–4 in July 2025 to fund the ranked-choice tabulation system in the FY26 budget. The open-primary half of Initiative 83 — which would have let independents vote in party primaries — was not funded, and remains in legal limbo.",
  },
  {
    headline: "DCBOE rules and ballot are still being finalized",
    detail:
      "DCBOE's RCV regulations were not fully finalized as of late 2025. The agency is publishing voter-education materials on a rolling basis. Sample ballots will appear at dcboe.org closer to the primary; this page will be updated once they're released.",
  },
];

type Decider = { name: string; role: string };

const whoDecides: Decider[] = [
  { name: "DC Board of Elections (DCBOE)", role: "Implements RCV in the June 16, 2026 primary, prints ranked ballots, runs the round-by-round tabulation, and publishes round-level results." },
  { name: "DC Council", role: "Wrote the implementing statute (DC Law 25-295) and decides each year whether to fund the tabulation infrastructure and voter education." },
  { name: "DC voters", role: "Cast a ranked ballot — up to five choices per race. You can rank fewer than five; you cannot rank the same candidate twice." },
];

type Move = { date: string; headline: string; source: { label: string; url: string } };

const recentMoves: Move[] = [
  {
    date: "2025-07-15",
    headline: "Council votes 8–4 to fund ranked-choice tabulation in FY26 budget",
    source: { label: "DC Council", url: "https://dccouncil.gov/dc-council-passes-fy26-budget/" },
  },
  {
    date: "2024-11-05",
    headline: "Initiative 83 passes with 74% — RCV and open primaries approved",
    source: {
      label: "DCBOE — 2024 General Results",
      url: "https://electionresults.dcboe.org/election_results/2024-General-Election",
    },
  },
];

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
  {
    q: "Do I have to rank all five candidates?",
    a: "No. You can rank as few or as many as you want, up to five. Ranking only your top choice is the same as voting in a regular election; your ballot just won't transfer if that candidate is eliminated.",
  },
  {
    q: "What happens if my first choice wins in round one?",
    a: "Nothing further happens with your ballot — your candidate has a majority of first-place votes, the count is over, and your vote counted exactly once.",
  },
  {
    q: "What if all my ranked choices are eliminated?",
    a: "Your ballot becomes 'exhausted' — it stops counting in subsequent rounds. The winner is decided by whoever has a majority of the remaining (non-exhausted) ballots. Ranking five different candidates makes exhaustion much less likely than ranking just one or two.",
  },
  {
    q: "Does ranking a second choice hurt my first choice?",
    a: "No. Your second choice only ever comes into play after your first choice is eliminated. While your first choice is still in the running, every count uses your first-choice vote.",
  },
  {
    q: "Does this take longer to count?",
    a: "The first-round count is the same speed as any election. Subsequent rounds are computed by DCBOE's tabulation system after all first-choice ballots are tallied. Expect unofficial first-round totals on election night and full round-by-round results within the certification window.",
  },
  {
    q: "Does ranked-choice voting apply to the general election?",
    a: "No — only the primary. The general election in November 2026 is a single-choice vote between each party's nominee plus any independent or third-party candidates who qualify.",
  },
];

type Source = { label: string; url: string };

const liveSources: Source[] = [
  { label: "DCBOE — Ranked-Choice Voting overview", url: "https://www.dcboe.org/elections/ranked-choice-voting" },
  { label: "DC Law 25-295 — Initiative 83 codified", url: "https://code.dccouncil.gov/us/dc/council/laws/25-295" },
  { label: "Make All Votes Count DC — campaign site & full Initiative 83 text", url: "https://makeallvotescountdc.org/" },
  { label: "FairVote — RCV Resource Center", url: "https://fairvote.org/our-reforms/ranked-choice-voting/" },
];

function StatTile({ stat }: { stat: Stat }): JSX.Element {
  const isAlarm = stat.alarm === true;
  return (
    <div
      className={
        "flex flex-col gap-2 border-t-2 bg-paper p-4 " + (isAlarm ? "border-primary" : "border-rule")
      }
    >
      <div
        className={
          "display text-3xl tabular-nums sm:text-4xl " + (isAlarm ? "text-primary" : "text-ink")
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
          className="mt-auto font-mono text-[11px] font-semibold uppercase tracking-wider text-muted hover:text-primary"
        >
          {stat.source.label} <span aria-hidden>↗</span>
        </a>
      ) : null}
    </div>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }): JSX.Element {
  return (
    <header className="mt-8 sm:mt-12 lg:mt-14">
      <hr className="rule-thick" />
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <span className="kicker">{kicker}</span>
      </div>
      <h2 className="display mt-1 text-2xl text-ink sm:text-3xl">{title}</h2>
    </header>
  );
}

export default function RankedChoicePage(): JSX.Element {
  return (
    <article className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <p className="kicker">Issue</p>
      <h1 className="display-tight mt-3 text-3xl text-ink sm:text-4xl lg:text-5xl">
        Ranked-choice voting
      </h1>
      <p className="mt-3 max-w-3xl text-lg font-medium leading-snug text-primary sm:mt-4 sm:text-xl">
        DC&apos;s first-ever ranked-choice primary is June 16, 2026. Here&apos;s how the ballot
        works and why your second choice can matter.
      </p>
      <hr className="mt-6 rule-thick sm:mt-8" />
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-fg sm:mt-6 sm:text-[17px]">
        In 2024, DC voters approved Initiative 83 with 74% of the vote, making the District the
        first U.S. capital to adopt ranked-choice voting for its party primaries. In June 2026,
        DC voters will use a ranked ballot for the first time in a real election —
        instead of choosing one candidate per race, you can rank up to five in order of
        preference. If no one wins a majority of first-choice votes, the lowest finisher is
        eliminated and their ballots transfer to each voter&apos;s next remaining choice. Rounds
        repeat until someone has a majority.
      </p>

      <section className="mt-8 grid grid-cols-1 gap-px bg-rule sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatTile key={i} stat={s} />
        ))}
      </section>

      <SectionHead kicker="The shift" title="What changed" />
      <div className="mt-5 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {whatChanged.map((s, i) => (
          <div key={i} className="bg-paper p-5">
            <h3 className="display text-lg text-ink">{s.headline}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg">{s.detail}</p>
          </div>
        ))}
      </div>

      <SectionHead kicker="Mechanics" title="How tabulation works" />
      <ol className="mt-5 space-y-4">
        <li className="border-l-2 border-primary bg-paper p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
            Round 1
          </p>
          <p className="mt-2 text-base leading-relaxed text-fg sm:text-[17px]">
            Every ballot&apos;s 1st-choice vote is counted. If any candidate has more than half
            of the first-choice votes, they win and counting stops.
          </p>
        </li>
        <li className="border-l-2 border-primary bg-paper p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
            Round 2+
          </p>
          <p className="mt-2 text-base leading-relaxed text-fg sm:text-[17px]">
            The candidate with the fewest votes is eliminated. Every ballot that ranked the
            eliminated candidate first is now transferred to that voter&apos;s 2nd choice — if
            their 2nd choice is also eliminated, the ballot moves to the 3rd, and so on. The
            count is re-tallied with the remaining candidates.
          </p>
        </li>
        <li className="border-l-2 border-primary bg-paper p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
            Repeat
          </p>
          <p className="mt-2 text-base leading-relaxed text-fg sm:text-[17px]">
            Eliminate, transfer, recount. Rounds continue until one candidate has a majority of
            the ballots still in play. Ballots whose ranked choices have all been eliminated are
            set aside as &quot;exhausted&quot; and no longer count toward the majority threshold.
          </p>
        </li>
      </ol>

      <SectionHead kicker="Ballot" title="Your ballot" />
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-fg sm:text-[17px]">
        For each race on the June 16, 2026 ballot, you&apos;ll see candidate names with columns
        for 1st choice, 2nd choice, up to 5th. Fill in one bubble per column, one column per
        candidate — never the same candidate in two columns, never two candidates in the same
        column. You can rank fewer than five if you only have strong feelings about your top one
        or two. DCBOE&apos;s sample ballot will be published at dcboe.org closer to the primary;
        this page will link directly to it once it&apos;s live.
      </p>

      <SectionHead kicker="Try it" title="Interactive simulator" />
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-fg sm:text-[17px]">
        Five fictional candidates. Twenty hypothetical voters have already cast ballots. Cast
        yours and watch what happens — you&apos;ll see eliminations, transfers, and which round
        your vote lands in.
      </p>
      <RcvSimulator />

      <SectionHead kicker="FAQ" title="Common questions" />
      <ul className="mt-5 space-y-5">
        {faqs.map((f, i) => (
          <li key={i}>
            <h3 className="display text-lg text-ink sm:text-xl">{f.q}</h3>
            <p className="mt-2 text-base leading-relaxed text-fg sm:text-[17px]">{f.a}</p>
          </li>
        ))}
      </ul>

      <SectionHead kicker="Power" title="Who decides" />
      <ul className="mt-5 border-y border-rule bg-paper">
        {whoDecides.map((d, i) => (
          <li
            key={i}
            className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <span className="display text-base text-ink sm:w-1/3">{d.name}</span>
            <span className="text-sm leading-snug text-fg sm:flex-1">{d.role}</span>
          </li>
        ))}
      </ul>

      <SectionHead kicker="Timeline" title="Recent moves" />
      <ol className="mt-5 border-y border-rule bg-paper">
        {recentMoves.map((m, i) => (
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
              className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted hover:text-primary"
            >
              {m.source.label} ↗
            </a>
          </li>
        ))}
      </ol>

      <SectionHead kicker="Reference" title="Live sources" />
      <ul className="mt-5 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2">
        {liveSources.map((s, i) => (
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
    </article>
  );
}
