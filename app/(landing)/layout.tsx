import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import "../globals.css";

export const metadata: Metadata = {
  title: "Ramyan Reviews",
  description: "Reviews of the books, films, and anime I finish.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontVariables} landing-scroll`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="bg-ink font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
