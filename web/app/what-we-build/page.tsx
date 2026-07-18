import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import PageEnter from "@/components/PageEnter";
import ScrollProgress from "@/components/ScrollProgress";
import Rich from "@/components/Rich";
import CompanionSpine from "@/components/CompanionSpine";
import LivingGridBackground from "@/components/LivingGridBackground";
import CapabilityAtlas from "@/components/CapabilityAtlas";
import RevealBlock from "@/components/RevealBlock";
import InternalFooter from "@/components/InternalFooter";
import ArrowUpRight from "@/components/ArrowUpRight";
import CtaWhisper from "@/components/CtaWhisper";
import { WHAT_WE_BUILD } from "@/lib/internal";

export const metadata: Metadata = {
  title: "What We Build | The Steerway",
  description:
    "The capability map: eight bearings, one operating layer. Websites, SaaS, AI automation, CRM, technical SEO, dashboards, cloud and growth infrastructure, each drawn as a route.",
};

/** The Capability Map: the operating layer as a navigator's chart under a
 *  depth-contour field. */
export default function WhatWeBuildPage() {
  return (
    <>
      <PageEnter />
      <ScrollProgress />
      <LivingGridBackground />
      <Header />
      <CompanionSpine />
      <main className="ipage page-map">
        <section className="ipage-hero" data-spine="the chart">
          <RevealBlock>
            <p className="ipage-eyebrow mono">{WHAT_WE_BUILD.eyebrow}</p>
            <h1 className="ipage-headline">{WHAT_WE_BUILD.headline}</h1>
            <p className="ipage-subcopy">
              <Rich>{WHAT_WE_BUILD.subcopy}</Rich>
            </p>
          </RevealBlock>
        </section>

        <CapabilityAtlas />

        <section className="ipage-cta" data-spine="the door">
          <RevealBlock>
            <p className="hero-lead">{WHAT_WE_BUILD.ctaLead}</p>
            <h2 className="ipage-cta-title">{WHAT_WE_BUILD.ctaTitle}</h2>
            <p className="ipage-cta-sub">{WHAT_WE_BUILD.ctaSub}</p>
            <div className="cta-row">
              <span className="cta-stack cta-stack--drop">
                <Link className="btn btn--primary" href="/contact">
                  Build with us
                  <ArrowUpRight />
                </Link>
                <CtaWhisper center />
              </span>
              <Link className="btn" href="/process">
                See our process
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
