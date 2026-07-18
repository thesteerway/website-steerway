import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageEnter from "@/components/PageEnter";
import ScrollProgress from "@/components/ScrollProgress";
import Rich from "@/components/Rich";
import CompanionSpine from "@/components/CompanionSpine";
import OrbitReel from "@/components/OrbitReel";
import SignatureCards from "@/components/SignatureCards";
import StudioFieldBackground from "@/components/StudioFieldBackground";
import RevealBlock from "@/components/RevealBlock";
import InternalFooter from "@/components/InternalFooter";
import ArrowUpRight from "@/components/ArrowUpRight";
import CtaWhisper from "@/components/CtaWhisper";
import { STUDIO } from "@/lib/internal";

export const metadata: Metadata = {
  title: "Studio | The Steerway",
  description:
    "A systems studio, not an agency: the layer between marketing promises and engineering reality, where demand becomes something measurable.",
};

/** The Observatory: the fields of work in orbit, then the signature builds.
 *  The manifesto and working principles now live on /process, where the
 *  trust argument belongs. */
export default function StudioPage() {
  return (
    <>
      <PageEnter />
      <ScrollProgress />
      <StudioFieldBackground />
      <Header />
      <CompanionSpine />
      <main className="ipage page-manifesto">
        <section className="ipage-hero" data-spine="the room">
          <RevealBlock>
            <p className="ipage-eyebrow mono">{STUDIO.eyebrow}</p>
            <h1 className="ipage-headline">{STUDIO.headline}</h1>
            <p className="ipage-subcopy">
              <Rich>{STUDIO.subcopy}</Rich>
            </p>
          </RevealBlock>
        </section>

        <OrbitReel />

        <SignatureCards />

        <section className="ipage-cta studio-cta" data-spine="the invitation">
          <RevealBlock>
            <p className="hero-lead">{STUDIO.ctaLead}</p>
            <h2 className="ipage-cta-title">{STUDIO.ctaTitle}</h2>
            <p className="ipage-cta-sub">{STUDIO.ctaSub}</p>
            <div className="cta-row">
              <span className="cta-stack cta-stack--drop">
                <Link className="btn btn--primary" href="/contact">
                  Build with us
                  <ArrowUpRight />
                </Link>
                <CtaWhisper center />
              </span>
            </div>
          </RevealBlock>
        </section>
      </main>
      <InternalFooter />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
