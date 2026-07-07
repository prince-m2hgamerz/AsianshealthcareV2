"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Building2, Stethoscope, Search } from "lucide-react";

const PER_PAGE = 24;

interface DoctorItem {
  name: string;
  specialty: string;
  experience: string | number;
  hospital: string;
  rating: number;
  slug: string;
  photo_url: string | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function DoctorsGrid({ doctors }: { doctors: DoctorItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);

  const visibleDoctors = doctors.slice(0, visibleCount);
  const hasMore = visibleCount < doctors.length;

  if (doctors.length === 0) {
    return (
      <div className="text-center border border-hairline-light rounded-xl p-8 sm:p-12 bg-canvas-cream">
        <Search size={48} className="mx-auto mb-4 text-shade-30" />
        <h2 className="font-display text-heading-md sm:text-heading-lg text-ink">No doctors found</h2>
        <p className="text-body-md text-shade-50 mt-2 max-w-md mx-auto">Try a different specialty, doctor name, or hospital.</p>
        <Link href="/doctors" className="btn-primary mt-6 inline-flex items-center gap-2">
          Clear Search
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {visibleDoctors.map((doctor) => (
          <Link
            key={doctor.slug}
            href={`/doctors/${doctor.slug}`}
            className="group bg-canvas-light rounded-xl border border-hairline-light overflow-hidden hover:shadow-elevation-3 transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-aloe-10 to-pistachio-10">
              {doctor.photo_url ? (
                <Image
                  src={doctor.photo_url}
                  alt={doctor.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-aloe-10 to-pistachio-10">
                  <span className="text-4xl sm:text-5xl font-bold text-aloe-30/50 select-none">
                    {getInitials(doctor.name)}
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-medium text-aloe-40 shadow-sm">
                  <BadgeCheck size={11} />
                  Verified
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-medium text-ink shadow-sm truncate">
                  <Building2 size={11} className="text-shade-40 shrink-0" />
                  <span className="truncate">{doctor.hospital}</span>
                </span>
              </div>
            </div>
            <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
              <div>
                <h2 className="font-display text-sm sm:text-base text-ink group-hover:text-shade-60 transition-colors line-clamp-1 font-semibold">
                  {doctor.name}
                </h2>
                <p className="text-xs sm:text-sm text-shade-50 mt-0.5 line-clamp-1 flex items-center gap-1">
                  <Stethoscope size={12} className="shrink-0 text-shade-40" />
                  {doctor.specialty}
                </p>
              </div>
              <div className="mt-auto pt-1.5">
                <span className="block w-full text-center text-xs sm:text-sm font-medium text-on-primary bg-aloe-40 hover:bg-aloe-50 rounded-lg px-3 py-2.5 sm:py-3 transition-colors">
                  Book Appointment
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-10 sm:mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + PER_PAGE)}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3"
          >
            Load More ({doctors.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </>
  );
}
