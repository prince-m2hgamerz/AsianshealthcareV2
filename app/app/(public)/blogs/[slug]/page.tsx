import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import { fallbackBlogs } from "@/lib/fallback-data";
import { sanitizeHtml } from "@/lib/sanitize";

const siteUrl = "https://medsolutionhealthcare.com";

export async function generateStaticParams() {
  const supabase = await createServerSupabaseClient().catch(() => null);
  if (!supabase) return fallbackBlogs.map((b) => ({ slug: b.slug }));
  const { data } = await supabase.from("blogs").select("slug").eq("is_published", true);
  if (data?.length) return data.map((b: { slug: string }) => ({ slug: b.slug }));
  return fallbackBlogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient().catch(() => null);
  let post = supabase
    ? (await supabase.from("blogs").select("*").eq("slug", slug).single()).data
    : null;
  if (!post) post = fallbackBlogs.find((b) => b.slug === slug) || null;
  if (!post) return { title: "Blog Post Not Found" };
  const excerpt = post.content?.replace(/<[^>]+>/g, "").substring(0, 155) || "";
  const cleanTitle = post.title?.replace(/\s*\|\s*Med Solution Healthcare$/, "") || "Blog Post";
  return {
    title: cleanTitle,
    description: excerpt || `Read about ${post.title} — a comprehensive guide on medical tourism, treatment options, and healthcare in India.`,
    alternates: { canonical: `/blogs/${slug}` },
    openGraph: {
      title: cleanTitle,
      description: excerpt,
      type: "article",
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: [post.author || "Med Solution Healthcare"],
      images: post.thumbnail_url ? [{ url: post.thumbnail_url, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: excerpt,
      images: post.thumbnail_url ? [post.thumbnail_url] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient().catch(() => null);
  let post = supabase
    ? (await supabase.from("blogs").select("*").eq("slug", slug).single()).data
    : null;
  if (!post) post = fallbackBlogs.find((b) => b.slug === slug) as typeof post | undefined;
  if (!post) notFound();

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  const articleSchema = {
    "@type": "Article",
    headline: post.title,
    description: post.content?.replace(/<[^>]+>/g, "").substring(0, 200) || "",
    author: { "@type": "Person", name: post.author || "Med Solution Healthcare" },
    publisher: { "@type": "Organization", name: "Med Solution Healthcare", url: siteUrl },
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    image: post.thumbnail_url || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blogs/${slug}` },
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Blog", url: `${siteUrl}/blogs` },
        { name: post.title, url: `${siteUrl}/blogs/${slug}` },
      ])} />
      <section className="bg-canvas-night text-on-primary py-20">
        <div className="container-cinematic">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-link-cool-2 hover:text-on-primary mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Blogs
          </Link>
          <span className="pill-tag mb-4">{post.category}</span>
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4 max-w-4xl">{post.title}</h1>
          <div className="flex items-center gap-4 text-caption text-link-cool-2">
            <span className="flex items-center gap-1"><User size={14} />{post.author || "Med Solution Team"}</span>
            {date && <span className="flex items-center gap-1"><Calendar size={14} />{date}</span>}
          </div>
        </div>
      </section>

      <article className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto">
            {post.thumbnail_url && (
              <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-lg border border-hairline-light">
                <Image src={post.thumbnail_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
              </div>
            )}
            <div className="text-body-lg text-shade-50 leading-relaxed space-y-6" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
          </div>
        </div>
      </article>
    </>
  );
}
