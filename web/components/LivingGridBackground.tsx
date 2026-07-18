"use client";

import { useEffect, useRef } from "react";

/**
 * The Living Grid: a dark perspective wireframe field receding to a horizon,
 * with signal pulses that travel the grid lines like data moving through a
 * connected system. The grid bends gently toward the cursor (a soft gravity
 * well), and a warm champagne bloom shifts with scroll. Whisper-low so it reads
 * as instrumentation, never a synthwave floor. Pauses when hidden; one static
 * frame under reduced motion. Exposes window.__livingGridPulse(side) so the
 * capability rows can fire a pulse toward the meridian on hover.
 */
export default function LivingGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;
    let raf = 0;
    let t = 0;
    let running = true;
    let scrollY = window.scrollY;
    let mx = -9999;
    let my = -9999;

    const COLS = 13; // columns each side of centre
    const ROWS = 24; // depth rows
    const DZ = 0.42; // depth compression
    let vpx = 0;
    let vpy = 0;
    let floorH = 0;
    let cell = 0;

    // pulses ride a single row from one column edge toward the centre column
    type Pulse = { row: number; from: number; to: number; p: number; speed: number };
    let pulses: Pulse[] = [];

    const project = (i: number, d: number) => {
      const k = 1 / (d * DZ + 1);
      return { x: vpx + i * cell * k, y: vpy + floorH * k, k };
    };

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      vpx = W * 0.5;
      vpy = H * 0.4;
      floorH = H * 0.66;
      cell = W / (COLS * 1.7);
      if (reduce) draw();
    };

    const spawn = (rowBias?: number, side?: number) => {
      const row = rowBias ?? 2 + Math.floor(Math.random() * (ROWS - 6));
      const s = side ?? (Math.random() < 0.5 ? -1 : 1);
      pulses.push({
        row,
        from: s * COLS,
        to: 0,
        p: 0,
        speed: 0.006 + Math.random() * 0.01,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const phase = (t * 0.00007) % 1; // grid drifts toward the viewer
      const warm = 0.5 + 0.5 * Math.sin(scrollY * 0.0008); // scroll hue shift

      // gravity-well displacement helper
      const bend = (x: number, y: number) => {
        const dx = x - mx;
        const dy = y - my;
        const d2 = dx * dx + dy * dy;
        const R = 220;
        if (d2 > R * R || mx < -9000) return { x, y };
        const f = (1 - Math.sqrt(d2) / R) * 26;
        const a = Math.atan2(dy, dx);
        return { x: x + Math.cos(a) * f, y: y + Math.sin(a) * f };
      };

      // grid lines
      for (let j = 0; j < ROWS; j++) {
        const d = j + phase;
        const alpha = Math.max(0, 0.26 * (1 - j / ROWS) + 0.03);
        ctx.strokeStyle = `rgba(199,166,110,${alpha})`;
        ctx.lineWidth = 1;
        // horizontal row
        ctx.beginPath();
        for (let i = -COLS; i <= COLS; i++) {
          const p = project(i, d);
          const b = bend(p.x, p.y);
          if (i === -COLS) ctx.moveTo(b.x, b.y);
          else ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();
      }
      // vertical columns (drawn sparsely for depth without clutter)
      for (let i = -COLS; i <= COLS; i += 1) {
        const alpha = 0.12 * (1 - Math.abs(i) / (COLS + 4));
        ctx.strokeStyle = `rgba(236,231,221,${alpha})`;
        ctx.beginPath();
        for (let j = 0; j < ROWS; j++) {
          const p = project(i, j + phase);
          const b = bend(p.x, p.y);
          if (j === 0) ctx.moveTo(b.x, b.y);
          else ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();
      }

      // signal pulses travelling their row toward the centre
      for (const pu of pulses) {
        pu.p += pu.speed * (reduce ? 0 : 1);
        const i = pu.from + (pu.to - pu.from) * pu.p;
        const p = project(i, pu.row + phase);
        const b = bend(p.x, p.y);
        const glow = p.k * 3.4;
        ctx.beginPath();
        ctx.arc(b.x, b.y, Math.max(1, glow), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,220,170,${0.9 * (1 - pu.p * 0.3)})`;
        ctx.shadowColor = "rgba(195,162,104,0.9)";
        ctx.shadowBlur = 14 * p.k;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      pulses = pulses.filter((pu) => pu.p < 1);

      // warm champagne bloom, shifting with scroll
      const bx = W * (0.7 + warm * 0.08);
      const g = ctx.createRadialGradient(bx, H * 0.12, 0, bx, H * 0.12, Math.max(W, H) * 0.55);
      g.addColorStop(0, `rgba(128,98,48,${0.18 + warm * 0.1})`);
      g.addColorStop(1, "rgba(128,98,48,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    const loop = () => {
      if (!running) return;
      t += 16;
      if (!reduce && Math.random() < 0.02) spawn();
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };
    const onScroll = () => {
      scrollY = window.scrollY;
      if (reduce) draw();
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    };

    // let the capability rows fire a pulse toward the meridian on hover
    (window as unknown as Record<string, unknown>).__livingGridPulse = (
      side: number
    ) => {
      if (reduce) return;
      spawn(4 + Math.floor(Math.random() * 6), side);
      spawn(8 + Math.floor(Math.random() * 6), side);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (reduce) draw();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      delete (window as unknown as Record<string, unknown>).__livingGridPulse;
    };
  }, []);

  return <canvas ref={canvasRef} className="livinggrid" aria-hidden="true" />;
}
