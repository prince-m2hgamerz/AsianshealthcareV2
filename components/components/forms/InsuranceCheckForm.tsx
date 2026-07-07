"use client";

import { useState } from "react";
import { Shield } from "lucide-react";

interface InsuranceCheckFormProps {
  onClose?: () => void;
}

const insuranceOptions = [
  "AXA Health",
  "Allianz Care",
  "Cigna Global",
  "Bupa Global",
  "Aetna International",
  "Now Health",
  "Other",
];

export default function InsuranceCheckForm({ onClose }: InsuranceCheckFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    country: "",
    phone: "",
    insuranceCompany: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "Insurance",
          name: formData.name,
          email: formData.email || undefined,
          gender: formData.gender || undefined,
          country: formData.country,
          phone: formData.phone,
          insurance_company: formData.insuranceCompany,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-aloe-10 flex items-center justify-center mx-auto mb-4">
          <Shield size={28} className="text-ink" />
        </div>
        <h3 className="font-display text-heading-md text-ink mb-2">Eligibility Check Submitted!</h3>
        <p className="text-body-md text-shade-50">
          We&apos;ll verify your insurance coverage and get back to you within 24 hours.
        </p>
        {onClose && (
          <button onClick={onClose} className="btn-primary mt-6">
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-display text-heading-md text-ink mb-2">Check Insurance Eligibility</h3>
      <p className="text-body-md text-shade-50 mb-4">
        Find out if your insurance covers treatment in India.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name *"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink transition-colors"
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Country *"
          required
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          className="border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
        <input
          type="tel"
          placeholder="Phone Number *"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
      </div>

      <select
        value={formData.insuranceCompany}
        onChange={(e) => setFormData({ ...formData, insuranceCompany: e.target.value })}
        required
        className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink transition-colors"
      >
        <option value="">Select Insurance Company *</option>
        {insuranceOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <div className="border border-dashed border-hairline-light rounded-md p-4 text-center">
        <p className="text-caption text-shade-40">Upload Insurance Card (optional)</p>
        <p className="text-micro text-shade-40 mt-1">PDF, JPG or PNG</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-center disabled:opacity-50"
      >
        {loading ? "Checking..." : "Check Eligibility"}
      </button>
    </form>
  );
}
