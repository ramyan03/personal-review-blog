"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Fades in once the hero has begun to scroll away. */
export default function LandingNav() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-10 flex items-center justify-between border-b px-6 py-[22px] backdrop-blur-[10px] transition-[opacity,transform] duration-500 sm:px-14"
      style={{
        background: "oklch(0.17 0.008 55 / 0.72)",
        borderColor: "oklch(0.30 0.01 55 / 0.6)",
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(-6px)",
        pointerEvents: shown ? "auto" : "none",
      }}
    >
      <Link href="/" className="font-serif text-[17px] font-medium italic">
        Ramyan Reviews
      </Link>
      <Link
        href="/reviews"
        className="text-[11px] font-semibold tracking-[0.1em] text-accent uppercase"
      >
        Enter Index →
      </Link>
    </div>
  );
}
