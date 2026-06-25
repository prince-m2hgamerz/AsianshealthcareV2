import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { fallbackDoctors } from "@/lib/fallback-data";
import { fallbackHospitals } from "@/lib/fallback-data";
import { fallbackTreatments } from "@/lib/fallback-data";
import { fallbackSpecialties } from "@/lib/fallback-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medsolutionhealthcare.com";

  const staticPages = [
    { url: baseUrl, priority: 1 },
    "/about-us", "/doctors", "/hospitals", "/treatment-package",
    "/speciality", "/specialties", "/contact-us", "/testimonials",
    "/blogs", "/insurance-company", "/hotels", "/tourism",
    "/search", "/find-cost", "/guides", "/cost-calculator",
    "/terms", "/privacy-policy",
  ].map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page === "" ? 1 : 0.8,
  }));

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Attempt Supabase queries, fall back to static data
  let blogPages: MetadataRoute.Sitemap = [];
  let treatmentPages: MetadataRoute.Sitemap = [];
  let hospitalPages: MetadataRoute.Sitemap = [];
  let specialtyPages: MetadataRoute.Sitemap = [];

  try {
    const { data: blogs } = await supabase.from("blogs").select("slug, updated_at, published_at").eq("is_published", true);
    blogPages = (blogs || []).map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: new Date(b.updated_at || b.published_at || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch { /* skip */ }

  try {
    const { data: treatments } = await supabase.from("treatments").select("slug, updated_at");
    treatmentPages = (treatments || fallbackTreatments).map((t) => ({
      url: `${baseUrl}/treatment-package/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    treatmentPages = fallbackTreatments.map((t) => ({
      url: `${baseUrl}/treatment-package/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  try {
    const { data: hospitals } = await supabase.from("hospitals").select("slug, updated_at");
    hospitalPages = (hospitals || fallbackHospitals).map((h) => ({
      url: `${baseUrl}/hospitals/${h.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    hospitalPages = fallbackHospitals.map((h) => ({
      url: `${baseUrl}/hospitals/${h.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  try {
    const { data: specialties } = await supabase.from("specialties").select("slug, updated_at");
    specialtyPages = (specialties || fallbackSpecialties).map((s) => ({
      url: `${baseUrl}/speciality/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    specialtyPages = fallbackSpecialties.map((s) => ({
      url: `${baseUrl}/speciality/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  }

  // Doctor pages from static Apollo/Max data
  const doctorPages = fallbackDoctors.map((d) => ({
    url: `${baseUrl}/doctors/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...doctorPages, ...treatmentPages, ...hospitalPages, ...specialtyPages];
}
