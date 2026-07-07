"use client";

import { motion } from "framer-motion";
import { Shield, Users, Globe, HeartPulse } from "lucide-react";
import Image from "next/image";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const highlights = [
  { icon: Shield, text: "NABH & JCI Accredited Hospitals" },
  { icon: Users, text: "500+ International Patients Served" },
  { icon: Globe, text: "Patients from 30+ Countries" },
  { icon: HeartPulse, text: "Free Medical Opinion & Cost Estimate" },
];

export default function WhoWeAre() {
  const { site_name } = useSiteSettings();
  return (
    <section className="bg-surface py-12 sm:py-huge overflow-hidden">
      <div className="container-cinematic">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="pill-tag mb-4 inline-block">Who We Are</span>
            <h2 className="font-display text-display-md lg:text-display-lg text mt-4">
              Your Trusted Medical Tourism Partner in India
            </h2>
            <p className="text-body-lg text-shade-50 mt-6 leading-relaxed">
              {site_name} is a medical assistance company that works as a complete medical guide
              for international patients seeking world-class treatment in India. We connect you with
              the right doctors and hospitals for your specific medical needs.
            </p>
            <p className="text-body-md text-shade-50 mt-4 leading-relaxed">
              We are committed to providing seamless healthcare coordination — from your first inquiry
              to post-treatment follow-up. Our team assists with visa processing, hotel accommodation,
              airport transfers, interpreter services, and 24/7 patient support throughout your stay in India.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {highlights.map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <span className="text-body-md text font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elevation-3 aspect-[4/3]">
              <Image
                src="https://safartibbi.com/wp-content/uploads/2022/11/apolo-1.jpg"
                alt="Apollo Hospital New Delhi - JCI Accredited Healthcare in India"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-5 shadow-elevation-3 border border-hairline-light hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <HeartPulse size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-display text-heading-md text">8+ Years</p>
                  <p className="text-caption text-shade-50">Of Medical Excellence</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-elevation-3 border border-hairline-light hidden lg:block">
              <p className="font-display text-heading-lg text">500+</p>
              <p className="text-caption text-shade-50">Procedures Available</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
