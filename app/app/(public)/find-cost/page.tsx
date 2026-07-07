"use client";

import { useState } from "react";
import { Search, Stethoscope } from "lucide-react";
import Image from "next/image";

const packages = [
  { name: "Liver Resection Surgery Cost in India", cost: "10000 USD", specialty: "HPB Surgery & Liver Transplantation" },
  { name: "Artificial Urinary Sphincter (AUS) Implantation Cost in India", cost: "12500 USD", specialty: "Top Urologist & Kidney Transplantation" },
  { name: "Endoscopic Thoracic Sympathectomy Surgery in India", cost: "USD 3000 - USD 3500", specialty: "Best Thoracic, Lung & chest Surgeon" },
  { name: "Bidirectional Glenn Surgery Cost in India", cost: "USD 5500 - USD 6000", specialty: "Top Paediatric Cardiac Surgeon" },
  { name: "Congenital Diaphragmatic Hernia Repair Surgery in India", cost: "USD 6000 - USD 7000", specialty: "Paediatric Surgery" },
  { name: "Robotic-Assisted CABG Package in India", cost: "USD 7500", specialty: "Top Interventional Cardiologist" },
  { name: "laryngectomy surgery cost in India", cost: "USD 4000-USD 5000", specialty: "Best Cancer Doctor & Surgeon in India" },
  { name: "Kidney Transplant Surgery Package in India", cost: "USD 13000", specialty: "Kidney Transplant" },
  { name: "Heart Bypass Surgery (CABG) Cost in India", cost: "USD 7000", specialty: "Cardiac Surgery" },
  { name: "Knee Replacement Surgery Cost in India", cost: "USD 5500", specialty: "Orthopedics" },
  { name: "Hip Replacement Surgery Cost in India", cost: "USD 6500", specialty: "Orthopedics" },
  { name: "Spine Surgery Cost in India", cost: "USD 7500", specialty: "Spine Surgery" },
  { name: "Hair Transplant Cost in India", cost: "USD 1500", specialty: "Cosmetology" },
  { name: "IVF Treatment Cost in India", cost: "USD 3500", specialty: "IVF & Reproductive Medicine" },
  { name: "Liver Transplant Cost in India", cost: "USD 25000", specialty: "Liver Transplant" },
  { name: "Cancer Treatment Cost in India", cost: "USD 8000", specialty: "Oncology" },
];

export default function FindCostPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPackages = searchQuery.trim()
    ? packages.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : packages;

  return (
    <>
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image src="/images/ttm-pagetitle-bg.jpg" alt="" fill sizes="100vw" priority className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-24 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Find Cost</h1>
        </div>
      </section>

      <section className="bg-navy py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto flex gap-0">
            <input
              type="text"
              placeholder="Search for a treatment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 rounded-l-md px-5 py-3.5 text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal"
            />
            <button className="bg-teal text-white px-6 py-3.5 rounded-r-md flex items-center gap-2 font-semibold text-sm hover:bg-teal/90 transition">
              <Search size={18} /> Search
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((p, i) => (
              <div key={i} className="bg-white border border-border rounded-lg shadow-card hover:shadow-card-hover transition p-6 flex flex-col">
                <h3 className="font-semibold text-base text-ink leading-snug mb-3">{p.name}</h3>
                <p className="text-xl font-bold text-teal mb-3">{p.cost}</p>
                <p className="text-sm text-ink-light leading-relaxed mt-auto">
                  <Stethoscope size={14} className="inline mr-1.5 text-gold" />{p.specialty}
                </p>
              </div>
            ))}
          </div>

          {filteredPackages.length === 0 && (
            <p className="text-center text-ink-light py-12">No packages found. Try a different search term.</p>
          )}
        </div>
      </section>
    </>
  );
}
