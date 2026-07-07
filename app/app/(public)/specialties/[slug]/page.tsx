import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { fallbackSpecialties, fallbackTreatments } from "@/lib/fallback-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: raw } = await supabase.from("specialties").select("*").eq("slug", slug).single();
  const fb = fallbackSpecialties.find((s) => s.slug === slug);
  const s = raw || fb;
  if (!s) return { title: "Specialty Not Found" };
  return { title: `${s.name} Treatment in India | Asians Healthcare`, description: s.desc || `${s.name} treatment in India at top hospitals.` };
}

export default async function SpecialtyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const [{ data: raw }] = await Promise.all([
    supabase.from("specialties").select("*").eq("slug", slug).single(),
  ]);
  const fb = fallbackSpecialties.find((s) => s.slug === slug);
  const specialty = raw
    ? { name: raw.name, description: raw.description || "No description available." }
    : fb
    ? { name: fb.name, description: fb.desc || "No description available." }
    : null;
  if (!specialty) notFound();

  const relatedTreatments = fallbackTreatments.filter((t) => t.category.toLowerCase().includes(specialty.name.split(" ")[0].toLowerCase())).slice(0, 6);

  return (
    <>
      <section className="bg-canvas-night text-on-primary py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/specialties" className="inline-flex items-center gap-2 text-on-primary/60 hover:text-on-primary mb-6 transition"><ArrowLeft size={18} /> Back to Specialties</Link>
          <span className="inline-block bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">Specialty</span>
          <h1 className="text-4xl font-bold mb-4">{specialty.name}</h1>
          <p className="text-on-primary/70 text-xl max-w-3xl">{specialty.description}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {relatedTreatments.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Available Treatments</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {relatedTreatments.map((t) => (
                      <Link key={t.slug} href={`/treatment-package/${t.slug}`} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition group">
                        <h3 className="font-semibold text-text-primary group-hover:text-primary transition">{t.name}</h3>
                        <p className="text-2xl font-bold text-primary mt-2">${t.costMin.toLocaleString()}</p>
                        <p className="text-xs text-text-secondary">Starting from</p>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="space-y-4">
              <Link href={`/doctors?specialty=${slug}`} className="btn-primary w-full block text-center">Find Specialists</Link>
              <Link href="/contact-us" className="btn-outline w-full block text-center">Get Free Consultation</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
