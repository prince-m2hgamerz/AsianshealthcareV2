import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-shade-40" size={20} />
              <input type="text" placeholder="Search treatments..." className="w-full border border-hairline-light rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white" />
            </div>
            <select className="border border-hairline-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white text-text">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/treatments" className={`px-4 py-2 rounded-full text-sm font-medium transition ${!categoryFilter ? "bg-primary text-white" : "bg-gray-100 text-text-secondary hover:bg-gray-200"}`}>All</Link>
            {categories.map((c) => (
              <Link key={c} href={`/treatments?category=${encodeURIComponent(c)}`} className={`px-4 py-2 rounded-full text-sm font-medium transition ${categoryFilter.toLowerCase() === c.toLowerCase() ? "bg-primary text-white" : "bg-gray-100 text-text-secondary hover:bg-gray-200"}`}>{c}</Link>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="text-center border border-gray-200 rounded-lg p-10"><h2 className="text-2xl font-bold text-text-primary">No treatments found</h2><p className="text-text-secondary mt-2">Try a different search.</p><Link href="/treatments" className="btn-primary mt-6 inline-block">Clear Search</Link></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t) => (
                <Link key={t.slug} href={`/treatment-package/${t.slug}`} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden group">
                  <div className="relative h-44 bg-gray-50 flex items-center justify-center text-4xl text-primary/20 font-bold">{t.name.charAt(0)}</div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-1 rounded-full">{t.category}</span>
                    <h2 className="font-semibold text-lg text-text-primary mt-2 group-hover:text-primary transition">{t.name}</h2>
                    <div className="flex items-baseline gap-2 mt-3"><span className="text-2xl font-bold text-text-primary">${t.costMin.toLocaleString()}</span><span className="text-text-secondary">- ${t.costMax.toLocaleString()}</span></div>
                    <p className="text-sm text-text-secondary mt-1">In India</p>
                    <div className="mt-3 pt-3 border-t border-gray-100"><p className="text-sm text-text-secondary">US Cost: <span className="line-through">${t.usCost.toLocaleString()}</span></p></div>
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
