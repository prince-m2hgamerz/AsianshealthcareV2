"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, IndianRupee } from "lucide-react";

interface TreatmentCardProps {
  name: string;
  slug: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  costRange?: string;
}

export default function TreatmentCard({
  name,
  slug,
  category,
  description,
  imageUrl,
  costRange,
}: TreatmentCardProps) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-44 bg-[#f8faf8]">
        {imageUrl && !imgError ? (
          <Image src={imageUrl} alt={name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" onError={() => setImgError(true)} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#e8f5e9] to-[#f8faf8]">
            <span className="text-3xl font-bold text-[#0a7e3d]/30">
              {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
          </div>
        )}
        {category && (
          <span className="absolute top-3 left-3 bg-[#0a7e3d] text-white text-xs font-semibold rounded-md px-2 py-1">
            {category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-[#1a1a2e] mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        )}
        {costRange && (
          <div className="flex items-center gap-1 text-sm text-[#0a7e3d] font-semibold mb-3">
            <IndianRupee size={14} />
            <span>Cost: {costRange}</span>
          </div>
        )}
        <Link
          href={`/treatment-package/${slug}`}
          className="inline-flex items-center gap-1 text-[#0a7e3d] text-sm font-semibold hover:underline"
        >
          Learn More <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
