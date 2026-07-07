import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PageHero from "@/components/layout/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import { fallbackBlogs } from "@/lib/fallback-data";
import { stripHtml } from "@/lib/utils";
import NewsletterSignup from "@/components/home/NewsletterSignup";

export const metadata: Metadata = {
  title: "Medical Tourism Blog & Guides",
  description: "Expert guides on medical tourism in India. Treatment costs, hospital comparisons, visa tips, recovery planning, and patient stories from Delhi NCR.",
  alternates: { canonical: "/blogs" },
};

const categories = ["All", "Medical Visa Guide", "Treatment Blog", "Tourism Blog"];

export default async function BlogsPage({ searchParams }: { searchParams?: Promise<{ cat?: string }> }) {
  const sp = searchParams ? await searchParams : {};
  const supabase = await createServerSupabaseClient();
  const { data: raw } = await supabase.from("blogs").select("*").eq("is_published", true).limit(50);
  const activeCategory = typeof sp?.cat === "string" ? sp.cat : "All";
  const fetchedBlogs = raw?.map((b) => ({
    title: b.title,
    category: b.category,
    author: b.author || "Med Solution Team",
    date: b.published_at ? new Date(b.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
    slug: b.slug,
    excerpt: stripHtml(b.content || "").substring(0, 120) + "...",
    thumbnail_url: b.thumbnail_url || "https://safartibbi.com/wp-content/uploads/2022/11/apolo-1.jpg",
  })) || [];
  const allBlogs = fetchedBlogs.length > 0 ? fetchedBlogs : fallbackBlogs.map((b) => ({
    ...b,
    date: b.published_at ? new Date(b.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
    excerpt: stripHtml(b.content || "").substring(0, 120) + "...",
  }));
  const filteredBlogs = activeCategory === "All" ? allBlogs : allBlogs.filter((b) => b.category === activeCategory);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://medsolutionhealthcare.com" },
        { name: "Blog", url: "https://medsolutionhealthcare.com/blogs" },
      ])} />
      <PageHero
        eyebrow="Our Blog"
        title="Blogs & Resources"
        description="Stay informed with the latest in medical tourism, treatment guides, and healthcare tips."
       />

      <section className="bg-canvas-cream py-6 sm:py-8 border-b border-hairline-light sticky top-16 lg:top-20 z-30">
        <div className="container-cinematic">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-2 px-2 snap-x">
            {categories.map((cat) => {
              const href = cat === "All" ? "/blogs" : `/blogs?cat=${encodeURIComponent(cat)}`;
              const isActive = (cat === "All" && activeCategory === "All") || cat === activeCategory;
              return (
                <Link
                  key={cat}
                  href={href}
                  className={`shrink-0 snap-start px-4 sm:px-5 py-2.5 sm:py-2 rounded-pill text-body-md font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-ink text-on-primary shadow-elevation-2"
                      : "bg-canvas-light text-shade-50 hover:bg-shade-20 border border-hairline-light"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          {filteredBlogs.length === 0 ? (
            <div className="text-center border border-hairline-light rounded-lg p-10 bg-canvas-cream">
              <h2 className="font-display text-heading-lg text-ink">No posts in this category</h2>
              <p className="text-body-md text-shade-50 mt-2">Check back soon for new content.</p>
              <Link href="/blogs" className="btn-primary mt-6 inline-block">View All Posts</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBlogs.map((blog) => (
                <Link key={blog.slug} href={`/blogs/${blog.slug}`} className="group bg-canvas-cream rounded-xl border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-aloe-10 to-pistachio-10">
                    <Image
                      src={blog.thumbnail_url}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <span className="pill-tag-shade !text-micro !px-2 !py-0.5 mb-3 bg-aloe-10/80">{blog.category}</span>
                    <h2 className="font-display text-heading-lg text-ink group-hover:text-shade-60 transition-colors mb-3">{blog.title}</h2>
                    <p className="text-body-md text-shade-50 mb-4 line-clamp-2">{blog.excerpt}</p>
                    <div className="flex items-center gap-4 text-caption text-shade-40">
                      <span className="flex items-center gap-1"><User size={14} />{blog.author}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} />{blog.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <NewsletterSignup />
    </>
  );
}
