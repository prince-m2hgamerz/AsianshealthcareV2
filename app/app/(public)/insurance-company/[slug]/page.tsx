import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Check } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient().catch(() => null);
  let insurance: { name: string; description: string } | null = null;
  if (supabase) {
    const { data } = await supabase.from("insurance_companies").select("name, description").eq("slug", slug).single();
    insurance = data;
  }
  if (!insurance) return { title: "Insurance Partner | Med Solution Healthcare" };
  return {
    title: `${insurance.name} Coverage in India | Med Solution Healthcare`,
    description: `${insurance.description || `Check if ${insurance.name} covers your medical treatment in India. Insurance acceptance at top hospitals in Delhi NCR.`}`,
    alternates: { canonical: `https://medsolutionhealthcare.com/insurance-company/${slug}` },
  };
}

export default async function InsuranceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: insurance } = await supabase.from("insurance_companies").select("*").eq("slug", slug).single();

  if (!insurance) notFound();

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://medsolutionhealthcare.com" },
        { name: "Insurance Partners", url: "https://medsolutionhealthcare.com/insurance-company" },
        { name: insurance.name, url: `https://medsolutionhealthcare.com/insurance-company/${slug}` },
      ])} />
      <BreadcrumbNav items={[
        { label: "Insurance Partners", href: "/insurance-company" },
        { label: insurance.name, href: `/insurance-company/${slug}` },
      ]} />
      <section className="bg-canvas-night text-on-primary py-20">
        <div className="container-cinematic">
          <Link href="/insurance-company" className="inline-flex items-center gap-2 text-link-cool-2 hover:text-on-primary mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Insurance Partners
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-aloe-10 flex items-center justify-center">
              <Shield size={28} className="text-ink" />
            </div>
            <span className="pill-tag">Insurance Partner</span>
          </div>
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4">{insurance.name}</h1>
          <p className="text-body-lg text-link-cool-2 max-w-2xl">
            {insurance.description || "We accept insurance from this provider for medical treatments in India."}
          </p>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto">
            <h2 className="font-display text-heading-xl text-ink mb-6">Coverage Benefits</h2>
            <ul className="space-y-4 mb-8">
              {["In-patient treatment coverage", "Pre-authorization assistance", "Direct billing with partner hospitals", "Emergency medical evacuation", "Post-treatment follow-up"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-body-md text-shade-50">
                  <Check size={18} className="text-aloe-10 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/contact-us" className="btn-primary">Check Your Eligibility</Link>
          </div>
        </div>
      </section>
    </>
  );
}
