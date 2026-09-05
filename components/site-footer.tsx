import Link from "next/link";

const LINKS = [
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule px-5 py-9 sm:px-10 lg:px-[72px]">
      <div className="mx-auto flex max-w-[1420px] flex-wrap items-center justify-between gap-x-8 gap-y-4">
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
      </div>
    </footer>
  );
}
