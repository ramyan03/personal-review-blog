import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Ramyan Reviews",
  description:
    "A personal log of books, films, and anime — read slowly, watched twice.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontVariables} landing-scroll`}>
      <body className="bg-ink font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
