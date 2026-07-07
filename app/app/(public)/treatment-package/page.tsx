import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { allTreatmentPackages } from "@/lib/treatment-packages-data";
import PageHero from "@/components/layout/PageHero";
import SearchInput from "@/components/layout/SearchInput";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";

export const metadata: Metadata = {
  title: "218+ Treatment Packages & Costs in India | Med Solution Healthcare",
  description: "Compare 218+ medical treatment costs in India vs. US/UK. Save 60-80% on cardiology, orthopedics, oncology, transplant, IVF, and more at top JCI hospitals.",
  alternates: { canonical: "https://medsolutionhealthcare.com/treatment-package" },
};

export default async function TreatmentPackagesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const supabase = await createServerSupabaseClient();
  const { data: raw } = await supabase.from("treatments").select("*").limit(300);
  const query = typeof sp?.q === "string" ? sp.q.trim() : "";
  const categoryFilter = typeof sp?.category === "string" ? sp.category : "";
  const normalizedQuery = query.toLowerCase();

  // Map DB slugs to real images from the 218 treatments data
  const treatmentImageMap: Record<string, string> = {
    "knee-replacement": "/images/treatment-knee.webp",
    "hip-replacement": "/images/treatment-hip.webp",
    "spine-surgery": "/images/treatment-spine.webp",
    "hair-transplant": "/images/treatment-hair.webp",
    "ivf-treatment": "/images/treatment-ivf.webp",
    "bariatric-surgery": "/images/treatment-bariatric.webp",
    "heart-bypass-surgery": "/images/treatment-heart-bypass.webp",
    "angioplasty": "/images/treatment-angioplasty.webp",
    "bone-marrow-transplant": "/images/treatment-bmt.webp",
    "liver-transplant": "/images/treatment-liver.webp",
    "kidney-transplant": "/images/treatment-kidney.webp",
    "dental-implants": "/images/treatment-dental.webp",
    "robotic-prostate-surgery": "/images/treatment-prostate.webp",
    "cataract-surgery": "/images/treatment-cataract.webp",
    "brain-tumor-surgery": "/images/treatment-oncology.webp",
    "liver-resection": "/images/treatment-liver.webp",
    "aortic-valve-replacement": "/images/treatment-cardiac.webp",
    "oncology-surgery": "/images/treatment-oncology.webp",
    "scoliosis-surgery": "/images/treatment-spine.webp",
    "cochlear-implant": "/images/treatment-dental.webp",
    "pacemaker-implant": "/images/treatment-cardiac.webp",
    "cornea-transplant": "/images/treatment-cataract.webp",
    "gallbladder-surgery": "/images/treatment-ortho.webp",
    "hernia-surgery": "/images/treatment-ortho.webp",
    "thyroid-surgery": "/images/treatment-oncology.webp",
    "appendix-surgery": "/images/treatment-ortho.webp",
  };

  const fetchedTreatments = raw?.map((treatment) => {
    // Find matching image: direct map > fuzzy match from 218 data > fallback
    const directImage = treatmentImageMap[treatment.slug];
    const fuzzyMatch = !directImage ? allTreatmentPackages.find((p) =>
      p.slug.includes(treatment.slug) || treatment.slug.includes(p.slug.replace('-cost-in-india', '').replace('-in-india', ''))
    ) : null;
    return {
      name: treatment.name,
      costMin: Number(treatment.cost_usd_min) || 0,
      costMax: Number(treatment.cost_usd_max) || 0,
      usCost: Number(treatment.cost_usd_max) * 4 || 15000,
      slug: treatment.slug,
      category: treatment.category || "General Surgery",
      description: treatment.description || "",
      image_url: treatment.image_url || directImage || fuzzyMatch?.image_url || "/images/placeholder.svg",
    };
  }) || [];

  // Merge: show DB treatments + any from the 218 list that aren't in DB
  const dbSlugs = new Set(fetchedTreatments.map((t) => t.slug));
  const additionalTreatments = allTreatmentPackages.filter((t) => !dbSlugs.has(t.slug));
  const allTreatments = [...fetchedTreatments, ...additionalTreatments];

  // Filter by search query
  let treatments = normalizedQuery
    ? allTreatments.filter((treatment) =>
        [treatment.name, treatment.category, treatment.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : allTreatments;

  // Filter by category
  if (categoryFilter) {
    treatments = treatments.filter((t) => t.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  // Get unique categories for filter
  const categories = [...new Set(allTreatments.map((t) => t.category))].sort();

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://medsolutionhealthcare.com" },
        { name: "Treatment Packages", url: "https://medsolutionhealthcare.com/treatment-package" },
      ])} />
      <BreadcrumbNav items={[
        { label: "Home", href: "/" },
        { label: "Treatment Packages", href: "/treatment-package" },
      ]} />
      <PageHero
        eyebrow="218+ Procedures"
        title="Treatment Packages & Costs"
        description="Compare 218+ treatment costs in India vs. Western countries. Save 60-80% without compromising on quality at JCI/NABH accredited hospitals."
       />

      <section className="bg-canvas-cream py-8 sm:py-12 border-b border-hairline-light">
        <div className="container-cinematic">
          <SearchInput
            placeholder="Search 218+ treatments by name or category..."
            label="Search treatments"
            resultCount={treatments.length}
          />
          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/treatment-package"
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                !categoryFilter ? "bg-ink text-on-primary border-ink" : "bg-canvas-light text-shade-50 border-hairline-light hover:border-ink"
              }`}
            >
              All ({allTreatments.length})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/treatment-package?category=${encodeURIComponent(cat)}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  categoryFilter === cat ? "bg-ink text-on-primary border-ink" : "bg-canvas-light text-shade-50 border-hairline-light hover:border-ink"
                }`}
              >
                {cat} ({allTreatments.filter((t) => t.category === cat).length})
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas-light py-12 sm:py-huge">
        <div className="container-cinematic">
          {treatments.length === 0 ? (
            <div className="text-center border border-hairline-light rounded-lg p-10 bg-canvas-cream">
              <h2 className="font-display text-heading-lg text-ink">No treatments found</h2>
              <p className="text-body-md text-shade-50 mt-2">Try a different procedure, specialty, or category.</p>
              <Link href="/treatment-package" className="btn-primary mt-6">
                Clear Search
              </Link>
            </div>
          ) : (
            <>
              <p className="text-body-md text-shade-50 mb-6">
                Showing {treatments.length} treatment{treatments.length !== 1 ? "s" : ""}
                {categoryFilter && <> in <strong className="text-ink">{categoryFilter}</strong></>}
                {normalizedQuery && <> matching &ldquo;<strong className="text-ink">{query}</strong>&rdquo;</>}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {treatments.map((treatment) => (
                  <Link key={treatment.slug} href={`/treatment-package/${treatment.slug}`} className="group overflow-hidden bg-canvas-cream rounded-xl border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-36">
                      <Image
                        src={treatment.image_url || "/images/placeholder.svg"}
                        alt={treatment.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center bg-white/90 backdrop-blur-sm text-ink text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {treatment.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="font-display text-heading-sm text-ink group-hover:text-shade-60 transition-colors line-clamp-2 min-h-[2.5rem]">{treatment.name}</h2>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="font-display text-heading-lg text-ink">${treatment.costMin.toLocaleString()}</span>
                        <span className="text-caption text-shade-40">- ${treatment.costMax.toLocaleString()}</span>
                      </div>
                      <p className="text-micro text-shade-40 mt-0.5">In India</p>
                      <div className="mt-2 pt-2 border-t border-hairline-light flex items-center justify-between">
                        <p className="text-micro text-shade-50">US: <span className="line-through">${treatment.usCost.toLocaleString()}</span></p>
                        <span className="text-micro text-green-700 font-semibold">
                          Save {Math.round((1 - treatment.costMax / treatment.usCost) * 100)}%
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
