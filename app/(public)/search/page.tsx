import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import type { Metadata } from "next";
import {
  fallbackDoctors,
  fallbackHospitals,
  fallbackTreatments,
  fallbackSpecialties,
  fallbackBlogs,
} from "@/lib/fallback-data";
import { allTreatmentPackages } from "@/lib/treatment-packages-data";
import { stripHtml } from "@/lib/utils";
import PageHero from "@/components/layout/PageHero";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import SearchEventTracker from "@/components/shared/SearchEventTracker";
import AdSenseForSearch from "@/components/shared/AdSenseForSearch";

export const metadata: Metadata = {
  title: "Search Results - Asians Healthcare",
  description: "Search results for medical treatments, doctors, hospitals, and more.",
  alternates: { canonical: "/search" },
};

const categoryColors: Record<string, string> = {
  Doctor: "bg-accent/10 text-accent border-accent/20",
  Hospital: "bg-primary/10 text-primary border-primary/20",
  Treatment: "bg-pistachio/10 text-pistachio border-pistachio/20",
  Specialty: "bg-accent/10 text-accent border-accent",
  Blog: "bg-gold/10 text-gold border-gold/20",
  Hotel: "bg-primary/10 text-primary border-primary/20",
  Testimonial: "bg-accent/10 text-accent border-accent/20",
};

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  image?: string;
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

function buildResults(query: string): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);
  const matches = (text: string) => words.every((w) => normalize(text).includes(w));

  const results: SearchResult[] = [];

  for (const d of fallbackDoctors) {
    if (matches(`${d.name} ${d.specialty} ${d.specialties.join(" ")} ${d.hospital} ${d.qualifications} ${d.about}`)) {
      results.push({
        id: `doctor-${d.slug}`, title: d.name, description: `${d.specialty} | ${d.experience} | ${d.hospital}`,
        url: `/doctors/${d.slug}`, category: "Doctor", image: d.photo_url,
      });
    }
  }

  for (const h of fallbackHospitals) {
    if (matches(`${h.name} ${h.location} ${h.city} ${h.state} ${h.accreditation} ${h.about}`)) {
      results.push({
        id: `hospital-${h.slug}`, title: h.name, description: `${h.location} | ${h.beds} beds`,
        url: `/hospitals/${h.slug}`, category: "Hospital", image: h.photo_url,
      });
    }
  }

  for (const t of fallbackTreatments) {
    if (matches(`${t.name} ${t.category} ${t.description}`)) {
      results.push({
        id: `treatment-${t.slug}`, title: t.name, description: `${t.category} | $${t.costMin.toLocaleString()} - $${t.costMax.toLocaleString()}`,
        url: `/treatment-package/${t.slug}`, category: "Treatment", image: t.image_url,
      });
    }
  }

  const seenSlugs = new Set(fallbackTreatments.map((t) => t.slug));
  for (const tp of allTreatmentPackages) {
    if (seenSlugs.has(tp.slug)) continue;
    if (matches(`${tp.name} ${tp.category} ${tp.description}`)) {
      results.push({
        id: `tp-${tp.slug}`, title: tp.name, description: `${tp.category} | $${tp.costMin.toLocaleString()} - $${tp.costMax.toLocaleString()}`,
        url: `/treatment-package/${tp.slug}`, category: "Treatment", image: tp.image_url,
      });
    }
  }

  for (const s of fallbackSpecialties) {
    if (matches(`${s.name} ${s.desc}`)) {
      results.push({
        id: `specialty-${s.slug}`, title: s.name, description: s.desc,
        url: `/speciality/${s.slug}`, category: "Specialty",
      });
    }
  }

  for (const b of fallbackBlogs) {
    const plain = stripHtml(b.content);
    if (matches(`${b.title} ${b.category} ${b.author} ${plain}`)) {
      results.push({
        id: `blog-${b.slug}`, title: b.title, description: plain.slice(0, 200),
        url: `/blogs/${b.slug}`, category: "Blog", image: b.thumbnail_url,
      });
    }
  }

  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const query = typeof sp?.q === "string" ? sp.q.trim() : "";
  const results = query ? buildResults(query) : [];

  const categoryOrder = ["Doctor", "Hospital", "Treatment", "Specialty", "Blog"];
  const grouped = new Map<string, SearchResult[]>();
  for (const r of results) {
    if (!grouped.has(r.category)) grouped.set(r.category, []);
    grouped.get(r.category)!.push(r);
  }

  return (
    <>
      <SearchEventTracker />
      <BreadcrumbNav items={[{ label: "Search", href: "/search" }]} />
      <PageHero
        eyebrow="Search"
        title="Search Results"
        description={query ? `Showing results for "${query}"` : "Search across all content"}
      />

      <section className="section-padding bg-surface">
        <div className="container-cinematic">
          <form method="GET" action="/search" className="max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white border border-hairline-light rounded-xl shadow-sm p-1.5 sm:p-2 flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-shade-40" />
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search doctors, hospitals, treatments..."
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 text-body-sm sm:text-body bg-transparent text placeholder:text-shade-40 outline-none focus:outline-none"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn-accent whitespace-nowrap flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg shrink-0"
              >
                Search
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {query && results.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <Search size={36} className="sm:size-48 mx-auto mb-4 text-shade-40 opacity-40" />
              <h2 className="text-heading-xs sm:text-heading-md text mb-2">No results found</h2>
              <p className="text-shade-50 text-sm sm:text-body">
                No results matching &quot;{query}&quot;. Try different keywords.
              </p>
            </div>
          )}

          {/* AdSense for Search - top ads when there are results */}
          {query && (
            <div className="max-w-4xl mx-auto mb-6">
              <AdSenseForSearch
                pageOptions={{
                  pubId: "partner-pub-8492704974936957",
                  query,
                  styleId: "YOUR_STYLE_ID_HERE", // Replace with actual style ID from AdSense > Ads for search > Search styles
                  channel: "site_search_results",
                  linkTarget: "_blank",
                }}
                  adBlocks={[
                    {
                      container: "afscontainer1",
                      maxTop: 3,
                      width: "100%",
                    },
                  ]}
              />
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-8 sm:space-y-12">
              <p className="text-shade-50 text-sm sm:text-body">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
              {categoryOrder.map((cat) => {
                const items = grouped.get(cat);
                if (!items) return null;
                return (
                  <div key={cat}>
                    <h3 className="text-heading-2xs sm:text-heading-sm text mb-3 sm:mb-4 flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-wider border ${categoryColors[cat] || ""}`}>
                        {cat}
                      </span>
                      <span className="text-shade-50 text-xs sm:text-sm font-normal">({items.length})</span>
                    </h3>
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-canvas-night-elevated rounded-xl border border-hairline-dark hover:border-hairline transition-all"
                        >
                          {item.image ? (
                            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden shrink-0">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="64px"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-primary flex items-center justify-center shrink-0">
                              <Search size={18} className="sm:size-24 text-shade-40" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-body-sm sm:text-body text-on-primary font-medium group-hover:text-accent transition-colors truncate">
                              {item.title}
                            </p>
                            <p className="text-shade-40 text-xs sm:text-sm mt-0.5 sm:mt-1 line-clamp-2">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!query && (
            <div className="text-center py-12 sm:py-16">
              <Search size={36} className="sm:size-48 mx-auto mb-4 text-shade-40 opacity-40" />
              <h2 className="text-heading-xs sm:text-heading-md text mb-2">Search Across Everything</h2>
              <p className="text-shade-50 text-sm sm:text-body">
                Enter a search term above to find doctors, hospitals, treatments, specialties, and more.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
