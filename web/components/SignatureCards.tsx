"use client";

import { useEffect, useRef } from "react";
import { STUDIO } from "@/lib/internal";

/**
 * The Signatures: full-bleed stills, one per card, stacked linearity-style.
 * The image owns the whole card (small margin of card padding only); the
 * copy sits quietly inside its lower-left corner over a scrim.
 *
 * Motion:
 *  - reveal: each card enters with a slow zoom-out of the still (scale 1.12
 *    -> 1) while the card itself rises and sharpens, once, on first view
 *  - pointer: the visual tilts a few degrees toward the cursor and the
 *    still drifts against it (parallax), so every card feels dimensional
 */
export default function SignatureCards() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".sig-card"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cards.forEach((c) => c.classList.add("is-in"));
      return;
    }

    // reveal is add-only: the zoom-in plays once per card. rootMargin trims
    // the bottom so even the FIRST card is well inside the viewport before it
    // reveals (otherwise it reads as "already there" on section entry).
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -18% 0px" }
    );
    cards.forEach((c) => io.observe(c));

    // pointer tilt + parallax, only on fine pointers
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cleanups: (() => void)[] = [];
    if (fine) {
      cards.forEach((card) => {
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
          const ny = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty("--tx", nx.toFixed(3));
          card.style.setProperty("--ty", ny.toFixed(3));
        };
        const onLeave = () => {
          card.style.setProperty("--tx", "0");
          card.style.setProperty("--ty", "0");
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    return () => {
      io.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      className="sigs"
      ref={rootRef}
      aria-label={STUDIO.signaturesLabel}
      data-spine="the signatures"
    >
      <header className="sigs-head">
        <p className="plates-lead">{STUDIO.signaturesLead}</p>
      </header>

      <div className="sigs-stack">
        {STUDIO.signatures.map((s, i) => (
          <article
            className="sig-card"
            key={s.id}
            data-sig={s.id}
            style={{ ["--i" as string]: i }}
          >
            <div className="sig-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="sig-still" src={s.still} alt={s.title} />
              <span className="sig-scrim" aria-hidden="true" />
              <span className="sig-index mono">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(STUDIO.signatures.length).padStart(2, "0")}
              </span>
              <div className="sig-copy">
                <h3 className="sig-title">{s.title}</h3>
                <p className="sig-line">{s.line}</p>
                <ul className="sig-features" aria-label="Capabilities">
                  {s.meta.split(" / ").map((f) => (
                    <li className="sig-feature mono" key={f}>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
