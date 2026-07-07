"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Eye,
  Syringe,
  Stethoscope,
  Microscope,
  Activity,
  Pill,
} from "lucide-react";

const specialties = [
  { name: "Cardiology", icon: Heart, slug: "cardiology", color: "bg-gold/10 text-gold" },
  { name: "Neurology", icon: Brain, slug: "neurology", color: "bg-accent/10 text-accent" },
  { name: "Orthopaedics", icon: Bone, slug: "orthopedics", color: "bg-primary/10 text-primary" },
  { name: "Oncology", icon: Microscope, slug: "oncology", color: "bg-primary/10 text-primary" },
  { name: "IVF & Fertility", icon: Baby, slug: "ivf-treatment", color: "bg-gold/10 text-gold" },
  { name: "Ophthalmology", icon: Eye, slug: "ophthalmology", color: "bg-accent/10 text-accent" },
  { name: "Transplant", icon: Activity, slug: "transplant", color: "bg-accent/10 text-accent" },
  { name: "Gastroenterology", icon: Pill, slug: "gastroenterology", color: "bg-primary/10 text-primary" },
  { name: "Nephrology", icon: Syringe, slug: "nephrology", color: "bg-primary/10 text-primary" },
  { name: "General Medicine", icon: Stethoscope, slug: "general-medicine", color: "bg-accent/10 text-accent" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function TopSpecialties() {
  return (
    <section className="bg-white py-12 sm:py-huge border-b border-hairline-light">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="pill-tag mb-4 inline-block">Specialties</span>
          <h2 className="font-display text-display-md lg:text-display-lg text mt-4">
            Top Medical Specialties
          </h2>
          <p className="text-body-lg text-shade-50 max-w-2xl mx-auto mt-4">
            India offers world-class treatment across all major medical specialties at JCI and NABH accredited hospitals
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          {specialties.map((specialty) => (
            <motion.div key={specialty.slug} variants={itemVariants}>
              <Link
                href={`/speciality/${specialty.slug}`}
                className="group flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl border border-hairline-light bg-white hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl ${specialty.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <specialty.icon size={22} />
                </div>
                  <span className="font-display text-caption sm:text-heading-sm text text-center group-hover:text-shade-60 transition-colors">
                  {specialty.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
