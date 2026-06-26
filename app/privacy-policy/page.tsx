import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Med Solution Healthcare privacy policy - how we handle your medical and personal data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-canvas-night text-on-primary py-20">
        <div className="container-cinematic">
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4">Privacy Policy</h1>
          <p className="text-body-lg text-link-cool-2 max-w-2xl">Last updated: January 2026</p>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto text-body-lg text-shade-50 leading-relaxed space-y-6">
            <h2 className="font-display text-heading-xl text-ink">Information We Collect</h2>
            <p>We collect personal information you provide when contacting us, including your name, email address, phone number, country, and medical condition details. This information is used solely to facilitate your medical treatment journey in India.</p>

            <h2 className="font-display text-heading-xl text-ink">How We Use Your Data</h2>
            <p>Your data is used to: connect you with healthcare providers, process medical visa invitations, coordinate treatment plans, and provide travel and accommodation support. We never share your medical data with third parties without your explicit consent.</p>

            <h2 className="font-display text-heading-xl text-ink">Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal and medical data. All data is encrypted in transit and at rest using secure protocols.</p>

            <h2 className="font-display text-heading-xl text-ink">Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. Contact us at info@medsolutionhealthcare.com for any data-related requests.</p>

            <h2 className="font-display text-heading-xl text-ink">Cookies</h2>
            <p>We use essential cookies to ensure the proper functioning of our website. No tracking or advertising cookies are used.</p>

            <h2 className="font-display text-heading-xl text-ink">Contact</h2>
            <p>For privacy-related inquiries, contact us at info@medsolutionhealthcare.com or call +91 82850 68544.</p>
          </div>
        </div>
      </section>
    </>
  );
}
