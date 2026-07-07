import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Activity, Baby, Bone, Brain, Eye, Heart, HeartPulse, Smile, Sparkles, Stethoscope } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackSpecialties } from "@/lib/fallback-data";
import PageHero from "@/components/layout/PageHero";
import { getSiteImages } from "@/lib/site-settings";
import { getSpecialtyImage } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Medical Specialties | Med Solution Healthcare",
  description: "Explore 30+ medical specialties available in India. Find top specialists, treatments, and hospitals for cardiology, orthopedics, oncology, neurology and more.",
  alternates: { canonical: "https://medsolutionhealthcare.com/speciality" },
};

const iconMap: Record<string, typeof Heart> = {
  cardiology: Heart,
  neurology: Brain,
  orthopedics: Bone,
  ophthalmology: Eye,
  oncology: Activity,
  urology: HeartPulse,
  fertility: Baby,
  transplant: Activity,
  dental: Smile,
  "cosmetic-surgery": Sparkles,
};

export default async function SpecialtiesPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: raw }, images] = await Promise.all([
    supabase.from("specialties").select("*").limit(50),
    getSiteImages(),
  ]);
  const fetchedSpecialties = raw?.map((specialty) => ({
    name: specialty.name,
    icon: iconMap[specialty.slug as keyof typeof iconMap] || Stethoscope,
    slug: specialty.slug,
    desc: specialty.description || `${specialty.name} care and treatment`,
  })) || [];
  const specialties = fetchedSpecialties.length > 0
    ? fetchedSpecialties
    : fallbackSpecialties.map((specialty) => ({
        ...specialty,
        icon: iconMap[specialty.slug as keyof typeof iconMap] || Stethoscope,
      }));

  return (
    <>
      <PageHero
        eyebrow="Our Expertise"
        title="Medical Specialties"
        description="Find the right specialty, compare doctors, and plan treatment with accredited hospitals in India."
       />

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty) => (
              <Link key={specialty.slug} href={`/speciality/${specialty.slug}`} className="group overflow-hidden rounded-lg border border-hairline-light bg-canvas-cream transition-all hover:-translate-y-1 hover:shadow-elevation-3">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={getSpecialtyImage(images, specialty.slug)}
                    alt={specialty.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas-night/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-lg bg-aloe-10 text-ink shadow-elevation-2">
                    <specialty.icon size={24} />
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="font-display text-heading-lg text-ink group-hover:text-shade-60 transition-colors">{specialty.name}</h2>
                  <p className="text-body-md text-shade-50 mt-2 leading-relaxed">{specialty.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
