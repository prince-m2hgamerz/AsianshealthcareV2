import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/layout/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import DoctorsClient from "./DoctorsClient";
import { allDoctors, type Doctor } from "@/lib/doctors-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Specialist Doctors in India | Apollo, Max, Medanta, BLK-Max & More",
  description: `Browse ${allDoctors.length}+ specialist doctors from India's top hospitals — Apollo, Max, Medanta, BLK-Max, Artemis and Paras. Filter by specialty, hospital, and gender.`,
  alternates: { canonical: "https://medsolutionhealthcare.com/doctors" },
};

export default async function DoctorsPage() {
  const supabase = await createServerSupabaseClient();

  const SELECT_FIELDS = "name, slug, photo_url, specialties, qualifications, designation, gender, expertise, telephone, profile_url, appointment_url, hospital_id";

  const [firstResult, hospitalResult] = await Promise.all([
    supabase
      .from("doctors")
      .select(SELECT_FIELDS, { count: "exact", head: false })
      .order("name")
      .range(0, 999),
    supabase
      .from("hospitals")
      .select("id, name, slug"),
  ]);

  let dbRows: any[] = [...(firstResult.data || [])];
  const total = firstResult.count || 0;

  if (total > 1000) {
    const pages = Math.ceil(total / 1000);
    for (let i = 1; i < pages; i++) {
      const off = i * 1000;
      const page = await supabase
        .from("doctors")
        .select(SELECT_FIELDS)
        .order("name")
        .range(off, off + 999);
      dbRows = dbRows.concat(page.data || []);
    }
  }

  let doctors: Doctor[];

  if (dbRows.length > 0) {
    const hospitalMap = new Map(
      (hospitalResult.data || []).map((h) => [h.id, h])
    );
    doctors = dbRows.map((doc: any) => {
      const h = hospitalMap.get(doc.hospital_id);
      return {
        name: doc.name,
        slug: doc.slug,
        specialty: doc.specialties?.[0] || "",
        allSpecialties: doc.specialties || [],
        hospital: h?.name || "",
        hospitalSlug: h?.slug || "",
        designation: doc.designation || "",
        qualifications: doc.qualifications || "",
        photo_url: doc.photo_url,
        profileUrl: doc.profile_url,
        appointmentUrl: doc.appointment_url,
        gender: doc.gender || "",
        expertise: doc.expertise || [],
        telephone: doc.telephone || "",
      };
    });
  } else {
    doctors = allDoctors;
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://medsolutionhealthcare.com" },
        { name: "Doctors", url: "https://medsolutionhealthcare.com/doctors" },
      ])} />
      <BreadcrumbNav items={[
        { label: "Home", href: "/" },
        { label: "Doctors", href: "/doctors" },
      ]} />
      <PageHero
        eyebrow="Our Experts"
        title="Find Your Specialist"
        description={`${allDoctors.length}+ top doctors from India's leading hospitals — filter by specialty, hospital, or gender to find the right expert for you.`}
       />

      <Suspense fallback={
        <div className="container-cinematic py-20 text-center text-shade-50">
          Loading doctors...
        </div>
      }>
        <DoctorsClient doctors={doctors} />
      </Suspense>
    </>
  );
}
