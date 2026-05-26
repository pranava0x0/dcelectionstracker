import type { Metadata } from "next";
import { issues, type Source } from "@/data/issues";

export const metadata: Metadata = {
  title: "Sources — DC Elections Tracker",
  description:
    "Every URL cited on this site, deduplicated and grouped by organization. Primary government sources are preferred over secondary reporting.",
};

// Categorize each source by URL host so a voter looking for a specific
// agency or outlet can scan one bucket instead of every issue page.
type Category =
  | "DC government"
  | "Federal government"
  | "Statistical agencies"
  | "Regional & transit"
  | "Press"
  | "Other";

const CATEGORY_ORDER: Category[] = [
  "DC government",
  "Federal government",
  "Statistical agencies",
  "Regional & transit",
  "Press",
  "Other",
];

const CATEGORY_SLUG: Record<Category, string> = {
  "DC government": "dc-gov",
  "Federal government": "federal-gov",
  "Statistical agencies": "stats",
  "Regional & transit": "regional",
  Press: "press",
  Other: "other",
};

const CATEGORY_BLURB: Record<Category, string> = {
  "DC government":
    "Mayor's office, DC Council, OCFO, OAG, MPD, OSSE, DCBOE, agency releases, and Charter/Code references.",
  "Federal government":
    "Congress, federal courts, executive-branch agencies, and statutes affecting the District.",
  "Statistical agencies":
    "BLS, Census, GAO, and other primary data sources cited for population, revenue, and labor figures.",
  "Regional & transit": "WMATA, MWCOG, and regional infrastructure sources.",
  Press:
    "Local and national outlets cited only when they are the available record of an event not otherwise documented.",
  Other:
    "Advocacy groups, nonprofits, and other organizations cited where they are the primary record.",
};

const PRESS_HOSTS = new Set([
  "washingtonpost.com",
  "wapo.st",
  "npr.org",
  "dcist.com",
  "citycast.fm",
  "51st.news",
  "axios.com",
  "ggwash.org",
  "reuters.com",
  "nytimes.com",
  "fox5dc.com",
  "fox5atlanta.com",
  "wamu.org",
  "wjla.com",
  "wusa9.com",
  "nbcwashington.com",
  "thehill.com",
  "rollcall.com",
  "politico.com",
  "planetizen.com",
  "bisnow.com",
  "urbanturf.com",
  "washingtoncitypaper.com",
  "afro.com",
  "streetsense.org",
  "dcfpi.org",
  "georgetownvoice.com",
]);

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function categorize(url: string): Category {
  const host = hostOf(url);
  if (!host) return "Other";
  if (
    host.endsWith(".dc.gov") ||
    host === "dc.gov" ||
    host === "dccouncil.gov" ||
    host === "dcboe.org" ||
    host === "code.dccouncil.gov" ||
    host === "lims.dccouncil.gov" ||
    host === "oanc.dc.gov"
  ) {
    return "DC government";
  }
  if (host === "bls.gov" || host === "census.gov" || host === "gao.gov") {
    return "Statistical agencies";
  }
  if (host === "wmata.com" || host === "mwcog.org") {
    return "Regional & transit";
  }
  if (
    host === "congress.gov" ||
    host === "supremecourt.gov" ||
    host === "uscourts.gov" ||
    host === "cadc.uscourts.gov" ||
    host === "fcc.gov" ||
    host === "whitehouse.gov" ||
    host === "justice.gov" ||
    host === "fbi.gov" ||
    host === "hud.gov" ||
    host === "transportation.gov" ||
    host === "ed.gov" ||
    host === "fda.gov" ||
    host === "fmcsa.dot.gov" ||
    host === "nhtsa.gov" ||
    host.endsWith(".gov")
  ) {
    return "Federal government";
  }
  if (PRESS_HOSTS.has(host)) return "Press";
  return "Other";
}

type Indexed = { source: Source; topics: string[] };

function collectByCategory(): Record<Category, Indexed[]> {
  const seen = new Map<string, { source: Source; topics: Set<string> }>();
  for (const issue of issues) {
    const add = (s?: Source): void => {
      if (!s) return;
      const entry = seen.get(s.url);
      if (entry) {
        entry.topics.add(issue.title);
      } else {
        seen.set(s.url, { source: s, topics: new Set([issue.title]) });
      }
    };
    issue.stats.forEach((stat) => add(stat.source));
    issue.recentMoves.forEach((m) => add(m.source));
    issue.liveSources.forEach((s) => add(s));
  }

  const byCategory: Record<Category, Indexed[]> = {
    "DC government": [],
    "Federal government": [],
    "Statistical agencies": [],
    "Regional & transit": [],
    Press: [],
    Other: [],
  };
  for (const { source, topics } of seen.values()) {
    byCategory[categorize(source.url)].push({
      source,
      topics: Array.from(topics).sort(),
    });
  }
  for (const cat of CATEGORY_ORDER) {
    byCategory[cat].sort((a, b) => a.source.label.localeCompare(b.source.label));
  }
  return byCategory;
}

export default function SourcesPage(): JSX.Element {
  const byCategory = collectByCategory();
  const total = CATEGORY_ORDER.reduce(
    (sum, cat) => sum + byCategory[cat].length,
    0,
  );

  return (
    <article className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
      <p className="kicker">Reference</p>
      <h1 className="display-tight mt-3 text-4xl text-ink sm:text-5xl lg:text-6xl">
        Every source cited on this site
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-snug text-fg sm:text-[17px]">
        Deduplicated by URL and grouped by organization.{" "}
        <span className="font-mono font-semibold text-ink">{total}</span> unique
        sources across {CATEGORY_ORDER.filter((c) => byCategory[c].length > 0).length}{" "}
        categories. Primary government sources (DC Council, OCFO, MPD, OSSE,
        DCBOE, congress.gov, courts.gov, WMATA, BLS, Census) are preferred;
        press citations are used only when they are the available record of an
        event.
      </p>

      <nav
        aria-label="Jump to source category"
        className="-mx-4 mt-6 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max gap-2 pb-1">
          {CATEGORY_ORDER.filter((c) => byCategory[c].length > 0).map((cat) => (
            <li key={cat}>
              <a
                href={`#${CATEGORY_SLUG[cat]}`}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-sm border border-rule bg-paper px-3 font-mono text-[11px] font-bold uppercase tracking-wider text-fg hover:border-primary hover:text-primary"
              >
                <span>{cat}</span>
                <span className="font-mono text-[10px] font-semibold text-muted">
                  {byCategory[cat].length}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {CATEGORY_ORDER.filter((c) => byCategory[c].length > 0).map((cat) => (
        <section
          key={cat}
          id={CATEGORY_SLUG[cat]}
          className="mt-10 scroll-mt-16 sm:mt-12"
        >
          <hr className="rule-thick" />
          <span className="kicker mt-3 inline-block">{cat}</span>
          <p className="mt-2 max-w-3xl text-sm text-fg">
            {CATEGORY_BLURB[cat]}
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2">
            {byCategory[cat].map(({ source: s, topics }) => (
              <li key={s.url} className="bg-paper">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 text-sm hover:bg-bg"
                >
                  <div className="text-fg">{s.label}</div>
                  <div className="mt-1 truncate font-mono text-[11px] text-muted">
                    {s.url}
                  </div>
                  {topics.length > 0 ? (
                    <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-wider text-subtle">
                      Cited in: {topics.join(" · ")}
                    </div>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
