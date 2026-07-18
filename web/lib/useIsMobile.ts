"use client";

import { useEffect, useState } from "react";

/** The one breakpoint the dedicated mobile experience hangs off. */
export const MOBILE_QUERY = "(max-width: 860px)";

/**
 * Device gate for the dedicated mobile experience. Returns `null` before
 * mount (SSR renders neither variant of a gated section; every gated section
 * sits below the fold or behind the intro, so nothing visible pops), then
 * true/false and live-updates on resize.
 */
export default function useIsMobile(): boolean | null {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mobile;
}
