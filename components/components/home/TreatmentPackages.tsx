"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HorizontalSlider from "@/components/shared/HorizontalSlider";

interface Treatment {
  name: string;
  costMin: number;
  costMax: number;
  usCost: number;
  slug: string;
  category?: string;
  image_url?: string | null;
}

const treatmentImages: Record<string, string> = {
  "knee-replacement": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80",
  "hip-replacement": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80",
  "spine-surgery": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80",
  "heart-bypass-surgery": "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600&q=80",
  "angioplasty": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80",
  "bone-marrow-transplant": "https://images.unsplash.com/photo-1559757175-7cb057faba93?w=600&q=80",
  "liver-transplant": "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80",
  "kidney-transplant": "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&q=80",
  "ivf-treatment": "https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?w=600&q=80",
  "hair-transplant": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80",
  "bariatric-surgery": "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80",
  "dental-implants": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
};

const categoryImages: Record<string, string> = {
  "orthopedics": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80",
  "cardiology": "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600&q=80",
  "neurology": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80",
  "oncology": "https://images.unsplash.com/photo-1559757175-7cb057faba93?w=600&q=80",
  "fertility": "https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?w=600&q=80",
  "cosmetic": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80",
  "gastroenterology": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  "transplant": "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&q=80",
  "dental": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  "general": "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80",
};

const defaultImage = "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80";

function getImage(treatment: Treatment): string {
  // First priority: image_url from database
  if (treatment.image_url) return treatment.image_url;
  // Second: lookup by slug
  if (treatmentImages[treatment.slug]) return treatmentImages[treatment.slug];
  // Third: lookup by category
  if (treatment.category && categoryImages[treatment.category.toLowerCase()]) {
    return categoryImages[treatment.category.toLowerCase()];
  }
  // Fallback
  return defaultImage;
}

export default function TreatmentPackages({
  treatments = [],
}: {
  treatments?: Treatment[];
  images?: Record<string, string>;
}) {
  if (treatments.length === 0) return null;
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
            <span className="pill-tag mb-4 inline-block">Affordable Care</span>
            <h2 className="font-display text-display-md lg:text-display-lg text mt-4">Treatment Packages</h2>
            <p className="text-body-lg text-shade-50 max-w-xl mt-4">Save 60-80% on medical treatments in India compared to US and UK costs.</p>
          </div>
          <Link href="/treatment-package" className="btn-outline flex items-center gap-2 shrink-0 self-start lg:self-auto">
            View All Packages <ArrowRight size={18} />
          </Link>
        </motion.div>

        <HorizontalSlider>
          {treatments.map((t) => (
            <Link key={t.slug} href={`/treatment-package/${t.slug}`} className="group block overflow-hidden bg-surface rounded-xl border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-40">
                <Image
                  src={getImage(t)}
                  alt={t.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-heading-lg text group-hover:text-shade-60 transition-colors">{t.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-display-md text">${t.costMin.toLocaleString()}</span>
                  <span className="text-body-md text-shade-40">- ${t.costMax.toLocaleString()}</span>
                </div>
                <p className="text-caption text-shade-40 mt-1">In India</p>
                <div className="mt-3 pt-3 border-t border-hairline-light">
                  <p className="text-caption text-shade-50">Comparable cost in US: <span className="text-shade-60 line-through">${t.usCost.toLocaleString()}</span></p>
                </div>
              </div>
            </Link>
          ))}
        </HorizontalSlider>
      </div>
    </section>
  );
}
