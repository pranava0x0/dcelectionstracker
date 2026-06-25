import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { buildSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = {
  title: "DC Elections Tracker — Voter accountability for the District",
  description:
    "Independent, sourced, opinionated voter brief for Washington, DC. The mayor's seat, the Delegate seat, and seats on Council are all open in 2026. Every claim links to a primary source.",
  metadataBase: undefined,
};

// Lets the browser pick the right layout band (mobile / tablet / desktop)
// from the same Tailwind breakpoints used throughout the site. No fixed
// width or zoom cap — accessibility tools must be able to zoom.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:text-primary-fg"
        >
          Skip to content
        </a>
        <NavBar />
        <div className="border-b border-rule bg-paper py-2 text-center">
          <p className="px-4 font-mono text-[11px] uppercase tracking-wider text-muted">
            The June 16 primary is over. This site is archived as of 2026-06-24 and will not be updated.{" "}
            <a
              href="https://electionresults.dcboe.org/election_results/2026-Primary-Election"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:opacity-80"
            >
              Certified results at DCBOE ↗
            </a>
          </p>
        </div>
        <main id="main-content">{children}</main>
        <Footer />
        <CommandPalette items={buildSearchIndex()} />
      </body>
    </html>
  );
}
