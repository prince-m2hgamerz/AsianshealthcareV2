"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-[800px] bg-white border border-border rounded-lg shadow-card-hover p-5"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="hidden sm:flex w-10 h-10 rounded-full bg-accent-light items-center justify-center shrink-0 mt-0.5">
                <Cookie size={18} className="text-accent" />
              </div>
              <div className="text-body-sm sm:text-body-md text-text-muted leading-relaxed">
                We use cookies to enhance your browsing experience and analyze our traffic. By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies.{" "}
                <Link href="/privacy-policy" className="underline text-accent hover:text-accent/80 transition-colors font-medium">Learn More</Link>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <button onClick={() => setVisible(false)} className="flex-1 sm:flex-none text-center text-body-sm sm:text-body-md text-primary hover:bg-primary-tint px-4 py-2.5 sm:py-2 rounded-md border border-primary transition-colors">
                Decline
              </button>
              <button onClick={accept} className="flex-1 sm:flex-none text-center text-body-sm sm:text-body-md bg-accent text-white hover:bg-accent/90 px-5 py-2.5 sm:py-2 rounded-md font-medium shadow-[0_4px_12px_rgba(201,150,58,0.35)] transition-colors">
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
