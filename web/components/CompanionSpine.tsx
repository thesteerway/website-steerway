"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * The companion spine (Air Centre principle: one connected page, not blocks):
 * a thin route rail fixed in the left margin of every internal page. The
 * traveler square rides it with the scroll; every element carrying a
 * [data-spine] label becomes a dock on the rail, lighting up as the square
 * passes and naming the current section in mono. Desktop only; hidden under
 * reduced motion.
 */
export default function CompanionSpine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1000px)").matches) return;

    const root = rootRef.current!;
    const square = squareRef.current!;
    const label = labelRef.current!;
    const dotsWrap = dotsRef.current!;
    root.classList.add("is-on");

    type Dock = { el: HTMLElement; name: string; frac: number; dot: HTMLSpanElement };
    let docks: Dock[] = [];
    let smooth = 0;

    const measure = () => {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - window.innerHeight);
      dotsWrap.innerHTML = "";
      docks = Array.from(
        document.querySelectorAll<HTMLElement>("[data-spine]")
      ).map((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        // fraction of the page scroll at which this section is in view
        const frac = Math.min(1, Math.max(0, (top - window.innerHeight * 0.35) / total));
        const dot = document.createElement("span");
        dot.className = "spine-dot";
        dot.style.top = `${frac * 100}%`;
        dotsWrap.appendChild(dot);
        return { el, name: el.dataset.spine || "", frac, dot };
      });
    };

    const tick = () => {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / total));
      smooth += (p - smooth) * 0.12;
      const railH = root.clientHeight;
      square.style.transform = `translateY(${smooth * railH}px) rotate(${smooth * 90}deg)`;

      let activeName = "";
      for (const d of docks) {
        const hit = smooth >= d.frac - 0.005;
        d.dot.classList.toggle("is-lit", hit);
        if (hit) activeName = d.name;
      }
      if (label.textContent !== activeName) label.textContent = activeName;
    };

    // sections can shift as fonts/images settle; re-measure a few times
    measure();
    const t1 = window.setTimeout(measure, 400);
    const t2 = window.setTimeout(measure, 1500);
    window.addEventListener("resize", measure);
    gsap.ticker.add(tick);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", measure);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="spine" ref={rootRef} aria-hidden="true">
      <span className="spine-rail" />
      <div className="spine-dots" ref={dotsRef} />
      <div className="spine-square" ref={squareRef} />
      <span className="spine-label mono" ref={labelRef} />
    </div>
  );
}
