import type { Metadata } from "next";
import CostCalculatorClient from "./CostCalculatorClient";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";

export const metadata: Metadata = {
  title: "Treatment Cost Calculator",
  description: "Compare medical treatment costs in India vs USA, UK, Canada, Australia. See how much you can save with Med Solution Healthcare.",
  alternates: { canonical: "/cost-calculator" },
};

const treatments = [
  { name: "Heart Bypass Surgery", costIndia: 7500, costUs: 120000 },
  { name: "Hip Replacement", costIndia: 4500, costUs: 40000 },
  { name: "Knee Replacement", costIndia: 5000, costUs: 35000 },
  { name: "Kidney Transplant", costIndia: 13000, costUs: 160000 },
  { name: "Liver Transplant", costIndia: 28000, costUs: 300000 },
  { name: "IVF Treatment", costIndia: 3500, costUs: 15000 },
  { name: "Spinal Fusion", costIndia: 7000, costUs: 80000 },
  { name: "Dental Implants (per tooth)", costIndia: 800, costUs: 4000 },
  { name: "Bariatric Surgery", costIndia: 6000, costUs: 25000 },
  { name: "Cataract Surgery", costIndia: 1500, costUs: 6000 },
  { name: "Hair Transplant", costIndia: 2000, costUs: 12000 },
  { name: "Angioplasty", costIndia: 4500, costUs: 65000 },
];

export default function CostCalculatorPage() {
  return (
    <>
      <BreadcrumbNav items={[
        { label: "Home", href: "/" },
        { label: "Cost Calculator", href: "/cost-calculator" },
      ]} />
      <section className="bg-canvas-night text-on-primary py-16">
        <div className="container-cinematic text-center">
          <span className="pill-tag mb-4">Cost Comparison</span>
          <h1 className="font-display text-display-md lg:text-display-lg text-on-primary mb-3">Treatment Cost Calculator</h1>
          <p className="text-body-lg text-link-cool-2 max-w-2xl mx-auto">
            See how much you can save by choosing India for your medical treatment.
            Slide to compare costs with your country.
          </p>
        </div>
      </section>
      <CostCalculatorClient treatments={treatments} />
    </>
  );
}
