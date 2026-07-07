"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Building2, Award } from "lucide-react";

interface HospitalCardProps {
  name: string;
  slug: string;
  location: string;
  imageUrl?: string;
  accreditation?: string[];
  bedCount?: number;
  description?: string;
}

export default function HospitalCard({
  name,
  slug,
  location,
  imageUrl,
  accreditation,
  bedCount,
  description,
}: HospitalCardProps) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-[#f8faf8]">
        {imageUrl && !imgError ? (
          <Image src={imageUrl} alt={name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Building2 size={48} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#1a1a2e] mb-1">{name}</h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <MapPin size={14} className="text-[#0a7e3d]" />
          <span>{location}</span>
        </div>

        {description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {accreditation?.map((acc) => (
            <span
              key={acc}
              className="inline-flex items-center gap-1 bg-[#e8f5e9] text-[#0a7e3d] text-xs font-medium rounded-md px-2 py-1"
            >
              <Award size={12} />
              {acc}
            </span>
          ))}
        </div>

        {bedCount && (
          <p className="text-sm text-gray-500 mb-3">
            <span className="font-semibold text-[#1a1a2e]">{bedCount}+</span> beds
          </p>
        )}

        <Link
          href={`/hospitals/${slug}`}
          className="inline-block text-[#0a7e3d] text-sm font-semibold hover:underline"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}
