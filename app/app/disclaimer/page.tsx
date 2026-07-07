import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Asians Healthcare disclaimer - general information purposes, no doctor-patient relationship established.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <>
      <section className="bg-canvas-night text-on-primary py-20">
        <div className="container-cinematic">
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4">Disclaimer</h1>
          <p className="text-body-lg text-link-cool-2 max-w-2xl">Last updated: January 2026</p>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto text-body-lg text-shade-50 leading-relaxed space-y-6">
            <h2 className="font-display text-heading-xl text-ink">No Medical Advice</h2>
            <p>The information provided on this website is for general informational purposes only and does not constitute medical advice, diagnosis, or treatment. Asians Healthcare is a medical tourism facilitator and not a healthcare provider. Always consult with a qualified medical professional regarding any health concerns or treatment decisions.</p>

            <h2 className="font-display text-heading-xl text-ink">Accuracy</h2>
            <p>We strive to keep the information on this website accurate and up-to-date. However, we make no warranties or representations regarding the completeness, reliability, or accuracy of the content. Treatment costs, hospital credentials, and doctor availability may change without notice.</p>

            <h2 className="font-display text-heading-xl text-ink">External Links</h2>
            <p>Our website may contain links to third-party websites for your convenience. Asians Healthcare does not endorse or take responsibility for the content, privacy practices, or services of these external sites. Accessing third-party links is at your own risk.</p>

            <h2 className="font-display text-heading-xl text-ink">Limitation of Liability</h2>
            <p>Asians Healthcare shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website or the services provided by third-party healthcare institutions. Your use of the website and reliance on any information is solely at your own risk.</p>
          </div>
        </div>
      </section>
    </>
  );
}
