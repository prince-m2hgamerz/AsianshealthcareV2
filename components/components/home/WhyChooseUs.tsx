"use client";

import { motion } from "framer-motion";
import { Stethoscope, Building2, BadgeCheck, Globe, HeartHandshake, DollarSign, Clock, MessageSquareText } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const features = [
  { icon: Clock, title: "24-Hour Opinion", description: "Share reports and get a specialist opinion with cost estimate." },
  { icon: MessageSquareText, title: "3 Care Options", description: "Compare relevant doctors and hospitals before deciding." },
  { icon: DollarSign, title: "Direct Hospital Pricing", description: "Transparent estimates with no extra service fee." },
  { icon: Globe, title: "Visa and Travel Help", description: "Invitation letter, pickup, hotel, SIM, and local support." },
  { icon: Building2, title: "Accredited Hospitals", description: "NABH and JCI hospital options across major Indian cities." },
  { icon: HeartHandshake, title: "Case Manager", description: "One coordinator from first inquiry to discharge." },
  { icon: BadgeCheck, title: "Interpreter Support", description: "Clear communication during admission and consultation." },
  { icon: Stethoscope, title: "Follow-Up", description: "Remote guidance after you return home." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function WhyChooseUs() {
  const { site_name } = useSiteSettings();
  return (
    <section className="bg-surface py-12 sm:py-huge">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="pill-tag mb-4 inline-block">Why Choose Us</span>
          <h2 className="font-display text-display-md lg:text-display-lg text mt-4">
            Why Patients Choose {site_name}
          </h2>
          <p className="text-body-lg text-shade-50 max-w-2xl mx-auto mt-4">
            Practical support for overseas patients seeking treatment in India.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants} className="bg-white rounded-xl p-6 border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <feature.icon size={22} className="text" />
              </div>
              <h3 className="font-display text-heading-sm text mb-2">{feature.title}</h3>
              <p className="text-body-md text-shade-50 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
