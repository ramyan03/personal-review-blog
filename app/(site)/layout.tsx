import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ramyan Reviews",
    template: "%s — Ramyan Reviews",
  },
  description:
    "Notes on books, films, and anime — kept like a reading log, not a scorecard.",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-screen bg-ink font-sans text-fg antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
