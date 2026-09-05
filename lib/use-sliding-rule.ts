"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/**
 * One rule that slides between the items of a row rather than a border per
 * item, so changing the selection animates across instead of blinking on and
 * off. Used by the header nav and by the genre filters, which is why it lives
 * here rather than inside either of them.
 */
export function useSlidingRule<T extends HTMLElement>(activeIndex: number) {
  const trackRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(T | null)[]>([]);
  const [rule, setRule] = useState<{ left: number; width: number } | null>(null);
  // The rule should not fly in from x=0 on first paint.
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const item = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
    if (!track || !item) {
      setRule(null);
      return;
    }
    const trackBox = track.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    setRule({ left: itemBox.left - trackBox.left, width: itemBox.width });
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

  const style: React.CSSProperties = {
    width: rule?.width ?? 0,
    transform: `translateX(${rule?.left ?? 0}px)`,
    opacity: rule ? 1 : 0,
    transition: ready
      ? "transform 0.36s cubic-bezier(0.22, 0.61, 0.36, 1), width 0.36s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.2s ease"
      : "none",
  };

  return { trackRef, itemRefs, style, measure };
}
