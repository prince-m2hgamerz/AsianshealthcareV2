"use client";

import { useState } from "react";
import { Search, Stethoscope, DollarSign, TrendingDown } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import Link from "next/link";

const packages = [
  { name: "Liver Resection Surgery Cost in India", cost: "$10,000 USD", specialty: "HPB Surgery & Liver Transplantation", savings: "80%" },
  { name: "Artificial Urinary Sphincter Implantation", cost: "$12,500 USD", specialty: "Urology & Kidney Transplantation", savings: "75%" },
  { name: "Endoscopic Thoracic Sympathectomy Surgery", cost: "$3,000 - $3,500", specialty: "Thoracic & Chest Surgery", savings: "85%" },
  { name: "Bidirectional Glenn Surgery", cost: "$5,500 - $6,000", specialty: "Paediatric Cardiac Surgery", savings: "80%" },
  { name: "Congenital Diaphragmatic Hernia Repair", cost: "$6,000 - $7,000", specialty: "Paediatric Surgery", savings: "78%" },
  { name: "Robotic-Assisted CABG Package", cost: "$7,500", specialty: "Interventional Cardiology", savings: "75%" },
  { name: "Laryngectomy Surgery", cost: "$4,000 - $5,000", specialty: "Cancer Surgery", savings: "82%" },
  { name: "Kidney Transplant Surgery Package", cost: "$13,000", specialty: "Kidney Transplant", savings: "70%" },
  { name: "Heart Bypass Surgery (CABG)", cost: "$7,000", specialty: "Cardiac Surgery", savings: "80%" },
  { name: "Knee Replacement Surgery", cost: "$5,500", specialty: "Orthopedics", savings: "80%" },
  { name: "Hip Replacement Surgery", cost: "$6,500", specialty: "Orthopedics", savings: "78%" },
  { name: "Spine Surgery", cost: "$7,500", specialty: "Spine Surgery", savings: "75%" },
  { name: "Hair Transplant", cost: "$1,500", specialty: "Cosmetology", savings: "85%" },
  { name: "IVF Treatment", cost: "$3,500", specialty: "IVF & Reproductive Medicine", savings: "75%" },
  { name: "Liver Transplant", cost: "$25,000", specialty: "Liver Transplant", savings: "65%" },
  { name: "Cancer Treatment", cost: "$8,000", specialty: "Oncology", savings: "80%" },
];

export default function FindCostPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPackages = searchQuery.trim()
    ? packages.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : packages;

  return (
    <>
      <BreadcrumbNav items={[
        { label: "Home", href: "/" },
        { label: "Find Cost", href: "/find-cost" },
      ]} />
      <PageHero
        eyebrow="Cost Guide"
        title="Treatment Costs in India"
        description="Compare treatment costs and discover how much you can save by choosing India for your medical care."
      />

      <section className="bg-surface py-10 border-b border-hairline-light">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: DollarSign, value: "60-85%", label: "Average Savings vs. US" },
              { icon: TrendingDown, value: "218+", label: "Treatment Packages" },
              { icon: Stethoscope, value: "30+", label: "Medical Specialties" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 rounded-lg border border-hairline-light bg-surface p-5">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <stat.icon size={24} className="text-accent" />
                </div>
                <div>
                  <div className="font-display text-heading-lg text-text">{stat.value}</div>
                  <p className="text-body-sm text-shade-50">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-8 border-b border-hairline-light">
        <div className="container-cinematic">
          <div className="max-w-2xl mx-auto flex gap-0">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-shade-40" />
              <input
                type="text"
                placeholder="Search for a treatment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-hairline-light rounded-l-lg pl-10 pr-4 py-3.5 text-body-sm text-text placeholder:text-shade-40 focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"
              />
            </div>
            <button className="bg-accent text-white px-6 py-3.5 rounded-r-lg flex items-center gap-2 font-semibold text-body-sm hover:bg-accent/90 transition">
              <Search size={18} /> Search
            </button>
          </div>
        </div>
      </section>

      <section className="bg-surface py-huge">
        <div className="container-cinematic">
          {filteredPackages.length === 0 ? (
            <div className="text-center border border-hairline-light rounded-xl p-10 bg-surface">
              <Search size={40} className="mx-auto mb-4 text-shade-40 opacity-40" />
              <h2 className="font-display text-heading-lg text-text">No packages found</h2>
              <p className="text-body-md text-shade-50 mt-2">Try a different search term.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="btn-accent mt-6 inline-flex"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              <p className="text-body-sm text-shade-50 mb-6">
                Showing {filteredPackages.length} treatment{filteredPackages.length !== 1 ? "s" : ""}
                {searchQuery && <> matching &ldquo;<strong className="text-text">{searchQuery}</strong>&rdquo;</>}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPackages.map((p, i) => (
                  <div key={i} className="bg-surface rounded-xl border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col">
                    <h3 className="font-display text-heading-sm text-text leading-snug mb-3">{p.name}</h3>
                    <p className="text-heading-lg font-display text-accent mb-3">{p.cost}</p>
                    <div className="mt-auto pt-3 border-t border-hairline-light">
                      <div className="flex items-center justify-between">
                        <p className="text-body-sm text-shade-50 flex items-center gap-1.5">
                          <Stethoscope size={14} className="text-accent" />
                          {p.specialty}
                        </p>
                        <span className="text-caption font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          Save {p.savings}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}