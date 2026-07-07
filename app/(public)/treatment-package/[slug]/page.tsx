import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, DollarSign } from "lucide-react";
import { notFound } from "next/navigation";
import { fallbackTreatments } from "@/lib/fallback-data";
import { getTreatmentBySlug } from "@/lib/server-queries";
import { getSiteImages } from "@/lib/site-settings";
import { getTreatmentImage } from "@/lib/site-images";
import { JsonLd } from "@/components/shared/JsonLd";
import { faqPageSchema, breadcrumbSchema, medicalProcedureSchema } from "@/lib/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: rawTreatment } = await getTreatmentBySlug(slug);
  const fallbackTreatment = fallbackTreatments.find((treatment) => treatment.slug === slug);
  const treatment = rawTreatment || fallbackTreatment;
  if (!treatment) return { title: "Treatment Not Found" };
  const name = treatment.name || "Treatment";
  const costMin = Number(treatment.cost_usd_min || treatment.costMin || 0);
  return {
    title: `${name} Cost in India | Asians Healthcare`,
    description: `Affordable ${name} in India starting at $${costMin.toLocaleString()}. Save 60-80% compared to US costs. Board-accredited surgeons, JCI hospitals.`,
    openGraph: { title: `${name} Cost in India`, description: `Get ${name} in India at top hospitals. Starting from $${costMin.toLocaleString()}.` },
  };
}

export default async function TreatmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ data: rawTreatment }, images] = await Promise.all([
    getTreatmentBySlug(slug),
    getSiteImages(),
  ]);
  const fallbackTreatment = fallbackTreatments.find((treatment) => treatment.slug === slug);
  const treatment = rawTreatment
      ? {
          name: rawTreatment.name,
          category: rawTreatment.category,
          costMin: Number(rawTreatment.cost_usd_min) || 0,
          costMax: Number(rawTreatment.cost_usd_max) || 0,
          description: rawTreatment.description || "No description available.",
        }
    : fallbackTreatment;

  if (!treatment) notFound();

  const usCost = "usCost" in treatment ? treatment.usCost : treatment.costMax * 5 || 10000;

  const faqs = [
    {
      question: `How much does ${treatment.name} cost in India?`,
      answer: `The cost of ${treatment.name} in India ranges from $${treatment.costMin.toLocaleString()} to $${treatment.costMax.toLocaleString()}, depending on the hospital, surgeon, and medical complexity. This is typically 60-80% less than in the US or Europe.`,
    },
    {
      question: `Which hospitals in India offer ${treatment.name}?`,
      answer: `Top JCI and NABH-accredited hospitals in Delhi NCR offer ${treatment.name}, including Apollo Hospitals, Max Hospital, Artemis Hospital, BLK-Max, and Sir Ganga Ram Hospital.`,
    },
    {
      question: `What is the recovery time for ${treatment.name}?`,
      answer: `Recovery time for ${treatment.name} typically ranges from 6-8 weeks. Hospital stay is usually 3-5 days, followed by a recovery period in India before returning home.`,
    },
    {
      question: `How do I get started with ${treatment.name} in India?`,
      answer: `Contact us with your medical reports. Our team will match you with the best doctors and hospitals, provide a detailed cost estimate, arrange your visa invitation, and coordinate your entire medical journey.`,
    },
    {
      question: `Is ${treatment.name} safe in India?`,
      answer: `Yes. India's top hospitals maintain international standards with JCI and NABH accreditations. Our partner hospitals in Delhi NCR feature board-certified surgeons, modern ICUs, and dedicated international patient desks.`,
    },
  ];

  return (
    <>
      <JsonLd data={medicalProcedureSchema({
        name: treatment.name,
        description: treatment.description,
        bodyLocation: treatment.category,
        cost: `$${treatment.costMin.toLocaleString()} - $${treatment.costMax.toLocaleString()}`,
        recoveryTime: "6-8 weeks",
        howPerformed: `Specialized surgical or non-surgical procedure performed by experienced specialists at JCI/NABH accredited hospitals in India.`,
      })} />
      <JsonLd data={faqPageSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://asianshealthcare.com" },
        { name: "Treatment Packages", url: "https://asianshealthcare.com/treatment-package" },
        { name: treatment.name, url: `https://asianshealthcare.com/treatment-package/${slug}` },
      ])} />
      <section className="relative overflow-hidden bg-canvas-night text-on-primary py-20">
        <div className="absolute inset-0">
          <Image
            src={getTreatmentImage(images, slug, treatment.category)}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-25"
          />
        </div>
        <div className="absolute inset-0 bg-canvas-night/80" />
        <div className="container-cinematic relative z-10">
          <Link href="/treatment-package" className="inline-flex items-center gap-2 text-link-cool-2 hover:text-on-primary mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Treatments
          </Link>
          <span className="pill-tag mb-4">{treatment.category}</span>
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4">{treatment.name}</h1>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display text-display-md text-aloe-10">${treatment.costMin.toLocaleString()}</span>
            <span className="text-body-lg text-link-cool-2">- ${treatment.costMax.toLocaleString()}</span>
          </div>
          <p className="text-caption text-link-cool-1 mb-4">In India</p>
          <div className="inline-flex items-center gap-2 bg-aloe-10/15 text-aloe-10 rounded-pill px-4 py-2 mt-4">
            <DollarSign size={18} className="text-aloe-10" />
            <span className="text-body-md">Typical overseas comparison: ${usCost.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto">
            <h2 className="font-display text-heading-xl text-ink mb-4">About This Treatment</h2>
            <p className="text-body-lg text-shade-50 leading-relaxed mb-8">{treatment.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-canvas-cream rounded-lg p-6 text-center border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-0.5 transition-all duration-300">
                <div className="font-display text-heading-xl text-ink">3-5 days</div>
                <p className="text-caption text-shade-50 mt-1">Hospital Stay</p>
              </div>
              <div className="bg-canvas-cream rounded-lg p-6 text-center border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-0.5 transition-all duration-300">
                <div className="font-display text-heading-xl text-ink">6-8 weeks</div>
                <p className="text-caption text-shade-50 mt-1">Recovery Time</p>
              </div>
              <div className="bg-canvas-cream rounded-lg p-6 text-center border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-0.5 transition-all duration-300">
                <div className="font-display text-heading-xl text-ink">95%</div>
                <p className="text-caption text-shade-50 mt-1">Success Rate</p>
              </div>
            </div>

            <h3 className="font-display text-heading-lg text-ink mb-4">Typical Coordination</h3>
            <ul className="space-y-3 mb-8">
              {["Specialist opinion", "Hospital estimate", "Visa invitation support", "Admission coordination", "Interpreter support", "Discharge and follow-up guidance"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-body-md text-shade-50">
                  <Check size={18} className="text-aloe-10 shrink-0" /> {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact-us" className="btn-primary">Get Treatment Plan</Link>
              <Link href="/doctors" className="btn-outline">Find a Specialist</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
