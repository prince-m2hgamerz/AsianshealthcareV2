import type { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackSpecialties } from "@/lib/fallback-data";
import PageHero from "@/components/layout/PageHero";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import { Stethoscope, Heart, Brain, Activity, Eye, Baby, Sparkles, Bone, Smile } from "lucide-react";

export const metadata: Metadata = {
  title: "Medical Specialties in India | Asians Healthcare",
  description: "Explore 30+ medical specialties available in India. Find specialists, treatments, and hospitals for your condition.",
  alternates: { canonical: "https://asianshealthcare.com/specialties" },
};

const lucideIconMap: Record<string, typeof Heart> = {
  cardiology: Heart, orthopedics: Bone, neurology: Brain, oncology: Activity,
  gastroenterology: Activity, nephrology: Activity, urology: Activity, fertility: Baby,
  transplant: Activity, dental: Smile, ophthalmology: Eye, "cosmetic-surgery": Sparkles,
  "cardiac-surgery": Heart, neurosurgery: Brain, pediatrics: Baby, gynecology: Heart,
  pulmonology: Activity, endocrinology: Activity, rheumatology: Bone, hematology: Activity,
  ent: Eye, dermatology: Smile, psychiatry: Brain, "plastic-surgery": Sparkles,
  proctology: Stethoscope, "vascular-surgery": Activity, "nuclear-medicine": Activity,
  "pain-management": Activity, "sleep-medicine": Activity, "sports-medicine": Activity,
  "emergency-medicine": Activity, "spine-surgery": Bone, "bariatric-surgery": Activity,
  "pediatric-surgery": Baby, "liver-transplant": Activity, "kidney-transplant": Activity,
  "bone-marrow-transplant": Activity,
};

export default async function SpecialtiesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: raw } = await supabase.from("specialties").select("*").limit(50);

  const fetched = raw?.map((s) => ({ name: s.name, slug: s.slug, desc: s.description || `${s.name} care and treatment` })) || [];
  const specialties = fetched.length > 0 ? fetched : fallbackSpecialties;

  return (
    <>
      <BreadcrumbNav items={[
        { label: "Home", href: "/" },
        { label: "Specialties", href: "/specialties" },
      ]} />
      <PageHero
        eyebrow="Our Expertise"
        title="Medical Specialties"
        description="Find the right specialty, compare doctors, and plan treatment with accredited hospitals in India."
      />

      <section className="bg-surface py-huge">
        <div className="container-cinematic">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {specialties.map((s) => {
              const Icon = lucideIconMap[s.slug] || Stethoscope;
              return (
                <Link
                  key={s.slug}
                  href={`/specialties/${s.slug}`}
                  className="group bg-surface rounded-xl border border-hairline-light p-6 hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="text-accent" />
                  </div>
                  <h2 className="font-display text-heading-md text-text group-hover:text-shade-60 transition-colors mb-2">{s.name}</h2>
                  <p className="text-body-sm text-shade-50 leading-relaxed">{s.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}