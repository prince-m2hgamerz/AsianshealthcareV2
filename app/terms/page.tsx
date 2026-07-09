import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Asians Healthcare terms of service for medical tourism services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-primary text-on-primary py-20">
        <div className="container-cinematic">
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4">Terms of Service</h1>
          <p className="text-body-lg text-text-muted max-w-2xl">Last updated: January 2026</p>
        </div>
      </section>

      <section className="bg-surface py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto text-body-lg text-shade-50 leading-relaxed space-y-6">
            <h2 className="font-display text-heading-xl text-text">Services</h2>
            <p>Asians Healthcare acts as a facilitator connecting international patients with healthcare providers in India. We assist with hospital selection, doctor consultations, visa processing, travel arrangements, and accommodation booking.</p>

            <h2 className="font-display text-heading-xl text-text">Medical Disclaimer</h2>
            <p>Asians Healthcare does not provide medical advice, diagnosis, or treatment. All medical decisions are made between the patient and their chosen healthcare provider. We recommend consulting with qualified medical professionals for any health concerns.</p>

            <h2 className="font-display text-heading-xl text-text">Payment Terms</h2>
            <p>Treatment costs are paid directly to the healthcare provider unless otherwise agreed. Asians Healthcare charges a service fee for facilitation services, which is communicated upfront.</p>

            <h2 className="font-display text-heading-xl text-text">Cancellation Policy</h2>
            <p>Cancellation policies vary by healthcare provider. We recommend reviewing the specific cancellation terms of your chosen hospital or clinic before confirming treatment.</p>

            <h2 className="font-display text-heading-xl text-text">Limitation of Liability</h2>
            <p>Asians Healthcare is not liable for medical outcomes, treatment results, or any issues arising from the medical care provided by third-party healthcare institutions.</p>
          </div>
        </div>
      </section>
    </>
  );
}
