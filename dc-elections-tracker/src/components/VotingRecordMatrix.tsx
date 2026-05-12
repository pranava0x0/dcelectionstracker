import { councilMembers, getOfficialBySlug } from "@/data/officials";
import {
  VOTE_DESCRIPTION,
  VOTE_LABEL,
  billVotes,
  type VoteValue,
} from "@/data/votes";

function voteCellClass(vote: VoteValue): string {
  if (vote === "yes") return "bg-[hsl(140_45%_35%)] text-white";
  if (vote === "no") return "bg-primary text-primary-fg";
  if (vote === "abstain") return "bg-muted text-white";
  if (vote === "absent") return "bg-bg text-muted border border-rule";
  if (vote === "excused") return "bg-ink text-white";
  if (vote === "present") return "bg-[hsl(45_85%_55%)] text-ink";
  // not-in-office
  return "bg-paper text-subtle";
}

// Strips trailing generation suffixes ("Sr.", "Jr.", "III") so the mobile
// chip caption reads "White" rather than "Sr." for Trayon White Sr.
function shortName(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  const suffix = /^(Sr\.?|Jr\.?|II|III|IV)$/i;
  while (parts.length > 1 && suffix.test(parts[parts.length - 1]!)) {
    parts.pop();
  }
  return parts[parts.length - 1] ?? name;
}

export function VotingRecordMatrix(): JSX.Element {
  const council = councilMembers();

  return (
    <div className="mt-5">
      <p className="max-w-3xl text-sm leading-relaxed text-fg sm:text-[15px]">
        How each current Council member voted on three flagship 2024–2025 bills. The
        Sanctuary Values Repeal pause (June 2025 committee action) and FY26 Budget final
        reading (July 28, 2025, 10–2) are tracked in the backlog as future additions — the
        aggregate tallies are public but per-member breakdowns require deeper LIMS work.
      </p>
      <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted">
        <span className="font-semibold">Not in office</span> (·) means the member did not
        hold a Council seat at the time of the vote — most commonly Doni Crawford
        (At-Large interim, appointed Jan 2026), Wendell Felder (won Ward 7 special after
        the Secure DC vote), and Trayon White (expelled Feb–Aug 2025). Historical
        members&apos; votes from those vacancies are recorded by the source but not shown
        in this current-roster matrix.
      </p>

      {/* Mobile + tablet (< lg): one card per bill with a wrap-grid of vote chips.
          Replaces the 14-column horizontal-scroll table; same data, no scroll,
          chips meet the 44px tap-target minimum. Threshold is `lg:` because the
          table needs ≥1024px to display comfortably — at 768px it overflows the
          content container (UAT-011). */}
      <ul className="mt-5 space-y-4 lg:hidden">
        {billVotes.map((bill) => (
          <li key={bill.billId} className="border border-rule bg-paper p-4">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="display text-base text-ink">{bill.billName}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                  {bill.billId} · {bill.voteStage} · {bill.result}
                </div>
              </div>
              <time
                className="shrink-0 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary"
                dateTime={bill.voteDate}
              >
                {bill.voteDate}
              </time>
            </div>
            <a
              href={bill.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block py-1 font-mono text-[12px] font-semibold uppercase tracking-wider text-muted hover:text-primary"
            >
              {bill.source.label} ↗
            </a>
            <ul className="mt-3 grid grid-cols-4 gap-2">
              {council.map((m) => {
                const v = bill.memberVotes.find((mv) => mv.memberSlug === m.slug);
                const value: VoteValue = v?.vote ?? "absent";
                return (
                  <li key={`${bill.billId}-${m.slug}`} className="flex flex-col items-center gap-1">
                    <span
                      title={`${m.name}: ${VOTE_DESCRIPTION[value]}${v?.note ? " — " + v.note : ""}`}
                      aria-label={`${m.name}: ${VOTE_DESCRIPTION[value]}`}
                      className={
                        "flex h-11 w-full items-center justify-center rounded-sm font-mono text-sm font-bold " +
                        voteCellClass(value)
                      }
                    >
                      {VOTE_LABEL[value]}
                    </span>
                    <span className="text-center font-mono text-[10px] uppercase leading-tight tracking-wider text-muted">
                      {shortName(m.name)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>

      {/* Desktop (>= lg): original 14-column table. */}
      <div className="mt-5 hidden overflow-x-auto border border-rule lg:block">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-bg">
            <tr>
              <th
                scope="col"
                className="border-b border-rule px-3 py-2 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-subtle"
              >
                Bill
              </th>
              <th
                scope="col"
                className="border-b border-l border-rule px-3 py-2 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-subtle"
              >
                Date
              </th>
              {council.map((m) => (
                <th
                  key={m.slug}
                  scope="col"
                  className="border-b border-l border-rule px-2 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-subtle"
                >
                  {m.name.split(" ").pop()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {billVotes.map((bill) => (
              <tr key={bill.billId} className="bg-paper">
                <th scope="row" className="border-b border-rule px-3 py-3 text-left align-top">
                  <div className="display text-sm text-ink">{bill.billName}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                    {bill.billId} · {bill.voteStage} · {bill.result}
                  </div>
                  <a
                    href={bill.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted hover:text-primary"
                  >
                    {bill.source.label} ↗
                  </a>
                </th>
                <td className="border-b border-l border-rule px-3 py-3 align-top">
                  <time className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary" dateTime={bill.voteDate}>
                    {bill.voteDate}
                  </time>
                </td>
                {council.map((m) => {
                  const v = bill.memberVotes.find((mv) => mv.memberSlug === m.slug);
                  const value: VoteValue = v?.vote ?? "absent";
                  return (
                    <td
                      key={`${bill.billId}-${m.slug}`}
                      className="border-b border-l border-rule px-1 py-1 text-center align-middle"
                    >
                      <span
                        title={`${m.name}: ${VOTE_DESCRIPTION[value]}${v?.note ? " — " + v.note : ""}`}
                        className={
                          "inline-flex h-7 w-7 items-center justify-center rounded-sm font-mono text-[12px] font-bold " +
                          voteCellClass(value)
                        }
                        aria-label={`${m.name}: ${VOTE_DESCRIPTION[value]}`}
                      >
                        {VOTE_LABEL[value]}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 flex flex-wrap gap-3 text-xs text-fg">
        <li className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[hsl(140_45%_35%)] font-mono text-[10px] font-bold text-white">Y</span>
          Yes
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-primary font-mono text-[10px] font-bold text-primary-fg">N</span>
          No
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[hsl(45_85%_55%)] font-mono text-[10px] font-bold text-ink">P</span>
          Present
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-muted font-mono text-[10px] font-bold text-white">A</span>
          Abstain
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-ink font-mono text-[10px] font-bold text-white">E</span>
          Excused
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-paper font-mono text-[10px] font-bold text-subtle">·</span>
          Not in office
        </li>
      </ul>
    </div>
  );
}

// Per-member mini-record (BL-01) — rendered inline on each council member's card.
export function MemberVotingMiniRecord({ memberSlug }: { memberSlug: string }): JSX.Element | null {
  const member = getOfficialBySlug(memberSlug);
  if (!member) return null;
  const memberVotes = billVotes
    .map((bill) => ({ bill, vote: bill.memberVotes.find((v) => v.memberSlug === memberSlug) }))
    .filter((entry): entry is { bill: typeof billVotes[number]; vote: NonNullable<typeof entry.vote> } => !!entry.vote);

  if (memberVotes.length === 0) return null;

  return (
    <details className="mt-3 border-t border-rule pt-2 group">
      <summary className="flex cursor-pointer items-center justify-between gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-muted hover:text-primary">
        <span>Voting record on {memberVotes.length} tracked bill{memberVotes.length === 1 ? "" : "s"}</span>
        <span aria-hidden className="transition-transform group-open:rotate-180">↓</span>
      </summary>
      <ul className="mt-2 space-y-1.5">
        {memberVotes.map(({ bill, vote }) => (
          <li key={bill.billId} className="flex items-baseline gap-2 text-xs">
            <span
              title={VOTE_DESCRIPTION[vote.vote]}
              className={
                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm font-mono text-[10px] font-bold " +
                voteCellClass(vote.vote)
              }
            >
              {VOTE_LABEL[vote.vote]}
            </span>
            <span className="text-ink">{bill.billName}</span>
            <time className="ml-auto font-mono text-[10px] uppercase tracking-wider text-subtle" dateTime={bill.voteDate}>
              {bill.voteDate}
            </time>
          </li>
        ))}
      </ul>
    </details>
  );
}
