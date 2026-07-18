"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { PROCESS } from "@/lib/internal";

/**
 * What holds it together: the working principles, typeset large right after
 * the five stages. Moved here from the Studio page because THIS is where
 * trust is earned: the reader has just seen how we work; now they read why
 * it holds. Each statement reveals word by word as its plate scrolls in;
 * the word under the cursor turns italic champagne (the cinema's "steer"
 * gesture). Alternating statement / supporting-note rhythm, no clutter.
 */
export default function PrinciplePlates() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const plates = Array.from(root.querySelectorAll<HTMLElement>(".plate"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      plates.forEach((p) => p.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -12% 0px" }
    );
    plates.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  return (
    <section
      className="plates plates--process"
      ref={rootRef}
      data-spine="the discipline"
      aria-label={PROCESS.principlesLabel}
    >
      <header className="plates-head">
        <p className="proof-label mono">{PROCESS.principlesLabel}</p>
        <p className="plates-lead">{PROCESS.principlesLead}</p>
      </header>
      {PROCESS.principles.map((p) => (
        <article className="plate" key={p.index}>
          <span className="plate-index mono">{p.index}</span>
          <h2 className="plate-statement" aria-label={p.statement}>
            {p.statement.split(" ").map((w, i) => (
              <span
                className="plate-w"
                key={i}
                style={{ "--wd": `${i * 0.04}s` } as CSSProperties}
                onMouseEnter={(e) => e.currentTarget.classList.add("is-hot")}
                onMouseLeave={(e) => e.currentTarget.classList.remove("is-hot")}
              >
                {w}
              </span>
            ))}
          </h2>
          <div className="plate-aside">
            <h3 className="plate-title mono">{p.title}</h3>
            <p className="plate-body">{p.note}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
