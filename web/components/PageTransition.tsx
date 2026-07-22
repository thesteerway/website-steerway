"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NEEDLE } from "@/lib/steerway";

/**
 * The navigator transition (refined). Clicking an internal link plays a short
 * wayfinding gesture, not a flat wipe:
 *
 *  LEAVE  the brand's two surfaces (ivory over obsidian, split by the
 *         champagne horizon) rise to cover the viewport; the secondary needle
 *         rides the horizon line and settles upright in one decisive motion,
 *         a champagne tick marking "bearing found".
 *  ENTER  the horizon keeps rising off the top, led by the needle, revealing
 *         the new page; the needle dissolves as it exits.
 *
 * This is the concept that read best, with the fussy damped search removed:
 * one confident settle instead of a wobble. Modifier clicks, hash-only links,
 * downloads and external targets pass through. Skipped under reduced motion.
 */
const LEAVE_MS = 560; // rise + settle
const ENTER_MS = 660; // reveal sweep

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    const el = overlayRef.current!;
    if (first.current) {
      first.current = false;
      return;
    }
    if (!leaving.current) return;
    leaving.current = false;
    el.classList.remove("is-leaving");
    void el.offsetWidth; // reflow so leave -> enter always animates
    el.classList.add("is-entering");
    const t = window.setTimeout(
      () => el.classList.remove("is-entering"),
      ENTER_MS + 80
    );
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as Element).closest?.("a");
      if (!a) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      const path = href.split("#")[0].split("?")[0] || "/";
      if (path === pathname) return; // same-page (incl. hash) links: native
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
      if (leaving.current) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      leaving.current = true;
      const el = overlayRef.current!;
      el.classList.remove("is-entering");
      void el.offsetWidth;
      el.classList.add("is-leaving");
      window.setTimeout(() => router.push(href), LEAVE_MS);
    };
    // capture phase: run BEFORE Next's <Link> click handler
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  return (
    <div className="page-sweep" ref={overlayRef} aria-hidden="true">
      <span className="page-sweep-line" />
      <span className="page-sweep-needle-wrap">
        <svg className="page-sweep-needle" viewBox="0 0 120 120">
          <polygon points={NEEDLE.ivory} fill="#ece7dd" />
          <polygon points={NEEDLE.champagne} fill="#c3a268" />
          <line
            x1={NEEDLE.base.x1}
            y1={NEEDLE.base.y1}
            x2={NEEDLE.base.x2}
            y2={NEEDLE.base.y2}
            stroke="#ece7dd"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <span className="page-sweep-tick" />
      </span>
    </div>
  );
}
