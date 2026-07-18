"use client";

import { useEffect } from "react";

/**
 * Magnetic CTAs (Lazarev / Agence DIX feel): primary buttons ease toward the
 * cursor when it comes near, and settle back when it leaves. Uses the CSS
 * `translate` property (independent of `transform`) so it never clobbers a
 * button's own hover transforms. Pointer-fine only; disabled under reduced
 * motion. Mounted once globally.
 */
export default function MagneticButtons() {
  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const RANGE = 95;
    const STRENGTH = 0.38;
    const SELECTOR = ".btn--primary, .header-cta";
    const states = new Map<HTMLElement, { x: number; y: number; tx: number; ty: number }>();
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const btns = document.querySelectorAll<HTMLElement>(SELECTOR);
      btns.forEach((b) => {
        const r = b.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        let s = states.get(b);
        if (!s) {
          s = { x: 0, y: 0, tx: 0, ty: 0 };
          states.set(b, s);
        }
        if (dist < RANGE) {
          s.tx = dx * STRENGTH;
          s.ty = dy * STRENGTH;
        } else {
          s.tx = 0;
          s.ty = 0;
        }
      });
    };

    const tick = () => {
      states.forEach((s, b) => {
        s.x += (s.tx - s.x) * 0.18;
        s.y += (s.ty - s.y) * 0.18;
        if (Math.abs(s.x) < 0.1 && Math.abs(s.y) < 0.1 && s.tx === 0 && s.ty === 0) {
          b.style.translate = "";
        } else {
          b.style.translate = `${s.x.toFixed(2)}px ${s.y.toFixed(2)}px`;
        }
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      states.forEach((_, b) => (b.style.translate = ""));
    };
  }, []);

  return null;
}
