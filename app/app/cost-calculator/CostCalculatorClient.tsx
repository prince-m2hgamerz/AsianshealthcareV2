"use client";

import { useState } from "react";
import { DollarSign, TrendingDown, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const countries = [
  { label: "USA", rate: 1, flag: "🇺🇸" },
  { label: "UK", rate: 0.9, flag: "🇬🇧" },
  { label: "Canada", rate: 0.85, flag: "🇨🇦" },
  { label: "Australia", rate: 0.8, flag: "🇦🇺" },
  { label: "UAE", rate: 0.7, flag: "🇦🇪" },
  { label: "Singapore", rate: 0.65, flag: "🇸🇬" },
];

export default function CostCalculatorClient({ treatments }: {
  treatments: { name: string; costIndia: number; costUs: number }[];
}) {
  const [selected, setSelected] = useState(treatments[0]);
  const [country, setCountry] = useState(countries[0]);

  const homeCost = Math.round(selected.costUs * country.rate);
  const savings = homeCost - selected.costIndia;
  const savingsPercent = Math.round((savings / homeCost) * 100);

  return (
    <section className="bg-canvas-light py-12 sm:py-huge">
      <div className="container-cinematic">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

          {/* Left Column: Treatment List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display text-heading-lg sm:text-heading-xl text-ink">Choose Treatment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-none lg:max-h-[520px] lg:overflow-y-auto lg:pr-2">
              {treatments.map((t) => {
                const active = selected.name === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => setSelected(t)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-body-md ${
                      active
                        ? "border-aloe-10 bg-aloe-10/10 text-ink shadow-elevation-2"
                        : "border-hairline-light text-shade-50 hover:border-shade-30 bg-canvas-cream/50 hover:bg-canvas-cream"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={active ? "font-medium" : ""}>{t.name}</span>
                      {active && <Check size={16} className="text-aloe-10 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-3 space-y-5">
            <h2 className="font-display text-heading-lg sm:text-heading-xl text-ink">Your Savings</h2>

            {/* Country Tabs */}
            <div className="flex flex-wrap gap-2">
              {countries.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setCountry(c)}
                  className={`px-4 py-2.5 rounded-pill text-body-md font-medium transition-all duration-200 ${
                    country.label === c.label
                      ? "bg-ink text-on-primary shadow-elevation-2 scale-105"
                      : "bg-shade-20 text-shade-50 hover:bg-shade-30 hover:text-shade-60"
                  }`}
                >
                  {c.flag} {c.label}
                </button>
              ))}
            </div>

            {/* Cost Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-canvas-cream rounded-xl border border-hairline-light p-5 sm:p-6 text-center hover:shadow-elevation-2 transition-shadow">
                <p className="text-caption text-shade-40 mb-1">Cost in {country.label}</p>
                <p className="font-display text-display-sm sm:text-display-md text-shade-50">${homeCost.toLocaleString()}</p>
              </div>
              <div className="bg-canvas-cream rounded-xl border border-hairline-light p-5 sm:p-6 text-center hover:shadow-elevation-2 transition-shadow">
                <p className="text-caption text-shade-40 mb-1">Cost in India</p>
                <p className="font-display text-display-sm sm:text-display-md text-aloe-10">${selected.costIndia.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border-2 border-aloe-10/40 p-5 sm:p-6 text-center bg-gradient-to-br from-aloe-10/10 to-aloe-10/5 hover:shadow-elevation-2 transition-shadow">
                <p className="text-caption text-shade-50 mb-1 font-medium">You Save</p>
                <p className="font-display text-display-sm sm:text-display-md text-ink">${savings.toLocaleString()}</p>
                <p className="text-caption text-aloe-10 font-semibold mt-1 flex items-center justify-center gap-1">
                  <TrendingDown size={16} /> {savingsPercent}% less
                </p>
              </div>
            </div>

            {/* Savings Bar */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.name + country.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative h-14 sm:h-12 bg-canvas-cream rounded-full border border-hairline-light overflow-hidden"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-aloe-10 to-aloe-10/70 rounded-full flex items-center justify-start pl-4 pr-2 transition-all duration-500"
                  style={{ width: `${100 - savingsPercent}%` }}
                >
                  <span className="text-micro font-bold text-ink whitespace-nowrap">
                    India ${selected.costIndia.toLocaleString()}
                  </span>
                </div>
                <div
                  className="absolute inset-y-0 right-0 bg-gradient-to-l from-shade-30/80 to-shade-20 rounded-full flex items-center justify-end pr-4 pl-2 transition-all duration-500"
                  style={{ width: `${savingsPercent}%` }}
                >
                  <span className="text-micro font-bold text-shade-60 whitespace-nowrap">
                    Save ${savings.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`/contact-us?treatment=${encodeURIComponent(selected.name)}`}
                className="btn-primary flex items-center justify-center gap-2 !py-3.5 sm:!py-3"
              >
                <DollarSign size={16} /> Get Free Quote <ArrowRight size={16} />
              </a>
              <a href="/treatment-package" className="btn-outline flex items-center justify-center !py-3.5 sm:!py-3">
                View All Treatments
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
