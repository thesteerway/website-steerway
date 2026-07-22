"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROCESS } from "@/lib/internal";

/**
 * What holds it together: the working principles, told as a horizontal
 * gallery. On desktop the section pins and vertical scroll drives the deck
 * of cards sideways past the reader (one continuous motion, ux-machina
 * style); each card lifts and lights under the cursor (miux-style display
 * effect). On touch / reduced-motion it degrades to a native scroll-snap
 * carousel, so the same content reads without the pin.
 */
export default function PrinciplePlates() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const track = trackRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(max-width: 860px), (pointer: coarse)").matches;
    if (reduce || coarse) {
      root.classList.add("hcards--native");
      return;
    }

    const ctx = gsap.context(() => {
      const getDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + getDistance(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // reveal each card as it enters the frame from the right
      const cards = Array.from(track.querySelectorAll<HTMLElement>(".hcard"));
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.35, y: 26 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 88%",
              end: "left 55%",
              scrub: true,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="hcards"
      ref={rootRef}
      data-spine="the discipline"
      aria-label={PROCESS.principlesLabel}
    >
      <div className="hcards-viewport">
        <div className="hcards-track" ref={trackRef}>
          {/* intro panel: the section's own title, as the first card */}
          <article className="hcard hcard--intro">
            <p className="hcard-eyebrow mono">The discipline</p>
            <h2 className="hcard-introtitle">{PROCESS.principlesLabel}</h2>
            <p className="hcard-introlead">{PROCESS.principlesLead}</p>
            <span className="hcard-scrollhint mono" aria-hidden="true">
              scroll →
            </span>
          </article>

          {PROCESS.principles.map((p) => (
            <article className="hcard" key={p.index} tabIndex={0}>
              {/* resting face: the principle named, quiet and large */}
              <div className="hcard-face">
                <span className="hcard-num" aria-hidden="true">
                  {p.index}
                </span>
                <span className="hcard-index mono">
                  {p.index} / {String(PROCESS.principles.length).padStart(2, "0")}
                </span>
                <h3 className="hcard-title">{p.title}</h3>
                <span className="hcard-more mono" aria-hidden="true">
                  the rule ↗
                </span>
              </div>
              {/* hover face: a champagne panel wipes up, the content becomes
                  the full statement in obsidian ink — a complete inversion */}
              <div className="hcard-reveal" aria-hidden="true">
                <span className="hcard-reveal-index mono">{p.index}</span>
                <p className="hcard-statement">{p.statement}</p>
                <p className="hcard-note">{p.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
