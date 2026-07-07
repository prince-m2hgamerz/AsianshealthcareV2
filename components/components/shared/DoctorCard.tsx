"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Building2, Calendar } from "lucide-react";

interface DoctorCardProps {
  name: string;
  slug: string;
  specialization: string;
  experience: number;
  hospital: string;
  rating: number;
  reviewCount?: number;
  imageUrl?: string;
}

export default function DoctorCard({
  name,
  slug,
  specialization,
  experience,
  hospital,
  rating,
  reviewCount,
  imageUrl,
}: DoctorCardProps) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-52 bg-[#f8faf8]">
        {imageUrl && !imgError ? (
          <Image src={imageUrl} alt={name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-20 h-20 bg-[#e8f5e9] rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-[#0a7e3d]">
                {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#1a1a2e] mb-1">
          {name}
        </h3>
        <p className="text-sm text-[#0a7e3d] font-medium mb-2">{specialization}</p>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1.5">
          <Calendar size={14} />
          <span>{experience} years experience</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <Building2 size={14} />
          <span>{hospital}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <BadgeCheck size={16} className="text-[#0a7e3d]" />
            <span className="text-xs font-semibold text-[#0a7e3d]">Verified Specialist</span>
          </div>
        </div>

        <Link
          href={`/doctors/${slug}`}
          className="block w-full text-center bg-[#0a7e3d] text-white rounded-md px-4 py-3 text-sm font-semibold hover:bg-[#086b33] transition-colors"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
