"use client";

import { useMemo, useState } from "react";
import { Send, Stethoscope, Building2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const doctorParam = searchParams.get("doctor");
  const hospitalParam = searchParams.get("hospital");
  const specialtyParam = searchParams.get("specialty");

  const hasDoctorInfo = !!(doctorParam || hospitalParam || specialtyParam);

  const initialTreatment = useMemo(() => {
    if (!hasDoctorInfo) return "";
    const parts: string[] = [];
    if (doctorParam) parts.push(`Consultation for ${doctorParam}`);
    if (specialtyParam) parts.push(specialtyParam);
    return parts.join(" - ");
  }, [doctorParam, specialtyParam, hasDoctorInfo]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    treatment: initialTreatment,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const messageParts: string[] = [];
      if (doctorParam) messageParts.push(`Doctor: ${doctorParam}`);
      if (hospitalParam) messageParts.push(`Hospital: ${hospitalParam}`);
      if (specialtyParam) messageParts.push(`Specialty: ${specialtyParam}`);
      if (formData.treatment) messageParts.push(`Treatment: ${formData.treatment}`);
      if (formData.message) messageParts.push(formData.message);

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "Contact",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          message: messageParts.join("\n"),
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
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-aloe-10 flex items-center justify-center mx-auto mb-4">
          <Send size={28} className="text-ink" />
        </div>
        <h3 className="font-display text-heading-xl text-ink mb-2">Thank You!</h3>
        <p className="text-body-lg text-shade-50">
          We&apos;ve received your{doctorParam ? ` enquiry for ${doctorParam}` : ""}. Our team will reach out shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {hasDoctorInfo && (
        <div className="rounded-lg border border-link-mint/30 bg-aloe-5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <p className="text-caption font-semibold text-ink uppercase tracking-wider text-[11px]">You are enquiring about</p>
              {doctorParam && (
                <p className="text-body-md text-ink flex items-center gap-2">
                  <Stethoscope size={15} className="shrink-0 text-link-mint" />
                  {doctorParam}
                </p>
              )}
              {specialtyParam && (
                <p className="text-caption text-shade-50 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-link-mint shrink-0" />
                  {specialtyParam}
                </p>
              )}
              {hospitalParam && (
                <p className="text-caption text-shade-50 flex items-center gap-2">
                  <Building2 size={13} className="shrink-0 text-shade-40" />
                  {hospitalParam}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <input
            type="text"
            placeholder="Your Name *"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone Number *"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Your Country *"
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
          />
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Treatment Needed"
          value={formData.treatment}
          onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
          className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
      </div>
      <div>
        <textarea
          placeholder="Your Message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-center disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
