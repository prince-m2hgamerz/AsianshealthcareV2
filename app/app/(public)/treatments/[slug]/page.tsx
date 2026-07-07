import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, DollarSign, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { fallbackTreatments } from "@/lib/fallback-data";
import { JsonLd } from "@/components/shared/JsonLd";
import { faqPageSchema, breadcrumbSchema } from "@/lib/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: raw } = await supabase.from("treatments").select("*").eq("slug", slug).single();
  const fb = fallbackTreatments.find((t) => t.slug === slug);
  const treatment = raw || fb;
  if (!treatment) return { title: "Treatment Not Found" };
  const costMin = Number("cost_usd_min" in treatment ? treatment.cost_usd_min : (treatment as unknown as Record<string, number>).costMin || 0);
  return { title: `${treatment.name} Cost in India | Med Solution Healthcare`, description: `Affordable ${treatment.name} in India starting at $${costMin.toLocaleString()}. Save 60-80% compared to US costs.` };
}

export default async function TreatmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: raw } = await supabase.from("treatments").select("*").eq("slug", slug).single();
  const fb = fallbackTreatments.find((t) => t.slug === slug);
  const treatment = raw ? {
    name: raw.name, category: raw.category, costMin: Number(raw.cost_usd_min) || 0,
    costMax: Number(raw.cost_usd_max) || 0, description: raw.description || "No description available.",
  } : fb;

  if (!treatment) notFound();

  const usCost = "usCost" in treatment ? (treatment as unknown as Record<string, number>).usCost : treatment.costMax * 5 || 10000;
  const comparisonCountries = [
    { name: "India", cost: treatment.costMin },
    { name: "USA", cost: usCost },
    { name: "UK", cost: Math.round(usCost * 0.9) },
    { name: "Thailand", cost: Math.round(treatment.costMin * 1.8) },
    { name: "Singapore", cost: Math.round(treatment.costMin * 2.5) },
  ];

  const faqs = [
    { question: `How much does ${treatment.name} cost in India?`, answer: `The cost of ${treatment.name} in India ranges from $${treatment.costMin.toLocaleString()} to $${treatment.costMax.toLocaleString()}, depending on the hospital, surgeon, and medical complexity.` },
    { question: `Which hospitals in India offer ${treatment.name}?`, answer: `Top JCI and NABH-accredited hospitals in Delhi NCR offer ${treatment.name}, including Apollo Hospitals, Max Hospital, Artemis Hospital, and BLK-Max.` },
    { question: `What is the recovery time for ${treatment.name}?`, answer: `Recovery time typically ranges from 6-8 weeks. Hospital stay is usually 3-5 days, followed by a recovery period in India.` },
    { question: `How do I get started with ${treatment.name} in India?`, answer: `Contact us with your medical reports. Our team will match you with the best doctors, provide a cost estimate, and coordinate your entire medical journey.` },
    { question: `Is ${treatment.name} safe in India?`, answer: `Yes. India's top hospitals maintain international standards with JCI and NABH accreditations, board-certified surgeons, and dedicated international patient desks.` },
  ];

  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://medsolutionhealthcare.com" }, { name: "Treatments", url: "https://medsolutionhealthcare.com/treatments" }, { name: treatment.name, url: `https://medsolutionhealthcare.com/treatments/${slug}` }])} />
      <section className="bg-canvas-night text-on-primary py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/treatments" className="inline-flex items-center gap-2 text-on-primary/60 hover:text-on-primary mb-6 transition"><ArrowLeft size={18} /> Back to Treatments</Link>
          <span className="inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">{treatment.category}</span>
          <h1 className="text-4xl font-bold mb-4">{treatment.name}</h1>
          <div className="flex items-baseline gap-2 mb-2"><span className="text-4xl font-bold">${treatment.costMin.toLocaleString()}</span><span className="text-xl text-on-primary/60">- ${treatment.costMax.toLocaleString()}</span></div>
          <p className="text-on-primary/50 mb-4">In India</p>
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2"><DollarSign size={18} /><span className="text-sm">Typical overseas comparison: ${usCost.toLocaleString()}</span></div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Procedure Overview</h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">{treatment.description}</p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-5 text-center shadow-sm"><div className="text-2xl font-bold text-text-primary">3-5 days</div><p className="text-sm text-text-secondary mt-1">Hospital Stay</p></div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 text-center shadow-sm"><div className="text-2xl font-bold text-text-primary">6-8 weeks</div><p className="text-sm text-text-secondary mt-1">Recovery Time</p></div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 text-center shadow-sm"><div className="text-2xl font-bold text-text-primary">95%</div><p className="text-sm text-text-secondary mt-1">Success Rate</p></div>
              </div>

              <h2 className="text-2xl font-bold text-text-primary mb-4">Cost Comparison</h2>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
                <table className="w-full text-left">
                  <thead><tr className="bg-hairline-light"><th className="px-4 py-3 font-semibold text-text">Country</th><th className="px-4 py-3 font-semibold text-text">Average Cost</th><th className="px-4 py-3 font-semibold text-text">Savings</th></tr></thead>
                  <tbody>
                    {comparisonCountries.map((c, i) => (
                      <tr key={c.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 font-medium text-text-primary">{c.name}</td>
                        <td className="px-4 py-3 text-text-secondary">${c.cost.toLocaleString()}</td>
                        <td className="px-4 py-3">{c.name === "India" ? <span className="text-primary font-semibold">Best Value</span> : <span className="text-success">Save {Math.round((1 - treatment.costMin / c.cost) * 100)}%</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-xl text-text-primary mb-4">What&apos;s Included</h3>
              <ul className="space-y-3 mb-8">
                {["Specialist consultation", "Hospital stay and surgery", "Medical visa invitation", "Airport pickup and transfer", "Interpreter assistance", "Post-treatment follow-up"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-secondary"><Check size={18} className="text-primary shrink-0" />{item}</li>
                ))}
              </ul>

              <div className="space-y-4 mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
                {faqs.map((faq, i) => (
                  <details key={i} className="bg-white border border-gray-200 rounded-lg shadow-sm group open:shadow-md transition">
                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none"><span className="font-medium text-text-primary">{faq.question}</span>
                      <svg className="w-5 h-5 text-primary shrink-0 group-open:rotate-180 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className="px-4 pb-4"><p className="text-text-secondary">{faq.answer}</p></div>
                  </details>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-fit sticky top-24">
              <h3 className="font-semibold text-lg text-text-primary mb-4">Get Treatment Plan</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Your Name" className="input" />
                <input type="email" placeholder="Email" className="input" />
                <input type="tel" placeholder="Phone" className="input" />
                <select className="input"><option>Select Treatment</option><option>{treatment.name}</option></select>
                <textarea rows={3} placeholder="Describe your condition..." className="input" />
                <button className="btn-primary w-full">Get Free Consultation</button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <a href="tel:+918285068544" className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary"><Phone size={14} /> +91-8285068544</a>
                <a href="mailto:info@medsolutionhealthcare.com" className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary"><Mail size={14} /> info@medsolutionhealthcare.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
