"use client";

import Link from "next/link";
import { NAV_ROUTES, LOCALE } from "@/lib/internal";
import { NEEDLE } from "@/lib/steerway";

/** The primary header lockup (same mark the top nav uses). */
const PRIMARY_LOGO =
  "/brand/01_primary_logo/steerway_primary_header_lockup__USE_FOR_HEADER_ON_DARK.svg";

/**
 * Footer for internal pages, structured like the best studio sites:
 *   top row     the brand lockup on the left, the email as the footer's one
 *               big invitation on the right
 *   hairline
 *   base row    copyright | wayfinding links | coordinates
 * Behind it, the brand's S-route crosses the footer as a faint champagne
 * hairline with a single small light travelling it end to end: quiet,
 * continuous, unmistakably ours. Every component answers hover.
 */
export default function InternalFooter() {
  return (
    <footer className="ifooter">
      {/* the route behind everything: one hairline, one travelling light */}
      <div className="ifooter-veil" aria-hidden="true">
        <svg
          className="ifooter-route"
          viewBox="0 0 1200 160"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            id="ifooterPath"
            d="M-20,128 C220,150 340,44 600,78 C860,112 980,16 1220,40"
            fill="none"
            stroke="rgba(195,162,104,0.12)"
            strokeWidth="1"
          />
          {/* the secondary needle flies the route, nose along the bearing */}
          <g opacity="0.6">
            <animateMotion dur="18s" repeatCount="indefinite" rotate="auto">
              <mpath href="#ifooterPath" />
            </animateMotion>
            {/* needle geometry points UP at rest; rotate 90 so it flies +x */}
            <g transform="rotate(90) scale(0.16) translate(-60 -60)">
              <polygon points={NEEDLE.ivory} fill="#ece7dd" />
              <polygon points={NEEDLE.champagne} fill="#c3a268" />
            </g>
          </g>
        </svg>
      </div>

      <div className="ifooter-inner">
        <div className="ifooter-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ifooter-logo" src={PRIMARY_LOGO} alt="The Steerway" />
          <a className="ifooter-email" href={`mailto:${LOCALE.email}`}>
            {LOCALE.email}
          </a>
        </div>

        <span className="ifooter-rule" aria-hidden="true" />

        <div className="ifooter-base">
          <p className="ifooter-legal mono">© 2026 The Steerway</p>
          <nav className="ifooter-links" aria-label="Footer">
            {NAV_ROUTES.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            <Link href="/contact#faqs">FAQs</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
          <p className="ifooter-locale mono">{LOCALE.coordinates}</p>
        </div>
      </div>
    </footer>
  );
}
