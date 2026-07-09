import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Asians Healthcare privacy policy - how we handle your medical and personal data.",
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
            <p>You have the right to access, correct, or delete your personal data at any time. Contact us at info@asianshealthcare.com for any data-related requests.</p>

            <h2 className="font-display text-heading-xl text-ink">Cookies</h2>
            <p>We use cookies and similar technologies to improve your browsing experience, analyze website traffic, and deliver relevant advertisements. We use the following types of cookies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the proper functioning of our website.</li>
              <li><strong>Analytics Cookies:</strong> We use Google Analytics to understand how visitors interact with our site and improve our services.</li>
              <li><strong>Advertising Cookies:</strong> We use Google AdSense to display relevant advertisements. These cookies track your browsing habits across websites to build a profile of your interests and show you targeted ads.</li>
            </ul>
            <p>You can control cookie preferences through our cookie consent banner. You may also configure your browser to reject cookies, though some features may not function properly.</p>
            <p>Third-party vendors, including Google, use cookies to serve ads based on a user&rsquo;s prior visits to our website or other websites. Google&rsquo;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline text-accent hover:text-accent/80">Google Ads Settings</a>.</p>

            <h2 className="font-display text-heading-xl text-ink">Third-Party Services</h2>
            <p>We use the following third-party services that may collect and process your data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics:</strong> Tracks and reports website traffic and user behavior.</li>
              <li><strong>Google AdSense:</strong> Serves contextual and personalized advertisements.</li>
              <li><strong>Supabase:</strong> Our backend database and authentication provider.</li>
              <li><strong>Vercel:</strong> Our hosting platform.</li>
            </ul>

            <h2 className="font-display text-heading-xl text-ink">Contact</h2>
            <p>For privacy-related inquiries, contact us at info@asianshealthcare.com or call +91 96509 28250.</p>
          </div>
        </div>
      </section>
    </>
  );
}
