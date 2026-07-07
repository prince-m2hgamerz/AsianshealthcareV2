"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

interface CallbackFormProps {
  onSuccess?: () => void;
}

export default function CallbackForm({ onSuccess }: CallbackFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    bestTime: "",
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
          form_type: "Callback",
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone,
          country: formData.country,
          message: formData.bestTime ? `Best time to call: ${formData.bestTime}` : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
      onSuccess?.();
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-aloe-10 flex items-center justify-center mx-auto mb-4">
          <Phone size={28} className="text-ink" />
        </div>
        <h3 className="font-display text-heading-md text-ink mb-2">We&apos;ll Call You Back!</h3>
        <p className="text-body-md text-shade-50">
          Our team will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 id="callback-title" className="font-display text-heading-md text-ink mb-4">Request a Call Back</h3>
      <div>
        <input
          type="text"
          placeholder="Your Name *"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
      </div>
      <div>
        <input
          type="tel"
          placeholder="Phone Number *"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Your Country *"
          required
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
      </div>
      <div>
        <select
          value={formData.bestTime}
          onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
          className="w-full border border-hairline-light rounded-md px-3 py-2.5 text-body-md text-ink focus:outline-none focus:border-ink transition-colors"
        >
          <option value="">Best time to call</option>
          <option value="morning">Morning (9AM-12PM)</option>
          <option value="afternoon">Afternoon (12PM-5PM)</option>
          <option value="evening">Evening (5PM-8PM)</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-center disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Request Call Back"}
      </button>
    </form>
  );
}
