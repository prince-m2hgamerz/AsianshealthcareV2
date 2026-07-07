"use client";

import { useState } from "react";
import { Stethoscope } from "lucide-react";

interface DoctorOpinionFormProps {
  onClose?: () => void;
}

export default function DoctorOpinionForm({ onClose }: DoctorOpinionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    country: "",
    phone: "",
    email: "",
    medicalCondition: "",
    doctorPreference: "",
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
          form_type: "Doctor Opinion",
          name: formData.name,
          age: formData.age ? Number(formData.age) : undefined,
          gender: formData.gender || undefined,
          country: formData.country,
          phone: formData.phone,
          email: formData.email || undefined,
          medical_condition: formData.medicalCondition,
          doctor_preference: formData.doctorPreference || undefined,
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
          <Stethoscope size={28} className="text-ink" />
        </div>
        <h3 className="font-display text-heading-md text-ink mb-2">Request Submitted!</h3>
        <p className="text-body-md text-shade-50">
          A doctor will review your case and provide an opinion within 48 hours.
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
      <h3 className="font-display text-heading-md text-ink mb-2">Receive Doctor Opinion</h3>
      <p className="text-body-md text-shade-50 mb-4">
        Get a free medical opinion from our specialist doctors.
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
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
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
          placeholder="Phone with Country Code *"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
      </div>

      <textarea
        placeholder="Describe your medical condition *"
        required
        rows={3}
        value={formData.medicalCondition}
        onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })}
        className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors resize-none"
      />

      <input
        type="text"
        placeholder="Doctor Preference (optional)"
        value={formData.doctorPreference}
        onChange={(e) => setFormData({ ...formData, doctorPreference: e.target.value })}
        className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
      />

      <div className="border border-dashed border-hairline-light rounded-md p-4 text-center">
        <p className="text-caption text-shade-40">Upload medical reports (optional)</p>
        <p className="text-micro text-shade-40 mt-1">PDF, JPG or PNG</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-center disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Get Doctor Opinion"}
      </button>
    </form>
  );
}
