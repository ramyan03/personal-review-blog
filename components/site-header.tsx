"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ThemeToggle from "@/components/theme-toggle";
import HeaderSearch from "@/components/header-search";
import { ArrowUpIcon, HomeIcon } from "@/components/icons";

const NAV = [
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const activeIndex = NAV.findIndex((item) => pathname.startsWith(item.href));

  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [rule, setRule] = useState<{ left: number; width: number } | null>(null);
  // The rule slides between items, but should not fly in from x=0 on first paint.
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const nav = navRef.current;
    const item = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
    if (!nav || !item) {
      setRule(null);
      return;
    }
    const navBox = nav.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    setRule({ left: itemBox.left - navBox.left, width: itemBox.width });
  }, [activeIndex]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  // Web fonts land after first paint and change the label widths.
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <header className="mx-auto flex w-full max-w-[1420px] flex-wrap items-center gap-x-6 gap-y-4 px-5 pt-7 pb-5 sm:px-10 lg:px-[72px] lg:pt-10 lg:pb-7">
      <div className="flex flex-none items-center gap-1">
        <Link
          href="/"
          aria-label="Up to the landing page"
          title="Up to the landing page"
          className="flex items-center justify-center p-2 text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowUpIcon />
        </Link>
        <Link
          href="/reviews"
          aria-label="All reviews"
          title="All reviews"
          className="flex items-center justify-center p-2 text-fg-muted transition-colors hover:text-fg"
        >
          <HomeIcon />
        </Link>
      </div>

      {/* Reads the query string, so it needs its own boundary to keep every
          page in this layout statically prerenderable. */}
      <Suspense fallback={<div className="sm:flex-1 sm:max-w-[300px]" />}>
        <HeaderSearch />
      </Suspense>

      <div className="ml-auto flex flex-none items-center gap-5 sm:gap-7 lg:gap-9">
        <nav
          ref={navRef}
          className="relative flex items-center gap-5 sm:gap-7 lg:gap-9"
        >
          {NAV.map((item, index) => (
            <Link
              key={item.href}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              href={item.href}
              aria-current={index === activeIndex ? "page" : undefined}
              className={
                index === activeIndex
                  ? "text-xs font-semibold tracking-[0.12em] text-accent uppercase"
                  : "text-xs font-semibold tracking-[0.12em] text-fg-muted uppercase transition-colors hover:text-fg"
              }
            >
              {item.label}
            </Link>
          ))}

          {/* One rule for the whole nav, so switching pages slides it across. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[7px] left-0 h-[2px] bg-accent"
            style={{
              width: rule?.width ?? 0,
              transform: `translateX(${rule?.left ?? 0}px)`,
              opacity: rule ? 1 : 0,
              transition: ready
                ? "transform 0.36s cubic-bezier(0.22, 0.61, 0.36, 1), width 0.36s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.2s ease"
                : "none",
            }}
          />
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
