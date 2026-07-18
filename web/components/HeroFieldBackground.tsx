"use client";

import { useEffect, useRef } from "react";

/**
 * Faithful port of the reference hero canvas ("STEER FIELD") from
 * docs/reference_hero_field__BACKGROUND_ONLY_DO_NOT_COPY_REST.html.
 * Only the background behaviour is carried over, nothing else.
 *
 * Grid of short directional line segments easing toward an attractor.
 * Attractor follows the cursor on desktop; drifts in an ambient orbit when
 * idle or on touch. Proximity lengthens/brightens strokes and shifts them to
 * champagne; tiny node dots appear near high attraction. Pauses off-screen;
 * static field under reduced motion.
 */
export default function HeroFieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const host = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0,
      H = 0,
      cell = 0;
    let cellsX: number[] = [],
      cellsY: number[] = [],
      angles: number[] = [];
    const attractor = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let lastMove = 0,
      t = 0,
      running = true,
      raf = 0;

    function build() {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = W < 640 ? 54 : W < 1100 ? 48 : 44;
      const cols = Math.ceil(W / cell) + 1;
      const rows = Math.ceil(H / cell) + 1;
      cellsX = [];
      cellsY = [];
      angles = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          cellsX.push(x * cell + cell / 2);
          cellsY.push(y * cell + cell / 2);
          angles.push(Math.random() * Math.PI * 2);
        }
      }
      attractor.x = target.x = W * 0.7;
      attractor.y = target.y = H * 0.4;
    }

    function draw() {
      t += 0.006;
      const idle = performance.now() - lastMove > 2200;
      if (idle) {
        target.x = W * 0.5 + Math.cos(t * 0.8) * W * 0.32;
        target.y = H * 0.45 + Math.sin(t * 0.6) * H * 0.3;
      }
      attractor.x += (target.x - attractor.x) * 0.05;
      attractor.y += (target.y - attractor.y) * 0.05;

      ctx.clearRect(0, 0, W, H);
      const wind = Math.sin(t * 0.5) * 0.25;
      const reach = Math.max(W, H) * 0.55;
      for (let i = 0; i < cellsX.length; i++) {
        const cx = cellsX[i],
          cy = cellsY[i];
        const dx = attractor.x - cx,
          dy = attractor.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const aim = Math.atan2(dy, dx) + wind;
        let a = angles[i];
        const diff = Math.atan2(Math.sin(aim - a), Math.cos(aim - a));
        a += diff * 0.1;
        angles[i] = a;
        const prox = Math.max(0, 1 - dist / reach);
        const ln = cell * 0.3 + prox * cell * 0.26;
        const alpha = 0.05 + prox * 0.32;
        const warm = prox > 0.55;
        ctx.strokeStyle = warm
          ? `rgba(195,162,104,${alpha.toFixed(3)})`
          : `rgba(236,231,221,${(alpha * 0.7).toFixed(3)})`;
        ctx.lineWidth = warm ? 1.1 : 0.9;
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(a) * ln, cy - Math.sin(a) * ln);
        ctx.lineTo(cx + Math.cos(a) * ln, cy + Math.sin(a) * ln);
        ctx.stroke();
        if (prox > 0.4) {
          ctx.fillStyle = `rgba(195,162,104,${(prox * 0.5).toFixed(3)})`;
          ctx.fillRect(cx - 0.8, cy - 0.8, 1.6, 1.6);
        }
      }
      if (running) raf = requestAnimationFrame(draw);
    }

    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < cellsX.length; i++) {
        const cx = cellsX[i],
          cy = cellsY[i];
        const a = Math.atan2(H * 0.4 - cy, W * 0.7 - cx);
        const ln = cell * 0.32;
        ctx.strokeStyle = "rgba(236,231,221,0.10)";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(a) * ln, cy - Math.sin(a) * ln);
        ctx.lineTo(cx + Math.cos(a) * ln, cy + Math.sin(a) * ln);
        ctx.stroke();
      }
    }

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY < r.bottom && r.top < window.innerHeight) {
        target.x = e.clientX - r.left;
        target.y = e.clientY - r.top;
        lastMove = performance.now();
      }
    };
    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const r = canvas.getBoundingClientRect();
      target.x = e.touches[0].clientX - r.left;
      target.y = e.touches[0].clientY - r.top;
      lastMove = performance.now();
    };

    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        build();
        if (reduce) drawStatic();
      }, 150);
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("resize", onResize);

    // Rebuild whenever the host is (re)laid out; guards against a zero-size
    // rect on first mount before layout settles.
    const ro = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      if (Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) {
        build();
        if (reduce) drawStatic();
      }
    });
    ro.observe(host);

    build();
    let io: IntersectionObserver | undefined;
    if (reduce) {
      drawStatic();
    } else {
      io = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              if (!running) {
                running = true;
                raf = requestAnimationFrame(draw);
              }
            } else {
              running = false;
            }
          });
        },
        { threshold: 0 }
      );
      io.observe(host);
      raf = requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro.disconnect();
      clearTimeout(rt);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas className="hero-field" ref={canvasRef} aria-hidden="true" />;
}
