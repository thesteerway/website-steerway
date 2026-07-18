"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient studio field: a slow-drifting spotlit room. Two soft light pools
 * cross-fade and drift (deeper and slower than the old CSS ::before spotlight),
 * fine dust motes catch the light as they rise, and a faint lens-like vignette
 * breathes at the edges. Gives the Studio hero real cinematic depth (echoing
 * Radian's full-bleed footage, translated into our vector/motion language)
 * instead of reading as a flat dark page with a static gradient. Whisper-low,
 * behind all content; pauses when hidden, one static frame under reduced motion.
 */
export default function StudioFieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;
    let t = 0;
    let raf = 0;
    let running = true;
    let mx = -9999;
    let my = -9999;

    type Mote = { x: number; y: number; r: number; speed: number; drift: number; a: number };
    let motes: Mote[] = [];

    const build = () => {
      const count = Math.max(24, Math.min(60, Math.round((W * H) / 26000)));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.6 + Math.random() * 1.4,
        speed: 0.1 + Math.random() * 0.22,
        drift: Math.random() * Math.PI * 2,
        a: 0.1 + Math.random() * 0.26,
      }));
    };

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduce) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const time = t * 0.00012;

      // two slow-drifting light pools, cross-fading
      const pools = [
        {
          // champagne field
          x: W * (0.42 + Math.sin(time * 0.6) * 0.1),
          y: H * (0.3 + Math.cos(time * 0.5) * 0.08),
          r: Math.max(W, H) * 0.44,
          a: 0.5 + Math.sin(time * 0.4) * 0.2,
          c: "84, 66, 38",
        },
        {
          // bronze field
          x: W * (0.72 + Math.cos(time * 0.4 + 2) * 0.11),
          y: H * (0.62 + Math.sin(time * 0.35 + 1) * 0.09),
          r: Math.max(W, H) * 0.34,
          a: 0.34 + Math.cos(time * 0.5 + 1) * 0.16,
          c: "78, 54, 26",
        },
        {
          // deep-green field, drifting counter to the warm ones (aurora blend)
          x: W * (0.2 + Math.sin(time * 0.33 + 4) * 0.12),
          y: H * (0.72 + Math.cos(time * 0.45 + 2) * 0.08),
          r: Math.max(W, H) * 0.36,
          a: 0.24 + Math.sin(time * 0.4 + 3) * 0.12,
          c: "30, 58, 46",
        },
      ];
      for (const p of pools) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(${p.c},${Math.max(0, p.a) * 1.05})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // dust motes, rising slowly and drifting sideways, catching the light
      for (const m of motes) {
        m.y -= m.speed * (reduce ? 0 : 1);
        m.x += Math.sin(time * 6 + m.drift) * 0.15;
        if (m.y < -10) {
          m.y = H + 10;
          m.x = Math.random() * W;
        }
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236,231,221,${m.a})`;
        ctx.fill();
      }

      // the observatory instrument: motes near the cursor link into a faint
      // constellation, as if the pointer were a lens finding structure in the
      // dust. Lines fade with distance; whisper-low, never a spectacle.
      if (!reduce && mx > -999) {
        const R = Math.min(W, H) * 0.22;
        const near = motes.filter(
          (m) => Math.hypot(m.x - mx, m.y - my) < R
        );
        for (const m of near) {
          const d = Math.hypot(m.x - mx, m.y - my);
          const k = 1 - d / R;
          ctx.strokeStyle = `rgba(195,162,104,${k * 0.16})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
          // the linked mote glints champagne
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r + 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(195,162,104,${k * 0.5})`;
          ctx.fill();
        }
        // links between neighbouring linked motes complete the constellation
        for (let i = 0; i < near.length; i++) {
          for (let j = i + 1; j < near.length; j++) {
            const d = Math.hypot(near[i].x - near[j].x, near[i].y - near[j].y);
            if (d < R * 0.55) {
              ctx.strokeStyle = `rgba(236,231,221,${(1 - d / (R * 0.55)) * 0.08})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(near[i].x, near[i].y);
              ctx.lineTo(near[j].x, near[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // vignette breathing at the edges
      const vg = ctx.createRadialGradient(
        W / 2,
        H / 2,
        Math.min(W, H) * 0.3,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.75
      );
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, `rgba(0,0,0,${0.28 + Math.sin(time * 0.3) * 0.04})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
    };

    const loop = () => {
      if (!running) return;
      t += 16;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (reduce) draw();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="studiofield" aria-hidden="true" />;
}
