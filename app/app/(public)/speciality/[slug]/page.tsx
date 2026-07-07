import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { fallbackSpecialties } from "@/lib/fallback-data";
import { getSiteImages } from "@/lib/site-settings";
import { getSpecialtyImage } from "@/lib/site-images";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient().catch(() => null);
  let specialty: { name: string; description: string } | null = null;
  if (supabase) {
    const { data } = await supabase.from("specialties").select("name, description").eq("slug", slug).single();
    specialty = data;
  }
  if (!specialty) {
    const fallback = fallbackSpecialties.find((s) => s.slug === slug);
    if (fallback) specialty = { name: fallback.name, description: fallback.desc };
  }
  if (!specialty) return { title: "Specialty Not Found" };
  return {
    title: `${specialty.name} Treatment in India | Asians Healthcare`,
    description: `${specialty.description || `Expert ${specialty.name} treatment in India at top hospitals with board-certified specialists.`}`,
    alternates: { canonical: `https://asianshealthcare.com/speciality/${slug}` },
  };
}

export default async function SpecialtyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const [{ data: rawSpecialty }, images] = await Promise.all([
    supabase.from("specialties").select("*").eq("slug", slug).single(),
    getSiteImages(),
  ]);
  const fallbackSpecialty = fallbackSpecialties.find((specialty) => specialty.slug === slug);
  const specialty = rawSpecialty
    ? {
        name: rawSpecialty.name,
        description: rawSpecialty.description || "No description available.",
      }
    : fallbackSpecialty
      ? {
          name: fallbackSpecialty.name,
          description: fallbackSpecialty.desc,
        }
      : null;

  if (!specialty) notFound();

  return (
    <>
      <section className="relative overflow-hidden bg-canvas-night text-on-primary py-20">
        <div className="absolute inset-0">
          <Image
            src={getSpecialtyImage(images, slug)}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-25"
          />
        </div>
        <div className="absolute inset-0 bg-canvas-night/80" />
        <div className="container-cinematic relative z-10">
          <Link href="/speciality" className="inline-flex items-center gap-2 text-link-cool-2 hover:text-on-primary mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Specialties
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-lg bg-aloe-10 flex items-center justify-center">
              <Heart size={28} className="text-ink" />
            </div>
            <span className="pill-tag">Specialty</span>
          </div>
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4">{specialty.name}</h1>
          <p className="text-body-lg text-link-cool-2 max-w-3xl">{specialty.description}</p>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto">
            <h2 className="font-display text-heading-xl text-ink mb-6">Available Treatments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/treatment-package" className="bg-canvas-cream rounded-lg p-5 border border-hairline-light hover:shadow-elevation-3 transition-all flex items-center justify-between group">
                <span className="text-body-md text-ink">View all treatments</span>
                <ArrowLeft size={18} className="text-shade-40 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
