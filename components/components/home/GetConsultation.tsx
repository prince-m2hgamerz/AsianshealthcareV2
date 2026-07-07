"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function GetConsultation() {
  const { whatsapp_number, contact_phone } = useSiteSettings();
  return (
    <section className="relative bg-surface py-12 sm:py-20 overflow-hidden">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-heading-xl sm:text-display-md lg:text-display-lg text-accent">
            Get a Free Medical Opinion Within 24 Hours
          </h2>
          <p className="text-body-lg text-shade-50 mt-4 max-w-2xl mx-auto">
            Share your medical reports and our specialist team will provide you with a detailed treatment plan,
            cost estimation, and doctor recommendations — completely free of charge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link
              href="/contact-us"
              className="btn-accent flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center"
            >
              Get Free Consultation
              <ArrowRight size={18} />
            </Link>
            <a
              href={`https://api.whatsapp.com/send?phone=${whatsapp_number}&text=Hello%2C+I+need+medical+assistance`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-hairline-light text-shade-60 hover:bg-white transition-all text-base font-medium w-full sm:w-auto justify-center"
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-shade-60">
            <a href={`tel:${contact_phone}`} className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors">
              <Phone size={16} />
              <span className="text-body-md">{contact_phone}</span>
            </a>
            <span className="hidden sm:inline text-shade-60">|</span>
            <p className="text-body-md">Available 24/7 for International Patients</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
