"use client";

import { Phone, Clock } from "lucide-react";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function EmergencyBanner() {
  const { contact_phone } = useSiteSettings();
  return (
    <div className="bg-surface border-b border-hairline-light py-2 px-4 relative z-40">
      <div className="container-cinematic flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-5 text-xs sm:text-sm">
          <a href={`tel:${contact_phone}`} className="inline-flex items-center gap-1.5 text-shade-60 hover:text-accent transition-colors">
            <Phone size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="font-semibold">{contact_phone}</span>
          </a>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-shade-40">
            <Clock size={13} />
            <span>24/7 Helpdesk</span>
          </span>
        </div>
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-1.5 bg-accent/20 hover:bg-accent/30 border border-accent/40 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all hover:-translate-y-0.5 whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-pulse" />
          Get Doctor Opinion
        </Link>
      </div>
    </div>
  );
}
