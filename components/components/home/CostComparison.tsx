"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BadgeDollarSign, CheckCircle2, TrendingDown } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const comparisons = [
  { treatment: "Knee Replacement", india: "$6,500 - $8,500", abroad: "$45,000+", saving: "Up to 80%" },
  { treatment: "Heart Bypass", india: "$7,000 - $10,000", abroad: "$100,000+", saving: "Up to 90%" },
  { treatment: "IVF Cycle", india: "$3,000 - $6,000", abroad: "$18,000+", saving: "Up to 70%" },
  { treatment: "Spine Surgery", india: "$8,000 - $12,000", abroad: "$65,000+", saving: "Up to 82%" },
];

interface CostComparisonProps {
  imageUrl?: string;
}

export default function CostComparison({ imageUrl }: CostComparisonProps) {
  const { site_name } = useSiteSettings();

  const included = [
    "Hospital estimate and doctor fee visibility",
    "Expected stay and recovery planning",
    `No ${site_name} service fee for patients`,
    "Direct payment to hospital at agreed pricing",
  ];

  return (
    <section className="bg-white py-12 sm:py-huge">
      <div className="container-cinematic">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="pill-tag mb-4 inline-block">Transparent Pricing</span>
            <h2 className="font-display text-display-md lg:text-display-lg text">
              Compare costs before you choose a hospital
            </h2>
            <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-shade-50">
              Compare India estimates before you travel. You pay hospitals directly at the agreed treatment cost.
            </p>
            <div className="mt-8 space-y-3">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3 text-body-md text-shade-50">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/treatment-package" className="btn-primary mt-8 inline-flex gap-2">
              Explore Treatment Costs
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-lg border border-hairline-light bg-surface"
          >
            {imageUrl && (
              <div className="relative h-56 border-b border-hairline-light">
                <Image src={imageUrl} alt="Hospital care and treatment planning" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            )}
              <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-0 border-b border-hairline-light bg-white px-4 py-3 text-caption uppercase tracking-wider text-shade-40 sm:grid">
              <span>Treatment</span>
              <span>India</span>
              <span>Typical Abroad</span>
              <span>Saving</span>
            </div>
            {comparisons.map((item) => (
              <div
                key={item.treatment}
                className="grid grid-cols-1 gap-3 border-b border-hairline-light px-4 py-4 last:border-0 sm:grid-cols-[1.2fr_1fr_1fr_0.8fr] sm:gap-0"
              >
                <div className="flex items-center gap-2 font-display text-heading-sm text">
                  <BadgeDollarSign size={18} className="text-shade-50" />
                  {item.treatment}
                </div>
                <div className="text-body-md text"><span className="mr-2 text-caption text-shade-40 sm:hidden">India:</span>{item.india}</div>
                <div className="text-body-md text-shade-50 line-through decoration-shade-40"><span className="mr-2 text-caption text-shade-40 no-underline sm:hidden">Typical abroad:</span>{item.abroad}</div>
                <div className="inline-flex w-fit items-center gap-1 rounded-pill bg-accent/20 px-3 py-1 text-caption text-accent">
                  <TrendingDown size={15} />
                  {item.saving}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
