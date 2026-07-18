import Link from "next/link";
import Header from "@/components/Header";
import PageEnter from "@/components/PageEnter";
import ArrowUpRight from "@/components/ArrowUpRight";
import { NEEDLE } from "@/lib/steerway";

/** Compass 404: the needle has lost its heading. */
export default function NotFound() {
  return (
    <>
      <PageEnter />
      <Header />
      <main className="ipage page-lost">
        <div className="lost-stage">
          <svg className="lost-needle" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="52" className="lost-dial" />
            <g className="lost-spin">
              <polygon points={NEEDLE.ivory} fill="#ece7dd" />
              <polygon points={NEEDLE.champagne} fill="#c3a268" />
            </g>
          </svg>
          <p className="lost-readout mono">NO HEADING / 404</p>
          <h1 className="lost-title">This route does not exist.</h1>
          <p className="lost-sub">
            The needle found nothing here. Let it take you somewhere real.
          </p>
          <Link className="btn btn--primary" href="/">
            Steer back home
            <ArrowUpRight />
          </Link>
        </div>
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
