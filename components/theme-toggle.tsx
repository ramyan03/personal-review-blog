"use client";

import { useEffect, useState } from "react";

type Choice = "light" | "dark" | null;

const KEY = "theme";

export default function ThemeToggle() {
  // Starts null so the server and first client render agree; the real value is
  // already on <html> by then, put there by the inline script in the layout.
  const [choice, setChoice] = useState<Choice>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stamped = document.documentElement.dataset.theme;
    setChoice(stamped === "light" || stamped === "dark" ? stamped : null);
  }, []);

  function apply(next: "light" | "dark") {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Private browsing; the choice just will not survive a reload.
    }
    setChoice(next);
  }

  function toggle() {
    const showingDark =
      choice === "dark" ||
      (choice === null &&
        !window.matchMedia("(prefers-color-scheme: light)").matches);
    apply(showingDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark"
      title="Switch between light and dark"
      className="-m-2 flex-none cursor-pointer p-2 text-fg-muted transition-colors hover:text-fg"
    >
      {/* Both glyphs ship; CSS picks the one that matches the active theme. */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        <g className="theme-icon-dark">
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
        </g>
        <g className="theme-icon-light">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.4v2.2M12 19.4v2.2M4.2 12H2M22 12h-2.2M6.1 6.1 4.6 4.6M19.4 19.4l-1.5-1.5M17.9 6.1l1.5-1.5M4.6 19.4l1.5-1.5" />
        </g>
      </svg>
    </button>
  );
}
