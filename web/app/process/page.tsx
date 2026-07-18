import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageEnter from "@/components/PageEnter";
import ScrollProgress from "@/components/ScrollProgress";
import Rich from "@/components/Rich";
import CompanionSpine from "@/components/CompanionSpine";
import DescentTimeline from "@/components/DescentTimeline";
import PrinciplePlates from "@/components/PrinciplePlates";
import GradientDescentBackground from "@/components/GradientDescentBackground";
import RevealBlock from "@/components/RevealBlock";
import InternalFooter from "@/components/InternalFooter";
import ArrowUpRight from "@/components/ArrowUpRight";
import CtaWhisper from "@/components/CtaWhisper";
import { PROCESS } from "@/lib/internal";

export const metadata: Metadata = {
  title: "Process | The Steerway",
  description:
    "Five checkpoints, one route: diagnose, map, build, launch, measure. How The Steerway takes a system from brief to something measurable.",
};

/** The Descent: a flight plan flown top to bottom. */
export default function ProcessPage() {
  return (
    <>
      <PageEnter />
      <ScrollProgress />
      <GradientDescentBackground />
      <Header />
      <CompanionSpine />
      <main className="ipage page-descent">
        <section className="ipage-hero" data-spine="the plan">
          <RevealBlock>
            <p className="ipage-eyebrow mono">{PROCESS.eyebrow}</p>
            <h1 className="ipage-headline">{PROCESS.headline}</h1>
            <p className="ipage-subcopy">
              <Rich>{PROCESS.subcopy}</Rich>
            </p>
          </RevealBlock>
        </section>

        <DescentTimeline />

        <PrinciplePlates />

        <section className="ipage-cta descent-landing" data-spine="touchdown">
          <span className="descent-arrow" aria-hidden="true" />
          <RevealBlock>
            <p className="hero-lead">{PROCESS.ctaLead}</p>
            <h2 className="ipage-cta-title">{PROCESS.ctaTitle}</h2>
            <p className="ipage-cta-sub">{PROCESS.ctaSub}</p>
            <div className="cta-row">
              <span className="cta-stack cta-stack--drop">
                <Link className="btn btn--primary" href="/contact">
                  Build with us
                  <ArrowUpRight />
                </Link>
                <CtaWhisper center />
              </span>
              <Link className="btn" href="/what-we-build">
                See what we build
              </Link>
            </div>
          </RevealBlock>
        </section>
      </main>
      <InternalFooter />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
