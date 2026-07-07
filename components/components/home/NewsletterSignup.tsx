"use client";

import { useState, FormEvent } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface py-16 sm:py-20"
      >
        <div className="container-cinematic text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-5">
            <Check size={32} className="text-accent" />
          </div>
          <h2 className="font-display text-heading-xl sm:text-display-md text mb-2">You&apos;re subscribed!</h2>
          <p className="text-body-lg text-shade-50">We&apos;ll send you the latest guides and tips.</p>
        </div>
      </motion.section>
    );
  }

  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="container-cinematic max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-5">
          <Mail size={32} className="text-accent" />
        </div>
        <h2 className="font-display text-heading-xl sm:text-display-md mb-2 text">Get Free Medical Tourism Guides</h2>
        <p className="text-body-lg text-shade-50 mb-8 max-w-lg mx-auto">Subscribe for treatment cost guides, visa tips, and patient stories delivered to your inbox.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-shade-40 pointer-events-none" />
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 sm:py-3 rounded-lg text-body-md text bg-white border border-hairline-light focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent transition-shadow"
            />
          </div>
          <button type="submit" disabled={status === "loading"} className="btn-primary whitespace-nowrap flex items-center justify-center gap-2 !py-3.5 sm:!py-3">
            {status === "loading" ? "Sending..." : <>
              Subscribe <ArrowRight size={16} />
            </>}
          </button>
        </form>
        {status === "error" && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-caption mt-3">
            Something went wrong. Please try again.
          </motion.p>
        )}
        <p className="text-micro text-shade-40 mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
