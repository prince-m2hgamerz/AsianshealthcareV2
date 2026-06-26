import type { Metadata } from "next";
import { Star, Quote, Play } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PageHero from "@/components/layout/PageHero";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
 
 export const metadata: Metadata = {
  title: "Patient Testimonials | Med Solution Healthcare",
  description: "Read real patient stories and reviews from international medical travelers who received treatment in India through Med Solution Healthcare.",
  alternates: { canonical: "https://medsolutionhealthcare.com/testimonials" },
};

export default async function TestimonialsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: raw } = await supabase.from("testimonials").select("*").eq("is_approved", true).limit(50);
  const testimonials = raw?.map((t) => ({
    name: t.patient_name,
    country: t.country,
    treatment: t.treatment,
    text: t.text_content,
    rating: t.rating || 5,
    imageUrl: t.image_url,
    videoUrl: t.video_url?.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1]
      ? undefined
      : t.video_url || undefined,
  })) || [];

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://medsolutionhealthcare.com" },
        { name: "Testimonials", url: "https://medsolutionhealthcare.com/testimonials" },
      ])} />
      <BreadcrumbNav items={[{ label: "Testimonials", href: "/testimonials" }]} />
      <PageHero
        eyebrow="Patient Stories"
        title="Testimonials"
        description="Hear from patients around the world who transformed their health through medical treatment in India."
       />

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-canvas-cream rounded-xl p-8 border border-hairline-light relative hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300">
                <Quote className="absolute top-6 right-6 text-aloe-10/20" size={40} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {(t.imageUrl || t.videoUrl) && (
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4">
                    {t.videoUrl ? (
                      <video
                        src={t.videoUrl}
                        className="w-full h-full object-cover"
                        controls
                        playsInline
                        poster={t.imageUrl || undefined}
                      />
                    ) : (
                      <img src={t.imageUrl!} alt={t.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-body-md text-shade-50 mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="border-t border-hairline-light pt-4">
                  <p className="font-display text-heading-sm text-ink">{t.name}</p>
                  <p className="text-caption text-shade-40">{t.country} &middot; {t.treatment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
