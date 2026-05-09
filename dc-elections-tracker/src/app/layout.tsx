import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg">
        <NavBar />
        <AlertTicker />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
