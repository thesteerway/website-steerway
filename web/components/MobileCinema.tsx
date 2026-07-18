"use client";

import { useEffect, useRef } from "react";
import { CINEMA, NODES, FOOTER } from "@/lib/steerway";
import { NAV_ROUTES } from "@/lib/internal";
import ArrowUpRight from "@/components/ArrowUpRight";
import CtaWhisper from "@/components/CtaWhisper";

/**
 * The cinema, retold for the hand. No pin, no camera: the route is a
 * champagne rail running down the left edge that fills as the reader
 * travels, and each capability node docks onto it as a full-width card,
 * revealed once, in order. The finale and footer payoff carry the same
 * copy and the same wordmark as the desktop cinema, so the two experiences
 * end on the identical note. Everything is scroll-native and touch-cheap:
 * one passive scroll listener for the rail, one IntersectionObserver for
 * the reveals.
 */
export default function MobileCinema() {
  const routeRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = routeRef.current!;
    const fill = fillRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // node reveals: add-only, so scrolling back never re-hides
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".mnode, .mroute-finale"));
    if (reduce) {
      nodes.forEach((n) => n.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      nodes.forEach((n) => io.observe(n));

      // the rail fills with the journey
      let raf = 0;
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = root.getBoundingClientRect();
          const vh = window.innerHeight;
          const p = Math.min(1, Math.max(0, (vh * 0.65 - r.top) / Math.max(1, r.height)));
          fill.style.transform = `scaleY(${p})`;
        });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(raf);
      };
    }
  }, []);

  return (
    <div id="cinema">
      <section className="mroute" ref={routeRef} aria-label="What we build">
        {/* the rail: dim route ahead, champagne route travelled */}
        <div className="mroute-rail" aria-hidden="true">
          <span className="mroute-rail-fill" ref={fillRef} />
        </div>

        <header className="mroute-head">
          <h2 className="mroute-line">{CINEMA.entryLine}</h2>
        </header>

        {NODES.map((n, i) => (
          <article className="mnode" key={n.id}>
            <span className="mnode-dot" aria-hidden="true" />
            <span className="mnode-index mono">
              {String(i + 1).padStart(2, "0")} / {String(NODES.length).padStart(2, "0")}
            </span>
            <h3 className="mnode-word">{n.capability}</h3>
            <p className="mnode-line">{n.meaning}</p>
            <a className="mnode-cta" href={`/what-we-build#${n.family}`}>
              {n.cta}
              <ArrowUpRight />
            </a>
          </article>
        ))}

        {/* finale: the same payoff, at rest */}
        <div className="mroute-finale">
          <p className="hero-lead">{CINEMA.conversion.lead}</p>
          <h2 className="cinema-title">
            {CINEMA.conversion.titlePre}
            <em className="mroute-steer">{CINEMA.conversion.titleWord}</em>
            {CINEMA.conversion.titlePost}
          </h2>
          <p className="sub">{CINEMA.conversion.sub}</p>
          <div className="cta-row">
            <span className="cta-stack cta-stack--drop">
              <a className="btn btn--primary" href="/contact">
                {CINEMA.conversion.ctaPrimary}
                <ArrowUpRight />
              </a>
              <CtaWhisper center />
            </span>
            <a className="btn" href="/process">
              {CINEMA.conversion.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* footer payoff: identical wordmark, the period simply present */}
      <footer className="footer footer--static" id="contact">
        <p className="micro">{FOOTER.micro}</p>
        <div className="wordmark wordmark--fill" aria-label="STEERWAY.">
          {"STEERWAY".split("").map((ch, i) => (
            <span className="letter" key={i}>
              {ch}
            </span>
          ))}
          <span className="period-slot">
            <span className="period-static" />
          </span>
        </div>
        <div className="foot-links">
          {NAV_ROUTES.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <p className="foot-legal mono">© 2026 The Steerway</p>
      </footer>
    </div>
  );
}
