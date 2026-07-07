import {
  fallbackDoctors,
  fallbackHospitals,
  fallbackTreatments,
  fallbackSpecialties,
  fallbackBlogs,
  fallbackHotels,
  fallbackTestimonials,
} from "./fallback-data";
import { allTreatmentPackages } from "./treatment-packages-data";
import { stripHtml } from "./utils";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  image?: string;
  keywords: string;
}

let index: SearchItem[] | null = null;

export function buildSearchIndex(): SearchItem[] {
  if (index) return index;

  const items: SearchItem[] = [];

  for (const d of fallbackDoctors) {
    items.push({
      id: `doctor-${d.slug}`,
      title: d.name,
      description: `${d.specialty} | ${d.experience} | ${d.hospital}`,
      url: `/doctors/${d.slug}`,
      category: "Doctor",
      image: d.photo_url,
      keywords: `${d.name} ${d.specialty} ${d.specialties.join(" ")} ${d.hospital} ${d.qualifications} ${d.about}`,
    });
  }

  for (const h of fallbackHospitals) {
    items.push({
      id: `hospital-${h.slug}`,
      title: h.name,
      description: `${h.location} | ${h.beds} beds | ${h.accreditation}`,
      url: `/hospitals/${h.slug}`,
      category: "Hospital",
      image: h.photo_url,
      keywords: `${h.name} ${h.location} ${h.city} ${h.state} ${h.accreditation} ${h.about}`,
    });
  }

  for (const t of fallbackTreatments) {
    items.push({
      id: `treatment-${t.slug}`,
      title: t.name,
      description: `${t.category} | $${t.costMin.toLocaleString()} - $${t.costMax.toLocaleString()}`,
      url: `/treatment-package/${t.slug}`,
      category: "Treatment",
      image: t.image_url,
      keywords: `${t.name} ${t.category} ${t.description}`,
    });
  }

  const seenTreatmentSlugs = new Set(fallbackTreatments.map((t) => t.slug));
  for (const tp of allTreatmentPackages) {
    if (seenTreatmentSlugs.has(tp.slug)) continue;
    items.push({
      id: `treatment-package-${tp.slug}`,
      title: tp.name,
      description: `${tp.category} | $${tp.costMin.toLocaleString()} - $${tp.costMax.toLocaleString()}`,
      url: `/treatment-package/${tp.slug}`,
      category: "Treatment",
      image: tp.image_url,
      keywords: `${tp.name} ${tp.category} ${tp.description}`,
    });
  }

  for (const s of fallbackSpecialties) {
    items.push({
      id: `specialty-${s.slug}`,
      title: s.name,
      description: s.desc,
      url: `/speciality/${s.slug}`,
      category: "Specialty",
      keywords: `${s.name} ${s.desc}`,
    });
  }

  for (const b of fallbackBlogs) {
    items.push({
      id: `blog-${b.slug}`,
      title: b.title,
      description: stripHtml(b.content).slice(0, 200),
      url: `/blogs/${b.slug}`,
      category: "Blog",
      image: b.thumbnail_url,
      keywords: `${b.title} ${b.category} ${b.author} ${stripHtml(b.content)}`,
    });
  }

  for (const h of fallbackHotels) {
    items.push({
      id: `hotel-${h.name.toLowerCase().replace(/\s+/g, "-")}`,
      title: h.name,
      description: `${h.address} | ${"★".repeat(h.stars)} | ${h.price}`,
      url: `/hotels?hotel=${encodeURIComponent(h.name)}`,
      category: "Hotel",
      image: h.photo_url,
      keywords: `${h.name} ${h.address} ${h.near} ${h.description}`,
    });
  }

  for (const t of fallbackTestimonials) {
    items.push({
      id: `testimonial-${t.name.toLowerCase().replace(/\s+/g, "-")}`,
      title: `${t.name} from ${t.country}`,
      description: `"${t.text.slice(0, 120)}..."`,
      url: `/testimonials`,
      category: "Testimonial",
      keywords: `${t.name} ${t.country} ${t.treatment} ${t.text}`,
    });
  }

  index = items;
  return items;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Doctor: "Stethoscope",
    Hospital: "Building2",
    Treatment: "HeartPulse",
    Specialty: "Microscope",
    Blog: "FileText",
    Hotel: "Hotel",
    Testimonial: "Quote",
  };
  return icons[category] || "Search";
}
