"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Ties Lenis smooth-scroll to the GSAP ticker and keeps ScrollTrigger in sync.
 * Skipped entirely when the user prefers reduced motion (native scroll only).
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);
    // exposed so controls like BackToTop can request a smooth scroll that
    // stays in sync with Lenis instead of fighting it
    (window as unknown as Record<string, unknown>).__lenis = lenis;

    // The intro loader locks scrolling (overflow hidden); when it finishes,
    // Lenis and ScrollTrigger must re-measure the now-scrollable page.
    const onIntroDone = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("steerway:introdone", onIntroDone);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("steerway:introdone", onIntroDone);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
