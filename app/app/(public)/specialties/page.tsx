import type { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackSpecialties } from "@/lib/fallback-data";

export const metadata: Metadata = {
  title: "Medical Specialties in India | Asians Healthcare",
  description: "Explore 30+ medical specialties available in India. Find specialists, treatments, and hospitals for your condition.",
  alternates: { canonical: "https://asianshealthcare.com/specialties" },
};

const specialtyIcons: Record<string, string> = {
  cardiology: "❤️", orthopedics: "🦴", neurology: "🧠", oncology: "🎗️",
  gastroenterology: "🫁", nephrology: "🫘", urology: "🔬", fertility: "👶",
  transplant: "🔄", dental: "🦷", ophthalmology: "👁️", "cosmetic-surgery": "✨",
  "cardiac-surgery": "🫀", neurosurgery: "🧠", pediatrics: "👶", gynecology: "👩",
  pulmonology: "🫁", endocrinology: "⚖️", rheumatology: "🦵", hematology: "🩸",
  ent: "👂", dermatology: "🧴", psychiatry: "🧠", "plastic-surgery": "🪞",
  proctology: "🩺", "vascular-surgery": "🩸", "nuclear-medicine": "☢️",
  "pain-management": "💊", "sleep-medicine": "🌙", "sports-medicine": "⚽",
  "emergency-medicine": "🚑", "spine-surgery": "💪", "bariatric-surgery": "⚖️",
  "pediatric-surgery": "👶", "liver-transplant": "🫁", "kidney-transplant": "🫘",
  "bone-marrow-transplant": "🩸",
};

export default async function SpecialtiesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: raw } = await supabase.from("specialties").select("*").limit(50);

  const fetched = raw?.map((s) => ({ name: s.name, slug: s.slug, desc: s.description || `${s.name} care and treatment` })) || [];
  const specialties = fetched.length > 0 ? fetched : fallbackSpecialties;

  return (
    <>
      <section className="bg-canvas-night text-on-primary py-16">
        <div className="max-w-7xl mx-auto px-4">
          <span className="inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">Our Expertise</span>
          <h1 className="text-4xl font-bold mb-4">Medical Specialties</h1>
          <p className="text-on-primary/70 text-lg max-w-2xl">Find the right specialty, compare doctors, and plan treatment with accredited hospitals in India.</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {specialties.map((s) => (
              <Link key={s.slug} href={`/specialties/${s.slug}`} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden group">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-3">{specialtyIcons[s.slug] || "🩺"}</div>
                  <h2 className="font-semibold text-lg text-text-primary group-hover:text-primary transition">{s.name}</h2>
                  <p className="text-text-secondary text-sm mt-2">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
