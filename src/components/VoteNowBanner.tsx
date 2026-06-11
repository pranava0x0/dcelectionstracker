import { BUILD_DATE } from "@/lib/build-date";
import { votingNotice } from "@/lib/election-phase";

const VOTE_CENTER_FINDER_URL =
  "https://dcgis.maps.arcgis.com/apps/instant/nearby/index.html?appid=763576faa0b1470ca0559c377cf3b497";
const DCBOE_CALENDAR_URL =
  "https://www.dcboe.org/getmedia/3a7e75bc-4a1b-4aa6-9fc3-f30163beb2b5/2026-Primary-Election-Calendar-Version-08072025.pdf";

// Phase-aware "you can vote right now" banner (see src/lib/election-phase.ts).
// Server component; copy is computed at build time from BUILD_DATE, so the
// daily refresh/deploy keeps it current. Renders nothing outside the voting
// window — pages can include it unconditionally.
//
// `compact` drops to a single slim strip for race pages, where the banner is a
// reminder rather than the page's headline action.
export function VoteNowBanner({ compact = false }: { compact?: boolean }): JSX.Element | null {
  const notice = votingNotice(BUILD_DATE);
  if (!notice) return null;

  if (compact) {
    return (
      <aside
        aria-label="How to vote right now"
        className="card card-stripe-red mt-5 flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-3"
      >
        <span className="kicker shrink-0">{notice.kicker}</span>
        <p className="text-sm leading-snug text-fg">
          <span className="font-semibold text-ink">{notice.headline}</span> {notice.detail}{" "}
          <a
            href={VOTE_CENTER_FINDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-wider text-primary hover:opacity-80"
          >
            Find a Vote Center ↗
          </a>
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-label="How to vote right now"
      className="card card-stripe-red mt-6 px-4 py-4 sm:mt-8 sm:px-5"
    >
      <span className="kicker">{notice.kicker}</span>
      <p className="display mt-1 text-xl text-ink sm:text-2xl">{notice.headline}</p>
      <p className="mt-2 max-w-3xl text-sm leading-snug text-fg sm:text-[15px]">
        {notice.detail}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <a
          href={VOTE_CENTER_FINDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:opacity-80"
        >
          Find a Vote Center ↗
        </a>
        <a
          href={DCBOE_CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted hover:text-primary"
        >
          DCBOE 2026 Primary Calendar ↗
        </a>
      </div>
    </aside>
  );
}
