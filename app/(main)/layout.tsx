import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { fontVariables } from "@/lib/fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import { getReviews } from "@/lib/reviews";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s · " + SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

/**
 * One layout over the whole site.
 *
 * The landing page and everything else used to sit in separate route groups
 * with a root layout each. Next treats a move between two root layouts as a
 * document navigation, not a client one, so going from Contact to the reviews
 * reloaded the page: fonts re-evaluated, the theme script re-ran, and you saw
 * it blink. About to Contact was smooth only because both happened to live in
 * the same group. Prefetching cannot help with that; the split had to go.
 *
 * The header decides for itself whether to float, so it does not need a prop
 * that only the landing route could have passed.
 */
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The header's search matches against the whole list as you type, so the
  // layout fetches it once rather than each page fetching its own.
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
