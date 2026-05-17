"use client";

import { useState } from "react";
import type { JSX } from "react";

// Tab switcher used on /officials/[slug]/ when an official is also a 2026
// candidate. The server component renders both tab bodies and passes them as
// RSC composition slots — this component only owns the active-tab state.
export function OfficialProfileTabs({
  currentRoleContent,
  campaignContent,
  campaignLabel,
}: {
  currentRoleContent: React.ReactNode;
  campaignContent: React.ReactNode;
  campaignLabel: string; // e.g. "2026 — Mayor race"
}): JSX.Element {
  const [tab, setTab] = useState<"role" | "campaign">("role");

  return (
    <div>
      <div className="mt-6 flex gap-0 border-b-2 border-rule">
        <button
          onClick={() => setTab("role")}
          className={
            "relative -mb-0.5 pb-2 pr-6 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors " +
            (tab === "role"
              ? "border-b-2 border-primary text-primary"
              : "border-b-2 border-transparent text-muted hover:text-ink")
          }
        >
          In office
        </button>
        <button
          onClick={() => setTab("campaign")}
          className={
            "relative -mb-0.5 pb-2 pl-0 pr-6 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors " +
            (tab === "campaign"
              ? "border-b-2 border-primary text-primary"
              : "border-b-2 border-transparent text-muted hover:text-ink")
          }
        >
          {campaignLabel}
        </button>
      </div>
      <div className="mt-8">
        {tab === "role" ? currentRoleContent : campaignContent}
      </div>
    </div>
  );
}
