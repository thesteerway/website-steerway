import { NEEDLE } from "@/lib/steerway";

/**
 * The branded scroll cue, used everywhere a "scroll" hint appears: a dotted
 * survey track with the secondary needle riding down it, leaving a fading
 * champagne trace before it resets. Replaces the old generic falling line.
 */
export default function ScrollCue() {
  return (
    <span className="scroll-cue" aria-hidden="true">
      <span className="scroll-cue-track" />
      <span className="scroll-cue-trace" />
      <svg className="scroll-cue-needle" viewBox="0 0 120 120">
        {/* tip points DOWN: the needle leads the eye along the route */}
        <g transform="rotate(180 60 60)">
          <polygon points={NEEDLE.ivory} fill="#ece7dd" />
          <polygon points={NEEDLE.champagne} fill="#c3a268" />
        </g>
      </svg>
    </span>
  );
}
