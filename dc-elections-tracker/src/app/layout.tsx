import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { AlertTicker } from "@/components/AlertTicker";
import { Footer } from "@/components/Footer";

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
        <AlertTicker />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
