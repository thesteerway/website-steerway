import type { Metadata } from "next";
import Header from "@/components/Header";
import PageEnter from "@/components/PageEnter";
import ScrollProgress from "@/components/ScrollProgress";
import Rich from "@/components/Rich";
import CompanionSpine from "@/components/CompanionSpine";
import RevealBlock from "@/components/RevealBlock";
import ConsoleForm from "@/components/ConsoleForm";
import Lighthouse from "@/components/Lighthouse";
import FaqConsole from "@/components/FaqConsole";
import InternalFooter from "@/components/InternalFooter";
import { CONTACT, LOCALE } from "@/lib/internal";

export const metadata: Metadata = {
  title: "Contact | The Steerway",
  description:
    "Tell us what to build, automate or measure. We reply with the right next step: a capability deck, an audit, a roadmap or a discovery call.",
};

/** The Harbour: a lighthouse lights the way to the console that files your
 *  brief, and the questions buyers actually ask wait below it. */
export default function ContactPage() {
  return (
    <>
      <PageEnter />
      <ScrollProgress />
      <Header />
      <CompanionSpine />
      <main className="ipage page-console">
        <Lighthouse />

        <section className="ipage-hero" data-spine="the harbour">
          <RevealBlock>
            <p className="ipage-eyebrow mono">{CONTACT.eyebrow}</p>
            <h1 className="ipage-headline">{CONTACT.headline}</h1>
            <p className="ipage-subcopy">
              <Rich>{CONTACT.subcopy}</Rich>
            </p>
          </RevealBlock>
        </section>

        <section className="ipage-section console-section" data-spine="the brief">
          <RevealBlock>
            <ConsoleForm />
          </RevealBlock>
        </section>

        <section className="ipage-section faqs-section" data-spine="the answers">
          <RevealBlock>
            <FaqConsole />
          </RevealBlock>
        </section>

        {/* the sign-off: the page's last word, and it IS the invitation.
            Three voices in one lockup: the instrument (mono), the gesture
            (italic display), the destination (outline). */}
        <section className="signoff-section" data-spine="the signature">
          <RevealBlock>
            <a className="signoff" href={`mailto:${LOCALE.email}`}>
              <span className="signoff-eyebrow mono">from here,</span>
              <span className="signoff-verb">
                {"move".split("").map((ch, i) => (
                  <span className="signoff-ch" key={i} style={{ ["--i" as string]: i }}>
                    {ch}
                  </span>
                ))}
              </span>
              <span className="signoff-rest">together.</span>
            </a>
          </RevealBlock>
        </section>
      </main>
      <InternalFooter />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
