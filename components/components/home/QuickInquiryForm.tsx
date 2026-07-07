"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Upload, Phone, User, Mail, FileText, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const countries = [
  "Afghanistan", "Algeria", "Australia", "Bangladesh", "Canada", "China", "Egypt",
  "Ethiopia", "France", "Germany", "Ghana", "India", "Indonesia", "Iraq", "Japan",
  "Jordan", "Kenya", "Kuwait", "Lebanon", "Libya", "Malaysia", "Maldives",
  "Mauritius", "Morocco", "Myanmar", "Nepal", "New Zealand", "Nigeria", "Oman",
  "Pakistan", "Palestine", "Philippines", "Qatar", "Russia", "Rwanda",
  "Saudi Arabia", "Seychelles", "Somalia", "South Africa", "South Korea",
  "Sri Lanka", "Sudan", "Syria", "Tanzania", "Thailand", "Tunisia", "Turkey",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uzbekistan", "Vietnam", "Yemen", "Zimbabwe",
];

export default function QuickInquiryForm() {
  const { contact_phone } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    treatment: "",
    message: "",
    whatsapp: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "Quick Inquiry",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: "International",
          medical_condition: formData.treatment,
          message: formData.message,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", country: "", treatment: "", message: "", whatsapp: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="bg-surface py-huge">
        <div className="container-cinematic max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-12 border border-hairline-light shadow-elevation-1"
          >
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send size={28} className="text-accent" />
            </div>
            <h3 className="font-display text-display-md text">Thank You!</h3>
            <p className="text-body-lg text-shade-50 mt-4">
              Our medical team will review your inquiry and get back to you within 24 hours with a free medical opinion.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface py-12 sm:py-huge relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="container-cinematic relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 sm:gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-heading-xl sm:text-display-md lg:text-display-lg text">
              Get Free Medical Opinion &amp; Cost Estimate
            </h2>
            <p className="text-body-lg text-shade-50 mt-6 leading-relaxed">
              Share your medical reports and our specialist team will provide a detailed treatment plan within 24 hours — completely free.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-shade-50">
                <div className="w-8 h-8 rounded-full bg-surface border border-hairline-light flex items-center justify-center shrink-0 text-accent">
                  <FileText size={16} />
                </div>
                <span className="text-body-md">Free doctor opinion within 24 hours</span>
              </div>
              <div className="flex items-center gap-3 text-shade-50">
                <div className="w-8 h-8 rounded-full bg-surface border border-hairline-light flex items-center justify-center shrink-0 text-accent">
                  <Phone size={16} />
                </div>
                <span className="text-body-md">Personal case manager assigned</span>
              </div>
              <div className="flex items-center gap-3 text-shade-50">
                <div className="w-8 h-8 rounded-full bg-surface border border-hairline-light flex items-center justify-center shrink-0 text-accent">
                  <Upload size={16} />
                </div>
                <span className="text-body-md">Upload reports for accurate cost estimate</span>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-hairline-light">
              <p className="text-sm text-shade-40">Or call us directly:</p>
              <a href={`tel:${contact_phone}`} className="font-display text-heading-xl text-accent hover:text-accent/80 transition-colors mt-2 inline-block">
                {contact_phone}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 sm:p-8 border border-hairline-light shadow-elevation-2">
              <h3 className="font-display text-heading-lg text mb-6">Request Free Consultation</h3>
              <div className="space-y-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-shade-30" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-white border border-hairline-light text placeholder:text-shade-30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-shade-30" />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-white border border-hairline-light text placeholder:text-shade-30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-shade-30" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-white border border-hairline-light text placeholder:text-shade-30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-lg bg-white border border-hairline-light text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all appearance-none"
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="relative">
                    <MessageCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-shade-30" />
                    <input
                      type="tel"
                      placeholder="WhatsApp Number (with country code)"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-white border border-hairline-light text placeholder:text-shade-30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                    />
                  </div>
                </div>
                <select
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-lg bg-white border border-hairline-light text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all appearance-none"
                >
                  <option value="">Select Treatment</option>
                  <option value="Cardiac Surgery">Cardiac Surgery</option>
                  <option value="Knee Replacement">Knee Replacement</option>
                  <option value="Hip Replacement">Hip Replacement</option>
                  <option value="Spine Surgery">Spine Surgery</option>
                  <option value="Liver Transplant">Liver Transplant</option>
                  <option value="Kidney Transplant">Kidney Transplant</option>
                  <option value="Bone Marrow Transplant">Bone Marrow Transplant</option>
                  <option value="Cancer Treatment">Cancer Treatment</option>
                  <option value="IVF Treatment">IVF Treatment</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Other">Other</option>
                </select>
                <textarea
                  rows={3}
                  placeholder="Describe your condition briefly..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-lg bg-white border border-hairline-light text placeholder:text-shade-30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 rounded-lg bg-accent hover:bg-accent/80 text-white font-display text-heading-sm transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-60"
                >
                  {status === "loading" ? "Submitting..." : "Get Free Opinion →"}
                </button>
              </div>
              {status === "error" && (
                <p className="text-red-500 text-caption mt-3 text-center">Something went wrong. Please try again or call us directly.</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
