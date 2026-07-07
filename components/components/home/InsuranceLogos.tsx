"use client";

import { motion } from "framer-motion";

export default function InsuranceLogos({ insurances = defaultInsurances }: { insurances?: string[] }) {
  const items = insurances.length > 0 ? insurances : defaultInsurances;

  return (
    <section className="bg-surface py-16">
      <div className="container-cinematic">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-eyebrow-cap uppercase tracking-widest text-shade-40 mb-8"
        >
          Accepted International Insurance Partners
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, staggerChildren: 0.05 }}
          className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-4 sm:gap-y-6"
        >
          {items.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="text-heading-sm font-display text-shade-40 hover:text transition-colors cursor-default px-3 py-1.5 border border-hairline-light rounded-lg hover:border-primary/10"
            >
              {name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const defaultInsurances = [
  "AAR Insurance Africa",
  "Allianz Care",
  "Baping National Insurance",
  "Britam Health Insurance",
  "Bupa Global",
  "Cigna Global",
  "Heritage Insurance",
  "Jubilee Insurance",
  "Kenyan Alliance Insurance",
  "Minet Insurance Kenya",
  "SHA Kenya",
  "UAP Old Mutual Insurance",
  "AXA Health",
];
