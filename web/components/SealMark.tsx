import { MARK } from "@/lib/steerway";

/**
 * THE seal. The single source for the primary mark drawn from MARK geometry:
 * an obsidian disc (exactly r, no oversize backing ring), the ivory disc with
 * the S carved out of it, and the champagne square. Anything on the site that
 * needs the seal renders THIS component; nothing hand-draws its own copy.
 *
 * `maskId` must be unique per instance on the page (SVG mask ids are global).
 */
export default function SealMark({
  className,
  maskId,
  squareClassName,
}: {
  className?: string;
  maskId: string;
  squareClassName?: string;
}) {
  return (
    <svg className={className} viewBox={MARK.viewBox} aria-hidden="true">
      <mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="120"
        height="120"
      >
        <rect width="120" height="120" fill="#fff" />
        <path
          d={MARK.sPath}
          fill="none"
          stroke="#000"
          strokeWidth={13}
          strokeLinecap="round"
        />
      </mask>
      {/* the carve is open: whatever sits behind the seal shows through the S */}
      <circle
        cx={MARK.circle.cx}
        cy={MARK.circle.cy}
        r={MARK.circle.r}
        fill="#ece7dd"
        mask={`url(#${maskId})`}
      />
      <rect
        className={squareClassName}
        x={MARK.square.x}
        y={MARK.square.y}
        width={MARK.square.size}
        height={MARK.square.size}
        fill="#c3a268"
      />
    </svg>
  );
}
