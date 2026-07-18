"use client";

import { useEffect, useRef } from "react";

/**
 * The Harbour, night. A scenic, quiet composition: a starfield over a calm
 * sea, a dark headland at the right with a slim lighthouse silhouette, and a
 * soft champagne light that breathes rather than blasts. The beam still
 * follows the cursor, but as a slow, wide wash of light (a lantern turning,
 * not a searchlight), with a faint glimmer path on the water beneath it.
 * Behind all content; pauses when hidden; a single lit frame under reduced
 * motion.
 */
export default function Lighthouse() {
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
    let mx = -9999;
    let my = -9999;
    let beamA = Math.PI; // pointing left toward the form
    let idleT = 0;

    // scene anchors, set on resize
    let LX = 0; // lantern x
    let LY = 0; // lantern y
    let HORIZON = 0;
    let S = 1;

    type Star = { x: number; y: number; r: number; tw: number; a: number };
    let stars: Star[] = [];

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      S = Math.min(W, H) / 900;
      HORIZON = H * 0.72;
      LX = W * 0.85;
      LY = HORIZON - 190 * S; // lantern height above the water
      stars = Array.from({ length: 130 }, () => ({
        x: Math.random() * W,
        y: Math.random() * HORIZON * 0.94,
        r: 0.5 + Math.random() * 1.2,
        tw: Math.random() * Math.PI * 2,
        a: 0.16 + Math.random() * 0.42,
      }));
      if (reduce) draw();
    };

    /** slim silhouette tower on its headland; all fills, no busy banding */
    const drawTower = () => {
      ctx.save();
      ctx.translate(LX, HORIZON);

      // headland: one dark landmass the tower grows out of
      ctx.fillStyle = "rgba(7,7,9,0.92)";
      ctx.beginPath();
      ctx.moveTo(-220 * S, 0);
      ctx.quadraticCurveTo(-140 * S, -34 * S, -60 * S, -26 * S);
      ctx.quadraticCurveTo(20 * S, -20 * S, 90 * S, -40 * S);
      ctx.quadraticCurveTo(170 * S, -58 * S, 260 * S, -30 * S);
      ctx.lineTo(260 * S, 40 * S);
      ctx.lineTo(-220 * S, 40 * S);
      ctx.closePath();
      ctx.fill();
      // a whisper of moon-edge on the headland ridge
      ctx.strokeStyle = "rgba(236,231,221,0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-220 * S, 0);
      ctx.quadraticCurveTo(-140 * S, -34 * S, -60 * S, -26 * S);
      ctx.quadraticCurveTo(20 * S, -20 * S, 90 * S, -40 * S);
      ctx.stroke();

      // tower: one tapered silhouette, edge-lit on the moon side
      const baseY = -36 * S;
      const hgt = 150 * S;
      const baseW = 30 * S;
      const topW = 16 * S;
      ctx.beginPath();
      ctx.moveTo(-baseW / 2, baseY);
      ctx.lineTo(baseW / 2, baseY);
      ctx.lineTo(topW / 2, baseY - hgt);
      ctx.lineTo(-topW / 2, baseY - hgt);
      ctx.closePath();
      ctx.fillStyle = "rgba(9,9,11,0.96)";
      ctx.fill();
      ctx.strokeStyle = "rgba(236,231,221,0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // gallery rail + lantern room, small and precise
      const gy = baseY - hgt;
      ctx.strokeStyle = "rgba(236,231,221,0.28)";
      ctx.beginPath();
      ctx.moveTo(-14 * S, gy);
      ctx.lineTo(14 * S, gy);
      ctx.stroke();
      ctx.fillStyle = "rgba(9,9,11,0.96)";
      ctx.strokeStyle = "rgba(236,231,221,0.2)";
      ctx.beginPath();
      ctx.rect(-9 * S, gy - 18 * S, 18 * S, 18 * S);
      ctx.fill();
      ctx.stroke();
      // roof cap
      ctx.beginPath();
      ctx.moveTo(-11 * S, gy - 18 * S);
      ctx.lineTo(0, gy - 30 * S);
      ctx.lineTo(11 * S, gy - 18 * S);
      ctx.closePath();
      ctx.fillStyle = "rgba(195,162,104,0.4)";
      ctx.fill();

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // sky: deep night settling into a faintly warm horizon
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "rgba(10,10,12,0)");
      sky.addColorStop(0.5, "rgba(13,13,16,0.2)");
      sky.addColorStop(0.68, "rgba(34,28,20,0.22)");
      sky.addColorStop(0.72, "rgba(18,16,13,0.32)");
      sky.addColorStop(1, "rgba(8,8,10,0.6)");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // stars, twinkling gently, thinning near the horizon glow
      const time = t * 0.001;
      for (const s of stars) {
        const tw = 0.55 + Math.sin(time * 0.8 + s.tw) * 0.45;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236,231,221,${s.a * tw})`;
        ctx.fill();
      }

      // the moon, high over the open water, with a soft halo
      const moonX = W * 0.16;
      const moonY = H * 0.16;
      const moonR = 26 * S;
      const mh = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 5);
      mh.addColorStop(0, "rgba(236,231,221,0.14)");
      mh.addColorStop(1, "rgba(236,231,221,0)");
      ctx.fillStyle = mh;
      ctx.fillRect(moonX - moonR * 5, moonY - moonR * 5, moonR * 10, moonR * 10);
      // a clean crescent: the disc, with the shadow disc truly cut out of it
      // (composited offscreen-in-place, so no grey blob ever shows)
      ctx.save();
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = "rgba(236,231,221,0.85)";
      ctx.fillRect(moonX - moonR, moonY - moonR, moonR * 2, moonR * 2);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(moonX - moonR * 0.42, moonY - moonR * 0.18, moonR * 0.92, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // horizon hairline
      ctx.strokeStyle = "rgba(195,162,104,0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, HORIZON);
      ctx.lineTo(W, HORIZON);
      ctx.stroke();

      // moonpath: broken silver on the water beneath the moon
      for (let i = 0; i < 7; i++) {
        const py = HORIZON + (i + 0.6) * (H - HORIZON) * 0.1;
        const wob = Math.sin(t * 0.0011 + i * 1.9) * 14;
        const len = (34 + i * 12) * S;
        ctx.strokeStyle = `rgba(236,231,221,${0.1 - i * 0.011})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(moonX - len / 2 + wob, py);
        ctx.lineTo(moonX + len / 2 + wob, py);
        ctx.stroke();
      }

      // the sea: near-black, with slow horizontal shimmer lines
      for (let i = 0; i < 9; i++) {
        const sy = HORIZON + (i + 1) * (H - HORIZON) * 0.09;
        const drift = Math.sin(time * 0.35 + i * 1.7) * 40;
        const len = (0.16 + (i % 3) * 0.1) * W;
        const sx = ((i * 197 + drift * 8) % (W + len)) - len / 2;
        const shim = ctx.createLinearGradient(sx, 0, sx + len, 0);
        shim.addColorStop(0, "rgba(236,231,221,0)");
        shim.addColorStop(0.5, `rgba(236,231,221,${0.035 + (i % 2) * 0.02})`);
        shim.addColorStop(1, "rgba(236,231,221,0)");
        ctx.strokeStyle = shim;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + len, sy);
        ctx.stroke();
      }

      // beam target: the cursor if present, else a slow idle sweep left
      let target: number;
      if (mx > -999) {
        target = Math.atan2(my - LY, mx - LX);
      } else {
        idleT += 0.002;
        target = Math.PI + Math.sin(idleT) * 0.4;
      }
      let diff = target - beamA;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      beamA += diff * (reduce ? 1 : 0.02); // slow: the lantern turns, it does not snap

      // the light: a WIDE, feather-soft wash, low alpha, breathing slightly
      const breathe = 0.85 + Math.sin(time * 0.6) * 0.15;
      const reach = Math.max(W, H) * 1.1;
      const spread = 0.16;
      ctx.save();
      ctx.translate(LX, LY);
      ctx.rotate(beamA);
      const beam = ctx.createLinearGradient(0, 0, reach, 0);
      beam.addColorStop(0, `rgba(240,220,170,${0.11 * breathe})`);
      beam.addColorStop(0.4, `rgba(240,220,170,${0.045 * breathe})`);
      beam.addColorStop(1, "rgba(240,220,170,0)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(reach, -reach * Math.tan(spread));
      ctx.lineTo(reach, reach * Math.tan(spread));
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // lantern: a small warm heart with a soft halo, no hard flare
      const glow = 0.8 + Math.sin(t * 0.003) * 0.2;
      const halo = ctx.createRadialGradient(LX, LY, 0, LX, LY, 60 * S);
      halo.addColorStop(0, `rgba(240,220,170,${0.3 * glow})`);
      halo.addColorStop(1, "rgba(240,220,170,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(LX - 60 * S, LY - 60 * S, 120 * S, 120 * S);
      ctx.beginPath();
      ctx.arc(LX, LY, 3.6 * S, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,224,180,${0.85 * glow})`;
      ctx.fill();

      // glimmer path: the light lying on the water beneath the lantern,
      // leaning gently toward wherever the beam points
      const lean = Math.cos(beamA) * 120 * S;
      const glim = ctx.createLinearGradient(0, HORIZON, 0, H);
      glim.addColorStop(0, `rgba(240,220,170,${0.1 * breathe})`);
      glim.addColorStop(1, "rgba(240,220,170,0)");
      ctx.fillStyle = glim;
      ctx.beginPath();
      ctx.moveTo(LX - 8 * S, HORIZON);
      ctx.lineTo(LX + 8 * S, HORIZON);
      ctx.lineTo(LX + lean + 46 * S, H);
      ctx.lineTo(LX + lean - 46 * S, H);
      ctx.closePath();
      ctx.fill();

      drawTower();

      // low fog banks drifting over the water, barely there
      for (let i = 0; i < 3; i++) {
        const fy = H * (0.76 + i * 0.07);
        const fx = ((t * (0.006 + i * 0.003)) % (W + 600)) - 300;
        const fog = ctx.createRadialGradient(fx, fy, 0, fx, fy, 340);
        fog.addColorStop(0, "rgba(131,127,119,0.04)");
        fog.addColorStop(1, "rgba(131,127,119,0)");
        ctx.fillStyle = fog;
        ctx.fillRect(0, 0, W, H);
      }
    };

    const loop = () => {
      if (!running) return;
      t += 16;
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
    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    if (reduce) draw();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="lighthouse" aria-hidden="true" />;
}
