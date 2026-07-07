"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function FloatingButtons() {
  const { whatsapp_number, contact_phone, whatsapp_message_default } = useSiteSettings();
  const waNumber = whatsapp_number?.replace(/[^0-9]/g, "") || "918285068544";
  const phoneNumber = contact_phone || "+918285068544";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(whatsapp_message_default)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      <a
        href={`tel:${phoneNumber}`}
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-ink text-on-primary shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group relative"
        aria-label="Call us"
      >
        <Phone size={22} className="sm:size-[28]" />
        <span className="absolute right-full mr-3 bg-ink text-on-primary text-micro rounded-pill px-3 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Call {phoneNumber}
        </span>
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group relative animate-[pulse_3s_ease-in-out_infinite]"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={22} className="sm:size-[28]" />
        <span className="absolute right-full mr-3 bg-[#25D366] text-white text-micro rounded-pill px-3 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
