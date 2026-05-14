"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ballotForWard,
  getRaceBySlug,
  type BallotForWard,
} from "@/data/elections";
import { councilMembers, type Official } from "@/data/officials";
import { votesForMember, VOTE_DESCRIPTION, VOTE_LABEL, type VoteValue } from "@/data/votes";

// MAR (DC Master Address Repository) API — public, no key, no rate limit advertised.
// citizenatlas.dc.gov doesn't return CORS headers, so we route the request through
// corsproxy.io (a free public CORS proxy with no API key required, stable for years).
// The user's address goes user-browser → corsproxy.io → DC government → user-browser.
// Neither corsproxy.io nor this site stores the address. Zero load-time cost: the proxy
// is only contacted on user submit. If corsproxy.io ever becomes unreliable, the v2
// upgrade path is a 30-minute Cloudflare-Worker self-hosted proxy.
const MAR_URL =
  "https://citizenatlas.dc.gov/newwebservices/locationverifier.asmx/findLocation2";
const CORS_PROXY = "https://corsproxy.io/?url=";

type MarRecord = Record<string, unknown>;

type LookupResult = {
  fullAddress: string;
  ward: string; // "1".."8"
  anc: string; // e.g. "1A"
  smd: string; // e.g. "1A07"
};

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; result: LookupResult }
  | { kind: "notFound" }
  | { kind: "error" };

function pickField(rec: MarRecord, candidates: string[]): string | null {
  for (const key of candidates) {
    const v = rec[key];
    if (typeof v === "string" && v.length > 0) return v;
    if (typeof v === "number") return String(v);
  }
  return null;
}

function normalizeWard(raw: string | null): string | null {
  if (!raw) return null;
  const m = raw.match(/(\d)/);
  return m ? m[1]! : null;
}

function parseMarRecord(rec: MarRecord): LookupResult | null {
  const fullAddress = pickField(rec, ["FULLADDRESS", "ADDRESS", "FULL_ADDRESS"]);
  const wardRaw = pickField(rec, ["WARD_2022", "WARD_2012", "WARD", "WARD_2002"]);
  const anc = pickField(rec, ["ANC_2022", "ANC_2012", "ANC", "ANC_2002"]);
  const smd = pickField(rec, ["SMD_2022", "SMD_2012", "SMD", "SMD_2002"]);
  const ward = normalizeWard(wardRaw);
  if (!fullAddress || !ward || !anc || !smd) return null;
  return { fullAddress, ward, anc, smd };
}

function councilMemberForWard(ward: string): Official | undefined {
  return councilMembers().find((m) => m.ward === ward);
}

function voteCellClass(vote: VoteValue): string {
  if (vote === "yes") return "bg-[hsl(140_45%_35%)] text-white";
  if (vote === "no") return "bg-primary text-primary-fg";
  if (vote === "abstain") return "bg-muted text-white";
  if (vote === "absent") return "bg-bg text-muted border border-rule";
  if (vote === "excused") return "bg-ink text-white";
  if (vote === "present") return "bg-[hsl(45_85%_55%)] text-ink";
  return "bg-paper text-subtle";
}

export function AddressLookup(): JSX.Element {
  const [address, setAddress] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const trimmed = address.trim();
    if (!trimmed) return;
    setState({ kind: "loading" });
    try {
      const marUrl = `${MAR_URL}?str=${encodeURIComponent(trimmed)}&f=json`;
      const url = `${CORS_PROXY}${encodeURIComponent(marUrl)}`;
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) {
        setState({ kind: "error" });
        return;
      }
      const data = (await res.json()) as { returnDataset?: { Table1?: MarRecord[] } };
      const rows = data?.returnDataset?.Table1 ?? [];
      if (rows.length === 0) {
        setState({ kind: "notFound" });
        return;
      }
      const parsed = parseMarRecord(rows[0]!);
      if (!parsed) {
        setState({ kind: "notFound" });
        return;
      }
      setState({ kind: "ok", result: parsed });
    } catch {
      setState({ kind: "error" });
    }
  }

  function reset(): void {
    setAddress("");
    setState({ kind: "idle" });
  }

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
            DC address
          </span>
          <input
            type="text"
            inputMode="text"
            autoComplete="street-address"
            placeholder="1600 Pennsylvania Ave NW"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-sm border border-rule bg-paper px-3 py-2 text-base text-ink placeholder:text-subtle focus:border-primary focus:outline-none"
            aria-label="DC address"
          />
        </label>
        <button
          type="submit"
          disabled={!address.trim() || state.kind === "loading"}
          className="rounded-sm bg-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.kind === "loading" ? "Looking up…" : "Look up"}
        </button>
      </form>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-subtle">
        Address routes through corsproxy.io (a free public CORS proxy) to DC&apos;s open
        data service (citizenatlas.dc.gov). Neither service stores the address — and this
        site never sees or logs it.
      </p>

      {state.kind === "notFound" ? (
        <NotFoundCard onTryAgain={reset} />
      ) : state.kind === "error" ? (
        <ErrorCard onTryAgain={reset} />
      ) : state.kind === "ok" ? (
        <ResultCard result={state.result} onReset={reset} />
      ) : null}
    </div>
  );
}

function NotFoundCard({ onTryAgain }: { onTryAgain: () => void }): JSX.Element {
  return (
    <aside className="card card-stripe-red mt-5 p-4 sm:p-5" role="status">
      <span className="kicker">Address not found</span>
      <p className="mt-2 text-sm leading-relaxed text-fg sm:text-base">
        Double-check the spelling, or try the DC Board of Elections (DCBOE) polling-place
        lookup at{" "}
        <a
          className="border-b border-primary text-primary hover:opacity-80"
          href="https://www.dcboe.org/voters/where-to-vote"
          target="_blank"
          rel="noopener noreferrer"
        >
          dcboe.org/voters/where-to-vote
        </a>
        . This tool only resolves addresses inside the District of Columbia.
      </p>
      <button
        type="button"
        onClick={onTryAgain}
        className="mt-3 font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:opacity-80"
      >
        ← Try a different address
      </button>
    </aside>
  );
}

function ErrorCard({ onTryAgain }: { onTryAgain: () => void }): JSX.Element {
  return (
    <aside className="card card-stripe-red mt-5 p-4 sm:p-5" role="alert">
      <span className="kicker">Lookup service didn&apos;t respond</span>
      <p className="mt-2 text-sm leading-relaxed text-fg sm:text-base">
        DC&apos;s address service returned an error. Try again in a moment, or visit the
        DCBOE polling-place lookup at{" "}
        <a
          className="border-b border-primary text-primary hover:opacity-80"
          href="https://www.dcboe.org/voters/where-to-vote"
          target="_blank"
          rel="noopener noreferrer"
        >
          dcboe.org/voters/where-to-vote
        </a>
        .
      </p>
      <button
        type="button"
        onClick={onTryAgain}
        className="mt-3 font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:opacity-80"
      >
        ← Try again
      </button>
    </aside>
  );
}

function ResultCard({
  result,
  onReset,
}: {
  result: LookupResult;
  onReset: () => void;
}): JSX.Element {
  const ward = result.ward;
  const member = councilMemberForWard(ward);
  const ballot = ballotForWard(ward);
  const memberVotes = member ? votesForMember(member.slug) : [];
  const ancSlug = result.anc.toLowerCase().replace(/\s+/g, "");

  return (
    <section className="mt-5 border border-rule bg-paper p-5" aria-live="polite">
      <p className="kicker">Your ballot</p>
      <h3 className="display mt-1 text-xl text-ink sm:text-2xl">
        {result.fullAddress}
      </h3>

      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
            Ward
          </dt>
          <dd className="display mt-1 text-2xl text-ink">{ward}</dd>
          {member ? (
            <p className="mt-1 text-sm text-fg">
              Represented by{" "}
              <Link href="/officials/" className="border-b border-primary text-primary hover:opacity-80">
                {member.name} ({member.party})
              </Link>
            </p>
          ) : null}
        </div>
        <div>
          <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
            ANC
          </dt>
          <dd className="display mt-1 text-2xl text-ink">{result.anc}</dd>
          <p className="mt-1 text-sm text-fg">
            <a
              href={`https://oanc.dc.gov/page/anc${ancSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-primary text-primary hover:opacity-80"
            >
              ANC {result.anc} on oanc.dc.gov
            </a>
          </p>
        </div>
        <div>
          <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
            SMD
          </dt>
          <dd className="display mt-1 text-2xl text-ink">{result.smd}</dd>
          <p className="mt-1 text-sm text-fg">
            Your single-member district. All ~345 SMD seats are on the November 3 ballot.
          </p>
        </div>
      </dl>

      <BallotForYouSection ballot={ballot} ward={ward} />

      {member && memberVotes.length > 0 ? (
        <div className="mt-6 border-t border-rule pt-5">
          <p className="kicker">Your Council member</p>
          <h4 className="display mt-1 text-lg text-ink">
            How {member.name} voted on tracked bills
          </h4>
          <ul className="mt-3 space-y-2">
            {memberVotes.map(({ bill, vote }) => (
              <li key={bill.billId} className="flex items-baseline gap-2 text-sm">
                <span
                  title={VOTE_DESCRIPTION[vote.vote]}
                  className={
                    "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm font-mono text-[10px] font-bold " +
                    voteCellClass(vote.vote)
                  }
                  aria-label={VOTE_DESCRIPTION[vote.vote]}
                >
                  {VOTE_LABEL[vote.vote]}
                </span>
                <span className="text-ink">{bill.billName}</span>
                <time
                  className="ml-auto font-mono text-[10px] uppercase tracking-wider text-subtle"
                  dateTime={bill.voteDate}
                >
                  {bill.voteDate}
                </time>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 border-t border-rule pt-5">
        <a
          href="https://www.dcboe.org/voters/where-to-vote"
          target="_blank"
          rel="noopener noreferrer"
          className="card-hover inline-block rounded-sm border border-rule bg-paper px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-fg hover:text-primary"
        >
          Find your polling place at DCBOE <span aria-hidden>↗</span>
        </a>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 font-mono text-[11px] font-bold uppercase tracking-wider text-muted hover:text-primary"
      >
        ← Look up a different address
      </button>
    </section>
  );
}

function BallotForYouSection({ ballot, ward }: { ballot: BallotForWard; ward: string }): JSX.Element {
  return (
    <div className="mt-6 border-t border-rule pt-5">
      <p className="kicker">On your ballot</p>
      <h4 className="display mt-1 text-lg text-ink">
        Races you&apos;ll vote on in 2026
      </h4>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ballot.primaryRaceSlugs.map((slug) => {
          const race = getRaceBySlug(slug);
          if (!race) return null;
          return (
            <li key={slug} className="flex items-baseline justify-between gap-3 text-sm">
              <Link
                href={`/elections/${slug}/`}
                className="text-ink underline decoration-rule decoration-2 underline-offset-4 hover:decoration-primary"
              >
                {race.office}
              </Link>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {race.status}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm text-fg">
        Plus all ~345 ANC commissioner seats on the November 3 general ballot.{" "}
        {ballot.sboeOnGeneralBallot
          ? `Your Ward ${ward} State Board of Education seat is also on the November ballot.`
          : `Your ward's State Board of Education seat is not on the 2026 ballot (next cycle: 2028).`}
      </p>
    </div>
  );
}
