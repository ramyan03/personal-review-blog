import Link from "next/link";
import { REVIEWS_HREF } from "@/lib/links";
import SocialLinks from "@/components/social-links";

const LINKS = [
  { href: REVIEWS_HREF, label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const YEAR = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule px-5 py-12 sm:px-10 lg:px-[72px]">
      <div className="mx-auto max-w-[1420px]">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
          <Link
            href="/"
            className="font-serif text-base font-medium text-fg-title italic"
          >
            Ramyan Reviews
          </Link>
          <nav className="flex items-center gap-6">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-[0.08em] text-fg-muted uppercase transition-colors hover:text-fg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <SocialLinks size={17} />
        </div>

        {/*
         * The attribution line the cover art is displayed under, plus the two
         * things worth stating outright: the writing is his, and nothing in it
         * was generated.
         */}
        <div className="mt-10 flex flex-col gap-2 border-t border-row pt-8 text-sm leading-[1.6] text-fg-faint">
          <p className="m-0">
            &copy; {YEAR} Ramyan Chelva. Every review on this site is my own
            writing. No part of it was written by AI, which was used only to
            build the site itself.
          </p>
          <p className="m-0">
            Cover art remains the property of its respective rights holders and
            is reproduced at thumbnail resolution for the purpose of criticism
            and review. Sources are recorded in{" "}
            <a
              href="/posters/manifest.json"
              className="text-fg-muted underline underline-offset-[3px] transition-colors hover:text-accent"
            >
              posters/manifest.json
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
