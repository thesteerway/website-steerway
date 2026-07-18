"use client";

import { useEffect, useRef } from "react";

/**
 * The Gradient Descent: the Process page as one continuous vertical journey
 * from cool obsidian at the top to a bronze-amber furnace glow at the bottom.
 * The whole viewport warms as you scroll (energy building through the stages),
 * and long-exposure champagne light streaks drift downward, accelerating the
 * deeper you go, like time-lapse motion with direction. Whisper-low, behind the
 * checkpoints. Pauses when hidden; one static frame under reduced motion.
 */
export default function GradientDescentBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = true;
    let progress = 0; // 0 (top) .. 1 (bottom of page)

    type Streak = { x: number; y: number; len: number; vx: number; vy: number; a: number; w: number };
    let streaks: Streak[] = [];

    const readProgress = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const spawn = () => {
      const fromLeft = Math.random() < 0.5;
      const speed = 1.4 + progress * 3.2 + Math.random() * 1.4; // deeper = faster
      streaks.push({
        x: Math.random() * W,
        y: -40 - Math.random() * H * 0.3,
        len: 60 + Math.random() * 160,
        vx: (fromLeft ? 1 : -1) * (0.25 + Math.random() * 0.5) * speed,
        vy: speed,
        a: 0.07 + Math.random() * 0.12,
        w: 0.8 + Math.random() * 1.6,
      });
    };

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw();
    };

    // colour stops interpolated by scroll progress: the viewport's own gradient
    // slides from cool obsidian toward a warm furnace as you descend
    const mix = (a: number[], b: number[], k: number) =>
      `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(
        a[1] + (b[1] - a[1]) * k
      )},${Math.round(a[2] + (b[2] - a[2]) * k)})`;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const p = progress;

      // vertical furnace gradient (top cooler, bottom warmer, warming with scroll)
      const topCool = [10, 10, 12];
      const topWarm = [26, 20, 14];
      const botCool = [20, 16, 12];
      const botWarm = [64, 40, 18];
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, mix(topCool, topWarm, p));
      g.addColorStop(1, mix(botCool, botWarm, Math.min(1, p * 1.2)));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // furnace bloom rising from the bottom as you go deeper
      const bloom = ctx.createRadialGradient(
        W * 0.5,
        H * 1.02,
        0,
        W * 0.5,
        H * 1.02,
        Math.max(W, H) * (0.5 + p * 0.35)
      );
      bloom.addColorStop(0, `rgba(150,96,36,${0.06 + p * 0.16})`);
      bloom.addColorStop(1, "rgba(150,96,36,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, W, H);

      // long-exposure light streaks
      for (const s of streaks) {
        if (!reduce) {
          s.x += s.vx;
          s.y += s.vy;
        }
        const tx = s.x - (s.vx / s.vy) * s.len;
        const ty = s.y - s.len;
        const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
        grad.addColorStop(0, `rgba(240,220,170,${s.a})`);
        grad.addColorStop(1, "rgba(240,220,170,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.w;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
      streaks = streaks.filter((s) => s.y < H + 80 && s.x > -80 && s.x < W + 80);
    };

    const loop = () => {
      if (!running) return;
      if (!reduce && Math.random() < 0.028 + progress * 0.045) spawn();
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      readProgress();
      if (reduce) draw();
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    readProgress();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (reduce) draw();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="gradientdescent" aria-hidden="true" />;
}
