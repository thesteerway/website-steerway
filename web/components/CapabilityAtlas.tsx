"use client";

import { useEffect, useRef, useState } from "react";
import { FAMILIES } from "@/lib/internal";

/**
 * The Capability Atlas: the full service inventory as a quiet, editorial
 * index. A sticky rail lists the eight capabilities; the reading column walks
 * through each one with its complete catalogue: every service named, every
 * service explained in one plain line. Interactions stay at whisper level
 * (soft row highlight, a bearing readout ticking in the rail) so the living
 * grid behind the page remains the only spectacle.
 */
export default function CapabilityAtlas() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current!;
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>(".atlas-fam")
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = sections.indexOf(e.target as HTMLElement);
            if (i >= 0) setActive(i);
          }
        }
      },
      { rootMargin: "-38% 0px -52% 0px" }
    );
    sections.forEach((s) => io.observe(s));

    // gentle rise-in per section
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      sections.forEach((s) => s.classList.add("is-in"));
    } else {
      const io2 = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io2.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      sections.forEach((s) => io2.observe(s));
      return () => {
        io.disconnect();
        io2.disconnect();
      };
    }
    return () => io.disconnect();
  }, []);

  const jump = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="atlas" ref={rootRef} aria-label="The capability atlas">
      <aside className="atlas-rail" aria-label="Capabilities">
        <p className="atlas-rail-label mono">The atlas</p>
        <ul>
          {FAMILIES.map((f, i) => (
            <li key={f.id}>
              <button
                className={`atlas-rail-item${active === i ? " is-active" : ""}`}
                onClick={() => jump(f.id)}
              >
                <span className="atlas-rail-num mono">{f.index}</span>
                <span className="atlas-rail-name">{f.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="atlas-rail-bearing mono" aria-hidden="true">
          HDG {String((active * 45) % 360).padStart(3, "0")}
        </p>
      </aside>

      <div className="atlas-read">
        {FAMILIES.map((f) => (
          <article className="atlas-fam" key={f.id} id={f.id}>
            <header className="atlas-head">
              <span className="atlas-index mono">
                {f.index} · BEARING {String((Number(f.index) - 1) * 45).padStart(3, "0")}
              </span>
              <h2 className="atlas-title">{f.title}</h2>
              <p className="atlas-meaning">{f.meaning}</p>
              <p className="atlas-route mono" aria-hidden="true">
                {f.route.join("  →  ")}
              </p>
            </header>
            <ul className="atlas-services">
              {f.catalog.map((s) => (
                <li className="atlas-service" key={s.name}>
                  <span className="atlas-service-name">{s.name}</span>
                  <span className="atlas-service-use">{s.use}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
