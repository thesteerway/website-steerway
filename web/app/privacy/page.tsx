import type { Metadata } from "next";
import Header from "@/components/Header";
import PageEnter from "@/components/PageEnter";
import InternalFooter from "@/components/InternalFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | The Steerway",
  description:
    "How The Steerway collects, uses, discloses and protects personal information, and the rights available to you.",
};

const UPDATED = "13 July 2026";
const LEGAL_EMAIL = "legal@thesteerway.com";

export default function PrivacyPage() {
  return (
    <>
      <PageEnter />
      <Header />
      <main className="ipage legal">
        <header className="legal-head">
          <p className="ipage-eyebrow mono">Last updated: {UPDATED}</p>
          <h1 className="ipage-headline">Privacy Policy</h1>
        </header>

        <section className="legal-body">
          <h2>1. Introduction and scope</h2>
          <p>
            This Privacy Policy describes how The Steerway (&quot;The
            Steerway&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;)
            collects, uses, stores, discloses and protects personal
            information in connection with the website located at
            thesteerway.com (the &quot;Website&quot;) and the services we
            provide to clients (the &quot;Services&quot;). It applies to
            visitors of the Website, prospective clients who contact us, and
            client personnel we interact with in the course of an engagement.
          </p>
          <p>
            By using the Website or providing personal information to us, you
            acknowledge the practices described in this Policy. If you do not
            agree with it, please do not use the Website or provide personal
            information to us.
          </p>

          <h2>2. Information we collect</h2>
          <p>
            <strong>2.1 Information you provide voluntarily.</strong> When you
            contact us through the Website or by email, we receive the
            information you choose to include: typically your name, email
            address, company name, and the description of your project or
            enquiry. When we enter into an engagement, we additionally collect
            the information reasonably required to contract and invoice, such
            as billing details and the names and business contact details of
            relevant personnel.
          </p>
          <p>
            <strong>2.2 Information collected automatically.</strong> Our
            hosting infrastructure maintains standard server logs, which may
            include IP address, browser type and version, operating system,
            referring URLs, pages requested and timestamps. These logs exist
            for security, abuse prevention and reliability purposes.
          </p>
          <p>
            <strong>2.3 Cookies and similar technologies.</strong> The Website
            does not set advertising or cross-site tracking cookies. Only
            technically necessary storage may be used (for example, to
            remember that an intro animation has already played within a
            session). If we introduce analytics in the future, we will prefer
            privacy-respecting tooling and update this Policy before doing so.
          </p>
          <p>
            <strong>2.4 Information we do not seek.</strong> We do not ask for
            and do not wish to receive special categories of personal data
            (such as health, biometric or political information) through the
            Website. Please do not include such data in an enquiry.
          </p>

          <h2>3. How we use personal information</h2>
          <p>We use the information described above to:</p>
          <p>
            (a) respond to enquiries and correspond with you; (b) prepare
            proposals, contracts and invoices; (c) perform and manage
            engagements; (d) maintain the security, integrity and availability
            of the Website and our systems; (e) comply with legal, accounting
            and tax obligations; and (f) establish, exercise or defend legal
            claims where necessary.
          </p>
          <p>
            We do not sell or rent personal information. We do not use
            personal information for third-party advertising, profiling or
            automated decision-making that produces legal or similarly
            significant effects.
          </p>

          <h2>4. Legal bases</h2>
          <p>
            Where applicable data protection law requires a legal basis for
            processing, we rely on: performance of a contract or steps taken
            at your request prior to a contract; our legitimate interests in
            operating, securing and improving the Website and Services and in
            communicating with prospective clients; compliance with legal
            obligations; and consent, where we ask for it specifically.
          </p>

          <h2>5. Client data processed during engagements</h2>
          <p>
            Engagements may give us access to systems and datasets controlled
            by the client, such as CRM records, analytics properties,
            advertising accounts or databases. In respect of such data, the
            client remains the controller and The Steerway acts on the
            client&apos;s documented instructions. Such data remains in the
            client&apos;s own accounts wherever practicable, is used solely to
            perform the agreed work, is not reused for any other purpose, and
            our access is removed at handover unless continuing support is
            agreed. We execute non-disclosure and data processing agreements
            where required.
          </p>

          <h2>6. Disclosure of personal information</h2>
          <p>
            We disclose personal information only to: (a) service providers
            that support our operations, such as hosting, email and payment
            providers, limited to what is necessary for their function; (b)
            professional advisers such as accountants and lawyers, under
            duties of confidentiality; (c) public authorities where disclosure
            is required by applicable law, regulation or valid legal process;
            and (d) a successor entity in the event of a merger, acquisition
            or transfer of business assets, subject to this Policy.
          </p>

          <h2>7. International transfers</h2>
          <p>
            Our service providers may store or process information in
            jurisdictions other than your own. Where such transfers occur, we
            take reasonable steps to ensure an adequate level of protection
            consistent with applicable law, including contractual safeguards
            offered by the providers concerned.
          </p>

          <h2>8. Retention</h2>
          <p>
            We retain personal information only for as long as necessary for
            the purposes described in this Policy: enquiry correspondence for
            the duration of the exchange and a reasonable period thereafter;
            contractual and financial records for the periods required by
            applicable company, tax and accounting law; and server logs for
            short, rolling periods determined by our hosting providers.
            Information no longer required is deleted or irreversibly
            anonymised.
          </p>

          <h2>9. Security</h2>
          <p>
            We apply technical and organisational measures appropriate to the
            risk, including encryption of data in transit (HTTPS with HSTS),
            access on a need-to-know basis, segregated client accounts,
            reputable infrastructure providers, and prompt revocation of
            access at the end of engagements. No method of transmission or
            storage is completely secure; we cannot guarantee absolute
            security, but we review our measures on an ongoing basis.
          </p>

          <h2>10. Your rights</h2>
          <p>
            Subject to applicable law, you may have rights to: access the
            personal information we hold about you; request correction of
            inaccurate information; request deletion; object to or request
            restriction of processing; withdraw consent where processing is
            based on consent; and lodge a complaint with a supervisory
            authority in your jurisdiction.
          </p>
          <p>
            To exercise any of these rights, write to{" "}
            <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>. We may need
            to verify your identity before acting on a request, and we will
            respond within the timeframe required by applicable law.
          </p>

          <h2>11. Children</h2>
          <p>
            The Website and Services are directed at businesses and are not
            intended for children under 18. We do not knowingly collect
            personal information from children. If you believe a child has
            provided personal information to us, contact us and we will delete
            it.
          </p>

          <h2>12. Third-party websites</h2>
          <p>
            The Website may link to third-party websites. We are not
            responsible for the privacy practices or content of those
            websites. Review the privacy policies of any website you visit.
          </p>

          <h2>13. Changes to this Policy</h2>
          <p>
            We may update this Policy from time to time. The current version
            will always be published on this page with its effective date.
            Material changes will be highlighted on this page for a reasonable
            period. Continued use of the Website after changes take effect
            constitutes acceptance of the revised Policy.
          </p>

          <h2>14. Contact</h2>
          <p>
            For any privacy or data protection query, including requests
            under Section 10:{" "}
            <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
          </p>
        </section>
      </main>
      <InternalFooter />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
