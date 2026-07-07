"use client";

import { useState, useRef } from "react";
import { Send, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const countries = [
  "Afghanistan", "Algeria", "Bangladesh", "Cameroon", "Egypt", "Ethiopia",
  "Ghana", "Iraq", "Kazakhstan", "Kenya", "Morocco", "Nigeria",
  "Senegal", "South Africa", "Sudan", "Tanzania", "Uganda", "Uzbekistan",
  "Yemen", "Other",
];

interface InquiryFormProps {
  className?: string;
  buttonText?: string;
  compact?: boolean;
}

export default function InquiryForm({ className = "", buttonText = "Submit Enquiry", compact = false }: InquiryFormProps) {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") payload[key] = value;
    });

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setFormState("success");
      form.reset();
      setFileName("");
    } catch {
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <div className={`bg-[#e8f5e9] border border-[#0a7e3d]/20 rounded-lg p-6 text-center ${className}`}>
        <CheckCircle size={48} className="mx-auto mb-3 text-[#0a7e3d]" />
        <h3 className="text-lg font-semibold text-[#1a1a2e] mb-1">Enquiry Submitted Successfully!</h3>
        <p className="text-sm text-gray-600 mb-4">Our team will contact you within 24 hours.</p>
        <button
          type="button"
          onClick={() => setFormState("idle")}
          className="text-[#0a7e3d] text-sm font-semibold hover:underline"
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {formState === "error" && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          <AlertCircle size={16} />
          <span>Something went wrong. Please try again.</span>
        </div>
      )}

      <div className={compact ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#1a1a2e] mb-1">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full border border-[#e2e8f0] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#0a7e3d] focus:ring-1 focus:ring-[#0a7e3d]/20 transition-colors"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#1a1a2e] mb-1">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full border border-[#e2e8f0] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#0a7e3d] focus:ring-1 focus:ring-[#0a7e3d]/20 transition-colors"
            placeholder="Your email address"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#1a1a2e] mb-1">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full border border-[#e2e8f0] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#0a7e3d] focus:ring-1 focus:ring-[#0a7e3d]/20 transition-colors"
            placeholder="Phone with country code"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-[#1a1a2e] mb-1">Country *</label>
          <select
            id="country"
            name="country"
            required
            className="w-full border border-[#e2e8f0] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#0a7e3d] focus:ring-1 focus:ring-[#0a7e3d]/20 transition-colors bg-white"
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="treatment" className="block text-sm font-medium text-[#1a1a2e] mb-1">Treatment / Requirement *</label>
        <textarea
          id="treatment"
          name="treatment"
          required
          rows={3}
          className="w-full border border-[#e2e8f0] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#0a7e3d] focus:ring-1 focus:ring-[#0a7e3d]/20 transition-colors resize-none"
          placeholder="Describe your medical requirement..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Upload Medical Reports</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#e2e8f0] rounded-md p-4 text-center cursor-pointer hover:border-[#0a7e3d] hover:bg-[#e8f5e9]/50 transition-colors"
        >
          <Upload size={24} className="mx-auto mb-1 text-gray-400" />
          <p className="text-sm text-gray-500">{fileName || "Click to upload reports (PDF, JPG, PNG)"}</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="reports"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
        />
      </div>

      <button
        type="submit"
        disabled={formState === "submitting"}
        className="w-full bg-[#0a7e3d] text-white rounded-md px-4 py-3 font-semibold text-sm hover:bg-[#086b33] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {formState === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={16} />
            {buttonText}
          </>
        )}
      </button>
    </form>
  );
}
