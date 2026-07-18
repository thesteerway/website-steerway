"use client";

import { useEffect } from "react";
import { markAppAlive } from "@/lib/introSeen";

/**
 * Internal pages have no needle loader, so they mark the document as
 * "entered" immediately: the header becomes visible and interactive.
 * They also mark the app alive, so navigating home afterwards (logo click)
 * lands on the hero, not the loader.
 */
export default function PageEnter() {
  useEffect(() => {
    markAppAlive();
    const html = document.documentElement;
    html.classList.add("entered");
    html.classList.remove("intro-lock", "at-footer");
  }, []);
  return null;
}
