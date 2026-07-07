import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shield } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PageHero from "@/components/layout/PageHero";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
 
 export const metadata: Metadata = {
  title: "Insurance Partners | Med Solution Healthcare",
  description: "Accepted international insurance companies for medical treatment in India. Check if your provider covers treatment at our partner hospitals.",
  alternates: { canonical: "https://medsolutionhealthcare.com/insurance-company" },
};

export default async function InsurancePage() {
  const supabase = await createServerSupabaseClient();
  const { data: raw } = await supabase.from("insurance_companies").select("*").limit(50);
  const companies = raw?.map((c) => ({
    name: c.name,
    slug: c.slug,
    logo_url: c.logo_url || "",
  })) || [];

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://medsolutionhealthcare.com" },
        { name: "Insurance Partners", url: "https://medsolutionhealthcare.com/insurance-company" },
      ])} />
      <BreadcrumbNav items={[{ label: "Insurance Partners", href: "/insurance-company" }]} />
      <PageHero
        eyebrow="Insurance"
        title="Insurance Partners"
        description="We work with leading international insurance providers to ensure your treatment is covered."
       />

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c) => (
              <Link key={c.slug} href={`/insurance-company/${c.slug}`} className="group bg-canvas-cream rounded-lg p-8 border border-hairline-light hover:shadow-elevation-3 transition-all text-center">
                <div className="relative w-16 h-16 rounded-full bg-aloe-10 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {c.logo_url ? (
                    <Image src={c.logo_url} alt={c.name} fill sizes="64px" className="object-contain p-2" />
                  ) : (
                    <Shield size={32} className="text-ink" />
                  )}
                </div>
                <h2 className="font-display text-heading-md text-ink group-hover:text-shade-60 transition-colors">{c.name}</h2>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
