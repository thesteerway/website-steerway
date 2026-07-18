"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// GSAP + all plugins are free as of 2024. Register once on the client.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  if (process.env.NODE_ENV === "development") {
    // dev-only handle so headless verification can pump frames manually
    // (preview tabs may never fire requestAnimationFrame)
    (window as unknown as Record<string, unknown>).__gsap = gsap;
    (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
  }
}

export { gsap, ScrollTrigger, MotionPathPlugin };
