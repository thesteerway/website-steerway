"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { STUDIO } from "@/lib/internal";

/**
 * The Orbit: the six fields of work as satellites circling one viewing frame.
 * The chips drift on a slow elliptical orbit; hovering (or tapping) a field
 * eases the orbit to a stop and plays that field's motion clip large in the
 * centre.
 *
 * No stock-frame flash: all six clips are mounted once, preloaded when the
 * section approaches, and merely toggled visible. On every activation the
 * clip is rewound to 0 before playing, so playback always starts at the
 * moment of hover. The clips are the only media: no vignette stand-ins.
 */
export default function OrbitReel() {
  const rootRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const coarseRef = useRef(false);
  const [active, setActive] = useState<number | null>(null);

  // on touch devices the chips are a tap grid: click toggles, and the
  // synthetic mouseenter/leave a tap fires must not fight the toggle
  useEffect(() => {
    coarseRef.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  // orbit motion (desktop only: the mobile layout is a static tap grid)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 900px), (pointer: coarse)").matches) return;
    const field = fieldRef.current!;
    let angle = 0;
    let speed = 0.0022;
    let targetSpeed = 0.0022;
    let hovered = false;

    const onHover = (h: boolean) => {
      hovered = h;
      targetSpeed = h ? 0 : 0.0022;
    };
    field.dataset.orbit = "on";
    (field as HTMLElement & { __onHover?: (h: boolean) => void }).__onHover =
      onHover;

    const tick = () => {
      speed += (targetSpeed - speed) * 0.06;
      angle += speed;
      const r = field.getBoundingClientRect();
      const cx = r.width / 2;
      const cy = r.height / 2;
      // wide orbit: the chips circle CLEAR of the viewing frame, so no
      // category is ever hidden behind the screen
      const rx = r.width * 0.5;
      const ry = r.height * 0.47;
      chipRefs.current.forEach((chip, i) => {
        if (!chip) return;
        const a = angle + (i / STUDIO.proof.length) * Math.PI * 2;
        const x = cx + Math.cos(a) * rx;
        const y = cy + Math.sin(a) * ry;
        // depth: chips on the lower half float over the frame, upper half behind
        const depth = (Math.sin(a) + 1) / 2; // 0 top .. 1 bottom
        chip.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${
          0.86 + depth * 0.2
        })`;
        // chips always render ABOVE the frame; the wide orbit keeps them off
        // the screen itself, depth only breathes their scale and presence
        chip.style.zIndex = String(depth > 0.5 ? 6 : 5);
        chip.style.opacity = String(0.62 + depth * 0.38);
      });
      void hovered;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  // preload the clips once the section approaches
  useEffect(() => {
    const root = rootRef.current!;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            videoRefs.current.forEach((v) => {
              if (v && v.preload !== "auto") {
                v.preload = "auto";
                v.load();
              }
            });
            io.disconnect();
          }
        });
      },
      { rootMargin: "60% 0px" }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const activate = (i: number | null) => {
    setActive(i);
    const field = fieldRef.current as
      | (HTMLDivElement & { __onHover?: (h: boolean) => void })
      | null;
    field?.__onHover?.(i !== null);
    if (i !== null) {
      const v = videoRefs.current[i];
      if (v) {
        // always from the start of the clip, at the moment of hover
        try {
          v.currentTime = 0;
        } catch {}
        void v.play().catch(() => {});
      }
    }
    videoRefs.current.forEach((v, k) => {
      if (v && k !== i) v.pause();
    });
  };

  const current = active !== null ? STUDIO.proof[active] : null;

  return (
    <section
      className="orbit"
      ref={rootRef}
      aria-label="Fields of work"
      data-spine="the orbit"
    >
      <p className="proof-label mono">{STUDIO.orbitLabel}</p>

      <div className="orbit-field" ref={fieldRef}>
        {/* the viewing frame at the orbit's centre */}
        <div className={`orbit-frame glass${current ? " is-live" : ""}`}>
          <div className="orbit-media">
            {!current && (
              <p className="orbit-idle mono">
                <span className="orbit-idle-ring" aria-hidden="true" />
                hover a field
              </p>
            )}
            {STUDIO.proof.map((p, i) => (
              <video
                key={p.family}
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className={`orbit-video${active === i ? " is-on" : ""}`}
                src={p.video}
                muted
                loop
                playsInline
                preload="none"
              />
            ))}
            {/* meta lives INSIDE the screen so orbiting chips never cross it */}
            {current && (
              <p className="orbit-frame-meta mono">{current.meta}</p>
            )}
          </div>
        </div>

        {/* the satellites */}
        {STUDIO.proof.map((p, i) => (
          <button
            key={p.family}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            className={`orbit-chip${active === i ? " is-hot" : ""}`}
            onMouseEnter={() => !coarseRef.current && activate(i)}
            onMouseLeave={() => !coarseRef.current && activate(null)}
            onFocus={() => !coarseRef.current && activate(i)}
            onBlur={() => !coarseRef.current && activate(null)}
            onClick={() => activate(active === i ? null : i)}
          >
            <span className="orbit-chip-num mono">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="orbit-chip-title">{p.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
