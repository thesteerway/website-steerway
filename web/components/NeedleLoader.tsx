"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { LOADER, NEEDLE } from "@/lib/steerway";
import ScrollCue from "@/components/ScrollCue";
import { isAppAlive, markAppAlive } from "@/lib/introSeen";

/**
 * Opening instrument, shown ONCE per page load as a fixed overlay. Unmounts
 * when finished so it cannot be revisited by scrolling back up; returns on
 * refresh.
 *
 * Choreography:
 *  WAKE       (time-driven, ~2s) the engine wakes: the needle swings
 *             to-and-fro with a damped wobble and self-calibrates to
 *             90 degrees (perfectly upright). Readout climbs to 90.0 and
 *             locks; only then does "Scroll to begin" appear.
 *  TURN       (scroll intent) the needle rotates down to 0 degrees, tip
 *             pointing RIGHT along the horizon.
 *  TRAVEL     the needle leads the way rightward, drawing a champagne
 *             trace, until it leaves past the right border.
 *  DISSOLVE   the field fades; the hero is revealed underneath.
 */
const TRAVEL_DISTANCE = 1250; // px of scroll intent for the scroll phase
const CALIBRATE_MS = 2050; // duration of the self-calibration wake-up

export default function NeedleLoader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const needleWrapRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<SVGSVGElement>(null);
  const needleBaseRef = useRef<SVGLineElement>(null);
  const traceRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;

    // Client-side navigation back home (logo click from an internal page):
    // the app is already alive, so skip straight to the landing page. The
    // loader still plays on a hard load or refresh of the homepage.
    if (isAppAlive()) {
      html.classList.add("entered");
      setDone(true);
      return;
    }
    markAppAlive();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      html.classList.add("entered");
      setDone(true);
      return;
    }

    html.classList.add("intro-lock");
    let raw = 0;
    let shown = 0;
    let finished = false;
    let calibrated = false;
    let lastTouchY = 0;
    const born = performance.now();

    const root = rootRef.current!;
    const wrap = needleWrapRef.current!;
    const needle = needleRef.current!;
    const trace = traceRef.current!;
    const readout = readoutRef.current!;
    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const easeOut = (a: number, b: number, p: number, e = 2) =>
      a + (b - a) * (1 - Math.pow(1 - clamp01(p), e));

    const paint = (now: number) => {
      // WAKE: self-calibrate to upright (90 deg on the dial) with a
      // pronounced damped to-and-fro before it sticks
      const cal = clamp01((now - born) / CALIBRATE_MS);
      const settle = easeOut(-26, 0, cal, 2.1);
      const wobble = (1 - cal) * Math.sin(cal * Math.PI * 4.4) * 17;
      const rotCal = settle + wobble; // 0 = upright at rest
      if (cal >= 1 && !calibrated) {
        calibrated = true;
        root.classList.add("is-calibrated");
      }

      // TURN: upright (dial 90) -> horizon right (dial 0)
      const turn = easeOut(0, 90, clamp01(shown / 0.28), 1.9);
      const rot = rotCal + turn;
      // TRAVEL: centre -> beyond the right border
      const trav = clamp01((shown - 0.28) / 0.6);
      const dist = easeOut(0, window.innerWidth / 2 + 150, trav, 1.5);

      wrap.style.transform = `translateX(${dist}px)`;
      needle.style.transform = `rotate(${rot}deg)`;

      // the baseline is part of the mark at rest; it steps aside as the
      // needle turns to travel
      const base = needleBaseRef.current;
      if (base) base.style.opacity = String(1 - clamp01(shown / 0.2));

      // champagne trace drawn behind the needle along the horizon
      trace.style.width = `${Math.max(0, dist - 12)}px`;
      trace.style.opacity = trav > 0 ? "1" : "0";

      // readout: the dial reads 90 when the needle stands upright
      if (!calibrated) {
        const dial = 90 - Math.abs(rotCal);
        readout.textContent = `${dial.toFixed(1)}°`;
        readout.classList.remove("is-locked");
      } else if (shown < 0.02) {
        readout.textContent = "90.0° UPRIGHT / LOCKED";
        readout.classList.add("is-locked");
      } else if (shown < 0.28) {
        readout.textContent = `${Math.max(0, 90 - turn).toFixed(0)}° ALIGNING →`;
        readout.classList.add("is-locked");
      } else {
        readout.textContent = "0.0° STEERING →";
      }

      const p = promptRef.current;
      if (p)
        p.style.opacity = calibrated
          ? String(1 - clamp01(shown / 0.1))
          : "0";
      const l = labelRef.current;
      if (l) l.style.opacity = String(1 - clamp01((shown - 0.5) / 0.18));
      if (shown > 0.86) root.style.opacity = String(1 - (shown - 0.86) / 0.12);
    };

    const finish = () => {
      finished = true;
      gsap.ticker.remove(tick);
      html.classList.remove("intro-lock");
      html.classList.add("entered");
      window.dispatchEvent(new Event("steerway:introdone"));
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      setDone(true);
    };

    const tick = () => {
      shown += (clamp01(raw / TRAVEL_DISTANCE) - shown) * 0.14;
      paint(performance.now());
      if (shown > 0.985) finish();
    };

    const bump = (dy: number) => {
      if (!calibrated) return; // the engine wakes on its own first
      raw = Math.max(0, raw + dy);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      bump(e.deltaY);
    };
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      bump((lastTouchY - y) * 2);
      lastTouchY = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) bump(240);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    paint(born);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      if (!finished) {
        html.classList.remove("intro-lock");
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("keydown", onKey);
      }
    };
  }, []);

  if (done) return null;

  return (
    <div className="loader-overlay" ref={rootRef} aria-label="Intro">
      <p className="calib-label" ref={labelRef}>
        {LOADER.label}
        <span className="dot" />
      </p>

      <div className="loader-horizon" aria-hidden="true">
        <span className="horizon-line" />
        {Array.from({ length: 21 }).map((_, i) => (
          <span
            key={i}
            className="horizon-tick"
            style={{ left: `${(i / 20) * 100}%` }}
          />
        ))}
        <div className="loader-trace" ref={traceRef} />
        <div className="needle-wrap" ref={needleWrapRef}>
          {/* the sanitized secondary needle mark, verbatim geometry:
              ivory west face, champagne east face, ivory baseline.
              Tip at (60,20) points UP at rotate(0). */}
          <svg
            className="needle"
            viewBox="0 0 120 120"
            ref={needleRef}
            aria-hidden="true"
          >
            <polygon points={NEEDLE.ivory} fill="#ece7dd" />
            <polygon points={NEEDLE.champagne} fill="#c3a268" />
            <line
              ref={needleBaseRef}
              x1={NEEDLE.base.x1}
              y1={NEEDLE.base.y1}
              x2={NEEDLE.base.x2}
              y2={NEEDLE.base.y2}
              stroke="#ece7dd"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <span className="loader-readout mono" ref={readoutRef}>
        64.0&deg;
      </span>

      <p className="desktop-note mono" aria-hidden="true">
        Best experienced on a larger screen
      </p>

      <div className="scroll-prompt scroll-prompt--loader" ref={promptRef}>
        <span>{LOADER.prompt}</span>
        <ScrollCue />
      </div>
    </div>
  );
}
