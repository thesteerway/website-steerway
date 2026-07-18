"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide reveal for internal sections: fades and lifts in when the block
 * scrolls into view. Uses IntersectionObserver rather than ScrollTrigger so it
 * is immune to stale scroll measurements after client-side navigation between
 * internal pages (the previous ScrollTrigger-based version left text stuck at
 * opacity 0 when you arrived via the nav instead of a hard reload). Reveals on
 * enter; re-hides only when the block leaves back down the page, so anything
 * scrolled past the top stays visible.
 */
export default function RevealBlock({
  children,
  className = "",
  id,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("reveal-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.classList.add("reveal-in");
          else if (e.boundingClientRect.top > 0) el.classList.remove("reveal-in");
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal ${className}`} id={id}>
      {children}
    </Tag>
  );
}
