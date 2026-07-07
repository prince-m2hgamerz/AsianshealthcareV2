"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Building2, DollarSign, Hotel, Search, Stethoscope } from "lucide-react";
import Image from "next/image";

const tabs = [
  { id: "cost", label: "Find Cost", icon: DollarSign, placeholder: "Search treatments, doctors, hospitals..." },
  { id: "doctor", label: "Find Doctor", icon: Stethoscope, placeholder: "Search treatments, doctors, hospitals..." },
  { id: "hospital", label: "Find Hospital", icon: Building2, placeholder: "Search treatments, doctors, hospitals..." },
  { id: "hotel", label: "Find Hotel", icon: Hotel, placeholder: "Search treatments, doctors, hospitals..." },
];

const tabLinks: Record<string, string> = {
  cost: "/search",
  doctor: "/search",
  hospital: "/search",
  hotel: "/search",
};

interface HeroSectionProps {
  imageUrl?: string;
}

export default function HeroSection({ imageUrl = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=75" }: HeroSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("cost");
  const [searchQuery, setSearchQuery] = useState("");
  const [heroError, setHeroError] = useState(false);
  const activeConfig = tabs.find((t) => t.id === activeTab) || tabs[0];
  const searchHref = (() => {
    const trimmed = searchQuery.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    const query = params.toString();
    return `${tabLinks[activeTab]}${query ? `?${query}` : ""}`;
  })();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(searchHref);
  };

  return (
    <section className="relative text-white overflow-hidden min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        {!heroError && (
          <Image
            src={imageUrl}
            alt="World-class hospitals in India for medical tourism"
            fill
            sizes="100vw"
            className="object-cover scale-105 blur-[2px]"
            priority
            onError={() => setHeroError(true)}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/55 to-black/65" />
      <div className="container-cinematic relative z-10 py-12 sm:py-20 lg:py-32 w-full">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="pill-tag mb-6 inline-block text-[9px] sm:text-eyebrow"
          >
            Trusted Medical Tourism Company in India
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display text-[32px] leading-[1.05] sm:text-[44px] sm:leading-[0.98] lg:text-display-xxl tracking-wide mb-4 sm:mb-6 text-white/90"
          >
            World-Class Treatment
            <br />
            <span className="text-accent">At Affordable Cost</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-body-md sm:text-body-lg text-white/70 max-w-2xl mb-4 sm:mb-6 leading-relaxed"
          >
            Get free medical opinion within 24 hours. We assist with doctor selection, cost estimation,
            visa invitation, airport pickup, hospital admission, and post-treatment follow-up.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-10"
          >
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white/60 border border-white/10">
              <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              No Service Fee
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white/60 border border-white/10">
              <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              JCI &amp; NABH Hospitals
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white/60 border border-white/10">
              <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              24/7 Patient Support
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white/60 border border-white/10">
              <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              Save 60-80% vs US
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex overflow-x-auto gap-1 mb-0.5 scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={activeTab === tab.id}
                    onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
                    className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm rounded-t-lg transition-all shrink-0 ${
                      activeTab === tab.id
                        ? "bg-white/10 text-on-primary border-b-2 border-accent/50"
                        : "text-white/60 hover:text-on-primary hover:bg-white/5"
                    }`}
                  >
                    <Icon size={14} className="sm:size-[16px]" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-lg rounded-tl-none p-3 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                <input
                  type="text"
                  aria-label={activeConfig.placeholder}
                  placeholder={activeConfig.placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg pl-10 pr-4 py-3 text-body-md placeholder:text-white/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                />
              </div>
              <button
                type="submit"
                className="btn-accent whitespace-nowrap flex items-center gap-2 justify-center"
              >
                Search
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap gap-6 sm:gap-8 md:gap-12 text-sm mt-6 sm:mt-10"
          >
            <div>
              <span className="font-display text-heading-xl lg:text-display-md text-accent">500+</span>
              <p className="text-caption text-white/60">International Patients</p>
            </div>
            <div>
              <span className="font-display text-heading-xl lg:text-display-md text-accent">130+</span>
              <p className="text-caption text-white/60">Hospital Partners</p>
            </div>
            <div>
              <span className="font-display text-heading-xl lg:text-display-md text-accent">30+</span>
              <p className="text-caption text-white/60">Countries</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
