import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowRight, TrendingDown } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackTreatments } from "@/lib/fallback-data";
import PageHero from "@/components/layout/PageHero";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";

export const metadata: Metadata = {
  title: "Treatment Packages & Costs in India | Asians Healthcare",
  description: "Compare treatment costs in India vs. US/UK. Save 60-80% on cardiology, orthopedics, oncology, IVF, and more at top JCI hospitals.",
  alternates: { canonical: "https://asianshealthcare.com/treatments" },
};

export default async function TreatmentsPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string }> }) {
  const sp = searchParams ? await searchParams : {};
  const supabase = await createServerSupabaseClient();
  const { data: raw } = await supabase.from("treatments").select("*").limit(50);

  const fetched = raw?.map((t) => ({
    name: t.name, costMin: Number(t.cost_usd_min) || 0, costMax: Number(t.cost_usd_max) || 0,
    usCost: Number(t.cost_usd_max) * 5 || 10000, slug: t.slug, category: t.category || "General",
    description: t.description || "",
  })) || [];

  const allTreatments = fetched.length > 0 ? fetched : fallbackTreatments;
  const query = typeof sp?.q === "string" ? sp.q.trim().toLowerCase() : "";
  const categoryFilter = typeof sp?.category === "string" ? sp.category : "";

  let filtered = allTreatments;
  if (query) filtered = filtered.filter((t) => [t.name, t.category].join(" ").toLowerCase().includes(query));
  if (categoryFilter) filtered = filtered.filter((t) => t.category.toLowerCase() === categoryFilter.toLowerCase());

  const categories = [...new Set(allTreatments.map((t) => t.category))].sort();

  return (
    <>
      <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Treatments", href: "/treatments" }]} />
      <PageHero eyebrow="Affordable Care" title="Treatment Packages & Costs" description="Compare treatment costs in India vs. Western countries. Save 60-80% without compromising on quality." />

      <section className="bg-surface py-8 border-b border-hairline-light">
        <div className="container-cinematic">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-shade-40" size={20} />
              <input
                type="text"
                placeholder="Search treatments..."
                className="w-full border border-hairline-light rounded-lg pl-10 pr-4 py-3 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"
              />
            </div>
            <select className="border border-hairline-light rounded-lg px-4 py-3 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-text">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-surface py-huge">
        <div className="container-cinematic">
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/treatments" className={`px-4 py-2 rounded-full text-body-sm font-medium transition ${!categoryFilter ? "bg-ink text-on-primary" : "bg-surface text-shade-50 border border-hairline-light hover:border-ink"}`}>All</Link>
            {categories.map((c) => (
              <Link key={c} href={`/treatments?category=${encodeURIComponent(c)}`} className={`px-4 py-2 rounded-full text-body-sm font-medium transition ${categoryFilter.toLowerCase() === c.toLowerCase() ? "bg-ink text-on-primary" : "bg-surface text-shade-50 border border-hairline-light hover:border-ink"}`}>{c}</Link>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center border border-hairline-light rounded-xl p-10 bg-surface">
              <Search size={40} className="mx-auto mb-4 text-shade-40 opacity-40" />
              <h2 className="font-display text-heading-lg text-text">No treatments found</h2>
              <p className="text-body-md text-shade-50 mt-2">Try a different search term or category.</p>
              <Link href="/treatments" className="btn-accent mt-6 inline-flex">Clear Search</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t) => (
                <Link key={t.slug} href={`/treatment-package/${t.slug}`} className="group bg-surface rounded-xl border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="relative h-44 bg-gradient-to-br from-accent/5 to-accent/10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingDown size={28} className="text-accent" />
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="pill-tag !text-micro !px-2 !py-0.5 mb-3 inline-block">{t.category}</span>
                    <h2 className="font-display text-heading-md text-text group-hover:text-shade-60 transition-colors mb-3">{t.name}</h2>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-heading-lg text-text">${t.costMin.toLocaleString()}</span>
                      <span className="text-body-sm text-shade-40">- ${t.costMax.toLocaleString()}</span>
                    </div>
                    <p className="text-caption text-shade-40">In India</p>
                    <div className="mt-3 pt-3 border-t border-hairline-light">
                      <p className="text-body-sm text-shade-50">US Cost: <span className="line-through text-shade-40">${t.usCost.toLocaleString()}</span></p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}