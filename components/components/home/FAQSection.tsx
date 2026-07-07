"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { site_name } = useSiteSettings();

  const faqs = [
    { q: "Why choose India for medical treatment?", a: "India offers accredited hospitals, experienced specialists, advanced technology, and significantly lower treatment costs than many Western countries." },
    { q: `How does ${site_name} work?`, a: "Share your reports, receive opinion and cost guidance, choose a doctor or hospital, then get support for visa invitation, arrival, stay, admission, interpreter help, and follow-up." },
    { q: `Is ${site_name}'s service free?`, a: `Yes. Patients pay the hospital directly. ${site_name} does not add a patient service fee.` },
    { q: "How do I get a medical visa for India?", a: "We help coordinate the hospital invitation letter and guide you on the documents usually required for the embassy application." },
    { q: "Which hospitals do you work with?", a: "We coordinate with NABH and JCI accredited hospitals across major Indian cities, including Delhi NCR, Mumbai, Chennai, Bangalore, and other medical hubs." },
    { q: `Will language be a barrier?`, a: `Most hospital teams speak English, and ${site_name} can arrange interpreter support when patients need help during consultations, admission, billing, or discharge.` },
    { q: "How much can I save?", a: "Savings depend on the procedure and hospital, but many patients see treatment estimates that are 60-80% lower than US or UK costs." },
    { q: "What happens after I return home?", a: "We help organize discharge papers, medication guidance, and remote follow-up coordination with the treating team." },
  ];

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
          <span className="pill-tag mb-4 inline-block">FAQs</span>
          <h2 className="font-display text-display-md lg:text-display-lg text mt-4">
            Frequently Asked Questions
          </h2>
          <p className="text-body-lg text-shade-50 max-w-2xl mx-auto mt-4">
            Everything you need to know about medical treatment in India with Med Solution Healthcare.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="bg-white rounded-xl border border-hairline-light overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-surface transition-colors"
              >
                <span className="font-display text-heading-sm text">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-shade-40 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-body-md text-shade-50 px-5 pb-5 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
