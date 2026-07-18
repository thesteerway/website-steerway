"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import HeroFieldBackground from "@/components/HeroFieldBackground";
import ArrowUpRight from "@/components/ArrowUpRight";
import CtaWhisper from "@/components/CtaWhisper";
import ScrollCue from "@/components/ScrollCue";
import { HERO } from "@/lib/steerway";

/**
 * Hero shell per the V3 contract: powerful Fraunces-led typography over the
 * vector-field canvas, restrained CTAs, scroll cue. No cards, no mockups.
 *
 * Motion: once the needle loader hands the page over, the hero does not just
 * appear; it is staged. The field settles from a slight overscale, headline
 * lines rise out of their own masks, and subcopy / CTAs / cue follow with a
 * blur-to-sharp cascade. Each text block then fades/lifts away as it scrolls
 * past and reveals again on the way back (scrubbed, so both directions are
 * smooth).
 */
export default function HeroTypographicField() {
  const rootRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const shell = shellRef.current!;
      const root = rootRef.current!;
      const field = root.querySelector<HTMLElement>(".hero-field");
      const lines = shell.querySelectorAll<HTMLElement>(".hero-line-inner");
      const rest = shell.querySelectorAll<HTMLElement>(
        ".hero-subcopy, .hero-ctas, .hero-cue"
      );
      const items = shell.querySelectorAll<HTMLElement>(
        ".hero-line, .hero-subcopy, .hero-ctas, .hero-cue"
      );

      // pre-stage everything so nothing flashes before the reveal
      const stage = () => {
        gsap.set(shell, { opacity: 1 });
        gsap.set(lines, { yPercent: 112 });
        gsap.set(rest, { opacity: 0, y: 30, filter: "blur(10px)" });
        if (field) gsap.set(field, { scale: 1.07, opacity: 0 });
      };

      // depth-staged intro once the loader hands the page over
      const reveal = () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          // the scrubbed hide tween below captured its start values while
          // everything was still staged at opacity 0; once the intro has
          // actually revealed the hero, re-capture them at the visible state.
          // Without this, the first scroll on a hard load interpolated the
          // CTAs from 0 to 0 and they vanished (the first-visit button glitch).
          onComplete: () => scrubTween.invalidate(),
        });
        if (field)
          tl.to(field, { scale: 1, opacity: 1, duration: 1.9, ease: "power2.out" }, 0);
        tl.to(lines, { yPercent: 0, duration: 1.15, stagger: 0.14 }, 0.08)
          .to(
            rest,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.95,
              stagger: 0.12,
            },
            0.5
          );
      };

      stage();
      if (document.documentElement.classList.contains("entered")) {
        reveal();
      } else {
        window.addEventListener("steerway:introdone", reveal, { once: true });
      }

      // scrubbed hide/reveal: scrolling past fades the text away, scrolling
      // back up reveals it again
      const scrubTween = gsap.to(items, {
        opacity: 0,
        y: -56,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "78% top",
          scrub: true,
        },
      });

      return () => {
        window.removeEventListener("steerway:introdone", reveal);
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-section" id="hero" aria-label="Hero" ref={rootRef}>
      <HeroFieldBackground />
      <div className="hero-shell" ref={shellRef}>
        <h1 className="hero-headline">
          <span className="hero-line">
            <span className="hero-line-inner">{HERO.headlineA}</span>
          </span>
          <span className="hero-line hero-line--accent">
            <span className="hero-line-inner">{HERO.headlineB}</span>
          </span>
        </h1>
        <p className="hero-subcopy">{HERO.subcopy}</p>
        <div className="hero-ctas">
          <span className="cta-stack">
            <a className="btn btn--primary" href="/contact">
              {HERO.ctaPrimary}
              <ArrowUpRight />
            </a>
            <CtaWhisper />
          </span>
          <a className="btn" href="#cinema">
            {HERO.ctaSecondary}
          </a>
        </div>
        <p className="desktop-note mono" aria-hidden="true">
          Best experienced on a larger screen
        </p>
        <div className="hero-cue">
          <span>{HERO.scrollCue}</span>
          <ScrollCue />
        </div>
      </div>
    </section>
  );
}
