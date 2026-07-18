"use client";

import { useEffect, useRef } from "react";

/**
 * A slim scroll-progress meter pinned to the right edge (Radian's progress bar,
 * translated). Fills in the page's signature colour as you move through the
 * page, with a small readout. Works with native scroll and Lenis (both update
 * window.scrollY and emit scroll). Hidden under reduced motion is unnecessary —
 * it is a static indicator, not motion — but it respects narrow screens via CSS.
 */
export default function ScrollProgress() {
  const fillRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
      if (numRef.current)
        numRef.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="scrollprog" aria-hidden="true">
      <span className="scrollprog-rail">
        <span className="scrollprog-fill" ref={fillRef} />
      </span>
      <span className="scrollprog-num mono" ref={numRef}>
        00
      </span>
    </div>
  );
}
