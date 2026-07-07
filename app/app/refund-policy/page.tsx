import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Med Solution Healthcare refund policy for medical tourism services - cancellation and refund terms.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <>
      <section className="bg-canvas-night text-on-primary py-20">
        <div className="container-cinematic">
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4">Refund Policy</h1>
          <p className="text-body-lg text-link-cool-2 max-w-2xl">Last updated: January 2026</p>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto text-body-lg text-shade-50 leading-relaxed space-y-6">
            <h2 className="font-display text-heading-xl text-ink">Introduction</h2>
            <p>Med Solution Healthcare strives to provide transparent and fair refund policies for all medical tourism facilitation services. This policy outlines the terms and conditions under which refunds are processed. Please read this policy carefully before availing of our services.</p>

            <h2 className="font-display text-heading-xl text-ink">Cancellation Policy</h2>
            <p>Cancellation terms vary depending on the stage of your medical travel planning. If you cancel before any arrangements have been made with healthcare providers, a full refund of facilitation fees will be issued. If cancellation occurs after bookings are confirmed, applicable charges from hospitals, hotels, or other third-party providers may be deducted.</p>

            <h2 className="font-display text-heading-xl text-ink">Refund Eligibility</h2>
            <p>Refunds are eligible for facilitation fees paid directly to Med Solution Healthcare when a cancellation request is submitted in writing. Payments made directly to hospitals or healthcare providers are subject to their individual refund policies, and Med Solution Healthcare cannot guarantee refunds for such payments.</p>

            <h2 className="font-display text-heading-xl text-ink">How to Request a Refund</h2>
            <p>To request a refund, please contact our support team at info@medsolutionhealthcare.com with your full name, booking reference number, and reason for cancellation. Our team will review your request and respond within 5-7 business days with the refund decision and timeline.</p>

            <h2 className="font-display text-heading-xl text-ink">Contact Information</h2>
            <p>For any questions regarding this refund policy, reach out to us at info@medsolutionhealthcare.com or call +91 82850 68544. We are here to assist you with any concerns.</p>
          </div>
        </div>
      </section>
    </>
  );
}
