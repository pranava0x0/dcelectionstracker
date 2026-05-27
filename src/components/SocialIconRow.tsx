// Compact link row for candidate and official profile pages (BL-58).
// Holds the most-clicked outbound destinations: campaign site, official gov
// profile, social accounts, and (for candidates) the two DC election filings —
// OCF (campaign finance) and DCBOE (ballot access). Filings render as 3–5 char
// text pills at the end of the row since they have no universal icons.
// Inline SVG only — no icon-library dependency (CLAUDE.md tech rule). The
// announcement source citation still lives in the "About" disclosure.

export interface SocialLinks {
  websiteUrl?: string;
  governmentSiteUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  ocfUrl?: string;
  dcboeUrl?: string;
}

type IconEntry = {
  label: string;
  url: string;
  svg: JSX.Element;
};

type TextEntry = {
  label: string;
  url: string;
  short: string;
};

const svgProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
} as const;

const strokeProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function GlobeIcon(): JSX.Element {
  return (
    <svg {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 3 4 7 4 9s-1.5 6-4 9c-2.5-3-4-7-4-9s1.5-6 4-9z" />
    </svg>
  );
}

function GovIcon(): JSX.Element {
  return (
    <svg {...strokeProps}>
      <path d="M3 21h18" />
      <path d="M5 21V11l7-5 7 5v10" />
      <path d="M9 21v-6h6v6" />
      <path d="M5 11h14" />
    </svg>
  );
}

function XIcon(): JSX.Element {
  return (
    <svg {...svgProps}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function LinkedInIcon(): JSX.Element {
  return (
    <svg {...svgProps}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

function InstagramIcon(): JSX.Element {
  return (
    <svg {...strokeProps}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(): JSX.Element {
  return (
    <svg {...svgProps}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function buildIconEntries(links: SocialLinks): IconEntry[] {
  const out: IconEntry[] = [];
  if (links.websiteUrl) {
    out.push({ label: "Campaign site", url: links.websiteUrl, svg: <GlobeIcon /> });
  }
  if (links.governmentSiteUrl) {
    out.push({ label: "Government site", url: links.governmentSiteUrl, svg: <GovIcon /> });
  }
  if (links.twitterUrl) {
    out.push({ label: "X / Twitter", url: links.twitterUrl, svg: <XIcon /> });
  }
  if (links.linkedinUrl) {
    out.push({ label: "LinkedIn", url: links.linkedinUrl, svg: <LinkedInIcon /> });
  }
  if (links.instagramUrl) {
    out.push({ label: "Instagram", url: links.instagramUrl, svg: <InstagramIcon /> });
  }
  if (links.facebookUrl) {
    out.push({ label: "Facebook", url: links.facebookUrl, svg: <FacebookIcon /> });
  }
  return out;
}

function buildTextEntries(links: SocialLinks): TextEntry[] {
  const out: TextEntry[] = [];
  if (links.ocfUrl) {
    out.push({ label: "DC OCF — campaign finance filings", url: links.ocfUrl, short: "OCF" });
  }
  if (links.dcboeUrl) {
    out.push({ label: "DCBOE — ballot access filings", url: links.dcboeUrl, short: "DCBOE" });
  }
  return out;
}

export function SocialIconRow({ links, name }: { links: SocialLinks; name: string }): JSX.Element | null {
  const icons = buildIconEntries(links);
  const filings = buildTextEntries(links);
  if (icons.length === 0 && filings.length === 0) return null;
  return (
    <ul
      className="flex flex-wrap items-center gap-1.5"
      aria-label={`${name} — links and filings`}
    >
      {icons.map((entry) => (
        <li key={entry.url}>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={entry.label}
            title={entry.label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-paper text-ink transition-colors hover:border-primary hover:bg-primary hover:text-primary-fg"
          >
            {entry.svg}
          </a>
        </li>
      ))}
      {filings.map((entry) => (
        <li key={entry.url}>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={entry.label}
            title={entry.label}
            className="inline-flex h-9 items-center rounded-sm border border-rule bg-paper px-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink transition-colors hover:border-primary hover:bg-primary hover:text-primary-fg"
          >
            {entry.short}
          </a>
        </li>
      ))}
    </ul>
  );
}
