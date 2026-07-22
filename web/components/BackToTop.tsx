"use client";

import { useEffect, useRef, useState } from "react";
import { NEEDLE } from "@/lib/steerway";

/**
 * Back-to-top control, in the house language: the secondary needle standing
 * upright inside an obsidian glass disc with a champagne rim. Fades in once
 * the visitor is a screen or so down, and rides Lenis back to the top so the
 * return is as smooth as the rest of the scroll. Hidden over the footer
 * payoff (html.at-footer) so it never fights the finale.
 */
export default function BackToTop() {
  const [shown, setShown] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setShown(window.scrollY > window.innerHeight * 1.1);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } })
      .__lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      className={`to-top${shown ? " is-shown" : ""}`}
      aria-label="Back to top"
      onClick={toTop}
    >
      <span className="to-top-ring" aria-hidden="true" />
      <svg className="to-top-needle" viewBox="0 0 120 120" aria-hidden="true">
        <polygon points={NEEDLE.ivory} fill="#ece7dd" />
        <polygon points={NEEDLE.champagne} fill="#c3a268" />
      </svg>
    </button>
  );
}
