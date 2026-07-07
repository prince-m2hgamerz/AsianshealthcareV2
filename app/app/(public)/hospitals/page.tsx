import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackHospitals } from "@/lib/fallback-data";
import PageHero from "@/components/layout/PageHero";
import SearchInput from "@/components/layout/SearchInput";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partner Hospitals in India | Med Solution Healthcare",
  description: "Explore India's top JCI and NABH accredited hospitals for medical tourism. Apollo, Max, Artemis, BLK-Max, Sir Ganga Ram & more in Delhi NCR.",
  alternates: { canonical: "https://medsolutionhealthcare.com/hospitals" },
};

export default async function HospitalsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const supabase = await createServerSupabaseClient();
  const { data: raw } = await supabase.from("hospitals").select("*").limit(50);
  const query = typeof sp?.q === "string" ? sp.q.trim() : "";
  const normalizedQuery = query.toLowerCase();

  const fetchedHospitals = raw?.map((hospital) => ({
    name: hospital.name,
    location: `${hospital.city}, ${hospital.state}`,
    city: hospital.city,
    state: hospital.state,
    beds: `${hospital.beds_count?.toLocaleString() || 0}+`,
    accreditation: hospital.accreditations?.join(", ") || "Accredited",
    slug: hospital.slug,
              photo_url: hospital.logo_url || "/images/hospital-apollo.webp",
  })) || [];

  const allHospitals = fetchedHospitals.length > 0 ? fetchedHospitals : fallbackHospitals;
  const hospitals = normalizedQuery
    ? allHospitals.filter((hospital) =>
        [hospital.name, hospital.location, hospital.accreditation]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : allHospitals;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://medsolutionhealthcare.com" },
        { name: "Hospitals", url: "https://medsolutionhealthcare.com/hospitals" },
      ])} />
      <BreadcrumbNav items={[
        { label: "Home", href: "/" },
        { label: "Hospitals", href: "/hospitals" },
      ]} />
      <PageHero
        eyebrow="Top Facilities"
        title="Our Partner Hospitals"
        description="Internationally accredited hospitals equipped with advanced technology and world-class infrastructure."
       />

      <section className="bg-canvas-cream py-12 border-b border-hairline-light">
        <div className="container-cinematic">
          <SearchInput
            placeholder="Search hospitals by city or name..."
            label="Search hospitals"
            resultCount={hospitals.length}
          />
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          {hospitals.length === 0 ? (
            <div className="text-center border border-hairline-light rounded-lg p-10 bg-canvas-cream">
              <h2 className="font-display text-heading-lg text-ink">No hospitals found</h2>
              <p className="text-body-md text-shade-50 mt-2">Try a different hospital name, city, or accreditation.</p>
              <Link href="/hospitals" className="btn-primary mt-6">
                Clear Search
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <Link key={hospital.slug} href={`/hospitals/${hospital.slug}`} className="group bg-canvas-light rounded-lg border border-hairline-light overflow-hidden hover:shadow-elevation-3 transition-all duration-300">
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <Image
                      src={hospital.photo_url}
                      alt={hospital.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="pill-tag !text-micro !px-2 !py-0.5">{hospital.accreditation}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-heading-lg text-ink group-hover:text-shade-60 transition-colors">{hospital.name}</h2>
                    <div className="flex items-center gap-1 text-caption text-shade-40 mt-1">
                      <MapPin size={14} /><span>{hospital.location}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-caption text-shade-50">
                      <Building2 size={14} /> <span>{hospital.beds} beds</span>
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
