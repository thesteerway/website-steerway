"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MARK, TL, NODES, CINEMA, FOOTER } from "@/lib/steerway";
import { NAV_ROUTES } from "@/lib/internal";
import ArrowUpRight from "@/components/ArrowUpRight";
import CtaWhisper from "@/components/CtaWhisper";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};
const falloff = (d: number, w: number) => smooth(1 - Math.abs(d) / w);

/** half width of the carved channel in world units (mask strokeWidth 13) */
const CHANNEL_HALF = 6.5;

/** ambient dust in the dark field beyond the disc (world coords, fixed) */
const MOTES = [
  { x: 9, y: 18, r: 0.55, d: 0 },
  { x: 22, y: 106, r: 0.4, d: 1.4 },
  { x: 104, y: 12, r: 0.45, d: 2.6 },
  { x: 113, y: 74, r: 0.6, d: 0.8 },
  { x: 6, y: 62, r: 0.4, d: 3.4 },
  { x: 96, y: 110, r: 0.5, d: 2.0 },
  { x: 58, y: 6, r: 0.4, d: 4.2 },
  { x: 116, y: 42, r: 0.35, d: 1.0 },
  { x: 14, y: 90, r: 0.5, d: 3.0 },
  { x: 70, y: 114, r: 0.4, d: 0.4 },
] as const;

/**
 * The cinema, rebuilt so it cannot desync.
 *
 * - Handoff: the ticker seal itself is steered to the exact screen rect the
 *   cinema world seal occupies at pin start (same 0..120 frame, same scale),
 *   then swapped for the live world in a single frame. One logo, one moment.
 * - Traveller: ONE champagne square. It starts as the seal's own square
 *   (projected at true world size), shrinks while sliding into the carved
 *   channel, rides the route, then travels the underline of the finale title
 *   and finally lands as the period in the footer. It never fades and swaps.
 * - Nodes: anchors are computed at runtime into the ivory field (clearance
 *   scored against the whole path, kept inside the disc), so node typography
 *   is always dark ink on light ground. The camera biases toward the active
 *   anchor so the text always has room; the path does not need to be centred.
 * - Finale: the world fades out entirely; the square rides the title
 *   underline and italicises the word "steer" letter by letter as it passes.
 */
export default function CinemaSequence() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const ambientRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const camGRef = useRef<SVGGElement>(null);
  const roadLitRef = useRef<SVGPathElement>(null);
  const worldSquareRef = useRef<SVGRectElement>(null);
  const ticksRef = useRef<SVGGElement>(null);

  const entryRef = useRef<HTMLDivElement>(null);
  const convRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const underFillRef = useRef<HTMLSpanElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const camG = camGRef.current!;
      const roadLit = roadLitRef.current!;
      const traveler = travelerRef.current!;
      const worldSquare = worldSquareRef.current!;
      const underline = underlineRef.current!;
      const underFill = underFillRef.current!;
      const nodeEls = Array.from(
        rootRef.current!.querySelectorAll<HTMLElement>(".cnode")
      );
      const steerEls = Array.from(
        rootRef.current!.querySelectorAll<HTMLElement>(".steer-ch")
      );

      // A measuring path in the same 0..120 world space as the road.
      const measure = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      measure.setAttribute("d", MARK.sPath);
      const refLen = measure.getTotalLength();
      const userAtT = (t: number) => measure.getPointAtLength(refLen * t);
      const nodeUser = NODES.map((n) => userAtT(n.t));

      // roadside measurement ticks: perpendicular hairline marks flanking the
      // route so the channel reads as a surveyed instrument, not a blank road
      const ticksG = ticksRef.current;
      if (ticksG && ticksG.childElementCount === 0) {
        const svgNS = "http://www.w3.org/2000/svg";
        for (let i = 1; i < 40; i++) {
          const tt = i / 40;
          const p = userAtT(tt);
          const p2 = userAtT(Math.min(1, tt + 0.008));
          const dxx = p2.x - p.x;
          const dyy = p2.y - p.y;
          const L = Math.hypot(dxx, dyy) || 1;
          const nx = -dyy / L;
          const ny = dxx / L;
          for (const dir of [1, -1]) {
            const ln = document.createElementNS(svgNS, "line");
            ln.setAttribute("x1", String(p.x + nx * dir * 4.1));
            ln.setAttribute("y1", String(p.y + ny * dir * 4.1));
            ln.setAttribute("x2", String(p.x + nx * dir * 5.3));
            ln.setAttribute("y2", String(p.y + ny * dir * 5.3));
            ln.setAttribute("stroke", "rgba(223,193,136,0.16)");
            ln.setAttribute("stroke-width", "0.3");
            ticksG.appendChild(ln);
          }
        }
      }

      // ---- node anchors: always in the ivory field --------------------------
      // For each node, pick the side of the path (along the normal) whose
      // anchor has the most clearance from the whole channel and stays well
      // inside the ivory disc. All node type is dark ink as a result.
      const samples = Array.from({ length: 241 }, (_, i) => userAtT(i / 240));
      const distToPath = (x: number, y: number) => {
        let d = Infinity;
        for (const s of samples) {
          const dd = Math.hypot(s.x - x, s.y - y);
          if (dd < d) d = dd;
        }
        return d;
      };
      const bNow = Math.min(window.innerWidth, window.innerHeight) / 120;
      const nodeAnchor = NODES.map((n, i) => {
        const p = nodeUser[i];
        const p2 = userAtT(Math.min(1, n.t + 0.012));
        const p1 = userAtT(Math.max(0, n.t - 0.012));
        const tx = p2.x - p1.x;
        const ty = p2.y - p1.y;
        const L = Math.hypot(tx, ty) || 1;
        const nx = -ty / L;
        const ny = tx / L;
        // text half-extent in world units at travel zoom
        const el = nodeEls[i];
        const halfW = (el ? el.offsetWidth / 2 : 190) / (TL.travelZoom * bNow);
        const off = CHANNEL_HALF + 3.5 + halfW;
        let best = { x: p.x + nx * off, y: p.y + ny * off };
        let bestScore = -Infinity;
        for (const dir of [1, -1]) {
          const ax = p.x + nx * dir * off;
          const ay = p.y + ny * dir * off;
          const dCenter = Math.hypot(ax - MARK.circle.cx, ay - MARK.circle.cy);
          const inside = dCenter < MARK.circle.r - 9 ? 0 : -1000;
          const score = inside + distToPath(ax, ay);
          if (score > bestScore) {
            bestScore = score;
            best = { x: ax, y: ay };
          }
        }
        return best;
      });

      // place the static carved node markers on the road (world coords)
      rootRef
        .current!.querySelectorAll<SVGCircleElement>(".road-node")
        .forEach((c, i) => {
          c.setAttribute("cx", String(nodeUser[i].x));
          c.setAttribute("cy", String(nodeUser[i].y));
        });

      const litLen = roadLit.getTotalLength();
      gsap.set(roadLit, { strokeDasharray: litLen, strokeDashoffset: litLen });
      gsap.set(traveler, { opacity: 0 });

      let targetP = 0;
      let curP = 0; // square smoothed progress
      let camP = 0; // camera lagged progress -> square leads
      let stageActive = false;
      let footerActive = false;
      let footerProg = 0;
      let footerStart = { x: 0, y: 0 };
      let steerDirty = false;

      const squareC = {
        x: MARK.square.x + MARK.square.size / 2,
        y: MARK.square.y + MARK.square.size / 2,
      };

      const progressToT = (p: number) => {
        const [s, e] = TL.travel;
        if (p <= s) return 1;
        if (p >= e) return 0;
        return 1 - (p - s) / (e - s);
      };

      const clearSteer = () => {
        if (!steerDirty) return;
        steerDirty = false;
        for (const el of steerEls) el.classList.remove("is-it");
        underFill.style.transform = "scaleX(0)";
      };

      const render = () => {
        curP += (targetP - curP) * TL.travelerLerp;
        camP += (curP - camP) * TL.cameraLerp;
        const t = progressToT(curP);
        const camT = progressToT(camP);

        // ---- explicit camera math (viewBox 0..120, meet) -------------------
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const b = Math.min(vw, vh) / 120; // meet scale
        const ox = (vw - 120 * b) / 2;
        const oy = (vh - 120 * b) / 2;

        let S: number;
        let focusU: { x: number; y: number };
        const [, enterEnd] = TL.enter;
        if (curP <= enterEnd) {
          const k = smooth(curP / enterEnd);
          S = lerp(TL.restZoom, TL.travelZoom, k);
          focusU = {
            x: lerp(MARK.center.x, userAtT(1).x, k),
            y: lerp(MARK.center.y, userAtT(1).y, k),
          };
        } else if (curP < TL.exit[0]) {
          S = TL.travelZoom;
          const pc = userAtT(camT);
          focusU = { x: pc.x, y: pc.y };
          // bias the camera toward the active node's ivory anchor so the
          // text always has room in the light field (path need not centre)
          for (let i = 0; i < NODES.length; i++) {
            const a = falloff(camT - NODES[i].t, TL.nodeWindow * 1.35);
            if (a > 0) {
              // frame the MIDPOINT between route and node text, weighted
              // toward the text: both stay comfortably on screen
              focusU.x += (nodeAnchor[i].x - nodeUser[i].x) * 0.85 * a;
              focusU.y += (nodeAnchor[i].y - nodeUser[i].y) * 0.85 * a;
            }
          }
        } else {
          // exit: no pull-back. The camera keeps pushing gently IN while the
          // world dissolves around the square, still zoomed, still close.
          const k = smooth((curP - TL.exit[0]) / (TL.exit[1] - TL.exit[0]));
          S = lerp(TL.travelZoom, TL.payoffZoom, k);
          const pc = userAtT(camT);
          focusU = { x: pc.x, y: pc.y };
        }

        const F = { x: vw * TL.focus.x, y: vh * TL.focus.y };
        // group translate (world units) so focusU lands at F on screen
        const Gx = (F.x - ox) / b - S * focusU.x;
        const Gy = (F.y - oy) / b - S * focusU.y;
        camG.setAttribute("transform", `translate(${Gx} ${Gy}) scale(${S})`);

        // project a world point to screen using the SAME math
        const project = (u: { x: number; y: number }) => ({
          x: b * (S * u.x + Gx) + ox,
          y: b * (S * u.y + Gy) + oy,
        });

        if (ambientRef.current) {
          ambientRef.current.style.transform = `translate(${
            (Gx * b) / 6
          }px, ${(Gy * b) / 6}px)`;
        }

        // ---- the one traveller ---------------------------------------------
        const baseOpacity = stageActive || footerActive ? 1 : 0;
        if (footerActive) {
          // the finale is over: the underline and the italics must read as
          // completed even if the pin ended mid-ride
          underFill.style.transform = "scaleX(1)";
          for (const el of steerEls) el.classList.add("is-it");
          steerDirty = true;
          const slot = periodRef.current!.getBoundingClientRect();
          const q = footerProg;
          gsap.set(traveler, {
            x: lerp(footerStart.x, slot.left + slot.width / 2, q),
            y: lerp(footerStart.y, slot.top + slot.height / 2, q),
            xPercent: -50,
            yPercent: -50,
            opacity: 1,
            scale: lerp(0.7, slot.width / 22, q),
          });
        } else if (curP >= TL.finale[0]) {
          // world is fading out; the square heads for the title underline,
          // rides it and italicises "steer" letter by letter as it passes
          const uRect = underline.getBoundingClientRect();
          const yU = uRect.top + uRect.height / 2;
          const [uStart, uEnd] = TL.underline;
          if (curP < uStart) {
            const k = smooth((curP - TL.finale[0]) / (uStart - TL.finale[0]));
            const from = project(userAtT(0));
            gsap.set(traveler, {
              x: lerp(from.x, uRect.left, k),
              y: lerp(from.y, yU, k),
              xPercent: -50,
              yPercent: -50,
              scale: lerp(1, 0.7, k),
              opacity: baseOpacity,
            });
            clearSteer();
          } else {
            // the ride completes at uEnd, safely BEFORE the pin releases, so
            // the underline always draws its full length
            const q = clamp01((curP - uStart) / (uEnd - uStart));
            const x = lerp(uRect.left, uRect.right, q);
            gsap.set(traveler, {
              x,
              y: yU,
              xPercent: -50,
              yPercent: -50,
              scale: 0.7,
              opacity: baseOpacity,
            });
            underFill.style.transform = `scaleX(${q})`;
            steerDirty = true;
            for (const el of steerEls) {
              const r = el.getBoundingClientRect();
              el.classList.toggle("is-it", x >= r.left + r.width * 0.5);
            }
          }
        } else if (curP <= enterEnd) {
          // the seal's own square resizes itself and slides INTO the channel:
          // no fade, no swap, one continuous object
          clearSteer();
          const k = smooth(curP / enterEnd);
          const start = userAtT(1);
          const posU = {
            x: lerp(squareC.x, start.x, k),
            y: lerp(squareC.y, start.y, k),
          };
          const pos = project(posU);
          const sizePx = lerp(MARK.square.size * S * b, 18, k);
          gsap.set(traveler, {
            x: pos.x,
            y: pos.y,
            xPercent: -50,
            yPercent: -50,
            scale: sizePx / 18,
            opacity: baseOpacity,
          });
        } else {
          clearSteer();
          const pos = project(userAtT(t));
          let pulse = 0;
          for (const n of NODES)
            pulse = Math.max(pulse, falloff(t - n.t, TL.nodeWindow));
          gsap.set(traveler, {
            x: pos.x,
            y: pos.y,
            xPercent: -50,
            yPercent: -50,
            scale: 1 + pulse * 0.32,
            opacity: baseOpacity,
          });
        }
        const covered = clamp01(1 - t);
        gsap.set(roadLit, { strokeDashoffset: litLen * (1 - covered) });

        // ---- node reveals: dark typography, always in the ivory field ------
        const revealing =
          curP > TL.travel[0] - 0.02 && curP < TL.exit[1] && !footerActive;
        for (let i = 0; i < nodeEls.length; i++) {
          const n = NODES[i];
          const a = revealing ? falloff(t - n.t, TL.nodeWindow) : 0;
          const el = nodeEls[i];
          if (a <= 0.002) {
            if (el.style.visibility !== "hidden")
              el.style.visibility = "hidden";
            continue;
          }
          const base = project(nodeAnchor[i]);
          el.style.visibility = "visible";
          el.style.opacity = String(a);
          // children read --a and cascade at different rates (see .cnode-* CSS)
          el.style.setProperty("--a", a.toFixed(3));
          el.style.transform = `translate(${base.x}px, ${base.y}px) translate(-50%, -50%)`;
          el.style.filter = a > 0.98 ? "none" : `blur(${(1 - a) * 5}px)`;
        }
      };
      gsap.ticker.add(render);

      // ---- seal handoff: the ticker seal IS the cinema seal ------------------
      // Steer the ticker seal to the exact screen rect the world seal occupies
      // at pin start (same coordinate frame, same scale), then swap in a
      // single frame via the pin toggle below.
      const holder = document.querySelector<HTMLElement>(".ticker-seal-holder");
      if (holder) {
        ScrollTrigger.create({
          trigger: wrapRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const p = smooth(self.progress);
            // ONE logo on screen: the cinema world stays hidden while the
            // ticker seal is still travelling toward the opening frame; it
            // swaps in only at pin start (progress 1), same rect, same frame.
            // visibility (not opacity) so it cannot fight the finale tween.
            stageRef.current?.classList.toggle(
              "world-veiled",
              self.progress < 1
            );
            const vh = window.innerHeight;
            const vw = window.innerWidth;
            const curX = Number(gsap.getProperty(holder, "x")) || 0;
            const curY = Number(gsap.getProperty(holder, "y")) || 0;
            const r = holder.getBoundingClientRect();
            // natural centre with the current gsap translate removed, so we can
            // steer it to the world seal's exact screen centre. The ticker
            // holder lives in a scrollbar-narrowed row, so its resting centre is
            // NOT the viewport centre: steering X (not just Y) is what kills the
            // lateral "logo jumps sideways then the other takes over" at swap.
            const natCX = r.left + r.width / 2 - curX;
            const natCY = r.top + r.height / 2 - curY;
            // Target the world seal's LIVE centre (project its viewBox centre
            // through the camera's actual matrix), not the theoretical viewport
            // centre: the camera is never exactly at analytic rest on the swap
            // frame, so live projection is what makes the two seals coincide.
            const svgEl = svgRef.current;
            const ctm = svgEl && camG.getScreenCTM();
            let targetX = vw * TL.focus.x;
            let targetY = vh * TL.focus.y;
            if (svgEl && ctm) {
              const sp = svgEl.createSVGPoint();
              sp.x = MARK.center.x;
              sp.y = MARK.center.y;
              const proj = sp.matrixTransform(ctm);
              targetX = proj.x;
              targetY = proj.y;
            }
            const targetScale =
              (TL.restZoom * Math.min(vw, vh)) / holder.offsetWidth;
            gsap.set(holder, {
              xPercent: -50,
              yPercent: -50,
              x: (targetX - natCX) * p,
              y: (targetY - natCY) * p,
              scale: 1 + (targetScale - 1) * p,
            });
          },
        });
      }

      // ---- master pinned scene ---------------------------------------------
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: stageRef.current,
            anticipatePin: 1,
            onUpdate: (self) => {
              targetP = self.progress;
            },
            onToggle: (self) => {
              stageActive = self.isActive;
              gsap.set(worldSquare, { opacity: stageActive ? 0 : 1 });
              if (holder)
                holder.style.opacity = stageActive ? "0" : "1";
            },
          },
        })
        // journey-start line, in the open space beside the route
        .fromTo(
          entryRef.current,
          { opacity: 0, y: 44 },
          { opacity: 1, y: 0, duration: 0.04 },
          TL.entryLine[0]
        )
        .to(
          entryRef.current,
          { opacity: 0, y: -30, duration: 0.04 },
          TL.entryLine[1] - 0.04
        )
        // finale, sequenced (not simultaneous): the world dissolves while
        // still zoomed in, the conversion copy follows almost immediately
        // (no long black beat), and only the underline ride (TL.underline
        // 0.93+) waits for its own scroll distance afterwards.
        .to(
          [svgRef.current, ambientRef.current],
          { opacity: 0, duration: 0.05 },
          0.78
        )
        // conversion payoff: staged text reveal, line by line, blur to sharp,
        // arriving as soon as the world has gone dark
        .set(convRef.current, { opacity: 1 }, 0.835)
        .fromTo(
          convRef.current!.querySelectorAll(
            ".hero-lead, .cinema-title, .title-underline, .sub, .cta-row"
          ),
          { opacity: 0, y: 42, filter: "blur(9px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.045,
            stagger: 0.011,
          },
          0.84
        )
        // anchor timeline duration to exactly 1 (scrub maps 1:1 to progress)
        .add(() => {}, 1);

      // footer landing
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1.4,
        onEnter: () => {
          const r = traveler.getBoundingClientRect();
          footerStart = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
          footerActive = true;
        },
        onEnterBack: () => {
          const r = traveler.getBoundingClientRect();
          footerStart = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
          footerActive = true;
        },
        onLeaveBack: () => {
          footerActive = false;
        },
        onUpdate: (self) => {
          footerProg = self.progress;
          html.classList.toggle("at-footer", self.progress > 0.3);
        },
      });

      ScrollTrigger.refresh();
      return () => {
        gsap.ticker.remove(render);
      };
    }, rootRef);

    return () => {
      ctx.revert();
      html.classList.remove("at-footer");
    };
  }, []);

  return (
    <div ref={rootRef} id="cinema">
      <section className="stage-wrap" ref={wrapRef}>
        <div className="stage" ref={stageRef}>
          <div className="ambient" ref={ambientRef} aria-hidden="true" />

          {/* the whole world under one camera group */}
          <svg
            className="cinema-svg"
            ref={svgRef}
            viewBox="0 0 120 120"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <mask
                id="cinemaCut"
                maskUnits="userSpaceOnUse"
                x="-400"
                y="-400"
                width="920"
                height="920"
              >
                <rect x="-400" y="-400" width="920" height="920" fill="#fff" />
                <path
                  d={MARK.sPath}
                  fill="none"
                  stroke="#000"
                  strokeWidth={13}
                  strokeLinecap="round"
                />
              </mask>
            </defs>

            <g ref={camGRef}>
              {/* dark field (the carved channel and everything beyond ivory).
                  Semi-transparent on purpose: the stage's warm ambient glows
                  through it, so the ticker's atmosphere and the cinema's are
                  one continuous space at the seal swap, not a hard cut. */}
              <rect
                x="-400"
                y="-400"
                width="920"
                height="920"
                fill="rgba(10,10,12,0.55)"
              />
              {/* ivory logo mass with the S carved out */}
              <circle
                cx={MARK.circle.cx}
                cy={MARK.circle.cy}
                r={MARK.circle.r}
                fill="#ece7dd"
                mask="url(#cinemaCut)"
              />
              {/* topographic contour rings: faint hairlines that drift past
                  the traveller and give the ivory field depth at zoom */}
              {[10, 19, 28, 37].map((r) => (
                <circle
                  key={r}
                  cx={MARK.circle.cx}
                  cy={MARK.circle.cy}
                  r={r}
                  fill="none"
                  stroke="rgba(10,10,12,0.055)"
                  strokeWidth={0.35}
                />
              ))}
              {/* drifting motes in the dark field beyond the disc */}
              {MOTES.map((m, i) => (
                <circle
                  key={i}
                  className="mote"
                  cx={m.x}
                  cy={m.y}
                  r={m.r}
                  fill="#c3a268"
                  style={{ animationDelay: `${m.d}s` }}
                />
              ))}
              {/* roadside measurement ticks, populated at runtime */}
              <g ref={ticksRef} />
              {/* the route ahead: a dim champagne line through the channel */}
              <path
                d={MARK.sPath}
                fill="none"
                stroke="rgba(223,193,136,0.34)"
                strokeWidth={2.4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* the traveled route, illuminated brighter behind the square */}
              <path
                ref={roadLitRef}
                d={MARK.sPath}
                fill="none"
                stroke="#f0dcae"
                strokeWidth={4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* carved node markers on the route */}
              {NODES.map((n) => (
                <circle
                  key={n.id}
                  className="road-node"
                  r={1}
                  fill="#c3a268"
                  opacity={0.6}
                />
              ))}
              {/* the seal's own square: hidden only while the fixed traveller
                  renders at the exact same projected rect (pin toggle) */}
              <rect
                ref={worldSquareRef}
                x={MARK.square.x}
                y={MARK.square.y}
                width={MARK.square.size}
                height={MARK.square.size}
                fill="#c3a268"
              />
            </g>
          </svg>

          {/* journey-start line, set into the open space beside the route */}
          <div className="stage-layer stage-layer--entry" ref={entryRef}>
            <div className="entry-block">
              <h2 className="cinema-line">{CINEMA.entryLine}</h2>
            </div>
          </div>

          {/* conversion payoff on the clean stage after the world fades */}
          <div className="stage-layer stage-layer--conv" ref={convRef}>
            <div className="hero">
              <p className="hero-lead">{CINEMA.conversion.lead}</p>
              <h2 className="cinema-title">
                {CINEMA.conversion.titlePre}
                <span className="steer-word">
                  {CINEMA.conversion.titleWord.split("").map((ch, i) => (
                    <span className="steer-ch" key={i}>
                      {ch}
                    </span>
                  ))}
                </span>
                {CINEMA.conversion.titlePost}
              </h2>
              <div className="title-underline" ref={underlineRef}>
                <span className="title-underline-fill" ref={underFillRef} />
              </div>
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
          </div>

          {/* data-driven capability nodes: dark typography in the ivory field */}
          {NODES.map((n, i) => (
            <div key={n.id} className="cnode">
              <span className="cnode-index mono">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(NODES.length).padStart(2, "0")}
              </span>
              <span className="cnode-word">{n.capability}</span>
              <span className="cnode-line">{n.meaning}</span>
              <a className="cnode-cta" href={`/what-we-build#${n.family}`}>
                {n.cta}
                <ArrowUpRight />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* footer payoff: minimal, industry-standard */}
      <footer
        className="footer"
        id="contact"
        ref={footerRef}
        onMouseMove={(e) => {
          // the ray fan leans a breath toward the cursor (see .footer::before)
          const el = e.currentTarget;
          const r = el.getBoundingClientRect();
          el.style.setProperty("--fx", `${((e.clientX - r.left) / r.width) * 100}%`);
        }}
        onMouseLeave={(e) => e.currentTarget.style.setProperty("--fx", "50%")}
      >
        <span className="footer-veil" aria-hidden="true" />
        <p className="micro">{FOOTER.micro}</p>
        <div className="wordmark wordmark--fill" aria-label="STEERWAY.">
          {"STEERWAY".split("").map((ch, i) => (
            <span className="letter" key={i}>
              {ch}
            </span>
          ))}
          <span className="period-slot" ref={periodRef}>
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

      {/* the one traveller: same element from seal to route to underline to period */}
      <div className="traveler" ref={travelerRef} aria-hidden="true">
        <span className="traveler-core" />
      </div>
    </div>
  );
}
