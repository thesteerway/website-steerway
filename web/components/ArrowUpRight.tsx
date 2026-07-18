/**
 * Diagonal (top-right) arrow used inside CTAs. Two copies inside a clipped
 * box: on hover the first exits top-right while the second slides in from
 * the bottom-left, so the arrow reads as flying diagonally.
 */
export default function ArrowUpRight() {
  return (
    <span className="btn-arrow" aria-hidden="true">
      <svg viewBox="0 0 12 12" fill="none">
        <path d="M2.4 9.6 L9.6 2.4 M4 2.4 h5.6 v5.6" strokeWidth="1.3" />
      </svg>
      <svg viewBox="0 0 12 12" fill="none">
        <path d="M2.4 9.6 L9.6 2.4 M4 2.4 h5.6 v5.6" strokeWidth="1.3" />
      </svg>
    </span>
  );
}
