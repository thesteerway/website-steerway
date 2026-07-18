"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { PROCESS } from "@/lib/internal";
import { NEEDLE } from "@/lib/steerway";

/**
 * The Descent: the five checkpoints hang off one sinuous champagne route
 * flown top to bottom. The route is built at runtime through the station
 * anchors (so it always fits the real layout), drawn with dashoffset as you
 * scroll, and the secondary needle rides it, rotating into each bend. A
 * station unlocks (text reveals, deliverable chit stamps in) only when the
 * needle reaches it. Alternating sides + ghost numerals; atmosphere warms
 * stage by stage via [data-stage] on the wrapper.
 */
export default function DescentTimeline() {
  const rootRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const litRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rootRef.current!.classList.add("is-static");
      return;
    }

    const root = rootRef.current!;
    const svg = svgRef.current!;
    const path = pathRef.current!;
    const lit = litRef.current!;
    const needle = needleRef.current!;
    const stations = Array.from(
      root.querySelectorAll<HTMLElement>(".station")
    );

    let len = 0;
    let stationT: number[] = [];
    let smooth = 0;

    const build = () => {
      const rr = root.getBoundingClientRect();
      const w = root.clientWidth;
      const h = root.clientHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));

      // Dedicated mobile route: the flight plan rides the RIGHT edge as a
      // rail (stations run full-width beside it); desktop keeps the sinuous
      // centre route weaving between alternating stations.
      const mobile = window.matchMedia("(max-width: 860px)").matches;
      const cx = mobile ? w - 26 : w / 2;
      const bend = mobile ? 9 : Math.min(90, w * 0.06);
      // route anchors: entry at top, a dock beside each station
      // (opposite side of its text), exit at the bottom
      const pts: { x: number; y: number }[] = [{ x: cx, y: 0 }];
      stations.forEach((s, i) => {
        const sr = s.getBoundingClientRect();
        const y = sr.top - rr.top + sr.height * 0.24;
        // dock on the opposite side of the station's text
        pts.push({ x: cx + (mobile ? -bend : i % 2 === 0 ? bend : -bend), y });
      });
      pts.push({ x: cx, y: h });

      let d = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const my = (a.y + b.y) / 2;
        d += ` C ${a.x},${my} ${b.x},${my} ${b.x},${b.y}`;
      }
      path.setAttribute("d", d);
      lit.setAttribute("d", d);
      len = path.getTotalLength();
      lit.style.strokeDasharray = String(len);
      lit.style.strokeDashoffset = String(len);

      // station trigger t: fraction of length at the station's dock y
      stationT = stations.map((_, i) => {
        const target = pts[i + 1];
        let lo = 0;
        let hi = len;
        for (let k = 0; k < 18; k++) {
          const mid = (lo + hi) / 2;
          if (path.getPointAtLength(mid).y < target.y) lo = mid;
          else hi = mid;
        }
        return lo / len;
      });
    };

    const tick = () => {
      const rr = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress of the flight: viewport centre through the section
      const p = Math.min(
        1,
        Math.max(0, (vh * 0.55 - rr.top) / Math.max(1, rr.height))
      );
      smooth += (p - smooth) * 0.1;

      const at = smooth * len;
      const dp = Math.abs(p - smooth); // scroll velocity, for the stretch
      lit.style.strokeDashoffset = String(Math.max(0, len - at));
      const pos = path.getPointAtLength(at);
      // direction of travel: near the route's end getPointAtLength clamps and
      // ahead === pos, which made atan2 return 0 and the needle lie down
      // horizontally at touchdown. Sample BEHIND the needle there instead so
      // it keeps its true (downward) bearing to the very end.
      let ang: number;
      if (at + 4 <= len) {
        const ahead = path.getPointAtLength(at + 4);
        ang =
          (Math.atan2(ahead.y - pos.y, ahead.x - pos.x) * 180) / Math.PI + 90;
      } else {
        const behind = path.getPointAtLength(Math.max(0, at - 4));
        ang =
          (Math.atan2(pos.y - behind.y, pos.x - behind.x) * 180) / Math.PI + 90;
      }
      // the needle leans into scroll speed: a whisper of stretch, never a jolt
      const stretch = 1 + Math.min(0.22, dp * 6);
      needle.setAttribute(
        "transform",
        `translate(${pos.x} ${pos.y}) rotate(${ang}) scale(${0.32 * stretch} ${
          0.32 / Math.sqrt(stretch)
        })`
      );

      let stage = 0;
      stations.forEach((s, i) => {
        const hit = smooth >= stationT[i] - 0.015;
        // reveal is add-only: once a checkpoint is reached its text stays in,
        // so scrolling back up never re-hides it (the recurring "reveals not
        // happening" was partly this flicker). Atmosphere stage still tracks.
        if (hit) {
          s.classList.add("is-reached");
          stage = i;
        }
      });
      if (root.dataset.stage !== String(stage))
        root.dataset.stage = String(stage);
    };

    build();
    const t1 = window.setTimeout(build, 400);
    const t2 = window.setTimeout(build, 1600);
    window.addEventListener("resize", build);
    gsap.ticker.add(tick);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", build);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <section
      className="descent"
      ref={rootRef}
      data-stage="0"
      aria-label="Process checkpoints"
      data-spine="the descent"
    >
      <svg className="descent-svg" ref={svgRef} aria-hidden="true">
        <path className="descent-path" ref={pathRef} />
        <path className="descent-lit" ref={litRef} />
        <g ref={needleRef} className="descent-needle">
          {/* secondary needle mark, tip up at rotate(0), centred on (60,60).
              Includes the horizontal baseline: it is part of the mark. */}
          <g transform="translate(-60 -60)">
            <polygon points={NEEDLE.ivory} fill="#ece7dd" />
            <polygon points={NEEDLE.champagne} fill="#c3a268" />
            <line
              x1={NEEDLE.base.x1}
              y1={NEEDLE.base.y1}
              x2={NEEDLE.base.x2}
              y2={NEEDLE.base.y2}
              stroke="#ece7dd"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>

      {PROCESS.stages.map((st, i) => (
        <article
          className={`station${i % 2 === 0 ? " station--left" : " station--right"}`}
          key={st.index}
          style={{ "--si": i } as CSSProperties}
        >
          <span className="station-ghost" aria-hidden="true">
            {st.index}
          </span>
          <span className="station-dot" aria-hidden="true" />
          <div className="station-body">
            <span className="station-index mono">
              {st.index} / {st.title.toUpperCase()}
            </span>
            <h2 className="station-title">{st.title}</h2>
            <p className="station-copy">{st.body}</p>
            <p className="station-chit mono">
              <span className="station-chit-label">you get</span>
              {st.deliverable}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
