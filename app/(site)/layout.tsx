import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { fontVariables } from "@/lib/fonts";
import { getReviews } from "@/lib/reviews";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ramyan Reviews",
    template: "%s · Ramyan Reviews",
  },
  description: "Reviews of the books, films, and anime I finish.",
};

/**
 * Stamps a saved theme choice on <html> before the first paint, so a reader who
 * picked light does not get a frame of dark on every navigation.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The header's search box matches against the whole list as you type, so the
  // layout hands it every review once rather than each page fetching its own.
  const reviews = await getReviews();

  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col bg-ink font-sans text-fg antialiased">
        <SiteHeader reviews={reviews} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
