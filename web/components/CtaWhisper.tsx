"use client";

import { useEffect, useState } from "react";
import { CTA_WHISPER_TIME, CTA_WHISPER_TAIL } from "@/lib/steerway";

/**
 * The whisper under a "Build with us" CTA: one fixed two-line message, the
 * same on every button across the site. The first line carries the visitor's
 * live local time; the second is the nudge. Absolutely positioned by CSS so
 * hovering never reflows the buttons around it.
 */
function timeLine(now: number) {
  const time = new Date(now).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  return CTA_WHISPER_TIME.replace("{time}", time);
}

export default function CtaWhisper({ center = false }: { center?: boolean }) {
  // SSR renders the template; the real clock fills in after mount.
  const [line, setLine] = useState<string>(CTA_WHISPER_TIME.replace("{time}", "Now"));

  useEffect(() => {
    const update = () => setLine(timeLine(Date.now()));
    update();
    // re-check twice a minute; setState with an unchanged string is free
    const id = window.setInterval(update, 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={`cta-whisper${center ? " cta-whisper--center" : ""}`}
      aria-hidden="true"
    >
      <span className="cta-whisper-line">{line}</span>
      <span className="cta-whisper-line cta-whisper-tail">
        {CTA_WHISPER_TAIL}
      </span>
    </span>
  );
}
