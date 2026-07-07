"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import Image from "next/image";
import HorizontalSlider from "@/components/shared/HorizontalSlider";

interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  hospital: string;
  rating: number;
  slug: string;
  photo_url?: string;
}

export default function FeaturedDoctors({ doctors = [] }: { doctors?: Doctor[] }) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  if (doctors.length === 0) return null;
  return (
    <section className="bg-white py-12 sm:py-huge">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="pill-tag mb-4 inline-block">Our Experts</span>
            <h2 className="font-display text-display-md lg:text-display-lg text mt-4">Featured Doctors</h2>
            <p className="text-body-lg text-shade-50 max-w-xl mt-4">World-renowned specialists ready to provide you with the best care.</p>
          </div>
          <Link href="/doctors" className="btn-outline flex items-center gap-2 shrink-0 self-start lg:self-auto">
            View All Doctors <ArrowRight size={18} />
          </Link>
        </motion.div>

        <HorizontalSlider>
          {doctors.map((doctor) => (
            <Link key={doctor.slug} href={`/doctors/${doctor.slug}`} className="group block bg-white rounded-xl p-6 border border-hairline-light hover:shadow-elevation-3 transition-all duration-300">
                <div className="relative w-28 h-28 sm:w-24 sm:h-24 rounded-full mx-auto mb-5 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
                {!failedImages.has(doctor.slug) && <Image
                  src={doctor.photo_url || "/images/placeholder.svg"}
                  alt={doctor.name}
                  fill
                  sizes="96px"
                  className="object-cover object-top"
                  onError={() => setFailedImages(prev => new Set(prev).add(doctor.slug))}
                />}
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <BadgeCheck size={14} className="text-accent" />
                  <span className="text-xs font-medium text-accent">Verified Specialist</span>
                </div>
                <h3 className="font-display text-heading-md text group-hover:text-shade-60 transition-colors">{doctor.name}</h3>
                <p className="text-body-md text-shade-50 mt-1">{doctor.specialty}</p>
                <p className="text-caption text-shade-40 mt-2">{doctor.experience} &middot; {doctor.hospital}</p>
              </div>
            </Link>
          ))}
        </HorizontalSlider>
      </div>
    </section>
  );
}
