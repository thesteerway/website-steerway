"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HERO } from "@/lib/steerway";
import { NAV_ROUTES } from "@/lib/internal";
import ArrowUpRight from "@/components/ArrowUpRight";
import CtaWhisper from "@/components/CtaWhisper";

/** Contact stays out of the top nav; the Build with us CTA already routes there. */
const HEADER_ROUTES = NAV_ROUTES.filter((r) => r.href !== "/contact");

const HEADER_LOGO =
  "/brand/01_primary_logo/steerway_primary_header_lockup__USE_FOR_HEADER_ON_DARK.svg";
const HEADER_LOGO_LIGHT =
  "/brand/01_primary_logo/steerway_primary_header_lockup__on_light.svg";

/**
 * Appears once the needle loader completes (html.entered; internal pages set
 * it immediately via PageEnter). Hides when the user scrolls down past the
 * hero; any upward scroll brings it back. Stays hidden over the footer payoff
 * (html.at-footer wins via CSS). Current route gets a persistent underline.
 *
 * On mobile the link row gives way to a burger and a full-screen obsidian
 * menu: Fraunces display links revealing in a stagger, champagne rule, the
 * Build with us CTA at the foot. Scroll locks while it is open.
 */
export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      lastY.current = y;
      if (dy < -2) {
        setHidden(false); // any scroll up reveals
      } else if (dy > 2 && y > window.innerHeight * 0.9) {
        setHidden(true); // scrolling down past the hero hides
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // the open menu locks the page behind it; Escape closes
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // route change (tapping a link) closes the menu
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`site-header${hidden && !open ? " is-hidden" : ""}`}>
        <Link href="/" aria-label="The Steerway home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="header-mark header-mark--dark" src={HEADER_LOGO} alt="The Steerway" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="header-mark header-mark--light" src={HEADER_LOGO_LIGHT} alt="" aria-hidden="true" />
        </Link>
        <nav className="site-nav-desktop">
          {HEADER_ROUTES.map(({ label, href }) => (
            <Link
              key={href}
              className={`nav-link${pathname === href ? " nav-link--active" : ""}`}
              href={href}
            >
              {label}
            </Link>
          ))}
          <span className="cta-stack cta-stack--drop">
            <Link className="header-cta" href="/contact">
              {HERO.ctaPrimary}
              <ArrowUpRight />
            </Link>
            <CtaWhisper />
          </span>
        </nav>
        <button
          className={`nav-burger${open ? " is-open" : ""}`}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      {/* the mobile menu: a room of its own, in the house style */}
      <div className={`mobile-menu${open ? " is-open" : ""}`} aria-hidden={!open}>
        <nav className="mobile-menu-links" aria-label="Menu">
          {HEADER_ROUTES.map(({ label, href }, i) => (
            <Link
              key={href}
              href={href}
              className={`mobile-menu-link${pathname === href ? " is-active" : ""}`}
              style={{ ["--mi" as string]: i }}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-menu-index mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-foot" style={{ ["--mi" as string]: HEADER_ROUTES.length }}>
          <span className="mobile-menu-rule" aria-hidden="true" />
          <Link className="btn btn--primary" href="/contact" onClick={() => setOpen(false)}>
            {HERO.ctaPrimary}
            <ArrowUpRight />
          </Link>
          <a className="mobile-menu-mail mono" href="mailto:build@thesteerway.com">
            build@thesteerway.com
          </a>
        </div>
      </div>
    </>
  );
}
