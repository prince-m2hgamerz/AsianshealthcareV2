import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award, Building2, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { fallbackHospitals } from "@/lib/fallback-data";
import { getHospitalBySlug } from "@/lib/server-queries";
import { JsonLd } from "@/components/shared/JsonLd";
import { hospitalSchema, breadcrumbSchema } from "@/lib/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: rawHospital } = await getHospitalBySlug(slug);
  const fallbackHospital = fallbackHospitals.find((hospital) => hospital.slug === slug);
  const hospital = rawHospital || fallbackHospital;
  if (!hospital) return { title: "Hospital Not Found" };
  const name = hospital.name || "Hospital";
  const photoUrl = rawHospital?.logo_url || (fallbackHospital && "photo_url" in fallbackHospital ? fallbackHospital.photo_url : null);
  return {
    title: name,
    description: `${name} — ${hospital.city}, ${hospital.state}. ${hospital.accreditations?.join(", ") || "Accredited"} multi-specialty hospital. ${hospital.about?.slice(0, 150) || `Learn about ${name} and available treatments.`}`,
    openGraph: {
      title: name,
      description: `${name} — Healthcare facility in ${hospital.city}, India.`,
      images: photoUrl ? [{ url: photoUrl, width: 1200, height: 630, alt: name }] : undefined,
    },
  };
}

export default async function HospitalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: rawHospital } = await getHospitalBySlug(slug);
  const fallbackHospital = fallbackHospitals.find((hospital) => hospital.slug === slug);
  const hospital = rawHospital
    ? {
        name: rawHospital.name,
        city: rawHospital.city,
        state: rawHospital.state,
        accreditation: rawHospital.accreditations?.join(", ") || "Accredited",
        beds_count: rawHospital.beds_count || 0,
        about: rawHospital.about || "No description available.",
        photo_url: rawHospital.logo_url || fallbackHospital?.photo_url || null,
      }
    : fallbackHospital;

  if (!hospital) notFound();

  return (
    <>
      <JsonLd data={hospitalSchema({
        name: hospital.name,
        description: hospital.about,
        city: hospital.city,
        state: hospital.state,
        beds: hospital.beds_count,
        url: `https://medsolutionhealthcare.com/hospitals/${slug}`,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://medsolutionhealthcare.com" },
        { name: "Hospitals", url: "https://medsolutionhealthcare.com/hospitals" },
        { name: hospital.name, url: `https://medsolutionhealthcare.com/hospitals/${slug}` },
      ])} />
      <section className="bg-canvas-night text-on-primary py-20">
        <div className="container-cinematic">
          <Link href="/hospitals" className="inline-flex items-center gap-2 text-link-cool-2 hover:text-on-primary mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Hospitals
          </Link>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {hospital.photo_url ? (
              <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden shrink-0 ring-2 ring-white/10">
                <Image src={hospital.photo_url} alt={hospital.name} fill className="object-cover" sizes="128px" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg bg-aloe-10 flex items-center justify-center shrink-0">
                <Building2 size={40} className="text-ink" />
              </div>
            )}
            <div>
              <span className="pill-tag mb-3">Hospital Profile</span>
              <h1 className="font-display text-display-md lg:text-display-lg text-on-primary mb-3">{hospital.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-caption text-link-cool-1">
                <span className="flex items-center gap-1"><MapPin size={14} />{hospital.city}, {hospital.state}</span>
                <span className="flex items-center gap-1"><Award size={14} />{hospital.accreditation}</span>
                <span>{hospital.beds_count.toLocaleString()} beds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto">
            <h2 className="font-display text-heading-xl text-ink mb-4">About</h2>
            <p className="text-body-lg text-shade-50 leading-relaxed mb-8">{hospital.about}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-canvas-cream rounded-lg p-6 text-center">
                <div className="font-display text-display-md text-ink">{hospital.beds_count.toLocaleString()}+</div>
                <p className="text-caption text-shade-50">Total Beds</p>
              </div>
              <div className="bg-canvas-cream rounded-lg p-6 text-center">
                <div className="font-display text-display-md text-ink">50+</div>
                <p className="text-caption text-shade-50">Specialists</p>
              </div>
              <div className="bg-canvas-cream rounded-lg p-6 text-center">
                <div className="font-display text-display-md text-ink">24/7</div>
                <p className="text-caption text-shade-50">International Desk</p>
              </div>
            </div>
            <Link href="/contact-us" className="btn-primary">Contact for Treatment</Link>
          </div>
        </div>
      </section>
    </>
  );
}
