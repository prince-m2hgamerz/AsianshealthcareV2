"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, IndianRupee } from "lucide-react";
import HorizontalSlider from "@/components/shared/HorizontalSlider";

const treatmentCosts = [
  {
    name: "Heart Bypass Surgery (CABG)",
    cost: "$7,000 - $10,000",
    saving: "Save up to 90%",
    slug: "heart-bypass-surgery",
    image: "https://images.unsplash.com/photo-1631553096119-003c3d0e0e5a?w=600&q=80",
  },
  {
    name: "Knee Replacement Surgery",
    cost: "$6,500 - $8,500",
    saving: "Save up to 80%",
    slug: "knee-replacement",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80",
  },
  {
    name: "Liver Transplant",
    cost: "$28,000 - $45,000",
    saving: "Save up to 75%",
    slug: "liver-transplant",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80",
  },
  {
    name: "Bone Marrow Transplant",
    cost: "$18,000 - $35,000",
    saving: "Save up to 85%",
    slug: "bone-marrow-transplant",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&q=80",
  },
  {
    name: "Spine Surgery",
    cost: "$8,000 - $12,000",
    saving: "Save up to 82%",
    slug: "spine-surgery",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80",
  },
  {
    name: "IVF Treatment",
    cost: "$3,000 - $6,000",
    saving: "Save up to 70%",
    slug: "ivf-treatment",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80",
  },
  {
    name: "Brain Tumor Surgery",
    cost: "$6,500 - $10,000",
    saving: "Save up to 85%",
    slug: "craniotomy-brain-tumor-surgery",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80",
  },
  {
    name: "Cardiac Surgery (Pediatric)",
    cost: "$7,500 - $12,000",
    saving: "Save up to 88%",
    slug: "heart-bypass-surgery",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
  },
];

export default function TreatmentCostShowcase() {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  return (
    <section className="bg-surface py-12 sm:py-huge overflow-hidden">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="pill-tag mb-4 inline-block">Treatment Costs</span>
            <h2 className="font-display text-display-md lg:text-display-lg text mt-4">
              All Prices Are Negotiable
            </h2>
            <p className="text-body-lg text-shade-50 max-w-xl mt-4">
              Get exact cost estimates for your specific condition. Prices shown are indicative ranges — actual cost depends on complexity and hospital.
            </p>
          </div>
          <Link href="/treatment-package" className="btn-outline flex items-center gap-2 shrink-0 self-start lg:self-auto">
            View All Costs <ArrowRight size={18} />
          </Link>
        </motion.div>

        <HorizontalSlider>
          {treatmentCosts.map((treatment, i) => (
            <Link
              key={treatment.slug + i}
              href={`/treatment-package/${treatment.slug}`}
              className="group block bg-white rounded-xl border border-hairline-light overflow-hidden hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                {!failedImages.has(treatment.slug + i) && <Image
                  src={treatment.image}
                  alt={treatment.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={() => setFailedImages(prev => new Set(prev).add(treatment.slug + i))}
                />}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {treatment.saving}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-heading-sm text group-hover:text-shade-60 transition-colors line-clamp-2 min-h-[2.5rem]">
                  {treatment.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-3">
                  <IndianRupee size={16} className="text-shade-50" />
                  <span className="font-display text-heading-md text">{treatment.cost}</span>
                </div>
                <p className="text-micro text-shade-40 mt-1">In India (indicative)</p>
              </div>
            </Link>
          ))}
        </HorizontalSlider>
      </div>
    </section>
  );
}
