"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import Image from "next/image";
import HorizontalSlider from "@/components/shared/HorizontalSlider";

interface Hospital {
  name: string;
  location: string;
  beds: string;
  accreditation: string;
  slug: string;
  photo_url?: string;
}

export default function FeaturedHospitals({ hospitals = [] }: { hospitals?: Hospital[] }) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  if (hospitals.length === 0) return null;
  return (
    <section className="bg-surface py-12 sm:py-huge">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="pill-tag-shade mb-4 inline-block">Top Facilities</span>
            <h2 className="font-display text-display-md lg:text-display-lg text mt-4">Featured Hospitals</h2>
            <p className="text-body-lg text-shade-50 max-w-xl mt-4">India&apos;s most trusted healthcare institutions with international accreditation.</p>
          </div>
          <Link href="/hospitals" className="btn-outline flex items-center gap-2 shrink-0 self-start lg:self-auto">
            View All Hospitals <ArrowRight size={18} />
          </Link>
        </motion.div>

        <HorizontalSlider>
          {hospitals.map((hospital) => (
            <Link key={hospital.slug} href={`/hospitals/${hospital.slug}`} className="group block bg-white rounded-xl border border-hairline-light overflow-hidden hover:shadow-elevation-3 transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                {!failedImages.has(hospital.slug) && <Image
                  src={hospital.photo_url || "/images/placeholder.svg"}
                  alt={hospital.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={() => setFailedImages(prev => new Set(prev).add(hospital.slug))}
                />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="pill-tag !text-micro !px-2 !py-0.5">{hospital.accreditation}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-heading-lg text group-hover:text-shade-60 transition-colors">{hospital.name}</h3>
                <div className="flex items-center gap-1 text-caption text-shade-40 mt-1">
                  <MapPin size={14} /><span>{hospital.location}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-caption text-shade-50">
                  <Building2 size={14} /> <span>{hospital.beds} beds</span>
                </div>
              </div>
            </Link>
          ))}
        </HorizontalSlider>
      </div>
    </section>
  );
}
