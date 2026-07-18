"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Brand cursor: the champagne square (the traveler motif) as the pointer,
 * orbited by a slowly rotating square frame that lags behind with inertia.
 * Interactive targets swell the frame and shrink the core; pressing snaps
 * everything tight. Difference blending keeps it readable over ivory and
 * obsidian alike. Pointer-fine devices only; native cursor is hidden via CSS.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let tx = -100;
    let ty = -100;
    let dx = -100;
    let dy = -100;
    let rx = -100;
    let ry = -100;
    let hot = false;
    let down = false;
    let shown = false;
    let ringScale = 1;
    let dotScale = 1;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        dx = rx = tx;
        dy = ry = ty;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      hot = !!el?.closest?.("a, button, .btn, [data-cursor]");
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);
    const onLeave = () => {
      shown = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      dx += (tx - dx) * 0.5;
      dy += (ty - dy) * 0.5;
      rx += (tx - rx) * 0.14;
      ry += (ty - ry) * 0.14;
      const targetRing = (hot ? 1.7 : 1) * (down ? 0.72 : 1);
      const targetDot = (hot ? 0.55 : 1) * (down ? 0.7 : 1);
      ringScale += (targetRing - ringScale) * 0.16;
      dotScale += (targetDot - dotScale) * 0.22;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%) scale(${dotScale})`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${ringScale})`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    gsap.ticker.add(tick);

    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div className="cursor-ring" ref={ringRef}>
        <span className="cursor-ring-box" />
      </div>
      <div className="cursor-dot" ref={dotRef} />
    </div>
  );
}
