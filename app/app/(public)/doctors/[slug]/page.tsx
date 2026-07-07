import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Award, MapPin, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fallbackDoctors } from "@/lib/fallback-data";
import { JsonLd } from "@/components/shared/JsonLd";
import { physicianSchema, breadcrumbSchema } from "@/lib/json-ld";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// ─── helpers ───────────────────────────────────────────────────────────────────

async function resolveDoctor(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data: dbDoctor } = await supabase
    .from("doctors")
    .select("name, specialties, experience_years, hospital:hospitals(name), photo_url, qualifications, about, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (dbDoctor) {
    return {
      name: dbDoctor.name,
      specialty: dbDoctor.specialties?.[0] ?? "",
      experience: `${dbDoctor.experience_years ?? 0}+ years`,
      hospital: (dbDoctor.hospital as { name?: string } | null)?.name ?? "",
      photo_url: dbDoctor.photo_url ?? "",
      qualifications: dbDoctor.qualifications ?? "",
      about: dbDoctor.about ?? "",
    };
  }

  return fallbackDoctors.find((d) => d.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await resolveDoctor(slug);
  if (!doctor) return { title: "Doctor Not Found" };
  return {
    title: doctor.name,
    description: `${doctor.name} — ${doctor.specialty} at ${doctor.hospital}. ${doctor.about?.slice(0, 150) || `Book an appointment with ${doctor.name}, a specialist in ${doctor.specialty}.`}`,
    openGraph: { title: doctor.name, description: `${doctor.name} — ${doctor.specialty} at Apollo Hospitals.` },
  };
}

export default async function DoctorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = await resolveDoctor(slug);

  if (!doctor) notFound();

  return (
    <>
      <JsonLd data={physicianSchema({
        name: doctor.name,
        description: doctor.about,
        specialty: doctor.specialty,
        image: doctor.photo_url,
        url: `https://medsolutionhealthcare.com/doctors/${slug}`,
        qualifications: doctor.qualifications,
        hospitalName: doctor.hospital,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://medsolutionhealthcare.com" },
        { name: "Doctors", url: "https://medsolutionhealthcare.com/doctors" },
        { name: doctor.name, url: `https://medsolutionhealthcare.com/doctors/${slug}` },
      ])} />
      <section className="bg-canvas-night text-on-primary py-20">
        <div className="container-cinematic">
          <Link href="/doctors" className="inline-flex items-center gap-2 text-link-cool-2 hover:text-on-primary mb-6 transition-colors">
            <ArrowLeft size={18} />
            Back to Doctors
          </Link>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="relative w-36 h-36 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-4 ring-aloe-10/30 shrink-0 mx-auto lg:mx-0">
              <Image
                src={doctor.photo_url}
                alt={doctor.name}
                fill
                sizes="160px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <span className="pill-tag mb-3">Doctor Profile</span>
              <h1 className="font-display text-display-md lg:text-display-lg text-on-primary mb-3">{doctor.name}</h1>
              <p className="text-body-lg text-link-cool-2 mb-2">{doctor.specialty}</p>
              <div className="flex flex-wrap items-center gap-4 text-caption text-link-cool-1">
                <span className="flex items-center gap-1"><MapPin size={14} />{doctor.hospital}</span>
                <span className="flex items-center gap-1"><Award size={14} />{doctor.experience}</span>
                <span className="flex items-center gap-1"><BadgeCheck size={14} className="text-aloe-40" />Verified Specialist</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto">
            <h2 className="font-display text-heading-xl text-ink mb-4">About</h2>
            <p className="text-body-lg text-shade-50 leading-relaxed mb-8">{doctor.about}</p>
            {doctor.qualifications && (
              <>
                <h2 className="font-display text-heading-xl text-ink mb-4">Qualifications</h2>
                <p className="text-body-lg text-shade-50 leading-relaxed mb-8">{doctor.qualifications}</p>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/contact-us?doctor=${encodeURIComponent(doctor.name)}&hospital=${encodeURIComponent(doctor.hospital)}&specialty=${encodeURIComponent(doctor.specialty)}`} className="btn-primary">Book Appointment</Link>
              <Link href="/treatment-package" className="btn-outline">View Treatment Costs</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
