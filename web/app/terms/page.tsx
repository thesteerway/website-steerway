import type { Metadata } from "next";
import Header from "@/components/Header";
import PageEnter from "@/components/PageEnter";
import InternalFooter from "@/components/InternalFooter";

export const metadata: Metadata = {
  title: "Terms of Service | The Steerway",
  description:
    "The terms and conditions governing use of the The Steerway website and the framework for engagements with The Steerway.",
};

const UPDATED = "13 July 2026";
const LEGAL_EMAIL = "legal@thesteerway.com";

export default function TermsPage() {
  return (
    <>
      <PageEnter />
      <Header />
      <main className="ipage legal">
        <header className="legal-head">
          <p className="ipage-eyebrow mono">Last updated: {UPDATED}</p>
          <h1 className="ipage-headline">Terms of Service</h1>
        </header>

        <section className="legal-body">
          <h2>1. Acceptance of these Terms</h2>
          <p>
            These Terms of Service (the &quot;Terms&quot;) govern access to
            and use of the website located at thesteerway.com (the
            &quot;Website&quot;), operated by The Steerway (&quot;The
            Steerway&quot;, &quot;we&quot;, &quot;us&quot; or
            &quot;our&quot;). By accessing or using the Website you agree to
            be bound by these Terms and by our Privacy Policy, which is
            incorporated by reference. If you do not agree, do not use the
            Website.
          </p>

          <h2>2. Relationship to engagement agreements</h2>
          <p>
            These Terms govern the Website only. Professional services are
            provided under separate written agreements (each an
            &quot;Engagement Agreement&quot;), such as a proposal, statement
            of work or master services agreement signed by both parties. In
            the event of any conflict between these Terms and an Engagement
            Agreement, the Engagement Agreement prevails in respect of the
            services it covers. Nothing on the Website constitutes an offer
            capable of acceptance; timelines, scope and fees are binding only
            when set out in an Engagement Agreement.
          </p>

          <h2>3. Use of the Website</h2>
          <p>
            You may access and use the Website for lawful purposes connected
            with evaluating or engaging our services. You must not: (a)
            interfere with or disrupt the operation, security or availability
            of the Website; (b) attempt to gain unauthorised access to any
            systems or data; (c) scrape, harvest or bulk-download content or
            data, whether by automated means or otherwise, except as permitted
            by search engine indexing conventions; (d) introduce malicious
            code; (e) misrepresent the origin of the Website&apos;s content or
            pass it off as your own; or (f) use the Website in breach of any
            applicable law.
          </p>

          <h2>4. Intellectual property</h2>
          <p>
            The Website and its content, including the The Steerway name and
            marks, logos, design, text, graphics, illustrations and code, are
            owned by or licensed to The Steerway and are protected by
            intellectual property laws. Except for viewing, linking and
            sharing in the ordinary course, no licence to use any content or
            marks is granted by these Terms. Third-party marks referenced on
            the Website belong to their respective owners.
          </p>

          <h2>5. Enquiries</h2>
          <p>
            Submitting an enquiry through the Website creates no obligation on
            either party. You are responsible for the accuracy of the
            information you provide and must not submit information that is
            confidential to a third party, unlawful, or that you lack
            authority to share.
          </p>

          <h2>6. Deliverables and ownership (framework)</h2>
          <p>
            Unless an Engagement Agreement provides otherwise: (a) upon full
            payment, the client owns the deliverables created specifically for
            the client, including code repositories, accounts and data
            produced for the engagement; (b) pre-existing materials, internal
            tooling and know-how of The Steerway remain the property of The
            Steerway, and are licensed to the client to the extent embedded in
            deliverables; (c) open source components remain governed by their
            respective licences; and (d) The Steerway may identify the client
            and describe completed work in its portfolio without disclosing
            confidential information, unless agreed otherwise in writing.
          </p>

          <h2>7. Confidentiality</h2>
          <p>
            Each party will keep the other&apos;s non-public information
            confidential, use it only for the purposes for which it was
            disclosed, and protect it with at least reasonable care. This
            obligation does not apply to information that is public through no
            fault of the recipient, independently developed, or required to be
            disclosed by law. Formal confidentiality terms for engagements are
            set out in the applicable Engagement Agreement or a separate
            non-disclosure agreement.
          </p>

          <h2>8. Disclaimers</h2>
          <p>
            The Website and its content are provided on an &quot;as is&quot;
            and &quot;as available&quot; basis without warranties of any kind,
            whether express, implied or statutory, including warranties of
            merchantability, fitness for a particular purpose,
            non-infringement, accuracy and uninterrupted availability. Content
            on the Website is general information, does not constitute
            professional advice for any specific situation, and should not be
            relied upon as such. Results described on the Website relate to
            specific engagements and do not guarantee comparable outcomes.
          </p>

          <h2>9. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by applicable law: (a) The
            Steerway will not be liable for any indirect, incidental, special,
            consequential or punitive damages, or for loss of profits,
            revenue, data, goodwill or business opportunity, arising out of or
            in connection with the use of, or inability to use, the Website;
            and (b) the aggregate liability of The Steerway arising out of or
            in connection with the Website will not exceed one thousand Indian
            Rupees (INR 1,000). Liability in connection with professional
            services is addressed exclusively in the applicable Engagement
            Agreement. Nothing in these Terms excludes liability that cannot
            be excluded under applicable law, including liability for fraud.
          </p>

          <h2>10. Indemnity</h2>
          <p>
            You agree to indemnify and hold harmless The Steerway from claims,
            losses and expenses (including reasonable legal fees) arising out
            of your breach of these Terms or your unlawful use of the Website.
          </p>

          <h2>11. Suspension and changes to the Website</h2>
          <p>
            We may modify, suspend or discontinue any part of the Website at
            any time without notice. We may also restrict access to the
            Website where we reasonably believe these Terms have been
            breached.
          </p>

          <h2>12. Force majeure</h2>
          <p>
            We are not liable for any failure or delay caused by events beyond
            our reasonable control, including outages of infrastructure
            providers, acts of government, labour disputes, epidemics or
            natural events.
          </p>

          <h2>13. Severability and waiver</h2>
          <p>
            If any provision of these Terms is held invalid or unenforceable,
            the remaining provisions remain in full force. A failure to
            enforce any provision is not a waiver of the right to enforce it
            later.
          </p>

          <h2>14. Governing law</h2>
          <p>
            These Terms and any dispute arising out of or in connection with
            the Website are governed by the laws of India, without regard to
            conflict of law principles.
          </p>

          <h2>15. Changes to these Terms</h2>
          <p>
            We may revise these Terms from time to time. The current version
            will always be published on this page with its effective date.
            Continued use of the Website after revised Terms take effect
            constitutes acceptance of the revision.
          </p>

          <h2>16. Contact</h2>
          <p>
            For any legal query regarding these Terms:{" "}
            <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
          </p>
        </section>
      </main>
      <InternalFooter />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
