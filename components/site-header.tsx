"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/reviews", label: "Index" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-5 pt-7 pb-5 sm:px-10 lg:px-[72px] lg:pt-10 lg:pb-7">
      <Link
        href="/"
        className="font-serif text-[20px] font-medium tracking-[0.01em] text-fg-bright italic lg:text-[23px]"
      >
        Ramyan Reviews
      </Link>
      <nav className="flex items-center gap-7 lg:gap-10">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "border-b-2 border-accent pb-[5px] text-[12px] font-semibold tracking-[0.12em] text-accent uppercase"
                  : "text-[12px] font-semibold tracking-[0.12em] text-fg-muted uppercase transition-colors hover:text-fg"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
