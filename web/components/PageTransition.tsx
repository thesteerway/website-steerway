"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NEEDLE } from "@/lib/steerway";

/**
 * The needle transition. Clicking an internal link plays a small navigation
 * story instead of a flat wipe:
 *
 *  LEAVE   the two brand surfaces (ivory over obsidian, split by the champagne
 *          horizon) rise to cover the viewport while the secondary needle
 *          appears on the horizon line, swinging as it searches for bearing.
 *  LOCK    the needle settles upright with a tick-flash: bearing found.
 *  ENTER   the horizon keeps rising off the top, led by the needle, revealing
 *          the new page underneath; the needle dissolves as it exits.
 *
 * Modifier clicks, hash-only links, downloads and external targets pass
 * through untouched. Skipped entirely under prefers-reduced-motion.
 */
const LEAVE_MS = 620; // cover + search + lock
const ENTER_MS = 700; // reveal sweep

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);
  const first = useRef(true);

  // entrance: sweep the cover away once the new route has rendered.
  // Only plays when WE covered the screen (leave sweep ran); back/forward
  // navigations without a cover skip it so nothing flashes over content.
  useEffect(() => {
    const el = overlayRef.current!;
    if (first.current) {
      first.current = false;
      return;
    }
    if (!leaving.current) return;
    leaving.current = false;
    el.classList.remove("is-leaving");
    // force a reflow so leave -> enter always animates
    void el.offsetWidth;
    el.classList.add("is-entering");
    const t = window.setTimeout(
      () => el.classList.remove("is-entering"),
      ENTER_MS + 60
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
    // capture phase: run BEFORE Next's <Link> click handler, so the cover
    // sweep always precedes the route swap
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
