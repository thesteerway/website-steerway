"use client";

import { useEffect } from "react";

/**
 * Declares an internal page's theme + signature colour. Sets data-page-theme on
 * <html> (so shared chrome — header, footer, spine, cursor — can adapt) and a
 * --sig / --sig-soft custom property the page and its components read. Cleans up
 * on unmount so client-side navigation to a dark page restores the dark theme.
 *
 * The dark cinematic homepage sets nothing and stays the default dark theme.
 */
export default function PageTheme({
  theme = "light",
  sig,
  sigSoft,
}: {
  theme?: "light" | "dark";
  /** signature accent colour for the page, e.g. a chart blue */
  sig?: string;
  /** a soft/tint version of the signature for washes and glows */
  sigSoft?: string;
}) {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-page-theme", theme);
    if (sig) html.style.setProperty("--sig", sig);
    if (sigSoft) html.style.setProperty("--sig-soft", sigSoft);
    return () => {
      html.removeAttribute("data-page-theme");
      html.style.removeProperty("--sig");
      html.style.removeProperty("--sig-soft");
    };
  }, [theme, sig, sigSoft]);

  return null;
}
