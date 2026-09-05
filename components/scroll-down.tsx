"use client";

import { ArrowDownIcon } from "@/components/icons";
import { scrollToPanel } from "@/lib/scroll-to-panel";

/**
 * The circular control at the foot of every landing panel, so the page can be
 * walked with clicks instead of the wheel. This is the one place on the site
 * that is fully round: a down arrow reads as a button here, and a square one
 * would read as part of the layout.
 */
export default function ScrollDown({
  targetId,
  label,
}: {
  targetId: string;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        const target = document.getElementById(targetId);
        if (target) scrollToPanel(target);
      }}
      className="scroll-down group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-rule text-fg-soft transition-colors hover:border-accent hover:text-accent"
    >
      <ArrowDownIcon size={15} />
    </button>
  );
}
