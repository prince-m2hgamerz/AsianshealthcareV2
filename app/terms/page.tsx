import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Med Solution Healthcare terms of service for medical tourism services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-canvas-night text-on-primary py-20">
        <div className="container-cinematic">
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4">Terms of Service</h1>
          <p className="text-body-lg text-link-cool-2 max-w-2xl">Last updated: January 2026</p>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto text-body-lg text-shade-50 leading-relaxed space-y-6">
            <h2 className="font-display text-heading-xl text-ink">Services</h2>
            <p>Med Solution Healthcare acts as a facilitator connecting international patients with healthcare providers in India. We assist with hospital selection, doctor consultations, visa processing, travel arrangements, and accommodation booking.</p>

            <h2 className="font-display text-heading-xl text-ink">Medical Disclaimer</h2>
            <p>Med Solution Healthcare does not provide medical advice, diagnosis, or treatment. All medical decisions are made between the patient and their chosen healthcare provider. We recommend consulting with qualified medical professionals for any health concerns.</p>

            <h2 className="font-display text-heading-xl text-ink">Payment Terms</h2>
            <p>Treatment costs are paid directly to the healthcare provider unless otherwise agreed. Med Solution Healthcare charges a service fee for facilitation services, which is communicated upfront.</p>

            <h2 className="font-display text-heading-xl text-ink">Cancellation Policy</h2>
            <p>Cancellation policies vary by healthcare provider. We recommend reviewing the specific cancellation terms of your chosen hospital or clinic before confirming treatment.</p>

            <h2 className="font-display text-heading-xl text-ink">Limitation of Liability</h2>
            <p>Med Solution Healthcare is not liable for medical outcomes, treatment results, or any issues arising from the medical care provided by third-party healthcare institutions.</p>
          </div>
        </div>
      </section>
    </>
  );
}
