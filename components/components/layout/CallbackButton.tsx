"use client";

import { useState } from "react";
import { Phone, X } from "lucide-react";
import CallbackForm from "@/components/forms/CallbackForm";
import { motion, AnimatePresence } from "framer-motion";

export default function CallbackButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 bg-ink text-on-primary rounded-pill px-4 sm:px-5 py-3 shadow-lg hover:bg-shade-70 transition-colors text-sm"
        aria-label="Request a call back"
      >
        <Phone size={16} />
        <span className="hidden sm:inline">Request Call Back</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="callback-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-canvas-light rounded-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-shade-50 hover:text-ink"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <CallbackForm onSuccess={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
