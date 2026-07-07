"use client";

import { motion } from "framer-motion";
import { Globe, Heart, Stethoscope } from "lucide-react";

const items = [
  { icon: Globe, text: "Nigeria" },
  { icon: Globe, text: "Kenya" },
  { icon: Globe, text: "Ethiopia" },
  { icon: Globe, text: "Tanzania" },
  { icon: Globe, text: "Uganda" },
  { icon: Globe, text: "Ghana" },
  { icon: Globe, text: "Sudan" },
  { icon: Globe, text: "Iraq" },
  { icon: Globe, text: "Yemen" },
  { icon: Globe, text: "Uzbekistan" },
  { icon: Globe, text: "Bangladesh" },
  { icon: Globe, text: "Afghanistan" },
  { icon: Heart, text: "Cardiology" },
  { icon: Stethoscope, text: "Oncology" },
  { icon: Heart, text: "Orthopaedics" },
  { icon: Stethoscope, text: "Neurology" },
  { icon: Heart, text: "Liver Transplant" },
  { icon: Stethoscope, text: "IVF" },
  { icon: Heart, text: "Spine Surgery" },
  { icon: Stethoscope, text: "Bone Marrow Transplant" },
];

export default function CountriesTicker() {
  return (
    <section className="bg-surface border-b border-hairline-light overflow-hidden py-3">
      <div className="relative flex">
        <motion.div
          className="flex items-center gap-8 whitespace-nowrap"
          animate={{ x: [0, -2400] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" } }}
        >
          {[...items, ...items].map((item, i) => (
            <div key={i} className="inline-flex items-center gap-2 text-shade-40 text-sm">
              <item.icon size={14} className="text-accent" />
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
