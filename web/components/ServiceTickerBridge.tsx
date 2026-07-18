import SealMark from "@/components/SealMark";
import { TICKER_ITEMS, TICKER_CUE } from "@/lib/steerway";

/**
 * Bridge between hero and cinema, attached directly to the hero's end.
 * The primary seal sits ON the ticker line; the systems-index belt flows
 * across and behind it (behind the disc itself: the seal has no oversize
 * backing ring anymore, so nothing dark bleeds past its edge).
 */
export default function ServiceTickerBridge() {
  const belt = TICKER_ITEMS.join("  ·  ");
  return (
    <section className="ticker-section" aria-label="What we build">
      <div className="ticker-row">
        <div className="ticker-belt" aria-label="Services index">
          <div className="ticker-track">
            <span className="ticker-run">{belt}</span>
            <span className="ticker-run" aria-hidden="true">
              {belt}
            </span>
          </div>
        </div>

        {/* the one seal, riding on top of the belt; text passes behind it.
            The holder is steered by CinemaSequence into the exact rect the
            cinema world seal occupies at pin start: THIS seal becomes the
            cinema, no duplicate logo below. */}
        <div className="ticker-seal-holder">
          <SealMark
            className="ticker-seal"
            maskId="tickerCut"
            squareClassName="ticker-seal-square"
          />
        </div>
      </div>

      <p className="ticker-cue mono">{TICKER_CUE}</p>
    </section>
  );
}
